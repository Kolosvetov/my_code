import $ from 'jquery';

$(function(){
	$('.b-bottom-menu .column h3').click(function(){
		$(this).parent().find('a').fadeIn();
	});
})
