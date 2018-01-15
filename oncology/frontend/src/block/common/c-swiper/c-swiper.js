import $ from 'jquery';
import 'swiper/dist/js/swiper';

$(function(){
function observerMutationReact(target) {
	if ($(target).hasClass('is-active')) {
		var curSwiper = $(target).find('.swiper-container');
		new window.Swiper('#'+curSwiper.attr('id'), {
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			slidesPerView: 3,
			paginationClickable: true,
			spaceBetween: 30,
		});
	}
	observer.disconnect();
}
//// создаем экземпляр наблюдателя
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        observerMutationReact(mutation.target);
    });    
});
//// настраиваем наблюдатель
var config = { attributes: true, childList: true, characterData: true }

	$('.swiper-container').each(function(){
		var swiper = $(this);
		if (swiper.is(":visible") == false) {
			$('.tabs-panel').each(function(){
				if ($(this).find(swiper).length == 1) {
					observer.observe($(this)[0], config);
				}
			});
		}
	});
//    new window.Swiper('.swiper-container', {
//        nextButton: '.swiper-button-next',
//        prevButton: '.swiper-button-prev',
//        slidesPerView: 3,
//        paginationClickable: true,
//        spaceBetween: 30,
//    });
})

/* legal-info page*/
$(function() {
	let $swiperBlockList = $('.swiper-container-li');
	$swiperBlockList.each(function() {
		let selector = '#' + $(this).attr('id');
		let index = $(this).data('index');
		new window.Swiper(selector, {
			nextButton: '.swiper-button-next-' + index,
			prevButton: '.swiper-button-prev-' + index,
			slidesPerView: 3,
			paginationClickable: true,
			spaceBetween: 30,
		});
	});
});
