
//验证数字类型
function validateInt(val){
	var reg=/^\d+$/;
	return reg.test(val);
}
//颜色是否包含非法字符
function validateStr(val){
	var arr=new Array("'"); 
 
	 var len=arr.length;
	 var errcode = '';
	 for(var i=0;i<len;i++)      
	 {
	  if(val.indexOf(arr[i])>=0)
	  { 
	  errcode = arr[i];
	   break;
	  }   
	 }
	 return errcode;

}
//验证double类型

function validateDouble(val){
	var reg=/^0.([0-9]+)$/;
	        
	return reg.test(val);
}
//验证分仓信息
function validateWarehouse(){
 
	//活动类型
	var activeType=$('#actType').val();
	//活动范围类型
	var  activeRange = $('input[name=actRange]').filter(':checked').val();
	//是否容许重复
	var isAllowRepeat=$('#isAllowRepeat').val();
	//异常域集合
     var  input_hidden=[];
     //文本域集合 
     var input_text=[];
     
     $('#form2').find('input[type=hidden]').each(function(){input_hidden.push(this);});//找出所有的隐藏域表单
     $('#form2').find('input[type=text]').each(function(){input_text.push(this);});    //找出所有的文本框表单
     
     
	//已经添加的分仓信息集合
	var warehouse=[];
	for(var i in input_hidden){
	 
		 /*   现在不做名称验证  不存在的专场容许保存    //专场
		    if(this.name.indexOf('.rangeName')!=-1){
			  if($(this).val()=='null'){
				  alertMsg.info('未检索到相关专场名称，请核实');
				validateResult=false;
				return false; 
			  }
			  }
			  //分仓
			  else*/
				  
			    if(input_hidden[i].name.indexOf('.warehouseName')!=-1){
			    	input_hidden[i].range=[];//专场
			    	input_hidden[i].buy=[];//档次
			    	input_hidden[i].rangebuy={};//单一专场的档次
				  warehouse.push(input_hidden[i]);
				  
			  }
		
	}
	
	//判断是否有频道信息   
    if(warehouse.length==0){alertMsg.info('请至少添加一个频道');return false; }
    //找出每个频道的专场  
    for(var i in input_hidden){
	 if(input_hidden[i].name.indexOf('.rangeId')!=-1 ){
		 for(var j=0;j<warehouse.length;j++){
			if(input_hidden[i].name.indexOf(warehouse[j].name.substring(0,warehouse[j].name.indexOf(']')+1))!=-1){
				warehouse[j].range.push($.trim($(input_hidden[i]).val()));
				break;
			}
		 }
		 }	
    }
   
 
    //找出每个频道的  档次 单一专场 找出每个专场的档次
	
    for(var i in input_text){
          
	   	 if(input_text[i].name.indexOf('.buy')!=-1 ){
	   		 
	   		 for(var k=0;k<warehouse.length;k++){
	   			if(input_text[i].name.indexOf(warehouse[k].name.substring(0,warehouse[k].name.indexOf(']')+1))!=-1){
	   				//非单一专场
	   				if(activeRange!=31&&activeRange!=41){
	   				warehouse[k].buy.push($.trim($(input_text[i]).val()));
	   				}else{
	   					//单一专场
	   					//1 找出该档次 对应 的专场ID
	   					var rangeId;
	   					for(var j in input_hidden){
	   					 if(input_hidden[j].name.indexOf('.rangeId')!=-1 ){
	   					      if(input_hidden[j].name.substring(0,input_hidden[j].name.indexOf('.rangeId'))==input_text[i].name.substring(0,input_text[i].name.indexOf('.buy'))){
	   					    	  if(!warehouse[k].rangebuy[$(input_hidden[j]).val()]){warehouse[k].rangebuy[$(input_hidden[j]).val()]=[];}
	   					    	   warehouse[k].rangebuy[$(input_hidden[j]).val()].push($.trim($(input_text[i]).val()));
	   					      }
	   						 }	
	   					}
	   				}
	   				break;
	   			    }
	   		     }
	   		 }
	       } 
    

	
	//对每个分仓进行验证   专场是否重复   档次是否重复
    for(var i=0;i<warehouse.length;i++){
    	 //非自营范围必须有一个专场
     
    	var activeTypeName = "专场";
    	if(activeRange==4 || activeRange==41){
    		activeTypeName = "商品";
    	}
    	
    	
    	if(warehouse[i].range.length==0&&activeRange!=5){alertMsg.info($(warehouse[i]).val()+" 频道没有"+activeTypeName+" 请增加");return false;}
    	
    	 
    	//判断是否重复临时集合
    	var ranges ={};
    	//非单一专场   容许重复的单一专场  都需要验证专场是否 重复  免邮一律不能重复
    	if( (activeRange!=31&&activeRange!=41)||((activeRange==31||activeRange==41)&&isAllowRepeat==1)||activeType==4){
    		
    		for(var j=0;j<warehouse[i].range.length;j++){
    			
    			if(ranges[warehouse[i].range[j]]){alertMsg.info($(warehouse[i]).val()+" 频道存在重复的"+activeTypeName+"   [ "+warehouse[i].range[j]+"]");return false;}
    			ranges[warehouse[i].range[j]]=true;
    		}
    		
    	} 
    	//档次大于1 的非单一专场    分仓进行验证   
    	if((activeRange!=31&&activeRange!=41)&&warehouse[i].buy.length>1){
    		var buys={};
    		for(var j=0;j<warehouse[i].buy.length;j++){
    			if(buys[warehouse[i].buy[j]]){alertMsg.info($(warehouse[i]).val()+" 频道存在重复的档次  [ "+warehouse[i].buy[j]+"]");return false;}
    			buys[warehouse[i].buy[j]]=true;
    		}
    		
    	}
    	//单一 范围 并且不容许重复的时候是存在多档次
    	else if((activeRange==31||activeRange==41)&&isAllowRepeat==0){
    		for(var j in warehouse[i].rangebuy){
    			var buys={};
    		     for(var k =0;k<warehouse[i].rangebuy[j].length;k++){
                        if(buys[warehouse[i].rangebuy[j][k]]){alertMsg.info($(warehouse[i]).val()+" 频道的 ["+ j+"]"+activeTypeName+"存在重复的档次  [ "+warehouse[i].rangebuy[j][k]+"]");return false;}
    	    			buys[warehouse[i].rangebuy[j][k]]=true;  
    		     }
    			
    		}
    		
    	}
    	
    	
    }
 
    
    
	//验证分仓表单信息  1 非空  2 类型(str int  double)  3 长度(大小)
   for(var i=0;i< input_text.length;i++){
              var thi=$(input_text[i]);
		 //判断输入框是否都输入合法
			var title=thi.attr('title'),valuetype=thi.attr('valuetype'),min=thi.attr('min'),max=thi.attr('max');
			//验证非空
			if(thi.val()==null||thi.val()==''){alertMsg.info('必填项请输入数据  ['+title+']');thi.focus();return false;}
			var value=thi.val().trim();
			if(valuetype=='int'){
				if(!validateInt(value)){alertMsg.info('必须输入正确的数字  ['+title+']');thi.focus();return false;	
				}
				
				if(max){
					if(parseInt(value)>parseInt(max)){alertMsg.info('必须输入不大于 '+max+' 的数字  ['+title+']');thi.focus();return false;	}
				}
				if(min){
					if(parseInt(value)<parseInt(min)){alertMsg.info('必须输入不小于 '+min+' 的数字  ['+title+']');thi.focus();return false;	}
					
				}
			}else if(valuetype=='double'){
				 
				 if(!validateDouble(value)){alertMsg.info('必须输入正确的小数  ['+title+']');thi.focus();return false;	}
			    if(max){
				   if(parseFloat(value)>parseFloat(max)){alertMsg.info('必须输入不大于 '+max+' 的数字  ['+title+']');thi.focus();return false;	}
				}
				if(min){
					if(parseFloat(value)<parseFloat(min)){alertMsg.info('必须输入不小于 '+min+' 的数字  ['+title+']');thi.focus();return false;	}
					
				}
			}else if(valuetype=='str'){
				var errcode=validateStr(value);
				if(errcode.length>0){alertMsg.info('不能包含  '+errcode+' 字符  ['+title+']');thi.focus();return false;	}
				if(max){
					if(value.length>parseFloat(max)){alertMsg.info('必须输入长度大于 '+max+' 的字符  ['+title+']');thi.focus();return false;}
				}
				if(min){
					if(value.length<parseFloat(min)){alertMsg.info('必须输入长度不小于 '+min+' 的字符  ['+title+']');thi.focus();return false;	
					}
				}
			}	
		} 
 return true;	 
}
//活动审批
function audit(type,id){
	$('.auditbutton').disabled = true;
	$.post(ctx+'/active/audit/'+id+'?type='+type, null, function(rsp){
			alertMsg.info(rsp.msg,{
				okCall:function(){
					window.location.href=document.referrer;
				}
			});
		
		
	});
}



 
 

