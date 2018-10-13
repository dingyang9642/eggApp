/*!
 * jQuery WKEValidator plugin
 *
 * http://code.google.com/p/WKEValidator/
 *
 * Copyright (c) 2011 Bojan Mauser
 *
 * $Id: jquery.WKEValidator.js 55 2011-02-02 01:29:04Z bmauser $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function($){
	/**
	*表单提交验证，以及表单load数据
	*{param} eventType 表单事件类型，是submit提交 还是load数据装载页面
	*{param} settings 传入的参数
	*/
	$.fn.WKEForm = function(eventType,settings){
		switch(eventType){
			case 'submit':
				return new WKEValidator(this, settings);
				break;
			case 'load':
			    /**
				*load装载数据的时候参数需要设定成这个类型
				{
					data:'',   //可以是json 也可以是url（会通过ajax请求转变成json）
					beforeSubmit:function(){}  //可以在提交前添加绑定事件
				}
				*/
				return new WKELoad(this, settings);
				return ;
				break;
			default:
				break;
		};
		
	};
	
	/**
	*@descript  表单load数据
	*/
	var WKELoad = function(mainElement, settings){
		var settings = $.extend({},settings);
		var data = settings.data;
		if(!$.isPlainObject(data) ){ //判断传入的是否为json数据
			$.ajax({
				url: data,
				async: false,
				cache:false,
				success: function(data){
					for(var key in data){
						setFormValue(key,data[key],mainElement);
					};
				}
			 });
		}else{
			for(var key in data){
				setFormValue(key,data[key],mainElement);
			};
		};
		
		function setFormValue(name,v,formId){
			var ctx = formId? formId:$(document.body);
	    	//textbox 
	        var $input = $(":input[name=" + name + "][type!='radio'][type!='checkbox']",ctx);
	        $input.val(v);
	        if($input.length==0){
				
		        try{//v 拼接css selector 可能产生异常
				
			        //checkbox
			        var $checkboxes = $(":checkbox[name=" + name + "]",ctx);
					
			        if($checkboxes.length>0){
						$.each($checkboxes,function(index,item){
							$(item).attr("wke-checkbox-value",index);
						});
						if(v.indexOf(",") == -1){ //查看传入的v是否为"0,1" 这种格式，如果有逗号，则表明需要设置多个被选中状态
							$checkboxes.filter("[wke-checkbox-value=" + v + "]").attr("checked", true);
						}else{ // like "1,2"
							if(v && v.toString().split(",").length>1){
								v= v.toString().split(",");
							}
							if (v && v.push) {// array checkbox
								$.each(v, function(i, o){
									$checkboxes.filter("[wke-checkbox-value=" + o + "]").attr("checked", true);
								});
							}
						}; 
			        };
			        //when elements are radios
			        // * in selector cased death recursion
			        if(v.indexOf("*")==-1){
						var $radios = $(":radio[name=" + name +"]",ctx);
						$.each($radios,function(index,item){
							$(item).attr("wke-radio-value",index);
						});
			        	$radios.filter("[wke-radio-value=" + v + "]",ctx).attr("checked", true);
			        };
					//when element is select
					var $selects = ctx.find('select');
					if($selects.length > 0){
						var multiple = $selects.attr('multiple');
						if(multiple){ //如果是多选select
							if(v.indexOf(",") == -1){ //查看传入的v是否为"0,1" 这种格式，如果有逗号，则表明需要设置多个被选中状态
								$selects.find('option').filter("[value=" + v + "]").attr("checked", true);
							}else{ // like "1,2"
								if(v && v.toString().split(",").length>1){
									v= v.toString().split(",");
								}
								if (v && v.push) {// array checkbox
									$.each(v, function(i, o){
										$checkboxes.filter("[wke-checkbox-value=" + o + "]").attr("checked", true);
									});
								}
							}; 
						}else{ //只能是单选
							if(v.indexOf(",") != -1){
								$selects.find('option').filter("[value=" + v + "]").attr("checked", true);
							};
						};
					};
		        }catch(e){}
	        }
		};
		
		//调用表单校验
		mainElement.WKEForm('submit',{
			singleError: false,     //是否只显示一个错误提示
			offset:{x:-25,y:-3},   //相对于目标元素的偏移量
			position:{x:'right',y:'top'},    //相对于当前元素的位置 x:left,center,right   y:top,center,bottom
			showErrMsgSpeed:'noAnimate',        //显示错误信息的速度 noAnimate, fast,normal,slow
			errMsgClass:'wkeValidator_errmsg',  //错误提示信息层的class
			errorClass:'wkeValidator_invalid',  //表单元素出错时候的样式           
			ajaxType:'GET',        //ajax类型
			showCloseIcon: true,  //是否显示错误提示图层的关闭按钮
			validateOn:'blur',    //
			validate:true,         //是否需要验证
			url:'data/test.json',  //action地址
			callback:function(data){
				alert(data.name);
				//ajax提交成功后reset表单
				$(this)[0].reset()
			}
		});
	};
	

	// WKEValidator class
	var WKEValidator = function(mainElement, overrideOptions){

		// default options
		var options = {
            validate:true,
			ajaxType:'GET',
			singleError:         false,		// validate all inputs at once
			offset:              {x:-25, y:-3},	// offset position for error message tooltip
			position:            {x:'right', y:'top'}, // error message placement x:left|center|right  y:top|center|bottom
			template:            '<div class="{errMsgClass}"><em class="wkeValidatorArrow"></em>{message}</div>', // template for error message
			templateCloseIcon:   '{message}<div class="{closeIconClass}" onclick="{closeErrMsg}">x</div>', // 包含关闭按钮时候错误提示图层的模版
			showCloseIcon:       true,	//是否需要显示关闭按钮
			showErrMsgSpeed:    'noAnimate',	// 表单提示提示图层显示的速度：'noAnimate', 'fast', 'normal', 'slow' or number of milliseconds
			scrollToError:       true,	// 是否需要自动滚动到第一个出错表单元素的位置
			closeIconClass:      'wkeValidator_close_icon',	// 提示图层关闭按钮的样式
			errMsgClass:         'wkeValidator_errmsg',	// 错误提示图层的样式
			errorClass:          'wkeValidator_invalid',	// 表单元素在校验出错时候的样式
			validClass:          '',			// 表单元素在校验时的样式 即:focus时候的样式 ，默认是没有

			lang: 'chinese', 				// 默认出错提示文字的语言(可扩展多种语言)
			errorMessageAttr:    'valiErrorMsg', // 自定义属性，出错提示的时候显示此属性值(一般情况下不需要定义此属性，只有自定义校验规则的时候需要定义)
			validateActionsAttr: 'datatype', // 自定义属性存储需要校验的类型
			paramsDelimiter:     ':',		// delimiter for validator action options inside []
			validatorsDelimiter: ',',		// 校验规则之间的分隔符  比如："required,number"

			// when to validate
			validateOn:          null,		// 表单元素以何种方式校验:   null, 'change', 'blur', 'keyup'
			errorValidateOn:     'blur',	//何时校验表单元素： null, 'change', 'blur', 'keyup'

			// callback functions
			onBeforeValidate:    null,
			onAfterValidate:     null,
			onValidateFail:      null,
			onValidateSuccess:   null,

			// default error messages
			errorMessages: {
				chinese: {
					'defaultText':    '请正确输入',
					'equalto':    '两次输入的值必须一致',
					'differs':    '不通输入同样的值',
					'minlength':  '至少输入{0}个字符',
					'maxlength':  '最多输入{0}个字符',
					'rangelength':'必须输入{0}到{1}个字符',
					'min':        '至少选择{0}',
					'max':        '最多选择{0}',
					'between':    '必须输入{0}到{1}之间的数字',
					'required':   '必须输入',
					'alpha':      '只能输入字母',
					'alphanum':   '只能输入字母或者数字',
					'integer':      '只能输入数字',
					'number':     '只能输入数字',
					'email':      '请输入正确的邮箱格式',
					'image':      '只能输入图片格式',
					'url':        '请正确输入url地址',
					'phone':      '请输入正确的电话号码',
					'mobile':     '请输入正确的手机号码',
					'idCard':     '请输入正确的身份证号码',
					'ajaxUrl':    '该字符已经存在',
					'ip4':        '请正确输入ip地址',
					'extension':  '请输入{0} | {1} | {2}格式的数据',
					'date':       '请输入格式化日期，如{0}.'
				}
			},

			// regular expressions used by validator methods
			regex: {
				alpha:    /^[a-z ._\-]+$/i,
				alphanum: /^[a-z0-9 ._\-]+$/i,
				integer:    /^\d+$/,
				number:   /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
				email:    /^([a-zA-Z0-9_\.\-\+%])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
				image:    /\.(jpg|jpeg|png|gif|bmp)$/i,
				url:      /^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[a-z0-9]*)?\/?([a-z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*$/i
			} ,
			uploadFile : false
		},

		// returns all inputs
		_getElementsForValidation = function(element){
			// skip hidden and input fields witch we do not want to validate
			return element.is(':input') ? element : element.find(':input[' + options.validateActionsAttr + ']').not(":button, :image, :reset, :submit, :hidden, :disabled");
		},

		// binds validateOn event
		_bindValidateOn = function(elements){
			elements.bind(options.validateOn + '.bV', {'bVInstance': instance}, function(event){
				event.data.bVInstance.validate(false, $(this));
			});
		},

		// displays error message
		_showErrMsg = function(element, messages){

			// if error message already exists remove it from DOM
			_removeErrMsg(element);

			msg_container = $('<div class="bVErrMsgContainer"></div>').css('position','absolute');
			element.data("errMsg.bV", msg_container);
			msg_container.insertAfter(element);

			var messagesHtml = '';

			for(var i in messages)
				messagesHtml += '<div>' + messages[i] + '</div>\n';

			if(options.showCloseIcon)
				messagesHtml = options.templateCloseIcon.replace('{message}', messagesHtml).replace('{closeIconClass}', options.closeIconClass).replace('{closeErrMsg}', '$(this).closest(\'.'+ options.errMsgClass +'\').css(\'visibility\', \'hidden\');');

			// make tooltip from template
			var tooltip = $(options.template.replace('{errMsgClass}', options.errMsgClass).replace('{message}', messagesHtml));
			tooltip.appendTo(msg_container);

			var pos = _getErrMsgPosition(element, tooltip); 
			if(options.showErrMsgSpeed == 'noAnimate'){
				tooltip.css({visibility: 'visible', position: 'absolute', top: pos.top, left: pos.left}).show();
			}else{
				tooltip.css({visibility: 'visible', position: 'absolute', top: pos.top, left: pos.left}).fadeIn(options.showErrMsgSpeed);
			};
			
			if(options.scrollToError){
				// get most top tolltip
				var tot = tooltip.offset().top;
				if(scroll_to === null || tot < scroll_to)
					scroll_to = tot;
			}
		},

		// removes error message from DOM
		_removeErrMsg = function(element){
			var existingMsg = element.data("errMsg.bV")
			if(existingMsg){
				existingMsg.remove();
			}
		},

		// calculates error message position
		_getErrMsgPosition = function(input, tooltip){

		        var tooltipContainer = input.data("errMsg.bV"),
		         top  = - ((tooltipContainer.offset().top - input.offset().top) + tooltip.outerHeight() - options.offset.y),
		         left = (input.offset().left + input.outerWidth()) - tooltipContainer.offset().left + options.offset.x,
			 x = options.position.x,
			 y = options.position.y;

			// adjust Y
			if(y == 'center' || y == 'bottom'){
				var height = tooltip.outerHeight() + input.outerHeight();
				if (y == 'center') 	{top += height / 2;}
				if (y == 'bottom') 	{top += height;}
			}

			// adjust X
			if(x == 'center' || x == 'left'){
				var width = input.outerWidth();
				if (x == 'center') 	{left -= width / 2;}
				if (x == 'left')  	{left -= width;}
			}

			return {top: top, left: left};
		},

		// calls callback functions
		_callBack = function(type, param1, param2, param3){
		        if($.isFunction(options[type])){
		        	return options[type](param1, param2, param3);
			}
		},
		
		// gets element value	
		_getValue = function(element){

			var ret = {};

			// checkbox
			if(element.is('input:checkbox')){
				ret['value'] = element.attr('name') ? ret['selectedInGroup'] = $('input:checkbox[name="' + element.attr('name') + '"]:checked').length : element.attr('checked');
			}
			else if(element.is('input:radio')){
				ret['value'] = element.attr('name') ? ret['value'] = $('input:radio[name="' + element.attr('name') + '"]:checked').length : element.val();
			}
			else if(element.is('select')){
				ret['selectedInGroup'] =  $("option:selected", element).length;
				ret['value'] = element.val();
			}
			else if(element.is(':input')){
				ret['value'] = element.val();
			}

			return ret;
		},

		// object with validator functions
		// object with validator functions
		validator = {

			equalto: function(v, elementId){
				return v.value == $('#' + elementId).val();
			},

			differs: function(v, elementId){
				return v.value != $('#' + elementId).val();
			},

			minlength: function(v, minlength){
				return (v.value.length >= parseInt(minlength))
			},

			maxlength: function(v, maxlength){
				return (v.value.length <= parseInt(maxlength))
			},

			rangelength: function(v, minlength, maxlength){		
				return (v.value.length >= parseInt(minlength) && v.value.length <= parseInt(maxlength))
			},

			min: function(v, min){		
				if(v.selectedInGroup)
					return v.selectedInGroup >= parseFloat(min)
				else{
					if(!this.number(v))
			 			return false;
			 		return (parseFloat(v.value) >= parseFloat(min))
				}
			},

			max: function(v, max){		
				if(v.selectedInGroup)
					return v.selectedInGroup <= parseFloat(max)
				else{
					if(!this.number(v))
			 			return false;
			 		return (parseFloat(v.value) <= parseFloat(max))
				}
			},

			between: function(v, min, max){
				if(v.selectedInGroup)
					return (v.selectedInGroup >= parseFloat(min) && v.selectedInGroup <= parseFloat(max))
			   	if(!this.number(v))
			 		return false;
				var va = parseFloat(v.value);
				return (va >= parseFloat(min) && va <= parseFloat(max))
			},

			required: function(v){
				if(!v.value || !$.trim(v.value))
					return false
				return true
			},

			alpha: function(v){
				return this.regex(v, options.regex.alpha);
			},

			alphanum: function(v){
				return this.regex(v, options.regex.alphanum);
			},

			integer: function(v){
				return this.regex(v, options.regex.integer);
			},

			number: function(v){
				return this.regex(v, options.regex.number);
			},

			email: function(v){
				return this.regex(v, options.regex.email);
			},

			image: function(v){
				return this.regex(v, options.regex.image);
			},

			url: function(v){
				return this.regex(v, options.regex.url);
			},
			
			//是否支持ajax校验
			ajaxUrl:function(v,url){
				var flag = true;
				//如果用户输入的url带引号需要去除
				var reg = /(\')?/gi;
				url = url.replace(reg,'');
				if(v.value !=''){ //输入为非空的时候需要ajax校验，根据校验的返回值，确定出错信息提示
					$.ajax({
						url: url,
						async: false,
						cache:false,
						success: function(data){
							data.status == 0 ? (flag = false) : '';
							options.errorMessages.chinese.ajaxUrl = data.msg;
						}
					 });
				}else{
					flag = false;
					options.errorMessages.chinese.ajaxUrl = options.errorMessages.chinese.defaultText;
				};
				
				return flag;
			},
			
			phone:function(v){
				var reg =  /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/gi;
				return reg.test(v.value);
			},
			mobile:function(v){
				var reg = /^13\d{9}$|^15[0,1,2,3,5,6,7,8,9]\d{8}$|^18[0,2,5,6,7,8,9]\d{8}$/;
				return reg.test(v.value);
			},
			idCard:function(v){
				var reg = /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/;
				return reg.test(v.value);
			},
			
			regex: function(v, regex, mod){
				if(typeof regex === "string")
					regex = new RegExp(regex, mod);
				return regex.test(v.value);
			},

			ip4: function(v){
				var r = /^(([01]?\d\d?|2[0-4]\d|25[0-5])\.){3}([01]?\d\d?|25[0-5]|2[0-4]\d)$/;
				if (!r.test(v.value) || v.value == "0.0.0.0" || v.value == "255.255.255.255")
					return false
				return true;
			},

			date: function(v, format){ // format can be any combination of mm,dd,yyyy with separator between. Example: 'mm.dd.yyyy' or 'yyyy-mm-dd'
				if(v.value.length == 10 && format.length == 10){
					var s = format.match(/[^mdy]+/g);
					if(s.length == 2 && s[0].length == 1 && s[0] == s[1]){

						var d = v.value.split(s[0]),
						 f = format.split(s[0]);

						for(var i=0; i<3; i++){
							if(f[i] == 'dd') var day = d[i];
							else if(f[i] == 'mm') var month = d[i];
							else if(f[i] == 'yyyy') var year = d[i];
						}

						var dobj = new Date(year, month-1, day)
						if ((dobj.getMonth()+1!=month) || (dobj.getDate()!=day) || (dobj.getFullYear()!=year))
							return false

						return true
					}
				}
				return false;
			},

			extension: function(){
				var v = arguments[0],
				 r = '';
				if(!arguments[1])
					return false
				for(var i=1; i<arguments.length; i++){
					r += arguments[i];
					if(i != arguments.length-1)
						r += '|';
				}
				return this.regex(v, '\\.(' +  r  + ')$', 'i');
			}
		},

		// validator instance, scroll position flag
		instance = this, scroll_to;

		// global options
		if(window['bValidatorOptions']){
			$.extend(true, options, window['bValidatorOptions']);
		}

		// passed options
		if(overrideOptions)
			$.extend(true, options, overrideOptions);

		// return existing instance
		if(mainElement.data("WKEValidator"))
			return mainElement.data("WKEValidator");

		mainElement.data("WKEValidator", this);
		
		
		//subform
		var subform=function(){
			var flag = true;
			if(options.validate){  //是否需要校验
				flag = instance.validate();
			};
			if(flag){
				if(options.url){
					// AJAX UPLOAD
					if(options.uploadFile){
						$.ajaxFileUpload({
							form : mainElement,
							url : options.url,
							dataType:'json',
							success:function(data){
								//执行回调函数
								if(typeof options.callback == 'function'){
									options.callback.call(mainElement,data);
								};
							},error:function(){
								
							}
						});
						return false;
					}
					//将表单元素序列化成字符串，作为ajax的参数
					var data = mainElement.serialize();
					$.ajax({
						type: options.ajaxType,
						dataType:"json",
						url: options.url,
						data:data,
						cache:false,
						success: function(data){
							//执行回调函数
							if(typeof options.callback == 'function'){
								options.callback.call(mainElement,data);
							};
						},
						error: function(){
						}
					});
					return false;
				}else{
					mainElement[0].submit();
				};
			};	
		 
		};
		
		
		
		
		// if selector is a form
		if(mainElement.is('form')){
			// bind validation on form submit
			mainElement.bind('submit.bV', function(event){
				subform();
				return false;
			});

			// bind reset on form reset
			mainElement.bind("reset.bV", function(){
				instance.reset();			
			});
		}

		// bind validateOn event
		if(options.validateOn)
			_bindValidateOn(_getElementsForValidation(mainElement));


		// API functions:

		// validation function
		this.validate = function(doNotshowMessages, elementsOverride){

			// return value, elements to validate
			var ret = true, 
			 elementsl = elementsOverride ? elementsOverride : _getElementsForValidation(mainElement);

			scroll_to = null;

			// validate each element
			elementsl.each(function(){
				
				// value of validateActionsAttr input attribute
				var actionsStr = $.trim($(this).attr(options.validateActionsAttr).replace(new RegExp('\\s*\\' + options.validatorsDelimiter + '\\s*', 'g'), options.validatorsDelimiter)),
				 is_valid = 0;
				if(!actionsStr)
					return true;

				var actions = actionsStr.split(options.validatorsDelimiter), // all validation actions
				 inputValue = _getValue($(this)), // value of input field for validation
				 errorMessages = [];

				// if value is not required and is empty
				if(jQuery.inArray('required',actions) == -1 && !validator.required(inputValue)){
					is_valid = 1;
				}

				if(!is_valid){
					// get error message from attribute
					var errMsg = $(this).attr(options.errorMessageAttr),
					 skip_messages = 0;

					// for each validation action
					for(var i in actions){

						actions[i] = $.trim(actions[i]);

						if(!actions[i])
							continue;

						if(_callBack('onBeforeValidate', $(this), actions[i]) === false)
							continue;

						// check if we have some parameters for validator
						var validatorParams = actions[i].match(/^(.*?)\[(.*?)\]/);

						if(validatorParams && validatorParams.length == 3){
							var validatorName = validatorParams[1];
							validatorParams = validatorParams[2].split(options.paramsDelimiter);
						}
						else{
							validatorParams = [];
							var validatorName = actions[i];
						}

						// if validator exists
						if(typeof validator[validatorName] == 'function'){
							validatorParams.unshift(inputValue); // add input value to beginning of validatorParams
							var validationResult = validator[validatorName].apply(validator, validatorParams); // call validator function
						}
						// call custom user dafined function
						else if(typeof window[validatorName] == 'function'){
							validatorParams.unshift(inputValue.value);
							var validationResult = window[validatorName].apply(validator, validatorParams);
						}

						if(_callBack('onAfterValidate', $(this), actions[i], validationResult) === false)
							continue;

						// if validation failed
						if(!validationResult){
							if(!doNotshowMessages){

								if(!skip_messages){
									if(!errMsg){

										if(options.errorMessages[options.lang] && options.errorMessages[options.lang][validatorName])
											errMsg = options.errorMessages[options.lang][validatorName];
										else if(options.errorMessages.chinese[validatorName])
											errMsg = options.errorMessages.chinese[validatorName];
										else if(options.errorMessages[options.lang] && options.errorMessages[options.lang]['default'])
											errMsg = options.errorMessages[options.lang]['default'];
										else
											errMsg = options.errorMessages.chinese['default'];
									}
									else{
										skip_messages = 1;
									}

									// replace values in braces
									if(errMsg.indexOf('{')){
										for(var j=0; j<validatorParams.length-1; j++)
											errMsg = errMsg.replace(new RegExp("\\{" + j + "\\}", "g"), validatorParams[j+1]);
									}

									if(!(errorMessages.length && validatorName == 'required'))
										errorMessages[errorMessages.length] = errMsg;

									errMsg = null;
								}
							}
							else
								errorMessages[errorMessages.length] = '';

							ret = false;

							if(_callBack('onValidateFail', $(this), actions[i], errorMessages) === false)
								continue;
						}
						else{
							if(_callBack('onValidateSuccess', $(this), actions[i]) === false)
								continue;
						}
					}
				}

				if(!doNotshowMessages){

					var chk_rad = $(this).is('input:checkbox,input:radio') ? 1 : 0;

					// if validation failed
					if(errorMessages.length){

						_showErrMsg($(this), errorMessages)

						if(!chk_rad){
							$(this).removeClass(options.validClass);
							if(options.errorClass)
								$(this).addClass(options.errorClass);
						}
		
						// input validation event
						if (options.errorValidateOn){
							if(options.validateOn)
								$(this).unbind(options.validateOn + '.bV');

							var evt = chk_rad || $(this).is('select,input:file') ? 'change' : options.errorValidateOn;

							if(chk_rad){
								var group = $(this).is('input:checkbox') ? $('input:checkbox[name="' + $(this).attr('name') + '"]') : $('input:radio[name="' + $(this).attr('name') + '"]');
								$(group).unbind('.bVerror');
								$(group).bind('change.bVerror', {'bVInstance': instance, 'groupLeader': $(this)}, function(event){
									event.data.bVInstance.validate(false, event.data.groupLeader);
								});
							}
							else{
								$(this).unbind('.bVerror');
								$(this).bind(evt + '.bVerror', {'bVInstance': instance}, function(event){
									event.data.bVInstance.validate(false, $(this));
								});
							}
						}

						if (options.singleError)
							return false;
					}
					else{
						_removeErrMsg($(this));

						if(!chk_rad){
							$(this).removeClass(options.errorClass);
							if(options.validClass)
								$(this).addClass(options.validClass);
						}

						//if (options.errorValidateOn)
						//	$(this).unbind('.bVerror');
						if (options.validateOn){
							$(this).unbind(options.validateOn + '.bV');
							_bindValidateOn($(this));
						}
					}
				}
			});

			// scroll to error
			if(scroll_to && !elementsOverride && ($(window).scrollTop() > scroll_to || $(window).scrollTop()+$(window).height() < scroll_to)){
				var ua = navigator.userAgent.toLowerCase();			
				$(ua.indexOf('chrome')>-1 || ua.indexOf('safari')>-1 ? 'body' : 'html').animate({scrollTop: scroll_to - 10}, {duration: 'slow'});
			}

			return ret;
		}

		// returns options object
		this.getOptions = function(){
			return options;
		}

		// chechs validity
		this.isValid = function(){
			return this.validate(true);
		}

		// deletes error message
		this.removeErrMsg = function(element){
			_removeErrMsg(element);
		}

		// returns all inputs
		this.getInputs = function(){
			return _getElementsForValidation(mainElement);
		}

		// binds validateOn event
		this.bindValidateOn = function(element){
			_bindValidateOn(element);
		}

		// resets validation
		this.reset = function(){
			elements = _getElementsForValidation(mainElement);
			if (options.validateOn)
				_bindValidateOn(elements);
			elements.each(function(){
				_removeErrMsg($(this));
				$(this).unbind('.bVerror');
				$(this).removeClass(options.errorClass);
				$(this).removeClass(options.validClass);
			});
		}

		this.destroy = function(){
			if (mainElement.is('form'))
				mainElement.unbind('.bV');
			
			this.reset();
			
			mainElement.removeData("WKEValidator");
		}
	};
	
	WKEValidator.valiMethod = {
		equalto: function(v, elementId){
			return v.value == $('#' + elementId).val();
		},

		differs: function(v, elementId){
			return v.value != $('#' + elementId).val();
		},

		minlength: function(v, minlength){
			var value = v.value;
			value = value.replace(/[^\x00-\xff]/g,'ci');
			return (value.length >= parseInt(minlength))
		},

		maxlength: function(v, maxlength){
			var value = v.value;
			value = value.replace(/[^\x00-\xff]/g,'ci');
			return ( value.length <= parseInt(maxlength) )
		},

		rangelength: function(v, minlength, maxlength){		
			var value = v.value;
			value = value.replace(/[^\x00-\xff]/g,'ci');
			return (value.length >= parseInt(minlength) && value.length <= parseInt(maxlength))
		},

		min: function(v, min){		
			if(v.selectedInGroup)
				return v.selectedInGroup >= parseFloat(min)
			else{
				if(!WKEValidator.valiMethod.number(v))
					return false;
				return (parseFloat(v.value) >= parseFloat(min))
			}
		},

		max: function(v, max){		
			if(v.selectedInGroup)
				return v.selectedInGroup <= parseFloat(max)
			else{
				if(!WKEValidator.valiMethod.number(v))
					return false;
				return (parseFloat(v.value) <= parseFloat(max))
			}
		},

		between: function(v, min, max){
			if(v.selectedInGroup)
				return (v.selectedInGroup >= parseFloat(min) && v.selectedInGroup <= parseFloat(max))
			if(!WKEValidator.valiMethod.number(v))
				return false;
			var va = parseFloat(v.value);
			return (va >= parseFloat(min) && va <= parseFloat(max))
		},

		required: function(v){
			if(!v.value || !$.trim(v.value))
				return false
			return true
		},

		alpha: function(v){
			//return this.regex(v, options.regex.alpha);
			return /\d+/gi.test(v.value);
		},

		alphanum: function(v){
			var reg = /^[a-z0-9 ._\-]+$/i;
			return reg.test(v.value);
			//return this.regex(v, options.regex.alphanum);
		},

		integer: function(v){
			var reg = /^\d+$/;
			return reg.test(v.value);
		},

		number: function(v){
			var reg = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;
			return reg.test(v.value);
		},

		email: function(v){
			var reg =  /^([a-zA-Z0-9_\.\-\+%])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			return reg.test(v.value);
			//return this.regex(v, options.regex.email);
		},

		image: function(v){
			var reg =  /\.(jpg|jpeg|png|gif|bmp)$/i;
			return reg.test(v.value);
		},

		url: function(v){
			var reg =  /^(http|https|ftp)\:\/\/[a-z0-9\-\.]+\.[a-z]{2,3}(:[a-z0-9]*)?\/?([a-z0-9\-\._\?\,\'\/\\\+&amp;%\$#\=~])*$/i;
			return reg.test(v.value);
		},
		//是否支持ajax校验
		ajaxUrl:function(v,url){
			var flag = true;
			//如果用户输入的url带引号需要去除
			var reg = /(\')?/gi;
			url = url.replace(reg,'');
			if(v.value !=''){ //输入为非空的时候需要ajax校验，根据校验的返回值，确定出错信息提示
				$.ajax({
					url: url,
					async: false,
					cache:false,
					success: function(data){
						data.status == 0 ? (flag = false) : '';
						WKEValidator.errorMessages.chinese.ajaxUrl = data.msg;
					}
				 });
			}else{
				flag = false;
				WKEValidator.errorMessages.chinese.ajaxUrl = WKEValidator.errorMessages.chinese.defaultText;
			};
			
			return flag;
		},
		phone:function(v){
			var reg =  /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/gi;
			return reg.test(v.value);
		},
		mobile:function(v){
			var reg = /^13\d{9}$|^15[0,1,2,3,5,6,7,8,9]\d{8}$|^18[0,2,5,6,7,8,9]\d{8}$/;
			return reg.test(v.value);
		},
		idCard:function(v){
			var reg = /^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/;
			return reg.test(v.value);
		},
		regex: function(v, reg, mod){
			if(typeof reg === "string")
				reg = new RegExp(reg, mod);
			return reg.test(v.value);
		},

		ip4: function(v){
			var r = /^(([01]?\d\d?|2[0-4]\d|25[0-5])\.){3}([01]?\d\d?|25[0-5]|2[0-4]\d)$/;
			if (!r.test(v.value) || v.value == "0.0.0.0" || v.value == "255.255.255.255")
				return false
			return true;
		},

		date: function(v, format){ // format can be any combination of mm,dd,yyyy with separator between. Example: 'mm.dd.yyyy' or 'yyyy-mm-dd'
			if(v.value.length == 10 && format.length == 10){
				var s = format.match(/[^mdy]+/g);
				if(s.length == 2 && s[0].length == 1 && s[0] == s[1]){

					var d = v.value.split(s[0]),
					 f = format.split(s[0]);

					for(var i=0; i<3; i++){
						if(f[i] == 'dd') var day = d[i];
						else if(f[i] == 'mm') var month = d[i];
						else if(f[i] == 'yyyy') var year = d[i];
					}

					var dobj = new Date(year, month-1, day)
					if ((dobj.getMonth()+1!=month) || (dobj.getDate()!=day) || (dobj.getFullYear()!=year))
						return false

					return true
				}
			}
			return false;
		},
		extension: function(v){
			var v = arguments[0],
			 r = '';
			if(!arguments[1])
				return false
			for(var i=1; i<arguments.length; i++){
				r += arguments[i];
				if(i != arguments.length-1)
					r += '|';
			}
			return this.regex(v, '\\.(' +  r  + ')$', 'i');
		}
	};
	
	
	
	
	/********以下部分是为元素单独 定义 class="WKE-input" "WKE-select" 类定义的 局限性比较下 ，没有表单验证那么强大********/
	//extend error message api
	WKEValidator.errorMessages = {
		chinese: {
			'defaultText':'请正确输入',
			'equalto':    '两次输入的值必须一致',
			'differs':    '不通输入同样的值',
			'minlength':  '至少输入{0}个字符',
			'maxlength':  '至少输入{0}个字符',
			'rangelength':'必须输入{0}到{1}个字符',
			'min':        '至少选择{0}',
			'max':        '最多选择{0}',
			'between':    '必须输入{0}到{1}之间的数字',
			'required':   '必须输入',
			'alpha':      '只能输入数字',
			'alphanum':   '只能输入字母或者数字',
			'integer':    '只能输入整型数字',
			'number':     '必须输入实数型数字',
			'phone':      '请输入正确的电话号码',
			'mobile':     '请输入正确的手机号码',
			'idCard':     '请输入正确的身份证号码',
			'email':      '请输入正确的邮箱格式',
			'image':      '只能输入图片格式',
			'url':        '请正确输入url地址',
			'ajaxUrl':    '对不起该字符已经存在',
			'ip4':        '请正确输入ip地址',
			'date':       '请输入格式化日期，如{0}.'
		}
	};
	
	/**
	*@descript 创建表单元素出错提示信息层
	*@target {string} 需要创建定位图层的目标元素,比如需要在input右边创建提示图层，则input即为target
	*@param  可以给target的html元素增加自定义属性gravity {t,b,l,r}来确定提示图层相对于目标元素的位置
	*/
	$WKECerateFormItemTips = function(target,msg,hide){
		//当前元素的位置以及长度和宽度
		var pos = $.extend({},target.offset(),{width:target.width(),height:target.height()});
		//提示信息的位置
		var gravity = target.attr('gravity') ? target.attr('gravity') : 'r';
		if($('.tipsy').length == 0){
			var tips = $('<div class="wkeValidator_errmsg tipsy" style="position: absolute;"><div class="errmsgCon">'+ msg + '</div></div>').appendTo($(document.body));
		}else{
			var tips = $('.tipsy');
		};
		tips.show();
		var actualWidth = tips[0].offsetWidth, actualHeight = tips[0].offsetHeight;
		var tp = {};
		var offset = 4;
		switch (gravity) {
			case 'b':
				tp = {top: pos.top + pos.height + offset, left: pos.left + pos.width / 2 - actualWidth / 2 + 4};
				break;
			case 't':
				tp = {top: pos.top - actualHeight - offset -4, left: pos.left + pos.width / 2 - actualWidth / 2 };
				break;
			case 'l':
				tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - offset -4};
				break;
			case 'r':
				tp = {top: pos.top + pos.height / 2 - actualHeight / 2 , left: pos.left + pos.width + offset +4};
				break;
		}
		//根据当前元素定位
		tips.css(tp).find('.errmsgCon').text(msg)
		if(hide){
			tips.hide();
		}
		//return tips;
	};
	
	
	/**
	*给所有类名为 .WKE-input,.WKE-checkbox,.WKE-radio,.WKE-select绑定blur事件，通过获取自定义属性datatype获得校验方法名称
	*/
	$('.WKE-input,.WKE-checkbox,.WKE-radio,.WKE-select').live('blur',function(){
																			  
		// value of validateActionsAttr input attribute
				var $this = $(this);
				//将用户传入的验证类型，用逗号隔开，并通过正则将空格去除
				var datatype = $.trim($(this).attr('datatype').replace(new RegExp('\\s*\\' + ',' + '\\s*', 'g'), ',')),
				 is_valid = 0;
				if(!datatype)
					return true;
				var datatypes = datatype.split(','), // all validation datatypes
				 inputValue = $(this)[0].value, // value of input field for validation
				 errorMessages = [];

				// if value is not required and is empty
				if(jQuery.inArray('required',datatypes) == -1){
					//is_valid = 1;
				}

				if(!is_valid){

					// get error message from attribute
					var errMsg = $(this).attr('errorMessageAttr'),
					 skip_messages = 0;
					// for each validation action
					for(var i in datatypes){

						datatypes[i] = $.trim(datatypes[i]);
             
						if(!datatypes[i])
							continue;

						// check if we have some parameters for validator
						var validatorParams = datatypes[i].match(/^(.*?)\[(.*?)\]/);
						if(validatorParams && validatorParams.length == 3){
							var validatorName = validatorParams[1];
							validatorParams = validatorParams[2].split(',');
						}else{
							validatorParams = $this;
							var validatorName = datatypes[i];
						}
						// if validator exists
						if(typeof WKEValidator.valiMethod[validatorName] == 'function'){
							var validationResult = WKEValidator.valiMethod[validatorName].apply($this,validatorParams);
						}
						// if validation failed
						if(!validationResult){
							$WKECerateFormItemTips($this,WKEValidator.errorMessages.chinese[validatorName],false);
						}else{
							$WKECerateFormItemTips($this,'验证通过',true);
						}
					}
				}	
	});
	
	

})(jQuery);
