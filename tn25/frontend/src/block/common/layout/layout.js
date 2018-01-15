import $ from 'jquery';

$(function(){
	$('.b-header__menu-mobile').click(function(){
		$('.b-header__menu-mobile').toggleClass('close');
		$('.b-header__menu-links').slideToggle();
	});
	
	$(window).scroll(function(){
		if ($('.b-header').outerHeight() <= $(window).scrollTop()) {
			$('.b-header').removeClass('unfixed');
			$('.b-header').addClass('fixed');
		} 
		if ($(window).scrollTop() == 0){
			$('.b-header').addClass('unfixed');
			$('.b-header').removeClass('fixed');
		}
	});
})
