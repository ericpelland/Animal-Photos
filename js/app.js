window.onload = function () {
	window.addEventListener("tizenhwkey", function (ev) {
		if (ev.keyName === "back") {
			var page = document.getElementsByClassName("ui-page-active")[0];
			var pageid = page ? page.id : "";

			if (pageid === "mainPage") {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
	
	var SCROLL_STEP = 50;
    var page = document.body;

    page.addEventListener('pagebeforeshow', function pageScrollHandler() {
        var rotaryEventHandler = function(e) {
	    		var elScrollers = page.getElementsByClassName('ui-scroller');
            for(var m = 0; m < elScrollers.length; m++) {
            		/* Rotary event handler */
            		var elScroller = elScrollers[m];
            		if (e.detail.direction === 'CW') {
        	            /* Right direction */
        	            elScroller.scrollTop += SCROLL_STEP;
        	        } else if (e.detail.direction === 'CCW') {
        	            /* Left direction */
        	            elScroller.scrollTop -= SCROLL_STEP;
        	        }
            }
        	};
        document.addEventListener('rotarydetent', rotaryEventHandler, false);
    }, false);
};