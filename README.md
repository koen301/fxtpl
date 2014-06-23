Fxtpl v1.0 繁星前端模板引擎
=====

极速，简洁，高效，轻量级，直接在html中嵌入模板

### 特点

Fxtpl可以直接在html中嵌入模板，无需编写script标签模板再innerHTML插入等繁琐操作

Fxtpl语法模仿Smarty，却比Smarty更简单优雅，更适合前端思维

Fxtpl有类似Smarty的单页面数据共享渲染模式，也有前端模板特有的闭包数据渲染模式

Fxtpl有自己的模板变量域名空间（类似PHP中的美元变量），无需依靠沙箱，模板环境和外部JS环境可以安全互访，模板的自由度和灵活性大大提升（市面流行的前端模板一般是沙箱牢房模式，应用灵活性大打折扣）

### 性能

Fxtpl的性能追求极致，无论在IE中还是Chrome等现代浏览器中，Fxtpl都表现优越

[详细性能对比测试>> ](http://koen301.github.io/fxtpl/test/speed.html)

### 体积

Fxtpl在体积上也追求极致，一共100多行代码，1.6KB(gzip)

[体积对比>> ](http://koen301.github.io/fxtpl/test/size.html)

### 基本功能

渲染、编译、模板缓存、数据缓存、HTML转义、自定义分隔符、调试模式、变量调节器（helpers）、include语句等

### 浏览器支持

IE6+ / Chrome / Firefox 等现代浏览器

### 下载

* [fxtpl.min.js (压缩)](http://koen301.github.io/fxtpl/fxtpl.min.js)
* [fxtpl.js (无压缩)](http://koen301.github.io/fxtpl/fxtpl.js)
* [fxtpl.plus.js (Plus版本，额外支持Ajax加载/渲染外部文件)](http://koen301.github.io/fxtpl/fxtpl.plus.js)

## Fxtpl 快速上手

### 渲染HTML

#### html:

	<div id="myTemplate">
		<p>Hello, <!--[$name]--></p>
	</div>

#### js:

	var data = {
		name: 'Fxtpl前端模板引擎'
	};
	Fxtpl.render('myTemplate', data);

[查看演示>> ](http://koen301.github.io/fxtpl/demo/quickstart-html.html)

### 编译JS字符串

#### js:

	var title = '#音乐十年# 我在现场投票给了{{$starName}}，TA当前排名第{{$rank}}位共{{$votes}}票。';
	var data = {
		starName: '邓紫棋',
		rank: 1,
		votes: 128790
	};
	title = Fxtpl.compile(title, data, {leftTag: '{{', rightTag: '}}'});
	
[查看演示>> ](http://koen301.github.io/fxtpl/demo/quickstart-string.html)

## Fxtpl 语法

### 1、输出变量/表达式

Fxtpl的变量和Smarty模板类似，模板域变量以``$``开头。同时，为了最大兼容浏览器的预渲染，默认左右分隔符为``<--[``和``]-->``

	>> 直接输出模板变量
	<div>歌手： <!--[$starName]--></div>

	>> 输出变量的子项
	<div>用户ID： <!--[$userInfo.userId]--></div>

	>> 应用模板辅助方法（变量调节器）“escape”转义字符串
	<div>您的留言： <!--[$notes|escape]--></div>

	>> 应用JS原生“||”语法，设置“$votes”的默认值为“暂无”
	<div>您的票数：<!--[$votes||'暂无']--></div>

	>> 应用JS原生字符串方法replace
	<div>时间：<!--[$time.replace('/', '-')]--></div>

	>> 应用JS三元运算，输出“成功”或“失败”
	<div>晋级：<!--[$status == 1? '成功': '失败']--></div>

	>> 应用外部jQuery的$.trim方法
	<div>评论：<!--[$.trim($comment)]--></div>

[查看演示>> ](http://koen301.github.io/fxtpl/demo/syntax-base.html)

### 2、if、if...else、if...elseif...，可多重嵌套

	>> if
	<!--[if $status == '1']-->
		<div>直播中...</div>
    <!--[/if]-->

    >> if...else
	<!--[if $status == '1']-->
    	<div>直播中...</div>
    <!--[else]-->
    	<div>休息中...</div>
	<!--[/if]-->

	>> if...elseif
	<!--[if $status == '1']-->
    	<div>直播中...</div>
    <!--[elseif $status == '2']-->
    	<div>录像中...</div>
	<!--[/if]-->

[查看演示>> ](http://koen301.github.io/fxtpl/demo/syntax-if.html)

### 3、each...[index]、each...as...[index]

	>> each遍历，默认带两个参数：$index(索引)、$item(值)，同时内部this指针指向$item
	<ul>
    <!--[each $userList]-->
        <li>索引：<!--[$index]-->，名称：<!--[$item]--></li>
    <!--[/each]-->
    </ul>

    >> each...as...遍历，自定义$index、$item参数，可省略“$”前缀（为保持模板变量一致性，不建议省略）
	<ul>
    <!--[each $userList as $name $i]-->
        <li>索引：<!--[$i]-->，名称：<!--[$name]--></li>
    <!--[/each]-->
    </ul>

[查看演示>> ](http://koen301.github.io/fxtpl/demo/syntax-each.html)

### 4、include id, [data]（引入子模板）

#### 引入同页面的字模板

	>> 引入id为“msgContent”的子模板，并用data渲染（可省）
    <div id="box">
    	<p>您好，收到新消息： </p>
    	<!--[include 'msgContent', data]-->
    </div>

[查看演示>> ](http://koen301.github.io/fxtpl/demo/syntax-include.html)

#### 引入外部页面的子模板（同步引入）

注：仅 fxtpl.plus.js 版本支持，且需依赖jQeruy或Zepto，内部用“$.ajax”实现

	>> 引入外部子模板文件“msgContent.html”，并用data渲染（可省）
    <div id="box">
    	<p>您好，收到新消息： </p>
    	<!--[include 'msgContent.html', data]-->
    </div>

[查看演示>> ](http://koen301.github.io/fxtpl/demo/syntax-includeAjax.html)

同时，Plus版本的Fxtpl.render方法也支持渲染外部文件，这样可以实时加载外部的模板（例如根据用户点击后加载）

	//渲染外部文件
	var html = Fxtpl.render('/static/msg/msgContent.html', data);
	//渲染后的html插入当前页面
	$('#box').html(html);

(注：更多功能欢迎在[Issues](https://github.com/koen301/fxtpl/issues)提出建议)

## Fxtpl API

### 1、Fxtpl.render(id, [data], [options])

渲染模板

参数 | 类型 | 默认值| 说明
------------ | ------------- | ------------ | ------------
id | String | 无 | 模板的id，如果其为script标签，即传统前端模板渲染模式；如果为非script标签，即类Smarty直接渲染模式（[demo](http://koen301.github.io/fxtpl/demo/render-id.html)）
data | JSON | Fxtpl.data | 模板的数据，默认渲染Fxtpl.data域下的数据，即数据共享渲染模式；如果传入data即闭包数据（不共享）模式（[demo](http://koen301.github.io/fxtpl/demo/render-data.html)）
options | JSON | options | 渲染模板的额外设置，参见下面“options 设置”

options 设置（可选）

字段 | 类型 | 默认值| 说明
------------ | ------------- | ------------ | ------------
debug | Boolean | ``false`` | 是否开启debug模式，参见[Fxtpl 容错和调试](# Fxtpl 容错和调试)
escape | Boolean | ``false`` | 是否转义输出HTML字符
leftTag | String | ``"<--["`` | 左语法分隔符
rightTag | String | ``"]-->"`` | 右语法分隔符

Returns: HTML（渲染后的HTML字符串）

[类Smarty渲染模式需要注意的事项及建议>>](https://github.com/koen301/fxtpl/wiki/%E7%B1%BBSmarty%E6%B8%B2%E6%9F%93%E6%A8%A1%E5%BC%8F%E9%9C%80%E8%A6%81%E6%B3%A8%E6%84%8F%E7%9A%84%E4%BA%8B%E9%A1%B9%E5%8F%8A%E5%BB%BA%E8%AE%AE)

### 2、Fxtpl.compile(str, [data], [options])

编译字符串

参数 | 类型 | 默认值| 说明
------------ | ------------- | ------------ | ------------
str | String | 无 | 编译的字符串
data | JSON | 无 | 编译字符串用到的数据，如果省略，则返回渲染函数，否则返回渲染后的字符串（[demo](http://koen301.github.io/fxtpl/demo/compile.html)）
options | JSON | options | 编译字符串的额外设置，同``Fxtpl.render``方法中的“options 设置”

Returns: Function | String（渲染函数或渲染后的字符串）   

### 3、Fxtpl.config

模板的全局设置，包含下面的字段

字段 | 类型 | 默认值| 说明
------------ | ------------- | ------------ | ------------
escape | Boolean | ``false`` | 是否转义输出HTML字符
leftTag | String | ``"<--["`` | 左语法分隔符
rightTag | String | ``"]-->"`` | 右语法分隔符

除了无“debug”的全局设置，和上面方法中的“options 设置”基本相同，优先级为：方法中的“options 设置” > 全局设置

下面展示如何把模板的全局左右分隔符，改为``{{``和``}}``：

	Fxtpl.config.leftTag = '{{';//定义新的左分隔符
	Fxtpl.config.rightTag = '}}';//定义新的右分隔符
	
	var data = {
	  name: "Joe"
	};
	var output = Fxtpl.compile("My name is {{$name}}", data);//直接使用新的格式

[查看演示>> ](http://koen301.github.io/fxtpl/demo/config-tag.html)

### 4、Fxtpl.helpers

Fxtpl模板的辅助方法集合（变量调节器）

Fxtpl.helpers是一个对象，你可以认为它是模板辅助方法的原型``prototype``，默认只有“escape”方法   

	<div>您的留言：<!--[$notes|escape]--></div>

你可以通过类似扩展原型的方式，扩展模板的辅助方法

***需要注意***

* 方法的第一个参数为模板传递的值/字符串
* 方法必须有返回值，否则模板输出为“undefined”

例如扩展一个trim方法和intercept方法

	//去除字符串前后空格
	Fxtpl.helpers.trim = function(value){
		return value.replace(/^\s*|\s*$/g,'');
	};

	//根据length截取字符串，多出的用appendStr代替
	Fxtpl.helpers.intercept = function(value, length, appendStr){
		return someString;
	};

在模板中使用
	
	>> 使用trim辅助方法
	<!--[$title|trim]-->

	>> 使用intercept辅助方法，空格后使用参数（从方法的第二个参数开始），多个参数用“,”分隔
	<!--[$title|intercept 10,'...']-->

	>> 同时使用trim、intercept辅助方法
	<!--[$title|trim|intercept 10,'...']-->

[查看演示>> ](http://koen301.github.io/fxtpl/demo/helpers.html)

附：[Fxtpl常用辅助方法插件汇总>> ](https://github.com/koen301/fxtpl/blob/gh-pages/demo/helpers-plugins.md)

### 5、Fxtpl.data

模板数据默认存放的域，如果Fxtpl.render方法不传data参数，即从此域读取

此域下所有一级变量在模板下均带“$”前缀，假如Fxtpl.data为

	{
		page: 102,
		user: {
			name: 'Jack'
		}
	}

则在模板中对应为``$page``和``$user.name``

### 6、Fxtpl.cache

模板渲染函数缓存区，以模板id为索引

只缓存Fxtpl.render生成的渲染函数，不缓存Fxtpl.compile生成的渲染函数

下面演示手动缓存Fxtpl.compile生成的渲染函数

	var renderFun = Fxtpl.compile('my name is {{$name}}');//用renderFun变量缓存渲染函数
	var data = {
		list: [
			{name: 'Jack'},
			{name: 'Lily'},
			{name: 'Koen'}
		]
	};
	for(var i = 0; i < data.list.length; i++){
		console.log(renderFun(data.list[i]));//打印渲染结果
	}

	//my name is Jack
	//my name is Lily
	//my name is Koen

## Fxtpl 容错和调式

当模板渲染/编译发生错误时，Fxtpl会在控制台和页面同时输出错误信息和类型（Render或Compile），不影响后面代码的继续执行

同时Fxtpl提供debug调试模式（在“options 设置”中打开），在控制台输出编译前的字符串/HTML和渲染函数，方便定位错误

[查看演示>> ](http://koen301.github.io/fxtpl/demo/debug.html)

## Fxtpl 注释

Fxtpl只支持HTML默认的``<!-- -->``注释格式，不创造任何注释格式。
