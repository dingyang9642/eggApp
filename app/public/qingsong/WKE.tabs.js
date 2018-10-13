/**
*@descript tab组件
@author by dengxiaoming 
@update 2011.8.31
@depend jquery.js 1.3+
@version 24041
1、关闭tabs生成时的缓存接口，提供单个tab缓存，默认为false（不缓存）
2、选择某个tab时，selTab(option) , 改变对象机制，参数使用$.extend(tab.item, option);


*/
var tabsArray = [];
;(function($){
	$.extend($.fn, {
		tabs:function(settings){
			var defaults = {
				renderTo:$(document.body),
				widthResizable:false,
				heightResizable:false,
				autoResizable:true,
				width:'100%',
				height:'100%',
				active:0,
				idPerfix:'wke-tabs-',     	//con默认增加的id前缀
				themeTop:"",				//对应的tab主题。
				callback:function(){}		//生成tab后的回调函数
			};
			settings = $.extend({},defaults,settings);

			return this.each(function(){
				var t = $(this)[0];
				if(!$.data( t, 'wke-tabs')){
					var tabs = new Tabs($(t), settings);
					
					$.data( t, 'wke-tabs',tabs );
					
					//继承，暴露外部接口
					$.extend($.fn,{
						'addTab':function(settings){
							tabs.addTab.call(tabs,this, settings);
						},
						'selTab':function(settings){
							tabs.selTab.call(this, settings);
						},
						'kill':function(settings){
							tabs.kill.call(tabs,this, settings);
						},
						/**
						*@description 计算当前tab的索引值
						*@param {string} id 当前tab的id
						*@return {number}
						*/
						'getTabPosition':function(id){
							return tabs.getTabPosition.call(tabs,id);
						},
						/**
						*@description 计算总tab个数
						*@return {number}
						*/
						'getTabsCount':function(){
							return tabs.getTabsCount.call(tabs);
						},
						'setTitle':function(id,title){
							tabs.setTitle.call(tabs,id,title);
						},
						'getTitle':function(id){
							return tabs.getTitle.call(tabs,id);
						}
					});
				};
			});
		}
	
	});
	
	var animate = function(config) {
		this.element = config.element;
		this.elementID = config.elementID;
		this.style = config.style;
		this.num = config.num;
		this.maxMove = config.maxMove;
		this.finishNum = "string";
		this.interval = config.interval || 10;
		this.step = config.step || 20;
		this.onFinish = config.onFinish;
		this.isFinish = false;
		this.timer = null;
		this.method = this.num >= 0;
		this.c = this.elementID ? $("#" + this.elementID) : this.element;
		this.run = function() {
			clearInterval(this.timer);
			this.fade();
			if (this.isFinish) {
				this.onFinish && this.onFinish();
			} else {
				var f = this;
				this.timer = setInterval(function() {
					f.run();
				},
				this.interval);
			}
		};
		this.fade = function() {
			if (this.finishNum == "string") {
				this.finishNum = (parseInt(this.c.css(this.style)) || 0) + this.num;
			}
			var a = parseInt(this.c.css(this.style)) || 0;
			if (this.finishNum > a && this.method) {
				a += this.step;
				if (a >= 0) {
					this.finishNum = a = 0;
				}
			} else {
				if (this.finishNum < a && !this.method) {
					a -= this.step;
					if (a * -1 >= this.maxMove) {
						this.finishNum = a = this.maxMove * -1;
					}
				}
			}
			if (this.finishNum <= a && this.method || this.finishNum >= a && !this.method) {
				this.c.css(this.style, this.finishNum + "px");
				this.isFinish = true;
				this.finishNum = "string";
			} else {
				this.c.css(this.style, a + "px");
			}
		};
	};
	
	/**
	  * @description {Class} TabPanel
	  * This is the main class of tab panel.
	  */
	var Tabs = function(container,config) {
		this.element = container;
		this.settings = config;
		//this is tab array.
		this.tabs = [];
		//this is tab object
		this.tabsObj = {};
		this.scrolled = false;
		this.tabWidth = 110 + 4;
		this.fixNum = 2;
		this.scrollFinish = true;
		this.maxzindex = 0;
		this.init();
	};
	
	Tabs.prototype = {
		//initialization
		init: function() {
			
			var self = this;
			//给总的大容器设置宽高
			this.element.css({width:this.settings.width,height:this.settings.height});
	
			var borderWidth = this.settings.border != 'none' ? 2 : 0;
			//创建tab nav
			this.tabpanel = $('<div/>').addClass('wke-tab-tabpanel').css({
				//width: this.element.width() - borderWidth,
				//height: this.element.height() - borderWidth
			}).appendTo(this.element);
			
			//如果自定义主题不为空，在tab上添加自定义class	
			this.settings.themeTop ? this.element.addClass(this.settings.themeTop) : "" ;
	
			//创建装载con的父容器
			this.tabpanel_tab_content = $('<div/>').addClass('wke-tab-nav-wrap').appendTo(this.tabpanel);
	
			//创建向左滚动的按钮
			this.tabpanel_left_scroll = $('<div/>').bind('click',function() {
				self.moveLeft();
			}).addClass('wke-tab-scroll-left wke-tab-hide').bind('mouseover',function() {
				var l = $(this);
				l.addClass('wke-tab-scroll-left_over');
				l.bind('mouseout', function() {
					l.unbind('mouseout');
					l.removeClass('wke-tab-scroll-left_over');
				});
			}).appendTo(this.tabpanel_tab_content);
	
			//construct right scroll button
			this.tabpanel_right_scroll = $('<DIV></DIV>').addClass('wke-tab-scroll-right wke-tab-hide').bind('click',function() {
				self.moveRight();
			}).bind('mouseover',function() {
				var r = $(this);
				r.addClass('wke-tab-scroll-right_over');
				r.bind('mouseout',
				function() {
					r.unbind('mouseout');
					r.removeClass('wke-tab-scroll-right_over');
				});
			}).appendTo(this.tabpanel_tab_content);
	        
			this.tabpanel_move_content = $('<DIV></DIV>').addClass('wke-tab-ul-wrap').appendTo(this.tabpanel_tab_content);
	
			this.tabpanel_mover = $('<UL></UL>').addClass('wke-tab-ul').appendTo(this.tabpanel_move_content);
	
			this.tabpanel_tab_spacer = $('<DIV></DIV>').addClass('wke-tab-spacer').appendTo(this.tabpanel_tab_content);
			
			//content div
			this.tabpanel_content = $('<DIV></DIV>').addClass('tabpanel_content').appendTo(this.tabpanel);
	
			var t_w = this.tabpanel.width();
			var t_h = this.tabpanel.height();
	
			if (this.settings.border == 'none') {
				this.tabpanel.css('border', 'none');
			}
	
			//var t_p = this.tabpanel_tab_content.css("padding-left");
			//t_p = t_p.substr(0, t_p.length - 2);
			
			//this.tabpanel_tab_content.width(t_w - parseFloat(t_p));
			//this.tabpanel_content.width(t_w - parseFloat(t_p));
	
			//遍历传入的items 
			$.each(this.settings.items,function(index,item){
				item.notExecuteMoveSee = true;
				self._create(item);
				
			});
			
			//页面一加载显示默认的被选中nav tab
			if (this.settings.active >= 0) this.show($(this.tabpanel_mover.find('li')[this.settings.active]), this.settings.items[this.settings.active]);
			
			this.update();
			
			this.settings.callback.call(self);
		},
		/**
	   * @description {Method} addTab To add a new tab.
	   * @param {Object} tabItem 创建新增加的tab nav需要的数据
	   * @param bool	isRepeatTab 是否允许创建重复的标签。
	   * @sample  //to add a new tab 
	   * addTab({id:"newtabid", 
	   *    title:"I am new" ,
	   *    html:"some new message goes here", 
	   *    closable: true, 
	   *    disabled:false, 
	   *    icon:"image/new.gif"
	   * });   
	   */
		addTab: function(source, tabItem) {
			var tabCon = $.data(source[0],"wke-tabs");
			if(tabItem.isRepeatTab){		
				tabCon._create(tabItem);
			}else{
				if( ! tabCon.tabsObj[tabItem.id] ){
					tabCon._create(tabItem) ;
				}
			}
			//显示新增加的tab
			tabCon.show(tabCon.tabpanel_mover.find('li:last'),tabItem);
			if( ! (tabCon.settings.themeTop == "lr-theme") ){
				tabCon.moveToRight();
			}
		},
		selTab:function(tabItem){
			var tabCon = $.data(this[0],"wke-tabs");
			var oldTabOption = $.data(tabCon.tabsObj[tabItem.id][0], "tabOption");
			$.data(tabCon.tabsObj[tabItem.id][0], "tabOption", tabItem );
			tabCon.show(tabCon.tabpanel_mover.find("#"+tabItem.id), tabItem, oldTabOption );
			
		},
		_create:function(tabItem){
			
			var self = this;
			var op = $.extend({
				id:'',							//tab的ID是不允许相同的。
				title:'',			
				html:'',
				cache: false, 					//单个tab是否提供缓存
				closable: false,				//是否创建关闭按钮。
				callback: function(elem){		//创建完成后调用。
				
				}
			}, tabItem) ;
			
			//创建nav的 li			
			var tab = $('<li/>').attr('id', tabItem.id)
						.appendTo(this.tabpanel_mover).bind('click',function(){
							var tabOption = $.data( this, "tabOption" );
							self.show($(this),tabOption);	
						});
						
			$.data( tab[0], "tabOption", op );
			
			this.tabs.push(tab);
			this.tabsObj[tabItem.id] = tab ;
			//增加title
			var title = $('<div/>').text(tabItem.title).appendTo(tab);
			
			var wFix = tabItem.closable == false ? 0 : 5;
			//是否显示icon
			if (tabItem.icon) { 
				title.addClass('wke-tab-icon_title').css('background-image', 'url("' + tabItem.icon + '")');
			} else {
				title.addClass('wke-tab-title');
			}
			if(tabItem.closable){ //是否创建关闭按钮
				$('<div/>').addClass('wke-tab-closer').attr('wke-tab-title', 'Close tab').appendTo(tab).click(function(){
					self.kill( self.element, tabItem.id );
				});	
			};
			
			//创建对应的con图层
			var content = $('<div/>').addClass('wke-tab-con').attr({'id': (this.settings.idPerfix + tabItem.id )}).appendTo(this.tabpanel_content);
			//当前被选中的tab nav的索引值
			var activedTabIndex = this.tabpanel_mover.children().index(this.tabpanel_mover.find('.wke-tab-active')[0]);
			//修正被选中的nav索引值，如果小于0 则赋值为0 
			if (activedTabIndex < 0) activedTabIndex = 0;
			if (this.tabs.length > activedTabIndex ) {
				tabItem.preTabId = this.tabs[activedTabIndex].id;
			}else {
				tabItem.preTabId = '';
			};
			
			this.showScroll();
			this.update();
		},
		//scroll left
		moveLeft: function() {
			if (this.scrollFinish) {
				this.disableScroll();
				this.scrollFinish = false;
				animate.apply(this, new Array({
					element: this.tabpanel_mover,
					style: 'marginLeft',
					num: this.tabWidth,
					maxMove: this.maxMove,
					onFinish: this.useableScroll
				}));
				this.run();
			}
		},
		//scroll right
		moveRight: function() {
			if (this.scrollFinish) {
				this.disableScroll();
				this.scrollFinish = false;
				animate.apply(this, new Array({
					element: this.tabpanel_mover,
					style: 'marginLeft',
					num: this.tabWidth * -1,
					maxMove: this.maxMove,
					onFinish: this.useableScroll
				}));
				this.run();
			}
		},
		//scroll to end of left side
		moveToLeft: function() {
			//no scroll button show
			if (this.scrolled && this.scrollFinish) {
				this.disableScroll();
				this.scrollFinish = false;
				var marginLeft = parseInt(this.tabpanel_mover.css('marginLeft')) * -1;
				animate.apply(this, new Array({
					element: this.tabpanel_mover,
					style: 'marginLeft',
					num: marginLeft,
					maxMove: this.maxMove,
					interval: 20,
					step: (marginLeft / 10) < 10 ? 10 : marginLeft / 10,
					onFinish: this.useableScroll
				}));
				this.run();
			}
		},
	
		//scroll to end of left side
		moveToRight: function() {
			if (this.scrolled && this.scrollFinish) {
				this.disableScroll();
				this.scrollFinish = false;
				var marginLeft = parseInt(this.tabpanel_mover.css('marginLeft')) * -1;
				var liWidth = this.tabpanel_mover.children().length * this.tabWidth;
			
				var cWidth = this.tabpanel_move_content.width();
				var num = (liWidth - cWidth - marginLeft + this.fixNum) * -1;
				animate.apply(this, new Array({
					element: this.tabpanel_mover,
					style: 'marginLeft',
					num: num,
					maxMove: this.maxMove,
					step: (num * -1 / 10) < 10 ? 10 : num * -1 / 10,
					onFinish: this.useableScroll
				}));
				this.run();
			}
		},
	
		//move to visible position
		moveToSee: function(position) {
			if (this.scrolled) {
				var liWhere = this.tabWidth * position;
				var ulWhere = parseInt(this.tabpanel_mover.css('marginLeft'));
				var moveNum;
				if (ulWhere <= 0) {
					moveNum = (ulWhere + liWhere) * -1;
					if (((moveNum + ulWhere) * -1) >= this.maxMove) this.moveToRight();
					else {
						this.disableScroll();
						this.scrollFinish = false;
						animate.apply(this, new Array({
							element: this.tabpanel_mover,
							style: 'marginLeft',
							num: moveNum,
							maxMove: this.maxMove,
							step: (moveNum / 10) < 10 ? 10 : moveNum / 10,
							onFinish: this.useableScroll
						}));
						this.run();
					}
				} else {
					moveNum = (liWhere - ulWhere) * -1;
					if ((moveNum * -1) >= this.maxMove) this.moveToRight();
					else {
						this.disableScroll();
						this.scrollFinish = false;
						animate.apply(this, new Array({
							element: this.tabpanel_mover,
							style: 'marginLeft',
							num: moveNum,
							maxMove: this.maxMove,
							onFinish: this.useableScroll
						}));
						this.run();
					}
				}
			}
		},
		//disable scroll buttons
		disableScroll: function() {
			this.tabpanel_left_scroll.addClass('wke-tab-scroll-left_disabled');
			this.tabpanel_left_scroll.attr('disabled', true);
			this.tabpanel_right_scroll.addClass('wke-tab-scroll-right_disabled');
			this.tabpanel_right_scroll.attr('disabled', true);
		},
	
		//to determin whether we can still scroll
		useableScroll: function() {
			var self = this;
			if (this.scrolled) {
				//we came to the end of left side
				if (parseInt(self.tabpanel_mover.css('marginLeft')) == 0) {
					//disble left scroll button
					self.tabpanel_left_scroll.addClass('wke-tab-scroll-left_disabled');
					self.tabpanel_left_scroll.attr('disabled', true);
					//
					self.tabpanel_right_scroll.removeClass('wke-tab-scroll-right_disabled');
					self.tabpanel_right_scroll.removeAttr('disabled');
				}
				//we came to the end of right side
				else if (parseInt(self.tabpanel_mover.css('marginLeft')) * -1 == self.maxMove) {
					self.tabpanel_left_scroll.removeClass('wke-tab-scroll-left_disabled');
					self.tabpanel_left_scroll.removeAttr('disabled', true);
					self.tabpanel_right_scroll.addClass('wke-tab-scroll-right_disabled');
					self.tabpanel_right_scroll.attr('disabled');
				} else {
					self.tabpanel_left_scroll.removeClass('wke-tab-scroll-left_disabled');
					self.tabpanel_left_scroll.removeAttr('disabled', true);
					self.tabpanel_right_scroll.removeClass('wke-tab-scroll-right_disabled');
					self.tabpanel_right_scroll.removeAttr('disabled');
				}
			}
	
			self.scrollFinish = true;
		},
		//update style
		update: function() {
			var cWidth = this.tabpanel_tab_content.width();
			if (this.scrolled) cWidth -= (this.tabpanel_left_scroll.width() + this.tabpanel_right_scroll.width());
			this.tabpanel_move_content.width(cWidth);
			this.maxMove = (this.tabpanel_mover.children().length * this.tabWidth) - cWidth + this.fixNum;
		},
		//to show scroll button if needed.
		showScroll: function() {
			var liWidth = this.tabpanel_mover.children().length * this.tabWidth;
			var tabContentWidth = this.tabpanel_tab_content.width();
			if (liWidth > tabContentWidth && !this.scrolled) {
				this.tabpanel_move_content.addClass('tabpanel_move_content_scroll');
				this.tabpanel_left_scroll.removeClass('wke-tab-hide');
				this.tabpanel_right_scroll.removeClass('wke-tab-hide');
				this.scrolled = true;
			} else if (liWidth < tabContentWidth && this.scrolled) {
				this.moveToLeft();
				this.tabpanel_move_content.removeClass('tabpanel_move_content_scroll');
				this.tabpanel_left_scroll.addClass('wke-tab-hide');
				this.tabpanel_right_scroll.addClass('wke-tab-hide');
				this.scrolled = false;
				this.scrollFinish = true;
			}
		},
	
		/**
	   * @description {Method} getTabPosision To get tab index.
	   * @param {String} id item id.
	   * @return {Number} index of tab.
	   */
		getTabPosition: function(tabId) {
			if (typeof tabId == 'string') {
				for (var i = 0; i < this.tabs.length; i++) {
					if (tabId == this.tabs[i].attr('id')) {
						tabId = i;
						break;
					}
				}
			}
			return tabId;
		},
		/**
		* @descript {method} show 页面加载的时候不是所有内容都加载，只有点击相应的tab时动态加载，加载过后，会缓存，不会重复加载内容
		* @param {jqueryObject} elem 需要显示的jquery对象
		* @param {json} tabItem 传入的单个tab的json数据 eg: {id:'toolbarPlugin2',title:'Tab2',html:jcTabs[1],closable: false}
		*/
		show: function(elem, tabItem, oldTabOption) {
			var _this = this;
			var addCache = tabItem.cache ;
			
			//给当前tab增加选中样式,并移除其他未选中nav的选中样式
			elem.addClass('wke-tab-active').siblings().removeClass('wke-tab-active');
			var id = elem.attr('id');
			conID ='#'+ this.settings.idPerfix + id;
			//显示当前nav对应的con
			var currentCon = this.tabpanel_content.find('div#'+conID);
			currentCon.siblings().hide() ;
		
			var loadUrl = tabItem.load ;
			
			//如果当前tab对应的内容为空，则加载
			if( typeof loadUrl == 'string' && $.trim(loadUrl) != "" ){  			//ajax获取内容
				if( ! tabItem.cache ){ 					//每次点击tab重新请求数据
                    $.ajax({
                        url: loadUrl,
                        cache: false,
						type:"get",
						dataType:"html",
                        success: function(data){
							currentCon.html(data).show();
							tabItem.callback && tabItem.callback.call(_this);
                        },
						error:function(e){
							alert("数据出错")
						}
                    });
                }else{ //需要缓存，只第一次点击的时候请求内容（即：currentCon.html() == ''）
					if(oldTabOption){
						if( oldTabOption.load != tabItem.load ){
							currentCon.html("");
						}
					}
                    if( currentCon.html() == ''){
                         $.ajax({
                            url: loadUrl,
                            cache: false,
                            success: function(data){
								currentCon.html(data).show();
								tabItem.callback && tabItem.callback.call(_this);
                            }
                        });
                    }else{
						currentCon.show();
						tabItem.callback && tabItem.callback.call(_this);
					}
                };
            }else{ //直接传递内容
                currentCon.html(tabItem.html).show();
				tabItem.callback && tabItem.callback.call(_this);
            };
		},
		/**
	   * @description {Method} kill To close tab.
	   * @param {String} id item id.
	   */
		kill: function(source, id) {
			var tabCon = $.data(source[0],"wke-tabs");
		
			//移除tab 以及对应的con
			var nav = $('#' + id,tabCon.tabpanel_mover);
			
			var prevNav = nav.prev();
			nav.remove();
			var contentId = '#' + tabCon.settings.idPerfix + id;
			$(contentId,tabCon.tabpanel_content).remove();
			//update width
			tabCon.update();
			//to scroll bar 
			tabCon.showScroll();
			//show last 
			if( nav.is(".wke-tab-active") ){ 
				//this.show(prevNav,false);
				prevNav.trigger('click'); 
			};
			
			tabCon.tabsObj[nav.attr("id")] = false ; 
			
			tabCon.moveToRight();
		},
	
		/**
	   * @description {Method} getTabsCount To get how many tabs are in the panel.
	   * @return {Number} Number of tabs .
	   */
		getTabsCount: function() {
			return this.tabs.length;
		},
	
		/**
	   * @description {Method} setTitle To set tab title.
	   * @param {String} id Item id.
	   * @param {String} title Tab title.
	   */
		setTitle: function(id, title) {
			position = this.getTabPosition(id);
			if (position < this.tabs.length) this.tabs[position].find('.title').text(title);
		},
	
		/**
	   * @description {Method} getTitle To get tab title.
	   * @param {String} id item id.
	   */
		getTitle: function(id) {
			position = this.getTabPosition(id);
			return this.tabs[position].find('.wke-tab-title').text();
		},
	
		/**
	   * @description {Method} setContent To set tab title.
	   * @param {String} id nav的id  因为内容的id是根据nav的id加前缀自动生成的
	   * @param {String} title Tab inner html.
	   */
		setContent: function(id, content) {
			position = this.getTabPosition(id);
			if (position < this.tabs.length) this.tabs[position].content.html(content);
		},
	
		/**
	   * @description {Method} getContent To get tab inner html.
	   * @param {String} id item id.
	   */
		getContent: function(position) {
			position = this.getTabPosition(position);
			return this.tabs[position].content.html();
		},
	
		/**
	   * @description {Method} setDisable To enable or disable tab.
	   * @param {String} id Item id.
	   * @param {Booleaan} True for disabled, false for enabled.
	   */
		setDisable: function(position, disable) {
			position = this.getTabPosition(position);
			if (position < this.tabs.length) {
				this.tabs[position].disable = disable;
				if (disable) {
					this.tabs[position].tab.attr('disabled', true);
					this.tabs[position].title.addClass('.wke-tab-disabled');
				} else {
					this.tabs[position].tab.removeAttr('disabled');
					this.tabs[position].title.removeClass('.wke-tab-disabled');
				}
			}
		},
	
		/**
	   * @description {Method} getDisable To determine whether tab is disabled or not.
	   * @param {String} id item id.
	   */
		getDisable: function(position) {
			position = this.getTabPosition(position);
			return this.tabs[position].disable;
		},
	
		/**
	   * @description {Method} setClosable To enable or disable end user to close tab.
	   * @param {String} id Item id.
	   * @param {Booleaan} True for closable, false for not.
	   */
		setClosable: function(position, closable) {
			position = this.getTabPosition(position);
			if (position < this.tabs.length) {
				this.tabs[position].closable = closable;
				if (closable) {
					this.tabs[position].closer.addClass('wke-tab-hide');
				} else {
					this.tabs[position].closer.addClass('wke-tab-closer');
					this.tabs[position].closer.removeClass('wke-tab-hide');
				}
			}
		},
	
		/**
	   * @description {Method} getClosable To determine whether tab is closable or not.
	   * @param {String} id item id.
	   */
		getClosable: function(position) {
			position = this.getTabPosition(position);
			return this.tabs[position].closable;
		},
	
		/**
	   * @description {Method} getActiveIndex To get index of active tab.
	   * @return {Number} index of active tab.
	   */
		getActiveIndex: function() {
			return this.tabpanel_mover.children().index(this.tabpanel_mover.find('.wke-tab-active')[0]);
		},
	
		/**
	   * @description {Method} getActiveTab To get active tab.
	   * @return {Object} Profile of active tab.
	   */
		getActiveTab: function() {
			var activeTabIndex = this.tabpanel_mover.children().index(this.tabpanel_mover.find('.wke-tab-active')[0]);
			if (this.tabs.length > activeTabIndex) return this.tabs[activeTabIndex];
			else return null;
		}
	};
})(jQuery);