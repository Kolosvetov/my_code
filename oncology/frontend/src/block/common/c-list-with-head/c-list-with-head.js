import $ from 'jquery';

$(function(){
	$.each($('.c-list-with-head'), function(){
		$(this).find('> div').each(function(){
			if ($(this).index() > 6) {
				$(this).hide();
				$('.b-our-specialists-content__show-more').show();
			}
		});
		$(this).find('.b-our-specialists-content__show-more').click(function(){
			$('.c-list-with-head > div').show();
		});
	});
})
