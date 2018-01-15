import $ from 'jquery';

$(function(){
	$('.open-switcher').click(function(){
		$(this).toggleClass('active');
		$('.hidden').slideToggle();
		return false;
	});
})
