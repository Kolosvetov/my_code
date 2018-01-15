import $ from 'jquery';

$(function(){
	var slides = [];
	
	$('.b-slider__slides .b-slider__slide').each(function(){
		var slide = $(this);
		if (slide.index() == 0) {
			slide.addClass('active');
		}
		slide.find('.prev').click(function(){
			changeSlide(slide, -1);
		});
		slide.find('.next').click(function(){
			changeSlide(slide, 1);
		});
		slides.push(slide);
	})
	function changeSlide(slide, index) {
		if (slides[slide.index()+index]) {
			showSlide(slides[slide.index()+index]);
		} else {
			showSlide(slides[0]);
		}
	}
	function showSlide(slide) {
		$(slides).each(function(){
			this.removeClass('active');
		})
		slide.addClass('active');
	}
})
