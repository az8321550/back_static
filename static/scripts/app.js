/// <reference path="../plugins/jquery/jquery.js" />
var app = {
    init: function () {
        var height = $(window).height() > $("html").height() ? $(window).height() : $("html").height();
        $(".sider").height(height);
    },
    menuInit:function(){
    	$(function(){
    		if($(".breadcrumb").length){
                $(document).on("click",".breadcrumb .icon-home",function(){
                    localStorage.removeItem("url");
                    parent.window.location.href = "/dmp/index";
                    return false;
                });
            }

            $(".sider .retract").click(function () {
                $("body").addClass("retract");
                setTimeout(function(){
                    $(window).trigger("resize");
                },600)
            })

            $(".comeout").click(function(){
                $("body").removeClass("retract");
                setTimeout(function(){
                    $(window).trigger("resize");
                },600)
            })
    	})
    }(),
    animate: function () {
        $(".content").css({ "margin-left": "-150px" }).animate({ "margin": "0" });
    },
    dialog: function () {
        $(document).on("click", '[data-toggle="dialog"]', function (e) {
            app.showDialog($(this).data("target"), $(this).data("title"));
            return false;
        });
    }(),

    ajaxLoading: function () {
        $(document).ajaxError(function () {
            bootbox.alert("系统运行错误，如果您在使用本系统，多次出现此错误，请与管理员联系。");
        }).ajaxStart(function () {
            if (!$("#loading").length)
                $("body").append('<div id="loading"><i class="icon-spinner icon-spin"></i></div>');
        }).ajaxStop(function () {
            $("#loading").remove();
        });
    }(),
    quickSearch: function () {
        $(function () {
            var searchCon = $(".search-con");
            if (!searchCon.length)
                return;
            searchCon.children().get(0).onsubmit = function (e) {
                searchCon.find("button").trigger("click");
                return false;
            }
            searchCon.find("button").click(function () {
                var txt = $(this).prev().val();
                $(".quick-search").each(function (index, ele) {
                    var tempText = $(ele).text();
                    $(ele).parent().html(function () {
                        return $(this).html().replace(/<em class="quick-search">(.*)<\/em>/, tempText);
                    });
                });
                if (txt != "") {
                    $("*:contains(" + txt + ")").each(function (index, ele) {
                        var ele = $(ele),
                            tagName = ele.get(0).tagName;
                        if (tagName == "OPTION" || tagName == "SCRIPT") {
                            return true;
                        }
                        if (ele.children().length > 3) {
                            return true;
                        }

                        var tempNode = ele.clone().children().remove().end().text();
                        if (tempNode.indexOf(txt) != -1) {
                            ele.html(function () {
                                var temp = tempNode.replace(txt, "<em class='quick-search'>" + txt + "</em>");
                                var tempHtml = ele.html().replace(tempNode.trim(), temp);
                                return tempHtml;
                            });
                        }

                    });
                    if ($(".quick-search").length)
                        $("body,html").animate({ "scrollTop": ($(".quick-search").first().offset().top - $(window).height() + 200) }, 1);

                }
                return false;
            });
            searchCon.find("input").on("keyup", function () {
                var txt = $(this).val();
                if (txt == "") {
                    $(".quick-search").each(function (index, ele) {
                        var tempText = $(ele).text();
                        $(ele).parent().html(function () {
                            return $(this).html().replace(/<em class="quick-search">(.*)<\/em>/, tempText);
                        });
                    });
                }
            });
        });
    }(),
    getScrollbarWidth: function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'modal-scrollbar-measure'
        $(document.body).append(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        $(document.body)[0].removeChild(scrollDiv)
        return scrollbarWidth
    },
    showDialog: function (target, title) {
        //去除滚动条影响界面
        if (document.body.clientWidth < window.innerWidth) {
            var scrollbarWidth = app.getScrollbarWidth();
            $("body").css("padding-right", scrollbarWidth);
        }

        var target = $(target);
        target.show();
        if (title) {
            target.find(".title").text(title);
        }
        setTimeout(function () {
            target.find(".event-manage").addClass("dialog-open");
        }, 100);
        $("body").addClass("modal-open");
        target.trigger("dialog.show");

        target.unbind("click").on("click", function (event) {
            if (event.target.id == target.attr("id")) {
                app.dialogHide(target);
            }
        }).find('.btn[data-toggle="dialog-close"]').on("click", function () {
            if (target.find("form").length)
                target.find("form").get(0).reset();
            if (target.find(".select2-offscreen").length) {
                target.find(".select2-offscreen").select2("val", "");
            }
            target.find("input[type='hidden']").val("");
        });

        $("body").on("keydown", function (e) {
            if (e.keyCode == 27) {
                app.dialogHide(target);
            }
        });

        return false;
    },
    dialogHide: function (target) {
        target = $(target);
        target.find(".event-manage").removeClass("dialog-open");
        $("body").unbind("keydown");
        app.resetForm(target);
        setTimeout(function () {
            $("body").css({ "padding-right": 0 }).removeClass("modal-open");
            target.hide();
            //抛出接口
            target.trigger("dialog.hide");
        }, 300);
    },
    con: function () {
        $(document).on("click", '[data-toggle="con"]', function (e) {
            app.showcon($(this).data("target"));
            $(this).blur();
            return false;
        });
    }(),
    showcon: function (target) {
        var target = $(target);
        target.trigger("con.show").find(".movecontent").show().animate({ "opacity": "1" }, 200);
        setTimeout(function () {
            $("body").click(function (e) {
                if (!$(".movecontent").find($(e.target)).length && !$(e.target).hasClass("movecontent")) {
                    app.hidecon(target);
                }
            });
        }, 100);
    },
    hidecon: function (target) {
        //关闭并抛出接口
        target.trigger("con.hide").find(".movecontent").hide().css("opacity", 0);
        $("body").unbind("click");
    },
    examine: function () {
        $(document).on("click", '[data-toggle="examine"]', function (e) {

            var rows = $("#data").jqGrid('getGridParam', 'selarrrow');
            var msg = "审核";
            var _this = $(this);
            if (_this.data("msg")) {
                msg = $(this).data("msg");
            }
            if (!_this.data("multi")) {
                if (rows.length > 1) {
                    bootbox.alert(msg + "不能多选");
                    return false;
                }
            }

            if (rows.length == 0) {
                bootbox.alert("请选择需要" + msg + "的数据");
                return false;
            }
            if (_this.data("href")) {
                location.href = _this.data("href");
            }
            _this.trigger("myclick");

            return false;
        });
    }(),

    showValidate: function (element, msg) {
        var element = $("#" + element)
        if (element.next(".help-block").length) {
            element.next(".help-block").text(msg).show().parent().parent().removeClass("has-success").addClass("has-error");
        } else {
            element.after("<span class='help-block'>" + msg + "</span>").parent().parent().removeClass("has-success").addClass("has-error");
        }
    },
    validateJson: function (json) {
        if (json.responseResult) {
            if (typeof (json.responseResult.error) != "undefined") {
                for (var i = 0; i < json.responseResult.error.length; i++) {
                    app.showValidate(json.responseResult.error[i].element, json.responseResult.error[i].msg);
                }
            }

        } else if (json.msg) {
            bootbox.alert(json.msg);
            app.resetForm($(".dialog-open"));
            app.dialogHide($(".main-dialog"));
        }
    },
    dropdown: function () {
        $(function () {
            $('.dropdown').each(function (index, ele) {
                var _this = $(ele);
                _this.on("click", "li", function () {
                    _this.removeClass("open");
                    _this.find("a[data-toggle=dropdown]").html($(this).find("a").text() + ' <b class="caret"></b>');
                    return false;
                })
            });
        });
    }(),
    resetForm: function (ele) {
        if (ele.find(".title:contains(筛选)").length) {
            return;
        }
        if (ele.find(".form-group").length) {
            ele.find(".form-group").removeClass("has-error").removeClass("has-success").end().find(".help-block").remove();
            if (ele.find("form").length)
                ele.find("form").get(0).reset();
            if (ele.find(".select2-offscreen").length) {
                ele.find(".select2-offscreen").select2("val", "");
            }
            ele.find("input[type='hidden']").val("");
        }
    },
    data: function () {
        Date.prototype.format = function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(), //day
                "h+": this.getHours(), //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                "S": this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }
    }()
};
var gridFlag = gridFlag2 = false;