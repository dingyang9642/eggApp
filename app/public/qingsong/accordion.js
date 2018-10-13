/**
*@description accordion组件
*@author by dengxiaoming 
*@update 2011.9.1
*/
;(function($){
    //简单的模版引擎
    var RenderTlp = function(template,data,label) {
        var t = String(template),
            s = label || /&\{([^}]*)\}/mg,
            trim = String.trim || function(str){
                return str.replace(/^\s+|\s+$/g, '')
            };
        return t.replace(s, function(value,name){
            //从模板获取name,容错处理
            return value = data[trim(name)];
        });
    };
	//静态方法
	$.Accordion = function(container,settings){
		this.element = container;
		this.settings = settings;
		this.regx = /&\{([^}])*\}/;
		this.headers = null;
		this._init();
	};
	$.Accordion.prototype = {
		_init:function(){
			this._create();
			
		},
		_create:function(){
			var o = this.settings;
			var self = this;
			this.element.addClass('accordion-wrap');
			//如果dataUrl不为空则表示，数据由ajax获取
			if(o.dataUrl !=''){   
				$.ajax({
					type: o.ajaxType,
					dataType:"json",
					url: o.dataUrl,
					data:o.dataParam,
					cache:false,
					success: function(data){ //由ajax获取数据渲染页面
						render(data);
					},
					error: function(){
					}
				});
			}else{   //静态数据渲染页面
				render(o.items);
			};
			
			//具体渲染页面的函数
			function render(data){
                self.element.empty();
				$.each(data,function(i,v){
					//创建accordion 头
					var disable = v.disable ? v.disable :false;
                    /**
                     * @update 2011-9-24
                     * 修正了模版渲染，可以传入多个参数     $(RenderTlp(o.titleTlp,v))
                     */
					var header = $(RenderTlp(o.titleTlp,v)).addClass('wke-accordion-header').attr('id',v.id).appendTo(self.element);
					var content = $('<div/>').addClass('wke-accordion-content').appendTo(self.element);
					//创建accordion内容
					if($.isArray(v.subMenu)){ //有二级菜单，并且提供了回调函数
						var subMenuWrap = $('<ul/>').addClass('wke-accordion-submenu').appendTo(content);
						$.each(v.subMenu,function(index,item){
							var submenu = $(o.submenuTlp.replace(self.regx,item.title)).attr('id',item.id).addClass('wke-accordion-submenu').appendTo(subMenuWrap);
							if(!o.notAllowClick){
								submenu.bind('click.according',function(event){
									if(typeof o.onClickSubMenu == 'function'){  //如果用户定义了回调函数
										o.onClickSubMenu.call(this,$(this),event);
									};
								})
							}
						});
					}else{
						content.addClass('wke-accordion-content-inner').html(v.con);
					};
				});
				/**
				*可以在数据都填充完后绑定事件
				*return 装载according 的整个父容器
				*/
				if(typeof o.onFinished == 'function'){
					o.onFinished.call(self,self.element);
				};   //alert(o.active);
				//绑定事件
				self._bindEvt();
			};
			
			
			
		},
		_bindEvt:function(){
			var o = this.settings;
			var self = this;
			
			//all headers
			this.headers = this.element.find('.wke-accordion-header')
				.bind( "mouseenter.accordion", function() {									
					if ( $(this).attr('disable') == 'true' ) {
						return;
					}
					$( this ).addClass( "wke-accordion-header-active" );
				})
				.bind( "mouseleave.accordion", function() {
					if ( $(this).attr('disable') == 'true' ) {
						return;
					}
					$( this ).removeClass( "wke-accordion-header-active" );
				})
				.bind( "focus.accordion", function() {
					if ( $(this).attr('disable') == 'true' ) {
						return;
					}
					$( this ).addClass( "wke-accordion-header-focus" );
				})
				.bind( "blur.accordion", function() {
					if ( $(this).attr('disable') == 'true' ) {
						return;
					}
					$( this ).removeClass( "wke-accordion-header-focus" );
				});
			if(!o.notAllowClick){
				this.headers.bind(o.evtType + '.accordion',function(event){
					var currentHeader = $(this).addClass( "wke-accordion-header-selected" ).attr('disable',true)
									.siblings().attr('disable',false).removeClass( "wke-accordion-header-active wke-accordion-header-selected" );
					if(typeof o.onClickMainMenu == 'function'){  //点击主菜单是否绑定了事件
						o.onClickMainMenu.call(this,$(this));
					};
					if(o.animate){ //支持动画
						if(o.collapsible){  //是否点击自身，对应的内容收起
							if(self.activeHead.attr('class') === $(this).attr('class')){  //点击了本身
								var toShow = $(this).next();
								if(toShow.css('display') == 'none'){
									toShow.slideDown();
									$(this).addClass( "wke-accordion-header-active wke-accordion-header-selected" )
								}else{
									toShow.slideUp();
									$(this).attr('disable',false).removeClass( "wke-accordion-header-active wke-accordion-header-selected" )
								};
							}else{ //未点击了本身
								currentContent = $(this).next().slideDown()
									.siblings('.wke-accordion-content').hide();
							}
						}else{ //不支持点击本身收起，但是支持动画
							currentContent = $(this).next().slideDown()
							   .siblings('.wke-accordion-content').hide();
						}
						
					}else{  //不支持动画收起展开
						$(this).next().show().siblings('.wke-accordion-content').hide();
					}
					self.activeHead = $(this);
					if(event){
						event.stopPropagation();
					};
				});
			}
			//active header
			this.activeHead = this.headers.eq( o.active ).addClass( "wke-accordion-header-active" ).attr('disable',true);
			//active contents
			if(!this.settings.defaultCollapsed){
				this.activeHead.next().addClass( "wke-accordion-content-active" );
			}
			
			
			
			
		},
		_createIcons: function() {
				$( "<span></span>" )
					.addClass( "ui-icon " + options.icons.header )
					.prependTo( this.headers );
				this.active.children( ".ui-icon" )
					.toggleClass(options.icons.header)
					.toggleClass(options.icons.headerSelected);
				this.element.addClass( "ui-accordion-icons" );
		},
        distroy:function(){

        }
	};
	//add plugin
	$.extend($.fn,{
		accordion:function(settings){
			//默认参数
			var defaults = {
				/**
				*@description accordion的数据是根据传入的items来进行页面渲染的
				*@param {array} 传入的items必须为array类型
				*@param 每个array的子元素是object类型 
				*@param {string} title accordion 点击的header的标题
				*@param {string }  con header对应的con(支持html标签)
				*@param {array} subMenu 二级菜单（如果有的话）,二级菜单可以传入回调函数
				*/
				items:[                                                   //according数据
					/*{title:'section1',con:'<ul><li>menu1</li><li>menu2</li></ul>'},
					{title:'section2',con:'你好测试'},
					{title:'section3',con:['menu1','menu2'],subMenu:[
							{title:'submenu1',id:''},
							{title:'submenu2',id:''}
						]
					},
					{title:'section4',con:'Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate. '},
					{title:'section5',con:'<ul><li>menu1</li><li>menu2</li></ul>'},
					{title:'section6',con:'Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate. '}*/
				],
				dataUrl:'',                                          //可以支持ajax获取数据填充
				active:0,                                            //默认第几个展开调函数
				evtType:'click',                                     //触发事件类型
				ajaxType:'GET',                                      //ajax类型
				dataParam:'',                                        //ajax参数
				onClickSubMenu:'',                                   //点击二级按钮时候可以绑定事件
				onClickMainMenu:'',                                  //点击主菜单按钮时候可以绑定事件
				onFinished:'',                                       //如果是ajax获取数据，ajax完成后可以绑定改事件
				animate:true,                                        //content展开时是否需要动画效果
				collapsible:true,                                    //是否支持点击自己，对应的内容收起
				titleTlp:'<h3><span class="wke-accordion-icon"></span><span>&{title}</span></h3>',              //title模版
				submenuTlp:'<li>&{title}</li>'
				
			};
			//继承参数
			settings = $.extend({},defaults,settings);
			return this.each(function(){
                var accordion = null;
                //如果没有实例化，则实例化
                accordion = new $.Accordion($(this),settings);
			});
		}
	});	   
})(jQuery)