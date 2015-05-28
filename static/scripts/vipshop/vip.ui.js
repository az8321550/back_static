UI = {
	initUI : function(_box){
		UI.flushTheme();
		var $p = $(_box || document);
		// init styles
		$("input[type=text], input[type=password], textarea", $p).addClass("textInput").focusClass("focus");

		$("input[readonly], textarea[readonly]", $p).addClass("readonly");
		$("input[disabled=true], textarea[disabled=true]", $p).addClass("disabled");

		$("input[type=text]", $p).not("div.tabs input[type=text]", $p).filter("[alt]").inputAlert();

		//Grid ToolBar
		$("div.panelBar li, div.panelBar", $p).hoverClass("hover");

		//Button
		$("div.button", $p).hoverClass("buttonHover");
		$("div.buttonActive", $p).hoverClass("buttonActiveHover");
		
		//tabsPageHeader
		$("div.tabsHeader li, div.tabsPageHeader li, div.accordionHeader, div.accordion", $p).hoverClass("hover");
		
		
		
		
		$("div.pagination", $p).each(function(){
			var $this = $(this);
			var key = $this.attr('id');
			if(key&&$('body').data(key)){
				return ;
			}
			var p = $this.pagination({
				targetType:$this.attr("targetType"),
				rel:$this.attr("rel"),
				totalCount:$this.attr("totalCount"),
				numPerPage:$this.attr("numPerPage"),
				pageNumShown:$this.attr("pageNumShown"),
				currentPage:$this.attr("currentPage")
			});
			if(key){
				$('body').data(key,p);
			}
		});
		//tables
		if($.fn.jTable) $("table.table", $p).jTable();
		if($.fn.cssTable) $('table.list',$p).cssTable();
		//if($.fn.combox) $("select.combox",$p).combox();
		if ($.fn.pagerForm) $("form[rel=pagerForm]", $p).pagerForm({parentBox:$p});
		if ($.fn.datepicker){
			$('input.date', $p).each(function(){
				var $this = $(this);
				var opts = {};
				if ($this.attr("dateFmt")) opts.pattern = $this.attr("dateFmt");
				if ($this.attr("minDate")) opts.minDate = $this.attr("minDate");
				if ($this.attr("maxDate")) opts.maxDate = $this.attr("maxDate");
				if ($this.attr("mmStep")) opts.mmStep = $this.attr("mmStep");
				if ($this.attr("ssStep")) opts.ssStep = $this.attr("ssStep");
				$this.datepicker(opts);
			});
		}
		if($.fn.tabs){
			//auto bind tabs
			$("div.tabs", $p).each(function(){
				var $this = $(this);
				var options = {};
				options.currentIndex = $this.attr("currentIndex") || 0;
				options.eventType = $this.attr("eventType") || "click";
				$this.tabs(options);
			});
		}
		if($('#alertBackground').size()<1){
			
			$('body').append('<div id="alertBackground" class="alertBackground"></div>');
		}
		if($('#dialogBackground').size()<1){
			$('body').append('<div id="dialogBackground" class="dialogBackground"></div>');
		}
		
	},
	showMask:function(msg){
		var tempMsg = msg||"数据加载中，请稍等...";
		if($('#background').size()<1){
			$('body').append('<div id="bodyMask"><div id="background" class="background"></div><div id="progressBar" class="progressBar" >'+tempMsg+'</div></div>');
		} else {
			$('#progressBar').html(tempMsg);
			$('#bodyMask').show();
		}
	},
	hideMask:function(){
		$('#bodyMask').hide();
	},
	initLayout:function(){
		//用于主框架页
		$('div.page>div.pageContent').height($(window).height()-$('div.searchBar').height()).find('[layoutH]').layoutH();
	},//切换主题
	flushTheme:function(){
		var p = {};
		var strcookie=document.cookie;
		
		//将多cookie切割为多个名/值对
		var arrcookie=strcookie.split("; ");
		for(var i=0;i<arrcookie.length;i++){
			var pstr = arrcookie[i].split('=');
			p[pstr[0]]=pstr[1]; 
		}
		var _themeHref = p.themeDir+'#theme#/style.css';
		var theme =  _themeHref.replace("#theme#", p.theme);
		
		$("head").find("link[href$='style.css']").attr("href",theme);
	}
		
}