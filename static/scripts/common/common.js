function formatNum(num) //将数字转换成三位逗号分隔的样式
{
	if(!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)){return num;}
	var a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
	var re = new RegExp().compile("(\\d)(\\d{3})(,|$)");
	while(re.test(b)) b = b.replace(re, "$1,$2$3");
	return a +""+ b +""+ c;
} 

//将NULL转为空
function converNullValue(value){
	if(value==null){
		return "";
	}
 	return value;
}

function toLocaDate(srcDate){
	var d=new Date(srcDate);
	var s= "";     
	s += d.getYear()+ "-";                        
	s += (d.getMonth() + 1) + "-";            
	s += d.getDate() ;                 
	return s;
}

//清除字符串首尾空白
String.prototype.trim = function()
{
   var reExtraSpace = /^\s*(.*?)\s+$/;
   return this.replace(reExtraSpace, "$1");
}

//高效连接字符串
function StringBuffer(){
	this._strings_=new Array;
}

StringBuffer.prototype.append=function(str){
	this._strings_.push(str);
}

StringBuffer.prototype.toString=function(){
	return this._strings_.join("");
}

//比较时间大小
function compareTime(beginTime,endTime){
	
	var flg = true;
	if (new Date(beginTime.replace(/-/g,"/")) > new Date(endTime.replace(/-/g,"/"))){
		
		flg =  false;
	}

	return flg;	
}

//检查输入的是否整数
function checkIsInteger(obj){
	
	if (obj != null && obj.value != ""){
		
		if(isNaN(obj.value) || obj.value.indexOf('.')>-1) {
			alert("请输入整数");
			obj.value = "";

		}
	}
}

function checkIsNull(){
	
	var flag = true;
	$(".required").each(function(){
		if($.trim($(this).val())==""){
			alert($(this).attr("errTip"));
			flag = false;
			return false;
		}
	});
	return flag;
}
