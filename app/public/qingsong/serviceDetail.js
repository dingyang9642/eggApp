/* eslint-disable */
/** 发起服务申请.检验是否已托办 */
$(function(){
    var ctx = $("#urlPre").val();
    var tmpId = $("#tmpId").val();

});

function initCopyClipBoard(content){
    var ctx = $("#urlPre").val();
    clip = new ZeroClipboard( document.getElementById("copyUrlBtn"), {
        moviePath: ctx + '/common/flash/ZeroClipboard.swf'
    } );

    clip.setText(content); // 设置要复制的文本。
    clip.on('mouseDown',function(){
        clip.setText(clipBoardContent);
    });
    clip.on('complete', function(client, args) {
        alert("复制成功！");
    });
}

var clip;
var clipBoardContent;
function tabClick(id){
    var paramId = $("#paramId").val();
    var paramPid = $("#paramPid").val();
    var origin = this.location.origin?this.location.origin:('http://'+this.location.host);
    // clipBoardContent=origin+this.location.pathname+"?id=" + paramId + "&pid=" + paramPid + "&tabId="+ id ;
    // initCopyClipBoard(clipBoardContent);
}

$(function(){
    //设置选中TAB
    var currentTab = $("#currentTab").val();
    var flag=true;
    $.each($("ul#tabNavList>li"),function(i){
        if (this.id== currentTab) {
            $(this).addClass("current");
            // tabClick($(this).attr("id"));
            flag=false;
            return false;
        }
    });
    if (flag) {
        $.each($("ul#tabNavList>li"),function(i){
            if (i==0) {
                $(this).addClass("current");
            }
        });
    }

    //隐藏其他TAB内容
    var tabFlag=true;
    $.each($("div.myHrTabCon"),function(i){
        if (this.id!=currentTab) {
            $(this).addClass("hide");
            tabFlag=false;
        }
    });
    if (tabFlag) {
        $.each($("div.myHrTabCon"),function(i){
            if (i!=0) {
                $(this).addClass("hide");
            }
        });
    }

    //设置目录选择


    //tab切换
    var tab = new $myHr.tab({
        callback:function(cons){
            $.each(cons,function(index,item){
                var menulinks = $('.datail-catalog-list',$(item)).children();
                $.each(menulinks,function(i,n){
                    $(n).bind('click',function(){
                        $(this).addClass('current').siblings().removeClass('current');
                    });
                })
            });

        }
    });







});

