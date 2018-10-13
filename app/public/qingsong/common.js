/* eslint-disable */
/**
 * @file Describe the file
 */

;(function ($) {

    $.cookie = function (key, value, options) {

        if (arguments.length > 1 && (value === null || typeof value !== 'object')) {
            options = jQuery.extend({}, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires;
                var t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? String(value) : encodeURIComponent(String(value)),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var result;
        var decode = options.raw ? function (s) {
            return s;
        } : decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    };
    /**
     * 开发的时候需要将cookie删除
     */
    $.cookie('defaultChannal', null, {path: '/'});
 // 用户每次从别的地址进入到此域名的时候，referrer一定是空，再根据cookie中是否设定了默认频道的需求，将页面导向制定频
    if (document.referrer === '' && $.cookie('defaultChannal')) {
        location.href = 'http://localhost/ip-fe/it_projects/hr%E9%97%A8%E6%88%B7/project/WEB-INF/jsp/hrService/hrService.html';
    }
    ;

// 构建自己的作用域
    $myHr = $.$myHr || {};
// 人事支持页面，页面加载的时候，根据cookie来判断是否需要设定默认频道，如果已经设置过了，并且cooke未过期，则不需要重新设置
    $myHr.SetDefaultChannal = {
        init: function (isDefaultChannel, saveDefaultNodeURL, defaultNodePath) {
            // 设定默认频道icon的坐标
            var pos = $('span#setDefaultChannelBtn').offset();
            // 用户可以设定默认频道的时候，需要创建提示图层，根据设定频道的icon来对其定位
            var tips = $('<div id="setChannelTip"/>').addClass('set-channel-tips').appendTo(document.body);
            $('span#setDefaultChannelBtn').mouseenter(function (e) {
                var offsetPos = $(this).offset();
                tips.css({top: offsetPos.top + 20, left: offsetPos.left - 60});
                tips.fadeIn(500);
            }).mouseleave(function () {
                tips.fadeOut(500);
            });
            if (isDefaultChannel) {
                $('span#setDefaultChannelBtn').attr('class', 'unset-default-channel');
                $('#setChannelTip').html('此频道已设置为默认频道');
            } else {
                $('span#setDefaultChannelBtn').attr('class', 'set-default-channel');
                $('#setChannelTip').html('将此频道设置为默认频道');
                $('span#setDefaultChannelBtn').bind('click', function () {
                    // 保存默认频道
                    $.fn.WKEAjax({
                        dataType: 'json',
                        data: {defaultNodePath: defaultNodePath},
                        type: 'POST',
                        cache: false,
                        url: saveDefaultNodeURL,
                        success: function (data, textStatus) {
                            $myHr.simleBlockUi({warningText: '默认频道设置成功'});
                            $('#setChannelTip').html('此频道已设置为默认频道');
                            $('span#setDefaultChannelBtn').attr('class', 'unset-default-channel');
                            jQuery('span#setDefaultChannelBtn').unbind('click');
                        },
                        error: function (xhr, status, err) {
                            $myHr.simleBlockUi({warningText: err});
                        }
                    });
                });
            }
        }
    };


//简单的模版引擎
    $myHr.tlp = function (template, data, label) {
        var t = String(template);
        var s = label || /&\{([^}]*)\}/mg,
            trim = String.trim || function (str) {
                    return str.replace(/^\s+|\s+$/g, '');
                };
        return t.replace(s, function (value, name) {
            // 从模板获取name,容错处理
            return value = data[trim(name)];
        });
    };
// 字符长度计算（一个中文算两个字符）
    $myHr.getByteLength = function (str) {
        return str.replace(/[^\x00-\xff]/g, 'mm').length;
    };
// 字符截断，多于指定个字符就以"..."代替
    $myHr.subByte = function (str, n) {
        if ($myHr.getByteLength(str) <= n) {
            return str;
        } else {
            for (var i = Math.floor((n = n - 2) / 2), l = str.length; i < l; i++){
                if ($myHr.getByteLength(str.substr(0, i)) >= n){
                    return str.substr(0, i) + "...";
                }
            }

        }
        ;
        return str;
    };

    /**
     *@discription textarea字数统计
     *@auth by dengxiaoming
     *@update 2011-9-20
     *@param {string} totalLength 显示最大可以输入多少个字
     *@param {classname} rememberTotalNum //记录最大可以输入的文字数的容器 比如：‘.test’
     *@param {classname} rememberCurNum //当前已经输入了多少个字
     */
    $.extend($.fn, {
        textareaMaxLength: function (opts) {
            opts = $.extend({
                totalLength: '10',         // 显示最大可以输入多少个字
                rememberTotalNum: '',    // 记录最大可以输入的文字数的容器
                rememberCurNum: ''            // 当前已经输入了多少个字
            }, opts || {});

            return this.each(function () {
                var rememberTotalNum = $(opts.rememberTotalNum).html(opts.totalLength);
                var rememberCurNum = $(opts.rememberCurNum);
                var self = this;

                $(this).bind('keyup', function () {
                    count();
                });

                function count() {
                    // 计算textarea的字数，并提示文字
                    $.data($(self)[0], 'flag', true);
                    var value = $(self).val().replace(/(^\s*)/gi, '');
                    var len = Math.floor($myHr.getByteLength(value) / 2);
                    if (len <= opts.totalLength) {
                        rememberCurNum.html(opts.totalLength - len);
                    } else {
                        rememberCurNum.html(opts.totalLength - len);
                        $.data($(self)[0], 'flag', false);
                    }
                    ;
                }
            });
        },

        /**
         *外部接口，判断字数有没有超出
         * return data
         */

        checkFlag: function () {
            return $.data($(this)[0], 'flag');
        }
    });

    /**
     *@discription 输入框默认文字提示
     *@auth by dengxiaoming
     *@update 2011-9-20
     *@param {string} text 默认需要提示的文字
     *@param {string} active 文字正常显示的颜色
     *@param {string} placeholder 默认文字提示的颜色
     */
    $.extend($.fn, {
        placeHolder: function (opts) {
            opts = $.extend({
                'text': '输入关键字',
                'active': '#000',
                'placeholder': '#cccccc'

            }, opts || {});

            return this.each(function () {
                $(this).val(opts.text).css('color', opts.placeholder).bind('focus', function () {
                    if ($(this).val() === opts.text) {
                        $(this).val('');
                    }
                    $(this).css('color', opts.active);
                }).bind('blur', function () {
                    if ($(this).val() === '') {
                        $(this).val(opts.text);
                    }
                    if ($(this).val() === opts.text) {
                        $(this).css('color', opts.placeholder);
                    }
                    ;
                });
            });
        }
    });


    /**
     *首页大背景切换效果
     * @param settings settings
     */
    $myHr.SlideIndex = function (settings) {
        var defaults = {
            btnWrap: '',
            getBtnBy: 'li',
            target: '',
            getTargetBy: 'div',
            evtName: 'click',
            targetLink: '',
            getTargetLinkBy: 'a'
        };
        this.settings = $.extend({}, defaults, settings);
        this.create();
    };
    $myHr.SlideIndex.prototype = {
        create: function () {
            var o = this.settings;
            var self = this;
            this.btns = $(o.btnWrap).find(o.getBtnBy);
            this.targets = $(o.target).find(o.getTargetBy);
            this.targetLink = $(o.targetLink).find(o.getTargetLinkBy);
            this.length = this.btns.size();
            this.timer = null;
            this.defaultIndex = 0;
            $.each(this.btns, function (index, item) {
                $(item).bind(o.evtName + '.slideIndex', function () {
                    // 防止快速反复点击
                    setTimeout(function () {
                        self.run(index);
                    }, 200);
                }).mouseover(function () {
                    $(this).addClass('hover');
                }).mouseout(function () {
                    $(this).removeClass('hover');
                });
            });
            this.btns.eq(0).trigger('click');
        },
        run: function (index) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            ;
            var self = this;
            if (index > this.length - 1) {
                index = 0;
            }
            ;
            $(self.btns[index]).addClass('current').siblings().removeClass('current');
            $(self.btns[index]).addClass('current').siblings().removeClass('current');
            $(self.targets[index]).css('opacity', 1);
            $(self.targets[index]).stop().animate({
                'opacity': 'show'
            }, 800).siblings().stop().animate({
                'opacity': 'hide'
            }, 800);
            $(self.targetLink[index]).stop().animate({
                'opacity': 'show'
            }).siblings().stop().animate({
                'opacity': 'hide'
            });
            this.defaultIndex = index;
            this.autoPlay();
        },
        autoPlay: function () {
            var self = this;
            this.timer = setTimeout(function () {
                self.run(++self.defaultIndex);
            }, 3000);
        }
    };

    /**
     *hr门户内容展现通用列表组件
     *@param container {string}    装载内容的容器，可以是id 也可以是class
     *@param settings {object}    用户自定义参数
     */

    $myHr.commonList = function (container, settings) {
        var defaults = {
            nav: '',                        // 栏目导航
            contentDataUrl: '',             // 如果此变量为字符串的时候，即表明填充用ajax来填充内容
            ajaxDataParam: '',             // 获取内容的时候是否需要加参数
            contentTlp: '',                // 内容循环模版
            contentData: [],               // 内容数据,注意数据中的字段应该跟模版中的变量保持完全一致
            getSubBye: '.needSubBye',      // 通过某个类获取需要截断的字符,主要避免出现这种情况 <li><a href="#" >文字</a></li> a需阶段li不需要
            subByteSize: '',               // 字符截断的长度,多于这个长度将会以"..."代替
            callback: ''                   // 填充完后可以自定义callback回调han's
        };
        this.settings = $.extend({}, defaults, settings);
        this.element = $(container);
        this.create();
    };
    $myHr.commonList.prototype = {
        create: function () {
            this.renderCon();
        },

        /**
         *根据传入的content渲染内容
         */

        renderCon: function () {
            var o = this.settings;
            // 内容模版
            var tlp = o.contentTlp;
            var self = this;
            // 先将内容清空，防止累加
            this.element.empty();
            if (typeof o.contentDataUrl === 'string' && o.contentData.length === 0) {
                // 需要给装载内容的容器增加一个最小高度，目的是为了可以增加一个loading层
                this.element.addClass('relative minHeight');
                var loading = $('<div class="loading">正在加载……</div>').appendTo(this.element);
                $.ajax({
                    url: o.contentDataUrl,
                    dataType: 'json',
                    cache: false,
                    // data:o.ajaxDataParam ? o.ajaxDataParam : '',
                    success: function (data) {  // 将返回结果赋值给contentData
                        o.contentData = data;
                        $.each(o.contentData, function (index, item) {

                            $($myHr.tlp(tlp, item)).appendTo(self.element);
                        });
                        self.cutText();
                        loading.remove();
                        self.element.removeClass('relative minHeight');
                        if (typeof o.callback === 'function') {
                            o.callback();
                        }
                        ;
                    }
                });
            } else if ($.isArray(o.contentData)) {  // 确保传入的contentData是数组
                $.each(o.contentData, function (index, item) {
                    $($myHr.tlp(tlp, item)).appendTo(self.element);
                });
                self.cutText();
                if (typeof o.callback === 'function') {
                    o.callback();
                }
                ;
            }
            ;
        },
        cutText: function () {
            // 所有需要字符截断的元素
            var o = this.settings;
            var allNeedSubBytes = $(o.getSubBye, this.element);
            $.each(allNeedSubBytes, function (index, item) {
                var _this = this;
                $(this).html($myHr.subByte($(this).text(), o.subByteSize));
            });
        }
    };


    /**
     *我的办理记录展现模板
     *@param container {string}    装载内容的容器，可以是id 也可以是class
     *@param settings {object}    用户自定义参数
     *和一不同的是这个函数多了一个模板
     */

    $myHr.commonList2 = function (container, settings) {
        var defaults = {
            nav: '',                        // 栏目导航
            contentDataUrl: '',             // 如果此变量为字符串的时候，即表明填充用ajax来填充内容
            ajaxDataParam: '',             // 获取内容的时候是否需要加参数
            contentTlp: '',                // 内容循环模版
            contentTlp2: '', 				  // 内容循环模板2
            contentData: [],               // 内容数据,注意数据中的字段应该跟模版中的变量保持完全一致
            getSubBye: '.needSubBye',      // 通过某个类获取需要截断的字符,主要避免出现这种情况 <li><a href="#" >文字</a></li> a需阶段li不需要
            getSubBye2: '.greenlink',      // 通过某个类获取需要截断的字符,主要避免出现这种情况 <li><a href="#" >文字</a></li> a需阶段li不需要
            subByteSize: '',               // 字符截断的长度,多于这个长度将会以"..."代替
            callback: ''                   // 填充完后可以自定义callback回调han's
        };
        this.settings = $.extend({}, defaults, settings);
        this.element = $(container);
        this.create();
    };
    $myHr.commonList2.prototype = {
        create: function () {
            this.renderCon();
        },


        /**
         *根据传入的content渲染内容
         */

        renderCon: function () {
            var o = this.settings;
            // 内容模版
            var tlp = o.contentTlp;
            var tlp2 = o.contentTlp2;
            var self = this;
            // 先将内容清空，防止累加
            this.element.empty();
            if (typeof o.contentDataUrl === 'string' && o.contentData.length === 0) {
                // 需要给装载内容的容器增加一个最小高度，目的是为了可以增加一个loading层
                this.element.addClass('relative minHeight');
                var loading = $('<div class="loading">正在加载……</div>').appendTo(this.element);
                $.ajax({
                    url: o.contentDataUrl,
                    dataType: 'json',
                    cache: false,
                    // data:o.ajaxDataParam ? o.ajaxDataParam : '',
                    success: function (data) {  // 将返回结果赋值给contentData
                        o.contentData = data;

                        $.each(o.contentData, function (index, item) {
                            if (item.status == 'RESTAR_STATUS' || item.status == 'NORMAL_STATUS' || item.status == 'REJECT_STATUS' || item.status == 'FREEZE_STATUS' || item.status == 'PAUSE_STATUS') {

                                $($myHr.tlp(tlp2, item)).appendTo(self.element);
                                // self.cutText();
                            } else {
                                $($myHr.tlp(tlp, item)).appendTo(self.element);
                            }

                        });
                        self.cutText();
                        loading.remove();
                        self.element.removeClass('relative minHeight');
                        if (typeof o.callback == 'function') {
                            o.callback();
                        }
                        ;
                    }
                });
            } else if ($.isArray(o.contentData)) {  // 确保传入的contentData是数组
                $.each(o.contentData, function (index, item) {
                    if (item.status != null) {
                        alert(item.status);
                        $($myHr.tlp(tlp, item)).appendTo(self.element);
                        // self.cutText();
                    } else {
                        $($myHr.tlp(tlp2, item)).appendTo(self.element);
                    }
                });
                self.cutText();
                if (typeof o.callback == 'function') {
                    o.callback();
                }
                ;
            }
            ;
        },
        cutText: function () {
            // 所有需要字符截断的元素
            var o = this.settings;
            var allNeedSubBytes = $(o.getSubBye, this.element);
            $.each(allNeedSubBytes, function (index, item) {
                var _this = this;
                $(this).html($myHr.subByte($(this).text(), o.subByteSize));
            });

            var allNeedSubBytes2 = $(o.getSubBye2, this.element);
            $.each(allNeedSubBytes2, function (index, item) {
                var _this = this;
                $(this).html($myHr.subByte($(this).text(), o.subByteSize));
            });
        }
    };


    /**
     *我的任务托办
     *@param {string}    装载内容的容器，可以是id 也可以是class
     *@param {object}    用户自定义参数
     */
    $myHr.taskcondigner = function (container, settings) {
        var defaults = {

            showTab: '',
            callback: '',                  // 填充完后可以自定义callback回调han's
            callback2: ''
        };
        this.settings = $.extend({}, defaults, settings);
        this.element = $(container);
        this.create();
    };
    $myHr.taskcondigner.prototype = {
        create: function () {
            this.renderCon();
        },
        /**
         *根据传入的content渲染内容
         */
        renderCon: function () {
            var o = this.settings;
            var self = this;
            $.ajax({
                url: o.contentDataUrl,
                cache: false,
                success: function (data) {  // 将返回结果赋值给contentData
                    o.contentData = data;
                    if (o.showTab > 0) {
                        self.element.msgtip('addHandleClass', 'work-block')
                            .msgtip('removeHandleClass', 'work-hidden');
                        if (data.indexOf('failed') != -1) {
                            self.element.msgtip('setHandleText', '工作托办')
                                .msgtip('addHandleClass', 'work-living')
                                .msgtip('removeHandleClass', 'work-lived');

                        } else {
                            // self.element.html('工作已托办');
                            self.element.msgtip('setHandleText', '工作已托办')
                                .msgtip('addHandleClass', 'work-lived')
                                .msgtip('removeHandleClass', 'work-living');
                        }
                    } else {
                        self.element.msgtip('addHandleClass', 'work-hidden')
                            .msgtip('removeHandleClass', 'work-block');
                    }

                }
            });

        }
    };


    /**
     *我的办理记录展现模板
     *@param {string}    装载内容的容器，可以是id 也可以是class
     *@param {object}    用户自定义参数
     *和一不同的是这个函数多了一个模板
     */
    $myHr.taskcondignersearch = function (container, settings) {
        var defaults = {
            nav: '',                        // 栏目导航
            contentDataUrl: '',             // 如果此变量为字符串的时候，即表明填充用ajax来填充内容
            contentDataUrl2: '',             // 如果此变量为字符串的时候，即表明填充用ajax来填充内容
            ajaxDataParam: '',             // 获取内容的时候是否需要加参数
            contentTlp: '',                // 内容循环模版
            contentTlp2: '',                // 内容循环模版
            contentData: [],               // 内容数据,注意数据中的字段应该跟模版中的变量保持完全一致
            getSubBye: '.needSubBye',      // 通过某个类获取需要截断的字符,主要避免出现这种情况 <li><a href='#' >文字</a></li> a需阶段li不需要
            subByteSize: '',               // 字符截断的长度,多于这个长度将会以'...'代替
            callback: '',                  // 填充完后可以自定义callback回调han's
            callback2: ''
        };
        this.settings = $.extend({}, defaults, settings);
        this.element = $(container);
        this.create();
    };
    $myHr.taskcondignersearch.prototype = {
        create: function () {
            this.renderCon();
        },
        /**
         *根据传入的content渲染内容
         */
        renderCon: function () {
            var o = this.settings;
            // 内容模版
            var tlp = o.contentTlp;
            var tlp2 = o.contentTlp2;
            var self = this;
            // 先将内容清空，防止累加
            this.element.empty();
            this.element.addClass('relative minHeight');
            var loading = $('<div class="loading">正在加载……</div>').appendTo(this.element);
            $.ajax({
                url: o.contentDataUrl,
                dataType: 'json',
                cache: false,
                // data:o.ajaxDataParam ? o.ajaxDataParam : '',
                success: function (data) {  // 将返回结果赋值给contentData
                    o.contentData = data;
                    if (data != '') {
                        $.each(o.contentData, function (index, item) {

                            $($myHr.tlp(tlp, item)).appendTo(self.element);

                        });
                    } else {
                        $(tlp2).appendTo(self.element);
                    }

                    loading.remove();
                    // self.element.removeClass('relative minHeight');
                    if (typeof o.callback == 'function') {
                        o.callback();
                    }
                    ;
                }
            });
        }

    };


    /**
     *hr门户内容展现通用列表组件
     *@param {string}    装载内容的容器，可以是id 也可以是class
     *@param {object}    用户自定义参数
     */
    $myHr.serviceKindList = function (container, settings) {
        var defaults = {
            navTlp: '<div class="service-kind-nav"><h3>&{kind}</h3></div>'    // 模块导航模版
        };
        this.settings = $.extend({}, defaults, settings);
        this.element = $(container);

        this.create();
    };
    $myHr.serviceKindList.prototype = {
        create: function () {
            // 需要给装载内容的容器增加一个最小高度，目的是为了可以增加一个loading层
            this.element.addClass('relative minHeight');
            this.loading = $('<div class="loading">正在加载……</div>').appendTo(this.element);
            this.ajaxGetData();
        },
        /**
         * 根据ajax返回结果渲染页面
         * @param data
         */
        render: function (data) {
            var o = this.settings,
                self = this;
            // 模块右上角增加一个icon
            $('<div class="new-kind-mark"></div>').appendTo(self.element);
            $.each(data, function (index, item) {
                // 根据data.sides将内容渲染成一列或者是两列
                switch (item.sides) {
                    case 1:
                        renderConToOneSide(item);
                        break;
                    case 2:
                        renderConToTwoSide(item);
                        break;
                    default:
                        break;
                }
                ;
            });
            // 将内容渲染成一列
            function renderConToOneSide(data) {
                // 大分类容器
                var kind = $('<div class="service-kind"></div>').appendTo(self.element);
                // 大分类导航栏
                var title = $($myHr.tlp(o.navTlp, data)).appendTo(kind);
                // 大分类内容
                var con = $('<div class="service-kind-detail">').appendTo(kind);
                // 子分类数据
                var contentData = data.subKind,
                    len = contentData.length;
                $.each(contentData, function (index, item) {
                    var subkindDl = $('<dl class="clearfix ' + ( (index == len - 1) ? 'last' : '') + '"><dt class="' + data.kindClass + '"><a href="' + item.subKindLink + '">' + item.subKindName + (item.newIcon ? '<em class="new-icon"><\/em>' : '' ) + '</a></dt></dl>').appendTo(con);
                    var subKindListWrap = $('<dd class="dtTitle0Con"></dd>').appendTo(subkindDl);
                    // 二级分类中的列表子项 ,即：dd 里面的 a
                    var subKindList = item.subKindList;
                    // 每个dd里面的最后一个a去除竖线
                    var subKindListLen = subKindList.length;
                    $.each(subKindList, function (i, v) {
                        var links = $('<a href="' + v.link + '">' + v.title + (i < (subKindListLen - 1) ? '<em class="spliteLine"></em>' : '') + '</a>').appendTo(subKindListWrap);

                        if (v.newIcon) {
                            $('<em/>').addClass('new-icon').appendTo(links);
                        }
                        ;
                    });
                });

            };
            // 将内容渲染成两列
            function renderConToTwoSide(data) {
                // 大分类容器
                var kind = $('<div class="service-kind"></div>').appendTo(self.element);
                // 大分类导航栏
                var title = $($myHr.tlp(o.navTlp, data)).appendTo(kind);
                // 大分类内容
                var con = $('<div class="service-kind-detail clearfix"></div>').appendTo(kind);
                // 子分类数据
                var contentData = data.subKind;
                var len = contentData.length;
                // 左侧内容
                var leftConWrap = $('<div class="service-kind-detail-side fl"></div>').appendTo(con);
                // 中间分割线
                var midLine = $('<div class="service-splitline1 fl"></div>').appendTo(con);
                // 右侧内容
                var rightConWrap = $('<div class="service-kind-detail-side fr"></div>').appendTo(con);
                // 子项列表，最后一项不需要分隔线，判断索引值，增加样式last即可
                $.each(contentData, function (index, item) {
                    if (index < len / 2) {
                        var leftConDl = $('<dl class="clearfix"/>').appendTo(leftConWrap);
                        $('<dt class="' + data.kindClass + '"><a href="' + item.subKindLink + '">' + item.subKindName + (item.newIcon ? '<em class="new-icon"><\/em>' : '' ) + '</a></dt>').appendTo(leftConDl);
                        var subKindListWrap = $('<dd class="' + data.kindClass + 'Con"></dd>').appendTo(leftConDl);
                        // 二级分类中的列表子项
                        var subKindList = item.subKindList;
                        // 每个dd里面有多少个a
                        var subKindListLen = subKindList.length;
                        $.each(subKindList, function (i, v) {
                            var links = $('<a href="' + v.link + '">' + v.title + (i < (subKindListLen - 1) ? '<em class="spliteLine"></em>' : '') + '</a>').appendTo(subKindListWrap);
                            if (v.newIcon) {
                                $('<em/>').addClass('new-icon').appendTo(links);
                            }
                            ;
                        });

                    } else {
                        var rightConDl = $('<dl class="clearfix"/>').appendTo(rightConWrap);
                        $('<dt class="' + data.kindClass + '"><a href="' + item.subKindLink + '">' + item.subKindName + (item.newIcon ? '<em class="new-icon"><\/em>' : '' ) + '</a></dt>').appendTo(rightConDl);
                        var subKindListWrap = $('<dd class="' + data.kindClass + 'Con"></dd>').appendTo(rightConDl);
                        // 二级分类中的列表子项
                        var subKindList = item.subKindList;
                        // 每个dd里面有多少个a
                        var subKindListLen = subKindList.length;
                        $.each(subKindList, function (i, v) {
                            var links = $('<a href="' + v.link + '">' + v.title + (i < (subKindListLen - 1) ? '<em class="spliteLine"></em>' : '') + '</a>').appendTo(subKindListWrap);
                            if (v.newIcon) {
                                $('<em/>').addClass('new-icon').appendTo(links);
                            }
                            ;
                        });

                    }
                    ;
                });
                // 左侧内容最后一项去掉下划线
                leftConWrap.children().last().addClass('last');
                // 右侧内容最后一项去掉下划线
                rightConWrap.children().last().addClass('last');
            };

        },
        ajaxGetData: function () {
            var self = this,
                o = this.settings;
            $.ajax({
                url: o.contentDataUrl,
                cache: false,
                dataType: 'json',
                success: function (data) {  // 将返回结果赋值给contentData
                    self.render(data);
                    self.loading.remove();
                }
            });
        }
    };


    /**
     *通用左右滚动
     */
    $myHr.carousel = function (settings) {
        // 默认参数
        var defaults = {
            lButton: '.common-tool-lbtn',
            rButton: '.common-tool-rbtn',
            oListWrap: '.common-tool-wrap',
            oList: '.service-common-tool',
            getListsByTag: 'li',
            step: 80,
            showNum: 2
        };
        this.settings = $.extend({}, defaults, settings);
        // 向左滚动按钮
        this.lButton = $(this.settings.lButton);
        // 像右滚动按钮
        this.rButton = $(this.settings.rButton);
        // 所有滚动的子元素
        this.lists = $(this.settings.getListsByTag, $(this.settings.oList));
        // 所有子元素的个数
        this.listsLen = this.lists.size();
        // 向右滚动到最大范围，如果超出了这个范围，则不能再点击了
        this.maxStep = (this.listsLen - this.settings.showNum) * this.settings.step;

        if (this.listsLen > 2) {  // 只有大于3个才需要左右滚动
            this.create();
        } else {
            this.lButton.hide();
            this.rButton.hide();
        }
        ;

    };
    $myHr.carousel.prototype = {
        create: function () {
            // 给装载子元素的容器增加宽度
            $(this.settings.oList).css('width', this.listsLen * this.settings.step);
            // 默认刚加载进来时不能向左点击
            this.lButton.addClass('common-tool-l-disabled');
            this.bindEvt();
        },
        bindEvt: function () {
            var self = this;
            // 向左滚动按钮绑定点击和鼠标移入移出事件
            this.lButton.bind('click.carousel', function () {
                self.LeftScroll();
            });
            // 向右滚动按钮绑定点击和鼠标移入移出事件
            this.rButton.bind('click.carousel', function () {
                self.RightScroll();
            });
        },
        // 向左滚动
        LeftScroll: function () {
            var o = this.settings;
            var self = this;
            var b = parseInt($(o.oList).css('left'));
            if (this.rButton.hasClass('common-tool-r-disabled')) {
                this.rButton.removeClass('common-tool-r-disabled');
                this.rButton.bind('click.carousel', function () {
                    self.RightScroll();
                });
            }
            ;
            // 只有左边还有未显示的子元素才向左滚动
            if (b < 0) {
                $(o.oList + ":not(:animated)").animate({left: "+=" + o.step}, {
                    duration: 'fast',
                    complete: function () {
                        if (parseInt($(o.oList).css('left')) == 0) {
                            self.lButton.addClass('common-tool-l-disabled');
                            self.lButton.unbind('click.carousel');
                        }
                        ;
                    }
                });
            }
            ;
        },
        // 向右滚动
        RightScroll: function () {
            var o = this.settings;
            var self = this;
            var b = parseInt($(o.oList).css('left'));
            var i = 0;
            if (this.lButton.hasClass('common-tool-l-disabled')) {
                this.lButton.removeClass('common-tool-l-disabled');
                this.lButton.bind('click.carousel', function () {
                    self.LeftScroll();
                });
            }
            ;
            if (Math.abs(b) < this.maxStep) {
                $(o.oList + ":not(:animated)").animate({left: "-=" + o.step}, {
                    duration: 'fast',
                    complete: function () {
                        if (Math.abs(parseInt($(o.oList).css('left'))) >= self.maxStep) {
                            self.rButton.addClass('common-tool-r-disabled');
                            // 移除事件绑定，再点击的时候无反映，只有点击向左滚动，才重新绑定事件
                            self.rButton.unbind('click.carousel');
                        }
                        ;
                    }
                });
            }
            ;
        },
        destory: function () {
            var self = this;
            this.lButton.unbind('click.carousel');
            this.rButton.unbind('click.carousel');
        }
    };

    /**
     *tab切换
     */
    $myHr.tab = function (settings) {
        var defaults = {
            navWrap: '#tabNavWrap',        // the nav container
            navList: '#tabNavList',        // nav list
            getNavsBy: 'li',               // 通过此标签可以找到所有切换按钮
            prevBtn: '.detail-tab-prev',   // 向后滚动按钮
            nextBtn: '.detail-tab-next',   // 向前滚动按钮
            evtName: 'click',              // 触发切换tab的事件
            getConsBy: '.myHrTabCon',       // 通过此类可以找到所有需要切换的内容
            callback: ''                    // 回调函数
        };
        this.settings = $.extend({}, defaults, settings);
        this.navWrap = $(this.settings.navWrap);
        this.navList = $(this.settings.navList);
        this.prevBtn = $(this.settings.prevBtn);
        this.nextBtn = $(this.settings.nextBtn);

        this.tabs = $(this.settings.getNavsBy, this.navList);
        this.len = this.tabs.size();
        this.cons = $(this.settings.getConsBy);
        this.create();
    };
    $myHr.tab.prototype = {
        create: function () {
            var self = this,
                o = this.settings;
            // 一定要这句话，否则在ie6计算总宽度会算错，在后面遍历后会根据实际宽度重置这个宽度
            this.navList.css({width: 1000});
            // 设定一个总宽度，需要根据nav的个数来定
            this.totalWidth = 0;

            // loop the tabs,bind events for everyone
            $.each(this.tabs, function (index, item) {
                // get every width of nav
                self.totalWidth += $(item).outerWidth();
                $(this).bind(self.settings.evtName, function () {
                    $(this).addClass('current').siblings().removeClass('current');
                    $(self.cons[index]).fadeIn(500).siblings().fadeOut();
                })

            });
            this.totalWidth += 10;
            // reset the width of navlist
            this.navList.css('width', this.totalWidth);
            // if the totalwidth smaller than the width of thse container,we should hide the direction btn
            if (self.totalWidth > this.navWrap.width()) {
                this.nextBtn.show();
                this.prevBtn.show();
                this.navList.css({left: 0});
                this.navWrap.css({float: 'left'});
            } else {
                this.navList.css({right: 0});

            }
            ;
            if (typeof o.callback == 'function') {
                o.callback(this.cons);
            }
            ;
            this.bindEvt();
        },
        bindEvt: function () {
            var self = this;
            // bind event for nextbtn,change the scrollleft of the navwrap
            this.nextBtn.bind('click', function () {
                (self.navWrap)[0].scrollLeft += 100;
                if ((self.navWrap)[0].scrollLeft > 0) {
                    self.prevBtn.removeClass('detail-tab-prev-disable');
                }
                ;
                if ((self.navWrap)[0].scrollLeft >= (self.totalWidth - self.navWrap.width() )) { // 滚动到最右边
                    self.nextBtn.addClass('detail-tab-next-disable');
                }
                ;
            });
            // bind event for prevbtn,change the scrollleft of the navwrap
            this.prevBtn.bind('click', function () {
                (self.navWrap)[0].scrollLeft -= 100;
                if ((self.navWrap)[0].scrollLeft <= 0) { // 滚动到最左边时，向左的按钮变化
                    self.prevBtn.addClass('detail-tab-prev-disable');
                }
                ;
                if ((self.navWrap)[0].scrollLeft < (self.totalWidth - self.navWrap.width() )) {
                    self.nextBtn.removeClass('detail-tab-next-disable');
                }
                ;
            });
        }
    }


    /**
     *展开收起
     */
    $myHr.toggleHeight = function (settings) {
        var defaults = {
            container: '',                // 需要折叠收起的父容器
            slideBtnTlp: '<div class="toggle-btn">展开更多<span>︾</span></div>',   // 折叠收起按钮的模版
            target: '',                   // 需要展开折叠的容器
            slideDown: 'need-doc-all',    // 展开的样式
            slideUp: 'need-doc-part'      // 折叠的样式
        };
        this.settings = $.extend({}, defaults, settings);
        this.target = $(this.settings.target);
        this.container = $(this.settings.container);
        this.create();
    };
    $myHr.toggleHeight.prototype = {
        create: function () {
            var self = this;
            var o = this.settings;
            this.btn = $(o.slideBtnTlp).appendTo(this.container);
            // the height of expand
            var maxH = self.target.innerHeight();
            // the height of collopan
            var minH = self.target.parent().innerHeight();
            this.btn.toggle(function () {
                $(this).html('收起<span>︽</span>');
                self.target.parent().animate({
                    height: maxH
                }, "fast");
            }, function () {
                $(this).html('展开更多<span>︾</span>');
                self.target.parent().animate({
                    height: minH
                }, "fast");
            });
        }
    }

    /**
     *@descript 公共留言模块
     */
    $myHr.comment = function (settings) {
        var defaults = {
            bigTextareaParamId: '',                                     // 大输入框给后台传递数据的参数(主要分别是从哪个页面传递过去的)
            dataAction: '',  // 获取留言数据的aciton
            postBigTextareaAction: '',                                  // 发送大输入框内容给后台的action
            getSubContentAction: '',                                    // 获取二级留言数据
            postReplyAction: '',                                        // 像后台发送二级留言的内容
            perPage: '',                                                // 每页显示多少条数据
            deleteReplyAction: '',                                      // 删除某条留言
            bigTextarea: '#commBigTextarea',                 // 大的textarea输入框
            publishCommBtn: '#publishCommBtn',                              // 将大textarea输入框内容发送到后台的按钮
            contentWrap: '.comment-list',    // 装载留言内容的父容器
            /**
             *@descript 留言内容模版 ,点击“回复”，加载回复当前留言的具体内容以及回复当前留言；
             * 点击“删除”可以删除当前留言（删除当前留言的时候，虽然给后台发送请求，从记录中删除了这条留言，但是页面不进行重新渲染，只是单纯的删除掉，再重载页面时候才重新更新）
             */
            listItemTlp: '<div class="comm-list-item clearfix"><div class="comm-item-pic fl"><img src="&{src}"/></div><div class="comm-item-txt fr"><p><h4>&{nickname}</h4><span>&{date}</span></p><p><span>&{content}</span><a class="bluelink comm-reply" href="" msgID="&{itemID}">[回复<span id="replyNumid-&{itemID}">&{replyNum}</span>]</a><a class="redlink comm-delete" href="" msgID="&{itemID}">[删除]</a></p><div class="reply-editor hide"><div class="reply-editor-triangle"></div><div class="clearfix"><div class="comm-reply-input fl" contenteditable="true" msgID="&{itemID}"></div> <input type="button" class="reply-btn fl" value="" id="subReplyBtnId-&{itemID}"/></div><div class="reply-editor-item" id="replyEditorWrapId-&{itemID}"></div></div></div></div>',
            haveReplyTlp: '<div class="comm-list-item clearfix"><div class="comm-item-pic fl"><img src="&{src}"/></div><div class="comm-item-txt fr"><p><h4>&{nickname}</h4><span>&{date}</span></p><p><span>&{content}</span><a class="bluelink comm-reply" href="" msgID="&{itemID}">[回复<span id="replyNumid-&{itemID}">&{replyNum}</span>]</a></p><div class="reply-editor hide"><div class="reply-editor-triangle"></div><div class="clearfix"><div class="comm-reply-input fl" contenteditable="true" msgID="&{itemID}"></div> <input type="button" class="reply-btn fl" value="" id="subReplyBtnId-&{itemID}"/></div><div class="reply-editor-item" id="replyEditorWrapId-&{itemID}"></div></div></div></div>',
            noLoginTlp: '<div class="comm-list-item clearfix"><div class="comm-item-pic fl"><img src="&{src}"/></div><div class="comm-item-txt fr"><p><h4>&{nickname}</h4><span>&{date}</span></p><p><span>&{content}</span></p><div class="reply-editor hide"><div class="reply-editor-triangle"></div><div class="clearfix"><div class="comm-reply-input fl" contenteditable="true" msgID="&{itemID}"></div> <input type="button" class="reply-btn fl" value="" id="subReplyBtnId-&{itemID}"/></div><div class="reply-editor-item" id="replyEditorWrapId-&{itemID}"></div></div></div></div>',
            editorReplyTlp: '<li><div><h4>&{nickname}</h4><span>&{date}</span></div><div>&{content}<a class="redlink comm-delete editorCommDelete" href="#" msgID="&{itemID}">[删除]</a></div></li>',
            NoLogineditorReplyTlp: '<li><div><h4>&{nickname}</h4><span>&{date}</span></div><div>&{content}</div></li>'
        };
        this.settings = $.extend({}, defaults, settings);
        this.element = $(this.settings.contentWrap);
        // 需要给装载内容的容器增加一个最小高度，目的是为了可以增加一个loading层
        this.element.addClass('relative minHeight');
        this.loading = $('<div class="loading">正在加载……</div>').appendTo(this.element);
        this.bigTextarea = $(this.settings.bigTextarea);
        this.publishCommBtn = $(this.settings.publishCommBtn);


        this.create(1);
    };
    $myHr.comment.prototype = {
        create: function (curPage) {
            // count the font size of the textarea
            this.countTextAreaNum();
            var self = this,
                o = this.settings;
            this.element.empty();
            $.ajax({
                type: 'GET',
                url: o.dataAction,
                dataType: 'json',
                cache: false,
                data: 'curPage=' + curPage,
                success: function (msg) {
                    self.fillItem(msg);
                    // 移除正在加载的loading
                    self.loading.remove();
                    self.element.removeClass('relative minHeight');

                    // 绑定事件
                    self.bindEvt();
                    self.bigTextarea.attr('value', '');

                }
            });

        },
        // 创建翻页
        createPage: function (msg) {
            var self = this;
            $('#Pagination').pager({
                totalNums: msg.totalNums,
                callback: update,
                curPage: msg.currentPage,
                perPage: msg.perPage
            });
            // 点击页码的时候绑定事件，重新渲染获取数据渲染内容
            function update(curPage) {
                self.create(curPage);
                return false;
            }
        },
        // show total msg num
        countTotalMsgNum: function (num) {
            // 在留言模块的导航栏上需要渲染总共有多少条留言数据
            $('#commonTotal').html("(" + num + ")");
        },
        /**
         *渲染页面
         */
        fillItem: function (data) {
            var self = this,
                o = this.settings,
                listItemData = data.listItem;
            if (listItemData.length > 0) {
                /*$.each(listItemData,function(index,item){
                 // 遍历ajax所得的数据，填充模版并增加到父容器中去
                 if(!data.loginFlag){  // 未登录
                 var listItem = $($myHr.tlp(o.noLoginTlp,item)).appendTo(self.element);
                 }else{   console.log(){};
                 if(!data.delFlag){ // 如果不能删除
                 // var listItem = $($myHr.tlp(o.haveReplyTlp,item)).appendTo(self.element);
                 }else{
                 var listItem = $($myHr.tlp(o.listItemTlp,item)).appendTo(self.element);
                 };
                 };
                 });*/
                // 未登录不能发表评论
                if (!data.loginFlag) {
                    self.bigTextarea.attr('disabled', 'disabled').val('未登录，暂时不能发表评论');
                    $.each(listItemData, function (index, item) {
                        var listItem = $($myHr.tlp(o.noLoginTlp, item)).appendTo(self.element);
                    });
                } else {
                    $.each(listItemData, function (index, item) {
                        if (!item.delFlag) { // 如果不能删除
                            var listItem = $($myHr.tlp(o.haveReplyTlp, item)).appendTo(self.element);
                        } else {
                            var listItem = $($myHr.tlp(o.listItemTlp, item)).appendTo(self.element);
                        }
                        ;
                    });
                }
                ;
                // 创建翻页
                self.createPage(data);
            } else {
                self.element.html('暂无评论');
            }
            ;


            // 在留言模块的导航栏上需要渲染总共有多少条留言数据
            this.countTotalMsgNum(data.totalNums);

            // 所有编辑区域的小三角（三角的定位依赖于回复按钮的位置）
            // this.editorTriangle = $('.reply-editor-triangle',this.element)


        },
        /**
         *获取回复的留言
         */
        getEditorReply: function (target, data) {
            target.empty();
            var self = this,
                o = this.settings,
                listItemData = data.listItem,
                listItemLength = listItemData.length;
            var subMsgParentId = target.attr('id');
            // 通过这个id可以把二级回复按钮中的删除按钮和遗迹回复中的 回复按钮关联上
            var subMsgDelBtnIdPre = subMsgParentId.split('-')[1];
            if (listItemLength > 0) { // 如果没有留言记录数，则不需要进行这部分页面的渲染
                var listWrap = $('<ul/>').appendTo(target);
                $.each(listItemData, function (index, item) {
                    if (!item.delFlag) { // 不能删除，则不显示删除按钮
                        var subLi = $($myHr.tlp(o.NoLogineditorReplyTlp, item)).appendTo(listWrap);
                    } else {
                        var subLi = $($myHr.tlp(o.editorReplyTlp, item)).appendTo(listWrap);
                    }
                    ;

                    subLi.find('.editorCommDelete').attr('id', subMsgDelBtnIdPre);
                    // 遍历ajax所得的数据，填充模版并增加到父容器中去
                    if (index == (listItemLength - 1)) {  // 如果是最后一个，去掉分隔线
                        subLi.addClass('last');
                    }
                    ;
                });
            }
            ;
            // 给二级“删除”按钮绑定事件
            var editorCommDelete = $('.editorCommDelete', listWrap).bind('click', function () {
                var msgId = $(this).attr('msgID');
                var id = $(this).attr('id');
                $(this).parent().parent().animate({opacity: "0"}, {
                    duration: 'fast', complete: function () {
                        $(this).remove();
                        // 通知后台删除了哪条留言，注意：此时不重新请求留言数据,只有页面再加载的时候才会重新加载
                        $.ajax({
                            type: 'get',
                            url: o.deleteReplyAction,
                            dataType: 'json',
                            cache: false,
                            data: 'msgID=' + msgId,
                            success: function (msg) {
                                // 一级回复中 “回复” 数字的id
                                $('#replyNumid-' + id).html((msg.totalNums > 0) ? msg.totalNums : '');
                            }

                        });
                    }
                });
                return false;
            });
        },
        // count font size of the textarea
        countTextAreaNum: function () {
            // textarea计数
            $('#commBigTextarea').textareaMaxLength({
                rememberCurNum: '.input-num',
                rememberTotalNum: '.total-num',
                totalLength: 200
            });
        },
        bindEvt: function () {
            var self = this,
                o = this.settings;
            // 所有留言
            this.replyCon = $('.comm-list-item', this.element)
            // 所有“回复”按钮
            this.replyBtn = $('.comm-reply', this.element);
            // 所有“删除”按钮
            this.deleteBtn = $('.comm-delete', this.element);
            // 所有 回复留言编辑区域
            this.editorReply = $('.reply-editor', this.element);
            // 点击“回复”按钮，显示textarea的输入框
            this.replyTextarea = $('.comm-reply-input', this.element);
            // 点击“回复”按钮，显示textarea的输入框旁边的“回复”按钮
            this.replyTextareaBtn = $('.reply-btn', this.element);
            // 给所有一级回复按钮绑定事件，点击显示回复的输入框
            $.each(this.replyBtn, function (index, item) {
                $(item).toggle(function () {
                    // 显示回复留言的编辑区域
                    self.editorReply.eq(index).show();
                    // 回复留言的编辑区域
                    var editorReplyWrap = self.editorReply.eq(index).find('.reply-editor-item');
                    // 需要给装载内容的容器增加一个最小高度，目的是为了可以增加一个loading层
                    editorReplyWrap.addClass('relative minHeight');
                    var loadingLayer = $('<div class="loading">正在加载……</div>').appendTo(editorReplyWrap);
                    // 获取当前留言的msgId
                    var msgId = $(this).attr('msgID');
                    // 发送ajax，获取已经回复的留言内容
                    $.ajax({
                        type: 'GET',
                        url: o.getSubContentAction,
                        dataType: 'json',
                        cache: false,
                        data: 'msgID=' + msgId,
                        success: function (msg) {
                            /**
                             *@param {object} editorReplyWrap 需要重新渲染的容器
                             *@param {obj} msg ajax返回的留言数据
                             */
                            self.getEditorReply(editorReplyWrap, msg);
                            editorReplyWrap.removeClass('relative minHeight');
                            // 移除正在加载的loading
                            loadingLayer.remove();
                        }

                    });

                }, function () {
                    // 隐藏回复留言的编辑区域
                    self.editorReply.eq(index).hide();
                });

            });
            // 给所有一级留言里面的"删除"按钮绑定事件 删除当前回复内容
            $.each(this.deleteBtn, function (index, item) {
                $(item).click(function () {
                    self.replyCon.eq(index).animate({opacity: "0"}, {
                        duration: 'fast', complete: function () {
                            $(this).remove();
                            var msgId = $(item).attr('msgID');
                            // 通知后台删除了哪条留言，注意：此时不重新请求留言数据,只有页面再加载的时候才会重新加载
                            $.ajax({
                                type: 'POST',
                                url: o.deleteReplyAction,
                                dataType: 'json',
                                cache: false,
                                data: 'msgID=' + msgId,
                                success: function (msg) {
                                    self.countTotalMsgNum(msg.totalNums);
                                }

                            });
                        }
                    });
                    return false;
                });
            });
            // 二级回复按钮绑定事件
            $.each(this.replyTextareaBtn, function (index, item) {
                $(item).click(function () {
                    // 当前二级回复按钮的id
                    var curSubReplyBtnId = $(this).attr('id');
                    // 通过此id后缀可以跟一级回复按钮计数关联上
                    var parentReplyBtn = curSubReplyBtnId.split('-')[1];
                    // “回复”按钮前面的模拟textarea输入框
                    var textareaLike = $(this).prev();
                    // 如果输入框不为空，则提交给后台，如果为空，则提示相关信息
                    if (textareaLike.text() == '') {
                        $myHr.simleBlockUi({warningText: '只有输入内容后才能提交'});

                    } else if ($myHr.getByteLength(textareaLike.text()) >= 400) {
                        $myHr.simleBlockUi({warningText: '回复字数过多，请控制在200个汉字内'});
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: o.postReplyAction,
                            dataType: 'json',
                            cache: false,
                            data: 'msgID=' + textareaLike.attr('msgId') + "&content=" + encodeURIComponent(textareaLike.text()),
                            success: function (msg) {
                                textareaLike.text('');
                                // 一级回复中 “回复” 数字的id
                                $('#replyNumid-' + parentReplyBtn).html((msg.totalNums > 0) ? msg.totalNums : '');
                                // 重新加载二级回复里面的留言
                                self.getEditorReply($(item).parent().next(), msg);
                            }

                        });
                    }
                    ;
                });
            });
            // 将大输入框中的内容发送给后台
            this.publishCommBtn.unbind('click').bind('click', function () {
                // 判断textarea输入框的内容是否为空，非空提交，空则提示
                if (self.bigTextarea.attr('value') != '') {
                    // 判断字数是否已经超出指定字符数
                    if ($('#commBigTextarea').checkFlag()) {
                        $.ajax({
                            type: 'POST',
                            url: o.postBigTextareaAction,
                            dataType: 'json',
                            cache: false,
                            data: "id=" + o.bigTextareaParamId + "&content=" + encodeURIComponent(self.bigTextarea.attr('value')),
                            success: function (msg) {
                                self.bigTextarea.attr('value', '');
                                self.create(1);
                                self.publishCommBtn.unbind('click');
                                $('.input-num').html(0);
                            }

                        });
                    } else {
                        $myHr.simleBlockUi({warningText: '对不起，请输入指定字数之内的文字'});
                    }
                    ;
                } else {
                    $myHr.simleBlockUi({warningText: '请输入内容'});
                }
                ;
            });
        }
    }


    /**
     *@author by dengxiaoming
     *@update  2011-9-22
     *@descript 表格下载页面，模块js
     *@dependence according.js  pager.js  以及模块 $myHr.commonList
     */
    $myHr.DownloadTable = {
        /**
         *@description 填充右侧的表格内容
         */
        init: function (opts) {
            // 默认搜索全部，点击二级菜单的时候会将这个变量重新赋值
            this.curSubmenuId = 'all';
            // 默认发送请求时输入框为空
            this.ajaxInputValue = '';

            this.opts = $.extend({
                menuWrap: '',                    // 通过这个变量可以直接获取到menu的父容器,比如：.test or  #test
                wkeAccordionHeader: '.wke-accordion-header',	// accordion header
                menuDataAction: '',              // 填充menu的数据来源
                submenuTlp: '',                  // 左侧menu的二级菜单模版
                onClickSubMenu: '',              // 点击菜单二级页绑定事件
                onMenuFinished: '',              //  menu数据填充完成后可以绑定事件
                downloadTableListWrap: '',		// 通过这个变量可以直接获取到表格下载列表的父容器
                downloadTableListContentTlp: '',  // 右侧下载表格列表子项的模版
                fillTableListDataAction: '',      // 填充右侧列表数据的action
                pageWrap: '',                     // 装载翻页按钮的父容器
                inputDefaultText: '搜索表格',                        // 输入框默认文字
                inputEle: '#searchTable',                     // 输入框
                searchBtn: '#searchTableBtn',                     // 搜索按钮
                clearKeyBtn: '',                                  // 清空搜索条件
                searchAction: '',                              // 搜索请求action
                pointPos: '.pointing',						// 小箭头位置
                downloadTable: '.download-table-r',	// 下载table
                isClearKeyAfterFillTable: true		// 清空input后是否重新加载数据。
            }, opts || {});
            // 左侧menu父容器
            this.menuWrap = $(this.opts.menuWrap);
            this.downloadTableListWrap = $(this.opts.downloadTableListWrap);
            this.pageWrap = $(this.opts.pageWrap);
            this.inputEle = $(this.opts.inputEle);
            this.searchBtn = $(this.opts.searchBtn);
            this.cleanSearchKeyBtn = $(this.opts.clearKeyBtn);
            // 页面一加载就加载第一页的数据
            this.fillTableData(1);
            this.fillMenu();
            // 进行表格下载
            this.search();
            this.inputBind();
        },
        /**
         * 给input绑定事件
         */
        inputBind: function () {
            var self = this;
            this.inputEle.bind('keyup', function () {
                var v = self.inputEle.val();
                if (v != '') {
                    // 如果输入框不为空，则显示删除按钮
                    self.cleanSearchKeyBtn.show();
                    self.cleanSearchKey();
                } else {
                    // 输入框为空，隐藏删除按钮
                    self.cleanSearchKeyBtn.hide();
                    // 清空input后是否重新加载数据
                    self.opts.isClearKeyAfterFillTable ? self.getTableData({"page": 1}) : "";
                }
                ;
            });
        },
        getTableData: function (options) {
            var self = this;
            var op = $.extend({
                'key': '',
                'page': 1
            }, options);
            self.ajaxInputValue = op.key;
            self.curSubmenuId = 'all';
            self.fillTableData(op.page);
            self.clearPoint();
        },
        /**
         *  clear searchKey ,reflesh the content
         */
        cleanSearchKey: function () {
            var self = this;
            this.cleanSearchKeyBtn.show().unbind('click').bind('click', function () {
                var value = self.inputEle.val();
                if (value != '' && value != self.opts.inputDefaultText) {  // 如果输入框内容不为空，则清空,并重新请求数据
                    $(self.inputEle).placeHolder({
                        text: self.opts.inputDefaultText
                    });
                    self.cleanSearchKeyBtn.hide();
                    // 重新发送请求
                    self.ajaxInputValue = '';
                    self.curSubmenuId = 'all';
                    self.fillTableData(1);
                    self.clearPoint();
                }
                ;
            });

        },
        /**
         *@description 填充左侧的menu
         */
        fillMenu: function () {
            var self = this;
            this.menuWrap.accordion({
                dataUrl: self.opts.menuDataAction,
                submenuTlp: self.opts.submenuTlp,
                /**
                 *点击二级菜单的时候触发 param均为acoording封装好传递过来的
                 *param {HTMLDom} target 当前的二级菜单
                 *param {event} event 当前点击的事件
                 */
                onClickSubMenu: function (target, event) {// alert('df');
                    self.opts.onClickSubMenu.call(self, target, event);
                },
                /**
                 *数据加载完后执行 acdording组件将返回参数container为装载according的父容器
                 *param {HTMLDom} target 当前的二级菜单
                 *param {event} event 当前点击的事件
                 */
                onFinished: function (container) {
                    if (typeof self.opts.onMenuFinished == 'function') {
                        self.opts.onMenuFinished.call(self, container);
                    }
                    ;
                },
                onClickMainMenu: function (container) {
                    self.opts.onClickMainMenu.call(self, container);
                }
            });
        },
        /**
         *@description 填充右侧的表格内容
         */
        fillTableData: function (curPage) {
            var self = this;
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: self.opts.fillTableListDataAction,
                data: 'id=' + self.curSubmenuId + '&curPage=' + curPage + '&key=' + encodeURIComponent(self.ajaxInputValue),
                cache: false,
                success: function (data) { // 由ajax获取数据渲染页面
                    if (data.items.length > 0) { // have data
                        render(data.items);
                        self.createPage(data);
                    } else {
                        self.downloadTableListWrap.html('暂无数据');
                    }
                    ;

                },
                error: function () {
                }
            });
            function render(data) {
                new $myHr.commonList(self.downloadTableListWrap, {
                    contentData: data,
                    subByteSize: 72,
                    contentTlp: self.opts.contentTlp,
                    callback: function () {
                        // 给每个子项目鼠标经过时候增加选中样式，“下载“按钮只有在鼠标经过的时候才显示出
                        var childs = $(self.downloadTableListWrap).children(),
                            childLen = childs.size();
                        // remove the bottom line of the last children
                        self.downloadTableListWrap.children().last().addClass('last');
                        $.each(childs, function (index, item) {
                            $(item).bind('mouseover', function () {
                                $(this).addClass('hover').siblings().removeClass('hover');
                            }).bind('mouseout', function () {
                                $(this).removeClass('hover');
                            });
                        });
                    }
                });
            };
        },
        /**
         *翻页
         */
        createPage: function (msg) {
            var self = this;
            this.pageWrap.pager({
                totalNums: msg.totalPage,
                callback: update,
                curPage: msg.currentPage,
                perPage: msg.perPage
            });
            // 点击页码的时候绑定事件，重新渲染获取数据渲染内容
            function update(curPage) {
                self.fillTableData(curPage);
                return false;
            }
        },
        // 表格搜索
        search: function () {
            var self = this;
            // 搜索表格
            $myHr.Search.init({
                inputEle: self.inputEle,                           // input元素
                action: self.searchAction,                             // 请求的地址
                searchBtn: self.searchBtn,                          // 发起请求的地址
                defaultText: self.opts.inputDefaultText,                         // 默认提示文字
                callback: function () {
                    var $point = $(self.opts.pointPos, $(self.opts.downloadTable));
                    $point.css({'top': 8}).show();
                    var param = self.inputEle.val();
                    if (param != '' && param != self.opts.defaultText) {
                        // 重新发送请求
                        self.ajaxInputValue = param;
                        self.curSubmenuId = 'all';
                        self.fillTableData(1);
                    } else {
                        $myHr.simleBlockUi({warningText: '输入要查询的内容'});
                    }
                    ;

                }
            });
        },
        // 添加小箭头
        point: function (options) {
            var self = this;
            var $point = $(self.opts.pointPos, $(self.opts.downloadTable)).show();
            var opts = $.extend({
                'lineHeight': 30,
                'baseHeight': 20,
                'index': 0,
                'top': function () {
                    return ( this.index + 1 ) * this.lineHeight + this.baseHeight;
                },
                'point': function () {
                    $point.css({top: this.top()})
                }

            }, options);

            $(self.opts.wkeAccordionHeader, $(self.opts.menuWrap)).each(function (i, item) {
                if ($(item).attr('disable') === 'true') {
                    opts.index = i;
                    opts.point();
                    return false;
                }
            })
        },
        //  清楚小箭头
        clearPoint: function () {
            var self = this;
            var $point = $(self.opts.pointPos, $(self.opts.downloadTable));
            $point.hide();
        }

    };

    /**
     * hr日历
     * @author by dengxiaoming
     * @update 2011-9-24
     */
    $myHr.ServiceCalendar = {
        storeMonth: null,    // 用来缓存当前月份，如果重复在同一个节点上来回移入移出，不进行页面的重渲染
        init: function (opts) {
            this.opts = $.extend({
                timeaxisWrap: '.timeaxis-list',                     // 通过这个变量可以获取到装载timeaxis的父容器
                currentMonthWrap: '#currentMonth',                  // according上面的显示当前月份的容器
                findAxisItemBy: 'li',                               // 通过此标签可以找到所有时间轴上的节点
                timeaxisEvtName: 'click',                      // 触发时间轴的事件类型
                getAccordionAction: '',                             // 获取according数据的action
                getAxisYearAction: ''                               // 获取所有年份
            }, opts || {});
            // according上面的显示当前月份的容器
            this.currentMonthWrap = $(this.opts.currentMonthWrap);
            this.timeaxisWrap = $(this.opts.timeaxisWrap);
            // month arrray
            this.monnthArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
            this.changeAxisYear();
            // this.renderTimeAxis();
        },
        /**
         * 渲染时间轴，已经过去的月份为灰色，当前月份为红色，未来月份为蓝色
         */
        renderTimeAxis: function (settings) {
            var o = this.opts,
                self = this;
            settings = $.extend({}, settings || {});
            this.timeaxisWrap.empty();
            // 获取时间对象
            this.trueCurYear = new Date().getFullYear();
            var today = (settings.mYear && settings.mYear != this.trueCurYear) ? new Date(settings.mYear, 1, 1) : new Date(),
                curMonth = (settings.mYear && settings.mYear != this.trueCurYear) ? 0 : today.getMonth(),
                curDay = today.getDay();
            this.curYear = today.getFullYear();
            // render the axis
            for (var i = 1; i <= 12; i++) {
                $('<li><div class="text-detail">' + this.curYear + '年' + i + '月</div></li>').appendTo(this.timeaxisWrap);
            }
            ;
            // 所有时间节点,绑定事件
            this.timeaxis = $(o.findAxisItemBy, o.timeaxisWrap).bind(o.timeaxisEvtName, function () {
                // 获取缓存在节点中的 月份的索引值
                var m = $.data($(this)[0], 'index');
                /**
                 *  重新渲染页面数据
                 * @param {number} m 当前月份
                 */
                // if(self.storeMonth != m){  // 增加缓存，如果重复在同一个节点上移入移出是不会进行页面的重渲染的
                self.renderData(m, $(this));
                $(this).addClass('currentMonth').siblings().removeClass('currentMonth');
                // };
            });

            // 渲染时间轴的循环
            $.each(this.timeaxis, function (index, item) {
                if (index == curMonth) {
                    // 给当前月份增加当前样式,并缓存中设置 当前月份还没有过完
                    $(self.timeaxis[index]).addClass('futureMonth currentMonth');
                    if (!$.data(self.timeaxis[index], 'future') && !$.data(self.timeaxis[index], 'index')) {
                        $.data(self.timeaxis[index], 'future', true);
                        $.data(self.timeaxis[index], 'index', index);
                    }
                    ;
                } else if (index > curMonth) {
                    // 给还未到来的月份增加蓝色样式,并缓存中设置 当前月份还没有过完
                    $(self.timeaxis[index]).addClass('futureMonth');
                    if (!$.data(self.timeaxis[index], 'future') && !$.data(self.timeaxis[index], 'index')) {
                        $.data(self.timeaxis[index], 'future', true);
                        $.data(self.timeaxis[index], 'index', index);
                    }
                    ;
                } else {
                    $.data(self.timeaxis[index], 'past', 'true');
                    $.data(self.timeaxis[index], 'index', index);
                }
                ;
            });
            // 页面初始化的时候需要渲染页面效果
            this.renderData(curMonth, $(this.timeaxis[curMonth]));
        },
        // 渲染页面数据
        renderData: function (m, current) {
            this.renderAccording(m + 1);
            // 重新记录月份
            this.storeMonth = m;
            // 获得当前节点的位置
            var pos = current.position();
            this.resetTriangle(pos);
            // 重新渲染according上面的当前月份
            this.currentMonthWrap.html(this.monnthArr[this.storeMonth]);
        },
        /**
         * 渲染日历右侧的accordion数据,并将月份的索引值m以变量形式传入
         * @param m
         */
        renderAccording: function (m) {
            var self = this;
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: self.opts.getAccordionAction,
                data: 'year=' + this.curYear + '&month=' + m,
                cache: false,
                success: function (data) { // 由ajax获取数据渲染页面
                    if (data.length > 0) {  // 如果有数据
                        self.renderDateTable(data);
                        self.createAccordion(self, data);
                    } else {   // 没有数据,则直接渲染日历 ,不需要渲染according，直接清空即可以
                        self.renderDateTable([{dateRange: '', color: '', title: '', id: ''}]);
                        $('#accordion').empty();
                    }
                    ;

                },
                error: function () {
                }
            });
        },
        /**
         * 根据ajax返回的数据渲染according
         * @param data
         */
        createAccordion: function (self, data, notAllowClick) {
            $('#accordion').accordion({
                // title模版
                titleTlp: '<h3 date-range="&{dateRange}" date-color="&{color}" date-title="&{title}" date-con=\'&{con}\' date-id="&{id}" d-selected=false><span class="wke-accordion-icon"></span><span style="background-color:&{color};width: 10px;height: 10px;float: left;margin-right: 10px;margin-top: 10px;"></span><span>&{title}</span></h3>',
                items: data,
                notAllowClick: notAllowClick,
                defaultCollapsed: true,
                onClickMainMenu: function () {
                    var selected = $(this).attr('d-selected');
                    if (selected != 'false') {
                        if (self.renderDateTable) {
                            self.renderDateTable([{dateRange: '', color: '', title: '', id: '', con: ''}]);
                        }
                    } else {
                        if (self.renderDateTable) {
                            var dateRange = $(this).attr('date-range');
                            var color = $(this).attr('date-color');
                            var title = $(this).attr('date-title');
                            var id = $(this).attr('date-id');
                            var con = $(this).attr('date-con');
                            self.renderDateTable([{
                                dateRange: dateRange,
                                color: color,
                                title: title,
                                id: id,
                                con: con
                            }]);
                        }
                    }
                    $(this).parent().find('h3').attr('d-selected', 'false');
                    $(this).attr('d-selected', selected == 'false' ? 'true' : 'false');
                    // 处理全部数据展示
                    var allCollapseFlag = true;
                    var allData = [];
                    $(this).parent().find('h3').each(function (h, h3) {
                        if ($(h3).attr('d-selected') == 'true') {
                            allCollapseFlag = false;
                        }
                        var dateRange = $(h3).attr('date-range');
                        var color = $(h3).attr('date-color');
                        var title = $(h3).attr('date-title');
                        var id = $(h3).attr('date-id');
                        var con = $(h3).attr('date-con');
                        allData.push({dateRange: dateRange, color: color, title: title, id: id, con: con});
                    });
                    if (allCollapseFlag) {
                        self.renderDateTable(allData);
                    }

                },
                /**
                 *数据加载完后执行 acdording组件将返回参数container为装载according的父容器
                 *param {HTMLDom} target 当前的二级菜单
                 *param {event} event 当前点击的事件
                 */
                onFinished: function (container) {
                    // according所有头
                    var heads = container.find('.wke-accordion-header');
                    // 保存回调函数的作用域,跟外面的this不一样
                    var _this = this;
                    $.each(data, function (index, item) {
                        if (item.expand == true) {  // 判断哪个item一加载就是展开的
                            // 充值according的默认展开项
                            _this.settings.active = index;
                            // 根据默认展开项渲染日历表格
                            heads.eq(index).addClass('wke-accordion-header-selected');
                            heads.eq(index).next().addClass('wke-accordion-content-active');
                            var dateRange = heads.eq(index).attr('date-range');
                            var color = heads.eq(index).attr('date-color');
                            var title = heads.eq(index).attr('date-title');
                            var id = heads.eq(index).attr('date-id');
                            var con = heads.eq(index).attr('date-con');
                            heads.eq(index).attr('d-selected', 'true');
                            self.renderDateTable([{
                                dateRange: dateRange,
                                color: color,
                                title: title,
                                id: id,
                                con: con
                            }]);
                        }
                        ;
                    });

                }
            });
        },

        resetTriangle: function (pos) {
            $('.calendar-detail-bottom-s').css({left: pos.left + 43});
        },
        /**
         * 渲染日历
         * @param {string} dateRange 项目的时间范围
         */
        renderDateTable: function (data) {
            var c = new Calendar({
                container: '#calendarDate',
                data: data,
                Month: this.storeMonth + 1,
                Year: this.curYear
            });

        },
        /**
         * set axis.loading the year first , after that we can show or hide it.
         */
        changeAxisYear: function () {
            // this.renderTimeAxis();
            var self = this;
            var listWrap = $('#changeAxisYearList');
            // call commonList function,render year content
            var years = new $myHr.commonList('#timeaxisYearList', {
                contentDataUrl: self.opts.getAxisYearAction,
                contentTlp: '<li><a href="javascript:void(0)">&{year}</a></li>',
                callback: function () {
                    // reset the list postion
                    resetYearsWrapPostion();
                    // show or hide years
                    slideShowYears();
                    // click years item bind events
                    onClickYearsItem();
                    self.renderTimeAxis();
                }
            });
            //  when ajax is compelted,we can calculate the height of the list,the we can reset the list postion
            function resetYearsWrapPostion() {
                var h = listWrap.height();
                listWrap.css({top: -h + 12});
            };
            // show or hide years
            function slideShowYears() {

                var children = listWrap.find('a');
                var currentYear = new Date().getFullYear();
                $.each(children, function (index, item) {
                    var value = $(item).html();
                    if (value == currentYear) {  // if content is current year,we need set it as current style
                        $(item).parent().addClass('current');
                    } else if (value < currentYear) {
                        $(item).parent().addClass('history');
                    }
                    ;
                });
                $('#changeAxisYearBtn').bind('click', function () {
                    if (!listWrap.is(':visible')) {
                        listWrap.show();
                    } else {
                        listWrap.hide();
                    }
                    ;
                    // cancle bubble
                    return false;
                });
                // support click the document to close the list
                $(document).click(function (event) {
                    listWrap.hide();
                });
            };
            /**
             * 点击年份可以修改时间轴的年份
             */
            function onClickYearsItem() {
                $('li', listWrap).bind('click', function () {
                    self.renderTimeAxis({mYear: $(this).find('a').html()});
                    $(this).addClass('current').siblings().removeClass('current');
                    return false;
                });
            };
        }

    };
    /**
     * blog式日历控件
     * @param opts
     */
    function Calendar(opts) {
        this.opts = $.extend({
            container: '',
            Year: '',                                 // 可以自定义年份
            Month: '',                                // 可以自定义月份
            Days: '',
            selectDayRange: [7, 18]                    // 选中日期的范围
        }, opts || {});
        this.Container = $(this.opts.container)[0];
        this.Days = this.opts.Days;
        this.Year = this.opts.Year || new Date().getFullYear();
        this.Month = this.opts.Month || new Date().getMonth() + 1;
        this.data = this.opts.data;
        this.Draw(this.data);

    };
    Calendar.prototype = {
        Draw: function (data) {
            var self = this;
            // 用来保存日期列表
            var arr = [];
            // 用当月第一天在一周中的日期值作为当月离第一天的天数
            for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
                arr.push(0);
            }
            // 用当月最后一天在一个月中的日期值作为当月的天数
            for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
                arr.push(i);
            }
            // 清空原来的日期对象列表
            this.Days = [];
            // 插入日期
            var frag = document.createDocumentFragment();
            while (arr.length) {
                // 每个星期插入一个tr
                var row = document.createElement('tr');
                // 每个星期有7天
                for (var i = 1; i <= 7; i++) {
                    var td = document.createElement('td');
                    td.eventNum = 0;
                    var cellContainer = document.createElement('div');
                    var cell = document.createElement('span');
                    td.appendChild(cellContainer);
                    cellContainer.appendChild(cell);
                    cell.innerHTML = '&nbsp;';
                    if (arr.length) {
                        var d = arr.shift();
                        if (d) {
                            cell.innerHTML = d;
                            this.Days[d] = cell;
                            var on = new Date(this.Year, this.Month - 1, d);
                            td.dataId = [];
                            td.dataTitle = [];
                            td.dataColor = [];
                            td.dataCon = [];
                            // 当前日期如果在工作安排范围内，并且不是周末，则在时间表格中显示
                            for (var j = 0; j < this.data.length; j++) {
                                var selectDayRange = null;
                                if (data[j].dateRange instanceof Array) {
                                    selectDayRange = data[j].dateRange;
                                } else if (data[j].dateRange) {
                                    selectDayRange = data[j].dateRange.split(',');
                                } else {
                                    continue;
                                }

                                for (var day in selectDayRange) {
                                    if (d == selectDayRange[day]) {
                                        td.eventNum += 1;
                                        td.className = 'current';
                                        if (td.eventNum > 1) {
                                            td.style.background = '';
                                            cellContainer.style.background = "url('../common/css/images/multi.png')";
                                            cell.style.background = "url('../common/css/images/multi.png')";
                                            // cell.className = 'calendar-detail-con-datebox-multi';
                                            var numContainer = document.createElement('div');
                                            numContainer.innerHTML = td.eventNum;
                                            cellContainer.innerHTML = '';
                                            cellContainer.appendChild(numContainer);
                                            cellContainer.appendChild(cell);
                                            cell.innerHTML = d;
                                        } else {
                                            td.style.backgroundColor = data[j].color;
                                            cell.style.backgroundColor = data[j].color;
                                            cellContainer.style.background = data[j].color;
                                        }
                                        td.dataId.push(data[j].id);
                                        td.dataTitle.push(data[j].title);
                                        td.dataColor.push(data[j].color);
                                        td.dataCon.push(data[j].con);
                                        td.dataDay = d;
                                        $(td).unbind('click').bind('click', function (e) {
                                            var data = [];
                                            for (var idi = 0; idi < e.currentTarget.dataId.length; idi++) {
                                                data.push({
                                                    color: e.currentTarget.dataColor[idi],
                                                    title: e.currentTarget.dataTitle[idi],
                                                    dateRange: [e.currentTarget.dataDay],
                                                    id: e.currentTarget.dataId[idi],
                                                    con: e.currentTarget.dataCon[idi],
                                                    expand: true
                                                });
                                            }
                                            $myHr.ServiceCalendar.createAccordion($myHr.ServiceCalendar, data, true);
                                            $myHr.ServiceCalendar.renderDateTable(data);
                                        });
                                    }
                                }
                                // if((d + firstDay) %7 == 0 || (d + firstDay) %7 == 1 ){
                                //    className = 'restday';
                                // };
                                // 判断是否今日
                                if (this.IsSame(on, new Date())) {
                                    // td.className = 'current';
                                }
                                ;
                            }
                            //  if(d >= self.selectDayRange[0] && d <= self.selectDayRange[1] && (d + firstDay) %7 != 0 && (d + firstDay) %7 != 1 ){
                            //      td.className = 'current';
                            //  };
                            // 判断是否为周末,如果是周末，增加样式

                            // 判断是否选择日期
                            // this.IsSame(on, this.SelectDay) ;
                        }
                    }
                    row.appendChild(td);
                }
                frag.appendChild(row);
            }
            ;
            // 先清空内容再插入(ie的table不能用innerHTML)
            while (this.Container.hasChildNodes()) {
                this.Container.removeChild(this.Container.firstChild);
            }
            this.Container.appendChild(frag);
        },
        // 判断是否同一日
        IsSame: function (d1, d2) {
            return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
        }
    };

    /**
     * 搜索模块
     */
    $myHr.Search = {
        init: function (opts) {
            this.opts = $.extend({
                inputEle: '',                           // input元素
                action: '',                             // 请求的地址
                searchBtn: '',                          // 发起请求的地址
                defaultText: '',                         // 默认提示文字
                callback: ''                            // 点击按钮时候的需要执行的函数
            }, opts || {});
            // 渲染默认文字
            this.renderDefaultText();
            this.bindEvt();
        },
        // 渲染input默认文字
        renderDefaultText: function () {
            var o = this.opts;
            $(o.inputEle).placeHolder({
                text: o.defaultText
            });
        },
        bindEvt: function () {
            var o = this.opts,
                self = this,
                input = $(o.inputEle),
                searchBtn = $(o.searchBtn);
            searchBtn.bind('click', function () {
                // 输入框的值
                var value = input.val();
                // 给搜索按钮绑定事件，如果输入框的值不为空且不等于默认提示的文字，则给后台发送请求
                if (value != '' && value != o.defaultText) {
                    if (typeof o.callback == 'function') {  // 如果用户定义了点击搜索按钮的行为，则执行，否则页面跳转
                        o.callback();
                    } else {  // 页面跳转
                        window.location = o.action + "?keyWord=" + encodeURIComponent(value) + "&t=" + new Date().getTime();
                    }
                    ;
                } else {
                    $myHr.simleBlockUi({warningText: '查询内容不能为空'});
                }
                ;
            });
            // support press 'enter' keybord to submit
            input.bind('keydown', function (e) {
                if (e.keyCode == 13) {
                    searchBtn.trigger('click');
                }
                ;
            });

        }
    };

    /**
     * simple blockUi 可以用来替代alert效果
     * depend jquery.blockUI.js
     */
    $myHr.simleBlockUi = function (opts) {
        opts = $.extend({
            warningText: ''
        }, opts || {});
        $.blockUI({
            message: opts.warningText,
            fadeIn: 700,
            fadeOut: 700,
            timeout: 2000,
            css: {
                'backgroundColor': '#fff',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                'border-radius:': '10px',
                'opacity': .6,
                'height': 40,
                'font-size': '14px',
                'line-height': '40px',
                'color': '#042953',
                'font-weight': 'bold',
                'border-color': '#82baed',
                'z-index': '10001'
            },
            overlayCSS: {'z-index': '10000'}
        });
    };
    /**
     * 人事服务详情页，tab内容锚链接
     */
    $.detailServiceAnchorLink = function () {
        function create(id) {
            // 加入下面几句代码是为了在每次单击目录的标题时，能够把目录对应的id也复制到剪贴板上
            subtitleId = id.substring(8);
            id = id.substring(0, 7);
            clipBoardContent = clipBoardContent + "&subTitleId=" + subtitleId;
            initCopyClipBoard(clipBoardContent);

            // 当前显示的内容输入tab导航的第几个
            var currentShowContenNum = id.substring(4, 5);
            // 必须先重置为零，否则会算错，具体原因未知
            $('.detail-con-show').eq(currentShowContenNum)[0].scrollTop = 0;
            var goalObj = $('#' + id);
            var t = goalObj.position().top;
            $('.detail-con-show').eq(currentShowContenNum)[0].scrollTop = t - 100;
        };
        return {
            create: create
        };
    }();

    /**
     *hr政策资讯搜索模块
     *@param {string}    装载内容的容器，可以是id 也可以是class
     *@param {object}    用户自定义参数
     */
    $myHr.PolicyNewsSearchModul = function (settings) {
        var defaults = {
            searchBtn: '',                   // 执行搜索的按钮
            cleanSearchKeyBtn: '',           // 清除搜索条件的按钮
            inputEle: '',             		// 搜索输入框
            conEle: '',                		// 内容存放容器
            conTlp: '',               		// 渲染内容的子项模版
            defaultText: '搜索政策制度',
            ajaxAction: '',      			// 渲染内容需要请求的action
            subByteSize: 18,              	// 字符截断的长度,多于这个长度将会以"..."代替
            isClearKeyAfterFillTable: true,	// 清空input后是否重新加载数据
            clearTime: 0 // 清空次数
        };
        this.settings = $.extend({}, defaults, settings);
        this.searchBtn = $(this.settings.searchBtn);                        // 执行搜索的按钮
        this.cleanSearchKeyBtn = $(this.settings.cleanSearchKeyBtn);                    // 清除搜索条件的按钮
        this.inputEle = $(this.settings.inputEle);                           // 搜索输入框
        this.conEle = $(this.settings.conEle);                              // 内容存放容器
        this.create();
    };
    $myHr.PolicyNewsSearchModul.prototype = {
        create: function () {
            this.search();
            this.createHrPolicyNews();
            this.inputBind();
        },
        /**
         *  search
         */
        search: function () {
            var self = this;
            $myHr.Search.init({
                inputEle: self.inputEle,                           // input元素
                searchBtn: self.searchBtn,                          // 发起请求的地址
                defaultText: self.settings.defaultText,                         // 默认提示文字
                callback: function () {
                    var param = self.inputEle.val();
                    if (param != '' && param != this.defaultText) {
                        self.createHrPolicyNews(param);
                    } else {
                        alert('输入要查询的内容');
                    }
                    ;

                }
            });
        },
        /**
         * 给input绑定事件
         */
        inputBind: function () {
            var self = this;
            this.inputEle.bind('keyup', function (e) {
                var v = self.inputEle.val();
                if (v != '') { // 如果输入框不为空，则显示删除按钮
                    self.cleanSearchKeyBtn.show();
                    self.cleanSearchKey();
                    self.clearTime = 0;
                } else {  // 输入框为空，隐藏删除按钮
                    self.cleanSearchKeyBtn.hide();
                    // 清空input后是否重新加载数据
                    if (e.keyCode == 8) {// 键盘清空,删除键
                        if (self.clearTime == 0) {
                            self.settings.isClearKeyAfterFillTable ? self.createHrPolicyNews('') : "";
                        }
                        self.clearTime++;
                    }

                }
            });
        },

        /**
         *  clear searchKey ,reflesh the content
         */
        cleanSearchKey: function () {
            var self = this;
            this.cleanSearchKeyBtn.bind('click', function () {
                var value = self.inputEle.val();
                if (value != '' && value != self.settings.defaultText) {  // 如果输入框内容不为空，则清空,并重新请求数据
                    $(self.inputEle).placeHolder({
                        text: self.settings.defaultText
                    });
                    self.cleanSearchKeyBtn.hide();
                    self.createHrPolicyNews('');
                }
                ;
            });

        },
        /**
         *  hr政策咨询搜索结果
         *  @param {string} param  the param of ajax
         */
        createHrPolicyNews: function (param) {
            if (param == undefined) {
                param = '';
            }
            var self = this;
            param ? param : '';   // 可以为空（页面初次加载即为空）
            var dataUrl = self.settings.ajaxAction;
            if (dataUrl.indexOf('?') > -1) {
                dataUrl += '&key=';
            } else {
                dataUrl += '?key=';
            }
            dataUrl += encodeURIComponent(param);
            new $myHr.commonList('#hrPolicyNewsCon', {
                contentDataUrl: dataUrl,
                subByteSize: self.settings.subByteSize,
                ajaxDataParam: 'key=' + encodeURIComponent(param),
                contentTlp: self.settings.conTlp,
                callback: function (data) {
                    // 给每个子项目鼠标经过时候增加选中样式，“下载“按钮只有在鼠标经过的时候才显示出
                    var childs = self.conEle.children();
                    $.each(childs, function (index, item) {
                        $(item).bind('mouseover', function () {
                            $(this).addClass('hover').siblings().removeClass('hover');
                        }).bind('mouseout', function () {
                            $(this).removeClass('hover');
                        });
                    });
                    childs.last().addClass('last');

                    // 只有允许下载才能出现下载按钮
                    var notallowdowndiv = $('.allowdown_0');// allowdown_0 表示不能下载，allowdown_1表示可以下载
                    $.each(notallowdowndiv, function (index, item) {
                        $(this).remove();
                    });
                }
            });
        }
    };

    // 新办工作居住证
    $myHr.formSave = function(options){
        var ops = $.extend({
            forms:"form",
            saveBtn:".saveBtn",
            success:function(){
                alert("保存成功");
            },
            submitBefore:function(){}
        }, options);
        //console.log(ops.saveBtn)
        $(ops.forms).each(function(){
            $.data(this, "formData", {
                url:this.action
            });
            var formData = $.data(this, "formData");
            //console.log(formData.url)
            var self = this,
                saveBtn = $(self).find(ops.saveBtn);
            //console.log(saveBtn)
            saveBtn.bind("click", function(n,istip,isCheck){
                var $self = $(this),
                    $form = $(this).closest("form");
                if($form[0].id=='form_work'){
                    $('#form_work').find('.subcolumns').each(function(i,n){
                        $(this).find(':input[name^="workExperience["]').each(function(j,n){
                            var name=$(this).attr('name');
                            var indetemp=name.indexOf(']');
                            $(this).attr('name','workExperience['+i+name.substring(indetemp));
                        });
                    });
                }
                if($form[0].id=='form_child'){
                    $('#form_child').find('.subcolumns').each(function(i,n){
                        $(this).find(':input[name^="childInfos["]').each(function(j,n){
                            var name=$(this).attr('name');
                            var indetemp=name.indexOf(']');
                            $(this).attr('name','childInfos['+i+name.substring(indetemp));
                        });
                    });
                }
                if($form[0].id=='form_edu'){
                    $('#form_edu').find('.subcolumns').each(function(i,n){
                        $(this).find(':input[name^="eduExperience["]').each(function(j,n){
                            var name=$(this).attr('name');
                            var indetemp=name.indexOf(']');
                            $(this).attr('name','eduExperience['+i+name.substring(indetemp));
                        });
                    });
                }

                if($form[0].id=='nosave'){
                    $('#nosave').find('.subcolumns').each(function(i,n){
                        $(this).find(':input[name^="relationPersionInfo["]').each(function(j,n){
                            var name=$(this).attr('name');
                            var indetemp=name.indexOf(']');
                            $(this).attr('name','relationPersionInfo['+i+name.substring(indetemp));
                        });
                    });
                }

                var tempObj = {}, tempArr = $form.serializeArray();
                for(var i = tempArr.length; i > 0; i--){
                    tempObj[tempArr[i-1].name] = tempArr[i-1].value || "";
                }

                if(istip==undefined)istip=true;
                if(isCheck==undefined)isCheck=true;

                if($.browser.msie){
                    var res=false;
                    var fields =$form.find(":input:not(:submit):not(:reset):not(:button):not(:hidden)");
                    $.each(fields,function(i,n){
                        if(n.hasAttribute('required')){
                            if($(n).val()==null || $(n).val()==''){
                                $(n).msgtip("show").msgtip("setMsgtipConByThis", $(n).attr("msgtip") || "必填项");
                                res=true;
                            }
                        }
                    });
                    if(res){
                        return false;
                    }
                }
                //console.log( tempObj );
                if(isCheck && !ops.submitBefore.call($form) ){
                    return false;
                }

                $.ajax({
                    url:formData.url,
                    data:tempObj,
                    async:false,
                    type:"post",
                    dataType:"json",
                    success:function(data){
                        options.success.call($form, data,istip);
                    }
                });
                return false;
            });
        })
    };

    $myHr.formSaveLx = function (options) {
        var ops = $.extend({
            forms: 'form',
            saveBtn: '.saveBtn',
            success: function () {
                alert('保存成功');
            },
            submitBefore: function () {
            }
        }, options);
        // console.log(ops.saveBtn)
        $(ops.forms).each(function () {
            $.data(this, 'formData', {
                url: this.action
            });
            var formData = $.data(this, 'formData');
            // console.log(formData.url)
            var self = this,
                saveBtn = $(self).find(ops.saveBtn);
            // console.log(saveBtn)
            saveBtn.bind('click', function (n, istip, isCheck) {
                var $self = $(this),
                    $form = $(this).closest("form");
                //  教育信息
                if ($form[0].id == 'form_trainLxInfo') {
                    $('#form_trainLxInfo').find('.subcolumns').each(function (i, n) {
                        $(this).find(':input[name^="trainLxInfo["]').each(function (j, n) {
                            var name = $(this).attr('name');
                            var indetemp = name.indexOf(']');
                            $(this).attr('name', 'trainLxInfo[' + i + name.substring(indetemp));
                        });
                    });
                }
                //  国内教育详细信息
                if ($form[0].id === 'form_domesticinfo') {
                    $('#form_domesticinfo').find('.subcolumns').each(function (i, n) {
                        $(this).find(':input[name^="domesticinfo["]').each(function (j, n) {
                            var name = $(this).attr('name');
                            var indetemp = name.indexOf(']');
                            $(this).attr('name', 'domesticinfo[' + i + name.substring(indetemp));
                        });
                    });
                }
                //  国外教育信息
                if ($form[0].id === 'form_studyAbroadInfo') {
                    $('#form_studyAbroadInfo').find('.subcolumns').each(function (i, n) {
                        $(this).find(':input[name^="studyAbroadInfo["]').each(function (j, n) {
                            var name = $(this).attr('name');
                            var indetemp = name.indexOf(']');
                            $(this).attr('name', 'studyAbroadInfo[' + i + name.substring(indetemp));
                        });
                    });
                }
                //  国外教育详细信息
                if ($form[0].id === 'form_abroadEducation') {
                    $('#form_abroadEducation').find('.subcolumns').each(function (i, n) {
                        $(this).find(':input[name^="abroadEducation["]').each(function (j, n) {
                            var name = $(this).attr('name');
                            var indetemp = name.indexOf(']');
                            $(this).attr('name', 'abroadEducation[' + i + name.substring(indetemp));
                        });
                    });
                }
                if ($form[0].id === 'form_work') {
                    $('#form_work').find('.subcolumns').each(function (i, n) {
                        $(this).find(':input[name^="workLxExperience["]').each(function (j, n) {
                            var name = $(this).attr('name');
                            var indetemp = name.indexOf(']');
                            $(this).attr('name', 'workLxExperience[' + i + name.substring(indetemp));
                        });
                    });
                }

                if ($form[0].id == 'nosave') {
                    $('#nosave').find('.subcolumns').each(function (i, n) {
                        $(this).find(':input[name^="relationLxPersionInfo["]').each(function (j, n) {
                            var name = $(this).attr('name');
                            var indetemp = name.indexOf(']');
                            $(this).attr('name', 'relationLxPersionInfo[' + i + name.substring(indetemp));
                        });
                    });
                }

                var tempObj = {}, tempArr = $form.serializeArray();
                for (var i = tempArr.length; i > 0; i--) {
                    tempObj[tempArr[i - 1].name] = tempArr[i - 1].value || "";
                }

                if (istip == undefined)istip = true;
                if (isCheck == undefined)isCheck = true;

                if ($.browser.msie) {
                    var res = false;
                    var fields = $form.find(":input:not(:submit):not(:reset):not(:button):not(:hidden)");
                    $.each(fields, function (i, n) {
                        if (n.hasAttribute('required')) {
                            if ($(n).val() == null || $(n).val() == '') {
                                $(n).msgtip("show").msgtip("setMsgtipConByThis", $(n).attr("msgtip") || "必填项");
                                res = true;
                            }
                        }
                    });
                    if (res) {
                        return false;
                    }
                }
                // console.log( tempObj );
                if (isCheck && !ops.submitBefore.call($form)) {
                    return false;
                }

                $.ajax({
                    url: formData.url,
                    data: tempObj,
                    async: false,
                    type: "post",
                    dataType: "json",
                    success: function (data) {
                        options.success.call($form, data, istip);
                    }
                });
                return false;
            });
        })
    };

    var getString = function (obj) {
        if (!obj) return null;
        if ($.isArray(obj)) {
            var str = '[';
            for (var i = 0; i < obj.length; i++) {
                if (i > 0) str += ',';
                str += getString(obj[i]);
            }
            str += ']';
            return str;
        }
        if (typeof obj == 'string') return '"' + obj + '"';
        if (typeof obj != 'object') return obj;
        var str = '{';
        var c = 0;
        for (var i in obj) {
            if (!i)continue;
            if (c++ > 0) str += ',';
            str += '"' + i + '":' + getString(obj[i]);
        }
        str += '}';
        return str;
    };
