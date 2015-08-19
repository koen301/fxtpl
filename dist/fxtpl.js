/*!
 * fxtpl.js - fast & sexy template engine with JavaScript
 * https://github.com/koen301/fxtpl
 *
 * Copyright 2014, fanxing.com
 * Released under the MIT license
 * Version: 1.0.2
 * 
 * Date: 2014-07-03
 */
;(function(){
  //Fxtpl命名空间
  var Fxtpl = {
    render : function(id, data, options){//渲染模板
      data = data || this.data;
      var elm = document.getElementById(id), fn, html;
      if(elm){
        if(id in this.cache){
          fn = this.cache[id];
        }else{
          fn = this.cache[id] = this.compile(elm.innerHTML, '', options);
        }
        try{
          html = fn(data);
        }catch(e){
          html = Fxtpl.error(e, '#'+ id, 'Render');
        }
        if(elm.nodeName.toUpperCase() !== 'SCRIPT'){
          html = html.replace(/<[^>]+>/g, function(a){
            return a.replace(/\btpl:/ig,'');//替换tpl虚构标签
          });
          try{
            elm.innerHTML = html;
          }catch(e){// IE6-IE9中某些标签的innerHTML只读而不能设值，如table、tbody、tr等，直接使用jQuery的html方法
            window.$ && $(elm).html(html);
          }
          elm.style.visibility = 'visible';
        }
        return html;
      }else{
        hasConsole && console.warn('Fxtpl cannot find \''+ id +'\'');
      }
    },
    compile : function(str, data, options){//编译字符串
      var rep = this.__proto__?
        ["var s='';", "s+='", "';", "'+(", ")+'", "return s;"]:
        ["var s=[];", "s.push('", "');", "',", ",'", "return s.join('');"];
      var o = options || {};
      var _this = this;
      var _left = o.leftTag || this.config.leftTag;
      var _right = o.rightTag || this.config.rightTag;
      var isSmartyMode = /<!--/.test(_left);//是否类Smarty渲染模式（直接渲染模式）
      if(isSmartyMode){
        var _l = _left.replace('<','&lt;');
        var _r = _right.replace('>','&gt;');
        str = str.split(_l).join(_left).split(_r).join(_right);
      }
      var escape = o.escape || this.config.escape;
      var varString = [];
      var fnBody = rep[0] + rep[1] +
        str
        .replace(/[\r\t\n]/g, "")
        .split(_left).join("\t")
        .split(_right).join("\r")
        .replace(/((^|\r)([^\t]*))/g, function(a,b,c,d){//html处理
          return c + d.replace(/('|\\)/g, '\\$1');
        })
        .replace(/(\t)(.*?)(\r)/g, function(a,b,c){//code处理
          if(isSmartyMode){
            //类Smarty渲染模式需要的代码转义
            c = c.replace(/&amp;/g,'&')
            .replace(/&lt;/g,'<')
            .replace(/&gt;/g,'>');
          }
          return _this.parsing(c, varString, rep, escape);
        }) +
        rep[2] + rep[5];
      fnBody = varString.join('') + fnBody;
      if(o.debug && hasConsole){
        console.log('Template HTML:' + str);
        console.log('Template Render:\nfunction(data){' + fnBody + '}');
      }
      try{
        var fn = new Function("data", fnBody);
        return data? fn(data): fn;
      }catch(e){
        var eMsg = Fxtpl.error(e, str, 'Compile');
        return function(){
          return eMsg;
        };
      }
    },
    parsing : function(code, varString, rep, escape){//编译语法
      var codeArr = code.replace(/^\s*|\s*$/g,'').replace(/\s{2,}/g,' ').split(' ');//处理多余空格后分组
      var varArr = /\$(\w+)/g.exec(code);
      if(varArr && !varString[varArr[1]]){//储存变量
        varString.push('var $',varArr[1],'=data.',varArr[1],';');
        varString[varArr[1]] = true;
      }
      switch(codeArr[0]){
        case 'if':
          return rep[2] + 'if('+ code.slice(3) +'){' + rep[1];
        case 'else':
          return rep[2] + '}else{' + rep[1];
        case 'elseif':
          return rep[2] + '}else if('+ code.slice(7) +'){' + rep[1];
        case '/if':
          return rep[2] + '}' + rep[1];
        case 'each':
          var e_o = codeArr[1];
          var e_p = codeArr[3] || '$item';
          var e_i = (codeArr[2] === 'as'? codeArr[4]: codeArr[2]) || '$index';
          return rep[2] + 'Fxtpl.each('+ e_o +',function('+ e_p +','+ e_i +'){' + rep[1];
        case '/each':
          return rep[2] + '});' + rep[1];
        case 'include':
          return rep[3] + 'Fxtpl.render('+ codeArr.slice(1).join('') +')' + rep[4];
        default://输出变量
          if(/[^|]\|[^|]/.test(code)){//helpers
            code = Fxtpl.filter(code);
          }
          return rep[3] + (escape?'Fxtpl.escape(String('+ code +'))' : code) + rep[4];
      }
    },
    filter: function(code){
      var arr = code.split('|');
      var str = arr[0];
      var len = arr.length;
      for(var i = 1; i < len; i++){
        var fnArr = arr[i].replace(/^\s+/, '').split(' ');
        var fnName = fnArr.shift();
        var args = fnArr.join(' ');
        args = args? ', ' + args : args;
        str = 'Fxtpl.helpers.' + fnName + '(' + str + args + ')';
      }
      return str;
    },
    escape : function(str){//HTML转义
      return str
          .replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;')
          .replace(/"/g,'&quot;')
          .replace(/'/g,'&#39;');
    },
    each : function(data, callback){//遍历对象
      if (({}).toString.call(data) === '[object Array]') {
          for (var i = 0, len = data.length; i < len; i++) {
              callback.call(data[i], data[i], i);
          }
      } else {
          for (var p in data) {
              callback.call(data[p], data[p], p);
          }
      }
    },
    helpers: {
      escape: function(str){
        return Fxtpl.escape(String(str));
      }
    },
    error: function(e, id, type){
      var pos = id.length > 100? id.slice(0, 100)+ '...': id;
      var eMsg = 'Fxtpl '+ type +' Error: ' + e.message + ' in \'' + pos +'\'';
      hasConsole && console.error(eMsg);
      return eMsg;
    },
    cache : {},//模板函数缓存
    data : {},//模板全局数据缓存
    config: {//模板全局配置
      leftTag : '<!--[',//语法左分隔符
      rightTag : ']-->',//语法左右隔符
      escape : false//模板输出的变量是否HTML转义
    }
  };
  //浏览器调式判断
  var hasConsole = !!window.console;
  //输出全局变量
  window.Fxtpl = Fxtpl;
})();
