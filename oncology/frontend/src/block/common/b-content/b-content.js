import $ from 'jquery';

$(function(){
	$('.b-content > *').each(function(){
		if ($(this).offset().top < ($( window ).scrollTop()+$(window).height())) {
			$(this).addClass("js-show");
		}
	});

	$( window ).scroll(function() {
		$('.b-content > *').each(function(){
			if ($(this).offset().top < ($( window ).scrollTop()+$(window).height()-50)) {
				$(this).addClass("js-show");
			}
		});
	});
});
