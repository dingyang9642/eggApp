/**
*@author by dengxiaoming
*expand jquery ui component
*date 2011-08-09
*/
(function($){
	//set namespace
	$WKE = window.$WKE || {};
	/**
	*expand jquery ui dialog 
	*@param {json} opts ,api same to jquery ui api
	*@param {string} url,the content page you want to show  
	*/
	$WKE.dialog = function(opts,url){
		if(!$('.ui-dialog').attr('role')){    //no dialog layer ,create a dialog
			//var dialogContainer = $('<div  title="Basic modal dialog" class="wke-dialog"><iframe src="'+ url +'" frameborder="0" height="100%" width="100%" scrolling="no"></iframe></div>');
			var dialogContainer = $('<div  title="Basic modal dialog" class="wke-dialog"></div>');
			//if the content of url isn't completed,the content of dialogContaier will be always 'loading' 
			dialogContainer.html('loading...');
            dialogContainer.load(url);
			//dialogContainer.load('<iframe src="'+ url +'" frameborder="0" height="100%" width="100%" scrolling="no"></iframe>')
			$(dialogContainer).dialog(opts);
		}else{   //if dialog has exsited, we need remove the old one
			$('.ui-dialog').remove();
			$('.wke-dialog').remove();
			//var dialogContainer = $('<div class="wke-dialog" title="Basic modal dialog"><iframe src="'+ url +'" frameborder="0" height="100%" width="100%" scrolling="no"></iframe></div>');
			var dialogContainer = $('<div  title="Basic modal dialog" class="wke-dialog"></div>');
			
			dialogContainer.html('loading...');
            dialogContainer.load(url);
			$(dialogContainer).dialog(opts);
		};
	}
	
	/**
	*@description 正在加载层
	*/
	$WKE.overlay = {};
	$.extend($WKE.overlay,{
		defaults:{
			loadingText:'正在加载...'
		}
	});
	/**
	*将overlay函数挂到jquery对象上
	*/
	$.fn.extend({
		overlay:function(setting){
			setting = $.extend({},$WKE.overlay.defaults,setting);
			//创建遮罩层提示层
			function createDom(){
				var $el =  $('<div></div>').attr({id:"wke-load"})
						.appendTo(document.body)
						.css({
							width: winWidth(),
							height: winHeight(),
							opacity:0.3,
							position:'absolute',
							top:0,
							left:0,
							textAlign:'center',
							filter:'alpha(opacity=30)',
							background:'#AAAAAA'
						});
				//创建loading图片以及文字提示层
				var loadingImg = $('<div><image src="loading.gif"/><span>正在加载……</span></div>')
								.css({
									height:30,
									width:120,
									position:'absolute',
									top:((parseInt(winHeight()) - 30) /2),
									left:  (parseInt(winWidth()) - 100) /2 
								}).appendTo($el);
				//浏览器窗口大小有改变的时候，遮罩提示层尺寸重新计算
				$(window).bind('resize.ajax-overlay', function(){
					$el.css({
						width: winWidth(),
						height: winHeight()
					});
				});
			};
			
			var winHeight = function() {
				var scrollHeight,
					offsetHeight;
				// handle IE 6
				if ($.browser.msie && $.browser.version < 7) {
					scrollHeight = Math.max(
						document.documentElement.scrollHeight,
						document.body.scrollHeight
					);
					offsetHeight = Math.max(
						document.documentElement.offsetHeight,
						document.body.offsetHeight
					);
		
					if (scrollHeight < offsetHeight) {
						return $(window).height() + 'px';
					} else {
						return scrollHeight + 'px';
					}
				// handle "good" browsers
				} else {
					return $(document).height() + 'px';
				}
			};
		
			var winWidth = function() {
				var scrollWidth,
					offsetWidth;
				// handle IE
				if ( $.browser.msie ) {
					scrollWidth = Math.max(
						document.documentElement.scrollWidth,
						document.body.scrollWidth
					);
					offsetWidth = Math.max(
						document.documentElement.offsetWidth,
						document.body.offsetWidth
					);
		
					if (scrollWidth < offsetWidth) {
						return $(window).width() + 'px';
					} else {
						return scrollWidth + 'px';
					}
				// handle "good" browsers
				} else {
					return $(document).width() + 'px';
				}
			};
			//移除遮罩
			function removeDom(){
				$('#wke-load').remove( );
			};
			return {
				createDom:createDom,
				removeDom:removeDom
			};
		}
	});
	
	/**
	*reset $.ajax 
	*/
	$.fn.extend({
		WKEAjax:function(opts){
			/**
			*发送ajax请求
			*/
			var _this =this;
			var defaults = {
				dataType: opts.dataType,
				type: opts.type,
				cache: opts.cache,
				data:opts.data || '',
				url: opts.url,
				beforeSend: function(XMLHttpRequest){
					/**
					*创建loading层
					*/
					$.fn.overlay().createDom();
					
					
					
					if( typeof opts.beforeSend == 'function'){
						opts.beforeSend(XMLHttpRequest);
					};
				},
				success: function(data, textStatus){
					/**
					*移除loading层
					*/
					$.fn.overlay().removeDom();
					if( typeof opts.success == 'function'){
						opts.success(data, textStatus);
					};
				},
				complete: function(XMLHttpRequest, textStatus){
					if( typeof opts.complete == 'function'){
						opts.complete(XMLHttpRequest, textStatus);
					};
				},
				error: function(xhr,status,err){
					/**
					*移除loading层
					*/
					$.fn.overlay().removeDom();
					var errHeader= xhr.errorHeader||"erron-info";
					var errMsg = decodeURI(xhr.getResponseHeader(errHeader));
					if( typeof opts.error == 'function'){
						opts.error(xhr,status,errMsg || err);
					};
				}
			};
			$.ajax(defaults);
		}
	});	
	
	
})(jQuery)
		