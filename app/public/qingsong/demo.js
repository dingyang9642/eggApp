(function() {

    // validators - custom validators.
    // validateField will apply these validators when the form
    // field has a class name that matches.
    var validators = {};

    // createError - can create error message element.
    // Is done during intialization.
    function createError() {
		$(this).msgtip({theme:"ui-msgtip-def"}).msgtip("hide");
        return $(this);
    }
    // showError - shows error message
    function showError($el, msg, field) {
		$el.msgtip("show").msgtip("setMsgtipConByThis", $el.attr("msgtip") || msg);
    }
    // hideError - hides error message
    function hideError($el, field) {
		$el.msgtip("hide");
    }

	$.fn.formF5 = function(){
		// Basic f5 setup
        this.f5({
            error: {
                create: createError,
                show: showError,
                hide: hideError
            },
			messages: {
				required:"此项为必填项。",
				email:"请输入正确的邮箱地址。",
				pattern : "请输入正确格式"
			}
        }).each(function() {

            // We want to do validation on input/change,
            // and we want to hook in custom validation rules.
            var $form = $(this),
                $fields = $(this).f5fields();
            
            $form.data("isSave", true);

            $fields.bind('invalid', function(e) {
                // case: hit submit right away, then change inputs
                $(this).data('checkValidityOnKeyUp', true);
            });

            $fields.bind('change', function(e) {
				if (this.checkValidity()) $(this).trigger('valid');
                $(this).data('checkValidityOnKeyUp', true);
				$form.data("isSave", false);
            });

            $fields.bind('input', function(e) {
                if (false || $(this).data('checkValidityOnKeyUp') === true) {
                    if (this.checkValidity()) $(this).trigger('valid');
                }
            });

        }).bind('submit',function(e) {
        	 return this.checkValidity();
			//alert(1)
            // Don't submit when not valid
        	//var self = this;
          //  if (!this.checkValidity() || $(this).data("isSave") ) return false;
			//否则发送ajax保存。在发送前使用blockui来遮罩。
			//$(this).data("isSave", true);
			//		alert('valid, could be submitting if it wasn\'t a demo');
            //return false;
           
        });
	};
    $(function() {
		$("form").not("#nosave").not('#btnForm').not('#processFormItemForm').formF5();
		$("form").not("#nosave").not('#btnForm').not('#processFormItemForm').submit(function(){
			//if($.browser.msie&&$(this).prop("submitValidity")){
			if($.browser.msie){
				var res=true;
				var fields =$(this).find(":input:not(:submit):not(:reset):not(:button):not(:hidden)");
				$.each(fields,function(i,n){
					if($(n).attr('required')){
						if($(n).val()==null || $(n).val()==''){
							$(n).msgtip("show").msgtip("setMsgtipConByThis", $(n).attr("msgtip") || "必填项");
							res=false;
						}
					}
				});
				return res;
			}
		});
    });

})();

