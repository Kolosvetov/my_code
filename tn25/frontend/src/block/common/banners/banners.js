import $ from 'jquery';
import 'swiper/dist/js/swiper';

$(function(){
	new window.Swiper('.b-banners', {
		pagination: '.swiper-pagination',
		paginationBulletRender: function (swiper, index, className) {
            return '<span class="' + className + '">0' + (index + 1) + '</span>';
        },
		paginationClickable: true,
		autoplay: 5000,
		speed: 1000,
//		nextButton: '.swiper-button-next',
//        prevButton: '.swiper-button-prev'
	});
})