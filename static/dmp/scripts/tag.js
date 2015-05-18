 var isAgainClick = true;
 var Rand = 0;
/* 标签选择全局控制脚本 */


//时间选择
$(".timepick").datetimepicker().next().datetimepicker();

$('.timepick').on('changeDate', function () {
    var _this = $(this);
    _this.next().datetimepicker({
        setStartDate: new Date(_this.val())
    }).focus();
}).next().on('changeDate', function() {
    $(this).trigger("tag_count");
});

//自动完成
var initAjax = function (ele) {
    $(ele).each(function (index, node) {
        $(node).autocomplete({
            serviceUrl: ctx+'/dmp/normValue/listByLike/' + $(node).parent().parent().siblings(".tag-con-title").data("normid") + '',
            onSelect: function () {
                $(this).trigger("tag_count");
            }
        });
    })
};
initAjax(".auto-complete");

//增加自动完成框
$(document).on("click", ".tab-pane:not(#tab-search) .icon-plus", function () {
    var newEle = $('<div class="pull-left re"><i class="icon-remove"></i><input placeholder="请输入" type="text" class="form-control width200 auto-complete pull-left mr15 mb10" /></div>');
    $(this).before(newEle);
    initAjax(newEle.find("input"));
});

$(document).on("click", "#tab-search .icon-plus", function () {
    var newEle = $('<div class="pull-left re"><i class="icon-remove"></i><input placeholder="请搜索" type="text" class="form-control width200 auto-complete pull-left mr15 mb10" /></div>');
    $(this).before(newEle);
    var node_temp = newEle.find("input");
    node_temp.autocomplete({
        serviceUrl: ctx+'/dmp/normValue/listByLike/' + node_temp.parent().parent().siblings(".tag-con-title").data("normid") + '',
        onSelect: function (suggestion) {
            $(this).trigger("auto_ok");
        }
    });
});

//清除
$(document).on("click", "#tab-search .icon-remove", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find("input").eq($(this).parent().index()).prev().click();
});

$(document).on("click", ".tag-con .icon-remove", function () {
    if ($(this).parent().parent().find(".pull-left.re").length == 1) {
        return;
    }
    var tempNode = $(this).parent().parent().find("input");
    $(this).parent().remove();
    tempNode.trigger("tag_count");
});

//查看更多标签
$(document).on("click", ".tag-more", function () {
    var _this = $(this);
    if (_this.data("toggle") == "show") {
        $(this).parent().parent().addClass("more");
        _this.data("toggle", "hide").text("收起");
    } else {
        $(this).parent().parent().removeClass("more");
        _this.data("toggle", "show").text("更多");
    }
});

//标签提交前检查
var tagCheck = function () {
    //必选标签判断

    if (!$(".tab-pane:not(#tab-search) .icon-ok-sign").length) {
        bootbox.alert("请先选择指标!");
        return true;
    }
    if ($(".tab-pane:not(#tab-search) .tag-con-title .icon-ok-sign").length > 10) {
        bootbox.alert("最多选择10个指标!");
        return true;
    }
    var tempFlag = false;
    $("#main-form .tab-pane:not(#tab-search),#temporary-form .tab-pane:not(#tab-search)").each(function (index, ele) {
        if (!checkChoseTime($(ele))) {
            tempFlag = true;
            return false;
        }
    });
    if (tempFlag) {
        return true;
    }
    return false;
}

