import $ from 'jquery';

$(function(){
	if ($(".b-our-specialists-content__list .b-our-specialists-content__item").length > 6) {
		for (var i = 6; i <= $(".b-our-specialists-content__list .b-our-specialists-content__item").length-1; i++) {
			$($(".b-our-specialists-content__list .b-our-specialists-content__item")[i]).hide();
		}
	} else {
		$('.b-our-specialists-content__show-more').hide();
	}
	$('.b-our-specialists-content__show-more').click(function(){
		$(".b-our-specialists-content__list .b-our-specialists-content__item").show();
		$('.b-our-specialists-content__show-more').hide();
		return false;
	});
})
