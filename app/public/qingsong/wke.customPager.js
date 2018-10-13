/**
	@liguang01
*/
(function($){
	$.customPager = function(options){
		var op = $.extend({
			"page": 1,		//当前页
			"preNum" : 10,	//每页记录数
			"total": 2,		//总页数
			"records": 14,	//总记录数
			"isRowsNum" : false, // 默认分页条数
			"container":"",
			"pageGo":function(){
				alert("请传入参数pageGo,参数类型为function,当点击页码时调用");
			}
		}, options);
		
		//每页的个数
		var fromRange = ( op.page - 1 ) * op.preNum + 1 ,
			toRange = op.page * op.preNum ;
        toRange = toRange > op.records ? op.records : toRange ;
		
		var pageDetailStr = '显示'+ fromRange +'-'+ toRange +'条,共'+ op.records +'条记录';

		var _removeActive = function(){
			this.find("a").unbind("click");
			this.removeClass("active")
		}, _addActive = function(){
			this.addClass("active");
			this.find("a").unbind().bind('click',function(){
				op.pageGo.call(this, {rowsNum:cpo.rowsNum});
			});
		};
			
		var opc = $(op.container)[0] ;
		var $opcTxt = $("<div class='opc-txt'></div>");
		var $selStr = 	$('<select class="longer" id="opetionNum">'+
							'<option value="10">10</option>' +
							'<option value="20">20</option>' +
							'<option value="30">30</option>' +
							'<option value="50">50</option>' +
							'<option value="100">100</option>' +
						'</select>');
		
		$selStr.change(function(){
			cpo.rowsNum = this.value;
			
			op.pageGo.call(this, {rowsNum:cpo.rowsNum,page:1});
		});
		
		if( op.isRowsNum ){
			$opcTxt.append($selStr);
			$selStr.val(op.preNum);
		}
		
		var opcCon = $("<div class='opc-con'></div>");
		
		if( ! $.data(opc,"customPagerOps") ){
			$.data(opc,"customPagerOps", {
				first :	$('<span><a href="javascript:void(0);" target="_self" class="first">&nbsp;</a></span>'),
				prev : $('<span><a href="javascript:void(0);" target="_self" class="prev">上一页</a></span>'),
				cur : $('<span class="cur"><input type="text" value=""/></span>'),
				next : $('<span><a href="javascript:void(0);" target="_self" class="next">下一页</a></span>'),
				last : $('<span><a href="javascript:void(0);" target="_self" class="last">&nbsp;</a></span>'),
				totalNum : $('<span class="total-num" id="totalNum"></span>'),
				pageDetail: $('<em class="page-detail"></em>')
			});
			
			cpo = $.data(opc, "customPagerOps");
			
			opcCon.append(cpo.first, cpo.prev, '<span class="digg-font">第</span>', cpo.cur,'<span class="per">/</span>',cpo.totalNum,'<span class="digg-font">页</span>', cpo.next, cpo.last, cpo.pageDetail);
			
			$(op.container).addClass("digg").append(opcCon);
			$(op.container).addClass("digg").append($opcTxt);
		}
		cpo = $.data(opc, "customPagerOps");
		
		cpo.totalNum.text(op.total);
		cpo.first.find("a").attr("page", 1);
		cpo.prev.find("a").attr("page", op.page - 1);
		cpo.cur.find("input[type='text']").attr("page", op.page).val(op.page);
		cpo.next.find("a").attr("page", op.page + 1);
		cpo.last.find("a").attr("page", op.total);
		
		cpo.pageDetail.text(pageDetailStr);
		
		//上一页和第一页
		if( op.page <= 1 ){
			_removeActive.call(cpo.first);
			_removeActive.call(cpo.prev);
		}else{
			_addActive.call(cpo.first);
			_addActive.call(cpo.prev);
		}
		
		//当前页
		cpo.cur.find("input[type='text']").unbind().bind("keydown", function(e){
			if( e.keyCode == 13 && /^\d*$/.test(this.value) ){
				$(this).attr("page", this.value);
				//op.pageGo.call(this);
				op.pageGo.call(this, {rowsNum:$selStr.value});
			}
		}).change(function(){
			if( /^\d*$/.test(this.value) ){
				$(this).attr("page", this.value);
				//op.pageGo.call(this);
				op.pageGo.call(this, {rowsNum:$selStr.value,page:1});
			}
		})

		//下一页和最后一页
		if( op.page >= op.total ){
			_removeActive.call(cpo.next);
			_removeActive.call(cpo.last);
		}else{
			_addActive.call(cpo.next);
			_addActive.call(cpo.last);
		}
	}
})(jQuery);