//已选人数
$("#tag-num").click(function () {
    if (tagCheck()) {
        return false;
    }

    var _this = $(this);

    if (_this.data("edit") == "edit") {
        return;
    }

    var tempJson = {
        "tDmpTagNorms": [

        ]
    };
    $(".tab-pane:not(#tab-search) .tag-con>.clearfix").each(function (index, ele) {
        if (!$(ele).find(".icon-ok-sign").length) {
            return true;
        }
        var tempInput = $(ele).find("input");
        if (tempInput.length && (tempInput.first().val() || tempInput.last().val())) {
        	var tempResult = [];
            if ($(ele).find(".tag-hidecon").css("display") == "block"||!$(ele).find("span.select").length) {
            	$(ele).find("input").each(function (index, ele) {
                    if ($(ele).val()) {
                        tempResult.push($.trim($(ele).val()));
                    } else {
                        if (!$(ele).hasClass("auto-complete")) {
                            tempResult.push("$");
                        }
                    }

                });
                tempJson.tDmpTagNorms.push({ "normId": $(ele).find(".tag-con-title").data("normid"), "normValues": tempResult.join(",") });
            } else {
            	$(ele).find("span.select").each(function (index, ele) {
                    tempResult.push($(ele).data("value"));
                });
                tempJson.tDmpTagNorms.push({ "normId": $(ele).find(".tag-con-title").data("normid"), "normValueIds": tempResult.join(",") });
            }
        } else if ($(ele).find("span.select").length) {
            var tempResult = [];
            $(ele).find("span.select").each(function (index, ele) {
                tempResult.push($(ele).data("value"));
            });
            tempJson.tDmpTagNorms.push({ "normId": $(ele).find(".tag-con-title").data("normid"), "normValueIds": tempResult.join(",") });
        }
    });
    isAgainClick = false;
    Rand = Math.round(Math.random()*1000);
    $.ajax({
        //url: ctx + "/dmp/tag/countTag",
        url: ctx + "/dmp/tag/countTagNew?sign=" + Rand,
        type: "post",
        global: false,
        contentType: 'application/json',
        data: JSON.stringify(tempJson),
        dataType: 'json',
        timeout: 660000
    }).success(function (result) {
        var array = $.parseJSON(result).num.split(",");
        //$.parseJSON(result).sign
        if ($.parseJSON(result).num == 'no Choice time') {
            bootbox.alert("请选择 筛选时段");
            $(".nav-tabs a[href=#tab1]").click();
            $(".tag-con-title:contains(筛选时段)").css("border", "2px solid red");
            $(".tab-pane.active").children().animate({ "scrollTop": 0 }, 300);
            _this.data("edit", "").find("span").text("？");
        } else if ($.parseJSON(result).num == 'need choice other norm') {

            bootbox.alert("请选择除'筛选时段'外的其他指标");
            $(".tab-pane.active").children().animate({ "scrollTop": 0 }, 300);
            _this.data("edit", "").find("span").text("？");

        } else if ($.parseJSON(result).num == 'no need Choice time') {
            bootbox.alert("当前的指标组合不需要选择'筛选时段',请去掉后再次点击");
            $(".nav-tabs a[href=#tab1]").click();
            $(".tag-con-title:contains(筛选时段)").css("border", "2px solid red");
            $(".tab-pane.active").children().animate({ "scrollTop": 0 }, 300);
            _this.data("edit", "").find("span").text("？");
        } else if (array.length == 2) {
        	if($.parseJSON(result).sign == Rand) {
        		pushCount = array[0];
                pcCount = array[1];
                if($("#tagStatus").val() != undefined) {
                	document.getElementById("tagStatus").value = 2;
                }
                if($("#tagPushStatus").val() != undefined) {
                	document.getElementById("tagPushStatus").value = 2;
                }
                //pushResponse表示pushCount的值是从接口获取，并不是页面默认值
                if (pushCount >= 0) {
                    pushResponse = 1;
                }
                if (pcCount >= 0) {
                    pcResponse = 1;
                }
                var strPushConut = pushCount;
                if (strPushConut == -1)
                    strPushConut = "失败";

                var strPcCount = pcCount;
                if (strPcCount == -1)
                    strPcCount = "失败";

            	_this.data("edit", "").find("span").html("移动:" + strPushConut + "  PC:" + strPcCount);
                if (isAgainClick){
            		
                	  pushCount = 0;
                      pcCount = 0;

                      pushResponse = 0;
                      pcResponse = 0;
            	}
        	}
        } else {
        	bootbox.alert($.parseJSON(result).num);
            _this.data("edit", "").find("span").text("？");
        }
    });
    _this.data("edit", "edit").find("span").html('统计中<i class="icon-spinner icon-spin" style="margin-left:5px;"></i>');
});

//已选人数恢复
var backChoseNum1 = function () {
	
	isAgainClick = true;

	Rand = Math.round(Math.random()*1000);
	
	 pushCount = 0;
     pcCount = 0;

      pushResponse = 0;
      pcResponse = 0;
      if($("#tag-num").length > 0) {
    	  $("#tag-num").data("edit", "").find("span").text("？");
      }
};

//组装动态标签
var getSpanValue = function (valueId) {
    result = [];
    $(".tab-pane:not(#tab-search) .tag-con-title[data-normid=" + valueId + "]").next().find("span.select").each(function (index, ele) {
        result.push($(ele).data("value"));
    });
    return result;
}

