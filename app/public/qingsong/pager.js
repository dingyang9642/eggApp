(function($){
	$.extend($.fn,{
		pager:function(opts){
			opts = jQuery.extend({
				totalNums:20,
				perPage:6,
				displayPageNum:2,
				curPage:1,
				callback:function(){return false;}
			},opts||{});
			
			return this.each(function() {
				/**
				 * Calculate the maximum number of pages
				 */
				function numPages() {
					return Math.ceil(opts.totalNums/opts.perPage);
				}
				// Store DOM element for easy access from all inner functions
				var panel = $(this);
				// Extract current_page from options
				var current_page = opts.curPage;
				/**
				 * This is the event handling function for the pagination links. 
				 * @param {int} page_id The new page number
				 */
				function pageSelected(page_id, evt){
					current_page = page_id;
					//drawLinks();
					var continuePropagation = opts.callback(page_id, panel);
					
				}
				/**
				 * This function inserts the pagination links into the container element
				 */
				function drawLinks(current_page) {
					panel.empty();
					var np = numPages(),
						current_page = parseInt(current_page);
					// This helper function returns a handler function that calls pageSelected with the right page_id
					var getClickHandler = function(page_id) {//alert(page_id);
						return function(evt){ return pageSelected(page_id,evt); }
					};
					
					var prevPage = current_page - 1, 
						nextPage = current_page + 1;
					var np = numPages();
					if(np > 1){
						if(prevPage >0){
							$('<a href="javascript:void(0)">上一页</a>').appendTo(panel).bind('click',function(){
								update(prevPage);
							});
						};
						
						if (current_page != 1){
							$('<a href="javascript:void(0)">1</a>').appendTo(panel).bind('click',function(){
								update(1);
							});
						};
						if (current_page >= 5){
							$('<span>...</span>').appendTo(panel);
						};
						
						if (parseInt(current_page) + opts.displayPageNum < np) {
							var endPage = parseInt(current_page) + opts.displayPageNum;
						} else {
							var endPage = np;
						};
						for (var i = current_page - opts.displayPageNum; i <= endPage; i++) {
							if (i > 0) {
								if (i == current_page) {
									$('<span class="current">' + i + '</span>').appendTo(panel);
								}else{
									if (i != 1  &&  i != np) {
										$('<a href="javascript:void(0)" id="'+ i +'">'+ i +'</a>').appendTo(panel).bind('click',function(){
											update(parseInt($(this).attr('id')));
										});
									};
									
								};
							}
						}; 
						if(current_page + opts.displayPageNum < np){ 
							$('<span>...</span>').appendTo(panel);
						};
						if(current_page != np){
							$('<a href="javascript:void(0)">'+ np + '</a>').appendTo(panel).bind('click',function(){
								update(np);
							});
						};
						if(nextPage <= np) {
							$('<a href="javascript:void(0)">下一页</a>').appendTo(panel).bind('click',function(){
								update(nextPage);
							});
						}
						
					};
					
				};
				// When all initialisation is done, draw the links
				drawLinks(current_page);
				function update(curPage){
					drawLinks(curPage);
					opts.callback(curPage);
				};
				
			});
		}
	});
})(jQuery);