$(function() {
	$('.js-analytic-in-page-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderDoctor_Stat');
	});

	$('.js-analytic-in-page2-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderCall_Stat_Q');
	});

	$('.js-analytic-in-page-callback').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderCall_Stat');
	});
});