//标签选择(核心)
$(document).on("click", ".tag-con-item span", function () {
    
	var _this = $(this);

    //如果不是兄弟元素
    if (!_this.hasClass("select")){
    	if(!_this.siblings(".select").length){
    		if (tagMax2(_this)){
    			return false;
    		}
        }
    	if (tagMax(_this)){
    		return false;
    	}
    }
    
    if (_this.parent().data("multi")) {
        _this.siblings().removeClass("select").end().toggleClass("select");
    }
    else {
        _this.toggleClass("select");
    }

    if (!_this.parents("#tab-search").length) {
        //联动
    	tagLife(_this);
    }

    backChoseNum1();

    tagIconSelected(_this);

    addCustomSpan();
});

//联动开始
var tagLife=function(_this){
	var normid = _this.parent().parent().prev().data("normid");

    if (normid == "1107" || normid == "1108") {

        var result1107 = getSpanValue(1107);
        var result1108 = getSpanValue(1108);
        if (!result1107.length) {
            result1107 = [-1];
        }
        if (!result1108.length) {
            result1108 = [-1];
        }

        $.post(ctx+"/dmp/normValue/cityList/" + result1107.join(',') + "/1107/" + result1108.join(',') + "/1108", function (data) {
            appendNorm(data,_this.hasClass("select"));
        });
    }
    if (normid == "51107" || normid == "51110") {

        var result51107 = getSpanValue(51107);
        var result51110 = getSpanValue(51110);
        if (!result51107.length) {
        	result51107 = [-1];
        }
        if (!result51110.length) {
        	result51110 = [-1];
        }

        $.post(ctx+"/dmp/normValue/cityList/" + result51107.join(',') + "/51107/" + result51110.join(',') + "/51110", function (data) {
            appendNorm(data,_this.hasClass("select"));
        });
    }
    if (normid == "5703" || normid == "5705" || normid == "1403" || normid == "1404") {
        var resultNorm = getSpanValue(normid);
        if (!resultNorm.length)
            resultNorm = [-1];
        $.post(ctx+"/dmp/normValue/childList/" + resultNorm.join(",") + "/" + normid + "", function (data) {
            appendNorm(data,_this.hasClass("select"));
        });
    }
}

//一个活动最多选择5个标签，一个标签最多选择10个指标
var tagMax = function (ele) {
	if (ele.siblings(".select").length >= 5) {
		if(!$(ele).parents("#tab-search").length){
			bootbox.alert("一个指标最多选择5个指标值");	
		}
        return true;
    }
    return false;
}
var tagMax2=function(ele){
	if ($(".tab-pane:not(#tab-search) .tag-con-title .icon-ok-sign").length >= 10) {
		if(!$(ele).parents("#tab-search").length){
			bootbox.alert("一个标签最多选择10个指标");	
		}
        return true;
    }
	return false
}

//动态添加标签
var appendNorm = function (data) {
    if (!data.length)
        return false;
    var normId = data[0].normId;

    var tempNode = $(".tab-pane:not(#tab-search) .tag-con-title[data-normId=" + normId + "]").next().find(".tag-true");
    var tempHtml = [];

    for (var i = 0; i < data.length; i++) {
        tempHtml.push("<span data-value='" + data[i].sId + "'>" + data[i].normValue + "</span>")
    }
    if (data.length > 5) {
        tempHtml.push('<em class="tag-more" data-toggle="show">更多</em>');
    }
    tempNode.html(tempHtml.join(""));
    tempNode.find("span:eq(0)").addClass("select").click();
};

//点击自定义 自己输入值
$(document).on("click", ".tag-self", function () {
    var parent = $(this).parent().parent();
    parent.find(".tag-hidecon").show().find("input:eq(0)").trigger("tag_count");
    parent.find(".tag-true").hide();
});

$(document).on("click", ".tag-other-back", function () {
    var parent = $(this).parent().parent();
    parent.find(".tag-hidecon").hide();
    parent.find(".tag-true").show().find("span.select:eq(0)").click().click();
});

//标签前打勾
var tagIconSelected = function (_this) {
    if (_this.parent().find(".select").length) {
        var tempSelected = _this.parent().parent().siblings(".tag-con-title");
        if (!tempSelected.find(".icon").length) {
            tempSelected.prepend('<i class="icon icon-ok-sign"></i>');
        }
    } else {
        _this.parent().parent().parent().find(".icon").remove();
    }
    setNavNum(_this);
};

