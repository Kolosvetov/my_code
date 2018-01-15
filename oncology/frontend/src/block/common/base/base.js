import $ from 'jquery';
import 'foundation-sites/dist/js/foundation';
require('fancybox')($);

$(function(){
	$('.disabled').click(function(){
		return false;
	});
	window.Foundation.Accordion.defaults.allowAllClosed = true;
	$(document).foundation();
	if ($(window).width() > 720) {
		$('.wrapper').css('margin-top', $('.b-top').outerHeight());
	}
	$(window).resize(function(){
		if ($(window).width() > 720) {
			$('.wrapper').css('margin-top', $('.b-top').outerHeight());
		}
	});
	$('.fancybox').fancybox({
		helpers:  {
			thumbs : {
				width: 50,
				height: 50
			},
			title: {
                type: 'outside'
            }
		},
		beforeShow: function () {
			if (this.group.length > 1) {
				this.title = (this.title ? '' + this.title + '<br />' : '') + '' + (this.index + 1) + ' из ' + this.group.length;
			}
		}
	});
})
