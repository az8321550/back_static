/**
 * @author ZhangHuihua@msn.com
 */
$.setRegional("alertMsg", {
	title:{error:"错误", info:"提示信息", warn:"警告", correct:"成功", confirm:"确认信息"},
	butMsg:{ok:"确定", yes:"是", no:"否", cancel:"取消"}
});
VIP.frag['alertButFrag']='<li><a class="button" rel="#callback#" onclick="alertMsg.close()" href="javascript:"><span>#butMsg#</span></a></li>';
VIP.frag['alertBoxFrag']='<div id="alertMsgBox" class="alert"><div class="alertContent"><div class="#type#"><div class="alertInner"><h1>#title#</h1><div class="msg">#message#</div></div><div class="toolBar"><ul>#butFragment#</ul></div></div></div><div class="alertFooter"><div class="alertFooter_r"><div class="alertFooter_c"></div></div></div></div>';

var alertMsg = {
	_boxId: "#alertMsgBox",
	_bgId: "#alertBackground",
	_closeTimer: null,

	_types: {error:"error", info:"info", warn:"warn", correct:"correct", confirm:"confirm"},

	_getTitle: function(key){
		return $.regional.alertMsg.title[key];
	},

	_keydownOk: function(event){
		if (event.keyCode == VIP.keyCode.ENTER) event.data.target.trigger("click");
		return false;
	},
	_keydownEsc: function(event){
		if (event.keyCode == VIP.keyCode.ESC) event.data.target.trigger("click");
	},
	/**
	 * 
	 * @param {Object} type
	 * @param {Object} msg
	 * @param {Object} buttons [button1, button2]
	 */
	_open: function(type, msg, buttons){
		$(this._boxId).remove();
		var butsHtml = "";
		var closeByUser = false;
		if (buttons) {
			for (var i = 0; i < buttons.length; i++) {
				if(buttons[i].call){
					closeByUser = true;
				}
				var sRel = buttons[i].call ? "callback" : "";
				butsHtml += VIP.frag["alertButFrag"].replace("#butMsg#", buttons[i].name).replace("#callback#", sRel);
			}
		}
		var boxHtml = VIP.frag["alertBoxFrag"].replace("#type#", type).replace("#title#", this._getTitle(type)).replace("#message#", msg).replace("#butFragment#", butsHtml);
		$(boxHtml).appendTo("body").css({top:-$(this._boxId).height()+"px"}).animate({top:"0px"}, 500);
				
		if (this._closeTimer) {
			//clearTimeout(this._closeTimer);
			this._closeTimer = null;
		}
		if ((this._types.info == type || this._types.correct == type)&&
				!closeByUser){
			
			this._closeTimer = setTimeout(function(){alertMsg.close()}, 2500);
		} else {
			$(this._bgId).show();
		}
		
		//用于屏蔽点击回车，触发click事件，再次打开alert
		$('<input type="text" style="width:0;height:0;" name="_alertFocusCtr"/>').appendTo(this._boxId).focus().hide();
		
		var jButs = $(this._boxId).find("a.button");
		var jCallButs = jButs.filter("[rel=callback]");
		var jDoc = $(document);
		
		for (var i = 0; i < buttons.length; i++) {
			if (buttons[i].call) jCallButs.eq(i).click(buttons[i].call);
			if (buttons[i].keyCode == VIP.keyCode.ENTER) {
				jDoc.bind("keydown",{target:jButs.eq(i)}, this._keydownOk);
			}
			if (buttons[i].keyCode == VIP.keyCode.ESC) {
				jDoc.bind("keydown",{target:jButs.eq(i)}, this._keydownEsc);
			}
		}
	},
	close: function(){
		$(document).unbind("keydown", this._keydownOk).unbind("keydown", this._keydownEsc);
		$(this._boxId).animate({top:-$(this._boxId).height()}, 300, function(){
			$(this).remove();
		});
		$(this._bgId).hide();
	},
	error: function(msg, options) {
		this._alert(this._types.error, msg, options);
	},
	info: function(msg, options) {
		this._alert(this._types.info, msg, options);
	},
	warn: function(msg, options) {
		this._alert(this._types.warn, msg, options);
	},
	correct: function(msg, options) {
		this._alert(this._types.correct, msg, options);
	},
	_alert: function(type, msg, options) {
		var op = {okName:$.regional.alertMsg.butMsg.ok, okCall:null};
		$.extend(op, options);
		var buttons = [
			{name:op.okName, call: op.okCall, keyCode:VIP.keyCode.ENTER}
		];
		this._open(type, msg, buttons);
	},
	/**
	 * 
	 * @param {Object} msg
	 * @param {Object} options {okName, okCal, cancelName, cancelCall}
	 */
	confirm: function(msg, options) {
		var op = {okName:$.regional.alertMsg.butMsg.ok, okCall:null, cancelName:$.regional.alertMsg.butMsg.cancel, cancelCall:null};
		$.extend(op, options);
		var buttons = [
			{name:op.okName, call: op.okCall, keyCode:VIP.keyCode.ENTER},
			{name:op.cancelName, call: op.cancelCall, keyCode:VIP.keyCode.ESC}
		];
		this._open(this._types.confirm, msg, buttons);
	}
};

