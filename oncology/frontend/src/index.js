import $ from 'jquery';

import 'block/common';
import 'layout/work';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'bootstrap-datetimepicker-sass/src/js/bootstrap-datetimepicker';

import "jquery.maskedinput/src/jquery.maskedinput.js";

(function() {

    if ($('body').hasClass('c-homepage')) {
        require.ensure([], (require) => {
            require('page/main');
        }, 'main');
    }

})();

$(function(){
	let $askModal = $('#ask');
	let $appointmentModal = $('#make_appointment');
	let $callbackModal = $('#make_appointment');
	let $addministratorModal = $('#administration');


	$('.js-administrator-btn').on('click', function(){
		let formClass = $(this).data('form-type');
		$.ajax('/forms/ajax/administration/')
			.done(function(resp){
				$addministratorModal.html(resp).foundation('open');
				$addministratorModal.find('form').addClass(formClass);

				if(!isMobile.any()) {
					$addministratorModal.find('.b-field-phone').mask('9 (999) 999-99-99');
				}
				initAnalytic();
			});
		return false;
	});

	$('.js-question-btn').on('click', function(){
		let formClass = $(this).data('form-type');
		$.ajax('/forms/ajax/question/')
			.done(function(resp){
				$askModal.html(resp).foundation('open');
				$askModal.find('form').addClass(formClass);

				if(!isMobile.any()) {
					$askModal.find('.b-field-phone').mask('9 (999) 999-99-99');
				}
				initAnalytic();
			});
		return false;
	});

	$('.js-appointment-btn').on('click', function(){
		let formClass = $(this).data('form-type');
		$.ajax('/forms/ajax/appointment/')
			.done(function(resp){
				$appointmentModal.html(resp).foundation('open');
				$appointmentModal.find('form').addClass(formClass);
				$('.date').datetimepicker({language: 'ru', pickTime: false});
				if(!isMobile.any()) {
					$appointmentModal.find('.b-field-phone').mask('9 (999) 999-99-99');
				}
				initAnalytic();
			});
		return false;
	});

	$('.js-callback-btn').on('click', function(){
		let formClass = $(this).data('form-type');
		$.ajax('/forms/ajax/callback/')
			.done(function(resp){
				$callbackModal.html(resp).foundation('open');
				$callbackModal.find('form').addClass(formClass);
				$('.date').datetimepicker({language: 'ru', pickTime: false});

				if(!isMobile.any()) {
					$callbackModal.find('.b-field-phone').mask('9 (999) 999-99-99');
				}
				initAnalytic();
			});
		return false;
	});
});

/* eslint-disable */
function initAnalytic()
{
	/************header***************/
	//question
	$('.js-analytic-header-question').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'AskQuestion_Toolbar');
	});

	//appointment
	$('.js-analytic-header-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderDoctor_Toolbar');
	});

	//callback
	$('.js-analytic-header-callback').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderCall_Toolbar');
	});


	/*************footer*******************/
	//question
	$('.js-analytic-footer-question').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'AskQuestion_Footer');
	});

	//appointment
	$('.js-analytic-footer-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderDoctor_Footer');
	});

	//callback
	$('.js-analytic-footer-callback').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderCall_Footer');
	});

	/*****************in-page***************/
	//question
	$('.js-analytic-top-cont-question').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'AskQuestion_TopCont');
	});

	//appointment
	$('.js-analytic-doc-page-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderDoctor_DocPage');
	});

	$('.js-analytic-main-page-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderDoctor_TopMain');
	});

	$('.js-analytic-doc-block-appointment').on('submit', function(){
		ga('send', 'event', 'Form', 'SendForm', 'OrderDoctor_DocBlock');
	});


}


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
