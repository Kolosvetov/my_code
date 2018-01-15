import $ from 'jquery';

$(function(){
	anchorButton('.js-anchor');
	scrollToAnchor();
});


function scrollToAnchor(func)
{
	var $anchor = $(window.location.hash);

	if(!$anchor.length){
		return false;
	}

	var extraOffset = 10;
	var offsetTop = $anchor.offset().top - extraOffset;

	$('html, body').animate(
		{scrollTop: offsetTop},
		{
			duration: 1000,
			complete: func,
			step: function(current, tween) {
				tween.end = $anchor.offset().top - extraOffset;
			}
		}
	);
}

function anchorButton(selector, func)
{
	$(selector).on('click', function(e){
		e.preventDefault();
		var anchor_text = $(this).attr('href');
		var $anchor = $(anchor_text);

		if(!$anchor.length){
			return false;
		}

		var extraOffset = 50;
		var offsetTop = $anchor.offset().top - extraOffset;

		$('html, body').animate(
			{scrollTop: offsetTop},
			{
				duration: 1000,
				complete: func,
				step: function(current, tween) {
					tween.end = $anchor.offset().top - extraOffset;
				}
			}
		);
	});
}
