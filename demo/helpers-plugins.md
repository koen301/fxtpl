Fxtpl常用辅助方法汇总
=====

### cut

截取字符串，超出部分用“...”代替
第一个参数为截取的长度（一个中文字符长度为2）

JS:

	/** 
	 * 截取中英文字符串
	 * @param str 字符串
	 * @param limitLen 限制的长度(长度以英文为准)
	 * @return String
	 * @author koen301
	 */
	Fxtpl.helpers.cut = function(str, limitLen){
		var s = String(str).replace(/([^\x00-\xff])/g,'\f$1');
		return limitLen >= s.length ? str : s.substr(0, limitLen-3).replace(/\f/g, '')+'...';
	}

HTML：
	
	<div><!--[$title|cut 30]--></div>

### dateFormat

日期格式化
第一个参数控制日期格式
如果传递的date参数是空的，将使用当前时间作为默认时间

JS:

	/** 
	 * 对日期进行格式化
	 * @param date 要格式化的日期 
	 * @param format 进行格式化的模式字符串
	 *     支持的模式字母有： 
	 *     Y:年, 
	 *     M:年中的月份(1-12), 
	 *     D:月份中的天(1-31), 
	 *     h:小时(0-23), 
	 *     m:分(0-59), 
	 *     s:秒(0-59), 
	 *     S:毫秒(0-999),
	 *     q:季度(1-4)
	 * @return String
	 * @author yanis.wang@gmail.com
	 */
	Fxtpl.helpers.dateFormat = function(date, format){
		if(!date){
	        format = date;
	        date = new Date();
	    }
	    var map = {
	        "M": date.getMonth() + 1, //月份 
	        "D": date.getDate(), //日 
	        "h": date.getHours(), //小时 
	        "m": date.getMinutes(), //分 
	        "s": date.getSeconds(), //秒 
	        "q": Math.floor((date.getMonth() + 3) / 3), //季度 
	        "S": date.getMilliseconds() //毫秒 
	    };
	    format = format.replace(/([YMDhmsqS])+/g, function(all, t){
	        var v = map[t];
	        if(v !== undefined){
	            if(all.length > 1){
	                v = '0' + v;
	                v = v.substr(v.length-2);
	            }
	            return v;
	        }
	        else if(t === 'Y'){
	            return (date.getFullYear() + '').substr(4 - all.length);
	        }
	        return all;
	    });
	    return format;
	}

HTML：
	
	<div><!--[$date|dateFormat 'YYYY年MM月DD日 hh时mm分ss秒']--></div>

