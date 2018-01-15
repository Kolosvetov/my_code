import $ from 'jquery';
$(function(){
	let diseaseList = $('.disease-list a');
	if (diseaseList.length > 8) {
		$('.disease-list__show-more').css('display', 'block');
	} 

	$('.disease-list__show-more').on('click', function() {
		diseaseList.css('display', 'block');
		$(this).css('display', 'none');
	});
});
