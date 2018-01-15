import $ from 'jquery';
		$(function () {
			$('body').on("click", '.make-vote', function () {
				var fd = new FormData;
				var id = $(this).data('id');
				var but = $(this);

				if (but.attr('disabled') == 'disabled') {
					return false;
				}

				fd.append("form-name", "make-vote");
				fd.append("work-id", $(this).data('id'));
				fd.append("competition-id", $(this).data('competition'));
				but.attr('disabled', 'disabled');

				$.ajax({
					data: fd,
					url: '/25/ajax/vote/',
					processData: false,
					contentType: false,
					dataType: "json",
					type: 'POST',
					success: function (data) {
						if (data.ok == true) {
							var count = parseInt($($('.vote-couter-' + id)[0]).text(), 10);
							$('.vote-couter-' + id).empty().text(count + 1);
							$('.vote-couter-' + id).parent().addClass('voted');
						}
					}
				});
			});
			
			$('body').on("click", '.make-vote-popup', function () {
				var fd = new FormData;
				var id = $(this).data('id');
				var but = $(this);
				fd.append("form-name", "make-vote");
				fd.append("work-id", $(this).data('id'));
				fd.append("competition-id", $(this).data('competition'));
				but.attr('disabled', 'disabled');

				$.ajax({
					data: fd,
					url: '/25/ajax/vote/',
					processData: false,
					contentType: false,
					dataType: "json",
					type: 'POST',
					success: function (data) {
						if (data.ok == true) {
							var count = parseInt($($('.vote-couter-' + id)[0]).text(), 10);
							$('.vote-couter-' + id).empty().text(count + 1);
							$('.vote-couter-' + id).parent().addClass('voted');
						}
					}
				});
			});
		})