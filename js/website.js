// IE polyfill
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

(function(website, $, undefined) {

    function pageUrl(pageName) {
        return encodeURI("page/" + pageName + ".html");
    }

    function safariHacks() {
        var userAgent = window.navigator.userAgent;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
            $("body").addClass("safari");
        }
    }

    function adjustViewTopMargin() {
        var topNavHeight = $("nav.navbar-fixed-top").height();
        $("div.view").css("margin-top", topNavHeight + "px");
    }

    function renderView() {
        $("div.view").hide();
        $("#mainNav ul.nav li.active").removeClass("active");
        $("#mainNav ul.nav li").each(function() {
            var $this = $(this);
            if ($this.find("a").attr("href") == (window.location.hash || "#")) {
                $this.addClass("active");
            }
        });

        var view = window.location.hash.substring(1);
        if (view.startsWith("page-")) {
            var $pageView = $("#pageView");
            var pageName = view.substring(view.indexOf("-") + 1);
            $pageView.children().remove();
            $pageView.show();
            $pageView.load(pageUrl(pageName) + " #pageContent", function() {

            });
            $("html, body").animate({ scrollTop: 0 }, "fast");
        } else {
            $("#homeView").show();
            if (window.location.hash) {
                var $section = $(window.location.hash);
                $section[0].scrollIntoView();
            } else {
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
        }
    }

    window.onhashchange = renderView;
    $(window).resize(adjustViewTopMargin);

    $(document).ready(function() {
        safariHacks();
        renderView();
        adjustViewTopMargin();
        for (var i=1; i<6; i++) window.setTimeout(adjustViewTopMargin, i * 1000);
    });

    // hide expanded menu after click on small screens
    $(document).on('click','.navbar-collapse.in',function(e) {
        if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
            $(this).collapse('hide');
        }
    });

})(window.website = window.website || {}, jQuery);