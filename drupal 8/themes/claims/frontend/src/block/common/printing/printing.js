import $ from 'jquery';

$(function() {
	$('.print-button').on('click', function() {
		window.print();
	});

	if ('#printing' === location.hash) {
		var print_window = window.open(location.pathname + '/print', '_blank');
		if (print_window) {
			print_window.focus();
		}
	}
});