//头部数字
var setNavNum = function (_this) {
    var tempNum = _this.parents(".tab-pane").find(".icon").length;
    if (tempNum) {
        $("#tag-tab-nav").find("a[href=#" + _this.parents(".tab-pane").attr("id") + "] span").text(tempNum).css("display", "inline-block");
    } else {
        $("#tag-tab-nav").find("a[href=#" + _this.parents(".tab-pane").attr("id") + "] span").text(tempNum).hide();
    }
}

//输入框上下限
$(document).on("blur", ".tag-con-item input", function () {
    var _this = $(this);
    if (_this.hasClass("timepick") || _this.hasClass("timepick2")) {
        return true;
    }
    if (_this.hasClass("num-input")) {
        if (_this.parents(".tag-con-item").prev().data("normlimit") == "1") {
            //不允许0
            if (isNaN(_this.val()) || parseInt(_this.val()) <= 0) {
                _this.val("").attr("placeholder", "请重新输入有效数字");
            }
        } else {
            if (isNaN(_this.val()) || (parseInt(_this.val()) < 0)) {
                _this.val("").attr("placeholder", "请重新输入有效数字");
            }
        }
        if (_this.prev().is("input")) {
            if (parseInt(_this.val()) < parseInt(_this.prev().val())) {
                _this.val("").attr("placeholder", "下限不能小于上限");
            }
        } else if (_this.next().is("input")) {
            if (parseInt(_this.val()) > parseInt(_this.next().val())) {
                _this.val("").attr("placeholder", "上限不能大于下限");
            }
        }
        if (_this.val() && isNaN(_this.val())) {
            _this.val("").attr("placeholder", "不能输入特殊字符");
        }
    }
    var tempText = $(this).parent().parent().prev().text();
    if (_this.val().indexOf("$") != -1 || _this.val().indexOf(",") != -1) {
        _this.val("").attr("placeholder", "不能输入特殊字符");
    } else if (tempText.indexOf("id") != -1 || tempText.indexOf("ID") != -1) {
        if (!parseInt(_this.val())) {
            _this.val("").attr("placeholder", "ID只能输入数字");
        } else if (parseInt(_this.val()) <= 0) {
            _this.val("").attr("placeholder", "ID不能小于等于0");
        }
    }
    _this.trigger("tag_count").trigger("keyup");
});


//标签统计
$(document).on("tag_count", ".tag-con-item input", function () {
    var _this = $(this);
    if (_this.val()) {
        var tempSelected = _this.parent().parent().siblings(".tag-con-title");
        if (!tempSelected.find(".icon").length) {
            tempSelected.prepend('<i class="icon icon-ok-sign"></i>');
        }
    } else {
        var temp_parent = _this.parent().parent().parent();
        var temp_flag = false;
        temp_parent.find("input").each(function (index, ele) {
            if ($(ele).val()) {
                temp_flag = true;
                return false;
            }
        });
        if (!temp_flag) {
            temp_parent.find(".icon").remove();
        }
    }
    setNavNum(_this);
    addCustomSpan();
});

//筛选时段
var checkChoseTime = function (node) {
    var tempNode;
    if (node) {
        tempNode = node;
    } else {
        tempNode = $(".tab-pane.active");
    }
    if (tempNode.find(".icon-ok-sign").length) {
        var choseTab = $(".nav-tabs a[href=#" + tempNode.attr("id") + "]");
        var choseDate = choseTab.attr("must_select");
        if (choseDate) {
            var tempData = choseDate.split("|");
            var tempFlag;
            $.each(tempData, function (index, ele) {
                var lastData = ele.split(",");
                $.each(lastData, function (index2, ele2) {
                    return tempFlag = !$(".tag-con-title[data-normid=" + ele2 + "]", tempNode).find(".icon").length;
                });
                if (tempFlag) {
                    //生成提示文字
                    var tempMsg = [];
                    for (var j = 0; j < lastData.length; j++) {
                        tempMsg.push($(".tag-con-title[data-normid=" + lastData[j] + "]", tempNode).text());
                    }
                    if (tempMsg.length == 1) {
                        bootbox.alert("请选择" + tempMsg.join("") + "!");
                    } else {
                        //(单选)
                        var resultMsg = [];
                        for (var x = 0; x < tempMsg.length; x++) {
                            resultMsg.push(' "' + tempMsg[x] + '"');
                        }
                        bootbox.alert("请至少选择" + resultMsg.join(" 或").replace(/\(单选\)/g, "") + "中的一个或多个!");
                    }
                    if (node) {
                    	if(!choseTab.parent().hasClass("active")){
                    		choseTab.click();
                    	}
                    }
                    return false;
                }
            });
            return !tempFlag;
        }
    }
    return true;
}

