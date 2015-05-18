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
		url: ctx+'/dmp/statistic/statisticList?sign=1',
        postData: { dayRange:7},
        multiselect: false,
        height: $(window).height() - $("#list-top").height() - 137,
        width: $(".content").width() - 167,
        rowNum: 100,
        rowList: [50, 100, 150],
        colNames: ['日期', '发送数', '到达数', '打开数', '到达率', '打开率'],
        colModel: [
            {name: "sendTimeStr"},
            {name: "summarySendNum"},
            {name: "summaryArrivalNum"},
            {name: "summaryOpenNum"},
            {name: "arrivalRateStr"},
            {name: "openRateStr"}
        ],
        loadComplete:function(data){
            //alert(111)
        }
}

//jqGrid配置
$("#data").jqGrid(gridDefaults);

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