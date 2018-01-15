import $ from 'jquery';

$(function(){
	$('body').on("click", '.b-defect-type-list__title', function(){
		var parent = $(this).parent();
		parent.toggleClass('active');
	});
})