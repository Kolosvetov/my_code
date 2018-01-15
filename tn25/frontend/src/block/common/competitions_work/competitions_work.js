import $ from 'jquery';

window.after_load = function() {
	$('.tao-list-competition_work .loader-cont').remove();
}

$(function(){
	if ($(".tao-elements-ajax")[0]) {
		$(".tao-elements-ajax")[0].addEventListener("DOMSubtreeModified", function() {
			$('.fancybox').fancybox({
				autoCenter: false,
				fitToView: false,
			});
		});
	}
})