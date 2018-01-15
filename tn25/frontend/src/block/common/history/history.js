import $ from 'jquery';
import 'swiper/dist/js/swiper';

$(function(){
	new window.Swiper('.b-history', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
		autoplay: 5000,
		speed: 1000,
		effect: "fade",
		fade: {crossFade: true},
	});
})