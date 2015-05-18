//普通分页
function showPages(p_name,p_placeId,p_pageNo,p_pageSize,p_pageCount,p_totalCount,p_func) { //初始化属性
	this.name = p_name;      							   //对象名称
	this.place=p_placeId								   //对像所在位置ID
	this.pageNo = p_pageNo;         			           //当前页数
	this.pageCount = p_pageCount;    			           //总页数
	this.totalCount=p_totalCount;						   //总记录数
	this.pageSize=p_pageSize;							   //每页显示记录数
	this.func=p_func;
	
	if(typeof showPages._initialized=="undefined"){
		showPages.prototype.createHtml=function(){
			var strHtml=new StringBuffer();
			var prevPage = this.pageNo - 1;
			var nextPage = this.pageNo + 1;
			strHtml.append("页码: "+this.pageNo+"/"+this.pageCount+"&nbsp;&nbsp;共"+this.totalCount+"条 ");
			if(this.pageCount>1){
				if(prevPage<1){
					//strHtml.append("<a href='#'>首页</a>&nbsp;&nbsp;");
					//strHtml.append("<a href='#'>上一页</a>&nbsp;&nbsp;");
				}else{
					strHtml.append("<a href='#' onclick='"+this.name+".toPage(1)'>首页</a>&nbsp;&nbsp;");
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+prevPage+")'>上一页</a>&nbsp;&nbsp;");
				}
				/*for(var i=(this.pageNo-1)*this.pageSize+1;i<=this.pageNo*this.pageSize && i<=this.pageSize;i++){
					strHtml.append("<a href='#' onclick='toPage("+i+")'>["+i+"]</a>&nbsp;&nbsp;");
				}*/
				if(nextPage>this.pageCount){
					//strHtml.append("<a href='#'>下一页</a>&nbsp;&nbsp;");
					//strHtml.append("<a href='#'>末页</a>&nbsp;&nbsp;");
				}else{
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+nextPage+")'>下一页</a>&nbsp;&nbsp;");
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+this.pageCount+")'>末页</a>&nbsp;&nbsp;");
				}
				var chkSelect;
				strHtml.append("<select name='toPage' onchange='"+this.name+".toPage(this.selectedIndex+1)'>");
				for (var i = 1; i <= this.pageCount; i++) {
					if (this.pageNo == i) chkSelect=' selected="selected"';
					else chkSelect='';
					strHtml.append('<option value="' + i + '"' + chkSelect + '>' + i + '</option>');
				}
				strHtml.append('</select>');
			}
			return strHtml.toString();
		}

		showPages.prototype.toPage = function(page){ //页面跳转
			this.func(page);
		}
		
		showPages.prototype.refreshPage=function(){
			this.func(pageNo);
		}
		
		showPages.prototype.printHtml=function(){//输出页面
			document.getElementById(this.place).innerHTML=this.createHtml();
		}
	
		showPages._initialized=true;
	}
}

//数字分页
function showNumPages(p_name,p_placeId,p_pageNo,p_pageSize,p_pageCount,p_totalCount,p_func) { //初始化属性
	this.name = p_name;      							   //对象名称
	this.place=p_placeId								   //对像所在位置ID
	this.pageNo = p_pageNo;         			           //当前页数
	this.pageCount = p_pageCount;    			           //总页数
	this.totalCount=p_totalCount;						   //总记录数
	this.pageSize=p_pageSize;							   //每页显示记录数
	this.func=p_func;
	
	if(typeof showNumPages._initialized=="undefined"){
		showNumPages.prototype.createHtml=function(){
			var strHtml=new StringBuffer();
			var prevPage = this.pageNo - 1;
			var nextPage = this.pageNo + 1;
			strHtml.append("共: "+this.pageCount+" 页/"+this.totalCount+"条&nbsp;&nbsp;");
			if(this.pageCount>1){
				if(prevPage<1){
					//strHtml.append("<a href='#'>首页</a>&nbsp;&nbsp;");
					//strHtml.append("<a href='#'>上一页</a>&nbsp;&nbsp;");
				}else{
					strHtml.append("<a href='#' onclick='"+this.name+".toPage(1)'>首页</a>&nbsp;&nbsp;");
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+prevPage+")'>上一页</a>&nbsp;&nbsp;");
				}
				for(var i=(parseInt((this.pageNo-1)/10)+1)*10-9;i<=(parseInt((this.pageNo-1)/10)+1)*10 && i<=this.pageCount;i++){
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+i+")'>");
					if(this.pageNo==i)strHtml.append("<strong style='color: black'>");
					strHtml.append("["+i+"]");
					if(this.pageNo==i)strHtml.append("</strong>");
					strHtml.append("</a>&nbsp;&nbsp;");
				}
				if(nextPage>this.pageCount){
					//strHtml.append("<a href='#'>下一页</a>&nbsp;&nbsp;");
					//strHtml.append("<a href='#'>末页</a>&nbsp;&nbsp;");
				}else{
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+nextPage+")'>下一页</a>&nbsp;&nbsp;");
					strHtml.append("<a href='#' onclick='"+this.name+".toPage("+this.pageCount+")'>末页</a>&nbsp;&nbsp;");
				}
				var chkSelect;
				strHtml.append("<select name='toPage' onchange='"+this.name+".toPage(this.selectedIndex+1)'>");
				for (var i = 1; i <= this.pageCount; i++) {
					if (this.pageNo == i) chkSelect=' selected="selected"';
					else chkSelect='';
					strHtml.append('<option value="' + i + '"' + chkSelect + '>' + i + '</option>');
				}
				strHtml.append('</select>');
			}
			return strHtml.toString();
		}

		showNumPages.prototype.toPage = function(page){ //页面跳转
			this.func(page);
		}
		
		showNumPages.prototype.refreshPage=function(){
			this.func(this.pageNo);
		}
		
		showNumPages.prototype.printHtml=function(){//输出页面
			document.getElementById(this.place).innerHTML=this.createHtml();
		}
	
		showNumPages._initialized=true;
	}
}