/**
 * 编辑活动
 type 0 修改  1 强改
 */
function edit(actType,actMainId,type,src){
 
	if(actType==1){
		window.location.href = ctx+"/buygive/edit/"+actMainId+"?force="+type + "&src=" + src;
	}
	
	//免邮活动
	else if(actType==4){
		window.location.href=ctx+'/freeship/edit/'+actMainId+'?force='+type + "&src=" + src;
	}
	//折扣活动
	else if(actType==3){
		window.location.href=ctx+'/discount/edit/'+actMainId+'?force='+type + "&src=" + src;;
		
	} else if(actType==6){
		//买免专场
		window.location.href =ctx+ "/buyreduce/edit/"+actMainId+"?force="+type + "&src=" + src;;
	}
	//满减活动
	else if(actType==2){
		window.location.href=ctx+'/fullreduce/edit/'+actMainId+'?force='+type + "&src=" + src;;
		
	}
}

 
//删除活动
function del( actMainId) {
	alertMsg.confirm('您确认删除吗?', {
		okCall: function() {

			$.post(ctx+'/active/delete/'+actMainId,  null , function(rsp){
				if(rsp.success){
					alertMsg.info('删除活动成功',{
						okCall:function(){
							window.location.href=window.location.href;
						}
					});
				}else{
					alertMsg.info(rsp.msg);
				}
				
			},"json");
		}
	});
}

 
//查看活动
function view(actType,actMainId,src){
	if(actType==1){
		window.location.href=ctx+'/buygive/view/'+actMainId + "?src=" + src;;
	}//免邮活动
	else if(actType==4){
 
		window.location.href=ctx+'/freeship/view/'+actMainId + "?src=" + src;;
	}
	//折扣
	else if(actType==3){
		window.location.href=ctx+'/discount/view/'+actMainId + "?src=" + src;;
	} else if(actType==6){ //买免专场
		window.location.href = ctx+"/buyreduce/view/"+actMainId + "?src=" + src;;
	}
	//满减活动
	else if(actType==2){
		window.location.href=ctx+'/fullreduce/view/'+actMainId + "?src=" + src;;
		
	}
	
}
//查看频道信息
function showWarehouse(actMainId){
	
	    window.location.href=ctx+'/active/showWarehouse/'+actMainId;
		 
 
}
 