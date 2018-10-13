/*
* $WKEDialog
* version: 1.0.0 (08/16/2011)
* dependence jquery-1.6.2.min.js  
* dependence WKE.bgiframe.js    解决ie6下，dialogbug。
*/
(function($) {
	$.$WKEDialog = $.$WKEDialog || {};
	//alert
	$.$WKEDialog.alert = function(settings){
		settings = $.extend({},settings);
		var html = '';
		/**
		*@description 根据传入的alertType动态创建需要显示的内容
		*@param alertType:'normal'  'error'   'info'  'question'  'warning'
		*/
		switch(settings.alertType){
			case 'normal':
				html = settings.content;
				break;
			case 'error':
				html = '<div><div class="WKE-messager-icon WKE-messager-error"></div><div class="WKE-message-con">'+ settings.content +'</div><div style="clear:both;"></div></div>';
				break;
			case 'info':
				html = '<div><div class="WKE-messager-icon WKE-messager-info"></div><div class="WKE-message-con">'+ settings.content +'</div><div style="clear:both;"></div></div>';
				break;
			case 'question':
				html = '<div><div class="WKE-messager-icon WKE-messager-question"></div><div class="WKE-message-con">'+ settings.content +'</div><div style="clear:both;"></div></div>';
				break;
			case 'warning':
				html = '<div><div class="WKE-messager-icon WKE-messager-warning"></div><div class="WKE-message-con">'+ settings.content +'</div><div style="clear:both;"></div></div>';
				break;
			default:
				break;
		};
		$.fn.$WKEDialog({
			title:settings.title || '这里是标题',
			dialogType:'alert',
			content: html,
			html:true,
			btn:[
					{
						title:'确定',
						onClickBind:function(container){
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
						}
					}
				]
		});
	};
	//confirm
	$.$WKEDialog.confirm = function(settings){
		settings = $.extend({},settings);
		$.fn.$WKEDialog({
			title:settings.title || '这里是标题',
			dialogType:'confirm',
			content:settings.content,
			html:true,
			btn:[
					{
						title:'确定',
						onClickBind:function(container){
							//如果用户在点击确定的时候绑定了事件，则执行
							if(typeof settings.bindOkHandle == 'function'){
								settings.bindOkHandle.call(this,$(this));
							};
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
							
						}
					},
					{
						title:'取消',
						onClickBind:function(container){
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
						}
					}
				]
		});
	};
	//prompt
	$.$WKEDialog.prompt = function(settings){
		settings = $.extend({},settings);
		$.fn.$WKEDialog({
			title:settings.title || '这里是标题',
			dialogType:'prompt',
			content:'<div><div class="WKE-messager-icon WKE-messager-info"></div><div class="WKE-message-con">'+ settings.content +'</div><div style="clear:both;"></div></div><input type="text" class="wke-messager-input" value="'+settings.value+'">',
			html:true,
			btn:[
					{
						title:'确定',
						onClickBind:function(container){
							var returnValue = true;
							//如果用户在点击确定的时候绑定了事件，则执行
							if(typeof settings.bindOkHandle == 'function'){
								var inputValue = $('input.wke-messager-input').val();
								returnValue = settings.bindOkHandle.call(this,$(this),inputValue);
							};
							//相当是点击了关闭按钮
							if(returnValue != false)
								$('.WKE-dialog-close').trigger('click');
							
						}
					},
					{
						title:'取消',
						onClickBind:function(container){
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
						}
					}
				]
		});
	};
	
	
	//normal
	$.$WKEDialog.message = function(settings){
		settings = $.extend({},settings);
		$.fn.$WKEDialog({
			title:settings.title || '这里是标题',
			content:settings.content,
			width:settings.width,
			loadUrl:settings.loadUrl,
			html:false,
			btn:[
					{
						title:'确定',
						onClickBind:function(container){
							//默认状态是true，即可以提交
							var flag = true;
							//如果用户在点击确定的时候绑定了事件，则执行
							if(typeof settings.bindOkHandle == 'function'){
								//如果回调函数有返回值，并且返回值为boolean，则讲返回值赋值给 flag
								var returnResult = settings.bindOkHandle.call(this,$(this));
								if(typeof returnResult == 'boolean'){
									flag = returnResult;
								};
							};
							//相当是点击了关闭按钮
							(flag == true) ? $('.WKE-dialog-close').trigger('click'):'';
							
						}
					},
					{
						title:'取消',
						onClickBind:function(container){
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
						}
					}
				]
		});
	};
	
	
	//add a pluign
	$.extend($.fn,{
		$WKEDialog:function(settings){
			var defaults = {
				dialogType:'alert',
				width:400,
				height:'auto',
				loadUrl:'',
				zIndex:10000,
				modual:false,
				dragAble:true,
				content:'',
				html:false,  //是否可以传入html元素作为内容，默认为否
				modal:true,    //是否支持模态
				title:'my title',
				loadPage:'',
				btn:[
					{
						title:'cancel',
						onClickBind:function(){
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
						}
					},
					{
						title:'ok',
						onClickBind:function(){
							//相当是点击了关闭按钮
							$('.WKE-dialog-close').trigger('click');
						}
					}
				]
			};
			settings = $.extend({},defaults,settings);
			//装载dialog的容器
			var container = $('<div></div>').addClass('WKE-dialog-container').appendTo($(document.body)).css({'width':settings.width,'height':settings.height,'zIndex':settings.zIndex});
			//如果是ie6，需要在dialog容器下面建一个跟容易一样大小的iframe
			if ($.fn.bgiframe) {
				container.bgiframe();
			};
			//title
			var title = $('<div></div>').addClass('WKE-dialog-title').appendTo(container);
			if(settings.title != ''){
				title.text(settings.title);
			};
			//con
			var conWrap = $('<div></div>').addClass('WKE-dialog-con').appendTo(container);
			//message body
			var messageBody = $('<div></div>').addClass('WKE-dialog-messageBody').appendTo(conWrap);
			
			
			//是否支持load页面
			if(settings.loadUrl != ''){
				messageBody.load(settings.loadUrl);
			}else{
				if(settings.content){
					if(settings.html){
						messageBody.html(settings.content);
					}else{
						messageBody.text(settings.content);
					};
				};
				//设定content的高度
				//conWrap.css({height:container.height()- title.height() -2});
			};
			//closeBtn
			var closeBtn = $('<span></span>').addClass('WKE-dialog-close').appendTo(title).hover(function () {
				$(this).addClass("WKE-dialog-close-hover");
			  },
			  function () {
				$(this).removeClass("WKE-dialog-close-hover");
			  }
			).click(function(){
				//将弹出提示框清除
				container.remove();
				//清除模态背景框
				if(settings.modal){
					$('.WKE-dialog-mask').remove();
				};
				if($('#WKE-dialog-iframe').length){
					$('#WKE-dialog-iframe').remove();
				}
			});
			//ok or cancel btn
			var btnWrap = $('<div></div>').appendTo(conWrap).addClass('WKE-dialog-btnWrap');
			//显示“确定”，“取消” 按钮
			$.each(settings.btn,function(index,item){
				var btn = $('<a href="javascript:void(0)"/>').append('<span>'+ item.title +'</span>').appendTo(btnWrap).bind('click',function(){
					if(typeof item.onClickBind == 'function'){
						item.onClickBind.call(this,container);
					};
				});
			});
			
			//是否模态显示
			if(settings.modal){
				var mask = $('<div></div>').remove().css({"position":"absolute","width":$(document.body).width(),"height":$(document.body).height(),"zIndex":settings.zIndex - 1,"background":"#000","opacity":0.2,"top":0,"left":0}).appendTo($(document.body)).addClass('WKE-dialog-mask');
				if( !mask.attr('id') ){
					var guid = new Date().getTime();
					mask.attr('id',guid);
				};
			};
			//提示图层的实际宽高
			var dragDivWidth = container.width(),
				dragDivHeight =container.height();
			//居中显示提示图层
			var sc = document.documentElement.scrollTop || document.body.scrollTop;
			container.css({
				'zIndex':10000,
				top:sc + $(window).height()/4,
				left:$(window).width()/2 - dragDivWidth/2
			});
			
			//container.css({'zIndex':10000,top:$(window).height()/2 - dragDivHeight/2,left:$(window).width()/2 - dragDivWidth/2})
			
			//创建可拖拽
			container.Drags({
				handler: '.WKE-dialog-title',
				onMove: function(e) {
					
				},
				onDrop:function(e){
					
				}
			});
			
		}
	});	 
	
	//拖拽
    $.fn.Drags = function(opts) {
        var ps = $.extend({
            zIndex: 20,
            opacity: .7,
            handler: null,
            onMove: function() { },
            onDrop: function() { }
        }, opts);
		
        var dragndrop = {
            drag: function(e) {
                var dragData = e.data.dragData;
                dragData.target.css({
                    left: dragData.left + e.pageX - dragData.offLeft,
                    top: dragData.top + e.pageY - dragData.offTop
                });
                dragData.handler.css({ cursor: 'move' });
                dragData.onMove(e);
            },
            drop: function(e) {
                var dragData = e.data.dragData;
                dragData.target.css({'opacity':''}); //.css({ 'opacity': '' });
                dragData.handler.css('cursor', dragData.oldCss.cursor);
                dragData.onDrop(e);
                $(document).unbind('mousemove', dragndrop.drag)
                    .unbind('mouseup', dragndrop.drop);
            }
        }
		
		
		
        return this.each(function() {
            var me = this;
            var handler = null;
            if (typeof ps.handler == 'undefined' || ps.handler == null){
                handler = $(me);
			}
			else{
                handler = (typeof ps.handler == 'string' ? $(ps.handler, this) : ps.handle);
			};
			handler.bind('mousedown', { e: me }, function(s) {
                var target = $(s.data.e);
                var oldCss = {};
                if (target.css('position') != 'absolute') {
                    try {
                        target.position(oldCss);
                    } catch (ex) { }
                    target.css('position', 'absolute');
                }
                oldCss.cursor = target.css('cursor') || 'default';
                var dragData = {
					left:target.offset().left || 0,
					top:target.offset().top || 0,
                    width: target.width() || target.getCss('width'),
                    height: target.height() || target.getCss('height'),
                    offLeft: s.pageX,
                    offTop: s.pageY,
                    oldCss: oldCss,
                    onMove: ps.onMove,
                    onDrop: ps.onDrop,
                    handler: handler,
                    target: target
                }
                target.css('opacity', ps.opacity);
                $(document).bind('mousemove', { dragData: dragData },dragndrop.drag).bind('mouseup', { dragData: dragData }, dragndrop.drop);
            });
        });
    }
})(jQuery); 