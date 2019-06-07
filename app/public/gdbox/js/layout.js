$(document).ready(function () {
    var AFFIX_TOP_LIMIT = 142;
    var AFFIX_OFFSET = 49;
    var $affixNav = $('.docs-nav'),
        current = null,
        $links = $affixNav.find('a');

    var $menu = $('#menu');

    function getClosestHeader(top) {
        var last = $links.first();

        if (top < AFFIX_TOP_LIMIT) {
            return last;
        }

        for (var i = 0; i < $links.length; i++) {
            var $link = $links.eq(i),
                href = $link.attr('href');

            if (href.charAt(0) === '#' && href.length > 1) {
                var $anchor = $(href).first();

                if ($anchor.length > 0) {
                    var offset = $anchor.offset();

                    if (top < offset.top - AFFIX_OFFSET) {
                        return last;
                    }

                    last = $link;
                }
            }
        }
        return last;
    }

    $('#menu-toggle').on('click', function () {
        $menu.toggleClass('open');
        return false;
    });

    function setDocNavFixed() {
        var top = window.scrollY;
        if (top <= AFFIX_TOP_LIMIT && $affixNav.hasClass('fixed')) {
            $affixNav.removeClass('fixed');
        }
        else if (top > AFFIX_TOP_LIMIT && !$affixNav.hasClass('fixed')) {
            $affixNav.addClass('fixed');
        }
        return top;
    }

    setDocNavFixed();

    $(window).on('scroll', function (evt) {
        const top = setDocNavFixed();
        var $current = getClosestHeader(top);

        if (current !== $current) {
            $affixNav.find('.active').removeClass('active');
            $current.addClass('active');
            current = $current;
        }
    });
});
