//选择指定列


$("#btn-column").click(function(){
	$(this).parent().toggleClass("active");
	if(!$(this).parent().hasClass("active")){
		$(window).trigger("jqgrid.column");
	}
	return false;
});

$(window).click(function (e) {
	if(!$(e.target).parents("#jqgrid-column").length){
		if($("#jqgrid-column").hasClass("active")){
			$("#jqgrid-column").removeClass("active");
			$(window).trigger("jqgrid.column");
		}
	}
});

var gridDefaults={
		url: ctx+'/dmp/statistic/statisticList?sign=2',
        postData: { dayRange:7},
        multiselect: false,
        height: $(window).height() - $("#list-top").height() - 137,
        width: $(".content").width() - 167,
        rowNum: 100,
        rowList: [50, 100, 150],
        colNames: ['日期', '活动ID', '活动名称', '标签名称', '批次号', '发送时间', 'app类型', '平台类型', '发送数', '到达数', '打开数', '到达率', '打开率'],
        colModel: [
            {name: "sendTimeStr"},
            {name: "marketingId"},
            {name: "marketingName"},
            {name: "tagNames"},
            {name: "batchId"},
            {name: "sendTimeStr1"},
            {name: "appType"},
            {name: "platformType"},
            {name: "sendNum"},
            {name: "arrivalNum"},
            {name: "openNum"},
            {name: "arrivalRateStr"},
            {name: "openRateStr"}
            ],
            loadComplete:function(data){
                chartDataNew = data.rows;
                rowSpan();
            },
            afterInsertRow:function(rowid,rowdata){
            	var rows=$($("#data").jqGrid("getGridRowById",rowid));
        		rows.data("id",rowdata.marketingId);
        		rows.data("time",rowdata.sendTimeStr);
            }
}

//jqGrid配置
$("#data").jqGrid(gridDefaults);

//全并单元格
var rowSpan=function(){
	var group={};
	var groupLen=$(".jqgrow:eq(0) td").length;
	$(".jqgrow").each(function(index){
		var td=$(this).find("td");
		for(var i=0;i<td.length;i++){
			group["column"+i]=group["column"+i]||[];
			group["column"+i].push(td.eq(i));
		}
	})


	var dataSpi=[];
	var dataSpi2=[];
	var notNeed=["data_sendNum","data_arrivalNum","data_openNum","data_arrivalRateStr","data_openRateStr"]

	for(var i=0;i<(groupLen-1);i++){
		if(isInArray(notNeed,group["column"+i][0].attr("aria-describedby"))){
			continue;
		}

		var data=group["column"+i];
		var parentNode;
		var parentText="";
		var tempIndex;
		var parentLength= data.length;
		$.each(data,function(index){
			if(parentText==""){
				parentNode=this;
				parentText=this.text();
				tempIndex=1;
			}else if((parentLength-1)==index){
				this.remove();
				tempIndex++;
				parentNode.attr("rowspan",tempIndex);
			}else{
				if(parentText==this.text()){
					if(isInArray(dataSpi,index)||isInArray(dataSpi2,index)){
						parentNode.attr("rowspan",tempIndex);
						parentNode=this;
						parentText=this.text();
						tempIndex=1;
					}else{
						this.remove();
						tempIndex++;
					}
				}else{
					parentNode.attr("rowspan",tempIndex);
					if((parentLength-1)!=index){
						if(i==0){
							dataSpi.push(index);
						}
						if(i==1){
							dataSpi2.push(index);
						}
						parentNode=this;
						parentText=this.text();
						tempIndex=1;
					}
				}
			}
		})
	}
}

var isInArray=function(src,target){
	var flag=false;
	for(var i=0;i<src.length;i++){
		if(src[i]==target){
			flag=true;
			break;
		}
	}
	return flag;
}

$(window).on("jqgrid.column",function(){
	var data={
		colNames:[],
		colModel:[]
	};
	$("#jqgrid-column").find(":checkbox:checked").each(function () {
		var _this=$(this);
		for(var i=0;i<gridDefaults.colModel.length;i++){
			if(gridDefaults.colNames[i]==_this.data("name")){
				data.colModel.push(gridDefaults.colModel[i]);
				data.colNames.push($(this).data("name"));
				return true;
			}
		}
	});

	localStorage["grid_column"+location.href]=JSON.stringify(data.colNames);

	$("#grid-con").html("").html('<table id="data" class="ui-jqgrid"></table> <div id="pager"></div>');

	var result= $.extend({},gridDefaults,data);

	$("#data").jqGrid(result);

});

if(localStorage["grid_column"+location.href]){
	var local=JSON.parse(localStorage["grid_column"+location.href]);
	for(var i=0;i<local.length;i++){
		$(".jqgrid-column-item input[data-name="+local[i]+"]").prop("checked","checked");
	}
	$(window).trigger("jqgrid.column");
}else{
	$(".jqgrid-column-item input").prop("checked","checked");
	$(window).trigger("jqgrid.column");
}