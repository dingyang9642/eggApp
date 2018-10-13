/*
 * @auth:liguang01
 * @depend jquery-1.6.2.js, jquery.tmpl.js
 */
(function($){
	var _defaults = {
		url:"",		//或者data，如果url有值，优先是用url
		theme:"", 
		tpl:'{{each itemList}}'+
			'<li class="ui-step-item '+
				'{{if $index == 0 }} ui-step-item-first ui-step-item-active-first{{/if}}'+
				'{{if $index < curStep-1 }} ui-step-item-active {{/if}}'+
				'{{if 0 == $index && $index == curStep-1 }} ui-step-item-cur-first ${$index} {{/if}}'+
				'{{if $index == curStep-1&&$index != itemList.length-1 }} ui-step-item-cur {{/if}}'+
				'{{if $index == itemList.length-1 }} ui-step-item-last {{/if}}'+
				'{{if $index == itemList.length-1&&$index == curStep-1 }} ui-step-item-last-cur {{/if}}">'+
				'<span class="ui-step-item-num">${$index+1}</span>'+
				'<span class="ui-step-item-name" title="${name}">${name}</span></li>'+
				'{{if $index != itemList.length-1  }}<li class="ui-step-item '+
				'{{if $index < curStep-1 }}ui-step-item-pass{{/if}}'+
				'" style="width:${width}px"'+
				'></li>{{/if}}'+
			'{{/each}}'
	};
	var $step = $("<div>").addClass("ui-step");
	var _getData = function(op, finish){
		var self = this;
			if(op.url != ""){
				$.ajax({
					url:op.url,
					type:"get",
					dataType:"json",
					success:function(data){
						op.data = data;
						op.data.curStep = op.curStep || data.curStep || 1;
						op.data.totalStep = op.totalStep || data.totalStep || 8;
						var width = $(self).width();
						var avgWidth = width/(op.data.totalStep-1);
						op.data.width = avgWidth-100;
						finish.call(self, op);
						$(self).data("stepData", op );
					},
					error:function(e){
						
					}
				});
			}else{
				if(op.data){
					var width = $(self).width();
					var avgWidth = Math.floor(width/(op.data.totalStep-1));
					op.data.width = avgWidth-100;
					op.data.curStep = op.curStep || op.data.curStep || 1;
					$(self).data("stepData", op );
					op.data && finish.call(self, op);
				}else{
					window.console && console.log("data 参数为空");
				}
			}
		},
		//根据data生成li
		_appendItem = function(op){
			$.tmpl(op.tpl, op.data).appendTo( $step.empty() );
			$(this).empty().append($step);
		};
		
	var methods = {
		init:function(options){
			var op = $.extend({}, _defaults, options);
			op.theme && $step.addClass(op.theme);
			_getData.call(this, op, _appendItem);
		},
		option:function(options){
			var op = $(this).data("stepData");
			
			//变更theme
			options.theme && options.theme != op.theme && $step.removeClass(op.theme).addClass(options.theme);
			
			//变更URL
			if( options.url && options.url != op.url){
				op.url = options.url;
				_getData.call(this, op, _appendItem);
			}else{
				op = $.extend(op, options);
				options.curStep && ( op.data.curStep = op.curStep );
				_appendItem.call(this, op);
			}
		},
		destroy:function(){
			
		}
	};
	$.fn.step = function(method){
		var args = arguments;
		return this.each(function(){
			if(methods[method]){
				return methods[method].apply(
					this,
					Array.prototype.slice.call(args, 1)
				);
			}else if(typeof method == "object"){
				return methods.init.apply(this, args);
			}
		});
	}
})(jQuery)


