import $ from 'jquery';

$(function() {
	$('body').on('click', '.b-filter__toggle', function() {
		$('.c-toggle').slideToggle();
		$('.b-filter__toggle').toggleClass('b-filter__toggle--toggled');
	});
});
