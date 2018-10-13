/*
 * @name:msgtip
 * @auth:liguang01
 * @depend jquery-1.6.2.js, white.msgtip.css
 * @param url,通过ajax返回的html内容添加到tip里面。html为dom结构。直接将dom结构放到tip里面，url和html只能有一个。
 * @param theme 主题，自己可以写主题，主要是边框颜色。当然也可以写容器宽度等。
 * @param arrowPos 箭头位置，left top, right top, left bottom, right bottom 
 */
(function($){
	var _defaults = {
		url:"",			//将ajax返回的内容添加到内容区。
		html:"",		//html为要放入提示框的jquery结点。
		theme:"",
		arrowPos:"left",
		arrowPosY:"top"
	};
	
	var Msgtip = function(op, el){
		this.$msgtip = $("<div>").addClass("ui-msgtip");
		this.$arrow = $("<div>").addClass("arrow");
		this.$con = $("<div>").addClass("con");
		this.op = op;
		this.root = el;
		
		this.op.theme && this.$msgtip.addClass(op.theme);
		this.$arrow.addClass(this.op.arrowPos ? this.op.arrowPos : "left");
		this.$arrow.addClass(this.op.arrowPosY ? this.op.arrowPosY : "top");
		
		this.$msgtip.append(this.$arrow, this.$con);
		this.$arrow.append('<em class="arrow-border">◆</em><em class="arrow-con">◆</em>');
		
		$("body").append(this.$msgtip);
	};
	Msgtip.prototype = {
		setMsgtipPos:function(target){
			var op = this.op;
			var el = target || this.root;
			var posObj = {"left":"auto", "right":"auto","bottom":"auto", "top":"auto"}
			var left = $(el).offset().left;
			
			var right = $("body").width() - (left + $(el).width());
			
			var top = $(el).offset().top;
				top = top + $(el).height() + 10;
				
			
			if( op.arrowPos === "right" ){
				this.$msgtip.css( $.extend( {}, posObj,{"right":right,"top":top} ) );
			}else{
				this.$msgtip.css( $.extend( {}, posObj, {"left":left, "top":top}) );
			}
			if(op.arrowPosY === "bottom"){
				top = $(el).offset().top - this.$msgtip.innerHeight() - 10;
				this.$msgtip.css( $.extend( {}, posObj, {"right":right, "top":top}) );
			}
			
			return this;
		},
		setMsgtipConByThis:function(input){
			if($(input).is(":input")){
				this.$con.html($(input).attr("msgtip"));
			}else{
				this.$con.html(input);
			}
		},
		setMsgtipConByAjax:function(url, finish){
			var msgtipObj = this;
			if(url){
				$.ajax({
					url:url,
					type:"get",
					cache:false,
					dataType:"text",
					success:function(data){
						msgtipObj.$con.html(data);
						finish.call(msgtipObj);
					}
				});
			}
		},
		setMsgtipConByHtml:function(html){
			if(html){
				this.$con.empty().append(html);
			}
		},
		setArrowPos:function(pos){
			this.$arrow.addClass(pos)
		},
		setMsgtipWidth:function(w){
			this.$con.width(w);
		},
		setMsgtipHeight:function(h){
			this.$con.height(h);
		},
		setHandleText:function(str){
			$(this.root).find("b").text(str);
		},
		addHandleClass:function(classStr){
			var $root = $(this.root);
			!$root.hasClass(classStr) && $root.addClass( classStr );
		},
		removeHandleClass:function(classStr){
			var $root = $(this.root);
			$root.hasClass(classStr) && $root.removeClass( classStr );
		},
		hide:function(){
			this.$msgtip.hide();
		},
		show:function(){
			this.$msgtip.show();
			//this.setMsgtipPos();
		},
		destroy:function(){
			this.$msgtip.remove();
		},
		toggle:function(){
			if(this.$msgtip.is(":visible")){
				this.$msgtip.hide();
			}else{
				this.setMsgtipPos();
				this.$msgtip.show();
			}
		}
	}
	
	var methods = {
		init:function(options){
			var op = $.extend({}, _defaults, options);
			
			var msgtipObj = !$.data(this, "msgtip") ? ( new Msgtip( op, this ) ) : $.data(this, "msgtip");
				op.width && msgtipObj.setMsgtipWidth(op.width);
				op.height && msgtipObj.setMsgtipHeight(op.height);
			$.data(this, "msgtip", msgtipObj);
			
			if( !op.html && !op.url && $(this).is(":input") ){
				msgtipObj.setMsgtipConByThis(this);
			}
			if(op.html){
				msgtipObj.setMsgtipConByHtml(op.html);
			}
			if(op.url){
				msgtipObj.setMsgtipConByAjax(op.url);
			}
			msgtipObj.setMsgtipPos();
			msgtipObj.hide();
		},
		setMsgtipPos:function(target){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setMsgtipPos(target);
			}
		},
		//输入框提示信息时使用
		setMsgtipConByThis:function(input){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setMsgtipConByThis(input);
				msgtipObj.setMsgtipPos();
			}
		},
		setMsgtipConByAjax:function(url, success){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setMsgtipConByAjax(url, function(){
					msgtipObj.setMsgtipPos();
					success&&success();
				});
			}
		},
		setMsgtipConByHtml:function(html){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setMsgtipConByHtml(html);
				msgtipObj.setMsgtipPos();
			}
		},
		setArrowPos:function(arrow){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setArrowPos(arrow);
			}
		},
		setMsgtipWidth:function(w){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setMsgtipWidth(w);
			}
		},
		setMsgtipHeight:function(h){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setMsgtipHeight(h);
			}
		},
		setHandleText:function(str){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.setHandleText(str);
			}
		},
		addHandleClass:function(classStr){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.addHandleClass(classStr);
			}
		},
		removeHandleClass:function(classStr){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.removeHandleClass(classStr);
			}
		},
		show:function(){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.show();
			}	
		},
		hide:function(){
			var msgtipObj = $.data(this, "msgtip");
			
			if( msgtipObj ){
				msgtipObj.hide();
			}
		},
		destroy:function(){
			var msgtipObj = $.data(this, "msgtip");
			
			if( msgtipObj ){
				msgtipObj.destroy();
			}
		},
		toggle:function(){
			var msgtipObj = $.data(this, "msgtip");
			if( msgtipObj ){
				msgtipObj.toggle();
			}
		}
		
	};
	$.fn.msgtip = function(method){
		var args = arguments;
		return this.each(function(){
			if(methods[method]){
				return methods[method].apply(
					this,
					Array.prototype.slice.call(args, 1)
				);
			}else if(typeof method == "object" || !method){
				return methods.init.apply(this, args);
			}
		});
	}
})(jQuery)