// 禁用所有的input
    $myHr.formDisabled = function (options) {
        var ops = $.extend({
            forms: "form"
        }, options);
        $(ops.forms).find(":input").attr('disabled', "disabled");
    };
// 添加记录,{self,为按钮，success(el),el为新添加的记录}
    $myHr.addRecord = function (options) {
        var ops = $.extend({
            self: "",
            success: function () {
            }
        }, options);
        var self = ops.self, form = $(self).closest("form");
        var columnsStr = form.find(".subcolumns").first().clone();
        ;

        // var index = form.find(".subcolumns").size();
        /*	var index = $.data(self, "subcolumnsIndex") || form.find(".subcolumns").size();

         columnsStr = columnsStr.replace(/name=[\'\"]([a-zA-Z0-9]*)\[(\d*)\]\.([a-zA-Z0-9]*)/g, function(){
         return "name='"+RegExp.$1+"["+ ( parseInt(RegExp.$2) + index ) +"]."+RegExp.$3+"'";
         });
         index++;
         $.data(self, "subcolumnsIndex", index);*/

        // form.find(".do-fn").before("<div class='relative subcolumns'>"+columnsStr+"<span class='del-record'></span>"+"</div>");
        // columnsStr.find(".del-record").size() == 0 && columnsStr.append("<span class='del-record'></span>");
        columnsStr.find(":input").attr("value", '');// .val("");
        form.find(".do-fn").before(columnsStr);

        $subcolumns = form.find(".subcolumns");
        if ($subcolumns.size() > 1) {

            $subcolumns.each(function () {
                $(this).find(".del-record").size() == 0 && $(this).append("<span class='del-record'></span>");
            })
        } else {
            $subcolumns.eq(0).find(".del-record").size() != 0 && $subcolumns.eq(0).find(".del-record").remove();
        }
        if (ops.success) {
            ops.success(form.find(".subcolumns").last())
        }
        $subcolumns.myHrDeleteRecord();
    }
    $.fn.myHrDeleteRecord = function () {
        this.each(function () {
            var $self = $(this);
            $self.find(".del-record").unbind("click").bind("click", function () {
                $self.find(":input").msgtip("destroy");
                var delrecords = $(this).closest('form').find('.del-record');
                var leng = delrecords.length;

                if ($(this).closest('form').find(".subcolumns").size() == 1) {
                    delrecords.remove();
                    return;
                }

                $(this).closest('form').data("isSave", false);
                $self.remove();
                if (leng <= 2) {
                    delrecords.remove();
                }
            })
        })
        // 提示信息绑定
        $(":input[msgtip]").msgtip({
            theme: "ui-msgtip-def",
            arrowPos: "left",
            arrowPosY: "bottom"
        }).msgtip("hide").focus(function () {
            $(this).msgtip("setMsgtipConByThis", this).msgtip("show");
        }).blur(function () {
            $(this).msgtip("hide");
        });
    }
// jqgrid分页内容为空时的注释
    $myHr.emptyTip = function (data, hrC) {
        if (data.records == 0) {
            if (!hrC.prev().is(".jgrid-height30")) {
                hrC.before("<div class='ta-c bdr bdb jgrid-height30'>查询结果为空</div>");
            }
        } else {
            if (hrC.prev().is(".jgrid-height30")) {
                hrC.prev().remove();
            }
        }
    };

// 支持IE HTML_Header_refer属性的跳转方式
    $.jumpTo = function (url) {
        var isIE = !-[1,];
        if (isIE) {
            var link = document.createElement('a');
            link.href = url;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
        } else {
            window.location.href = url;
        }
    };

})(jQuery);