import $ from 'jquery';

$(function () {
	var countDownDate = new Date($('#countdown').data('date')).getTime();
	var x = setInterval(function () {
		var now = new Date().getTime();
		var distance = countDownDate - now;
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);


		if (days < 10) {
			days = "0"+days;
		}
		if (seconds < 10) {
			seconds = "0"+seconds;
		}
		if (minutes < 10) {
			minutes = "0"+minutes;
		}
		if (hours < 10) {
			hours = "0"+hours;
		}
		
		$('#countdown').find('.day .value').empty().append(days);
		
		$('#countdown').find('.hour .value').empty().append(hours);
		$('#countdown').find('.hour label').empty().append(declOfNum(hours,  window.hours));
		
		$('#countdown').find('.minuts .value').empty().append(minutes);
		$('#countdown').find('.minuts label').empty().append(declOfNum(minutes,  window.minuts));
		
		$('#countdown').find('.seconds .value').empty().append(seconds);
		$('#countdown').find('.seconds label').empty().append(declOfNum(seconds,  window.seconds));
		
//		document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
//				+ minutes + "m " + seconds + "s ";
		if (distance < 0) {
			clearInterval(x);
			document.getElementById("countdown").innerHTML = "EXPIRED";
		}
	}, 1000);
	
	function declOfNum(number, titles)  
	{  
		var cases = [2, 0, 1, 1, 1, 2];  
		return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
	}
})