$("#tag-tab-nav li:not(.not)").click(function () {
    var lastNode = $("#tag-tab-nav .active");

    if (!checkChoseTime()) {
        return false;
    }

    if ($(this).index() == 4) {
        navFlag = true;
        if ($(".tab-pane:not(#tab-search,#tab5) .icon-ok-sign").length) {
            bootbox.confirm("\"预置项\"指标不能与其他指标混用，放弃之前选择的\"非预置项\"指标？", function (result) {
                if (result) {
                    //是
                    reset();
                    navFlag = true;
                } else {
                    //否
                    lastNode.find("a").click();
                    navFlag = false;
                    return;
                }
            });
        }
    } else {
        navFlag = false;
        if ($("#tab5 .icon-ok-sign").length) {
            bootbox.confirm("\"预置项\"指标不能与其他指标混用，放弃之前选择的\"预置项\"指标？", function (result) {
                if (result) {
                    //是
                    reset();
                    navFlag = false;
                } else {
                    //否
                    lastNode.find("a").click();
                    navFlag = true;
                    return;
                }
            });
        }
    }
    active_node = $(this).index();
});

//重置
var reset = function () {
    $(".tag-con>.clearfix").each(function (index, ele) {
        $(ele).find("input").each(function (index, ele2) {
            $(ele2).val("");
        });
        $(ele).find("span.select").removeClass("select");
        $(ele).find(".icon-ok-sign").remove();
    });
    $("#customStr").html("").parent().attr("title", "");
    $(".nav-tabs li span").text("0");
    $("#tag-num span").text("?");
};

//搜索
$("#search-text").bind("keyup", function (e) {
    $("#tab-search .tag-con").html("");
    var temp_text = $(this).val().replace(/^\s+|\s+$/g, '');
    if (temp_text == "") {
        $("#tab-search-a").hide();
        $("#tag-tab-nav li").eq(active_node).find("a").click();
        return;
    }
    search_node.length = 0;
    if (navFlag) {
        $("#tab5 .clearfix .tag-con-title").each(function (index, ele) {
            var temp_node = $(ele);
            if (temp_node.text().indexOf(temp_text) != -1) {
                search_node.push(temp_node.parent());
            } else {
                //搜值中有没有符合条件的
                var flag = false;
                temp_node.next().find("span").each(function (index, ele2) {
                    if ($(ele2).text().indexOf(temp_text) != -1) {
                        flag = true;
                        return false;
                    }
                });
                if (flag) {
                    search_node.push(temp_node.parent());
                }
            }
        });
    } else {
        $(".tab-pane:not(#tab5,#tab-search) .clearfix .tag-con-title").each(function (index, ele) {
            var temp_node = $(ele);
            if (temp_node.text().indexOf(temp_text) != -1) {
                search_node.push(temp_node.parent());
            } else {
                //搜值中有没有符合条件的
                var flag = false;
                temp_node.next().find("span").each(function (index, ele2) {
                    if ($(ele2).text().indexOf(temp_text) != -1) {
                        flag = true;
                        return false;
                    }
                });
                if (flag) {
                    search_node.push(temp_node.parent());
                }
            }
        });
    }

    for (var i = 0; i < search_node.length; i++) {
        $("#tab-search .tag-con").append(search_node[i].clone());
        if (search_node[i].find("input").length) {

            var node_temp = $("#tab-search .clearfix:last").find(".auto-complete");
            node_temp.autocomplete({
                serviceUrl: ctx+'/dmp/normValue/listByLike/' + node_temp.parent().parent().siblings(".tag-con-title").data("normid") + '',
                onSelect: function (suggestion) {
                    $(this).trigger("auto_ok");
                }
            });

            $("#tab-search .clearfix:last").find(".timepick").datetimepicker().next().datetimepicker();

            $("#tab-search .clearfix:last").find(".timepick").on('changeDate', function () {
                $(this).next().datetimepicker().focus();
            }).next().on('changeDate', function () {
                $(this).trigger("keyup").trigger("tag_count");
            });
        }
    }

    $("#tab-search-a").css("display", "inline-block").click();

});


//搜索点击
$(document).on("click", "#tab-search .tag-true span", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find(".tag-true").children().eq($(this).index()).click();
});

