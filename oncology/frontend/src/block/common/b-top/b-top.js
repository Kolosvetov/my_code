import $ from 'jquery';

$(function(){
	$('.m-burger').click(function(){
		$(this).toggleClass("close");
		$('.b-top-menu__links').slideToggle();
		return false;
	});
	$('.b-top-menu__search input[type="text"]').click(function(){
		$('.b-top-menu__search').addClass('active');
	});
	
	function openDropMenu(el) {
		closeDropMenu();
		var dropMenuClass = "."+el.attr('id');
		el.addClass('open');
		$(dropMenuClass).css('left', (el.position().left-20));
		if ($(document).width() > 1024) {
			$('.drop-menu-overlay').show();
		}
		$(dropMenuClass).show();
	}
	
	function closeDropMenu() {
		$('.with-dropmenu').each(function(){
			var dropMenuClass = "."+$(this).attr('id');
			$(dropMenuClass).hide();
			$('.drop-menu-overlay').hide();
			$(this).removeClass('open');
		});
	}
	
	$('.with-dropmenu').each(function(){
		$(this).click(function(){
//			if ($(document).width() > 1024) {
				openDropMenu($(this));
				return false;
//			}
		});
	});
	
    $(document).click(function(e){
        if ($(e.target).parents().filter('.c-dropmenu').length < 1 && $(e.target).filter('.c-dropmenu').length < 1) {
            closeDropMenu();
        }
    });

	$(window).scroll(function(){
		if ($(window).width() < 720) {
			if (95 <= $(window).scrollTop()) {
				$('.wrapper').css('margin-top', 95);
			} else {
				$('.wrapper').css('margin-top', 0);
			}
		}
	});
})
