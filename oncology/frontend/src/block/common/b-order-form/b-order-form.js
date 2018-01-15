import $ from 'jquery';
import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'bootstrap-datetimepicker-sass/src/js/bootstrap-datetimepicker';

$(function(){
	$('.date').datetimepicker({language: 'ru', pickTime: false});
	$('.time').datetimepicker({language: 'ru', pickDate: false});
	$('.date-time').datetimepicker({language: 'ru'});
});