$(document).on("keyup", "#tab-search .tag-true input", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find("input").eq($(this).index()).val($(this).val()).trigger("tag_count");
});

$(document).on("auto_ok", "#tab-search .auto-complete", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find("input").eq($(this).parent().index()).val($(this).val()).trigger("tag_count");
});

$(document).on("keyup", "#tab-search .auto-complete", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find("input").eq($(this).parent().index()).val($(this).val()).trigger("tag_count");
});

$(document).on("click", "#tab-search .icon-plus", function () {
    var temp_parent = $(this).parent().parent();
    search_node[temp_parent.index()].find(".icon-plus").click();
});

$(document).on("keyup", "#tab-search .tag-hidecon input", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find("input").eq($(this).index()).val($(this).val()).trigger("tag_count");
});

$(document).on("click", "#tab-search .tag-self", function () {
    var temp_parent = $(this).parent().parent().parent();
    search_node[temp_parent.index()].find(".tag-self").click();
});

$(document).on("blur", ".timepick", function () {
    var _this = $(this);
    setTimeout(function () {
        _this.trigger("tag_count");
    }, 100)
});

//底部所有详细文字
var addCustomSpan = function () {
    var tempArr = [];
    var tempArr2 = [];
    $(".tab-pane:not(#tab-search) .icon-ok-sign").each(function (index, ele) {
        tempArr2.length = 0;
        tempArr.push("[");
        tempArr.push($(ele).parent().text().replace("(单选)", "") + ":");
        var tempNode = $(ele).parent().siblings(),
            tempInput = tempNode.find("input");
        if (tempInput.length && (tempInput.first().val() || tempInput.last().val())) {
            if ($(ele).parent().siblings().find(".tag-hidecon").css("display") == "none") {
                $(ele).parent().siblings().find("span.select").each(function (index, ele) {
                    tempArr2.push($(ele).text());
                });
            } else {
                if (tempInput.length == 2 && !tempInput.hasClass("auto-complete")) {
                    if (tempInput.first().val() && tempInput.last().val()) {
                        tempInput.each(function (index, ele) {
                            if ($(ele).val()) {
                                tempArr2.push($(ele).val());
                            }
                        });
                    }
                    if (tempInput.first().val() != "" && tempInput.last().val() == "") {
                        tempArr2.push(">=" + tempInput.first().val());
                    }
                    if (tempInput.first().val() == "" && tempInput.last().val() != "") {
                        tempArr2.push("<=" + tempInput.last().val());
                    }
                } else {
                    for (var i = 0; i < tempInput.length; i++) {
                        if (tempInput.eq(i).val()) {
                            tempArr2.push(tempInput.eq(i).val());
                        }
                    }
                }
            }


        } else {
            tempNode.find("span.select").each(function (index, ele) {
                tempArr2.push($(ele).text());
            });
        }
        tempArr.push(tempArr2.join("，"));
        tempArr.push("] ; ");
    });
    $("#customStr").html("").append(tempArr.join("")).parent().attr("title", tempArr.join(""));
};

function getpushTypeInfo(tagIds){
	
	 var channal = document.getElementById("actId1").value.split(":")[1];

	 if (channal == 3){
		 
		 $.ajax({
            type: "POST",
            url: ctx + "/dmp/tag/getPushClientAndPlatorm/" + tagIds,
            dataType: "json",
            timeout: 1800000
        }).success(function (data) {
       	 
       	 var arr1 = data.split("|");
       	 var arr2 = arr1[0].split(",");
       	 var arr3 = arr1[1].split(",");
       	 if (arr2[0] == 1){
   
       		 $("#temaihui").prop("checked", "checked");

       	 }else{
 
       		 $("#temaihui").removeAttr("checked");
       	 }
       	 if (arr2[1] == 2){
       		 $("#weipinghui").prop("checked", "checked");
    
       	 }else{
       		 $("#weipinghui").removeAttr("checked");
       	 }
       	 if (arr3[0] == 1){
       		 $("#android").prop("checked", "checked");

       	 }else{
       		 $("#android").removeAttr("checked");
       	 }

       	 if (arr3[1] == 2){
       		 $("#ios").prop("checked", "checked");

       	 }else{
       		 $("#ios").removeAttr("checked");
       	 }
        });
	 }	
}
function getTagItemId(){
	var result=[0]; 
    $(".tag-chose-item>span").each(function(){
    	result.push($(this).data("id"));
    });
    //alert(result.join(","))
    return result.join(",");
}