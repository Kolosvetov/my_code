webpackJsonp([2],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(50);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _svg4everybody = __webpack_require__(51);
	
	var _svg4everybody2 = _interopRequireDefault(_svg4everybody);
	
	__webpack_require__(52);
	
	__webpack_require__(109);
	
	__webpack_require__(110);
	
	__webpack_require__(89);
	
	__webpack_require__(87);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _svg4everybody2.default)();
	
	(function () {
	    if ((0, _jquery2.default)('body').hasClass('c-homepage')) {
	        __webpack_require__.e/* nsure */(3, function (require) {
	            __webpack_require__(111);
	        });
	    }
	})();

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(root, factory) {
	     true ? // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return root.svg4everybody = factory();
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == typeof exports ? module.exports = factory() : root.svg4everybody = factory();
	}(this, function() {
	    /*! svg4everybody v2.1.0 | github.com/jonathantneal/svg4everybody */
	    function embed(svg, target) {
	        // if the target exists
	        if (target) {
	            // create a document fragment to hold the contents of the target
	            var fragment = document.createDocumentFragment(), viewBox = !svg.getAttribute("viewBox") && target.getAttribute("viewBox");
	            // conditionally set the viewBox on the svg
	            viewBox && svg.setAttribute("viewBox", viewBox);
	            // copy the contents of the clone into the fragment
	            for (// clone the target
	            var clone = target.cloneNode(!0); clone.childNodes.length; ) {
	                fragment.appendChild(clone.firstChild);
	            }
	            // append the fragment into the svg
	            svg.appendChild(fragment);
	        }
	    }
	    function loadreadystatechange(xhr) {
	        // listen to changes in the request
	        xhr.onreadystatechange = function() {
	            // if the request is ready
	            if (4 === xhr.readyState) {
	                // get the cached html document
	                var cachedDocument = xhr._cachedDocument;
	                // ensure the cached html document based on the xhr response
	                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""), 
	                cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
	                xhr._embeds.splice(0).map(function(item) {
	                    // get the cached target
	                    var target = xhr._cachedTarget[item.id];
	                    // ensure the cached target
	                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)), 
	                    // embed the target into the svg
	                    embed(item.svg, target);
	                });
	            }
	        }, // test the ready state change immediately
	        xhr.onreadystatechange();
	    }
	    function svg4everybody(rawopts) {
	        function oninterval() {
	            // while the index exists in the live <use> collection
	            for (// get the cached <use> index
	            var index = 0; index < uses.length; ) {
	                // get the current <use>
	                var use = uses[index], svg = use.parentNode;
	                if (svg && /svg/i.test(svg.nodeName)) {
	                    var src = use.getAttribute("xlink:href");
	                    if (polyfill && (!opts.validate || opts.validate(src, svg, use))) {
	                        // remove the <use> element
	                        svg.removeChild(use);
	                        // parse the src and get the url and id
	                        var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
	                        // if the link is external
	                        if (url.length) {
	                            // get the cached xhr request
	                            var xhr = requests[url];
	                            // ensure the xhr request exists
	                            xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(), 
	                            xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
	                            xhr._embeds.push({
	                                svg: svg,
	                                id: id
	                            }), // prepare the xhr ready state change event
	                            loadreadystatechange(xhr);
	                        } else {
	                            // embed the local id into the svg
	                            embed(svg, document.getElementById(id));
	                        }
	                    }
	                } else {
	                    // increase the index when the previous value was not "valid"
	                    ++index;
	                }
	            }
	            // continue the interval
	            requestAnimationFrame(oninterval, 67);
	        }
	        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/;
	        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537;
	        // create xhr requests object
	        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use");
	        // conditionally start the interval if the polyfill is active
	        polyfill && oninterval();
	    }
	    return svg4everybody;
	});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function requireAll(r) {
	    r.keys().forEach(r);
	}
	
	requireAll(__webpack_require__(53));

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./b-claim-info/b-claim-info": 54,
		"./b-claim-info/b-claim-info.scss": 54,
		"./b-claim-info/b-claim-info_mobile": 55,
		"./b-claim-info/b-claim-info_mobile.scss": 55,
		"./b-claims-item/b-claims-item": 56,
		"./b-claims-item/b-claims-item.scss": 56,
		"./b-claims-item/b-claims-item_mobile": 57,
		"./b-claims-item/b-claims-item_mobile.scss": 57,
		"./b-claims/b-claims": 58,
		"./b-claims/b-claims.js": 58,
		"./b-claims/b-claims.scss": 59,
		"./b-claims/b-claims_mobile": 60,
		"./b-claims/b-claims_mobile.scss": 60,
		"./b-closeable/b-closeable": 61,
		"./b-closeable/b-closeable.scss": 61,
		"./b-closeable/b-closeable_mobile": 62,
		"./b-closeable/b-closeable_mobile.scss": 62,
		"./b-defect-list/b-defect-list": 63,
		"./b-defect-list/b-defect-list.js": 63,
		"./b-defect-list/b-defect-list.scss": 64,
		"./b-defect-list/b-defect-list_mobile": 65,
		"./b-defect-list/b-defect-list_mobile.scss": 65,
		"./b-defect/b-defect": 66,
		"./b-defect/b-defect.scss": 66,
		"./b-defect/b-defect_mobile": 67,
		"./b-defect/b-defect_mobile.scss": 67,
		"./b-filter/b-filter": 68,
		"./b-filter/b-filter.js": 68,
		"./b-filter/b-filter.scss": 69,
		"./b-filter/b-filter_mobile": 70,
		"./b-filter/b-filter_mobile.scss": 70,
		"./b-footer/b-footer": 71,
		"./b-footer/b-footer.scss": 71,
		"./b-footer/b-footer_mobile": 72,
		"./b-footer/b-footer_mobile.scss": 72,
		"./b-head/b-head": 73,
		"./b-head/b-head.scss": 73,
		"./b-head/b-head_mobile": 74,
		"./b-head/b-head_mobile.scss": 74,
		"./b-header/b-header": 75,
		"./b-header/b-header.scss": 75,
		"./b-header/b-header_mobile": 76,
		"./b-header/b-header_mobile.scss": 76,
		"./b-middle-form/b-middle-form": 77,
		"./b-middle-form/b-middle-form.scss": 77,
		"./b-middle-form/b-middle-form_mobile": 78,
		"./b-middle-form/b-middle-form_mobile.scss": 78,
		"./b-tabs/b-tabs": 79,
		"./b-tabs/b-tabs.scss": 79,
		"./b-top/b-top": 80,
		"./b-top/b-top.scss": 80,
		"./b-top/b-top_mobile": 81,
		"./b-top/b-top_mobile.scss": 81,
		"./b-user/b-user": 82,
		"./b-user/b-user.scss": 82,
		"./b-user/b-user_mobile": 83,
		"./b-user/b-user_mobile.scss": 83,
		"./b-with-tooltip/b-with-tooltip": 84,
		"./b-with-tooltip/b-with-tooltip.scss": 84,
		"./b-with-tooltip/b-with-tooltip_mobile": 85,
		"./b-with-tooltip/b-with-tooltip_mobile.scss": 85,
		"./c-form/c-form": 86,
		"./c-form/c-form.js": 86,
		"./c-form/c-form.scss": 101,
		"./c-form/c-form_mobile": 102,
		"./c-form/c-form_mobile.scss": 102,
		"./common": 52,
		"./common.js": 52,
		"./printing/printing": 103,
		"./printing/printing.js": 103,
		"./printing/printing.scss": 104,
		"./work/work": 105,
		"./work/work.js": 105,
		"./work/work.scss": 107,
		"./work/work_mobile": 108,
		"./work/work_mobile.scss": 108
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 53;


/***/ },
/* 54 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 55 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 56 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 57 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(59);
	//import $ from 'jquery';
	
	//function show_content() {
	//	$('.js-claims-content').hide();
	//	let id = $('.js-claims-tab.active').data('id');
	//	$('.js-claims-content[data-id=' + id + ']').show();
	//}
	//
	//$(function() {
	//	show_content();
	//	$('.js-claims-tab').on('click', function() {
	//		$('.js-claims-tab').removeClass('active');
	//		$(this).addClass('active');
	//		show_content();
	//	});
	//});

/***/ },
/* 59 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 60 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 61 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 62 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(64);
	
	
	(0, _jquery2.default)(function () {
		(0, _jquery2.default)('body').on("click", '.b-defect-type-list__title', function () {
			var parent = (0, _jquery2.default)(this).parent();
			parent.toggleClass('active');
		});
	});

/***/ },
/* 64 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 65 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 66 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 67 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(69);
	
	
	(0, _jquery2.default)(function () {
		(0, _jquery2.default)('body').on('click', '.b-filter__toggle', function () {
			(0, _jquery2.default)('.c-toggle').slideToggle();
			(0, _jquery2.default)('.b-filter__toggle').toggleClass('b-filter__toggle--toggled');
		});
	});

/***/ },
/* 69 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 70 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 71 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 72 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 73 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 74 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 75 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 76 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 77 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 78 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 79 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 80 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 81 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 82 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 83 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 84 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 85 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(87);
	
	__webpack_require__(88);
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _component = __webpack_require__(89);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _crontab = __webpack_require__(100);
	
	var _crontab2 = _interopRequireDefault(_crontab);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(101);
	
	
	// Контроль "мягкого" поведения кнопок переключения шагов
	var _stepButtonStrongBehavior = true;
	
	(0, _jquery2.default)(function () {
		// Блокируем работу скрипта для страниц с пользовательскими соглашениями,
		// подгружаемыми через fancybox
		if (0 !== (0, _jquery2.default)('.do-not-add-defects').length) {
			return;
		}
	
		var _today = new Date();
		_jquery2.default.fn.datepicker.dates['ru'] = {
			days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
			daysShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
			daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
			months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			today: "Сегодня",
			clear: "Clear",
			format: "dd.mm.yyyy",
			titleFormat: "MM yyyy",
			weekStart: 1 // Первый день недели - Понедельник
		};
		(0, _jquery2.default)('input[name="date"], .date').datepicker({ language: 'ru', autoclose: true, endDate: _today });
	
		// Хак для назначения обработчика Datepicker на добавляемые сценарием поля
		_crontab2.default.addNamed('datePickerRefresh', function () {
			(0, _jquery2.default)('input[name="date"], .date').datepicker({ language: 'ru', autoclose: true, endDate: _today });
		});
	
		// $('input[name="phone"], .phone').inputmask("+7 (999) 999 99 99");
		(0, _jquery2.default)('input[name="phone"], .phone').inputmask("9{10,15}").data('mask', '^[1-9][0-9]{9,14}$');
		(0, _jquery2.default)('.number').inputmask("9{1,10}");
	
		(0, _jquery2.default)('main div.form-item').each(function () {
			var $this = (0, _jquery2.default)(this);
			if ($this.find('.description').length > 0) {
				(0, _jquery2.default)('label', $this).addClass('with-description');
			}
		});
	
		var CustomForms = [];
	
		(0, _jquery2.default)('body .custom-form').each(function () {
			CustomForms.push(new window.CustomForm((0, _jquery2.default)(this)));
		});
		StepControll();
		// Файл со сканом чека
		(0, _jquery2.default)('.form-item.js-form-type-file [type="file"]').change(function () {
			var input = this,
			    $input = (0, _jquery2.default)(this),
			    $parent = $input.parent(),
			    $label = (0, _jquery2.default)('label', $parent),
			    $preview = (0, _jquery2.default)('.photo-preview', $parent),
			    $image = (0, _jquery2.default)('img', $preview),
			    $delete = (0, _jquery2.default)('.photo-preview__delete', $parent),
			    reader = null;
	
			if (!$input.data('title')) {
				$input.data('title', $label.text());
			}
	
			if (input.files && 0 < input.files.length) {
				if (!/\.(gif|jpe?g|png)$/i.test(input.files[0].name)) {
					return alert('Выберите файл изображения');
				}
	
				$label.empty().append('Файл прикреплен');
	
				if (window['FileReader']) {
					if (0 == $image.length) {
						$delete = (0, _jquery2.default)('<div/>').addClass('photo-preview__delete').on('click', function () {
							$input.val('');
							$input.trigger('change');
						});
						$image = (0, _jquery2.default)('<img/>');
						$preview = (0, _jquery2.default)('<div>').addClass('photo-preview').append($image, $delete);
						$parent.append($preview);
					}
	
					reader = new FileReader();
					reader.onload = function (e) {
						$image.attr('src', e.target.result);
						// Пытаемся вернуть панель с кнопками шагов
						ScrollStepPanel();
					};
					reader.readAsDataURL(input.files[0]);
				}
			} else {
				$label.empty().append($input.data('title'));
				$preview.remove();
	
				// Пытаемся вернуть панель с кнопками шагов
				ScrollStepPanel();
			}
		});
		(0, _jquery2.default)('[name="button-step"]').change(function () {
			(0, _jquery2.default)('body,html').animate({ scrollTop: 0 }, 500);
		});
	
		var toggleDelLinks = function toggleDelLinks($block) {
			var $dels = (0, _jquery2.default)('.del_form_line', $block);
			if (1 < $dels.length) {
				$dels.css('display', 'inline-block');
			} else {
				$dels.css('display', 'none');
			}
			$dels.first().css('display', 'none');
		},
		    delFormLine = function delFormLine() {
			var $table = (0, _jquery2.default)(this).parents('.table').first(),
			    $block = $table.parent();
			$table.remove();
			toggleDelLinks($block);
			return false;
		};
	
		(0, _jquery2.default)('.table').each(function () {
			(0, _jquery2.default)('.del_form_line', (0, _jquery2.default)(this)).first().hide();
		});
	
		(0, _jquery2.default)('.del_form_line').on('click', delFormLine);
	
		(0, _jquery2.default)('.add_form_line').on('click', function () {
			var add_button = this,
			    $add_button = (0, _jquery2.default)(add_button),
			    $block = (0, _jquery2.default)($add_button.attr('data-target')),
			    $last = (0, _jquery2.default)('.table', $block).last(),
			    ajax_url = $add_button.attr('data-action') + '?count=' + $block.find('.table').length + '&without_add_button=true';
	
			if ('edit-add-defect' == $add_button.attr('data-drupal-selector')) {
				ajax_url += '&type=' + (0, _jquery2.default)('select[name="field_product_cat"] > option:selected').val() + '&collection=' + (0, _jquery2.default)('select[name="field_kollekcia"] > option:selected').val();
			}
	
			_jquery2.default.get(ajax_url, function (data) {
				$last.after(data);
				(0, _jquery2.default)('select', $block).each(function () {
					var select = this,
					    $select = (0, _jquery2.default)(select);
					if ($select.parent().hasClass('form-select') === false) {
						new _component2.default(select);
					}
				});
				(0, _jquery2.default)('.date').inputmask('99.99.9999');
				Drupal.behaviors.states.attach('body');
				(0, _jquery2.default)('select, input', data).each(function () {
					var control = this,
					    $control = (0, _jquery2.default)(control);
					if ($control.attr('data-drupal-states')) {
						var drupal_states = _jquery2.default.parseJSON($control.attr('data-drupal-states'));
						var states_keys = Object.keys(drupal_states.visible);
						var select = states_keys[0];
						var select_markup = (0, _jquery2.default)(select).parent();
						var value = select_markup.find('.cs-options li.cs-selected').attr('data-value');
	
						if (!value) {
							value = select_markup.find('.cs-options li:first').attr('data-value');
						}
	
						(0, _jquery2.default)(select).trigger({ type: 'state:value', value: value });
					}
				});
				toggleDelLinks($block);
				(0, _jquery2.default)('.del_form_line', $block).on('click', delFormLine);
			});
			return false;
		});
	
		(0, _jquery2.default)('#reject').click(function () {
			(0, _jquery2.default)('input[name="reject_markup"]').val('true');
			(0, _jquery2.default)('input[type="submit"]', (0, _jquery2.default)(this).parent()).click();
		});
	
		// Работа с "деревом дефектов" в форме
		var Defects = [];
	
		function DefectObject(count) {
			this.process(count);
		}
	
		DefectObject.prototype.defect = null;
		DefectObject.prototype.count = null;
		DefectObject.prototype.process = function (count) {
			this.count = count + 1;
			(0, _jquery2.default)('#place-for-forms').append('<div class="defect el-' + this.count + '"></div>');
			this.defect = (0, _jquery2.default)('#place-for-forms .el-' + this.count);
			this.LoadDefectList();
		};
		DefectObject.prototype.LoadDefectList = function () {
			var DObject = this;
			_jquery2.default.ajax({
				type: "POST",
				url: "/index_dev.php/ajax/get_defect_list",
				data: { count: DObject.count },
				success: function success(msg) {
					DObject.defect.append(msg);
					DObject.BindEvents();
				}
			});
		};
		DefectObject.prototype.LoadDefectForm = function () {
			var DObject = this,
			    $state_select = (0, _jquery2.default)('select[name=product_state]'),
			    $defect_select = (0, _jquery2.default)('select[name="defect_type[' + DObject.count.toString() + ']"]'),
			    product_state = '',
			    defect_code = '',
			    ol = 0,
			    oi = 0;
			if (0 < $state_select.length) {
				ol = $state_select[0].options.length;
				for (oi = 0; oi < ol; oi++) {
					if ($state_select[0].options[oi].selected) {
						product_state = $state_select[0].options[oi].value;
						break;
					}
				}
			}
			if (0 < $defect_select.length) {
				ol = $defect_select[0].options.length;
				for (oi = 0; oi < ol; oi++) {
					if ($defect_select[0].options[oi].selected) {
						defect_code = $defect_select[0].options[oi].value;
						break;
					}
				}
			}
	
			_jquery2.default.ajax({
				type: "POST",
				url: "/index_dev.php/ajax/get_defect_form",
				data: { code: defect_code, type: product_state, count: DObject.count },
				success: function success(msg) {
					DObject.defect.find('.form').remove();
					DObject.defect.append('<div class="form" style="float:left; width: 100%;">' + msg + '</div>');
					var CustomForms = [];
					(0, _jquery2.default)('body .custom-form:not(.custom-form_processed)').each(function () {
						CustomForms.push(new window.CustomForm((0, _jquery2.default)(this)));
					});
					Drupal.behaviors.states.attach('body');
				}
			});
		};
		DefectObject.prototype.BindEvents = function () {
			var DObject = this;
	
			DObject.defect.on('change', 'select[name="defect_type[' + DObject.count + ']"]', function () {
				DObject.LoadDefectForm();
				return false;
			});
	
			(0, _jquery2.default)('.del_defect_line').each(function () {
				var $this = (0, _jquery2.default)(this);
				if ($this.hasClass('click-assigned')) {
					return;
				}
				$this.on('click', function () {
					$this.parents('.defect').first().remove();
					return false;
				}).addClass('click-assigned');
			});
		};
	
		(0, _jquery2.default)('#add-defect').click(function () {
			Defects.push(new DefectObject(Defects.length));
			return false;
		});
		(0, _jquery2.default)('#add-defect').click();
	
		// Отправка формы - проверка всех шагов
		(0, _jquery2.default)('form').submit(function () {
			var $form = (0, _jquery2.default)(this);
			// Контроль полей
			if (!StepValidate($form)) {
				return StepFailure();
			}
			// Контроль изображений
			if (!StepImageValidate($form)) {
				return StepImageFailure();
			}
			// Включаем "прелоадер"
			(0, _jquery2.default)('.b-loading__canvas').removeClass('b-loading__canvas_hidden');
			(0, _jquery2.default)('.b-loading').removeClass('b-loading_hidden');
			return true;
		});
	
		(0, _jquery2.default)('.with-loading').on('click', function () {
			(0, _jquery2.default)('.b-loading__canvas').removeClass('b-loading__canvas_hidden');
			(0, _jquery2.default)('.b-loading').removeClass('b-loading_hidden');
			return true;
		});
	
		// Работа с переключаемыми блоками
		var TriggeredPanels = {
			parket: function parket($container) {
				Defects = [];
				$container.find('#place-for-forms').empty();
				(0, _jquery2.default)('#add-defect').click();
			},
			others: function others($container) {
				$container.find('.b-defect-list__item:not(.clone)').remove();
			}
		};
		var processTriggeredPanels = function processTriggeredPanels() {
			var label = '';
			for (label in TriggeredPanels) {
				if (!TriggeredPanels.hasOwnProperty(label)) {
					continue;
				}
				TriggeredPanels[label]((0, _jquery2.default)('#edit-defects-for-' + label));
			}
		};
		(0, _jquery2.default)('#edit-product-cat').on('change', processTriggeredPanels);
		(0, _jquery2.default)('#edit-product-state').on('change', processTriggeredPanels);
	
		if ((0, _jquery2.default)('.b-steps-panel').length > 0) {
			ScrollStepPanel();
			(0, _jquery2.default)(window).scroll(function () {
				ScrollStepPanel();
			});
		}
	});
	
	// Позиционирование панели с переключателем шагов
	function ScrollStepPanel() {
		var $block = (0, _jquery2.default)('.next-step-block:visible').parent(),
		    $window = (0, _jquery2.default)(window),
		    $steps = (0, _jquery2.default)('.b-steps-panel'),
		    $footer = (0, _jquery2.default)('.b-footer'),
		    $block_position = $block.offset().top + $block.height(),
		    $window_position = $window.scrollTop() + $window.height();
	
		if ($window_position >= $block_position) {
			$footer.css('margin-top', 0);
			$steps.removeClass('b-steps-panel__floated');
		} else {
			$footer.css('margin-top', $steps.outerHeight());
			$steps.addClass('b-steps-panel__floated');
		}
	}
	
	// Переключение между шагами формы
	function StepControll() {
		var $steps = (0, _jquery2.default)('.b-steps-panel');
	
		// "Кнопки" с номерами шагов
		(0, _jquery2.default)('label', $steps).on('click', function (e) {
			var $this = (0, _jquery2.default)(this),
			    $step = (0, _jquery2.default)('.b-step:visible');
	
			// Переходить на текущий шаг не надо - мы уже здесь
			if ((0, _jquery2.default)('[type=radio]:checked', $steps).attr('id') == $this.attr('for')) {
				return false;
			}
	
			// Проверка режима срабатывания проверки на "кнопке" шага
			if (_stepButtonStrongBehavior) {
				// Проверка обязательных полей
				if (!StepValidate($step)) {
					return StepFailure();
				}
				// Проверка изображений
				if (!StepImageValidate($step)) {
					return StepImageFailure();
				}
			}
	
			return true;
		});
	
		// Кнопка "Далее" - просто следующий шаг
		(0, _jquery2.default)('.next-step-block .fieldset-wrapper > div:not(.form-cancel):not([id="reject"])').on('click', function (e) {
			var next_step = parseInt($steps.find('[type=radio]:checked').val()) + 1;
			return (0, _jquery2.default)('label[for="edit-button-step-' + next_step.toString() + '"]').click();
		});
	}
	
	// Проверка полей шага
	function StepValidate($step) {
		var has_error = false,
		    $reject_markup = $step.find('input[name="reject_markup"]').first();
	
		// Выбираем все поля
		$step.find('input,select,textarea').each(function () {
			var $this = (0, _jquery2.default)(this),
			    value = $this.val(),
			    vmask = $this.data('mask'),
			    _error = false;
	
			// Проверяем только те, что помечены как обязательные
			if (!$this.hasClass('required')) {
				return;
			}
	
			// Хак скрытого листбокса для дефектов паркета
			if ($this.hasClass('form-select_wide') && 'none' === $this.parents('#edit-defects-for-parket').first().css('display')) {
				return;
			}
	
			// Хак скрытого поля для типа дефекта
			if ('edit-field-defect-type' == $this.data('drupal-selector') && 'none' === $this.parents('.form-item-field-defect-type').first().css('display')) {
				return;
			}
	
			if ($this.data('notmatch') == "true") {
				_error = true;
			}
			// Хак формы решения Магазина или Дистрибьютора на кнопку "Отказать"
			if ($this.hasClass('no-reject-markup') && 1 == $reject_markup.length && 'true' === $reject_markup.val()) {
				return;
			}
	
			// Проверяем checkbox по отметке
			if ('checkbox' == $this.attr('type') && !this.checked) {
				_error = true;
			} else
				// Проверяем заполнение и соответствие маске, если она есть
				if ('' == value || vmask && !value.match(vmask)) {
					_error = true;
				}
	
			// Ставим или снимаем пометку
			MarkupErrorField($this, _error);
	
			// Отмечаем обнаруженные ошибки
			if (_error) {
				has_error = true;
			}
		});
	
		// Сообщаем о результате проверки
		return !has_error;
	}
	
	// Проверка изображений
	function StepImageValidate($step) {
		var has_error = false,
		    Image_RE = /\.(gif|jpe?g|png)$/i;
	
		// Проверяем блоки с изображениями
		$step.find('.with-images').each(function () {
			var $this = (0, _jquery2.default)(this),
			    images_count = 0;
			// Скрытые блоки нас не интересуют
			if ('none' == $this.css('display')) {
				$this.removeClass('no-images');
				return;
			}
			// Блоки в скрытых блоках тоже не интересуют
			if ('none' == $this.parents('.form-wrapper[data-drupal-states]').first().css('display')) {
				$this.removeClass('no-images');
				return;
			}
			// Обходим поля формы для загрузки файлов
			$this.find('input[type="file"]').each(function () {
				var i = 0,
				    l = 0;
				if ('undefined' === typeof this['files']) {
					return;
				}
				if (0 === (l = this.files.length)) {
					return;
				}
				for (i = 0; i < l; i++) {
					if (Image_RE.test(this.files[i].name)) {
						images_count += 1;
					}
				}
			});
			if (0 === images_count) {
				has_error = true;
				$this.addClass('no-images');
			} else {
				$this.removeClass('no-images');
			}
		});
	
		// Сообщаем о результате проверки
		return !has_error;
	}
	
	// Сообщение об ошибках
	function StepFailure() {
		var $errors = (0, _jquery2.default)('.validation-error:visible'),
		    pos = 0 < $errors.length ? $errors.first().offset() : { top: 0 };
		alert('Заполните обязательные поля!');
		(0, _jquery2.default)('body,html').animate({ scrollTop: Math.max(0, pos.top - 10) }, 500);
		return false;
	}
	
	// Сообщение об отсутствующих изображениях
	function StepImageFailure() {
		var $images = (0, _jquery2.default)('.with-images.no-images:visible'),
		    pos = 0 < $images.length ? $images.first().offset() : { top: 0 };
		alert('Загрузите хотя бы одно изображение!');
		(0, _jquery2.default)('body,html').animate({ scrollTop: Math.max(0, pos.top - 10) }, 500);
		return false;
	}
	
	// Пометка поля
	function MarkupErrorField(field, add_class) {
		var elem = field[0],
		    tag = elem.tagName,
		    type = elem.type,
		    id = elem.id,
		    obj = [];
	
		if ('undefined' == typeof add_class) {
			add_class = true;
		}
	
		if ('SELECT' == tag) {
			obj = field.parent().find('.cs-placeholder');
		} else if ('INPUT' == tag && 'checkbox' == type) {
			obj = field.siblings('label[for="' + id + '"]');
		} else {
			obj = field;
		}
		if (add_class == true) {
			obj.addClass('validation-error');
		} else {
			obj.removeClass('validation-error');
		}
	}
	
	window.CustomForm = function (obj) {
		this.process(obj);
	};
	
	window.CustomForm.prototype.form = null;
	window.CustomForm.prototype.action = null;
	window.CustomForm.prototype.list = null;
	window.CustomForm.prototype.type = null;
	window.CustomForm.prototype.items = [];
	
	window.CustomForm.prototype.process = function (obj) {
		var CF = this;
	
		CF.form = obj;
		CF.list = CF.form.find('.list');
		CF.action = CF.list.data('action');
		CF.type = CF.list.data('type');
		CF.items = [];
		CF.list.find('.b-defect-list__item').each(function () {
			CF.events((0, _jquery2.default)(this).find('.b-defect-list__delete'), "click", CF.delete);
			CF.events((0, _jquery2.default)(this).find('.b-defect-list__edit'), "click", CF.edit);
			CF.items.push((0, _jquery2.default)(this));
		});
		CF.events(CF.form.find('.add-btn'), "click", CF.add);
	
		obj.addClass('custom-form_processed');
	};
	
	window.CustomForm.prototype.edit = function (CF, el) {
		CF.form.find('[data-id=' + el.parent().data('id') + ']').find('input').click();
	};
	
	window.CustomForm.prototype.delete = function (CF, el) {
		CF.form.find('[data-id=' + el.parent().data('id') + ']').remove();
	};
	
	window.CustomForm.prototype.add = function (CF, el) {
		var AddEl = CF.form.find('.clone').clone();
	
		CF.items.push(AddEl);
		CF.events(AddEl.find('.b-defect-list__delete'), "click", CF.delete);
		CF.events(AddEl.find('.b-defect-list__edit'), "click", CF.edit);
		AddEl.attr('data-id', CF.items.length);
		AddEl.removeClass('clone');
		AddEl.find("input").attr('name', AddEl.find("input").attr('name') + "[" + CF.items.length + "]").change(function () {
			var input = this,
			    reader = null,
			    $image = (0, _jquery2.default)('.b-defect-list__title img', AddEl);
			if (input.files && 0 < input.files.length) {
				if (!/\.(gif|jpe?g|png)$/i.test(input.files[0].name)) {
					return alert('Выберите файл изображения');
				}
				if (window['FileReader']) {
					reader = new FileReader();
					reader.onload = function (e) {
						$image.attr('src', e.target.result);
					};
					reader.readAsDataURL(input.files[0]);
				}
			}
			CF.list.append(AddEl);
		});
		AddEl.find("input").click();
	};
	
	window.CustomForm.prototype.refresh = function () {};
	
	window.CustomForm.prototype.events = function (El, EventType, Callback) {
		var CF = this;
	
		switch (EventType) {
			case 'click':
				El.on('click', function () {
					Callback(CF, (0, _jquery2.default)(this));
				});
				break;
		}
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/*!
	* jquery.inputmask.bundle.js
	* https://github.com/RobinHerbots/jquery.inputmask
	* Copyright (c) 2010 - 2016 Robin Herbots
	* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
	* Version: 3.3.3
	*/
	!function($) {
	    function Inputmask(alias, options) {
	        return this instanceof Inputmask ? ($.isPlainObject(alias) ? options = alias : (options = options || {}, 
	        options.alias = alias), this.el = void 0, this.opts = $.extend(!0, {}, this.defaults, options), 
	        this.noMasksCache = options && void 0 !== options.definitions, this.userOptions = options || {}, 
	        this.events = {}, void resolveAlias(this.opts.alias, options, this.opts)) : new Inputmask(alias, options);
	    }
	    function isInputEventSupported(eventName) {
	        var el = document.createElement("input"), evName = "on" + eventName, isSupported = evName in el;
	        return isSupported || (el.setAttribute(evName, "return;"), isSupported = "function" == typeof el[evName]), 
	        el = null, isSupported;
	    }
	    function isElementTypeSupported(input, opts) {
	        var elementType = input.getAttribute("type"), isSupported = "INPUT" === input.tagName && $.inArray(elementType, opts.supportsInputType) !== -1 || input.isContentEditable || "TEXTAREA" === input.tagName;
	        if (!isSupported && "INPUT" === input.tagName) {
	            var el = document.createElement("input");
	            el.setAttribute("type", elementType), isSupported = "text" === el.type, el = null;
	        }
	        return isSupported;
	    }
	    function resolveAlias(aliasStr, options, opts) {
	        var aliasDefinition = opts.aliases[aliasStr];
	        return aliasDefinition ? (aliasDefinition.alias && resolveAlias(aliasDefinition.alias, void 0, opts), 
	        $.extend(!0, opts, aliasDefinition), $.extend(!0, opts, options), !0) : (null === opts.mask && (opts.mask = aliasStr), 
	        !1);
	    }
	    function importAttributeOptions(npt, opts, userOptions) {
	        function importOption(option, optionData) {
	            optionData = void 0 !== optionData ? optionData : npt.getAttribute("data-inputmask-" + option), 
	            null !== optionData && ("string" == typeof optionData && (0 === option.indexOf("on") ? optionData = window[optionData] : "false" === optionData ? optionData = !1 : "true" === optionData && (optionData = !0)), 
	            userOptions[option] = optionData);
	        }
	        var option, dataoptions, optionData, p, attrOptions = npt.getAttribute("data-inputmask");
	        if (attrOptions && "" !== attrOptions && (attrOptions = attrOptions.replace(new RegExp("'", "g"), '"'), 
	        dataoptions = JSON.parse("{" + attrOptions + "}")), dataoptions) {
	            optionData = void 0;
	            for (p in dataoptions) if ("alias" === p.toLowerCase()) {
	                optionData = dataoptions[p];
	                break;
	            }
	        }
	        importOption("alias", optionData), userOptions.alias && resolveAlias(userOptions.alias, userOptions, opts);
	        for (option in opts) {
	            if (dataoptions) {
	                optionData = void 0;
	                for (p in dataoptions) if (p.toLowerCase() === option.toLowerCase()) {
	                    optionData = dataoptions[p];
	                    break;
	                }
	            }
	            importOption(option, optionData);
	        }
	        return $.extend(!0, opts, userOptions), opts;
	    }
	    function generateMaskSet(opts, nocache) {
	        function analyseMask(mask) {
	            function MaskToken(isGroup, isOptional, isQuantifier, isAlternator) {
	                this.matches = [], this.isGroup = isGroup || !1, this.isOptional = isOptional || !1, 
	                this.isQuantifier = isQuantifier || !1, this.isAlternator = isAlternator || !1, 
	                this.quantifier = {
	                    min: 1,
	                    max: 1
	                };
	            }
	            function insertTestDefinition(mtoken, element, position) {
	                var maskdef = opts.definitions[element];
	                position = void 0 !== position ? position : mtoken.matches.length;
	                var prevMatch = mtoken.matches[position - 1];
	                if (maskdef && !escaped) {
	                    maskdef.placeholder = $.isFunction(maskdef.placeholder) ? maskdef.placeholder(opts) : maskdef.placeholder;
	                    for (var prevalidators = maskdef.prevalidator, prevalidatorsL = prevalidators ? prevalidators.length : 0, i = 1; i < maskdef.cardinality; i++) {
	                        var prevalidator = prevalidatorsL >= i ? prevalidators[i - 1] : [], validator = prevalidator.validator, cardinality = prevalidator.cardinality;
	                        mtoken.matches.splice(position++, 0, {
	                            fn: validator ? "string" == typeof validator ? new RegExp(validator) : new function() {
	                                this.test = validator;
	                            }() : new RegExp("."),
	                            cardinality: cardinality ? cardinality : 1,
	                            optionality: mtoken.isOptional,
	                            newBlockMarker: void 0 === prevMatch || prevMatch.def !== (maskdef.definitionSymbol || element),
	                            casing: maskdef.casing,
	                            def: maskdef.definitionSymbol || element,
	                            placeholder: maskdef.placeholder,
	                            mask: element
	                        }), prevMatch = mtoken.matches[position - 1];
	                    }
	                    mtoken.matches.splice(position++, 0, {
	                        fn: maskdef.validator ? "string" == typeof maskdef.validator ? new RegExp(maskdef.validator) : new function() {
	                            this.test = maskdef.validator;
	                        }() : new RegExp("."),
	                        cardinality: maskdef.cardinality,
	                        optionality: mtoken.isOptional,
	                        newBlockMarker: void 0 === prevMatch || prevMatch.def !== (maskdef.definitionSymbol || element),
	                        casing: maskdef.casing,
	                        def: maskdef.definitionSymbol || element,
	                        placeholder: maskdef.placeholder,
	                        mask: element
	                    });
	                } else mtoken.matches.splice(position++, 0, {
	                    fn: null,
	                    cardinality: 0,
	                    optionality: mtoken.isOptional,
	                    newBlockMarker: void 0 === prevMatch || prevMatch.def !== element,
	                    casing: null,
	                    def: opts.staticDefinitionSymbol || element,
	                    placeholder: void 0 !== opts.staticDefinitionSymbol ? element : void 0,
	                    mask: element
	                }), escaped = !1;
	            }
	            function verifyGroupMarker(lastMatch, isOpenGroup) {
	                lastMatch.isGroup && (lastMatch.isGroup = !1, insertTestDefinition(lastMatch, opts.groupmarker.start, 0), 
	                isOpenGroup !== !0 && insertTestDefinition(lastMatch, opts.groupmarker.end));
	            }
	            function maskCurrentToken(m, currentToken, lastMatch, extraCondition) {
	                currentToken.matches.length > 0 && (void 0 === extraCondition || extraCondition) && (lastMatch = currentToken.matches[currentToken.matches.length - 1], 
	                verifyGroupMarker(lastMatch)), insertTestDefinition(currentToken, m);
	            }
	            function defaultCase() {
	                if (openenings.length > 0) {
	                    if (currentOpeningToken = openenings[openenings.length - 1], maskCurrentToken(m, currentOpeningToken, lastMatch, !currentOpeningToken.isAlternator), 
	                    currentOpeningToken.isAlternator) {
	                        alternator = openenings.pop();
	                        for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
	                        openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1], 
	                        currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
	                    }
	                } else maskCurrentToken(m, currentToken, lastMatch);
	            }
	            function reverseTokens(maskToken) {
	                function reverseStatic(st) {
	                    return st === opts.optionalmarker.start ? st = opts.optionalmarker.end : st === opts.optionalmarker.end ? st = opts.optionalmarker.start : st === opts.groupmarker.start ? st = opts.groupmarker.end : st === opts.groupmarker.end && (st = opts.groupmarker.start), 
	                    st;
	                }
	                maskToken.matches = maskToken.matches.reverse();
	                for (var match in maskToken.matches) {
	                    var intMatch = parseInt(match);
	                    if (maskToken.matches[match].isQuantifier && maskToken.matches[intMatch + 1] && maskToken.matches[intMatch + 1].isGroup) {
	                        var qt = maskToken.matches[match];
	                        maskToken.matches.splice(match, 1), maskToken.matches.splice(intMatch + 1, 0, qt);
	                    }
	                    void 0 !== maskToken.matches[match].matches ? maskToken.matches[match] = reverseTokens(maskToken.matches[match]) : maskToken.matches[match] = reverseStatic(maskToken.matches[match]);
	                }
	                return maskToken;
	            }
	            for (var match, m, openingToken, currentOpeningToken, alternator, lastMatch, groupToken, tokenizer = /(?:[?*+]|\{[0-9\+\*]+(?:,[0-9\+\*]*)?\})|[^.?*+^${[]()|\\]+|./g, escaped = !1, currentToken = new MaskToken(), openenings = [], maskTokens = []; match = tokenizer.exec(mask); ) if (m = match[0], 
	            escaped) defaultCase(); else switch (m.charAt(0)) {
	              case opts.escapeChar:
	                escaped = !0;
	                break;
	
	              case opts.optionalmarker.end:
	              case opts.groupmarker.end:
	                if (openingToken = openenings.pop(), void 0 !== openingToken) if (openenings.length > 0) {
	                    if (currentOpeningToken = openenings[openenings.length - 1], currentOpeningToken.matches.push(openingToken), 
	                    currentOpeningToken.isAlternator) {
	                        alternator = openenings.pop();
	                        for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
	                        openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1], 
	                        currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
	                    }
	                } else currentToken.matches.push(openingToken); else defaultCase();
	                break;
	
	              case opts.optionalmarker.start:
	                openenings.push(new MaskToken((!1), (!0)));
	                break;
	
	              case opts.groupmarker.start:
	                openenings.push(new MaskToken((!0)));
	                break;
	
	              case opts.quantifiermarker.start:
	                var quantifier = new MaskToken((!1), (!1), (!0));
	                m = m.replace(/[{}]/g, "");
	                var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
	                if ("*" !== mq1 && "+" !== mq1 || (mq0 = "*" === mq1 ? 0 : 1), quantifier.quantifier = {
	                    min: mq0,
	                    max: mq1
	                }, openenings.length > 0) {
	                    var matches = openenings[openenings.length - 1].matches;
	                    match = matches.pop(), match.isGroup || (groupToken = new MaskToken((!0)), groupToken.matches.push(match), 
	                    match = groupToken), matches.push(match), matches.push(quantifier);
	                } else match = currentToken.matches.pop(), match.isGroup || (groupToken = new MaskToken((!0)), 
	                groupToken.matches.push(match), match = groupToken), currentToken.matches.push(match), 
	                currentToken.matches.push(quantifier);
	                break;
	
	              case opts.alternatormarker:
	                openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1], 
	                lastMatch = currentOpeningToken.matches.pop()) : lastMatch = currentToken.matches.pop(), 
	                lastMatch.isAlternator ? openenings.push(lastMatch) : (alternator = new MaskToken((!1), (!1), (!1), (!0)), 
	                alternator.matches.push(lastMatch), openenings.push(alternator));
	                break;
	
	              default:
	                defaultCase();
	            }
	            for (;openenings.length > 0; ) openingToken = openenings.pop(), verifyGroupMarker(openingToken, !0), 
	            currentToken.matches.push(openingToken);
	            return currentToken.matches.length > 0 && (lastMatch = currentToken.matches[currentToken.matches.length - 1], 
	            verifyGroupMarker(lastMatch), maskTokens.push(currentToken)), opts.numericInput && reverseTokens(maskTokens[0]), 
	            maskTokens;
	        }
	        function generateMask(mask, metadata) {
	            if (null !== mask && "" !== mask) {
	                if (1 === mask.length && opts.greedy === !1 && 0 !== opts.repeat && (opts.placeholder = ""), 
	                opts.repeat > 0 || "*" === opts.repeat || "+" === opts.repeat) {
	                    var repeatStart = "*" === opts.repeat ? 0 : "+" === opts.repeat ? 1 : opts.repeat;
	                    mask = opts.groupmarker.start + mask + opts.groupmarker.end + opts.quantifiermarker.start + repeatStart + "," + opts.repeat + opts.quantifiermarker.end;
	                }
	                var masksetDefinition;
	                return void 0 === Inputmask.prototype.masksCache[mask] || nocache === !0 ? (masksetDefinition = {
	                    mask: mask,
	                    maskToken: analyseMask(mask),
	                    validPositions: {},
	                    _buffer: void 0,
	                    buffer: void 0,
	                    tests: {},
	                    metadata: metadata,
	                    maskLength: void 0
	                }, nocache !== !0 && (Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask] = masksetDefinition, 
	                masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask]))) : masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask]), 
	                masksetDefinition;
	            }
	        }
	        function preProcessMask(mask) {
	            return mask = mask.toString();
	        }
	        var ms;
	        if ($.isFunction(opts.mask) && (opts.mask = opts.mask(opts)), $.isArray(opts.mask)) {
	            if (opts.mask.length > 1) {
	                opts.keepStatic = null === opts.keepStatic || opts.keepStatic;
	                var altMask = "(";
	                return $.each(opts.numericInput ? opts.mask.reverse() : opts.mask, function(ndx, msk) {
	                    altMask.length > 1 && (altMask += ")|("), altMask += preProcessMask(void 0 === msk.mask || $.isFunction(msk.mask) ? msk : msk.mask);
	                }), altMask += ")", generateMask(altMask, opts.mask);
	            }
	            opts.mask = opts.mask.pop();
	        }
	        return opts.mask && (ms = void 0 === opts.mask.mask || $.isFunction(opts.mask.mask) ? generateMask(preProcessMask(opts.mask), opts.mask) : generateMask(preProcessMask(opts.mask.mask), opts.mask)), 
	        ms;
	    }
	    function maskScope(actionObj, maskset, opts) {
	        function getMaskTemplate(baseOnInput, minimalPos, includeInput) {
	            minimalPos = minimalPos || 0;
	            var ndxIntlzr, test, testPos, maskTemplate = [], pos = 0, lvp = getLastValidPosition();
	            maxLength = void 0 !== el ? el.maxLength : void 0, maxLength === -1 && (maxLength = void 0);
	            do {
	                if (baseOnInput === !0 && getMaskSet().validPositions[pos]) {
	                    var validPos = getMaskSet().validPositions[pos];
	                    test = validPos.match, ndxIntlzr = validPos.locator.slice(), maskTemplate.push(includeInput === !0 ? validPos.input : getPlaceholder(pos, test));
	                } else testPos = getTestTemplate(pos, ndxIntlzr, pos - 1), test = testPos.match, 
	                ndxIntlzr = testPos.locator.slice(), (opts.jitMasking === !1 || pos < lvp || isFinite(opts.jitMasking) && opts.jitMasking > pos) && maskTemplate.push(getPlaceholder(pos, test));
	                pos++;
	            } while ((void 0 === maxLength || pos < maxLength) && (null !== test.fn || "" !== test.def) || minimalPos > pos);
	            return "" === maskTemplate[maskTemplate.length - 1] && maskTemplate.pop(), getMaskSet().maskLength = pos + 1, 
	            maskTemplate;
	        }
	        function getMaskSet() {
	            return maskset;
	        }
	        function resetMaskSet(soft) {
	            var maskset = getMaskSet();
	            maskset.buffer = void 0, soft !== !0 && (maskset._buffer = void 0, maskset.validPositions = {}, 
	            maskset.p = 0);
	        }
	        function getLastValidPosition(closestTo, strict, validPositions) {
	            var before = -1, after = -1, valids = validPositions || getMaskSet().validPositions;
	            void 0 === closestTo && (closestTo = -1);
	            for (var posNdx in valids) {
	                var psNdx = parseInt(posNdx);
	                valids[psNdx] && (strict || null !== valids[psNdx].match.fn) && (psNdx <= closestTo && (before = psNdx), 
	                psNdx >= closestTo && (after = psNdx));
	            }
	            return before !== -1 && closestTo - before > 1 || after < closestTo ? before : after;
	        }
	        function stripValidPositions(start, end, nocheck, strict) {
	            function IsEnclosedStatic(pos) {
	                var posMatch = getMaskSet().validPositions[pos];
	                if (void 0 !== posMatch && null === posMatch.match.fn) {
	                    var prevMatch = getMaskSet().validPositions[pos - 1], nextMatch = getMaskSet().validPositions[pos + 1];
	                    return void 0 !== prevMatch && void 0 !== nextMatch;
	                }
	                return !1;
	            }
	            var i, startPos = start, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), needsValidation = !1;
	            for (getMaskSet().p = start, i = end - 1; i >= startPos; i--) void 0 !== getMaskSet().validPositions[i] && (nocheck === !0 || !IsEnclosedStatic(i) && opts.canClearPosition(getMaskSet(), i, getLastValidPosition(), strict, opts) !== !1) && delete getMaskSet().validPositions[i];
	            for (resetMaskSet(!0), i = startPos + 1; i <= getLastValidPosition(); ) {
	                for (;void 0 !== getMaskSet().validPositions[startPos]; ) startPos++;
	                var s = getMaskSet().validPositions[startPos];
	                if (i < startPos && (i = startPos + 1), void 0 === getMaskSet().validPositions[i] && isMask(i) || void 0 !== s) i++; else {
	                    var t = getTestTemplate(i);
	                    needsValidation === !1 && positionsClone[startPos] && positionsClone[startPos].match.def === t.match.def ? (getMaskSet().validPositions[startPos] = $.extend(!0, {}, positionsClone[startPos]), 
	                    getMaskSet().validPositions[startPos].input = t.input, delete getMaskSet().validPositions[i], 
	                    i++) : positionCanMatchDefinition(startPos, t.match.def) ? isValid(startPos, t.input || getPlaceholder(i), !0) !== !1 && (delete getMaskSet().validPositions[i], 
	                    i++, needsValidation = !0) : isMask(i) || (i++, startPos--), startPos++;
	                }
	            }
	            resetMaskSet(!0);
	        }
	        function determineTestTemplate(tests, guessNextBest) {
	            for (var testPos, testPositions = tests, lvp = getLastValidPosition(), lvTest = getMaskSet().validPositions[lvp] || getTests(0)[0], lvTestAltArr = void 0 !== lvTest.alternation ? lvTest.locator[lvTest.alternation].toString().split(",") : [], ndx = 0; ndx < testPositions.length && (testPos = testPositions[ndx], 
	            !(testPos.match && (opts.greedy && testPos.match.optionalQuantifier !== !0 || (testPos.match.optionality === !1 || testPos.match.newBlockMarker === !1) && testPos.match.optionalQuantifier !== !0) && (void 0 === lvTest.alternation || lvTest.alternation !== testPos.alternation || void 0 !== testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAltArr))) || guessNextBest === !0 && (null !== testPos.match.fn || /[0-9a-bA-Z]/.test(testPos.match.def))); ndx++) ;
	            return testPos;
	        }
	        function getTestTemplate(pos, ndxIntlzr, tstPs) {
	            return getMaskSet().validPositions[pos] || determineTestTemplate(getTests(pos, ndxIntlzr ? ndxIntlzr.slice() : ndxIntlzr, tstPs));
	        }
	        function getTest(pos) {
	            return getMaskSet().validPositions[pos] ? getMaskSet().validPositions[pos] : getTests(pos)[0];
	        }
	        function positionCanMatchDefinition(pos, def) {
	            for (var valid = !1, tests = getTests(pos), tndx = 0; tndx < tests.length; tndx++) if (tests[tndx].match && tests[tndx].match.def === def) {
	                valid = !0;
	                break;
	            }
	            return valid;
	        }
	        function selectBestMatch(pos, alternateNdx) {
	            var bestMatch, indexPos;
	            return (getMaskSet().tests[pos] || getMaskSet().validPositions[pos]) && $.each(getMaskSet().tests[pos] || [ getMaskSet().validPositions[pos] ], function(ndx, lmnt) {
	                var ndxPos = lmnt.alternation ? lmnt.locator[lmnt.alternation].toString().indexOf(alternateNdx) : -1;
	                (void 0 === indexPos || ndxPos < indexPos) && ndxPos !== -1 && (bestMatch = lmnt, 
	                indexPos = ndxPos);
	            }), bestMatch;
	        }
	        function getTests(pos, ndxIntlzr, tstPs) {
	            function resolveTestFromToken(maskToken, ndxInitializer, loopNdx, quantifierRecurse) {
	                function handleMatch(match, loopNdx, quantifierRecurse) {
	                    function isFirstMatch(latestMatch, tokenGroup) {
	                        var firstMatch = 0 === $.inArray(latestMatch, tokenGroup.matches);
	                        return firstMatch || $.each(tokenGroup.matches, function(ndx, match) {
	                            if (match.isQuantifier === !0 && (firstMatch = isFirstMatch(latestMatch, tokenGroup.matches[ndx - 1]))) return !1;
	                        }), firstMatch;
	                    }
	                    function resolveNdxInitializer(pos, alternateNdx) {
	                        var bestMatch = selectBestMatch(pos, alternateNdx);
	                        return bestMatch ? bestMatch.locator.slice(bestMatch.alternation + 1) : void 0;
	                    }
	                    function staticCanMatchDefinition(source, target) {
	                        return null === source.match.fn && null !== target.match.fn && target.match.fn.test(source.match.def, getMaskSet(), pos, !1, opts, !1);
	                    }
	                    if (testPos > 1e4) throw "Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. " + getMaskSet().mask;
	                    if (testPos === pos && void 0 === match.matches) return matches.push({
	                        match: match,
	                        locator: loopNdx.reverse(),
	                        cd: cacheDependency
	                    }), !0;
	                    if (void 0 !== match.matches) {
	                        if (match.isGroup && quantifierRecurse !== match) {
	                            if (match = handleMatch(maskToken.matches[$.inArray(match, maskToken.matches) + 1], loopNdx)) return !0;
	                        } else if (match.isOptional) {
	                            var optionalToken = match;
	                            if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) {
	                                if (latestMatch = matches[matches.length - 1].match, !isFirstMatch(latestMatch, optionalToken)) return !0;
	                                insertStop = !0, testPos = pos;
	                            }
	                        } else if (match.isAlternator) {
	                            var maltMatches, alternateToken = match, malternateMatches = [], currentMatches = matches.slice(), loopNdxCnt = loopNdx.length, altIndex = ndxInitializer.length > 0 ? ndxInitializer.shift() : -1;
	                            if (altIndex === -1 || "string" == typeof altIndex) {
	                                var amndx, currentPos = testPos, ndxInitializerClone = ndxInitializer.slice(), altIndexArr = [];
	                                if ("string" == typeof altIndex) altIndexArr = altIndex.split(","); else for (amndx = 0; amndx < alternateToken.matches.length; amndx++) altIndexArr.push(amndx);
	                                for (var ndx = 0; ndx < altIndexArr.length; ndx++) {
	                                    if (amndx = parseInt(altIndexArr[ndx]), matches = [], ndxInitializer = resolveNdxInitializer(testPos, amndx) || ndxInitializerClone.slice(), 
	                                    match = handleMatch(alternateToken.matches[amndx] || maskToken.matches[amndx], [ amndx ].concat(loopNdx), quantifierRecurse) || match, 
	                                    match !== !0 && void 0 !== match && altIndexArr[altIndexArr.length - 1] < alternateToken.matches.length) {
	                                        var ntndx = $.inArray(match, maskToken.matches) + 1;
	                                        maskToken.matches.length > ntndx && (match = handleMatch(maskToken.matches[ntndx], [ ntndx ].concat(loopNdx.slice(1, loopNdx.length)), quantifierRecurse), 
	                                        match && (altIndexArr.push(ntndx.toString()), $.each(matches, function(ndx, lmnt) {
	                                            lmnt.alternation = loopNdx.length - 1;
	                                        })));
	                                    }
	                                    maltMatches = matches.slice(), testPos = currentPos, matches = [];
	                                    for (var ndx1 = 0; ndx1 < maltMatches.length; ndx1++) {
	                                        var altMatch = maltMatches[ndx1], hasMatch = !1;
	                                        altMatch.alternation = altMatch.alternation || loopNdxCnt;
	                                        for (var ndx2 = 0; ndx2 < malternateMatches.length; ndx2++) {
	                                            var altMatch2 = malternateMatches[ndx2];
	                                            if (("string" != typeof altIndex || $.inArray(altMatch.locator[altMatch.alternation].toString(), altIndexArr) !== -1) && (altMatch.match.def === altMatch2.match.def || staticCanMatchDefinition(altMatch, altMatch2))) {
	                                                hasMatch = altMatch.match.mask === altMatch2.match.mask, altMatch2.locator[altMatch.alternation].toString().indexOf(altMatch.locator[altMatch.alternation]) === -1 && (altMatch2.locator[altMatch.alternation] = altMatch2.locator[altMatch.alternation] + "," + altMatch.locator[altMatch.alternation], 
	                                                altMatch2.alternation = altMatch.alternation, null == altMatch.match.fn && (altMatch2.na = altMatch2.na || altMatch.locator[altMatch.alternation].toString(), 
	                                                altMatch2.na.indexOf(altMatch.locator[altMatch.alternation]) === -1 && (altMatch2.na = altMatch2.na + "," + altMatch.locator[altMatch.alternation])));
	                                                break;
	                                            }
	                                        }
	                                        hasMatch || malternateMatches.push(altMatch);
	                                    }
	                                }
	                                "string" == typeof altIndex && (malternateMatches = $.map(malternateMatches, function(lmnt, ndx) {
	                                    if (isFinite(ndx)) {
	                                        var mamatch, alternation = lmnt.alternation, altLocArr = lmnt.locator[alternation].toString().split(",");
	                                        lmnt.locator[alternation] = void 0, lmnt.alternation = void 0;
	                                        for (var alndx = 0; alndx < altLocArr.length; alndx++) mamatch = $.inArray(altLocArr[alndx], altIndexArr) !== -1, 
	                                        mamatch && (void 0 !== lmnt.locator[alternation] ? (lmnt.locator[alternation] += ",", 
	                                        lmnt.locator[alternation] += altLocArr[alndx]) : lmnt.locator[alternation] = parseInt(altLocArr[alndx]), 
	                                        lmnt.alternation = alternation);
	                                        if (void 0 !== lmnt.locator[alternation]) return lmnt;
	                                    }
	                                })), matches = currentMatches.concat(malternateMatches), testPos = pos, insertStop = matches.length > 0, 
	                                ndxInitializer = ndxInitializerClone.slice();
	                            } else match = handleMatch(alternateToken.matches[altIndex] || maskToken.matches[altIndex], [ altIndex ].concat(loopNdx), quantifierRecurse);
	                            if (match) return !0;
	                        } else if (match.isQuantifier && quantifierRecurse !== maskToken.matches[$.inArray(match, maskToken.matches) - 1]) for (var qt = match, qndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; qndx < (isNaN(qt.quantifier.max) ? qndx + 1 : qt.quantifier.max) && testPos <= pos; qndx++) {
	                            var tokenGroup = maskToken.matches[$.inArray(qt, maskToken.matches) - 1];
	                            if (match = handleMatch(tokenGroup, [ qndx ].concat(loopNdx), tokenGroup)) {
	                                if (latestMatch = matches[matches.length - 1].match, latestMatch.optionalQuantifier = qndx > qt.quantifier.min - 1, 
	                                isFirstMatch(latestMatch, tokenGroup)) {
	                                    if (qndx > qt.quantifier.min - 1) {
	                                        insertStop = !0, testPos = pos;
	                                        break;
	                                    }
	                                    return !0;
	                                }
	                                return !0;
	                            }
	                        } else if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) return !0;
	                    } else testPos++;
	                }
	                for (var tndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; tndx < maskToken.matches.length; tndx++) if (maskToken.matches[tndx].isQuantifier !== !0) {
	                    var match = handleMatch(maskToken.matches[tndx], [ tndx ].concat(loopNdx), quantifierRecurse);
	                    if (match && testPos === pos) return match;
	                    if (testPos > pos) break;
	                }
	            }
	            function mergeLocators(tests) {
	                var locator = [];
	                return $.isArray(tests) || (tests = [ tests ]), tests.length > 0 && (void 0 === tests[0].alternation ? (locator = determineTestTemplate(tests.slice()).locator.slice(), 
	                0 === locator.length && (locator = tests[0].locator.slice())) : $.each(tests, function(ndx, tst) {
	                    if ("" !== tst.def) if (0 === locator.length) locator = tst.locator.slice(); else for (var i = 0; i < locator.length; i++) tst.locator[i] && locator[i].toString().indexOf(tst.locator[i]) === -1 && (locator[i] += "," + tst.locator[i]);
	                })), locator;
	            }
	            function filterTests(tests) {
	                return opts.keepStatic && pos > 0 && tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0) && tests[0].match.optionality !== !0 && tests[0].match.optionalQuantifier !== !0 && null === tests[0].match.fn && !/[0-9a-bA-Z]/.test(tests[0].match.def) ? [ determineTestTemplate(tests) ] : tests;
	            }
	            var latestMatch, maskTokens = getMaskSet().maskToken, testPos = ndxIntlzr ? tstPs : 0, ndxInitializer = ndxIntlzr ? ndxIntlzr.slice() : [ 0 ], matches = [], insertStop = !1, cacheDependency = ndxIntlzr ? ndxIntlzr.join("") : "";
	            if (pos > -1) {
	                if (void 0 === ndxIntlzr) {
	                    for (var test, previousPos = pos - 1; void 0 === (test = getMaskSet().validPositions[previousPos] || getMaskSet().tests[previousPos]) && previousPos > -1; ) previousPos--;
	                    void 0 !== test && previousPos > -1 && (ndxInitializer = mergeLocators(test), cacheDependency = ndxInitializer.join(""), 
	                    testPos = previousPos);
	                }
	                if (getMaskSet().tests[pos] && getMaskSet().tests[pos][0].cd === cacheDependency) return filterTests(getMaskSet().tests[pos]);
	                for (var mtndx = ndxInitializer.shift(); mtndx < maskTokens.length; mtndx++) {
	                    var match = resolveTestFromToken(maskTokens[mtndx], ndxInitializer, [ mtndx ]);
	                    if (match && testPos === pos || testPos > pos) break;
	                }
	            }
	            return (0 === matches.length || insertStop) && matches.push({
	                match: {
	                    fn: null,
	                    cardinality: 0,
	                    optionality: !0,
	                    casing: null,
	                    def: "",
	                    placeholder: ""
	                },
	                locator: [],
	                cd: cacheDependency
	            }), void 0 !== ndxIntlzr && getMaskSet().tests[pos] ? filterTests($.extend(!0, [], matches)) : (getMaskSet().tests[pos] = $.extend(!0, [], matches), 
	            filterTests(getMaskSet().tests[pos]));
	        }
	        function getBufferTemplate() {
	            return void 0 === getMaskSet()._buffer && (getMaskSet()._buffer = getMaskTemplate(!1, 1), 
	            void 0 === getMaskSet().buffer && getMaskSet()._buffer.slice()), getMaskSet()._buffer;
	        }
	        function getBuffer(noCache) {
	            return void 0 !== getMaskSet().buffer && noCache !== !0 || (getMaskSet().buffer = getMaskTemplate(!0, getLastValidPosition(), !0)), 
	            getMaskSet().buffer;
	        }
	        function refreshFromBuffer(start, end, buffer) {
	            var i;
	            if (start === !0) resetMaskSet(), start = 0, end = buffer.length; else for (i = start; i < end; i++) delete getMaskSet().validPositions[i];
	            for (i = start; i < end; i++) resetMaskSet(!0), buffer[i] !== opts.skipOptionalPartCharacter && isValid(i, buffer[i], !0, !0);
	        }
	        function casing(elem, test, pos) {
	            switch (opts.casing || test.casing) {
	              case "upper":
	                elem = elem.toUpperCase();
	                break;
	
	              case "lower":
	                elem = elem.toLowerCase();
	                break;
	
	              case "title":
	                var posBefore = getMaskSet().validPositions[pos - 1];
	                elem = 0 === pos || posBefore && posBefore.input === String.fromCharCode(Inputmask.keyCode.SPACE) ? elem.toUpperCase() : elem.toLowerCase();
	            }
	            return elem;
	        }
	        function checkAlternationMatch(altArr1, altArr2) {
	            for (var altArrC = opts.greedy ? altArr2 : altArr2.slice(0, 1), isMatch = !1, alndx = 0; alndx < altArr1.length; alndx++) if ($.inArray(altArr1[alndx], altArrC) !== -1) {
	                isMatch = !0;
	                break;
	            }
	            return isMatch;
	        }
	        function isValid(pos, c, strict, fromSetValid, fromAlternate) {
	            function isSelection(posObj) {
	                return isRTL ? posObj.begin - posObj.end > 1 || posObj.begin - posObj.end === 1 && opts.insertMode : posObj.end - posObj.begin > 1 || posObj.end - posObj.begin === 1 && opts.insertMode;
	            }
	            function _isValid(position, c, strict) {
	                var rslt = !1;
	                return $.each(getTests(position), function(ndx, tst) {
	                    for (var test = tst.match, loopend = c ? 1 : 0, chrs = "", i = test.cardinality; i > loopend; i--) chrs += getBufferElement(position - (i - 1));
	                    if (c && (chrs += c), getBuffer(!0), rslt = null != test.fn ? test.fn.test(chrs, getMaskSet(), position, strict, opts, isSelection(pos)) : (c === test.def || c === opts.skipOptionalPartCharacter) && "" !== test.def && {
	                        c: test.placeholder || test.def,
	                        pos: position
	                    }, rslt !== !1) {
	                        var elem = void 0 !== rslt.c ? rslt.c : c;
	                        elem = elem === opts.skipOptionalPartCharacter && null === test.fn ? test.placeholder || test.def : elem;
	                        var validatedPos = position, possibleModifiedBuffer = getBuffer();
	                        if (void 0 !== rslt.remove && ($.isArray(rslt.remove) || (rslt.remove = [ rslt.remove ]), 
	                        $.each(rslt.remove.sort(function(a, b) {
	                            return b - a;
	                        }), function(ndx, lmnt) {
	                            stripValidPositions(lmnt, lmnt + 1, !0);
	                        })), void 0 !== rslt.insert && ($.isArray(rslt.insert) || (rslt.insert = [ rslt.insert ]), 
	                        $.each(rslt.insert.sort(function(a, b) {
	                            return a - b;
	                        }), function(ndx, lmnt) {
	                            isValid(lmnt.pos, lmnt.c, !1, fromSetValid);
	                        })), rslt.refreshFromBuffer) {
	                            var refresh = rslt.refreshFromBuffer;
	                            if (strict = !0, refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, possibleModifiedBuffer), 
	                            void 0 === rslt.pos && void 0 === rslt.c) return rslt.pos = getLastValidPosition(), 
	                            !1;
	                            if (validatedPos = void 0 !== rslt.pos ? rslt.pos : position, validatedPos !== position) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0, fromSetValid)), 
	                            !1;
	                        } else if (rslt !== !0 && void 0 !== rslt.pos && rslt.pos !== position && (validatedPos = rslt.pos, 
	                        refreshFromBuffer(position, validatedPos, getBuffer().slice()), validatedPos !== position)) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0)), 
	                        !1;
	                        return (rslt === !0 || void 0 !== rslt.pos || void 0 !== rslt.c) && (ndx > 0 && resetMaskSet(!0), 
	                        setValidPosition(validatedPos, $.extend({}, tst, {
	                            input: casing(elem, test, validatedPos)
	                        }), fromSetValid, isSelection(pos)) || (rslt = !1), !1);
	                    }
	                }), rslt;
	            }
	            function alternate(pos, c, strict) {
	                var lastAlt, alternation, altPos, prevAltPos, i, validPos, altNdxs, decisionPos, validPsClone = $.extend(!0, {}, getMaskSet().validPositions), isValidRslt = !1, lAltPos = getLastValidPosition();
	                for (prevAltPos = getMaskSet().validPositions[lAltPos]; lAltPos >= 0; lAltPos--) if (altPos = getMaskSet().validPositions[lAltPos], 
	                altPos && void 0 !== altPos.alternation) {
	                    if (lastAlt = lAltPos, alternation = getMaskSet().validPositions[lastAlt].alternation, 
	                    prevAltPos.locator[altPos.alternation] !== altPos.locator[altPos.alternation]) break;
	                    prevAltPos = altPos;
	                }
	                if (void 0 !== alternation) {
	                    decisionPos = parseInt(lastAlt);
	                    var decisionTaker = void 0 !== prevAltPos.locator[prevAltPos.alternation || alternation] ? prevAltPos.locator[prevAltPos.alternation || alternation] : altNdxs[0];
	                    decisionTaker.length > 0 && (decisionTaker = decisionTaker.split(",")[0]);
	                    var possibilityPos = getMaskSet().validPositions[decisionPos], prevPos = getMaskSet().validPositions[decisionPos - 1];
	                    $.each(getTests(decisionPos, prevPos ? prevPos.locator : void 0, decisionPos - 1), function(ndx, test) {
	                        altNdxs = test.locator[alternation] ? test.locator[alternation].toString().split(",") : [];
	                        for (var mndx = 0; mndx < altNdxs.length; mndx++) {
	                            var validInputs = [], staticInputsBeforePos = 0, staticInputsBeforePosAlternate = 0, verifyValidInput = !1;
	                            if (decisionTaker < altNdxs[mndx] && (void 0 === test.na || $.inArray(altNdxs[mndx], test.na.split(",")) === -1)) {
	                                getMaskSet().validPositions[decisionPos] = $.extend(!0, {}, test);
	                                var possibilities = getMaskSet().validPositions[decisionPos].locator;
	                                for (getMaskSet().validPositions[decisionPos].locator[alternation] = parseInt(altNdxs[mndx]), 
	                                null == test.match.fn ? (possibilityPos.input !== test.match.def && (verifyValidInput = !0, 
	                                possibilityPos.generatedInput !== !0 && validInputs.push(possibilityPos.input)), 
	                                staticInputsBeforePosAlternate++, getMaskSet().validPositions[decisionPos].generatedInput = !/[0-9a-bA-Z]/.test(test.match.def), 
	                                getMaskSet().validPositions[decisionPos].input = test.match.def) : getMaskSet().validPositions[decisionPos].input = possibilityPos.input, 
	                                i = decisionPos + 1; i < getLastValidPosition(void 0, !0) + 1; i++) validPos = getMaskSet().validPositions[i], 
	                                validPos && validPos.generatedInput !== !0 && /[0-9a-bA-Z]/.test(validPos.input) ? validInputs.push(validPos.input) : i < pos && staticInputsBeforePos++, 
	                                delete getMaskSet().validPositions[i];
	                                for (verifyValidInput && validInputs[0] === test.match.def && validInputs.shift(), 
	                                resetMaskSet(!0), isValidRslt = !0; validInputs.length > 0; ) {
	                                    var input = validInputs.shift();
	                                    if (input !== opts.skipOptionalPartCharacter && !(isValidRslt = isValid(getLastValidPosition(void 0, !0) + 1, input, !1, fromSetValid, !0))) break;
	                                }
	                                if (isValidRslt) {
	                                    getMaskSet().validPositions[decisionPos].locator = possibilities;
	                                    var targetLvp = getLastValidPosition(pos) + 1;
	                                    for (i = decisionPos + 1; i < getLastValidPosition() + 1; i++) validPos = getMaskSet().validPositions[i], 
	                                    (void 0 === validPos || null == validPos.match.fn) && i < pos + (staticInputsBeforePosAlternate - staticInputsBeforePos) && staticInputsBeforePosAlternate++;
	                                    pos += staticInputsBeforePosAlternate - staticInputsBeforePos, isValidRslt = isValid(pos > targetLvp ? targetLvp : pos, c, strict, fromSetValid, !0);
	                                }
	                                if (isValidRslt) return !1;
	                                resetMaskSet(), getMaskSet().validPositions = $.extend(!0, {}, validPsClone);
	                            }
	                        }
	                    });
	                }
	                return isValidRslt;
	            }
	            function trackbackAlternations(originalPos, newPos) {
	                for (var vp = getMaskSet().validPositions[newPos], targetLocator = vp.locator, tll = targetLocator.length, ps = originalPos; ps < newPos; ps++) if (void 0 === getMaskSet().validPositions[ps] && !isMask(ps, !0)) {
	                    var tests = getTests(ps), bestMatch = tests[0], equality = -1;
	                    $.each(tests, function(ndx, tst) {
	                        for (var i = 0; i < tll && (void 0 !== tst.locator[i] && checkAlternationMatch(tst.locator[i].toString().split(","), targetLocator[i].toString().split(","))); i++) equality < i && (equality = i, 
	                        bestMatch = tst);
	                    }), setValidPosition(ps, $.extend({}, bestMatch, {
	                        input: bestMatch.match.placeholder || bestMatch.match.def
	                    }), !0);
	                }
	            }
	            function setValidPosition(pos, validTest, fromSetValid, isSelection) {
	                if (isSelection || opts.insertMode && void 0 !== getMaskSet().validPositions[pos] && void 0 === fromSetValid) {
	                    var i, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), lvp = getLastValidPosition();
	                    for (i = pos; i <= lvp; i++) delete getMaskSet().validPositions[i];
	                    getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
	                    var j, valid = !0, vps = getMaskSet().validPositions, needsValidation = !1, initialLength = getMaskSet().maskLength;
	                    for (i = j = pos; i <= lvp; i++) {
	                        var t = positionsClone[i];
	                        if (void 0 !== t) for (var posMatch = j; posMatch < getMaskSet().maskLength && (null == t.match.fn && vps[i] && (vps[i].match.optionalQuantifier === !0 || vps[i].match.optionality === !0) || null != t.match.fn); ) {
	                            if (posMatch++, needsValidation === !1 && positionsClone[posMatch] && positionsClone[posMatch].match.def === t.match.def) getMaskSet().validPositions[posMatch] = $.extend(!0, {}, positionsClone[posMatch]), 
	                            getMaskSet().validPositions[posMatch].input = t.input, fillMissingNonMask(posMatch), 
	                            j = posMatch, valid = !0; else if (positionCanMatchDefinition(posMatch, t.match.def)) {
	                                var result = isValid(posMatch, t.input, !0, !0);
	                                valid = result !== !1, j = result.caret || result.insert ? getLastValidPosition() : posMatch, 
	                                needsValidation = !0;
	                            } else valid = t.generatedInput === !0;
	                            if (getMaskSet().maskLength < initialLength && (getMaskSet().maskLength = initialLength), 
	                            valid) break;
	                        }
	                        if (!valid) break;
	                    }
	                    if (!valid) return getMaskSet().validPositions = $.extend(!0, {}, positionsClone), 
	                    resetMaskSet(!0), !1;
	                } else getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
	                return resetMaskSet(!0), !0;
	            }
	            function fillMissingNonMask(maskPos) {
	                for (var pndx = maskPos - 1; pndx > -1 && !getMaskSet().validPositions[pndx]; pndx--) ;
	                var testTemplate, testsFromPos;
	                for (pndx++; pndx < maskPos; pndx++) void 0 === getMaskSet().validPositions[pndx] && (opts.jitMasking === !1 || opts.jitMasking > pndx) && (testsFromPos = getTests(pndx, getTestTemplate(pndx - 1).locator, pndx - 1).slice(), 
	                "" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop(), testTemplate = determineTestTemplate(testsFromPos), 
	                testTemplate && (testTemplate.match.def === opts.radixPointDefinitionSymbol || !isMask(pndx, !0) || $.inArray(opts.radixPoint, getBuffer()) < pndx && testTemplate.match.fn && testTemplate.match.fn.test(getPlaceholder(pndx), getMaskSet(), pndx, !1, opts)) && (result = _isValid(pndx, testTemplate.match.placeholder || (null == testTemplate.match.fn ? testTemplate.match.def : "" !== getPlaceholder(pndx) ? getPlaceholder(pndx) : getBuffer()[pndx]), !0), 
	                result !== !1 && (getMaskSet().validPositions[result.pos || pndx].generatedInput = !0)));
	            }
	            strict = strict === !0;
	            var maskPos = pos;
	            void 0 !== pos.begin && (maskPos = isRTL && !isSelection(pos) ? pos.end : pos.begin);
	            var result = !1, positionsClone = $.extend(!0, {}, getMaskSet().validPositions);
	            if (fillMissingNonMask(maskPos), isSelection(pos) && (handleRemove(void 0, Inputmask.keyCode.DELETE, pos), 
	            maskPos = getMaskSet().p), maskPos < getMaskSet().maskLength && (result = _isValid(maskPos, c, strict), 
	            (!strict || fromSetValid === !0) && result === !1)) {
	                var currentPosValid = getMaskSet().validPositions[maskPos];
	                if (!currentPosValid || null !== currentPosValid.match.fn || currentPosValid.match.def !== c && c !== opts.skipOptionalPartCharacter) {
	                    if ((opts.insertMode || void 0 === getMaskSet().validPositions[seekNext(maskPos)]) && !isMask(maskPos, !0)) {
	                        var testsFromPos = getTests(maskPos).slice();
	                        "" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop();
	                        var staticChar = determineTestTemplate(testsFromPos, !0);
	                        staticChar && (staticChar = staticChar.match.placeholder || staticChar.match.def, 
	                        _isValid(maskPos, staticChar, strict), getMaskSet().validPositions[maskPos].generatedInput = !0);
	                        for (var nPos = maskPos + 1, snPos = seekNext(maskPos); nPos <= snPos; nPos++) if (result = _isValid(nPos, c, strict), 
	                        result !== !1) {
	                            trackbackAlternations(maskPos, nPos), maskPos = nPos;
	                            break;
	                        }
	                    }
	                } else result = {
	                    caret: seekNext(maskPos)
	                };
	            }
	            return result === !1 && opts.keepStatic && !strict && fromAlternate !== !0 && (result = alternate(maskPos, c, strict)), 
	            result === !0 && (result = {
	                pos: maskPos
	            }), $.isFunction(opts.postValidation) && result !== !1 && !strict && fromSetValid !== !0 && (result = !!opts.postValidation(getBuffer(!0), result, opts) && result), 
	            void 0 === result.pos && (result.pos = maskPos), result === !1 && (resetMaskSet(!0), 
	            getMaskSet().validPositions = $.extend(!0, {}, positionsClone)), result;
	        }
	        function isMask(pos, strict) {
	            var test;
	            if (strict ? (test = getTestTemplate(pos).match, "" === test.def && (test = getTest(pos).match)) : test = getTest(pos).match, 
	            null != test.fn) return test.fn;
	            if (strict !== !0 && pos > -1) {
	                var tests = getTests(pos);
	                return tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0);
	            }
	            return !1;
	        }
	        function seekNext(pos, newBlock) {
	            var maskL = getMaskSet().maskLength;
	            if (pos >= maskL) return maskL;
	            for (var position = pos; ++position < maskL && (newBlock === !0 && (getTest(position).match.newBlockMarker !== !0 || !isMask(position)) || newBlock !== !0 && !isMask(position)); ) ;
	            return position;
	        }
	        function seekPrevious(pos, newBlock) {
	            var tests, position = pos;
	            if (position <= 0) return 0;
	            for (;--position > 0 && (newBlock === !0 && getTest(position).match.newBlockMarker !== !0 || newBlock !== !0 && !isMask(position) && (tests = getTests(position), 
	            tests.length < 2 || 2 === tests.length && "" === tests[1].match.def)); ) ;
	            return position;
	        }
	        function getBufferElement(position) {
	            return void 0 === getMaskSet().validPositions[position] ? getPlaceholder(position) : getMaskSet().validPositions[position].input;
	        }
	        function writeBuffer(input, buffer, caretPos, event, triggerInputEvent) {
	            if (event && $.isFunction(opts.onBeforeWrite)) {
	                var result = opts.onBeforeWrite(event, buffer, caretPos, opts);
	                if (result) {
	                    if (result.refreshFromBuffer) {
	                        var refresh = result.refreshFromBuffer;
	                        refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, result.buffer || buffer), 
	                        buffer = getBuffer(!0);
	                    }
	                    void 0 !== caretPos && (caretPos = void 0 !== result.caret ? result.caret : caretPos);
	                }
	            }
	            input.inputmask._valueSet(buffer.join("")), void 0 === caretPos || void 0 !== event && "blur" === event.type || caret(input, caretPos), 
	            triggerInputEvent === !0 && (skipInputEvent = !0, $(input).trigger("input"));
	        }
	        function getPlaceholder(pos, test) {
	            if (test = test || getTest(pos).match, void 0 !== test.placeholder) return test.placeholder;
	            if (null === test.fn) {
	                if (pos > -1 && void 0 === getMaskSet().validPositions[pos]) {
	                    var prevTest, tests = getTests(pos), staticAlternations = [];
	                    if (tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0)) for (var i = 0; i < tests.length; i++) if (tests[i].match.optionality !== !0 && tests[i].match.optionalQuantifier !== !0 && (null === tests[i].match.fn || void 0 === prevTest || tests[i].match.fn.test(prevTest.match.def, getMaskSet(), pos, !0, opts) !== !1) && (staticAlternations.push(tests[i]), 
	                    null === tests[i].match.fn && (prevTest = tests[i]), staticAlternations.length > 1 && /[0-9a-bA-Z]/.test(staticAlternations[0].match.def))) return opts.placeholder.charAt(pos % opts.placeholder.length);
	                }
	                return test.def;
	            }
	            return opts.placeholder.charAt(pos % opts.placeholder.length);
	        }
	        function checkVal(input, writeOut, strict, nptvl, initiatingEvent, stickyCaret) {
	            function isTemplateMatch() {
	                var isMatch = !1, charCodeNdx = getBufferTemplate().slice(initialNdx, seekNext(initialNdx)).join("").indexOf(charCodes);
	                if (charCodeNdx !== -1 && !isMask(initialNdx)) {
	                    isMatch = !0;
	                    for (var bufferTemplateArr = getBufferTemplate().slice(initialNdx, initialNdx + charCodeNdx), i = 0; i < bufferTemplateArr.length; i++) if (" " !== bufferTemplateArr[i]) {
	                        isMatch = !1;
	                        break;
	                    }
	                }
	                return isMatch;
	            }
	            var inputValue = nptvl.slice(), charCodes = "", initialNdx = 0, result = void 0;
	            if (resetMaskSet(), getMaskSet().p = seekNext(-1), !strict) if (opts.autoUnmask !== !0) {
	                var staticInput = getBufferTemplate().slice(0, seekNext(-1)).join(""), matches = inputValue.join("").match(new RegExp("^" + Inputmask.escapeRegex(staticInput), "g"));
	                matches && matches.length > 0 && (inputValue.splice(0, matches.length * staticInput.length), 
	                initialNdx = seekNext(initialNdx));
	            } else initialNdx = seekNext(initialNdx);
	            if ($.each(inputValue, function(ndx, charCode) {
	                if (void 0 !== charCode) {
	                    var keypress = new $.Event("keypress");
	                    keypress.which = charCode.charCodeAt(0), charCodes += charCode;
	                    var lvp = getLastValidPosition(void 0, !0), lvTest = getMaskSet().validPositions[lvp], nextTest = getTestTemplate(lvp + 1, lvTest ? lvTest.locator.slice() : void 0, lvp);
	                    if (!isTemplateMatch() || strict || opts.autoUnmask) {
	                        var pos = strict ? ndx : null == nextTest.match.fn && nextTest.match.optionality && lvp + 1 < getMaskSet().p ? lvp + 1 : getMaskSet().p;
	                        result = keypressEvent.call(input, keypress, !0, !1, strict, pos), initialNdx = pos + 1, 
	                        charCodes = "";
	                    } else result = keypressEvent.call(input, keypress, !0, !1, !0, lvp + 1);
	                    if (!strict && $.isFunction(opts.onBeforeWrite) && (result = opts.onBeforeWrite(keypress, getBuffer(), result.forwardPosition, opts), 
	                    result && result.refreshFromBuffer)) {
	                        var refresh = result.refreshFromBuffer;
	                        refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, result.buffer), 
	                        resetMaskSet(!0), result.caret && (getMaskSet().p = result.caret);
	                    }
	                }
	            }), writeOut) {
	                var caretPos = void 0, lvp = getLastValidPosition();
	                document.activeElement === input && (initiatingEvent || result) && (caretPos = caret(input).begin - (stickyCaret === !0 ? 1 : 0), 
	                result && stickyCaret !== !0 && (caretPos < lvp + 1 || lvp === -1) && (caretPos = opts.numericInput && void 0 === result.caret ? seekPrevious(result.forwardPosition) : result.forwardPosition)), 
	                writeBuffer(input, getBuffer(), caretPos, initiatingEvent || new $.Event("checkval"));
	            }
	        }
	        function unmaskedvalue(input) {
	            if (input && void 0 === input.inputmask) return input.value;
	            var umValue = [], vps = getMaskSet().validPositions;
	            for (var pndx in vps) vps[pndx].match && null != vps[pndx].match.fn && umValue.push(vps[pndx].input);
	            var unmaskedValue = 0 === umValue.length ? "" : (isRTL ? umValue.reverse() : umValue).join("");
	            if ($.isFunction(opts.onUnMask)) {
	                var bufferValue = (isRTL ? getBuffer().slice().reverse() : getBuffer()).join("");
	                unmaskedValue = opts.onUnMask(bufferValue, unmaskedValue, opts) || unmaskedValue;
	            }
	            return unmaskedValue;
	        }
	        function caret(input, begin, end, notranslate) {
	            function translatePosition(pos) {
	                if (notranslate !== !0 && isRTL && "number" == typeof pos && (!opts.greedy || "" !== opts.placeholder)) {
	                    var bffrLght = getBuffer().join("").length;
	                    pos = bffrLght - pos;
	                }
	                return pos;
	            }
	            var range;
	            if ("number" != typeof begin) return input.setSelectionRange ? (begin = input.selectionStart, 
	            end = input.selectionEnd) : window.getSelection ? (range = window.getSelection().getRangeAt(0), 
	            range.commonAncestorContainer.parentNode !== input && range.commonAncestorContainer !== input || (begin = range.startOffset, 
	            end = range.endOffset)) : document.selection && document.selection.createRange && (range = document.selection.createRange(), 
	            begin = 0 - range.duplicate().moveStart("character", -input.inputmask._valueGet().length), 
	            end = begin + range.text.length), {
	                begin: translatePosition(begin),
	                end: translatePosition(end)
	            };
	            begin = translatePosition(begin), end = translatePosition(end), end = "number" == typeof end ? end : begin;
	            var scrollCalc = parseInt(((input.ownerDocument.defaultView || window).getComputedStyle ? (input.ownerDocument.defaultView || window).getComputedStyle(input, null) : input.currentStyle).fontSize) * end;
	            if (input.scrollLeft = scrollCalc > input.scrollWidth ? scrollCalc : 0, mobile || opts.insertMode !== !1 || begin !== end || end++, 
	            input.setSelectionRange) input.selectionStart = begin, input.selectionEnd = end; else if (window.getSelection) {
	                if (range = document.createRange(), void 0 === input.firstChild || null === input.firstChild) {
	                    var textNode = document.createTextNode("");
	                    input.appendChild(textNode);
	                }
	                range.setStart(input.firstChild, begin < input.inputmask._valueGet().length ? begin : input.inputmask._valueGet().length), 
	                range.setEnd(input.firstChild, end < input.inputmask._valueGet().length ? end : input.inputmask._valueGet().length), 
	                range.collapse(!0);
	                var sel = window.getSelection();
	                sel.removeAllRanges(), sel.addRange(range);
	            } else input.createTextRange && (range = input.createTextRange(), range.collapse(!0), 
	            range.moveEnd("character", end), range.moveStart("character", begin), range.select());
	        }
	        function determineLastRequiredPosition(returnDefinition) {
	            var pos, testPos, buffer = getBuffer(), bl = buffer.length, lvp = getLastValidPosition(), positions = {}, lvTest = getMaskSet().validPositions[lvp], ndxIntlzr = void 0 !== lvTest ? lvTest.locator.slice() : void 0;
	            for (pos = lvp + 1; pos < buffer.length; pos++) testPos = getTestTemplate(pos, ndxIntlzr, pos - 1), 
	            ndxIntlzr = testPos.locator.slice(), positions[pos] = $.extend(!0, {}, testPos);
	            var lvTestAlt = lvTest && void 0 !== lvTest.alternation ? lvTest.locator[lvTest.alternation] : void 0;
	            for (pos = bl - 1; pos > lvp && (testPos = positions[pos], (testPos.match.optionality || testPos.match.optionalQuantifier || lvTestAlt && (lvTestAlt !== positions[pos].locator[lvTest.alternation] && null != testPos.match.fn || null === testPos.match.fn && testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAlt.toString().split(",")) && "" !== getTests(pos)[0].def)) && buffer[pos] === getPlaceholder(pos, testPos.match)); pos--) bl--;
	            return returnDefinition ? {
	                l: bl,
	                def: positions[bl] ? positions[bl].match : void 0
	            } : bl;
	        }
	        function clearOptionalTail(buffer) {
	            for (var rl = determineLastRequiredPosition(), lmib = buffer.length - 1; lmib > rl && !isMask(lmib); lmib--) ;
	            return buffer.splice(rl, lmib + 1 - rl), buffer;
	        }
	        function isComplete(buffer) {
	            if ($.isFunction(opts.isComplete)) return opts.isComplete(buffer, opts);
	            if ("*" !== opts.repeat) {
	                var complete = !1, lrp = determineLastRequiredPosition(!0), aml = seekPrevious(lrp.l);
	                if (void 0 === lrp.def || lrp.def.newBlockMarker || lrp.def.optionality || lrp.def.optionalQuantifier) {
	                    complete = !0;
	                    for (var i = 0; i <= aml; i++) {
	                        var test = getTestTemplate(i).match;
	                        if (null !== test.fn && void 0 === getMaskSet().validPositions[i] && test.optionality !== !0 && test.optionalQuantifier !== !0 || null === test.fn && buffer[i] !== getPlaceholder(i, test)) {
	                            complete = !1;
	                            break;
	                        }
	                    }
	                }
	                return complete;
	            }
	        }
	        function patchValueProperty(npt) {
	            function patchValhook(type) {
	                if ($.valHooks && (void 0 === $.valHooks[type] || $.valHooks[type].inputmaskpatch !== !0)) {
	                    var valhookGet = $.valHooks[type] && $.valHooks[type].get ? $.valHooks[type].get : function(elem) {
	                        return elem.value;
	                    }, valhookSet = $.valHooks[type] && $.valHooks[type].set ? $.valHooks[type].set : function(elem, value) {
	                        return elem.value = value, elem;
	                    };
	                    $.valHooks[type] = {
	                        get: function(elem) {
	                            if (elem.inputmask) {
	                                if (elem.inputmask.opts.autoUnmask) return elem.inputmask.unmaskedvalue();
	                                var result = valhookGet(elem);
	                                return getLastValidPosition(void 0, void 0, elem.inputmask.maskset.validPositions) !== -1 || opts.nullable !== !0 ? result : "";
	                            }
	                            return valhookGet(elem);
	                        },
	                        set: function(elem, value) {
	                            var result, $elem = $(elem);
	                            return result = valhookSet(elem, value), elem.inputmask && $elem.trigger("setvalue"), 
	                            result;
	                        },
	                        inputmaskpatch: !0
	                    };
	                }
	            }
	            function getter() {
	                return this.inputmask ? this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : getLastValidPosition() !== -1 || opts.nullable !== !0 ? document.activeElement === this && opts.clearMaskOnLostFocus ? (isRTL ? clearOptionalTail(getBuffer().slice()).reverse() : clearOptionalTail(getBuffer().slice())).join("") : valueGet.call(this) : "" : valueGet.call(this);
	            }
	            function setter(value) {
	                valueSet.call(this, value), this.inputmask && $(this).trigger("setvalue");
	            }
	            function installNativeValueSetFallback(npt) {
	                EventRuler.on(npt, "mouseenter", function(event) {
	                    var $input = $(this), input = this, value = input.inputmask._valueGet();
	                    value !== getBuffer().join("") && $input.trigger("setvalue");
	                });
	            }
	            var valueGet, valueSet;
	            if (!npt.inputmask.__valueGet) {
	                if (Object.getOwnPropertyDescriptor) {
	                    "function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "object" == typeof "test".__proto__ ? function(object) {
	                        return object.__proto__;
	                    } : function(object) {
	                        return object.constructor.prototype;
	                    });
	                    var valueProperty = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(npt), "value") : void 0;
	                    valueProperty && valueProperty.get && valueProperty.set ? (valueGet = valueProperty.get, 
	                    valueSet = valueProperty.set, Object.defineProperty(npt, "value", {
	                        get: getter,
	                        set: setter,
	                        configurable: !0
	                    })) : "INPUT" !== npt.tagName && (valueGet = function() {
	                        return this.textContent;
	                    }, valueSet = function(value) {
	                        this.textContent = value;
	                    }, Object.defineProperty(npt, "value", {
	                        get: getter,
	                        set: setter,
	                        configurable: !0
	                    }));
	                } else document.__lookupGetter__ && npt.__lookupGetter__("value") && (valueGet = npt.__lookupGetter__("value"), 
	                valueSet = npt.__lookupSetter__("value"), npt.__defineGetter__("value", getter), 
	                npt.__defineSetter__("value", setter));
	                npt.inputmask.__valueGet = valueGet, npt.inputmask._valueGet = function(overruleRTL) {
	                    return isRTL && overruleRTL !== !0 ? valueGet.call(this.el).split("").reverse().join("") : valueGet.call(this.el);
	                }, npt.inputmask.__valueSet = valueSet, npt.inputmask._valueSet = function(value, overruleRTL) {
	                    valueSet.call(this.el, null === value || void 0 === value ? "" : overruleRTL !== !0 && isRTL ? value.split("").reverse().join("") : value);
	                }, void 0 === valueGet && (valueGet = function() {
	                    return this.value;
	                }, valueSet = function(value) {
	                    this.value = value;
	                }, patchValhook(npt.type), installNativeValueSetFallback(npt));
	            }
	        }
	        function handleRemove(input, k, pos, strict) {
	            function generalize() {
	                if (opts.keepStatic) {
	                    for (var validInputs = [], lastAlt = getLastValidPosition(-1, !0), positionsClone = $.extend(!0, {}, getMaskSet().validPositions), prevAltPos = getMaskSet().validPositions[lastAlt]; lastAlt >= 0; lastAlt--) {
	                        var altPos = getMaskSet().validPositions[lastAlt];
	                        if (altPos) {
	                            if (altPos.generatedInput !== !0 && /[0-9a-bA-Z]/.test(altPos.input) && validInputs.push(altPos.input), 
	                            delete getMaskSet().validPositions[lastAlt], void 0 !== altPos.alternation && altPos.locator[altPos.alternation] !== prevAltPos.locator[altPos.alternation]) break;
	                            prevAltPos = altPos;
	                        }
	                    }
	                    if (lastAlt > -1) for (getMaskSet().p = seekNext(getLastValidPosition(-1, !0)); validInputs.length > 0; ) {
	                        var keypress = new $.Event("keypress");
	                        keypress.which = validInputs.pop().charCodeAt(0), keypressEvent.call(input, keypress, !0, !1, !1, getMaskSet().p);
	                    } else getMaskSet().validPositions = $.extend(!0, {}, positionsClone);
	                }
	            }
	            if ((opts.numericInput || isRTL) && (k === Inputmask.keyCode.BACKSPACE ? k = Inputmask.keyCode.DELETE : k === Inputmask.keyCode.DELETE && (k = Inputmask.keyCode.BACKSPACE), 
	            isRTL)) {
	                var pend = pos.end;
	                pos.end = pos.begin, pos.begin = pend;
	            }
	            k === Inputmask.keyCode.BACKSPACE && (pos.end - pos.begin < 1 || opts.insertMode === !1) ? (pos.begin = seekPrevious(pos.begin), 
	            void 0 === getMaskSet().validPositions[pos.begin] || getMaskSet().validPositions[pos.begin].input !== opts.groupSeparator && getMaskSet().validPositions[pos.begin].input !== opts.radixPoint || pos.begin--) : k === Inputmask.keyCode.DELETE && pos.begin === pos.end && (pos.end = isMask(pos.end, !0) ? pos.end + 1 : seekNext(pos.end) + 1, 
	            void 0 === getMaskSet().validPositions[pos.begin] || getMaskSet().validPositions[pos.begin].input !== opts.groupSeparator && getMaskSet().validPositions[pos.begin].input !== opts.radixPoint || pos.end++), 
	            stripValidPositions(pos.begin, pos.end, !1, strict), strict !== !0 && generalize();
	            var lvp = getLastValidPosition(pos.begin, !0);
	            lvp < pos.begin ? getMaskSet().p = seekNext(lvp) : strict !== !0 && (getMaskSet().p = pos.begin);
	        }
	        function keydownEvent(e) {
	            var input = this, $input = $(input), k = e.keyCode, pos = caret(input);
	            if (k === Inputmask.keyCode.BACKSPACE || k === Inputmask.keyCode.DELETE || iphone && k === Inputmask.keyCode.BACKSPACE_SAFARI || e.ctrlKey && k === Inputmask.keyCode.X && !isInputEventSupported("cut")) e.preventDefault(), 
	            handleRemove(input, k, pos), writeBuffer(input, getBuffer(!0), getMaskSet().p, e, input.inputmask._valueGet() !== getBuffer().join("")), 
	            input.inputmask._valueGet() === getBufferTemplate().join("") ? $input.trigger("cleared") : isComplete(getBuffer()) === !0 && $input.trigger("complete"), 
	            opts.showTooltip && (input.title = opts.tooltip || getMaskSet().mask); else if (k === Inputmask.keyCode.END || k === Inputmask.keyCode.PAGE_DOWN) {
	                e.preventDefault();
	                var caretPos = seekNext(getLastValidPosition());
	                opts.insertMode || caretPos !== getMaskSet().maskLength || e.shiftKey || caretPos--, 
	                caret(input, e.shiftKey ? pos.begin : caretPos, caretPos, !0);
	            } else k === Inputmask.keyCode.HOME && !e.shiftKey || k === Inputmask.keyCode.PAGE_UP ? (e.preventDefault(), 
	            caret(input, 0, e.shiftKey ? pos.begin : 0, !0)) : (opts.undoOnEscape && k === Inputmask.keyCode.ESCAPE || 90 === k && e.ctrlKey) && e.altKey !== !0 ? (checkVal(input, !0, !1, undoValue.split("")), 
	            $input.trigger("click")) : k !== Inputmask.keyCode.INSERT || e.shiftKey || e.ctrlKey ? opts.tabThrough === !0 && k === Inputmask.keyCode.TAB ? (e.shiftKey === !0 ? (null === getTest(pos.begin).match.fn && (pos.begin = seekNext(pos.begin)), 
	            pos.end = seekPrevious(pos.begin, !0), pos.begin = seekPrevious(pos.end, !0)) : (pos.begin = seekNext(pos.begin, !0), 
	            pos.end = seekNext(pos.begin, !0), pos.end < getMaskSet().maskLength && pos.end--), 
	            pos.begin < getMaskSet().maskLength && (e.preventDefault(), caret(input, pos.begin, pos.end))) : opts.insertMode !== !1 || e.shiftKey || (k === Inputmask.keyCode.RIGHT ? setTimeout(function() {
	                var caretPos = caret(input);
	                caret(input, caretPos.begin);
	            }, 0) : k === Inputmask.keyCode.LEFT && setTimeout(function() {
	                var caretPos = caret(input);
	                caret(input, isRTL ? caretPos.begin + 1 : caretPos.begin - 1);
	            }, 0)) : (opts.insertMode = !opts.insertMode, caret(input, opts.insertMode || pos.begin !== getMaskSet().maskLength ? pos.begin : pos.begin - 1));
	            opts.onKeyDown.call(this, e, getBuffer(), caret(input).begin, opts), ignorable = $.inArray(k, opts.ignorables) !== -1;
	        }
	        function keypressEvent(e, checkval, writeOut, strict, ndx) {
	            var input = this, $input = $(input), k = e.which || e.charCode || e.keyCode;
	            if (!(checkval === !0 || e.ctrlKey && e.altKey) && (e.ctrlKey || e.metaKey || ignorable)) return k === Inputmask.keyCode.ENTER && undoValue !== getBuffer().join("") && (undoValue = getBuffer().join(""), 
	            setTimeout(function() {
	                $input.trigger("change");
	            }, 0)), !0;
	            if (k) {
	                46 === k && e.shiftKey === !1 && "," === opts.radixPoint && (k = 44);
	                var forwardPosition, pos = checkval ? {
	                    begin: ndx,
	                    end: ndx
	                } : caret(input), c = String.fromCharCode(k);
	                getMaskSet().writeOutBuffer = !0;
	                var valResult = isValid(pos, c, strict);
	                if (valResult !== !1 && (resetMaskSet(!0), forwardPosition = void 0 !== valResult.caret ? valResult.caret : checkval ? valResult.pos + 1 : seekNext(valResult.pos), 
	                getMaskSet().p = forwardPosition), writeOut !== !1) {
	                    var self = this;
	                    if (setTimeout(function() {
	                        opts.onKeyValidation.call(self, k, valResult, opts);
	                    }, 0), getMaskSet().writeOutBuffer && valResult !== !1) {
	                        var buffer = getBuffer();
	                        writeBuffer(input, buffer, opts.numericInput && void 0 === valResult.caret ? seekPrevious(forwardPosition) : forwardPosition, e, checkval !== !0), 
	                        checkval !== !0 && setTimeout(function() {
	                            isComplete(buffer) === !0 && $input.trigger("complete");
	                        }, 0);
	                    }
	                }
	                if (opts.showTooltip && (input.title = opts.tooltip || getMaskSet().mask), e.preventDefault(), 
	                checkval) return valResult.forwardPosition = forwardPosition, valResult;
	            }
	        }
	        function pasteEvent(e) {
	            var tempValue, input = this, ev = e.originalEvent || e, $input = $(input), inputValue = input.inputmask._valueGet(!0), caretPos = caret(input);
	            isRTL && (tempValue = caretPos.end, caretPos.end = caretPos.begin, caretPos.begin = tempValue);
	            var valueBeforeCaret = inputValue.substr(0, caretPos.begin), valueAfterCaret = inputValue.substr(caretPos.end, inputValue.length);
	            if (valueBeforeCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(0, caretPos.begin).join("") && (valueBeforeCaret = ""), 
	            valueAfterCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(caretPos.end).join("") && (valueAfterCaret = ""), 
	            isRTL && (tempValue = valueBeforeCaret, valueBeforeCaret = valueAfterCaret, valueAfterCaret = tempValue), 
	            window.clipboardData && window.clipboardData.getData) inputValue = valueBeforeCaret + window.clipboardData.getData("Text") + valueAfterCaret; else {
	                if (!ev.clipboardData || !ev.clipboardData.getData) return !0;
	                inputValue = valueBeforeCaret + ev.clipboardData.getData("text/plain") + valueAfterCaret;
	            }
	            var pasteValue = inputValue;
	            if ($.isFunction(opts.onBeforePaste)) {
	                if (pasteValue = opts.onBeforePaste(inputValue, opts), pasteValue === !1) return e.preventDefault();
	                pasteValue || (pasteValue = inputValue);
	            }
	            return checkVal(input, !1, !1, isRTL ? pasteValue.split("").reverse() : pasteValue.toString().split("")), 
	            writeBuffer(input, getBuffer(), seekNext(getLastValidPosition()), e, undoValue !== getBuffer().join("")), 
	            isComplete(getBuffer()) === !0 && $input.trigger("complete"), e.preventDefault();
	        }
	        function inputFallBackEvent(e) {
	            var input = this, inputValue = input.inputmask._valueGet();
	            if (getBuffer().join("") !== inputValue) {
	                var caretPos = caret(input);
	                if (inputValue = inputValue.replace(new RegExp("(" + Inputmask.escapeRegex(getBufferTemplate().join("")) + ")*"), ""), 
	                iemobile) {
	                    var inputChar = inputValue.replace(getBuffer().join(""), "");
	                    if (1 === inputChar.length) {
	                        var keypress = new $.Event("keypress");
	                        return keypress.which = inputChar.charCodeAt(0), keypressEvent.call(input, keypress, !0, !0, !1, getMaskSet().validPositions[caretPos.begin - 1] ? caretPos.begin : caretPos.begin - 1), 
	                        !1;
	                    }
	                }
	                if (caretPos.begin > inputValue.length && (caret(input, inputValue.length), caretPos = caret(input)), 
	                getBuffer().length - inputValue.length !== 1 || inputValue.charAt(caretPos.begin) === getBuffer()[caretPos.begin] || inputValue.charAt(caretPos.begin + 1) === getBuffer()[caretPos.begin] || isMask(caretPos.begin)) {
	                    for (var lvp = getLastValidPosition() + 1, bufferTemplate = getBuffer().slice(lvp).join(""); null === inputValue.match(Inputmask.escapeRegex(bufferTemplate) + "$"); ) bufferTemplate = bufferTemplate.slice(1);
	                    inputValue = inputValue.replace(bufferTemplate, ""), inputValue = inputValue.split(""), 
	                    checkVal(input, !0, !1, inputValue, e, caretPos.begin < lvp), isComplete(getBuffer()) === !0 && $(input).trigger("complete");
	                } else e.keyCode = Inputmask.keyCode.BACKSPACE, keydownEvent.call(input, e);
	                e.preventDefault();
	            }
	        }
	        function setValueEvent(e) {
	            var input = this, value = input.inputmask._valueGet();
	            checkVal(input, !0, !1, ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(value, opts) || value : value).split("")), 
	            undoValue = getBuffer().join(""), (opts.clearMaskOnLostFocus || opts.clearIncomplete) && input.inputmask._valueGet() === getBufferTemplate().join("") && input.inputmask._valueSet("");
	        }
	        function focusEvent(e) {
	            var input = this, nptValue = input.inputmask._valueGet();
	            opts.showMaskOnFocus && (!opts.showMaskOnHover || opts.showMaskOnHover && "" === nptValue) ? input.inputmask._valueGet() !== getBuffer().join("") && writeBuffer(input, getBuffer(), seekNext(getLastValidPosition())) : mouseEnter === !1 && caret(input, seekNext(getLastValidPosition())), 
	            opts.positionCaretOnTab === !0 && setTimeout(function() {
	                clickEvent.apply(this, [ e ]);
	            }, 0), undoValue = getBuffer().join("");
	        }
	        function mouseleaveEvent(e) {
	            var input = this;
	            if (mouseEnter = !1, opts.clearMaskOnLostFocus && document.activeElement !== input) {
	                var buffer = getBuffer().slice(), nptValue = input.inputmask._valueGet();
	                nptValue !== input.getAttribute("placeholder") && "" !== nptValue && (getLastValidPosition() === -1 && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer), 
	                writeBuffer(input, buffer));
	            }
	        }
	        function clickEvent(e) {
	            function doRadixFocus(clickPos) {
	                if ("" !== opts.radixPoint) {
	                    var vps = getMaskSet().validPositions;
	                    if (void 0 === vps[clickPos] || vps[clickPos].input === getPlaceholder(clickPos)) {
	                        if (clickPos < seekNext(-1)) return !0;
	                        var radixPos = $.inArray(opts.radixPoint, getBuffer());
	                        if (radixPos !== -1) {
	                            for (var vp in vps) if (radixPos < vp && vps[vp].input !== getPlaceholder(vp)) return !1;
	                            return !0;
	                        }
	                    }
	                }
	                return !1;
	            }
	            var input = this;
	            setTimeout(function() {
	                if (document.activeElement === input) {
	                    var selectedCaret = caret(input);
	                    if (selectedCaret.begin === selectedCaret.end) switch (opts.positionCaretOnClick) {
	                      case "none":
	                        break;
	
	                      case "radixFocus":
	                        if (doRadixFocus(selectedCaret.begin)) {
	                            var radixPos = $.inArray(opts.radixPoint, getBuffer().join(""));
	                            caret(input, opts.numericInput ? seekNext(radixPos) : radixPos);
	                            break;
	                        }
	
	                      default:
	                        var clickPosition = selectedCaret.begin, lvclickPosition = getLastValidPosition(clickPosition, !0), lastPosition = seekNext(lvclickPosition);
	                        if (clickPosition < lastPosition) caret(input, isMask(clickPosition) || isMask(clickPosition - 1) ? clickPosition : seekNext(clickPosition)); else {
	                            var placeholder = getPlaceholder(lastPosition);
	                            ("" !== placeholder && getBuffer()[lastPosition] !== placeholder && getTest(lastPosition).match.optionalQuantifier !== !0 || !isMask(lastPosition, !0) && getTest(lastPosition).match.def === placeholder) && (lastPosition = seekNext(lastPosition)), 
	                            caret(input, lastPosition);
	                        }
	                    }
	                }
	            }, 0);
	        }
	        function dblclickEvent(e) {
	            var input = this;
	            setTimeout(function() {
	                caret(input, 0, seekNext(getLastValidPosition()));
	            }, 0);
	        }
	        function cutEvent(e) {
	            var input = this, $input = $(input), pos = caret(input), ev = e.originalEvent || e, clipboardData = window.clipboardData || ev.clipboardData, clipData = isRTL ? getBuffer().slice(pos.end, pos.begin) : getBuffer().slice(pos.begin, pos.end);
	            clipboardData.setData("text", isRTL ? clipData.reverse().join("") : clipData.join("")), 
	            document.execCommand && document.execCommand("copy"), handleRemove(input, Inputmask.keyCode.DELETE, pos), 
	            writeBuffer(input, getBuffer(), getMaskSet().p, e, undoValue !== getBuffer().join("")), 
	            input.inputmask._valueGet() === getBufferTemplate().join("") && $input.trigger("cleared"), 
	            opts.showTooltip && (input.title = opts.tooltip || getMaskSet().mask);
	        }
	        function blurEvent(e) {
	            var $input = $(this), input = this;
	            if (input.inputmask) {
	                var nptValue = input.inputmask._valueGet(), buffer = getBuffer().slice();
	                undoValue !== buffer.join("") && setTimeout(function() {
	                    $input.trigger("change"), undoValue = buffer.join("");
	                }, 0), "" !== nptValue && (opts.clearMaskOnLostFocus && (getLastValidPosition() === -1 && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer)), 
	                isComplete(buffer) === !1 && (setTimeout(function() {
	                    $input.trigger("incomplete");
	                }, 0), opts.clearIncomplete && (resetMaskSet(), buffer = opts.clearMaskOnLostFocus ? [] : getBufferTemplate().slice())), 
	                writeBuffer(input, buffer, void 0, e));
	            }
	        }
	        function mouseenterEvent(e) {
	            var input = this;
	            mouseEnter = !0, document.activeElement !== input && opts.showMaskOnHover && input.inputmask._valueGet() !== getBuffer().join("") && writeBuffer(input, getBuffer());
	        }
	        function submitEvent(e) {
	            undoValue !== getBuffer().join("") && $el.trigger("change"), opts.clearMaskOnLostFocus && getLastValidPosition() === -1 && el.inputmask._valueGet && el.inputmask._valueGet() === getBufferTemplate().join("") && el.inputmask._valueSet(""), 
	            opts.removeMaskOnSubmit && (el.inputmask._valueSet(el.inputmask.unmaskedvalue(), !0), 
	            setTimeout(function() {
	                writeBuffer(el, getBuffer());
	            }, 0));
	        }
	        function resetEvent(e) {
	            setTimeout(function() {
	                $el.trigger("setvalue");
	            }, 0);
	        }
	        function mask(elem) {
	            if (el = elem, $el = $(el), opts.showTooltip && (el.title = opts.tooltip || getMaskSet().mask), 
	            ("rtl" === el.dir || opts.rightAlign) && (el.style.textAlign = "right"), ("rtl" === el.dir || opts.numericInput) && (el.dir = "ltr", 
	            el.removeAttribute("dir"), el.inputmask.isRTL = !0, isRTL = !0), EventRuler.off(el), 
	            patchValueProperty(el), isElementTypeSupported(el, opts) && (EventRuler.on(el, "submit", submitEvent), 
	            EventRuler.on(el, "reset", resetEvent), EventRuler.on(el, "mouseenter", mouseenterEvent), 
	            EventRuler.on(el, "blur", blurEvent), EventRuler.on(el, "focus", focusEvent), EventRuler.on(el, "mouseleave", mouseleaveEvent), 
	            EventRuler.on(el, "click", clickEvent), EventRuler.on(el, "dblclick", dblclickEvent), 
	            EventRuler.on(el, "paste", pasteEvent), EventRuler.on(el, "dragdrop", pasteEvent), 
	            EventRuler.on(el, "drop", pasteEvent), EventRuler.on(el, "cut", cutEvent), EventRuler.on(el, "complete", opts.oncomplete), 
	            EventRuler.on(el, "incomplete", opts.onincomplete), EventRuler.on(el, "cleared", opts.oncleared), 
	            opts.inputEventOnly !== !0 && (EventRuler.on(el, "keydown", keydownEvent), EventRuler.on(el, "keypress", keypressEvent)), 
	            EventRuler.on(el, "input", inputFallBackEvent)), EventRuler.on(el, "setvalue", setValueEvent), 
	            getBufferTemplate(), "" !== el.inputmask._valueGet() || opts.clearMaskOnLostFocus === !1 || document.activeElement === el) {
	                var initialValue = $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(el.inputmask._valueGet(), opts) || el.inputmask._valueGet() : el.inputmask._valueGet();
	                checkVal(el, !0, !1, initialValue.split(""));
	                var buffer = getBuffer().slice();
	                undoValue = buffer.join(""), isComplete(buffer) === !1 && opts.clearIncomplete && resetMaskSet(), 
	                opts.clearMaskOnLostFocus && document.activeElement !== el && (getLastValidPosition() === -1 ? buffer = [] : clearOptionalTail(buffer)), 
	                writeBuffer(el, buffer), document.activeElement === el && caret(el, seekNext(getLastValidPosition()));
	            }
	        }
	        var undoValue, el, $el, maxLength, valueBuffer, isRTL = !1, skipKeyPressEvent = !1, skipInputEvent = !1, ignorable = !1, mouseEnter = !0, EventRuler = {
	            on: function(input, eventName, eventHandler) {
	                var ev = function(e) {
	                    if (void 0 === this.inputmask && "FORM" !== this.nodeName) {
	                        var imOpts = $.data(this, "_inputmask_opts");
	                        imOpts ? new Inputmask(imOpts).mask(this) : EventRuler.off(this);
	                    } else {
	                        if ("setvalue" === e.type || !(this.disabled || this.readOnly && !("keydown" === e.type && e.ctrlKey && 67 === e.keyCode || opts.tabThrough === !1 && e.keyCode === Inputmask.keyCode.TAB))) {
	                            switch (e.type) {
	                              case "input":
	                                if (skipInputEvent === !0) return skipInputEvent = !1, e.preventDefault();
	                                break;
	
	                              case "keydown":
	                                skipKeyPressEvent = !1, skipInputEvent = !1;
	                                break;
	
	                              case "keypress":
	                                if (skipKeyPressEvent === !0) return e.preventDefault();
	                                skipKeyPressEvent = !0;
	                                break;
	
	                              case "click":
	                                if (iemobile) {
	                                    var that = this;
	                                    return setTimeout(function() {
	                                        eventHandler.apply(that, arguments);
	                                    }, 0), !1;
	                                }
	                            }
	                            var returnVal = eventHandler.apply(this, arguments);
	                            return returnVal === !1 && (e.preventDefault(), e.stopPropagation()), returnVal;
	                        }
	                        e.preventDefault();
	                    }
	                };
	                input.inputmask.events[eventName] = input.inputmask.events[eventName] || [], input.inputmask.events[eventName].push(ev), 
	                $.inArray(eventName, [ "submit", "reset" ]) !== -1 ? null != input.form && $(input.form).on(eventName, ev) : $(input).on(eventName, ev);
	            },
	            off: function(input, event) {
	                if (input.inputmask && input.inputmask.events) {
	                    var events;
	                    event ? (events = [], events[event] = input.inputmask.events[event]) : events = input.inputmask.events, 
	                    $.each(events, function(eventName, evArr) {
	                        for (;evArr.length > 0; ) {
	                            var ev = evArr.pop();
	                            $.inArray(eventName, [ "submit", "reset" ]) !== -1 ? null != input.form && $(input.form).off(eventName, ev) : $(input).off(eventName, ev);
	                        }
	                        delete input.inputmask.events[eventName];
	                    });
	                }
	            }
	        };
	        if (void 0 !== actionObj) switch (actionObj.action) {
	          case "isComplete":
	            return el = actionObj.el, isComplete(getBuffer());
	
	          case "unmaskedvalue":
	            return el = actionObj.el, void 0 !== el && void 0 !== el.inputmask ? (maskset = el.inputmask.maskset, 
	            opts = el.inputmask.opts, isRTL = el.inputmask.isRTL) : (valueBuffer = actionObj.value, 
	            opts.numericInput && (isRTL = !0), valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(valueBuffer, opts) || valueBuffer : valueBuffer).split(""), 
	            checkVal(void 0, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite(void 0, getBuffer(), 0, opts)), 
	            unmaskedvalue(el);
	
	          case "mask":
	            el = actionObj.el, maskset = el.inputmask.maskset, opts = el.inputmask.opts, isRTL = el.inputmask.isRTL, 
	            mask(el);
	            break;
	
	          case "format":
	            return opts.numericInput && (isRTL = !0), valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(actionObj.value, opts) || actionObj.value : actionObj.value).split(""), 
	            checkVal(void 0, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite(void 0, getBuffer(), 0, opts), 
	            actionObj.metadata ? {
	                value: isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join(""),
	                metadata: maskScope({
	                    action: "getmetadata"
	                }, maskset, opts)
	            } : isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join("");
	
	          case "isValid":
	            opts.numericInput && (isRTL = !0), actionObj.value ? (valueBuffer = actionObj.value.split(""), 
	            checkVal(void 0, !1, !0, isRTL ? valueBuffer.reverse() : valueBuffer)) : actionObj.value = getBuffer().join("");
	            for (var buffer = getBuffer(), rl = determineLastRequiredPosition(), lmib = buffer.length - 1; lmib > rl && !isMask(lmib); lmib--) ;
	            return buffer.splice(rl, lmib + 1 - rl), isComplete(buffer) && actionObj.value === getBuffer().join("");
	
	          case "getemptymask":
	            return getBufferTemplate().join("");
	
	          case "remove":
	            el = actionObj.el, $el = $(el), maskset = el.inputmask.maskset, opts = el.inputmask.opts, 
	            el.inputmask._valueSet(unmaskedvalue(el)), EventRuler.off(el);
	            var valueProperty;
	            Object.getOwnPropertyDescriptor && Object.getPrototypeOf ? (valueProperty = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value"), 
	            valueProperty && el.inputmask.__valueGet && Object.defineProperty(el, "value", {
	                get: el.inputmask.__valueGet,
	                set: el.inputmask.__valueSet,
	                configurable: !0
	            })) : document.__lookupGetter__ && el.__lookupGetter__("value") && el.inputmask.__valueGet && (el.__defineGetter__("value", el.inputmask.__valueGet), 
	            el.__defineSetter__("value", el.inputmask.__valueSet)), el.inputmask = void 0;
	            break;
	
	          case "getmetadata":
	            if ($.isArray(maskset.metadata)) {
	                for (var alternation, lvp = getLastValidPosition(void 0, !0), firstAlt = lvp; firstAlt >= 0; firstAlt--) if (getMaskSet().validPositions[firstAlt] && void 0 !== getMaskSet().validPositions[firstAlt].alternation) {
	                    alternation = getMaskSet().validPositions[firstAlt].alternation;
	                    break;
	                }
	                return void 0 !== alternation ? maskset.metadata[getMaskSet().validPositions[firstAlt].locator[alternation]] : [];
	            }
	            return maskset.metadata;
	        }
	    }
	    Inputmask.prototype = {
	        defaults: {
	            placeholder: "_",
	            optionalmarker: {
	                start: "[",
	                end: "]"
	            },
	            quantifiermarker: {
	                start: "{",
	                end: "}"
	            },
	            groupmarker: {
	                start: "(",
	                end: ")"
	            },
	            alternatormarker: "|",
	            escapeChar: "\\",
	            mask: null,
	            oncomplete: $.noop,
	            onincomplete: $.noop,
	            oncleared: $.noop,
	            repeat: 0,
	            greedy: !0,
	            autoUnmask: !1,
	            removeMaskOnSubmit: !1,
	            clearMaskOnLostFocus: !0,
	            insertMode: !0,
	            clearIncomplete: !1,
	            aliases: {},
	            alias: null,
	            onKeyDown: $.noop,
	            onBeforeMask: null,
	            onBeforePaste: function(pastedValue, opts) {
	                return $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(pastedValue, opts) : pastedValue;
	            },
	            onBeforeWrite: null,
	            onUnMask: null,
	            showMaskOnFocus: !0,
	            showMaskOnHover: !0,
	            onKeyValidation: $.noop,
	            skipOptionalPartCharacter: " ",
	            showTooltip: !1,
	            tooltip: void 0,
	            numericInput: !1,
	            rightAlign: !1,
	            undoOnEscape: !0,
	            radixPoint: "",
	            radixPointDefinitionSymbol: void 0,
	            groupSeparator: "",
	            keepStatic: null,
	            positionCaretOnTab: !0,
	            tabThrough: !1,
	            supportsInputType: [ "text", "tel", "password" ],
	            definitions: {
	                "9": {
	                    validator: "[0-9]",
	                    cardinality: 1,
	                    definitionSymbol: "*"
	                },
	                a: {
	                    validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	                    cardinality: 1,
	                    definitionSymbol: "*"
	                },
	                "*": {
	                    validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	                    cardinality: 1
	                }
	            },
	            ignorables: [ 8, 9, 13, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123 ],
	            isComplete: null,
	            canClearPosition: $.noop,
	            postValidation: null,
	            staticDefinitionSymbol: void 0,
	            jitMasking: !1,
	            nullable: !0,
	            inputEventOnly: !1,
	            positionCaretOnClick: "lvp",
	            casing: null
	        },
	        masksCache: {},
	        mask: function(elems) {
	            var that = this;
	            return "string" == typeof elems && (elems = document.getElementById(elems) || document.querySelectorAll(elems)), 
	            elems = elems.nodeName ? [ elems ] : elems, $.each(elems, function(ndx, el) {
	                var scopedOpts = $.extend(!0, {}, that.opts);
	                importAttributeOptions(el, scopedOpts, $.extend(!0, {}, that.userOptions));
	                var maskset = generateMaskSet(scopedOpts, that.noMasksCache);
	                void 0 !== maskset && (void 0 !== el.inputmask && el.inputmask.remove(), el.inputmask = new Inputmask(), 
	                el.inputmask.opts = scopedOpts, el.inputmask.noMasksCache = that.noMasksCache, el.inputmask.userOptions = $.extend(!0, {}, that.userOptions), 
	                el.inputmask.el = el, el.inputmask.maskset = maskset, el.inputmask.isRTL = !1, $.data(el, "_inputmask_opts", scopedOpts), 
	                maskScope({
	                    action: "mask",
	                    el: el
	                }));
	            }), elems && elems[0] ? elems[0].inputmask || this : this;
	        },
	        option: function(options, noremask) {
	            return "string" == typeof options ? this.opts[options] : "object" == typeof options ? ($.extend(this.userOptions, options), 
	            this.el && noremask !== !0 && this.mask(this.el), this) : void 0;
	        },
	        unmaskedvalue: function(value) {
	            return maskScope({
	                action: "unmaskedvalue",
	                el: this.el,
	                value: value
	            }, this.el && this.el.inputmask ? this.el.inputmask.maskset : generateMaskSet(this.opts, this.noMasksCache), this.opts);
	        },
	        remove: function() {
	            if (this.el) return maskScope({
	                action: "remove",
	                el: this.el
	            }), this.el.inputmask = void 0, this.el;
	        },
	        getemptymask: function() {
	            return maskScope({
	                action: "getemptymask"
	            }, this.maskset || generateMaskSet(this.opts, this.noMasksCache), this.opts);
	        },
	        hasMaskedValue: function() {
	            return !this.opts.autoUnmask;
	        },
	        isComplete: function() {
	            return maskScope({
	                action: "isComplete",
	                el: this.el
	            }, this.maskset || generateMaskSet(this.opts, this.noMasksCache), this.opts);
	        },
	        getmetadata: function() {
	            return maskScope({
	                action: "getmetadata"
	            }, this.maskset || generateMaskSet(this.opts, this.noMasksCache), this.opts);
	        },
	        isValid: function(value) {
	            return maskScope({
	                action: "isValid",
	                value: value
	            }, this.maskset || generateMaskSet(this.opts, this.noMasksCache), this.opts);
	        },
	        format: function(value, metadata) {
	            return maskScope({
	                action: "format",
	                value: value,
	                metadata: metadata
	            }, this.maskset || generateMaskSet(this.opts, this.noMasksCache), this.opts);
	        }
	    }, Inputmask.extendDefaults = function(options) {
	        $.extend(!0, Inputmask.prototype.defaults, options);
	    }, Inputmask.extendDefinitions = function(definition) {
	        $.extend(!0, Inputmask.prototype.defaults.definitions, definition);
	    }, Inputmask.extendAliases = function(alias) {
	        $.extend(!0, Inputmask.prototype.defaults.aliases, alias);
	    }, Inputmask.format = function(value, options, metadata) {
	        return Inputmask(options).format(value, metadata);
	    }, Inputmask.unmask = function(value, options) {
	        return Inputmask(options).unmaskedvalue(value);
	    }, Inputmask.isValid = function(value, options) {
	        return Inputmask(options).isValid(value);
	    }, Inputmask.remove = function(elems) {
	        $.each(elems, function(ndx, el) {
	            el.inputmask && el.inputmask.remove();
	        });
	    }, Inputmask.escapeRegex = function(str) {
	        var specials = [ "/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^" ];
	        return str.replace(new RegExp("(\\" + specials.join("|\\") + ")", "gim"), "\\$1");
	    }, Inputmask.keyCode = {
	        ALT: 18,
	        BACKSPACE: 8,
	        BACKSPACE_SAFARI: 127,
	        CAPS_LOCK: 20,
	        COMMA: 188,
	        COMMAND: 91,
	        COMMAND_LEFT: 91,
	        COMMAND_RIGHT: 93,
	        CONTROL: 17,
	        DELETE: 46,
	        DOWN: 40,
	        END: 35,
	        ENTER: 13,
	        ESCAPE: 27,
	        HOME: 36,
	        INSERT: 45,
	        LEFT: 37,
	        MENU: 93,
	        NUMPAD_ADD: 107,
	        NUMPAD_DECIMAL: 110,
	        NUMPAD_DIVIDE: 111,
	        NUMPAD_ENTER: 108,
	        NUMPAD_MULTIPLY: 106,
	        NUMPAD_SUBTRACT: 109,
	        PAGE_DOWN: 34,
	        PAGE_UP: 33,
	        PERIOD: 190,
	        RIGHT: 39,
	        SHIFT: 16,
	        SPACE: 32,
	        TAB: 9,
	        UP: 38,
	        WINDOWS: 91,
	        X: 88
	    };
	    var ua = navigator.userAgent, mobile = /mobile/i.test(ua), iemobile = /iemobile/i.test(ua), iphone = /iphone/i.test(ua) && !iemobile;
	    return window.Inputmask = Inputmask, Inputmask;
	}(jQuery), function($, Inputmask) {
	    return void 0 === $.fn.inputmask && ($.fn.inputmask = function(fn, options) {
	        var nptmask, input = this[0];
	        if (void 0 === options && (options = {}), "string" == typeof fn) switch (fn) {
	          case "unmaskedvalue":
	            return input && input.inputmask ? input.inputmask.unmaskedvalue() : $(input).val();
	
	          case "remove":
	            return this.each(function() {
	                this.inputmask && this.inputmask.remove();
	            });
	
	          case "getemptymask":
	            return input && input.inputmask ? input.inputmask.getemptymask() : "";
	
	          case "hasMaskedValue":
	            return !(!input || !input.inputmask) && input.inputmask.hasMaskedValue();
	
	          case "isComplete":
	            return !input || !input.inputmask || input.inputmask.isComplete();
	
	          case "getmetadata":
	            return input && input.inputmask ? input.inputmask.getmetadata() : void 0;
	
	          case "setvalue":
	            $(input).val(options), input && void 0 === input.inputmask && $(input).triggerHandler("setvalue");
	            break;
	
	          case "option":
	            if ("string" != typeof options) return this.each(function() {
	                if (void 0 !== this.inputmask) return this.inputmask.option(options);
	            });
	            if (input && void 0 !== input.inputmask) return input.inputmask.option(options);
	            break;
	
	          default:
	            return options.alias = fn, nptmask = new Inputmask(options), this.each(function() {
	                nptmask.mask(this);
	            });
	        } else {
	            if ("object" == typeof fn) return nptmask = new Inputmask(fn), void 0 === fn.mask && void 0 === fn.alias ? this.each(function() {
	                return void 0 !== this.inputmask ? this.inputmask.option(fn) : void nptmask.mask(this);
	            }) : this.each(function() {
	                nptmask.mask(this);
	            });
	            if (void 0 === fn) return this.each(function() {
	                nptmask = new Inputmask(options), nptmask.mask(this);
	            });
	        }
	    }), $.fn.inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendDefinitions({
	        h: {
	            validator: "[01][0-9]|2[0-3]",
	            cardinality: 2,
	            prevalidator: [ {
	                validator: "[0-2]",
	                cardinality: 1
	            } ]
	        },
	        s: {
	            validator: "[0-5][0-9]",
	            cardinality: 2,
	            prevalidator: [ {
	                validator: "[0-5]",
	                cardinality: 1
	            } ]
	        },
	        d: {
	            validator: "0[1-9]|[12][0-9]|3[01]",
	            cardinality: 2,
	            prevalidator: [ {
	                validator: "[0-3]",
	                cardinality: 1
	            } ]
	        },
	        m: {
	            validator: "0[1-9]|1[012]",
	            cardinality: 2,
	            prevalidator: [ {
	                validator: "[01]",
	                cardinality: 1
	            } ]
	        },
	        y: {
	            validator: "(19|20)\\d{2}",
	            cardinality: 4,
	            prevalidator: [ {
	                validator: "[12]",
	                cardinality: 1
	            }, {
	                validator: "(19|20)",
	                cardinality: 2
	            }, {
	                validator: "(19|20)\\d",
	                cardinality: 3
	            } ]
	        }
	    }), Inputmask.extendAliases({
	        "dd/mm/yyyy": {
	            mask: "1/2/y",
	            placeholder: "dd/mm/yyyy",
	            regex: {
	                val1pre: new RegExp("[0-3]"),
	                val1: new RegExp("0[1-9]|[12][0-9]|3[01]"),
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|[12][0-9]|3[01])" + escapedSeparator + "[01])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|[12][0-9])" + escapedSeparator + "(0[1-9]|1[012]))|(30" + escapedSeparator + "(0[13-9]|1[012]))|(31" + escapedSeparator + "(0[13578]|1[02]))");
	                }
	            },
	            leapday: "29/02/",
	            separator: "/",
	            yearrange: {
	                minyear: 1900,
	                maxyear: 2099
	            },
	            isInYearRange: function(chrs, minyear, maxyear) {
	                if (isNaN(chrs)) return !1;
	                var enteredyear = parseInt(chrs.concat(minyear.toString().slice(chrs.length))), enteredyear2 = parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));
	                return !isNaN(enteredyear) && (minyear <= enteredyear && enteredyear <= maxyear) || !isNaN(enteredyear2) && (minyear <= enteredyear2 && enteredyear2 <= maxyear);
	            },
	            determinebaseyear: function(minyear, maxyear, hint) {
	                var currentyear = new Date().getFullYear();
	                if (minyear > currentyear) return minyear;
	                if (maxyear < currentyear) {
	                    for (var maxYearPrefix = maxyear.toString().slice(0, 2), maxYearPostfix = maxyear.toString().slice(2, 4); maxyear < maxYearPrefix + hint; ) maxYearPrefix--;
	                    var maxxYear = maxYearPrefix + maxYearPostfix;
	                    return minyear > maxxYear ? minyear : maxxYear;
	                }
	                if (minyear <= currentyear && currentyear <= maxyear) {
	                    for (var currentYearPrefix = currentyear.toString().slice(0, 2); maxyear < currentYearPrefix + hint; ) currentYearPrefix--;
	                    var currentYearAndHint = currentYearPrefix + hint;
	                    return currentYearAndHint < minyear ? minyear : currentYearAndHint;
	                }
	                return currentyear;
	            },
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val(today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString()), 
	                    $input.trigger("setvalue");
	                }
	            },
	            getFrontValue: function(mask, buffer, opts) {
	                for (var start = 0, length = 0, i = 0; i < mask.length && "2" !== mask.charAt(i); i++) {
	                    var definition = opts.definitions[mask.charAt(i)];
	                    definition ? (start += length, length = definition.cardinality) : length++;
	                }
	                return buffer.join("").substr(start, length);
	            },
	            definitions: {
	                "1": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.regex.val1.test(chrs);
	                        return strict || isValid || chrs.charAt(1) !== opts.separator && "-./".indexOf(chrs.charAt(1)) === -1 || !(isValid = opts.regex.val1.test("0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0", 
	                        {
	                            refreshFromBuffer: {
	                                start: pos - 1,
	                                end: pos
	                            },
	                            pos: pos,
	                            c: chrs.charAt(0)
	                        });
	                    },
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var pchrs = chrs;
	                            isNaN(maskset.buffer[pos + 1]) || (pchrs += maskset.buffer[pos + 1]);
	                            var isValid = 1 === pchrs.length ? opts.regex.val1pre.test(pchrs) : opts.regex.val1.test(pchrs);
	                            if (!strict && !isValid) {
	                                if (isValid = opts.regex.val1.test(chrs + "0")) return maskset.buffer[pos] = chrs, 
	                                maskset.buffer[++pos] = "0", {
	                                    pos: pos,
	                                    c: "0"
	                                };
	                                if (isValid = opts.regex.val1.test("0" + chrs)) return maskset.buffer[pos] = "0", 
	                                pos++, {
	                                    pos: pos
	                                };
	                            }
	                            return isValid;
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                "2": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
	                        frontValue.indexOf(opts.placeholder[0]) !== -1 && (frontValue = "01" + opts.separator);
	                        var isValid = opts.regex.val2(opts.separator).test(frontValue + chrs);
	                        if (!strict && !isValid && (chrs.charAt(1) === opts.separator || "-./".indexOf(chrs.charAt(1)) !== -1) && (isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs.charAt(0)))) return maskset.buffer[pos - 1] = "0", 
	                        {
	                            refreshFromBuffer: {
	                                start: pos - 1,
	                                end: pos
	                            },
	                            pos: pos,
	                            c: chrs.charAt(0)
	                        };
	                        if (opts.mask.indexOf("2") === opts.mask.length - 1 && isValid) {
	                            var dayMonthValue = maskset.buffer.join("").substr(4, 4) + chrs;
	                            if (dayMonthValue !== opts.leapday) return !0;
	                            var year = parseInt(maskset.buffer.join("").substr(0, 4), 10);
	                            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	                        }
	                        return isValid;
	                    },
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            isNaN(maskset.buffer[pos + 1]) || (chrs += maskset.buffer[pos + 1]);
	                            var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
	                            frontValue.indexOf(opts.placeholder[0]) !== -1 && (frontValue = "01" + opts.separator);
	                            var isValid = 1 === chrs.length ? opts.regex.val2pre(opts.separator).test(frontValue + chrs) : opts.regex.val2(opts.separator).test(frontValue + chrs);
	                            return strict || isValid || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs)) ? isValid : (maskset.buffer[pos] = "0", 
	                            pos++, {
	                                pos: pos
	                            });
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                y: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        if (opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) {
	                            var dayMonthValue = maskset.buffer.join("").substr(0, 6);
	                            if (dayMonthValue !== opts.leapday) return !0;
	                            var year = parseInt(chrs, 10);
	                            return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	                        }
	                        return !1;
	                    },
	                    cardinality: 4,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                            if (!strict && !isValid) {
	                                var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 1);
	                                if (isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0), 
	                                {
	                                    pos: pos
	                                };
	                                if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 2), 
	                                isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0), 
	                                maskset.buffer[pos++] = yearPrefix.charAt(1), {
	                                    pos: pos
	                                };
	                            }
	                            return isValid;
	                        },
	                        cardinality: 1
	                    }, {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                            if (!strict && !isValid) {
	                                var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);
	                                if (isValid = opts.isInYearRange(chrs[0] + yearPrefix[1] + chrs[1], opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(1), 
	                                {
	                                    pos: pos
	                                };
	                                if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2), 
	                                opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) {
	                                    var dayMonthValue = maskset.buffer.join("").substr(0, 6);
	                                    if (dayMonthValue !== opts.leapday) isValid = !0; else {
	                                        var year = parseInt(chrs, 10);
	                                        isValid = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
	                                    }
	                                } else isValid = !1;
	                                if (isValid) return maskset.buffer[pos - 1] = yearPrefix.charAt(0), maskset.buffer[pos++] = yearPrefix.charAt(1), 
	                                maskset.buffer[pos++] = chrs.charAt(0), {
	                                    refreshFromBuffer: {
	                                        start: pos - 3,
	                                        end: pos
	                                    },
	                                    pos: pos
	                                };
	                            }
	                            return isValid;
	                        },
	                        cardinality: 2
	                    }, {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                        },
	                        cardinality: 3
	                    } ]
	                }
	            },
	            insertMode: !1,
	            autoUnmask: !1
	        },
	        "mm/dd/yyyy": {
	            placeholder: "mm/dd/yyyy",
	            alias: "dd/mm/yyyy",
	            regex: {
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
	                },
	                val1pre: new RegExp("[01]"),
	                val1: new RegExp("0[1-9]|1[012]")
	            },
	            leapday: "02/29/",
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()), 
	                    $input.trigger("setvalue");
	                }
	            }
	        },
	        "yyyy/mm/dd": {
	            mask: "y/1/2",
	            placeholder: "yyyy/mm/dd",
	            alias: "mm/dd/yyyy",
	            leapday: "/02/29",
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val(today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString()), 
	                    $input.trigger("setvalue");
	                }
	            }
	        },
	        "dd.mm.yyyy": {
	            mask: "1.2.y",
	            placeholder: "dd.mm.yyyy",
	            leapday: "29.02.",
	            separator: ".",
	            alias: "dd/mm/yyyy"
	        },
	        "dd-mm-yyyy": {
	            mask: "1-2-y",
	            placeholder: "dd-mm-yyyy",
	            leapday: "29-02-",
	            separator: "-",
	            alias: "dd/mm/yyyy"
	        },
	        "mm.dd.yyyy": {
	            mask: "1.2.y",
	            placeholder: "mm.dd.yyyy",
	            leapday: "02.29.",
	            separator: ".",
	            alias: "mm/dd/yyyy"
	        },
	        "mm-dd-yyyy": {
	            mask: "1-2-y",
	            placeholder: "mm-dd-yyyy",
	            leapday: "02-29-",
	            separator: "-",
	            alias: "mm/dd/yyyy"
	        },
	        "yyyy.mm.dd": {
	            mask: "y.1.2",
	            placeholder: "yyyy.mm.dd",
	            leapday: ".02.29",
	            separator: ".",
	            alias: "yyyy/mm/dd"
	        },
	        "yyyy-mm-dd": {
	            mask: "y-1-2",
	            placeholder: "yyyy-mm-dd",
	            leapday: "-02-29",
	            separator: "-",
	            alias: "yyyy/mm/dd"
	        },
	        datetime: {
	            mask: "1/2/y h:s",
	            placeholder: "dd/mm/yyyy hh:mm",
	            alias: "dd/mm/yyyy",
	            regex: {
	                hrspre: new RegExp("[012]"),
	                hrs24: new RegExp("2[0-4]|1[3-9]"),
	                hrs: new RegExp("[01][0-9]|2[0-4]"),
	                ampm: new RegExp("^[a|p|A|P][m|M]"),
	                mspre: new RegExp("[0-5]"),
	                ms: new RegExp("[0-5][0-9]")
	            },
	            timeseparator: ":",
	            hourFormat: "24",
	            definitions: {
	                h: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        if ("24" === opts.hourFormat && 24 === parseInt(chrs, 10)) return maskset.buffer[pos - 1] = "0", 
	                        maskset.buffer[pos] = "0", {
	                            refreshFromBuffer: {
	                                start: pos - 1,
	                                end: pos
	                            },
	                            c: "0"
	                        };
	                        var isValid = opts.regex.hrs.test(chrs);
	                        if (!strict && !isValid && (chrs.charAt(1) === opts.timeseparator || "-.:".indexOf(chrs.charAt(1)) !== -1) && (isValid = opts.regex.hrs.test("0" + chrs.charAt(0)))) return maskset.buffer[pos - 1] = "0", 
	                        maskset.buffer[pos] = chrs.charAt(0), pos++, {
	                            refreshFromBuffer: {
	                                start: pos - 2,
	                                end: pos
	                            },
	                            pos: pos,
	                            c: opts.timeseparator
	                        };
	                        if (isValid && "24" !== opts.hourFormat && opts.regex.hrs24.test(chrs)) {
	                            var tmp = parseInt(chrs, 10);
	                            return 24 === tmp ? (maskset.buffer[pos + 5] = "a", maskset.buffer[pos + 6] = "m") : (maskset.buffer[pos + 5] = "p", 
	                            maskset.buffer[pos + 6] = "m"), tmp -= 12, tmp < 10 ? (maskset.buffer[pos] = tmp.toString(), 
	                            maskset.buffer[pos - 1] = "0") : (maskset.buffer[pos] = tmp.toString().charAt(1), 
	                            maskset.buffer[pos - 1] = tmp.toString().charAt(0)), {
	                                refreshFromBuffer: {
	                                    start: pos - 1,
	                                    end: pos + 6
	                                },
	                                c: maskset.buffer[pos]
	                            };
	                        }
	                        return isValid;
	                    },
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.regex.hrspre.test(chrs);
	                            return strict || isValid || !(isValid = opts.regex.hrs.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0", 
	                            pos++, {
	                                pos: pos
	                            });
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                s: {
	                    validator: "[0-5][0-9]",
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.regex.mspre.test(chrs);
	                            return strict || isValid || !(isValid = opts.regex.ms.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0", 
	                            pos++, {
	                                pos: pos
	                            });
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                t: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        return opts.regex.ampm.test(chrs + "m");
	                    },
	                    casing: "lower",
	                    cardinality: 1
	                }
	            },
	            insertMode: !1,
	            autoUnmask: !1
	        },
	        datetime12: {
	            mask: "1/2/y h:s t\\m",
	            placeholder: "dd/mm/yyyy hh:mm xm",
	            alias: "datetime",
	            hourFormat: "12"
	        },
	        "mm/dd/yyyy hh:mm xm": {
	            mask: "1/2/y h:s t\\m",
	            placeholder: "mm/dd/yyyy hh:mm xm",
	            alias: "datetime12",
	            regex: {
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
	                },
	                val1pre: new RegExp("[01]"),
	                val1: new RegExp("0[1-9]|1[012]")
	            },
	            leapday: "02/29/",
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()), 
	                    $input.trigger("setvalue");
	                }
	            }
	        },
	        "hh:mm t": {
	            mask: "h:s t\\m",
	            placeholder: "hh:mm xm",
	            alias: "datetime",
	            hourFormat: "12"
	        },
	        "h:s t": {
	            mask: "h:s t\\m",
	            placeholder: "hh:mm xm",
	            alias: "datetime",
	            hourFormat: "12"
	        },
	        "hh:mm:ss": {
	            mask: "h:s:s",
	            placeholder: "hh:mm:ss",
	            alias: "datetime",
	            autoUnmask: !1
	        },
	        "hh:mm": {
	            mask: "h:s",
	            placeholder: "hh:mm",
	            alias: "datetime",
	            autoUnmask: !1
	        },
	        date: {
	            alias: "dd/mm/yyyy"
	        },
	        "mm/yyyy": {
	            mask: "1/y",
	            placeholder: "mm/yyyy",
	            leapday: "donotuse",
	            separator: "/",
	            alias: "mm/dd/yyyy"
	        },
	        shamsi: {
	            regex: {
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "[0-3])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[1-9]|1[012])" + escapedSeparator + "30)|((0[1-6])" + escapedSeparator + "31)");
	                },
	                val1pre: new RegExp("[01]"),
	                val1: new RegExp("0[1-9]|1[012]")
	            },
	            yearrange: {
	                minyear: 1300,
	                maxyear: 1499
	            },
	            mask: "y/1/2",
	            leapday: "/12/30",
	            placeholder: "yyyy/mm/dd",
	            alias: "mm/dd/yyyy",
	            clearIncomplete: !0
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendDefinitions({
	        A: {
	            validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	            cardinality: 1,
	            casing: "upper"
	        },
	        "&": {
	            validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	            cardinality: 1,
	            casing: "upper"
	        },
	        "#": {
	            validator: "[0-9A-Fa-f]",
	            cardinality: 1,
	            casing: "upper"
	        }
	    }), Inputmask.extendAliases({
	        url: {
	            definitions: {
	                i: {
	                    validator: ".",
	                    cardinality: 1
	                }
	            },
	            mask: "(\\http://)|(\\http\\s://)|(ftp://)|(ftp\\s://)i{+}",
	            insertMode: !1,
	            autoUnmask: !1
	        },
	        ip: {
	            mask: "i[i[i]].i[i[i]].i[i[i]].i[i[i]]",
	            definitions: {
	                i: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        return pos - 1 > -1 && "." !== maskset.buffer[pos - 1] ? (chrs = maskset.buffer[pos - 1] + chrs, 
	                        chrs = pos - 2 > -1 && "." !== maskset.buffer[pos - 2] ? maskset.buffer[pos - 2] + chrs : "0" + chrs) : chrs = "00" + chrs, 
	                        new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
	                    },
	                    cardinality: 1
	                }
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                return maskedValue;
	            }
	        },
	        email: {
	            mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",
	            greedy: !1,
	            onBeforePaste: function(pastedValue, opts) {
	                return pastedValue = pastedValue.toLowerCase(), pastedValue.replace("mailto:", "");
	            },
	            definitions: {
	                "*": {
	                    validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
	                    cardinality: 1,
	                    casing: "lower"
	                },
	                "-": {
	                    validator: "[0-9A-Za-z-]",
	                    cardinality: 1,
	                    casing: "lower"
	                }
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                return maskedValue;
	            }
	        },
	        mac: {
	            mask: "##:##:##:##:##:##"
	        },
	        vin: {
	            mask: "V{13}9{4}",
	            definitions: {
	                V: {
	                    validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
	                    cardinality: 1,
	                    casing: "upper"
	                }
	            },
	            clearIncomplete: !0,
	            autoUnmask: !0
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendAliases({
	        numeric: {
	            mask: function(opts) {
	                function autoEscape(txt) {
	                    for (var escapedTxt = "", i = 0; i < txt.length; i++) escapedTxt += opts.definitions[txt.charAt(i)] || opts.optionalmarker.start === txt.charAt(i) || opts.optionalmarker.end === txt.charAt(i) || opts.quantifiermarker.start === txt.charAt(i) || opts.quantifiermarker.end === txt.charAt(i) || opts.groupmarker.start === txt.charAt(i) || opts.groupmarker.end === txt.charAt(i) || opts.alternatormarker === txt.charAt(i) ? "\\" + txt.charAt(i) : txt.charAt(i);
	                    return escapedTxt;
	                }
	                if (0 !== opts.repeat && isNaN(opts.integerDigits) && (opts.integerDigits = opts.repeat), 
	                opts.repeat = 0, opts.groupSeparator === opts.radixPoint && ("." === opts.radixPoint ? opts.groupSeparator = "," : "," === opts.radixPoint ? opts.groupSeparator = "." : opts.groupSeparator = ""), 
	                " " === opts.groupSeparator && (opts.skipOptionalPartCharacter = void 0), opts.autoGroup = opts.autoGroup && "" !== opts.groupSeparator, 
	                opts.autoGroup && ("string" == typeof opts.groupSize && isFinite(opts.groupSize) && (opts.groupSize = parseInt(opts.groupSize)), 
	                isFinite(opts.integerDigits))) {
	                    var seps = Math.floor(opts.integerDigits / opts.groupSize), mod = opts.integerDigits % opts.groupSize;
	                    opts.integerDigits = parseInt(opts.integerDigits) + (0 === mod ? seps - 1 : seps), 
	                    opts.integerDigits < 1 && (opts.integerDigits = "*");
	                }
	                opts.placeholder.length > 1 && (opts.placeholder = opts.placeholder.charAt(0)), 
	                "radixFocus" === opts.positionCaretOnClick && "" === opts.placeholder && opts.integerOptional === !1 && (opts.positionCaretOnClick = "lvp"), 
	                opts.definitions[";"] = opts.definitions["~"], opts.definitions[";"].definitionSymbol = "~", 
	                opts.numericInput === !0 && (opts.positionCaretOnClick = "radixFocus" === opts.positionCaretOnClick ? "lvp" : opts.positionCaretOnClick, 
	                opts.digitsOptional = !1, isNaN(opts.digits) && (opts.digits = 2), opts.decimalProtect = !1);
	                var mask = autoEscape(opts.prefix);
	                if (mask += "[+]", mask += opts.integerOptional === !0 ? "~{1," + opts.integerDigits + "}" : "~{" + opts.integerDigits + "}", 
	                void 0 !== opts.digits) {
	                    opts.decimalProtect && (opts.radixPointDefinitionSymbol = ":");
	                    var dq = opts.digits.toString().split(",");
	                    isFinite(dq[0] && dq[1] && isFinite(dq[1])) ? mask += (opts.decimalProtect ? ":" : opts.radixPoint) + ";{" + opts.digits + "}" : (isNaN(opts.digits) || parseInt(opts.digits) > 0) && (mask += opts.digitsOptional ? "[" + (opts.decimalProtect ? ":" : opts.radixPoint) + ";{1," + opts.digits + "}]" : (opts.decimalProtect ? ":" : opts.radixPoint) + ";{" + opts.digits + "}");
	                }
	                return mask += "[-]", mask += autoEscape(opts.suffix), opts.greedy = !1, null !== opts.min && (opts.min = opts.min.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                "," === opts.radixPoint && (opts.min = opts.min.replace(opts.radixPoint, "."))), 
	                null !== opts.max && (opts.max = opts.max.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                "," === opts.radixPoint && (opts.max = opts.max.replace(opts.radixPoint, "."))), 
	                mask;
	            },
	            placeholder: "",
	            greedy: !1,
	            digits: "*",
	            digitsOptional: !0,
	            radixPoint: ".",
	            positionCaretOnClick: "radixFocus",
	            groupSize: 3,
	            groupSeparator: "",
	            autoGroup: !1,
	            allowPlus: !0,
	            allowMinus: !0,
	            negationSymbol: {
	                front: "-",
	                back: ""
	            },
	            integerDigits: "+",
	            integerOptional: !0,
	            prefix: "",
	            suffix: "",
	            rightAlign: !0,
	            decimalProtect: !0,
	            min: null,
	            max: null,
	            step: 1,
	            insertMode: !0,
	            autoUnmask: !1,
	            unmaskAsNumber: !1,
	            postFormat: function(buffer, pos, opts) {
	                opts.numericInput === !0 && (buffer = buffer.reverse(), isFinite(pos) && (pos = buffer.join("").length - pos - 1));
	                var i, l;
	                pos = pos >= buffer.length ? buffer.length - 1 : pos < opts.prefix.length ? opts.prefix.length : pos;
	                var charAtPos = buffer[pos], cbuf = buffer.slice();
	                charAtPos === opts.groupSeparator && (cbuf.splice(pos--, 1), charAtPos = cbuf[pos]), 
	                cbuf[pos] = "!";
	                var bufVal = cbuf.join(""), bufValOrigin = bufVal;
	                if (bufVal = bufVal.replace(new RegExp(Inputmask.escapeRegex(opts.suffix) + "$"), ""), 
	                bufVal = bufVal.replace(new RegExp("^" + Inputmask.escapeRegex(opts.prefix)), ""), 
	                bufVal.length > 0 && opts.autoGroup || bufVal.indexOf(opts.groupSeparator) !== -1) {
	                    var escapedGroupSeparator = Inputmask.escapeRegex(opts.groupSeparator);
	                    bufVal = bufVal.replace(new RegExp(escapedGroupSeparator, "g"), "");
	                    var radixSplit = bufVal.split(charAtPos === opts.radixPoint ? "!" : opts.radixPoint);
	                    if (bufVal = "" === opts.radixPoint ? bufVal : radixSplit[0], charAtPos !== opts.negationSymbol.front && (bufVal = bufVal.replace("!", "?")), 
	                    bufVal.length > opts.groupSize) for (var reg = new RegExp("([-+]?[\\d?]+)([\\d?]{" + opts.groupSize + "})"); reg.test(bufVal) && "" !== opts.groupSeparator; ) bufVal = bufVal.replace(reg, "$1" + opts.groupSeparator + "$2"), 
	                    bufVal = bufVal.replace(opts.groupSeparator + opts.groupSeparator, opts.groupSeparator);
	                    bufVal = bufVal.replace("?", "!"), "" !== opts.radixPoint && radixSplit.length > 1 && (bufVal += (charAtPos === opts.radixPoint ? "!" : opts.radixPoint) + radixSplit[1]);
	                }
	                bufVal = opts.prefix + bufVal + opts.suffix;
	                var needsRefresh = bufValOrigin !== bufVal;
	                if (needsRefresh) for (buffer.length = bufVal.length, i = 0, l = bufVal.length; i < l; i++) buffer[i] = bufVal.charAt(i);
	                var newPos = $.inArray("!", bufVal);
	                return buffer[newPos] = charAtPos, newPos = opts.numericInput && isFinite(pos) ? buffer.join("").length - newPos - 1 : newPos, 
	                opts.numericInput && (buffer = buffer.reverse(), $.inArray(opts.radixPoint, buffer) < newPos && buffer.join("").length - opts.suffix.length !== newPos && (newPos -= 1)), 
	                {
	                    pos: newPos,
	                    refreshFromBuffer: needsRefresh,
	                    buffer: buffer
	                };
	            },
	            onBeforeWrite: function(e, buffer, caretPos, opts) {
	                var rslt;
	                if (e && ("blur" === e.type || "checkval" === e.type || "keydown" === e.type)) {
	                    var maskedValue = opts.numericInput ? buffer.slice().reverse().join("") : buffer.join(""), processValue = maskedValue.replace(opts.prefix, "");
	                    processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                    "," === opts.radixPoint && (processValue = processValue.replace(opts.radixPoint, "."));
	                    var isNegative = processValue.match(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"));
	                    if (isNegative = null !== isNegative && 1 === isNegative.length, processValue = processValue.replace(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"), ""), 
	                    processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), ""), 
	                    isNaN(opts.placeholder) && (processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.placeholder), "g"), "")), 
	                    processValue = processValue === opts.negationSymbol.front ? processValue + "0" : processValue, 
	                    "" !== processValue && isFinite(processValue)) {
	                        var floatValue = parseFloat(processValue), signedFloatValue = isNegative ? floatValue * -1 : floatValue;
	                        if (null !== opts.min && isFinite(opts.min) && signedFloatValue < parseFloat(opts.min) ? (floatValue = Math.abs(opts.min), 
	                        isNegative = opts.min < 0, maskedValue = void 0) : null !== opts.max && isFinite(opts.max) && signedFloatValue > parseFloat(opts.max) && (floatValue = Math.abs(opts.max), 
	                        isNegative = opts.max < 0, maskedValue = void 0), processValue = floatValue.toString().replace(".", opts.radixPoint).split(""), 
	                        isFinite(opts.digits)) {
	                            var radixPosition = $.inArray(opts.radixPoint, processValue), rpb = $.inArray(opts.radixPoint, maskedValue);
	                            radixPosition === -1 && (processValue.push(opts.radixPoint), radixPosition = processValue.length - 1);
	                            for (var i = 1; i <= opts.digits; i++) opts.digitsOptional || void 0 !== processValue[radixPosition + i] && processValue[radixPosition + i] !== opts.placeholder.charAt(0) ? rpb !== -1 && void 0 !== maskedValue[rpb + i] && (processValue[radixPosition + i] = processValue[radixPosition + i] || maskedValue[rpb + i]) : processValue[radixPosition + i] = "0";
	                            processValue[processValue.length - 1] === opts.radixPoint && delete processValue[processValue.length - 1];
	                        }
	                        if (floatValue.toString() !== processValue && floatValue.toString() + "." !== processValue || isNegative) return !isNegative || 0 === floatValue && "blur" === e.type || (processValue.unshift(opts.negationSymbol.front), 
	                        processValue.push(opts.negationSymbol.back)), processValue = (opts.prefix + processValue.join("")).split(""), 
	                        opts.numericInput && (processValue = processValue.reverse()), rslt = opts.postFormat(processValue, opts.numericInput ? caretPos : caretPos - 1, opts), 
	                        rslt.buffer && (rslt.refreshFromBuffer = rslt.buffer.join("") !== buffer.join("")), 
	                        rslt;
	                    }
	                }
	                if (opts.autoGroup) return rslt = opts.postFormat(buffer, opts.numericInput ? caretPos : caretPos - 1, opts), 
	                rslt.caret = caretPos <= opts.prefix.length ? rslt.pos : rslt.pos + 1, rslt;
	            },
	            regex: {
	                integerPart: function(opts) {
	                    return new RegExp("[" + Inputmask.escapeRegex(opts.negationSymbol.front) + "+]?\\d+");
	                },
	                integerNPart: function(opts) {
	                    return new RegExp("[\\d" + Inputmask.escapeRegex(opts.groupSeparator) + Inputmask.escapeRegex(opts.placeholder.charAt(0)) + "]+");
	                }
	            },
	            signHandler: function(chrs, maskset, pos, strict, opts) {
	                if (!strict && opts.allowMinus && "-" === chrs || opts.allowPlus && "+" === chrs) {
	                    var matchRslt = maskset.buffer.join("").match(opts.regex.integerPart(opts));
	                    if (matchRslt && matchRslt[0].length > 0) return maskset.buffer[matchRslt.index] === ("-" === chrs ? "+" : opts.negationSymbol.front) ? "-" === chrs ? "" !== opts.negationSymbol.back ? {
	                        pos: matchRslt.index,
	                        c: opts.negationSymbol.front,
	                        remove: matchRslt.index,
	                        caret: pos,
	                        insert: {
	                            pos: maskset.buffer.length - opts.suffix.length - 1,
	                            c: opts.negationSymbol.back
	                        }
	                    } : {
	                        pos: matchRslt.index,
	                        c: opts.negationSymbol.front,
	                        remove: matchRslt.index,
	                        caret: pos
	                    } : "" !== opts.negationSymbol.back ? {
	                        pos: matchRslt.index,
	                        c: "+",
	                        remove: [ matchRslt.index, maskset.buffer.length - opts.suffix.length - 1 ],
	                        caret: pos
	                    } : {
	                        pos: matchRslt.index,
	                        c: "+",
	                        remove: matchRslt.index,
	                        caret: pos
	                    } : maskset.buffer[matchRslt.index] === ("-" === chrs ? opts.negationSymbol.front : "+") ? "-" === chrs && "" !== opts.negationSymbol.back ? {
	                        remove: [ matchRslt.index, maskset.buffer.length - opts.suffix.length - 1 ],
	                        caret: pos - 1
	                    } : {
	                        remove: matchRslt.index,
	                        caret: pos - 1
	                    } : "-" === chrs ? "" !== opts.negationSymbol.back ? {
	                        pos: matchRslt.index,
	                        c: opts.negationSymbol.front,
	                        caret: pos + 1,
	                        insert: {
	                            pos: maskset.buffer.length - opts.suffix.length,
	                            c: opts.negationSymbol.back
	                        }
	                    } : {
	                        pos: matchRslt.index,
	                        c: opts.negationSymbol.front,
	                        caret: pos + 1
	                    } : {
	                        pos: matchRslt.index,
	                        c: chrs,
	                        caret: pos + 1
	                    };
	                }
	                return !1;
	            },
	            radixHandler: function(chrs, maskset, pos, strict, opts) {
	                if (!strict && opts.numericInput !== !0 && chrs === opts.radixPoint && void 0 !== opts.digits && (isNaN(opts.digits) || parseInt(opts.digits) > 0)) {
	                    var radixPos = $.inArray(opts.radixPoint, maskset.buffer), integerValue = maskset.buffer.join("").match(opts.regex.integerPart(opts));
	                    if (radixPos !== -1 && maskset.validPositions[radixPos]) return maskset.validPositions[radixPos - 1] ? {
	                        caret: radixPos + 1
	                    } : {
	                        pos: integerValue.index,
	                        c: integerValue[0],
	                        caret: radixPos + 1
	                    };
	                    if (!integerValue || "0" === integerValue[0] && integerValue.index + 1 !== pos) return maskset.buffer[integerValue ? integerValue.index : pos] = "0", 
	                    {
	                        pos: (integerValue ? integerValue.index : pos) + 1,
	                        c: opts.radixPoint
	                    };
	                }
	                return !1;
	            },
	            leadingZeroHandler: function(chrs, maskset, pos, strict, opts, isSelection) {
	                if (!strict) {
	                    var buffer = maskset.buffer.slice("");
	                    if (buffer.splice(0, opts.prefix.length), buffer.splice(buffer.length - opts.suffix.length, opts.suffix.length), 
	                    opts.numericInput === !0) {
	                        var buffer = buffer.reverse(), bufferChar = buffer[0];
	                        if ("0" === bufferChar && void 0 === maskset.validPositions[pos - 1]) return {
	                            pos: pos,
	                            remove: buffer.length - 1
	                        };
	                    } else {
	                        pos -= opts.prefix.length;
	                        var radixPosition = $.inArray(opts.radixPoint, buffer), matchRslt = buffer.slice(0, radixPosition !== -1 ? radixPosition : void 0).join("").match(opts.regex.integerNPart(opts));
	                        if (matchRslt && (radixPosition === -1 || pos <= radixPosition)) {
	                            var decimalPart = radixPosition === -1 ? 0 : parseInt(buffer.slice(radixPosition + 1).join(""));
	                            if (0 === matchRslt[0].indexOf("" !== opts.placeholder ? opts.placeholder.charAt(0) : "0") && (matchRslt.index + 1 === pos || isSelection !== !0 && 0 === decimalPart)) return maskset.buffer.splice(matchRslt.index + opts.prefix.length, 1), 
	                            {
	                                pos: matchRslt.index + opts.prefix.length,
	                                remove: matchRslt.index + opts.prefix.length
	                            };
	                            if ("0" === chrs && pos <= matchRslt.index && matchRslt[0] !== opts.groupSeparator) return !1;
	                        }
	                    }
	                }
	                return !0;
	            },
	            definitions: {
	                "~": {
	                    validator: function(chrs, maskset, pos, strict, opts, isSelection) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        if (!isValid && (isValid = opts.radixHandler(chrs, maskset, pos, strict, opts), 
	                        !isValid && (isValid = strict ? new RegExp("[0-9" + Inputmask.escapeRegex(opts.groupSeparator) + "]").test(chrs) : new RegExp("[0-9]").test(chrs), 
	                        isValid === !0 && (isValid = opts.leadingZeroHandler(chrs, maskset, pos, strict, opts, isSelection), 
	                        isValid === !0)))) {
	                            var radixPosition = $.inArray(opts.radixPoint, maskset.buffer);
	                            isValid = radixPosition !== -1 && (opts.digitsOptional === !1 || maskset.validPositions[pos]) && opts.numericInput !== !0 && pos > radixPosition && !strict ? {
	                                pos: pos,
	                                remove: pos
	                            } : {
	                                pos: pos
	                            };
	                        }
	                        return isValid;
	                    },
	                    cardinality: 1
	                },
	                "+": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        return !isValid && (strict && opts.allowMinus && chrs === opts.negationSymbol.front || opts.allowMinus && "-" === chrs || opts.allowPlus && "+" === chrs) && (isValid = !(!strict && "-" === chrs) || ("" !== opts.negationSymbol.back ? {
	                            pos: pos,
	                            c: "-" === chrs ? opts.negationSymbol.front : "+",
	                            caret: pos + 1,
	                            insert: {
	                                pos: maskset.buffer.length,
	                                c: opts.negationSymbol.back
	                            }
	                        } : {
	                            pos: pos,
	                            c: "-" === chrs ? opts.negationSymbol.front : "+",
	                            caret: pos + 1
	                        })), isValid;
	                    },
	                    cardinality: 1,
	                    placeholder: ""
	                },
	                "-": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        return !isValid && strict && opts.allowMinus && chrs === opts.negationSymbol.back && (isValid = !0), 
	                        isValid;
	                    },
	                    cardinality: 1,
	                    placeholder: ""
	                },
	                ":": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        if (!isValid) {
	                            var radix = "[" + Inputmask.escapeRegex(opts.radixPoint) + "]";
	                            isValid = new RegExp(radix).test(chrs), isValid && maskset.validPositions[pos] && maskset.validPositions[pos].match.placeholder === opts.radixPoint && (isValid = {
	                                caret: pos + 1
	                            });
	                        }
	                        return isValid ? {
	                            c: opts.radixPoint
	                        } : isValid;
	                    },
	                    cardinality: 1,
	                    placeholder: function(opts) {
	                        return opts.radixPoint;
	                    }
	                }
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                if ("" === unmaskedValue && opts.nullable === !0) return unmaskedValue;
	                var processValue = maskedValue.replace(opts.prefix, "");
	                return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                opts.unmaskAsNumber ? ("" !== opts.radixPoint && processValue.indexOf(opts.radixPoint) !== -1 && (processValue = processValue.replace(Inputmask.escapeRegex.call(this, opts.radixPoint), ".")), 
	                Number(processValue)) : processValue;
	            },
	            isComplete: function(buffer, opts) {
	                var maskedValue = buffer.join(""), bufClone = buffer.slice();
	                if (opts.postFormat(bufClone, 0, opts), bufClone.join("") !== maskedValue) return !1;
	                var processValue = maskedValue.replace(opts.prefix, "");
	                return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                "," === opts.radixPoint && (processValue = processValue.replace(Inputmask.escapeRegex(opts.radixPoint), ".")), 
	                isFinite(processValue);
	            },
	            onBeforeMask: function(initialValue, opts) {
	                if (opts.numericInput === !0 && (initialValue = initialValue.split("").reverse().join("")), 
	                "" !== opts.radixPoint && isFinite(initialValue)) initialValue = initialValue.toString().replace(".", opts.radixPoint); else {
	                    var kommaMatches = initialValue.match(/,/g), dotMatches = initialValue.match(/\./g);
	                    dotMatches && kommaMatches ? dotMatches.length > kommaMatches.length ? (initialValue = initialValue.replace(/\./g, ""), 
	                    initialValue = initialValue.replace(",", opts.radixPoint)) : kommaMatches.length > dotMatches.length ? (initialValue = initialValue.replace(/,/g, ""), 
	                    initialValue = initialValue.replace(".", opts.radixPoint)) : initialValue = initialValue.indexOf(".") < initialValue.indexOf(",") ? initialValue.replace(/\./g, "") : initialValue = initialValue.replace(/,/g, "") : initialValue = initialValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), "");
	                }
	                if (0 === opts.digits && (initialValue.indexOf(".") !== -1 ? initialValue = initialValue.substring(0, initialValue.indexOf(".")) : initialValue.indexOf(",") !== -1 && (initialValue = initialValue.substring(0, initialValue.indexOf(",")))), 
	                "" !== opts.radixPoint && isFinite(opts.digits) && initialValue.indexOf(opts.radixPoint) !== -1) {
	                    var valueParts = initialValue.split(opts.radixPoint), decPart = valueParts[1].match(new RegExp("\\d*"))[0];
	                    if (parseInt(opts.digits) < decPart.toString().length) {
	                        var digitsFactor = Math.pow(10, parseInt(opts.digits));
	                        initialValue = initialValue.replace(Inputmask.escapeRegex(opts.radixPoint), "."), 
	                        initialValue = Math.round(parseFloat(initialValue) * digitsFactor) / digitsFactor, 
	                        initialValue = initialValue.toString().replace(".", opts.radixPoint);
	                    }
	                }
	                return opts.numericInput === !0 && (initialValue = initialValue.split("").reverse().join("")), 
	                initialValue.toString();
	            },
	            canClearPosition: function(maskset, position, lvp, strict, opts) {
	                var positionInput = maskset.validPositions[position].input, canClear = positionInput !== opts.radixPoint || null !== maskset.validPositions[position].match.fn && opts.decimalProtect === !1 || isFinite(positionInput) || position === lvp || positionInput === opts.groupSeparator || positionInput === opts.negationSymbol.front || positionInput === opts.negationSymbol.back;
	                return canClear;
	            },
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey) switch (e.keyCode) {
	                  case Inputmask.keyCode.UP:
	                    $input.val(parseFloat(this.inputmask.unmaskedvalue()) + parseInt(opts.step)), $input.trigger("setvalue");
	                    break;
	
	                  case Inputmask.keyCode.DOWN:
	                    $input.val(parseFloat(this.inputmask.unmaskedvalue()) - parseInt(opts.step)), $input.trigger("setvalue");
	                }
	            }
	        },
	        currency: {
	            prefix: "$ ",
	            groupSeparator: ",",
	            alias: "numeric",
	            placeholder: "0",
	            autoGroup: !0,
	            digits: 2,
	            digitsOptional: !1,
	            clearMaskOnLostFocus: !1
	        },
	        decimal: {
	            alias: "numeric"
	        },
	        integer: {
	            alias: "numeric",
	            digits: 0,
	            radixPoint: ""
	        },
	        percentage: {
	            alias: "numeric",
	            digits: 2,
	            radixPoint: ".",
	            placeholder: "0",
	            autoGroup: !1,
	            min: 0,
	            max: 100,
	            suffix: " %",
	            allowPlus: !1,
	            allowMinus: !1
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendAliases({
	        abstractphone: {
	            countrycode: "",
	            phoneCodes: [],
	            mask: function(opts) {
	                opts.definitions = {
	                    "#": opts.definitions[9]
	                };
	                var masks = opts.phoneCodes.sort(function(a, b) {
	                    var maska = (a.mask || a).replace(/#/g, "9").replace(/[\+\(\)#-]/g, ""), maskb = (b.mask || b).replace(/#/g, "9").replace(/[\+\(\)#-]/g, ""), maskas = (a.mask || a).split("#")[0], maskbs = (b.mask || b).split("#")[0];
	                    return 0 === maskbs.indexOf(maskas) ? -1 : 0 === maskas.indexOf(maskbs) ? 1 : maska.localeCompare(maskb);
	                });
	                return masks;
	            },
	            keepStatic: !0,
	            onBeforeMask: function(value, opts) {
	                var processedValue = value.replace(/^0{1,2}/, "").replace(/[\s]/g, "");
	                return (processedValue.indexOf(opts.countrycode) > 1 || processedValue.indexOf(opts.countrycode) === -1) && (processedValue = "+" + opts.countrycode + processedValue), 
	                processedValue;
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                return unmaskedValue;
	            }
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendAliases({
	        Regex: {
	            mask: "r",
	            greedy: !1,
	            repeat: "*",
	            regex: null,
	            regexTokens: null,
	            tokenizer: /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
	            quantifierFilter: /[0-9]+[^,]/,
	            isComplete: function(buffer, opts) {
	                return new RegExp(opts.regex).test(buffer.join(""));
	            },
	            definitions: {
	                r: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        function RegexToken(isGroup, isQuantifier) {
	                            this.matches = [], this.isGroup = isGroup || !1, this.isQuantifier = isQuantifier || !1, 
	                            this.quantifier = {
	                                min: 1,
	                                max: 1
	                            }, this.repeaterPart = void 0;
	                        }
	                        function analyseRegex() {
	                            var match, m, currentToken = new RegexToken(), opengroups = [];
	                            for (opts.regexTokens = []; match = opts.tokenizer.exec(opts.regex); ) switch (m = match[0], 
	                            m.charAt(0)) {
	                              case "(":
	                                opengroups.push(new RegexToken((!0)));
	                                break;
	
	                              case ")":
	                                groupToken = opengroups.pop(), opengroups.length > 0 ? opengroups[opengroups.length - 1].matches.push(groupToken) : currentToken.matches.push(groupToken);
	                                break;
	
	                              case "{":
	                              case "+":
	                              case "*":
	                                var quantifierToken = new RegexToken((!1), (!0));
	                                m = m.replace(/[{}]/g, "");
	                                var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
	                                if (quantifierToken.quantifier = {
	                                    min: mq0,
	                                    max: mq1
	                                }, opengroups.length > 0) {
	                                    var matches = opengroups[opengroups.length - 1].matches;
	                                    match = matches.pop(), match.isGroup || (groupToken = new RegexToken((!0)), groupToken.matches.push(match), 
	                                    match = groupToken), matches.push(match), matches.push(quantifierToken);
	                                } else match = currentToken.matches.pop(), match.isGroup || (groupToken = new RegexToken((!0)), 
	                                groupToken.matches.push(match), match = groupToken), currentToken.matches.push(match), 
	                                currentToken.matches.push(quantifierToken);
	                                break;
	
	                              default:
	                                opengroups.length > 0 ? opengroups[opengroups.length - 1].matches.push(m) : currentToken.matches.push(m);
	                            }
	                            currentToken.matches.length > 0 && opts.regexTokens.push(currentToken);
	                        }
	                        function validateRegexToken(token, fromGroup) {
	                            var isvalid = !1;
	                            fromGroup && (regexPart += "(", openGroupCount++);
	                            for (var mndx = 0; mndx < token.matches.length; mndx++) {
	                                var matchToken = token.matches[mndx];
	                                if (matchToken.isGroup === !0) isvalid = validateRegexToken(matchToken, !0); else if (matchToken.isQuantifier === !0) {
	                                    var crrntndx = $.inArray(matchToken, token.matches), matchGroup = token.matches[crrntndx - 1], regexPartBak = regexPart;
	                                    if (isNaN(matchToken.quantifier.max)) {
	                                        for (;matchToken.repeaterPart && matchToken.repeaterPart !== regexPart && matchToken.repeaterPart.length > regexPart.length && !(isvalid = validateRegexToken(matchGroup, !0)); ) ;
	                                        isvalid = isvalid || validateRegexToken(matchGroup, !0), isvalid && (matchToken.repeaterPart = regexPart), 
	                                        regexPart = regexPartBak + matchToken.quantifier.max;
	                                    } else {
	                                        for (var i = 0, qm = matchToken.quantifier.max - 1; i < qm && !(isvalid = validateRegexToken(matchGroup, !0)); i++) ;
	                                        regexPart = regexPartBak + "{" + matchToken.quantifier.min + "," + matchToken.quantifier.max + "}";
	                                    }
	                                } else if (void 0 !== matchToken.matches) for (var k = 0; k < matchToken.length && !(isvalid = validateRegexToken(matchToken[k], fromGroup)); k++) ; else {
	                                    var testExp;
	                                    if ("[" == matchToken.charAt(0)) {
	                                        testExp = regexPart, testExp += matchToken;
	                                        for (var j = 0; j < openGroupCount; j++) testExp += ")";
	                                        var exp = new RegExp("^(" + testExp + ")$");
	                                        isvalid = exp.test(bufferStr);
	                                    } else for (var l = 0, tl = matchToken.length; l < tl; l++) if ("\\" !== matchToken.charAt(l)) {
	                                        testExp = regexPart, testExp += matchToken.substr(0, l + 1), testExp = testExp.replace(/\|$/, "");
	                                        for (var j = 0; j < openGroupCount; j++) testExp += ")";
	                                        var exp = new RegExp("^(" + testExp + ")$");
	                                        if (isvalid = exp.test(bufferStr)) break;
	                                    }
	                                    regexPart += matchToken;
	                                }
	                                if (isvalid) break;
	                            }
	                            return fromGroup && (regexPart += ")", openGroupCount--), isvalid;
	                        }
	                        var bufferStr, groupToken, cbuffer = maskset.buffer.slice(), regexPart = "", isValid = !1, openGroupCount = 0;
	                        null === opts.regexTokens && analyseRegex(), cbuffer.splice(pos, 0, chrs), bufferStr = cbuffer.join("");
	                        for (var i = 0; i < opts.regexTokens.length; i++) {
	                            var regexToken = opts.regexTokens[i];
	                            if (isValid = validateRegexToken(regexToken, regexToken.isGroup)) break;
	                        }
	                        return isValid;
	                    },
	                    cardinality: 1
	                }
	            }
	        }
	    }), Inputmask;
	}(jQuery, Inputmask);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {/* =========================================================
	 * bootstrap-datepicker.js
	 * Repo: https://github.com/eternicode/bootstrap-datepicker/
	 * Demo: https://eternicode.github.io/bootstrap-datepicker/
	 * Docs: https://bootstrap-datepicker.readthedocs.org/
	 * Forked from http://www.eyecon.ro/bootstrap-datepicker
	 * =========================================================
	 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 * ========================================================= */
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DPGlobal = {};
	var localeOpts = ['format', 'rtl', 'weekStart'];
	
	var dates = {
	    en: {
	        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	        daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	        daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	        today: 'Today',
	        clear: 'Clear',
	        titleFormat: 'MM yyyy'
	    }
	};
	
	var defaults = {
	    assumeNearbyYear: false,
	    autoclose: false,
	    beforeShowDay: $.noop,
	    beforeShowMonth: $.noop,
	    beforeShowYear: $.noop,
	    beforeShowDecade: $.noop,
	    beforeShowCentury: $.noop,
	    calendarWeeks: false,
	    clearBtn: false,
	    toggleActive: false,
	    daysOfWeekDisabled: [],
	    daysOfWeekHighlighted: [],
	    datesDisabled: [],
	    endDate: Infinity,
	    forceParse: true,
	    format: 'mm/dd/yyyy',
	    keepEmptyValues: false,
	    keyboardNavigation: true,
	    language: 'en',
	    minViewMode: 0,
	    maxViewMode: 4,
	    multidate: false,
	    multidateSeparator: ',',
	    orientation: 'auto',
	    rtl: false,
	    startDate: -Infinity,
	    startView: 0,
	    todayBtn: false,
	    todayHighlight: false,
	    weekStart: 0,
	    disableTouchKeyboard: false,
	    enableOnReadonly: true,
	    showOnFocus: true,
	    zIndexOffset: 10,
	    container: 'body',
	    immediateUpdates: false,
	    dateCells: false,
	    title: '',
	    templates: {
	        leftArrow: '&laquo;',
	        rightArrow: '&raquo;'
	    }
	};
	
	function UTCDate() {
	    return new Date(Date.UTC.apply(Date, arguments));
	}
	
	function UTCToday() {
	    var today = new Date();
	    return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	
	function isUTCEquals(date1, date2) {
	    return date1.getUTCFullYear() === date2.getUTCFullYear() && date1.getUTCMonth() === date2.getUTCMonth() && date1.getUTCDate() === date2.getUTCDate();
	}
	
	function alias(method) {
	    return function () {
	        return this[method].apply(this, arguments);
	    };
	}
	
	function isValidDate(d) {
	    return d && !isNaN(d.getTime());
	}
	
	var DateArray = function () {
	    var extras = {
	        get: function get(i) {
	            return this.slice(i)[0];
	        },
	        contains: function contains(d) {
	            // Array.indexOf is not cross-browser;
	            // $.inArray doesn't work with Dates
	            var val = d && d.valueOf();
	            for (var i = 0, l = this.length; i < l; i++) {
	                if (this[i].valueOf() - val >= 0 && this[i].valueOf() - val < 1000 * 60 * 60 * 24) {
	                    return i;
	                }
	            }
	            // Use date arithmetic to allow dates with different times to match
	            return -1;
	        },
	        remove: function remove(i) {
	            this.splice(i, 1);
	        },
	        replace: function replace(newArray) {
	            if (!newArray) {
	                return;
	            }
	            if (!$.isArray(newArray)) {
	                newArray = [newArray];
	            }
	            this.clear();
	            this.push.apply(this, newArray);
	        },
	        clear: function clear() {
	            this.length = 0;
	        },
	        copy: function copy() {
	            var a = new DateArray();
	            a.replace(this);
	            return a;
	        }
	    };
	
	    return function () {
	        var a = [];
	        a.push.apply(a, arguments);
	        $.extend(a, extras);
	        return a;
	    };
	}();
	
	var Datepicker = function () {
	    function Datepicker(element, options) {
	        _classCallCheck(this, Datepicker);
	
	        $(element).data('datepicker', this);
	        this._processOptions(options);
	
	        this.dates = new DateArray();
	        this.viewDate = this.o.defaultViewDate;
	        this.focusDate = null;
	
	        this.element = $(element);
	        this.isInput = this.element.is('input');
	        this.inputField = this.isInput ? this.element : this.element.find('input');
	        this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
	        this.hasInput = this.component && this.inputField.length;
	        if (this.component && this.component.length === 0) {
	            this.component = false;
	        }
	
	        this.isInline = !this.component && this.element.is('div');
	
	        this.picker = $(DPGlobal.template);
	
	        // Checking templates and inserting
	        if (this._checkTemplate(this.o.templates.leftArrow)) {
	            this.picker.find('.prev').html(this.o.templates.leftArrow);
	        }
	        if (this._checkTemplate(this.o.templates.rightArrow)) {
	            this.picker.find('.next').html(this.o.templates.rightArrow);
	        }
	
	        this._buildEvents();
	        this._attachEvents();
	
	        if (this.isInline) {
	            this.picker.addClass('datepicker-inline').appendTo(this.element);
	        } else {
	            this.picker.addClass('datepicker-dropdown dropdown-menu');
	        }
	
	        if (this.o.rtl) {
	            this.picker.addClass('datepicker-rtl');
	        }
	
	        this.viewMode = this.o.startView;
	
	        if (this.o.calendarWeeks) {
	            this.picker.find('thead .datepicker-title, tfoot .today, tfoot .clear').attr('colspan', function (i, val) {
	                return parseInt(val, 10) + 1;
	            });
	        }
	
	        this._allow_update = false;
	
	        this.setStartDate(this._o.startDate);
	        this.setEndDate(this._o.endDate);
	        this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
	        this.setDaysOfWeekHighlighted(this.o.daysOfWeekHighlighted);
	        this.setDatesDisabled(this.o.datesDisabled);
	
	        this.fillDow();
	        this.fillMonths();
	
	        this._allow_update = true;
	
	        this.update();
	        this.showMode();
	
	        if (this.isInline) {
	            this.show();
	        }
	    }
	
	    _createClass(Datepicker, [{
	        key: '_resolveViewName',
	        value: function _resolveViewName(view, defaultValue) {
	            if (view === 0 || view === 'days' || view === 'month') {
	                return 0;
	            }
	            if (view === 1 || view === 'months' || view === 'year') {
	                return 1;
	            }
	            if (view === 2 || view === 'years' || view === 'decade') {
	                return 2;
	            }
	            if (view === 3 || view === 'decades' || view === 'century') {
	                return 3;
	            }
	            if (view === 4 || view === 'centuries' || view === 'millennium') {
	                return 4;
	            }
	            return defaultValue === undefined ? false : defaultValue;
	        }
	    }, {
	        key: '_checkTemplate',
	        value: function _checkTemplate(tmp) {
	            try {
	                // If empty
	                if (tmp === undefined || tmp === '') {
	                    return false;
	                }
	                // If no html, everything ok
	                if ((tmp.match(/[<>]/g) || []).length <= 0) {
	                    return true;
	                }
	                // Checking if html is fine
	                var jDom = $(tmp);
	                return jDom.length > 0;
	            } catch (ex) {
	                return false;
	            }
	        }
	    }, {
	        key: '_processOptions',
	        value: function _processOptions(opts) {
	            // Store raw options for reference
	            this._o = $.extend({}, this._o, opts);
	            // Processed options
	            var o = this.o = $.extend({}, this._o);
	
	            // Check if "de-DE" style date is available, if not language should
	            // fallback to 2 letter code eg "de"
	            var lang = o.language;
	            if (!dates[lang]) {
	                lang = lang.split('-')[0];
	                if (!dates[lang]) {
	                    lang = defaults.language;
	                }
	            }
	            o.language = lang;
	
	            // Retrieve view index from any aliases
	            o.startView = this._resolveViewName(o.startView, 0);
	            o.minViewMode = this._resolveViewName(o.minViewMode, 0);
	            o.maxViewMode = this._resolveViewName(o.maxViewMode, 4);
	
	            // Check that the start view is between min and max
	            o.startView = Math.min(o.startView, o.maxViewMode);
	            o.startView = Math.max(o.startView, o.minViewMode);
	
	            // true, false, or Number > 0
	            if (o.multidate !== true) {
	                o.multidate = Number(o.multidate) || false;
	                if (o.multidate !== false) {
	                    o.multidate = Math.max(0, o.multidate);
	                }
	            }
	            o.multidateSeparator = String(o.multidateSeparator);
	
	            o.weekStart %= 7;
	            o.weekEnd = (o.weekStart + 6) % 7;
	
	            var format = DPGlobal.parseFormat(o.format);
	            if (o.startDate !== -Infinity) {
	                if (!!o.startDate) {
	                    if (o.startDate instanceof Date) {
	                        o.startDate = this._localToUtc(this._zeroTime(o.startDate));
	                    } else {
	                        o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
	                    }
	                } else {
	                    o.startDate = -Infinity;
	                }
	            }
	            if (o.endDate !== Infinity) {
	                if (!!o.endDate) {
	                    if (o.endDate instanceof Date) {
	                        o.endDate = this._localToUtc(this._zeroTime(o.endDate));
	                    } else {
	                        o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
	                    }
	                } else {
	                    o.endDate = Infinity;
	                }
	            }
	
	            o.daysOfWeekDisabled = o.daysOfWeekDisabled || [];
	            if (!$.isArray(o.daysOfWeekDisabled)) {
	                o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
	            }
	            o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
	                return parseInt(d, 10);
	            });
	
	            o.daysOfWeekHighlighted = o.daysOfWeekHighlighted || [];
	            if (!$.isArray(o.daysOfWeekHighlighted)) {
	                o.daysOfWeekHighlighted = o.daysOfWeekHighlighted.split(/[,\s]*/);
	            }
	            o.daysOfWeekHighlighted = $.map(o.daysOfWeekHighlighted, function (d) {
	                return parseInt(d, 10);
	            });
	
	            o.datesDisabled = o.datesDisabled || [];
	            if (!$.isArray(o.datesDisabled)) {
	                o.datesDisabled = [o.datesDisabled];
	            }
	            o.datesDisabled = $.map(o.datesDisabled, function (d) {
	                return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
	            });
	
	            var plc = String(o.orientation).toLowerCase().split(/\s+/g);
	            var _plc = o.orientation.toLowerCase();
	            plc = $.grep(plc, function (word) {
	                return (/^auto|left|right|top|bottom$/.test(word)
	                );
	            });
	            o.orientation = { x: 'auto', y: 'auto' };
	            if (!_plc || _plc === 'auto') {
	                // no action
	            } else if (plc.length === 1) {
	                switch (plc[0]) {
	                    case 'top':
	                    case 'bottom':
	                        o.orientation.y = plc[0];
	                        break;
	                    case 'left':
	                    case 'right':
	                        o.orientation.x = plc[0];
	                        break;
	                }
	            } else {
	                _plc = $.grep(plc, function (word) {
	                    return (/^left|right$/.test(word)
	                    );
	                });
	                o.orientation.x = _plc[0] || 'auto';
	
	                _plc = $.grep(plc, function (word) {
	                    return (/^top|bottom$/.test(word)
	                    );
	                });
	                o.orientation.y = _plc[0] || 'auto';
	            }
	            if (o.defaultViewDate) {
	                var year = o.defaultViewDate.year || new Date().getFullYear();
	                var month = o.defaultViewDate.month || 0;
	                var day = o.defaultViewDate.day || 1;
	                o.defaultViewDate = UTCDate(year, month, day);
	            } else {
	                o.defaultViewDate = UTCToday();
	            }
	        }
	    }, {
	        key: '_applyEvents',
	        value: function _applyEvents(evs) {
	            for (var i = 0, el, ch, ev; i < evs.length; i++) {
	                el = evs[i][0];
	                if (evs[i].length === 2) {
	                    ch = undefined;
	                    ev = evs[i][1];
	                } else if (evs[i].length === 3) {
	                    ch = evs[i][1];
	                    ev = evs[i][2];
	                }
	                el.on(ev, ch);
	            }
	        }
	    }, {
	        key: '_unapplyEvents',
	        value: function _unapplyEvents(evs) {
	            for (var i = 0, el, ev, ch; i < evs.length; i++) {
	                el = evs[i][0];
	                if (evs[i].length === 2) {
	                    ch = undefined;
	                    ev = evs[i][1];
	                } else if (evs[i].length === 3) {
	                    ch = evs[i][1];
	                    ev = evs[i][2];
	                }
	                el.off(ev, ch);
	            }
	        }
	    }, {
	        key: '_buildEvents',
	        value: function _buildEvents() {
	            var events = {
	                keyup: $.proxy(function (e) {
	                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1) {
	                        this.update();
	                    }
	                }, this),
	                keydown: $.proxy(this.keydown, this),
	                paste: $.proxy(this.paste, this)
	            };
	
	            if (this.o.showOnFocus === true) {
	                events.focus = $.proxy(this.show, this);
	            }
	
	            if (this.isInput) {
	                // single input
	                this._events = [[this.element, events]];
	            } else if (this.component && this.hasInput) {
	                // component: input + button
	                this._events = [
	                // For components that are not readonly, allow keyboard nav
	                [this.inputField, events], [this.component, {
	                    click: $.proxy(this.show, this)
	                }]];
	            } else {
	                this._events = [[this.element, {
	                    click: $.proxy(this.show, this),
	                    keydown: $.proxy(this.keydown, this)
	                }]];
	            }
	            this._events.push(
	            // Component: listen for blur on element descendants
	            [this.element, '*', {
	                blur: $.proxy(function (e) {
	                    this._focused_from = e.target;
	                }, this)
	            }],
	            // Input: listen for blur on element
	            [this.element, {
	                blur: $.proxy(function (e) {
	                    this._focused_from = e.target;
	                }, this)
	            }]);
	
	            if (this.o.immediateUpdates) {
	                // Trigger input updates immediately on changed year/month
	                this._events.push([this.element, {
	                    'changeYear changeMonth': $.proxy(function (e) {
	                        this.update(e.date);
	                    }, this)
	                }]);
	            }
	
	            this._secondaryEvents = [[this.picker, {
	                click: $.proxy(this.click, this)
	            }], [$(window), {
	                resize: $.proxy(this.place, this)
	            }], [$(document), {
	                mousedown: $.proxy(function (e) {
	                    // Clicked outside the datepicker, hide it
	                    if (!(this.element.is(e.target) || this.element.find(e.target).length || this.picker.is(e.target) || this.picker.find(e.target).length || this.isInline)) {
	                        this.hide();
	                    }
	                }, this)
	            }]];
	        }
	    }, {
	        key: '_attachEvents',
	        value: function _attachEvents() {
	            this._detachEvents();
	            this._applyEvents(this._events);
	        }
	    }, {
	        key: '_detachEvents',
	        value: function _detachEvents() {
	            this._unapplyEvents(this._events);
	        }
	    }, {
	        key: '_attachSecondaryEvents',
	        value: function _attachSecondaryEvents() {
	            this._detachSecondaryEvents();
	            this._applyEvents(this._secondaryEvents);
	        }
	    }, {
	        key: '_detachSecondaryEvents',
	        value: function _detachSecondaryEvents() {
	            this._unapplyEvents(this._secondaryEvents);
	        }
	    }, {
	        key: '_trigger',
	        value: function _trigger(event, altdate) {
	            var date = altdate || this.dates.get(-1);
	            var localDate = this._utcToLocal(date);
	
	            this.element.trigger({
	                type: event,
	                date: localDate,
	                dates: $.map(this.dates, this._utcToLocal),
	                format: $.proxy(function (ix, format) {
	                    if (arguments.length === 0) {
	                        ix = this.dates.length - 1;
	                        format = this.o.format;
	                    } else if (typeof ix === 'string') {
	                        format = ix;
	                        ix = this.dates.length - 1;
	                    }
	                    format = format || this.o.format;
	                    return DPGlobal.formatDate(this.dates.get(ix), format, this.o.language);
	                }, this)
	            });
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            if (this.inputField.prop('disabled') || this.inputField.prop('readonly') && this.o.enableOnReadonly === false) {
	                return;
	            }
	            if (!this.isInline) {
	                this.picker.appendTo(this.o.container);
	            }
	            this.place();
	            this.picker.show();
	            this._attachSecondaryEvents();
	            this._trigger('show');
	            if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
	                $(this.element).blur();
	            }
	            return this;
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            if (this.isInline || !this.picker.is(':visible')) {
	                return this;
	            }
	            this.focusDate = null;
	            this.picker.hide().detach();
	            this._detachSecondaryEvents();
	            this.viewMode = this.o.startView;
	            this.showMode();
	
	            if (this.o.forceParse && this.inputField.val()) {
	                this.setValue();
	            }
	            this._trigger('hide');
	            return this;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.hide();
	            this._detachEvents();
	            this._detachSecondaryEvents();
	            this.picker.remove();
	            delete this.element.data().datepicker;
	            if (!this.isInput) {
	                delete this.element.data().date;
	            }
	            return this;
	        }
	    }, {
	        key: 'paste',
	        value: function paste(evt) {
	            var dateString;
	            if (evt.originalEvent.clipboardData && evt.originalEvent.clipboardData.types && $.inArray('text/plain', evt.originalEvent.clipboardData.types) !== -1) {
	                dateString = evt.originalEvent.clipboardData.getData('text/plain');
	            } else if (window.clipboardData) {
	                dateString = window.clipboardData.getData('Text');
	            } else {
	                return;
	            }
	            this.setDate(dateString);
	            this.update();
	            evt.preventDefault();
	        }
	    }, {
	        key: '_utcToLocal',
	        value: function _utcToLocal(utc) {
	            return utc && new Date(utc.getTime() + utc.getTimezoneOffset() * 60000);
	        }
	    }, {
	        key: '_localToUtc',
	        value: function _localToUtc(local) {
	            return local && new Date(local.getTime() - local.getTimezoneOffset() * 60000);
	        }
	    }, {
	        key: '_zeroTime',
	        value: function _zeroTime(local) {
	            return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
	        }
	    }, {
	        key: '_zeroUtcTime',
	        value: function _zeroUtcTime(utc) {
	            return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
	        }
	    }, {
	        key: 'getDates',
	        value: function getDates() {
	            return $.map(this.dates, this._utcToLocal);
	        }
	    }, {
	        key: 'getUTCDates',
	        value: function getUTCDates() {
	            return $.map(this.dates, function (d) {
	                return new Date(d);
	            });
	        }
	    }, {
	        key: 'getDate',
	        value: function getDate() {
	            return this._utcToLocal(this.getUTCDate());
	        }
	
	        /**
	         * Return the currently used internal date.
	         */
	
	    }, {
	        key: 'getUTCDate',
	        value: function getUTCDate() {
	            var selectedDate = this.dates.get(-1);
	            if (typeof selectedDate !== 'undefined') {
	                return new Date(selectedDate);
	            }
	            throw new Error('this.dates should be set!');
	        }
	    }, {
	        key: 'clearDates',
	        value: function clearDates() {
	            if (this.inputField) {
	                this.inputField.val('');
	            }
	
	            this.update();
	            this._trigger('changeDate');
	
	            if (this.o.autoclose) {
	                this.hide();
	            }
	        }
	    }, {
	        key: 'setDates',
	        value: function setDates() {
	            var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
	            this.update.apply(this, args);
	            this._trigger('changeDate');
	            this.setValue();
	            return this;
	        }
	    }, {
	        key: 'setUTCDates',
	        value: function setUTCDates() {
	            var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
	            this.update.apply(this, $.map(args, this._utcToLocal));
	            this._trigger('changeDate');
	            this.setValue();
	            return this;
	        }
	    }, {
	        key: 'setValue',
	        value: function setValue() {
	            var formatted = this.getFormattedDate();
	            this.inputField.val(formatted);
	            return this;
	        }
	    }, {
	        key: 'getFormattedDate',
	        value: function getFormattedDate(format) {
	            var _this = this;
	
	            if (format === undefined) {
	                format = this.o.format;
	            }
	
	            return $.map(this.dates, function (d) {
	                return DPGlobal.formatDate(d, format, _this.o.language);
	            }).join(this.o.multidateSeparator);
	        }
	    }, {
	        key: 'getStartDate',
	        value: function getStartDate() {
	            return this.o.startDate;
	        }
	    }, {
	        key: 'setStartDate',
	        value: function setStartDate(startDate) {
	            this._processOptions({ startDate: startDate });
	            this.update();
	            this.updateNavArrows();
	            return this;
	        }
	    }, {
	        key: 'getEndDate',
	        value: function getEndDate() {
	            return this.o.endDate;
	        }
	    }, {
	        key: 'setEndDate',
	        value: function setEndDate(endDate) {
	            this._processOptions({ endDate: endDate });
	            this.update();
	            this.updateNavArrows();
	            return this;
	        }
	    }, {
	        key: 'setDaysOfWeekDisabled',
	        value: function setDaysOfWeekDisabled(daysOfWeekDisabled) {
	            this._processOptions({ daysOfWeekDisabled: daysOfWeekDisabled });
	            this.update();
	            this.updateNavArrows();
	            return this;
	        }
	    }, {
	        key: 'setDaysOfWeekHighlighted',
	        value: function setDaysOfWeekHighlighted(daysOfWeekHighlighted) {
	            this._processOptions({ daysOfWeekHighlighted: daysOfWeekHighlighted });
	            this.update();
	            return this;
	        }
	    }, {
	        key: 'setDatesDisabled',
	        value: function setDatesDisabled(datesDisabled) {
	            this._processOptions({ datesDisabled: datesDisabled });
	            this.update();
	            this.updateNavArrows();
	            return this;
	        }
	    }, {
	        key: 'place',
	        value: function place() {
	            if (this.isInline) {
	                return this;
	            }
	            var calendarWidth = this.picker.outerWidth();
	            var calendarHeight = this.picker.outerHeight();
	            var visualPadding = 10;
	            var container = $(this.o.container);
	            var windowWidth = container.width();
	            var scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop();
	            var appendOffset = container.offset();
	
	            var parentsZindex = [];
	            this.element.parents().each(function () {
	                var itemZIndex = $(this).css('z-index');
	                if (itemZIndex !== 'auto' && itemZIndex !== 0) {
	                    parentsZindex.push(parseInt(itemZIndex, 10));
	                }
	            });
	            var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
	            var offset = this.component ? this.component.parent().offset() : this.element.offset();
	            var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
	            var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
	            var left = offset.left - appendOffset.left;
	            var top = offset.top - appendOffset.top;
	
	            if (this.o.container !== 'body') {
	                top += scrollTop;
	            }
	
	            this.picker.removeClass('datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left');
	
	            if (this.o.orientation.x !== 'auto') {
	                this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
	                if (this.o.orientation.x === 'right') {
	                    left -= calendarWidth - width;
	                }
	            } else {
	                // auto x orientation is best-placement: if it crosses a window
	                // edge, fudge it sideways
	                if (offset.left < 0) {
	                    // component is outside the window on the left side. Move it into visible range
	                    this.picker.addClass('datepicker-orient-left');
	                    left -= offset.left - visualPadding;
	                } else if (left + calendarWidth > windowWidth) {
	                    // the calendar passes the widow right edge. Align it to component right side
	                    this.picker.addClass('datepicker-orient-right');
	                    left += width - calendarWidth;
	                } else {
	                    // Default to left
	                    this.picker.addClass('datepicker-orient-left');
	                }
	            }
	
	            // auto y orientation is best-situation: top or bottom, no fudging,
	            // decision based on which shows more of the calendar
	            var yorient = this.o.orientation.y;
	            var topOverflow = void 0;
	            if (yorient === 'auto') {
	                topOverflow = -scrollTop + top - calendarHeight;
	                yorient = topOverflow < 0 ? 'bottom' : 'top';
	            }
	
	            this.picker.addClass('datepicker-orient-' + yorient);
	            if (yorient === 'top') {
	                top -= calendarHeight + parseInt(this.picker.css('padding-top'), 10);
	            } else {
	                top += height;
	            }
	
	            if (this.o.rtl) {
	                var right = windowWidth - (left + width);
	                this.picker.css({
	                    top: top,
	                    right: right,
	                    zIndex: zIndex
	                });
	            } else {
	                this.picker.css({
	                    top: top,
	                    left: left,
	                    zIndex: zIndex
	                });
	            }
	            return this;
	        }
	    }, {
	        key: 'update',
	        value: function update() {
	            if (!this._allow_update) {
	                return this;
	            }
	
	            var oldDates = this.dates.copy();
	            var _dates = [];
	            var fromArgs = false;
	
	            if (arguments.length) {
	                $.each(arguments, $.proxy(function (i, date) {
	                    if (date instanceof Date) {
	                        date = this._localToUtc(date);
	                    }
	                    _dates.push(date);
	                }, this));
	                fromArgs = true;
	            } else {
	                _dates = this.isInput ? this.element.val() : this.element.data('date') || this.inputField.val();
	                if (_dates && this.o.multidate) {
	                    _dates = _dates.split(this.o.multidateSeparator);
	                } else {
	                    _dates = [_dates];
	                }
	                delete this.element.data().date;
	            }
	
	            _dates = $.map(_dates, $.proxy(function (date) {
	                return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
	            }, this));
	            _dates = $.grep(_dates, $.proxy(function (date) {
	                return !this.dateWithinRange(date) || !date;
	            }, this), true);
	            this.dates.replace(_dates);
	
	            if (this.dates.length) {
	                this.viewDate = new Date(this.dates.get(-1));
	            } else if (this.viewDate < this.o.startDate) {
	                this.viewDate = new Date(this.o.startDate);
	            } else if (this.viewDate > this.o.endDate) {
	                this.viewDate = new Date(this.o.endDate);
	            } else {
	                this.viewDate = this.o.defaultViewDate;
	            }
	            if (fromArgs) {
	                // setting date by clicking
	                this.setValue();
	            } else if (_dates.length) {
	                // setting date by typing
	                if (String(oldDates) !== String(this.dates)) {
	                    this._trigger('changeDate');
	                }
	            }
	            if (!this.dates.length && oldDates.length) {
	                this._trigger('clearDate');
	            }
	
	            this.fill();
	            this.element.change();
	            return this;
	        }
	    }, {
	        key: 'fillDow',
	        value: function fillDow() {
	            var dowCnt = this.o.weekStart;
	            var html = '<tr class="header dow-row">';
	
	            if (this.o.calendarWeeks) {
	                this.picker.find('.datepicker-days .datepicker-switch').attr('colspan', function (i, val) {
	                    return parseInt(val, 10) + 1;
	                });
	                html += '<th class="cw">&#160;</th>';
	            }
	            while (dowCnt < this.o.weekStart + 7) {
	                html += '<th class="dow';
	                if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) > -1) {
	                    html += ' disabled';
	                }
	                html += '">' + dates[this.o.language].daysMin[dowCnt++ % 7] + '</th>';
	            }
	            html += '</tr>';
	            this.picker.find('.datepicker-days thead').append(html);
	        }
	    }, {
	        key: 'fillMonths',
	        value: function fillMonths() {
	            var localDate = this._utcToLocal(this.viewDate);
	            var html = '';
	            var i = 0;
	            while (i < 12) {
	                var focused = localDate && localDate.getMonth() === i ? ' focused' : '';
	                html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i++] + '</span>';
	            }
	            this.picker.find('.datepicker-months td').html(html);
	        }
	    }, {
	        key: 'setRange',
	        value: function setRange(range) {
	            if (!range || !range.length) {
	                delete this.range;
	            } else {
	                this.range = $.map(range, function (d) {
	                    return d.valueOf();
	                });
	            }
	            this.fill();
	        }
	    }, {
	        key: 'getClassNames',
	        value: function getClassNames(date) {
	            var cls = [];
	            var year = this.viewDate.getUTCFullYear();
	            var month = this.viewDate.getUTCMonth();
	            var today = new Date();
	            if (date.getUTCFullYear() < year || date.getUTCFullYear() === year && date.getUTCMonth() < month) {
	                cls.push('old');
	            } else if (date.getUTCFullYear() > year || date.getUTCFullYear() === year && date.getUTCMonth() > month) {
	                cls.push('new');
	            }
	
	            if (this.focusDate && date.valueOf() === this.focusDate.valueOf()) {
	                cls.push('focused');
	            }
	            // Compare internal UTC date with local today, not UTC today
	            if (this.o.todayHighlight && date.getUTCFullYear() === today.getFullYear() && date.getUTCMonth() === today.getMonth() && date.getUTCDate() === today.getDate()) {
	                cls.push('today');
	            }
	            if (this.dates.contains(date) !== -1) {
	                cls.push('active');
	            }
	            if (!this.dateWithinRange(date)) {
	                cls.push('disabled');
	            }
	            if (this.dateIsDisabled(date)) {
	                cls.push('disabled', 'disabled-date');
	            }
	            if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1) {
	                cls.push('highlighted');
	            }
	
	            if (this.range) {
	                if (date > this.range[0] && date < this.range[this.range.length - 1]) {
	                    cls.push('range');
	                }
	                if ($.inArray(date.valueOf(), this.range) !== -1) {
	                    cls.push('selected');
	                }
	                if (date.valueOf() === this.range[0]) {
	                    cls.push('range-start');
	                }
	                if (date.valueOf() === this.range[this.range.length - 1]) {
	                    cls.push('range-end');
	                }
	            }
	            return cls;
	        }
	    }, {
	        key: '_fillYearsView',
	        value: function _fillYearsView(selector, cssClass, factor, step, currentYear, startYear, endYear, callback) {
	            var html, view, year, steps, startStep, endStep, thisYear, i, classes, tooltip, before;
	
	            html = '';
	            view = this.picker.find(selector);
	            year = parseInt(currentYear / factor, 10) * factor;
	            startStep = parseInt(startYear / step, 10) * step;
	            endStep = parseInt(endYear / step, 10) * step;
	            steps = $.map(this.dates, function (d) {
	                return parseInt(d.getUTCFullYear() / step, 10) * step;
	            });
	
	            view.find('.datepicker-switch').text(year + '-' + (year + step * 9));
	
	            thisYear = year - step;
	            for (i = -1; i < 11; i += 1) {
	                classes = [cssClass];
	                tooltip = null;
	
	                if (i === -1) {
	                    classes.push('old');
	                } else if (i === 10) {
	                    classes.push('new');
	                }
	                if ($.inArray(thisYear, steps) !== -1) {
	                    classes.push('active');
	                }
	                if (thisYear < startStep || thisYear > endStep) {
	                    classes.push('disabled');
	                }
	                if (thisYear === this.viewDate.getFullYear()) {
	                    classes.push('focused');
	                }
	
	                if (callback !== $.noop) {
	                    before = callback(new Date(thisYear, 0, 1));
	                    if (before === undefined) {
	                        before = {};
	                    } else if (typeof before === 'boolean') {
	                        before = { enabled: before };
	                    } else if (typeof before === 'string') {
	                        before = { classes: before };
	                    }
	                    if (before.enabled === false) {
	                        classes.push('disabled');
	                    }
	                    if (before.classes) {
	                        classes = classes.concat(before.classes.split(/\s+/));
	                    }
	                    if (before.tooltip) {
	                        tooltip = before.tooltip;
	                    }
	                }
	
	                html += '<span class="' + classes.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + thisYear + '</span>';
	                thisYear += step;
	            }
	            view.find('td').html(html);
	        }
	    }, {
	        key: 'fill',
	        value: function fill() {
	            var _this2 = this;
	
	            var clsName = void 0,
	                tooltip = void 0,
	                before = void 0;
	            var d = new Date(this.viewDate);
	            var year = d.getUTCFullYear();
	            var month = d.getUTCMonth();
	            var startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity;
	            var startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity;
	            var endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity;
	            var endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity;
	            var todaytxt = dates[this.o.language].today || dates['en'].today || '';
	            var cleartxt = dates[this.o.language].clear || dates['en'].clear || '';
	            var titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat;
	
	            if (isNaN(year) || isNaN(month)) {
	                return;
	            }
	            this.picker.find('.datepicker-days .datepicker-switch').text(DPGlobal.formatDate(d, titleFormat, this.o.language));
	            this.picker.find('tfoot .today').text(todaytxt).toggle(this.o.todayBtn !== false);
	            this.picker.find('tfoot .clear').text(cleartxt).toggle(this.o.clearBtn !== false);
	            this.picker.find('thead .datepicker-title').text(this.o.title).toggle(this.o.title !== '');
	
	            this.updateNavArrows();
	            this.fillMonths();
	            var prevMonth = UTCDate(year, month - 1, 28);
	            var day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
	            prevMonth.setUTCDate(day);
	            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7) % 7);
	            var nextMonth = new Date(prevMonth);
	            if (prevMonth.getUTCFullYear() < 100) {
	                nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
	            }
	            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
	            nextMonth = nextMonth.valueOf();
	            var html = [];
	
	            while (prevMonth.valueOf() < nextMonth) {
	                if (prevMonth.getUTCDay() === this.o.weekStart) {
	                    html.push('<tr>');
	                    if (this.o.calendarWeeks) {
	                        // ISO 8601: First week contains first thursday.
	                        // ISO also states week starts on Monday, but we can be more abstract here.
	                        // Start of current week: based on weekstart/current date
	                        var ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5);
	                        // Thursday of this week
	                        var th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5);
	                        // First Thursday of year, year from thursday
	                        var yth = void 0;
	                        yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5);
	                        // Calendar week: ms between thursdays, div ms per day, div 7 days
	                        var calWeek = (th - yth) / 864e5 / 7 + 1;
	                        html.push('<td class="cw">' + calWeek + '</td>');
	                    }
	                }
	                clsName = this.getClassNames(prevMonth);
	                clsName.push('day');
	
	                if (this.o.beforeShowDay !== $.noop) {
	                    before = this.o.beforeShowDay(this._utcToLocal(prevMonth));
	                    if (before === undefined) {
	                        before = {};
	                    } else if (typeof before === 'boolean') {
	                        before = { enabled: before };
	                    } else if (typeof before === 'string') {
	                        before = { classes: before };
	                    }
	                    if (before.enabled === false) {
	                        clsName.push('disabled');
	                    }
	                    if (before.classes) {
	                        clsName = clsName.concat(before.classes.split(/\s+/));
	                    }
	                    if (before.tooltip) {
	                        tooltip = before.tooltip;
	                    }
	                }
	
	                clsName = $.unique(clsName);
	
	                html.push('<td class="' + clsName.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + (this.o.dateCells ? ' data-date="' + prevMonth.getTime().toString() + '"' : '') + '>' + prevMonth.getUTCDate() + '</td>');
	                tooltip = null;
	                if (prevMonth.getUTCDay() === this.o.weekEnd) {
	                    html.push('</tr>');
	                }
	                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
	            }
	
	            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
	            var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
	            var months = this.picker.find('.datepicker-months').find('.datepicker-switch').text(this.o.maxViewMode < 2 ? monthsTitle : year).end().find('tbody span').removeClass('active');
	
	            $.each(this.dates, function (i, _d) {
	                if (_d.getUTCFullYear() === year) {
	                    months.eq(_d.getUTCMonth()).addClass('active');
	                }
	            });
	
	            if (year < startYear || year > endYear) {
	                months.addClass('disabled');
	            }
	            if (year === startYear) {
	                months.slice(0, startMonth).addClass('disabled');
	            }
	            if (year === endYear) {
	                months.slice(endMonth + 1).addClass('disabled');
	            }
	
	            if (this.o.beforeShowMonth !== $.noop) {
	                $.each(months, function (i, _month) {
	                    var moDate = new Date(year, i, 1);
	                    var _before = _this2.o.beforeShowMonth(moDate);
	                    if (_before === undefined) {
	                        _before = {};
	                    } else if (typeof _before === 'boolean') {
	                        _before = { enabled: _before };
	                    } else if (typeof _before === 'string') {
	                        _before = { classes: _before };
	                    }
	                    if (_before.enabled === false && !$(_month).hasClass('disabled')) {
	                        $(_month).addClass('disabled');
	                    }
	                    if (_before.classes) {
	                        $(_month).addClass(_before.classes);
	                    }
	                    if (_before.tooltip) {
	                        $(_month).prop('title', _before.tooltip);
	                    }
	                });
	            }
	
	            // Generating decade/years picker
	            this._fillYearsView('.datepicker-years', 'year', 10, 1, year, startYear, endYear, this.o.beforeShowYear);
	            // Generating century/decades picker
	            this._fillYearsView('.datepicker-decades', 'decade', 100, 10, year, startYear, endYear, this.o.beforeShowDecade);
	            // Generating millennium/centuries picker
	            this._fillYearsView('.datepicker-centuries', 'century', 1000, 100, year, startYear, endYear, this.o.beforeShowCentury);
	        }
	    }, {
	        key: 'updateNavArrows',
	        value: function updateNavArrows() {
	            if (!this._allow_update) {
	                return;
	            }
	
	            var d = new Date(this.viewDate);
	            var year = d.getUTCFullYear();
	            var month = d.getUTCMonth();
	            switch (this.viewMode) {
	                case 0:
	                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
	                        this.picker.find('.prev').addClass('disabled');
	                    } else {
	                        this.picker.find('.prev').removeClass('disabled');
	                    }
	                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
	                        this.picker.find('.next').addClass('disabled');
	                    } else {
	                        this.picker.find('.next').removeClass('disabled');
	                    }
	                    break;
	                case 1:
	                case 2:
	                case 3:
	                case 4:
	                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() || this.o.maxViewMode < 2) {
	                        this.picker.find('.prev').addClass('disabled');
	                    } else {
	                        this.picker.find('.prev').removeClass('disabled');
	                    }
	                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() || this.o.maxViewMode < 2) {
	                        this.picker.find('.next').addClass('disabled');
	                    } else {
	                        this.picker.find('.next').removeClass('disabled');
	                    }
	                    break;
	            }
	        }
	    }, {
	        key: 'getDateOfWeek',
	        value: function getDateOfWeek(weekNumber, year) {
	            //Create a date object starting january first of chosen year, plus the number of days in a week multiplied by the week number to get the right date.
	            return new Date(year, 0, 1 + (weekNumber - 1) * 7);
	        }
	
	        /**
	         * Source: http://stackoverflow.com/questions/7580824/how-to-convert-a-week-number-to-a-date-in-javascript
	         */
	
	    }, {
	        key: 'firstDayOfWeek',
	        value: function firstDayOfWeek(week, year) {
	            // Jan 1 of 'year'
	            var d = new Date(year, 0, 1);
	            var offset = d.getTimezoneOffset();
	
	            // ISO: week 1 is the one with the year's first Thursday
	            // so nearest Thursday: current date + 4 - current day number
	            // Sunday is converted from 0 to 7
	            d.setDate(d.getDate() + 4 - (d.getDay() || 7));
	            // 7 days * (week - overlapping first week)
	            d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000 * (week + (year === d.getFullYear() ? -1 : 0)));
	            // daylight savings fix
	            d.setTime(d.getTime() + (d.getTimezoneOffset() - offset) * 60 * 1000);
	            // back to Monday (from Thursday)
	            d.setDate(d.getDate() - 3);
	            return d;
	        }
	
	        /**
	         * General Datepicker click handler.
	         */
	
	    }, {
	        key: 'click',
	        value: function click(e) {
	            var dir = void 0,
	                day = void 0,
	                year = void 0,
	                month = void 0,
	                monthChanged = void 0,
	                yearChanged = void 0;
	            e.preventDefault();
	            var target = $(e.target);
	
	            // In week-mode, we skip the rest of the click handler when clicking on
	            // a day or week number.
	            if ($(e.currentTarget).hasClass('week-select')) {
	                // A week number was clicked directly.
	                if (target.hasClass('cw') || target.hasClass('day')) {
	                    var weekNumber = void 0,
	                        weekSelector = void 0;
	                    target.hasClass('cw') ? weekSelector = target : weekSelector = target.siblings().first();
	                    weekNumber = parseInt(weekSelector.text(), 10);
	                    this.viewDate = this.firstDayOfWeek(weekNumber, new Date().getFullYear());
	                    // Sometimes this.dates is not set yet. Force it here.
	                    if (!this.dates.length) {
	                        this.dates.push(this.viewDate);
	                    }
	                    return;
	                }
	            }
	
	            // From here, no more events are picked up by datepicker.
	            e.stopPropagation();
	
	            // Clicked on the switch
	            if (target.hasClass('datepicker-switch')) {
	                this.showMode(1);
	            }
	
	            // Clicked on prev or next
	            var navArrow = target.closest('.prev, .next');
	            if (navArrow.length > 0) {
	                dir = DPGlobal.modes[this.viewMode].navStep * (navArrow.hasClass('prev') ? -1 : 1);
	                if (this.viewMode === 0) {
	                    this.viewDate = this.moveMonth(this.viewDate, dir);
	                    this._trigger('changeMonth', this.viewDate);
	                } else {
	                    this.viewDate = this.moveYear(this.viewDate, dir);
	                    if (this.viewMode === 1) {
	                        this._trigger('changeYear', this.viewDate);
	                    }
	                }
	                this.fill();
	            }
	
	            // Clicked on today button
	            if (target.hasClass('today') && !target.hasClass('day')) {
	                this.showMode(-2);
	                this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
	            }
	
	            // Clicked on tomorrow button.
	            if (target.hasClass('tomorrow')) {
	                this.showMode(-2);
	                var today = new Date();
	                this._setDate(UTCDate(today.getFullYear(), today.getMonth(), today.getDate() + 1), 'date');
	            }
	
	            // Clicked on next month button.
	            if (target.hasClass('first-day-next-month')) {
	                this.showMode(-2);
	                var _today = new Date();
	                this._setDate(UTCDate(_today.getFullYear(), _today.getMonth() + 1, 1), 'date');
	            }
	
	            // Clicked on clear button
	            if (target.hasClass('clear')) {
	                this.clearDates();
	            }
	
	            if (!target.hasClass('disabled')) {
	                // Clicked on a day
	                if (target.hasClass('day')) {
	                    day = parseInt(target.text(), 10) || 1;
	                    year = this.viewDate.getUTCFullYear();
	                    month = this.viewDate.getUTCMonth();
	
	                    // From last month
	                    if (target.hasClass('old')) {
	                        if (month === 0) {
	                            month = 11;
	                            year = year - 1;
	                            monthChanged = true;
	                            yearChanged = true;
	                        } else {
	                            month = month - 1;
	                            monthChanged = true;
	                        }
	                    }
	
	                    // From next month
	                    if (target.hasClass('new')) {
	                        if (month === 11) {
	                            month = 0;
	                            year = year + 1;
	                            monthChanged = true;
	                            yearChanged = true;
	                        } else {
	                            month = month + 1;
	                            monthChanged = true;
	                        }
	                    }
	                    this._setDate(UTCDate(year, month, day));
	                    if (yearChanged) {
	                        this._trigger('changeYear', this.viewDate);
	                    }
	                    if (monthChanged) {
	                        this._trigger('changeMonth', this.viewDate);
	                    }
	                }
	
	                // Clicked on a month
	                if (target.hasClass('month')) {
	                    this.viewDate.setUTCDate(1);
	                    day = 1;
	                    month = target.parent().find('span').index(target);
	                    year = this.viewDate.getUTCFullYear();
	                    this.viewDate.setUTCMonth(month);
	                    this._trigger('changeMonth', this.viewDate);
	                    if (this.o.minViewMode === 1) {
	                        this._setDate(UTCDate(year, month, day));
	                        this.showMode();
	                    } else {
	                        this.showMode(-1);
	                    }
	                    this.fill();
	                }
	
	                // Clicked on a year
	                if (target.hasClass('year') || target.hasClass('decade') || target.hasClass('century')) {
	                    this.viewDate.setUTCDate(1);
	
	                    day = 1;
	                    month = 0;
	                    year = parseInt(target.text(), 10) || 0;
	                    this.viewDate.setUTCFullYear(year);
	
	                    if (target.hasClass('year')) {
	                        this._trigger('changeYear', this.viewDate);
	                        if (this.o.minViewMode === 2) {
	                            this._setDate(UTCDate(year, month, day));
	                        }
	                    }
	                    if (target.hasClass('decade')) {
	                        this._trigger('changeDecade', this.viewDate);
	                        if (this.o.minViewMode === 3) {
	                            this._setDate(UTCDate(year, month, day));
	                        }
	                    }
	                    if (target.hasClass('century')) {
	                        this._trigger('changeCentury', this.viewDate);
	                        if (this.o.minViewMode === 4) {
	                            this._setDate(UTCDate(year, month, day));
	                        }
	                    }
	
	                    this.showMode(-1);
	                    this.fill();
	                }
	            }
	
	            if (this.picker.is(':visible') && this._focused_from) {
	                $(this._focused_from).focus();
	            }
	            delete this._focused_from;
	        }
	    }, {
	        key: '_toggleMultidate',
	        value: function _toggleMultidate(date) {
	            var ix = this.dates.contains(date);
	            if (!date) {
	                this.dates.clear();
	            }
	
	            if (ix !== -1) {
	                if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive) {
	                    this.dates.remove(ix);
	                }
	            } else if (this.o.multidate === false) {
	                this.dates.clear();
	                this.dates.push(date);
	            } else {
	                this.dates.push(date);
	            }
	
	            if (typeof this.o.multidate === 'number') {
	                while (this.dates.length > this.o.multidate) {
	                    this.dates.remove(0);
	                }
	            }
	        }
	    }, {
	        key: '_setDate',
	        value: function _setDate(date, which) {
	            if (!which || which === 'date') {
	                this._toggleMultidate(date && new Date(date));
	            }
	            if (!which || which === 'view') {
	                this.viewDate = date && new Date(date);
	            }
	
	            this.fill();
	            this.setValue();
	            if (!which || which !== 'view') {
	                this._trigger('changeDate');
	            }
	            if (this.inputField) {
	                this.inputField.change();
	            }
	            if (this.o.autoclose && (!which || which === 'date')) {
	                this.hide();
	            }
	        }
	    }, {
	        key: 'moveDay',
	        value: function moveDay(date, dir) {
	            var newDate = new Date(date);
	            newDate.setUTCDate(date.getUTCDate() + dir);
	
	            return newDate;
	        }
	    }, {
	        key: 'moveWeek',
	        value: function moveWeek(date, dir) {
	            return this.moveDay(date, dir * 7);
	        }
	    }, {
	        key: 'moveMonth',
	        value: function moveMonth(date, dir) {
	            if (!isValidDate(date)) {
	                return this.o.defaultViewDate;
	            }
	            if (!dir) {
	                return date;
	            }
	            var newDate = new Date(date.valueOf());
	            var day = newDate.getUTCDate();
	            var month = newDate.getUTCMonth();
	            var mag = Math.abs(dir);
	            var newMonth = void 0,
	                test = void 0;
	
	            dir = dir > 0 ? 1 : -1;
	            if (mag === 1) {
	                test = dir === -1
	                // If going back one month, make sure month is not current month
	                // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
	                ? function () {
	                    return newDate.getUTCMonth() === month;
	                }
	                // If going forward one month, make sure month is as expected
	                // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
	                : function () {
	                    return newDate.getUTCMonth() !== newMonth;
	                };
	                newMonth = month + dir;
	                newDate.setUTCMonth(newMonth);
	                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
	                if (newMonth < 0 || newMonth > 11) {
	                    newMonth = (newMonth + 12) % 12;
	                }
	            } else {
	                // For magnitudes >1, move one month at a time...
	                for (var i = 0; i < mag; i++) {
	                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
	                    newDate = this.moveMonth(newDate, dir);
	                }
	                // ...then reset the day, keeping it in the new month
	                newMonth = newDate.getUTCMonth();
	                newDate.setUTCDate(day);
	                test = function test() {
	                    return newMonth !== newDate.getUTCMonth();
	                };
	            }
	            // Common date-resetting loop -- if date is beyond end of month, make it
	            // end of month
	            while (test()) {
	                newDate.setUTCDate(--day);
	                newDate.setUTCMonth(newMonth);
	            }
	            return newDate;
	        }
	    }, {
	        key: 'moveYear',
	        value: function moveYear(date, dir) {
	            return this.moveMonth(date, dir * 12);
	        }
	    }, {
	        key: 'moveAvailableDate',
	        value: function moveAvailableDate(date, dir, fn) {
	            do {
	                date = this[fn](date, dir);
	                if (!this.dateWithinRange(date)) {
	                    return false;
	                }
	
	                fn = 'moveDay';
	            } while (this.dateIsDisabled(date));
	
	            return date;
	        }
	    }, {
	        key: 'weekOfDateIsDisabled',
	        value: function weekOfDateIsDisabled(date) {
	            return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
	        }
	    }, {
	        key: 'dateIsDisabled',
	        value: function dateIsDisabled(date) {
	            return this.weekOfDateIsDisabled(date) || $.grep(this.o.datesDisabled, function (d) {
	                return isUTCEquals(date, d);
	            }).length > 0;
	        }
	    }, {
	        key: 'dateWithinRange',
	        value: function dateWithinRange(date) {
	            return date >= this.o.startDate && date <= this.o.endDate;
	        }
	    }, {
	        key: 'keydown',
	        value: function keydown(e) {
	            if (!this.picker.is(':visible')) {
	                if (e.keyCode === 40 || e.keyCode === 27) {
	                    // allow down to re-show picker
	                    this.show();
	                    e.stopPropagation();
	                }
	                return;
	            }
	            var dateChanged = false;
	            var dir = void 0,
	                newViewDate = void 0;
	            var focusDate = this.focusDate || this.viewDate;
	            switch (e.keyCode) {
	                case 27:
	                    // escape
	                    if (this.focusDate) {
	                        this.focusDate = null;
	                        this.viewDate = this.dates.get(-1) || this.viewDate;
	                        this.fill();
	                    } else this.hide();
	                    e.preventDefault();
	                    e.stopPropagation();
	                    break;
	                case 37: // left
	                case 38: // up
	                case 39: // right
	                case 40:
	                    // down
	                    if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7) {
	                        break;
	                    }
	                    dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
	                    if (this.viewMode === 0) {
	                        if (e.ctrlKey) {
	                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
	                            if (newViewDate) {
	                                this._trigger('changeYear', this.viewDate);
	                            }
	                        } else if (e.shiftKey) {
	                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
	                            if (newViewDate) {
	                                this._trigger('changeMonth', this.viewDate);
	                            }
	                        } else if (e.keyCode === 37 || e.keyCode === 39) {
	                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
	                        } else if (!this.weekOfDateIsDisabled(focusDate)) {
	                            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
	                        }
	                    } else if (this.viewMode === 1) {
	                        if (e.keyCode === 38 || e.keyCode === 40) {
	                            dir = dir * 4;
	                        }
	                        newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
	                    } else if (this.viewMode === 2) {
	                        if (e.keyCode === 38 || e.keyCode === 40) {
	                            dir = dir * 4;
	                        }
	                        newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
	                    }
	
	                    if (newViewDate) {
	                        this.focusDate = this.viewDate = newViewDate;
	                        this.setValue();
	                        this.fill();
	                        e.preventDefault();
	                    }
	                    break;
	                case 13:
	                    // enter
	                    if (!this.o.forceParse) {
	                        break;
	                    }
	                    focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
	                    if (this.o.keyboardNavigation) {
	                        this._toggleMultidate(focusDate);
	                        dateChanged = true;
	                    }
	                    this.focusDate = null;
	                    this.viewDate = this.dates.get(-1) || this.viewDate;
	                    this.setValue();
	                    this.fill();
	                    if (this.picker.is(':visible')) {
	                        e.preventDefault();
	                        e.stopPropagation();
	                        if (this.o.autoclose) {
	                            this.hide();
	                        }
	                    }
	                    break;
	                case 9:
	                    // tab
	                    this.focusDate = null;
	                    this.viewDate = this.dates.get(-1) || this.viewDate;
	                    this.fill();
	                    this.hide();
	                    break;
	            }
	            if (dateChanged) {
	                if (this.dates.length) {
	                    this._trigger('changeDate');
	                } else {
	                    this._trigger('clearDate');
	                }
	                if (this.inputField) {
	                    this.inputField.change();
	                }
	            }
	        }
	    }, {
	        key: 'showMode',
	        value: function showMode(dir) {
	            if (dir) {
	                this.viewMode = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, this.viewMode + dir));
	            }
	            this.picker.children('div').hide().filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName).show();
	            this.updateNavArrows();
	        }
	    }]);
	
	    return Datepicker;
	}();
	
	Datepicker._events = [];
	Datepicker._secondaryEvents = [];
	Datepicker._allow_update = true;
	Datepicker.setDate = alias('setDates');
	Datepicker.setUTCDate = alias('setUTCDates');
	Datepicker.remove = alias('destroy');
	
	var DateRangePicker = function () {
	    function DateRangePicker(element, options) {
	        _classCallCheck(this, DateRangePicker);
	
	        $(element).data('datepicker', this);
	        this.element = $(element);
	        this.inputs = $.map(options.inputs, function (i) {
	            return i.jquery ? i[0] : i;
	        });
	        delete options.inputs;
	
	        this.keepEmptyValues = options.keepEmptyValues;
	        delete options.keepEmptyValues;
	
	        datepickerPlugin.call($(this.inputs), options).on('changeDate', $.proxy(this.dateUpdated, this));
	        this.pickers = $.map(this.inputs, function (i) {
	            return $(i).data('datepicker');
	        });
	        this.updateDates();
	    }
	
	    _createClass(DateRangePicker, [{
	        key: 'updateDates',
	        value: function updateDates() {
	            this.dates = $.map(this.pickers, function (i) {
	                return i.getUTCDate();
	            });
	            this.updateRanges();
	        }
	    }, {
	        key: 'updateRanges',
	        value: function updateRanges() {
	            var range = $.map(this.dates, function (d) {
	                return d.valueOf();
	            });
	            $.each(this.pickers, function (i, p) {
	                p.setRange(range);
	            });
	        }
	    }, {
	        key: 'dateUpdated',
	        value: function dateUpdated(e) {
	            // `this.updating` is a workaround for preventing infinite recursion
	            // between `changeDate` triggering and `setUTCDate` calling.  Until
	            // there is a better mechanism.
	            if (this.updating) {
	                return;
	            }
	            this.updating = true;
	
	            var dp = $(e.target).data('datepicker');
	
	            if (typeof dp === 'undefined') {
	                return;
	            }
	
	            var newDate = dp.getUTCDate();
	            var keepEmptyValues = this.keepEmptyValues;
	            var i = $.inArray(e.target, this.inputs);
	            var j = i - 1;
	            var k = i + 1;
	            var l = this.inputs.length;
	            if (i === -1) {
	                return;
	            }
	
	            $.each(this.pickers, function (_i, p) {
	                if (!p.getUTCDate() && (p === dp || !keepEmptyValues)) {
	                    p.setUTCDate(newDate);
	                }
	            });
	
	            if (newDate < this.dates[j]) {
	                // Date being moved earlier/left
	                while (j >= 0 && newDate < this.dates[j]) {
	                    this.pickers[j--].setUTCDate(newDate);
	                }
	            } else if (newDate > this.dates[k]) {
	                // Date being moved later/right
	                while (k < l && newDate > this.dates[k]) {
	                    this.pickers[k++].setUTCDate(newDate);
	                }
	            }
	            this.updateDates();
	
	            delete this.updating;
	        }
	    }, {
	        key: 'remove',
	        value: function remove() {
	            $.map(this.pickers, function (p) {
	                p.remove();
	            });
	            delete this.element.data().datepicker;
	        }
	    }]);
	
	    return DateRangePicker;
	}();
	
	function optsFromEl(el, prefix) {
	    // Derive options from element data-attrs
	    var inkey = void 0;
	    var data = $(el).data();
	    var out = {};
	    var replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
	    prefix = new RegExp('^' + prefix.toLowerCase());
	    function reLower(_, a) {
	        return a.toLowerCase();
	    }
	    for (var key in data) {
	        if (prefix.test(key)) {
	            inkey = key.replace(replace, reLower);
	            out[inkey] = data[key];
	        }
	    }
	    return out;
	}
	
	function optsFromLocale(lang) {
	    // Derive options from locale plugins
	    var out = {};
	    // Check if "de-DE" style date is available, if not language should
	    // fallback to 2 letter code eg "de"
	    if (!dates[lang]) {
	        lang = lang.split('-')[0];
	        if (!dates[lang]) {
	            return;
	        }
	    }
	    var d = dates[lang];
	    $.each(localeOpts, function (i, k) {
	        if (k in d) {
	            out[k] = d[k];
	        }
	    });
	    return out;
	}
	
	var datepickerPlugin = function datepickerPlugin(option) {
	    var args = Array.apply(null, arguments);
	    args.shift();
	    var internalReturn = void 0;
	    this.each(function () {
	        var $this = $(this);
	        var data = $this.data('datepicker');
	        var options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option;
	        if (!data) {
	            var elopts = optsFromEl(this, 'date');
	            // Preliminary otions
	            var xopts = $.extend({}, defaults, elopts, options);
	            var locopts = optsFromLocale(xopts.language);
	            // Options priority: js args, data-attrs, locales, default.
	            var opts = $.extend({}, defaults, locopts, elopts, options);
	            if ($this.hasClass('input-daterange') || opts.inputs) {
	                $.extend(opts, {
	                    inputs: opts.inputs || $this.find('input').toArray()
	                });
	                data = new DateRangePicker(this, opts);
	            } else {
	                data = new Datepicker(this, opts);
	            }
	            $this.data('datepicker', data);
	        }
	        if (typeof option === 'string' && typeof data[option] === 'function') {
	            internalReturn = data[option].apply(data, args);
	        }
	    });
	
	    if (internalReturn === undefined || internalReturn instanceof Datepicker || internalReturn instanceof DateRangePicker) {
	        return this;
	    }
	
	    if (this.length > 1) {
	        throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
	    } else {
	        return internalReturn;
	    }
	};
	
	$.fn.datepicker = datepickerPlugin;
	$.fn.datepicker.defaults = defaults;
	$.fn.datepicker.localeOpts = localeOpts;
	$.fn.datepicker.dates = dates;
	
	DPGlobal = {
	    modes: [{
	        clsName: 'days',
	        navFnc: 'Month',
	        navStep: 1
	    }, {
	        clsName: 'months',
	        navFnc: 'FullYear',
	        navStep: 1
	    }, {
	        clsName: 'years',
	        navFnc: 'FullYear',
	        navStep: 10
	    }, {
	        clsName: 'decades',
	        navFnc: 'FullDecade',
	        navStep: 100
	    }, {
	        clsName: 'centuries',
	        navFnc: 'FullCentury',
	        navStep: 1000
	    }],
	    isLeapYear: function isLeapYear(year) {
	        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
	    },
	
	    getDaysInMonth: function getDaysInMonth(year, month) {
	        return [31, DPGlobal.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	    },
	
	    validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
	
	    nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
	
	    parseFormat: function parseFormat(format) {
	        if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function') {
	            return format;
	        }
	        // IE treats \0 as a string end in inputs (truncating the value),
	        // so it's a bad format delimiter, anyway
	        var separators = format.replace(this.validParts, '\0').split('\0');
	        var parts = format.match(this.validParts);
	        if (!separators || !separators.length || !parts || parts.length === 0) {
	            throw new Error('Invalid date format.');
	        }
	        return { separators: separators, parts: parts };
	    },
	
	    parseDate: function parseDate(date, format, language, assumeNearby) {
	        var val = void 0,
	            filtered = void 0,
	            part = void 0,
	            dir = void 0,
	            i = void 0,
	            fn = void 0;
	        if (!date) {
	            return undefined;
	        }
	        if (date instanceof Date) {
	            return date;
	        }
	        if (typeof format === 'string') {
	            format = DPGlobal.parseFormat(format);
	        }
	        if (format.toValue) {
	            return format.toValue(date, format, language);
	        }
	        var partRe = /([\-+]\d+)([dmwy])/;
	        var parts = date.match(/([\-+]\d+)([dmwy])/g);
	        var fnMap = {
	            d: 'moveDay',
	            m: 'moveMonth',
	            w: 'moveWeek',
	            y: 'moveYear'
	        };
	        var dateAliases = {
	            yesterday: '-1d',
	            today: '+0d',
	            tomorrow: '+1d'
	        };
	
	        if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
	            date = new Date();
	
	            for (i = 0; i < parts.length; i++) {
	                part = partRe.exec(parts[i]);
	                dir = parseInt(part[1], 10);
	                fn = fnMap[part[2]];
	                date = Datepicker.prototype[fn](date, dir);
	            }
	            return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
	        }
	
	        if (typeof dateAliases[date] !== 'undefined') {
	            date = dateAliases[date];
	            parts = date.match(/([\-+]\d+)([dmwy])/g);
	
	            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
	                date = new Date();
	                for (i = 0; i < parts.length; i++) {
	                    part = partRe.exec(parts[i]);
	                    dir = parseInt(part[1], 10);
	                    fn = fnMap[part[2]];
	                    date = Datepicker.prototype[fn](date, dir);
	                }
	
	                return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
	            }
	        }
	
	        parts = date && date.match(this.nonpunctuation) || [];
	        date = new Date();
	
	        function applyNearbyYear(year, threshold) {
	            if (threshold === true) {
	                threshold = 10;
	            }
	
	            // if year is 2 digits or less, than the user most likely is trying to get a recent century
	            if (year < 100) {
	                year += 2000;
	                // if the new year is more than threshold years in advance, use last century
	                if (year > new Date().getFullYear() + threshold) {
	                    year -= 100;
	                }
	            }
	
	            return year;
	        }
	
	        var parsed = {};
	        var settersOrder = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'];
	        var settersMap = {
	            yyyy: function yyyy(d, v) {
	                return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
	            },
	            yy: function yy(d, v) {
	                return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
	            },
	            m: function m(d, v) {
	                if (isNaN(d)) {
	                    return d;
	                }
	                v -= 1;
	                while (v < 0) {
	                    v += 12;
	                }v %= 12;
	                d.setUTCMonth(v);
	                while (d.getUTCMonth() !== v) {
	                    d.setUTCDate(d.getUTCDate() - 1);
	                }
	                return d;
	            },
	            d: function d(_d2, v) {
	                return _d2.setUTCDate(v);
	            }
	        };
	
	        settersMap['M'] = settersMap['MM'] = settersMap['mm'] = settersMap['m'];
	        settersMap['dd'] = settersMap['d'];
	        date = UTCToday();
	        var fparts = format.parts.slice();
	        // Remove noop parts
	        if (parts.length !== fparts.length) {
	            fparts = $(fparts).filter(function (i, p) {
	                return $.inArray(p, settersOrder) !== -1;
	            }).toArray();
	        }
	        // Process remainder
	        function matchPart() {
	            var m = this.slice(0, parts[i].length),
	                p = parts[i].slice(0, m.length);
	            return m.toLowerCase() === p.toLowerCase();
	        }
	        if (parts.length === fparts.length) {
	            var cnt = void 0,
	                _date = void 0,
	                s = void 0;
	            for (i = 0, cnt = fparts.length; i < cnt; i++) {
	                val = parseInt(parts[i], 10);
	                part = fparts[i];
	                if (isNaN(val)) {
	                    switch (part) {
	                        case 'MM':
	                            filtered = $(dates[language].months).filter(matchPart);
	                            val = $.inArray(filtered[0], dates[language].months) + 1;
	                            break;
	                        case 'M':
	                            filtered = $(dates[language].monthsShort).filter(matchPart);
	                            val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
	                            break;
	                    }
	                }
	                parsed[part] = val;
	            }
	            for (i = 0; i < settersOrder.length; i++) {
	                s = settersOrder[i];
	                if (s in parsed && !isNaN(parsed[s])) {
	                    _date = new Date(date);
	                    settersMap[s](_date, parsed[s]);
	                    if (!isNaN(_date)) {
	                        date = _date;
	                    }
	                }
	            }
	        }
	        return date;
	    },
	
	    formatDate: function formatDate(date, format, language) {
	        if (!date) {
	            return '';
	        }
	        if (typeof format === 'string') {
	            format = DPGlobal.parseFormat(format);
	        }
	        if (format.toDisplay) {
	            return format.toDisplay(date, format, language);
	        }
	
	        var val = {
	            d: date.getUTCDate(),
	            D: dates[language].daysShort[date.getUTCDay()],
	            DD: dates[language].days[date.getUTCDay()],
	            m: date.getUTCMonth() + 1,
	            M: dates[language].monthsShort[date.getUTCMonth()],
	            MM: dates[language].months[date.getUTCMonth()],
	            yy: date.getUTCFullYear().toString().substring(2),
	            yyyy: date.getUTCFullYear()
	        };
	        val.dd = (val.d < 10 ? '0' : '') + val.d;
	        val.mm = (val.m < 10 ? '0' : '') + val.m;
	        date = [];
	        var seps = $.extend([], format.separators);
	
	        for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
	            if (seps.length) {
	                date.push(seps.shift());
	            }
	            date.push(val[format.parts[i]]);
	        }
	        return date.join('');
	    },
	    headTemplate: '<thead>' + '<tr>' + '<th colspan="7" class="datepicker-title"></th>' + '</tr>' + '<tr class="header navigation-row">' + '<th class="prev">&laquo;</th>' + '<th colspan="5" class="datepicker-switch"></th>' + '<th class="next">&raquo;</th>' + '</tr>' + '</thead>',
	    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
	    footTemplate: '<tfoot>' + '<tr>' + '<th colspan="7" class="today"></th>' + '</tr>' + '<tr>' + '<th colspan="7" class="clear"></th>' + '</tr>' + '</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">' + '<div class="datepicker-days">' + '<table class="table-condensed">' + DPGlobal.headTemplate + '<tbody></tbody>' + DPGlobal.footTemplate + '</table>' + '</div>' + '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + '</table>' + '</div>' + '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + '</table>' + '</div>' + '<div class="datepicker-decades">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + '</table>' + '</div>' + '<div class="datepicker-centuries">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + '</table>' + '</div>' + '</div>';
	
	$.fn.datepicker.version = '0.1.0';
	$.fn.datepicker.DPGlobal = DPGlobal;
	
	$(document).on('focus.datepicker.data-api click.datepicker.data-api', '[data-provide="datepicker"]', function (e) {
	    var $this = $(this);
	    if ($this.data('datepicker')) {
	        return;
	    }
	
	    e.preventDefault();
	    // component click requires us to explicitly show it
	    datepickerPlugin.call($this, 'show');
	});
	
	$(function () {
	    datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});
	
	module.exports = Datepicker;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * component.selectfx
	 * http://github.com/typesettin/component.selectfx
	 *
	 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
	 */
	'use strict';
	
	var classie = __webpack_require__(90),
		extend = __webpack_require__(94),
		events = __webpack_require__(95),
		util = __webpack_require__(96);
	
	/**
	 * based on from https://github.com/inuyaksa/jquery.nicescroll/blob/master/jquery.nicescroll.js
	 */
	var hasParent = function (e, p) {
		if (!e) return false;
		var el = e.target || e.srcElement || e || false;
		while (el && el != p) {
			el = el.parentNode || false;
		}
		return (el !== false);
	};
	
	/**
	 * SelectFx function
	 */
	var SelectFx = function (el, options) {
		events.EventEmitter.call(this);
	
		this.el = el;
		this.options = extend({}, this.options);
		this.options = extend(this.options, options);
		this._init();
	}
	
	util.inherits(SelectFx, events.EventEmitter);
	
	/**
	 * SelectFx options
	 */
	SelectFx.prototype.options = {
		// if true all the links will open in a new tab.
		// if we want to be redirected when we click an option, we need to define a data-link attr on the option of the native select element
		newTab: true,
		// when opening the select element, the default placeholder (if any) is shown
		stickyPlaceholder: true,
		// callback when changing the value
		onChange: function (val) {
			return false;
		}
	}
	
	/**
	 * init function
	 * initialize and cache some vars
	 */
	SelectFx.prototype._init = function () {
		// check if we are using a placeholder for the native select box
		// we assume the placeholder is disabled and selected by default
		var selectedOpt = this.el.querySelector('option[selected]');
		this.hasDefaultPlaceholder = selectedOpt && selectedOpt.disabled;
	
		// get selected option (either the first option with attr selected or just the first option)
		this.selectedOpt = selectedOpt || this.el.querySelector('option');
	
		// create structure
		this._createSelectEl();
	
		// all options
		this.selOpts = [].slice.call(this.selEl.querySelectorAll('li[data-option]'));
	
		// total options
		this.selOptsCount = this.selOpts.length;
	
		// current index
		this.current = this.selOpts.indexOf(this.selEl.querySelector('li.cs-selected')) || -1;
	
		// placeholder elem
		this.selPlaceholder = this.selEl.querySelector('span.cs-placeholder');
	
		// init events
		this._initEvents();
	}
	
	/**
	 * creates the structure for the select element
	 */
	SelectFx.prototype._createSelectEl = function () {
		var self = this,
			options = '',
			createOptionHTML = function (el) {
				var optclass = '',
					classes = '',
					link = '';
	
				if (el.selectedOpt && !this.foundSelected && !this.hasDefaultPlaceholder) {
					classes += 'cs-selected ';
					this.foundSelected = true;
				}
				// extra classes
				if (el.getAttribute('data-class')) {
					classes += el.getAttribute('data-class');
				}
				// link options
				if (el.getAttribute('data-link')) {
					link = 'data-link=' + el.getAttribute('data-link');
				}
	
				if (classes !== '') {
					optclass = 'class="' + classes + '" ';
				}
	
				return '<li ' + optclass + link + ' data-option data-value="' + el.value + '"><span>' + el.textContent + '</span></li>';
			};
	
		[].slice.call(this.el.children).forEach(function (el) {
			if (el.disabled) {
				return;
			}
	
			var tag = el.tagName.toLowerCase();
	
			if (tag === 'option') {
				options += createOptionHTML(el);
			}
			else if (tag === 'optgroup') {
				options += '<li class="cs-optgroup"><span>' + el.label + '</span><ul>';
				[].slice.call(el.children).forEach(function (opt) {
					options += createOptionHTML(opt);
				})
				options += '</ul></li>';
			}
		});
	
		var opts_el = '<div class="cs-options"><ul>' + options + '</ul></div>';
		this.selEl = document.createElement('div');
		this.selEl.className = this.el.className;
		this.selEl.tabIndex = this.el.tabIndex;
		this.selEl.innerHTML = '<span class="cs-placeholder">' + this.selectedOpt.textContent + '</span>' + opts_el;
		this.el.parentNode.appendChild(this.selEl);
		this.selEl.appendChild(this.el);
	}
	
	/**
	 * initialize the events
	 */
	SelectFx.prototype._initEvents = function () {
		var self = this;
	
		// open/close select
		this.selPlaceholder.addEventListener('click', function () {
			self._toggleSelect();
		});
	
		// clicking the options
		this.selOpts.forEach(function (opt, idx) {
			opt.addEventListener('click', function () {
				self.current = idx;
				self._changeOption();
				// close select elem
				self._toggleSelect();
			});
		});
	
		// close the select element if the target it´s not the select element or one of its descendants..
		document.addEventListener('click', function (ev) {
			var target = ev.target;
			if (self._isOpen() && target !== self.selEl && !hasParent(target, self.selEl)) {
				self._toggleSelect();
			}
		});
	
		// keyboard navigation events
		this.selEl.addEventListener('keydown', function (ev) {
			var keyCode = ev.keyCode || ev.which;
	
			switch (keyCode) {
				// up key
			case 38:
				ev.preventDefault();
				self._navigateOpts('prev');
				break;
				// down key
			case 40:
				ev.preventDefault();
				self._navigateOpts('next');
				break;
				// space key
			case 32:
				ev.preventDefault();
				if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
					self._changeOption();
				}
				self._toggleSelect();
				break;
				// enter key
			case 13:
				ev.preventDefault();
				if (self._isOpen() && typeof self.preSelCurrent != 'undefined' && self.preSelCurrent !== -1) {
					self._changeOption();
					self._toggleSelect();
				}
				break;
				// esc key
			case 27:
				ev.preventDefault();
				if (self._isOpen()) {
					self._toggleSelect();
				}
				break;
			}
		});
	}
	
	/**
	 * navigate with up/dpwn keys
	 */
	SelectFx.prototype._navigateOpts = function (dir) {
		if (!this._isOpen()) {
			this._toggleSelect();
		}
	
		var tmpcurrent = typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1 ? this.preSelCurrent : this.current;
	
		if (dir === 'prev' && tmpcurrent > 0 || dir === 'next' && tmpcurrent < this.selOptsCount - 1) {
			// save pre selected current - if we click on option, or press enter, or press space this is going to be the index of the current option
			this.preSelCurrent = dir === 'next' ? tmpcurrent + 1 : tmpcurrent - 1;
			// remove focus class if any..
			this._removeFocus();
			// add class focus - track which option we are navigating
			classie.add(this.selOpts[this.preSelCurrent], 'cs-focus');
		}
	}
	
	/**
	 * open/close select
	 * when opened show the default placeholder if any
	 */
	SelectFx.prototype._toggleSelect = function () {
		// remove focus class if any..
		this._removeFocus();
	
		if (this._isOpen()) {
			if (this.current !== -1) {
				// update placeholder text
				this.selPlaceholder.textContent = this.selOpts[this.current].textContent;
			}
			classie.remove(this.selEl, 'cs-active');
		}
		else {
			if (this.hasDefaultPlaceholder && this.options.stickyPlaceholder) {
				// everytime we open we wanna see the default placeholder text
				this.selPlaceholder.textContent = this.selectedOpt.textContent;
			}
			classie.add(this.selEl, 'cs-active');
		}
	}
	
	/**
	 * change option - the new value is set
	 */
	SelectFx.prototype._changeOption = function () {
		// if pre selected current (if we navigate with the keyboard)...
		if (typeof this.preSelCurrent != 'undefined' && this.preSelCurrent !== -1) {
			this.current = this.preSelCurrent;
			this.preSelCurrent = -1;
		}
	
		// current option
		var opt = this.selOpts[this.current];
	
		// update current selected value
		this.selPlaceholder.textContent = opt.textContent;
	
		// change native select element´s value
		this.el.value = opt.getAttribute('data-value');
	
		// remove class cs-selected from old selected option and add it to current selected option
		var oldOpt = this.selEl.querySelector('li.cs-selected');
		if (oldOpt) {
			classie.remove(oldOpt, 'cs-selected');
		}
		classie.add(opt, 'cs-selected');
	
		// if there´s a link defined
		if (opt.getAttribute('data-link')) {
			// open in new tab?
			if (this.options.newTab) {
				window.open(opt.getAttribute('data-link'), '_blank');
			}
			else {
				window.location = opt.getAttribute('data-link');
			}
		}
	
		// callback
		this.options.onChange(this.el.value);
	}
	
	/**
	 * returns true if select element is opened
	 */
	SelectFx.prototype._isOpen = function (opt) {
		return classie.has(this.selEl, 'cs-active');
	}
	
	/**
	 * removes the focus class from the option
	 */
	SelectFx.prototype._removeFocus = function (opt) {
		var focusEl = this.selEl.querySelector('li.cs-focus')
		if (focusEl) {
			classie.remove(focusEl, 'cs-focus');
		}
	}
	
	module.exports = SelectFx;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * classie
	 * http://github.amexpub.com/modules/classie
	 *
	 * Copyright (c) 2013 AmexPub. All rights reserved.
	 */
	
	module.exports = __webpack_require__(91);


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * classie - class helper functions
	 * from bonzo https://github.com/ded/bonzo
	 * 
	 * classie.has( elem, 'my-class' ) -> true/false
	 * classie.add( elem, 'my-new-class' )
	 * classie.remove( elem, 'my-unwanted-class' )
	 * classie.toggle( elem, 'my-class' )
	 */
	
	/*jshint browser: true, strict: true, undef: true */
	/*global define: false */
	'use strict';
	
	// class helper functions from bonzo https://github.com/ded/bonzo
	var classList = __webpack_require__(93),
	    classie;
	
	function classReg(className) {
	    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
	}
	
	function noop() {}
	
	function isArr(classes) {
	    if (Array.isArray(classes)) {
	        return true;
	    } else if (Object.prototype.toString.call(classes) === '[object Array]') {
	        return true;
	    } else {
	        return false;
	    }
	}
	
	function removeMultiple() {
	    var c = arguments[1],
	        elem = arguments[0];
	    c.forEach(function(value) {
	        if (classie.has(elem, value)) {
	            noop();
	        }
	        classie.removeClass(elem, value);
	    });
	}
	
	
	function addMultiple() {
	    var c = arguments[1],
	        elem = arguments[0];
	    c.forEach(function(value) {
	        if (classie.has(elem, value)) {
	            noop();
	        }
	        classie.addClass(elem, value);
	    });
	}
	
	function hasClass(elem, c) {
	    return elem.classList.contains(c);
	}
	
	function addClass(elem, c) {
	    if (isArr(c)) {
	        addMultiple.apply(this, arguments);
	    } else {
	        elem.classList.add(c);
	    }
	}
	
	function removeClass(elem, c) {
	    if (isArr(c)) {
	        removeMultiple.apply(this, arguments);
	    } else {
	        elem.classList.remove(c);
	    }
	}
	
	function toggleClass(elem, c) {
	    var fn = hasClass(elem, c) ? removeClass : addClass;
	    fn(elem, c);
	}
	
	var classie = {
	    // full names
	    hasClass: hasClass,
	    addClass: addClass,
	    removeClass: removeClass,
	    toggleClass: toggleClass,
	    // short names
	    has: hasClass,
	    add: addClass,
	    remove: removeClass,
	    toggle: toggleClass
	};
	
	// transport
	
	if (typeof module === "object" && module && typeof module.exports === "object") {
	    // commonjs / browserify
	    module.exports = classie;
	} else {
	    // AMD
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (classie), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(92)(module)))

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 93 */
/***/ function(module, exports) {

	/* 
	 * classList.js: Cross-browser full element.classList implementation.
	 * 2014-07-23
	 *
	 * By Eli Grey, http://eligrey.com
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 */
	
	/*global self, document, DOMException, DOMTokenList */
	
	/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
	
	if ("document" in self) {
	
	    // Full polyfill for browsers with no classList support
	    if (!("classList" in document.createElement("_")) || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg", "g"))) {
	
	        (function(view) {
	
	            "use strict";
	
	            if (!('Element' in view)) {
	                return;
	            }
	
	            var classListProp = "classList",
	                protoProp = "prototype",
	                elemCtrProto = view.Element[protoProp],
	                objCtr = Object,
	                strTrim = String[protoProp].trim || function() {
	                    return this.replace(/^\s+|\s+$/g, "");
	                }, arrIndexOf = Array[protoProp].indexOf || function(item) {
	                    var
	                    i = 0,
	                        len = this.length;
	                    for (; i < len; i++) {
	                        if (i in this && this[i] === item) {
	                            return i;
	                        }
	                    }
	                    return -1;
	                },
	                // Vendors: please allow content code to instantiate DOMExceptions
	                DOMEx = function(type, message) {
	                    this.name = type;
	                    this.code = DOMException[type];
	                    this.message = message;
	                }, checkTokenAndGetIndex = function(classList, token) {
	                    if (token === "") {
	                        throw new DOMEx(
	                            "SYNTAX_ERR", "An invalid or illegal string was specified");
	                    }
	                    if (/\s/.test(token)) {
	                        throw new DOMEx(
	                            "INVALID_CHARACTER_ERR", "String contains an invalid character");
	                    }
	                    return arrIndexOf.call(classList, token);
	                }, ClassList = function(elem) {
	                    var
	                    trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
	                        classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
	                        i = 0,
	                        len = classes.length;
	                    for (; i < len; i++) {
	                        this.push(classes[i]);
	                    }
	                    this._updateClassName = function() {
	                        elem.setAttribute("class", this.toString());
	                    };
	                }, classListProto = ClassList[protoProp] = [],
	                classListGetter = function() {
	                    return new ClassList(this);
	                };
	            // Most DOMException implementations don't allow calling DOMException's toString()
	            // on non-DOMExceptions. Error's toString() is sufficient here.
	            DOMEx[protoProp] = Error[protoProp];
	            classListProto.item = function(i) {
	                return this[i] || null;
	            };
	            classListProto.contains = function(token) {
	                token += "";
	                return checkTokenAndGetIndex(this, token) !== -1;
	            };
	            classListProto.add = function() {
	                var
	                tokens = arguments,
	                    i = 0,
	                    l = tokens.length,
	                    token, updated = false;
	                do {
	                    token = tokens[i] + "";
	                    if (checkTokenAndGetIndex(this, token) === -1) {
	                        this.push(token);
	                        updated = true;
	                    }
	                }
	                while (++i < l);
	
	                if (updated) {
	                    this._updateClassName();
	                }
	            };
	            classListProto.remove = function() {
	                var
	                tokens = arguments,
	                    i = 0,
	                    l = tokens.length,
	                    token, updated = false,
	                    index;
	                do {
	                    token = tokens[i] + "";
	                    index = checkTokenAndGetIndex(this, token);
	                    while (index !== -1) {
	                        this.splice(index, 1);
	                        updated = true;
	                        index = checkTokenAndGetIndex(this, token);
	                    }
	                }
	                while (++i < l);
	
	                if (updated) {
	                    this._updateClassName();
	                }
	            };
	            classListProto.toggle = function(token, force) {
	                token += "";
	
	                var
	                result = this.contains(token),
	                    method = result ?
	                        force !== true && "remove" :
	                        force !== false && "add";
	
	                if (method) {
	                    this[method](token);
	                }
	
	                if (force === true || force === false) {
	                    return force;
	                } else {
	                    return !result;
	                }
	            };
	            classListProto.toString = function() {
	                return this.join(" ");
	            };
	
	            if (objCtr.defineProperty) {
	                var classListPropDesc = {
	                    get: classListGetter,
	                    enumerable: true,
	                    configurable: true
	                };
	                try {
	                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	                } catch (ex) { // IE 8 doesn't support enumerable:true
	                    if (ex.number === -0x7FF5EC54) {
	                        classListPropDesc.enumerable = false;
	                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	                    }
	                }
	            } else if (objCtr[protoProp].__defineGetter__) {
	                elemCtrProto.__defineGetter__(classListProp, classListGetter);
	            }
	
	        }(self));
	
	    } else {
	        // There is full or partial native classList support, so just check if we need
	        // to normalize the add/remove and toggle APIs.
	
	        (function() {
	            "use strict";
	
	            var testElement = document.createElement("_");
	
	            testElement.classList.add("c1", "c2");
	
	            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
	            // classList.remove exist but support only one argument at a time.
	            if (!testElement.classList.contains("c2")) {
	                var createMethod = function(method) {
	                    var original = DOMTokenList.prototype[method];
	
	                    DOMTokenList.prototype[method] = function(token) {
	                        var i, len = arguments.length;
	
	                        for (i = 0; i < len; i++) {
	                            token = arguments[i];
	                            original.call(this, token);
	                        }
	                    };
	                };
	                createMethod('add');
	                createMethod('remove');
	            }
	
	            testElement.classList.toggle("c3", false);
	
	            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
	            // support the second argument.
	            if (testElement.classList.contains("c3")) {
	                var _toggle = DOMTokenList.prototype.toggle;
	
	                DOMTokenList.prototype.toggle = function(token, force) {
	                    if (1 in arguments && !this.contains(token) === !force) {
	                        return force;
	                    } else {
	                        return _toggle.call(this, token);
	                    }
	                };
	
	            }
	
	            testElement = null;
	        }());
	    }
	
	}


/***/ },
/* 94 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	module.exports = extend;
	function extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || typeof add !== 'object') return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}


/***/ },
/* 95 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      } else {
	        // At least give some kind of context to the user
	        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	        err.context = er;
	        throw err;
	      }
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(98);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(99);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(97)))

/***/ },
/* 97 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 99 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 100 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Минидиспетчер для периодического выполнения задач
	 * 
	 */
	
	var TAO_JSCrontab = function () {
		var TAO_JSCrontab = {
	
			interval: null,
			period: 500,
			queue: {
				_unnamed: []
			},
			debug_mode: false,
	
			debug: function debug(mode) {
				TAO_JSCrontab.debug_mode = true === mode;
			},
	
			start: function start(period) {
				if (TAO_JSCrontab.interval) {
					TAO_JSCrontab.stop.apply(TAO_JSCrontab);
				}
				if (period) {
					TAO_JSCrontab.period = period;
				}
				TAO_JSCrontab.interval = setInterval(function () {
					TAO_JSCrontab.run.apply(TAO_JSCrontab);
				}, TAO_JSCrontab.period);
				if (TAO_JSCrontab.debug_mode) {
					console.log('TAO_JSCrontab has started at', TAO_JSCrontab.period, 'ms interval.');
				}
			},
	
			stop: function stop() {
				clearInterval(TAO_JSCrontab.interval);
				TAO_JSCrontab.interval = null;
				if (TAO_JSCrontab.debug_mode) {
					console.log('TAO_JSCrontab has stoped.');
				}
			},
	
			run: function run() {
				var l = 0,
				    i = 0,
				    name = '';
				for (name in TAO_JSCrontab.queue) {
					if (!TAO_JSCrontab.queue.hasOwnProperty(name)) {
						continue;
					}
					if ('_unnamed' === name) {
						l = TAO_JSCrontab.queue._unnamed.length;
						for (i = 0; i < l; i++) {
							if (TAO_JSCrontab.debug_mode) {
								console.log('TAO_JSCrontab unnamed callback #', i.toString(), 'is running...');
							}
							TAO_JSCrontab.queue._unnamed[i]();
						}
					} else {
						if (TAO_JSCrontab.debug_mode) {
							console.log('TAO_JSCrontab callback', name, 'is running...');
						}
						TAO_JSCrontab.queue[name]();
					}
				}
			},
	
			add: function add(callback) {
				TAO_JSCrontab.queue._unnamed.push(callback);
				if (TAO_JSCrontab.debug_mode) {
					console.log('TAO_JSCrontab unnamed callback #', (TAO_JSCrontab.queue._unnamed.length - 1).toString(), 'has added.');
				}
			},
	
			addNamed: function addNamed(name, callback) {
				if (TAO_JSCrontab.isInternalName(name)) {
					return;
				}
				TAO_JSCrontab.queue[name] = callback;
				if (TAO_JSCrontab.debug_mode) {
					console.log('TAO_JSCrontab callback', name, 'has added.');
				}
			},
	
			remove: function remove(callback) {
				var l = TAO_JSCrontab.queue._unnamed.length,
				    i = 0;
				for (i = 0; i < l; i++) {
					if (callback === TAO_JSCrontab.queue._unnamed[i]) {
						delete TAO_JSCrontab.queue._unnamed[i];
						if (TAO_JSCrontab.debug_mode) {
							console.log('TAO_JSCrontab unnamed callback #', i.toString(), 'has removed.');
						}
						break;
					}
				}
			},
	
			removeNamed: function removeNamed(name) {
				if (TAO_JSCrontab.isInternalName(name)) {
					return;
				}
				if ('undefined' !== typeof TAO_JSCrontab.queue[name]) {
					delete TAO_JSCrontab.queue[name];
					if (TAO_JSCrontab.debug_mode) {
						console.log('TAO_JSCrontab callback', name.toString(), 'has removed.');
					}
				}
			},
	
			isInternalName: function isInternalName(name) {
				return '_unnamed' === name;
			}
	
		};
	
		return TAO_JSCrontab;
	}();
	
	module.exports = TAO_JSCrontab;

/***/ },
/* 101 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 102 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(104);
	
	
	(0, _jquery2.default)(function () {
		(0, _jquery2.default)('.print-button').on('click', function () {
			window.print();
		});
	
		if ('#printing' === location.hash) {
			var print_window = window.open(location.pathname + '/print', '_blank');
			if (print_window) {
				print_window.focus();
			}
		}
	});

/***/ },
/* 104 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jquery = __webpack_require__(1);
	
	var _jquery2 = _interopRequireDefault(_jquery);
	
	var _component = __webpack_require__(89);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _crontab = __webpack_require__(100);
	
	var _crontab2 = _interopRequireDefault(_crontab);
	
	__webpack_require__(106);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	__webpack_require__(107);
	/* global ymaps */
	
	
	(0, _jquery2.default)(function () {
		// Блокируем работу скрипта для страниц с пользовательскими соглашениями,
		// подгружаемыми через fancybox
		if (0 !== (0, _jquery2.default)('.do-not-add-defects').length) {
			return;
		}
	
		// Пытаемся зачистить заголовок "всплывающего окна"
		// Код взят из статьи - http://internetdevels.com/blog/creating-popups-in-Drupal-8
		Drupal.behaviors.Crutch = {
			attach: function attach(context, settings) {
				function strip_tags(input, allowed) {
					allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
					var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
					    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
					return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
						return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
					});
				}
	
				(0, _jquery2.default)(document).bind('ajaxSuccess.Crutch', function () {
					var value = (0, _jquery2.default)('.ui-dialog-title');
	
					if (0 < value.length && !value.hasClass('do-once')) {
						var $value = (0, _jquery2.default)(value),
						    text = strip_tags($value.text());
						$value.text(text);
						value.addClass('do-once');
					}
					(0, _jquery2.default)(this).unbind('ajaxSuccess.Crutch');
				});
			}
		};
	
		// Настраиваем показ изображений и соглашений во "всплывающем окне"
		(0, _jquery2.default)('.fancybox:not(.fancybox-processed)').each(function () {
			var $this = (0, _jquery2.default)(this);
			if ('ajax' == $this.data('fancybox-type')) {
				$this.fancybox({
					type: 'ajax',
					autoSize: false,
					width: '1200px'
				});
			} else if ('iframe' == $this.data('fancybox-type')) {
				$this.fancybox({
					type: 'iframe',
					autoSize: false,
					width: '1200px'
				});
			} else {
				$this.fancybox({
					helpers: {
						title: {
							type: 'inside'
						}
					}
				});
			}
			$this.addClass('fancybox-processed');
		});
	
		// Хаки для обновляемых выпадающих списков
		// - Запоминаем SelectFx в списке по ID select'а, чтобы уметь его обновлять
		var selectFxList = [];
		var selectFxInit = function selectFxInit() {
			var select = this,
			    $select = (0, _jquery2.default)(this),
			    select_id = '#' + select.id,
			    drupal_selector = $select.data('drupal-selector'),
			    scrolled_prefix_list = ['product-name', 'field-kollekcia', 'field-dizain', 'select-defect-type'],
			    l = 0,
			    i = 0,
			    scrolled_prefix = '';
	
			if ($select.hasClass('selectfx')) {
				return;
			}
			$select.addClass('selectfx');
			selectFxList[select_id] = new _component2.default(select, { onChange: function onChange(val) {
					$select.trigger('change');
					return false;
				} });
	
			// Назначаем обработчики нажатия на элементы списка, чтобы обновить состояние скрытого select-элемента
			$select.parent().find('.cs-options li').on('click', function () {
				$select.trigger({ type: 'state:value', value: (0, _jquery2.default)(this).attr('data-value') });
			});
			// Отмечаем изначально выбранный элемент соответствующим стилем
			$select.parent()
			// .find('.cs-options li:nth-child(' + (select.selectedIndex + 1).toString() + ')')
			.find('.cs-options li[data-value="' + $select.val().toString() + '"]').addClass('cs-selected');
	
			// Делаем список "прокручиваемым", компактным
			l = scrolled_prefix_list.length;
			for (i = 0; i < l; i++) {
				scrolled_prefix = 'edit-' + scrolled_prefix_list[i];
				if (0 === drupal_selector.indexOf(scrolled_prefix)) {
					(0, _jquery2.default)('> ul', $select.siblings('div.cs-options')).addClass('scrolled');
				}
			}
		};
		var selectFxReinit = function selectFxReinit() {
			var $select = (0, _jquery2.default)(this),
			    $selectfx = $select.parent();
			$select.detach();
			$select.removeClass('selectfx');
			$selectfx.before($select);
			$selectfx.remove();
			$select.each(selectFxInit);
		};
		var selectFxProcess = function selectFxProcess() {
			var selectors = ['#product-collection'],
			    $changed = null,
			    l = selectors.length,
			    i = 0,
			    unit_selectors = ['#edit-product-count-all-ez', '#edit-product-count-bad-ez', '#edit-field-count-ez'],
			    unit_selector = '',
			    $units = null,
			    unit = '',
			    ul = unit_selectors.length,
			    ui = 0,
			    dl = 0,
			    di = 0,
			    dol = 0,
			    doi = 0,
			    design_id_prefix = '',
			    design_id = '',
			    design_options_json = '',
			    design_options = [],
			    $design = null;
	
			// Обходим список селекторов для проверки изменений
			for (i = 0; i < l; i++) {
				$changed = (0, _jquery2.default)(selectors[i] + '.ajax-changed');
				if (0 == $changed.length) {
					continue;
				}
				// Убираем класс, обозначающий изменения
				$changed.removeClass('ajax-changed');
				// Drupal.behaviors.AJAX.attach($changed, window.drupalSettings);
				(0, _jquery2.default)('select', $changed).each(selectFxInit);
				// Обрабатываем автоматический выбор единиц измерения количества товара
				if (unit = $changed.data('product-unit')) {
					for (ui = 0; ui < ul; ui++) {
						unit_selector = unit_selectors[ui];
						$units = (0, _jquery2.default)(unit_selector);
						if (0 == $units.length) {
							continue;
						}
						$units.each(function () {
							var ol = this.options.length,
							    oi = 0;
							for (oi = 0; oi < ol; oi++) {
								if (unit == this.options[oi].value) {
									this.options[oi].selected = true;
									// Обновляем связанный SelectFx
									if ('undefined' !== typeof selectFxList[unit_selector]) {
										selectFxList[unit_selector].current = oi;
										selectFxList[unit_selector]._changeOption();
									}
								} else {
									this.options[oi].selected = false;
								}
							}
						});
					}
				}
				if ((design_id_prefix = $changed.data('design-id')) && (design_options_json = $changed.data('design-options'))) {
					design_options = JSON.parse(design_options_json);
					dol = design_options.length;
					dl = (0, _jquery2.default)('fieldset#edit-formsdefectslist-fieldset').length;
					for (di = 0; di < dl; di++) {
						design_id = '#' + design_id_prefix + '-' + di.toString();
						if (0 == ($design = (0, _jquery2.default)(design_id)).length) {
							continue;
						}
						$design.empty();
						for (doi = 0; doi < dol; doi++) {
							$design.append((0, _jquery2.default)('<option/>').val(design_options[doi]).text(design_options[doi]));
						}
						$design.each(selectFxReinit);
					}
				}
			}
		};
	
		// Делаем "красиво" выпадающим спискам
		(0, _jquery2.default)('select').each(selectFxInit);
	
		// Вывод процентов по статусу
		var showStatusPercentage = function showStatusPercentage() {
			var $this = (0, _jquery2.default)(this),
			    $wrapper = $this.parents('.b-claim-item__fields-wrapper'),
			    $progressbar = (0, _jquery2.default)('.b-claim-item__progressbar-item', $wrapper),
			    full = 0,
			    status = 0;
			if (0 < $progressbar.length) {
				full = parseInt($progressbar.parent().width(), 10);
				status = parseInt($progressbar.width(), 10);
				if (0 < full) {
					$this.html(Math.round(status / full * 100).toString() + '%');
				}
			}
		};
		var showMobileStatusPercentage = function showMobileStatusPercentage() {
			var $this = (0, _jquery2.default)(this),
			    $wrapper = $this.parents('.b-claim-item__fields-wrapper'),
			    $progressbar = (0, _jquery2.default)('.b-claim-item__mobile-progressbar-fg', $wrapper),
			    full = 0,
			    status = 0;
			if (0 < $progressbar.length) {
				full = parseInt($progressbar.parent().width(), 10);
				status = parseInt($progressbar.width(), 10);
				if (0 < full) {
					$this.html(Math.round(status / full * 100).toString() + '%');
				}
			}
		};
	
		// Добавляем обработчики в "расписание"
		// - "Красивые" выпадающие списки
		_crontab2.default.addNamed('selectFxProcess', selectFxProcess);
		// - Вывод статуса в процентах
		_crontab2.default.addNamed('statusPercentage', function () {
			(0, _jquery2.default)('.c-status-percentage').each(showStatusPercentage);
			(0, _jquery2.default)('.b-claim-item__mobile-progressbar-fg').each(showMobileStatusPercentage);
		});
		// - Разворачивание заявок на "мобильной" версии
		_crontab2.default.addNamed('showMobileDetails', function () {
			(0, _jquery2.default)('.b-claim-item__control').each(function () {
				var $this = (0, _jquery2.default)(this),
				    processed_class = 'deatils_on_click';
				if ($this.hasClass(processed_class)) {
					return;
				}
				$this.on('click', function () {
					var $detail = $this.parent().find('.b-claim-item__detail');
					$detail.toggleClass('b-claim-item__detail_visible');
					$this.toggleClass('b-claim-item__control_plus');
					$this.toggleClass('b-claim-item__control_minus');
					FooterReplace();
				});
				$this.addClass(processed_class);
			});
		});
	
		// Запускаем "обработку по расписанию" - 3 вызова в секунду
		_crontab2.default.start(333);
	
		// Подстраиваем ширину всплывающего окна Drupal
		var $width = (0, _jquery2.default)(window).width();
		if (1000 > $width) {
			(0, _jquery2.default)('a[data-dialog-type="modal"]').each(function () {
				var $this = (0, _jquery2.default)(this);
				$this.data('dialog-options', { width: $width });
			});
		}
	
		// Разворачивание и сворачивание меню на "мобильной" версии
		(0, _jquery2.default)('.b-nav_mobile__burger').on('click', function () {
			var $burger = (0, _jquery2.default)(this),
			    $close = (0, _jquery2.default)('.b-nav_mobile__close'),
			    $menu = (0, _jquery2.default)('.b-nav_mobile__menu');
			$menu.addClass('b-nav_mobile__menu_open');
			$burger.hide();
			$close.show();
		});
		(0, _jquery2.default)('.b-nav_mobile__close').on('click', function () {
			var $burger = (0, _jquery2.default)('.b-nav_mobile__burger'),
			    $close = (0, _jquery2.default)(this),
			    $menu = (0, _jquery2.default)('.b-nav_mobile__menu');
			$menu.removeClass('b-nav_mobile__menu_open');
			$close.hide();
			$burger.show();
		});
	
		(0, _jquery2.default)('.form-cancel').on('click', function () {
			location.href = '/';
			return false;
		});
	
		(0, _jquery2.default)("body").bind("DOMSubtreeModified", function (event) {
			//		window.Drupal.behaviors.AJAX.attach('body');
			(0, _jquery2.default)('select').each(selectFxInit);
		});
		FooterReplace();
		(0, _jquery2.default)(window).resize(function () {
			FooterReplace();
		});
	
		function init() {
			(0, _jquery2.default)('.ya-map').each(function () {
				if ('undefined' !== typeof ymaps['Map']) {
					new YaMaps((0, _jquery2.default)(this).attr('id'), ymaps);
				}
			});
		}
		function YaMaps(id, ymaps) {
			this.process(id, ymaps);
		}
		YaMaps.prototype.myPlacemark = null;
		YaMaps.prototype.myMap = null;
		YaMaps.prototype.ymaps = null;
		YaMaps.prototype.id = null;
		YaMaps.prototype.process = function (id, ymaps) {
			var obj = this;
	
			obj.ymaps = ymaps;
			obj.id = id;
			obj.myPlacemark = null;
			obj.myMap = new obj.ymaps.Map(obj.id, {
				center: [55.753994, 37.622093],
				zoom: 9,
				controls: ['zoomControl', 'fullscreenControl', 'searchControl']
			}, {
				searchControlProvider: 'yandex#search'
			});
			obj.myMap.events.add('click', function (e) {
				var coords = e.get('coords');
	
				// Если метка уже создана – просто передвигаем ее.
				if (obj.myPlacemark) {
					obj.myPlacemark.geometry.setCoordinates(coords);
				}
				// Если нет – создаем.
				else {
						obj.myPlacemark = obj.createPlacemark(coords);
						obj.myMap.geoObjects.add(obj.myPlacemark);
						// Слушаем событие окончания перетаскивания на метке.
						obj.myPlacemark.events.add('dragend', function () {
							obj.getAddress(obj.myPlacemark.geometry.getCoordinates());
						});
					}
				obj.getAddress(coords);
			});
		};
		YaMaps.prototype.createPlacemark = function (coords) {
			return new this.ymaps.Placemark(coords, {
				iconCaption: 'поиск...'
			}, {
				preset: 'islands#violetDotIconWithCaption',
				draggable: true
			});
		};
		YaMaps.prototype.getAddress = function (coords) {
			var obj = this;
	
			obj.myPlacemark.properties.set('iconCaption', 'поиск...');
			obj.ymaps.geocode(coords).then(function (res) {
				var firstGeoObject = res.geoObjects.get(0);
	
				switch (obj.id) {
					case "UserAddress":
						obj.UserAddress(firstGeoObject);
						break;
					case "ProductAddress":
						obj.ProductAddress(firstGeoObject);
						break;
				}
	
				obj.myPlacemark.properties.set({
					iconCaption: firstGeoObject.properties.get('name'),
					balloonContent: firstGeoObject.properties.get('text')
				});
			});
		};
		YaMaps.prototype.UserAddress = function (firstGeoObject) {
			var obj = this,
			    saa = null,
			    street = null,
			    num = null,
			    city = null,
			    area_property = 'metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea',
			    subarea_property = area_property + '.SubAdministrativeArea';
	
			if (!firstGeoObject.properties.get(subarea_property) === false) {
				saa = firstGeoObject.properties.get(subarea_property);
			} else {
				saa = firstGeoObject.properties.get(area_property);
			}
	
			city = saa['Locality']['LocalityName'];
			if (saa['Locality']['Thoroughfare']) {
				street = saa['Locality']['Thoroughfare']['ThoroughfareName'];
				obj = saa['Locality']['Thoroughfare'];
			}
			if (saa['Locality']['DependentLocality']) {
				street = saa['Locality']['DependentLocality']['DependentLocalityName'];
				obj = saa['Locality']['DependentLocality'];
			}
			if (obj['Premise']) {
				num = obj['Premise']['PremiseNumber'];
			}
			(0, _jquery2.default)('input[name="field_c_city"]').val(city);
			(0, _jquery2.default)('input[name="field_c_street"]').val(street);
			(0, _jquery2.default)('input[name="field_c_home_num"]').val(num);
		};
		YaMaps.prototype.ProductAddress = function (firstGeoObject) {
			var saa = null,
			    city = null,
			    region_parts = [],
			    city_index = 0;
	
			if (!firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea') === false) {
				saa = firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea');
			} else {
				saa = firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea');
			}
			city = saa['Locality']['LocalityName'];
	
			region_parts = firstGeoObject.properties.get('description').split(', ');
			if (-1 < (city_index = region_parts.indexOf(city))) {
				region_parts.splice(city_index, 1);
			}
	
			(0, _jquery2.default)('input[name="product_region"]').val(region_parts.join(', '));
			(0, _jquery2.default)('input[name="product_city"]').val(city);
			(0, _jquery2.default)('textarea[name="product_address"]').val(firstGeoObject.properties.get('name'));
		};
		ymaps.ready(init);
	
		// Показ статической карты
		var $showMap = (0, _jquery2.default)('.address-map');
		if (0 < $showMap.length) {
			$showMap.each(function () {
				var $this = (0, _jquery2.default)(this),
				    address = $this.data('address'),
				    width = parseInt($this.width(), 10).toString(),
				    height = parseInt($this.height(), 10).toString();
				if (address) {
					_jquery2.default.get('https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + encodeURIComponent(address), null, function (data) {
						if ('undefined' === typeof data['response'] || 'undefined' === typeof data.response['GeoObjectCollection'] || 'undefined' === typeof data.response.GeoObjectCollection['featureMember'] || 0 === data.response.GeoObjectCollection.featureMember.length) {
							return;
						}
						var coords = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.replace(' ', ',');
						$this.attr('src', 'https://static-maps.yandex.ru/1.x/?l=map&ll=' + coords + '&z=15&size=' + width + ',' + height + '&pt=' + coords + ',pm2rdl').attr('alt', address).attr('title', address);
					}, 'json');
				}
			});
		}
	});
	
	function FooterReplace() {
		var $footer = (0, _jquery2.default)('footer'),
		    $b_footer = (0, _jquery2.default)('.b-footer'),
		    height = $footer.height();
		if (0 == $b_footer.length) {
			return;
		}
		if ($b_footer.offset().top < (0, _jquery2.default)(window).height() - height) {
			$footer.addClass('footer--down');
		} else {
			$footer.removeClass('footer--down');
		}
	}

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {/*! fancyBox v2.1.4 fancyapps.com | fancyapps.com/fancybox/#license */
	(function(C,z,f,r){var q=f(C),n=f(z),b=f.fancybox=function(){b.open.apply(this,arguments)},H=navigator.userAgent.match(/msie/),w=null,s=z.createTouch!==r,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},p=function(a){return a&&"string"===f.type(a)},F=function(a){return p(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&F(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},x=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.4",defaults:{padding:15,margin:20,width:800,
	height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},keys:{next:{13:"left",
	34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
	(H?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
	openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
	isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
	c.metadata())):k=c);g=d.href||k.href||(p(c)?c:null);h=d.title!==r?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));p(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":p(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(p(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
	k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==r&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
	b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
	setTimeout(b.next,b.current.playSpeed))},c=function(){d();f("body").unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,f("body").bind({"afterShow.player onUpdate.player":e,"onCancel.player beforeClose.player":c,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(p(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},
	prev:function(a){var d=b.current;d&&(p(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==r&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},
	e.dim,k)))},update:function(a){var d=a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(w),w=null);b.isOpen&&!w&&(w=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),w=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),
	b.trigger("onUpdate")),b.update())},hideLoading:function(){n.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");n.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||
	!1,d={x:q.scrollLeft(),y:q.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&C.innerWidth?C.innerWidth:q.width(),d.h=s&&C.innerHeight?C.innerHeight:q.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");n.unbind(".fb");q.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(q.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&n.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=
	e.target||e.srcElement;if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==r)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&
	"hidden"===h[0].style.overflow)&&(h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,
	e){e&&(b.helpers[d]&&f.isFunction(b.helpers[d][a]))&&(e=f.extend(!0,{},b.helpers[d].defaults,e),b.helpers[d][a](e,c))});f.event.trigger(a+".fb")}},isImage:function(a){return p(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i)},isSWF:function(a){return p(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&
	(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=
	!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=!0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,x(d.padding[a]))});b.trigger("onReady");
	if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");"image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=
	this.width;b.coming.height=this.height;b._afterLoad()};a.onerror=function(){this.onload=this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,
	(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=
	b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();
	e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",
	!1)}));break;case "image":e=a.tpl.image.replace("{href}",g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");
	a.inner.css("overflow","yes"===k?"scroll":"no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,
	v=h.maxHeight,s=h.scrolling,q=h.scrollOutside?h.scrollbarWidth:0,y=h.margin,p=l(y[1]+y[3]),r=l(y[0]+y[2]),z,A,t,D,B,G,C,E,w;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");y=l(k.outerWidth(!0)-k.width());z=l(k.outerHeight(!0)-k.height());A=p+y;t=r+z;D=F(c)?(a.w-A)*l(c)/100:c;B=F(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(w=h.content,h.autoHeight&&1===w.data("ready"))try{w[0].contentWindow.document.location&&(g.width(D).height(9999),G=w.contents().find("body"),q&&G.css("overflow-x",
	"hidden"),B=G.height())}catch(H){}}else if(h.autoWidth||h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(D),h.autoHeight||g.height(B),h.autoWidth&&(D=g.width()),h.autoHeight&&(B=g.height()),g.removeClass("fancybox-tmp");c=l(D);j=l(B);E=D/B;m=l(F(m)?l(m,"w")-A:m);n=l(F(n)?l(n,"w")-A:n);u=l(F(u)?l(u,"h")-t:u);v=l(F(v)?l(v,"h")-t:v);G=n;C=v;h.fitToView&&(n=Math.min(a.w-A,n),v=Math.min(a.h-t,v));A=a.w-p;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/E)),j>v&&(j=v,c=l(j*E)),c<m&&(c=m,j=l(c/E)),j<u&&
	(j=u,c=l(j*E))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&"iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,v)));if(h.fitToView)if(g.width(c).height(j),e.width(c+y),a=e.width(),p=e.height(),h.aspectRatio)for(;(a>A||p>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(v,j-10)),c=l(j*E),c<m&&(c=m,j=l(c/E)),c>n&&(c=n,j=l(c/E)),g.width(c).height(j),e.width(c+y),a=e.width(),p=e.height();else c=Math.max(m,Math.min(c,c-(a-A))),j=Math.max(u,Math.min(j,j-(p-r)));q&&("auto"===s&&j<B&&c+y+
	q<A)&&(c+=q);g.width(c).height(j);e.width(c+y);a=e.width();p=e.height();e=(a>A||p>r)&&c>m&&j>u;c=h.aspectRatio?c<G&&j<C&&c<D&&j<B:(c<G||j<C)&&(c<D||j<B);f.extend(h,{dim:{width:x(a),height:x(p)},origWidth:D,origHeight:B,canShrink:e,canExpand:c,wPadding:y,hPadding:z,wrapSpace:p-k.outerHeight(!0),skinSpace:k.height()-j});!w&&(h.autoHeight&&j>u&&j<v&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",
	top:c[0],left:c[3]};d.autoCenter&&d.fixed&&!a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=x(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=x(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&
	(d.preventDefault(),b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
	a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
	(c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:x(c.top-h*a.topRatio),left:x(c.left-j*a.leftRatio),width:x(f+j),height:x(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===
	f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
	{duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=x(l(e[g])-200),c[g]="+=200px"):(e[g]=x(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
	b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=f('<div class="fancybox-overlay"></div>').appendTo("body");
	this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(q.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){f(a.target).hasClass("fancybox-overlay")&&(b.isActive?b.close():d.close())});this.overlay.css(a.css).show()},
	close:function(){f(".fancybox-overlay").remove();q.unbind("resize.overlay");this.overlay=null;!1!==this.margin&&(f("body").css("margin-right",this.margin),this.margin=!1);this.el&&this.el.removeClass("fancybox-lock")},update:function(){var a="100%",b;this.overlay.width(a).height("100%");H?(b=Math.max(z.documentElement.offsetWidth,z.body.offsetWidth),n.width()>b&&(a=n.width())):n.width()>q.width()&&(a=n.width());this.overlay.width(a).height(n.height())},onReady:function(a,b){f(".fancybox-overlay").stop(!0,
	!0);this.overlay||(this.margin=n.height()>q.height()||"scroll"===f("body").css("overflow-y")?f("body").css("margin-right"):!1,this.el=z.all&&!z.querySelector?f("html"):f("body"),this.create(a));a.locked&&this.fixed&&(b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){b.locked&&(this.el.addClass("fancybox-lock"),!1!==this.margin&&f("body").css("margin-right",l(this.margin)+b.scrollbarWidth));this.open(a)},onUpdate:function(){this.fixed||
	this.update()},afterClose:function(a){this.overlay&&!b.isActive&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(p(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),
	H&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+
	'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):n.undelegate(c,"click.fb-start").delegate(c+":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};n.ready(function(){f.scrollbarWidth===r&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),
	b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===r){var a=f.support,d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body"),e=20===d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")})})})(window,document,jQuery);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 107 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 108 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 109 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(jQuery) {!function ($) {
	
	  "use strict";
	
	  var FOUNDATION_VERSION = '6.2.3';
	
	  // Global Foundation object
	  // This is attached to the window, or used as a module for AMD/Browserify
	  var Foundation = {
	    version: FOUNDATION_VERSION,
	
	    /**
	     * Stores initialized plugins.
	     */
	    _plugins: {},
	
	    /**
	     * Stores generated unique ids for plugin instances
	     */
	    _uuids: [],
	
	    /**
	     * Returns a boolean for RTL support
	     */
	    rtl: function () {
	      return $('html').attr('dir') === 'rtl';
	    },
	    /**
	     * Defines a Foundation plugin, adding it to the `Foundation` namespace and the list of plugins to initialize when reflowing.
	     * @param {Object} plugin - The constructor of the plugin.
	     */
	    plugin: function (plugin, name) {
	      // Object key to use when adding to global Foundation object
	      // Examples: Foundation.Reveal, Foundation.OffCanvas
	      var className = name || functionName(plugin);
	      // Object key to use when storing the plugin, also used to create the identifying data attribute for the plugin
	      // Examples: data-reveal, data-off-canvas
	      var attrName = hyphenate(className);
	
	      // Add to the Foundation object and the plugins list (for reflowing)
	      this._plugins[attrName] = this[className] = plugin;
	    },
	    /**
	     * @function
	     * Populates the _uuids array with pointers to each individual plugin instance.
	     * Adds the `zfPlugin` data-attribute to programmatically created plugins to allow use of $(selector).foundation(method) calls.
	     * Also fires the initialization event for each plugin, consolidating repetitive code.
	     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
	     * @param {String} name - the name of the plugin, passed as a camelCased string.
	     * @fires Plugin#init
	     */
	    registerPlugin: function (plugin, name) {
	      var pluginName = name ? hyphenate(name) : functionName(plugin.constructor).toLowerCase();
	      plugin.uuid = this.GetYoDigits(6, pluginName);
	
	      if (!plugin.$element.attr('data-' + pluginName)) {
	        plugin.$element.attr('data-' + pluginName, plugin.uuid);
	      }
	      if (!plugin.$element.data('zfPlugin')) {
	        plugin.$element.data('zfPlugin', plugin);
	      }
	      /**
	       * Fires when the plugin has initialized.
	       * @event Plugin#init
	       */
	      plugin.$element.trigger('init.zf.' + pluginName);
	
	      this._uuids.push(plugin.uuid);
	
	      return;
	    },
	    /**
	     * @function
	     * Removes the plugins uuid from the _uuids array.
	     * Removes the zfPlugin data attribute, as well as the data-plugin-name attribute.
	     * Also fires the destroyed event for the plugin, consolidating repetitive code.
	     * @param {Object} plugin - an instance of a plugin, usually `this` in context.
	     * @fires Plugin#destroyed
	     */
	    unregisterPlugin: function (plugin) {
	      var pluginName = hyphenate(functionName(plugin.$element.data('zfPlugin').constructor));
	
	      this._uuids.splice(this._uuids.indexOf(plugin.uuid), 1);
	      plugin.$element.removeAttr('data-' + pluginName).removeData('zfPlugin')
	      /**
	       * Fires when the plugin has been destroyed.
	       * @event Plugin#destroyed
	       */
	      .trigger('destroyed.zf.' + pluginName);
	      for (var prop in plugin) {
	        plugin[prop] = null; //clean up script to prep for garbage collection.
	      }
	      return;
	    },
	
	    /**
	     * @function
	     * Causes one or more active plugins to re-initialize, resetting event listeners, recalculating positions, etc.
	     * @param {String} plugins - optional string of an individual plugin key, attained by calling `$(element).data('pluginName')`, or string of a plugin class i.e. `'dropdown'`
	     * @default If no argument is passed, reflow all currently active plugins.
	     */
	    reInit: function (plugins) {
	      var isJQ = plugins instanceof $;
	      try {
	        if (isJQ) {
	          plugins.each(function () {
	            $(this).data('zfPlugin')._init();
	          });
	        } else {
	          var type = typeof plugins,
	              _this = this,
	              fns = {
	            'object': function (plgs) {
	              plgs.forEach(function (p) {
	                p = hyphenate(p);
	                $('[data-' + p + ']').foundation('_init');
	              });
	            },
	            'string': function () {
	              plugins = hyphenate(plugins);
	              $('[data-' + plugins + ']').foundation('_init');
	            },
	            'undefined': function () {
	              this['object'](Object.keys(_this._plugins));
	            }
	          };
	          fns[type](plugins);
	        }
	      } catch (err) {
	        console.error(err);
	      } finally {
	        return plugins;
	      }
	    },
	
	    /**
	     * returns a random base-36 uid with namespacing
	     * @function
	     * @param {Number} length - number of random base-36 digits desired. Increase for more random strings.
	     * @param {String} namespace - name of plugin to be incorporated in uid, optional.
	     * @default {String} '' - if no plugin name is provided, nothing is appended to the uid.
	     * @returns {String} - unique id
	     */
	    GetYoDigits: function (length, namespace) {
	      length = length || 6;
	      return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length)).toString(36).slice(1) + (namespace ? '-' + namespace : '');
	    },
	    /**
	     * Initialize plugins on any elements within `elem` (and `elem` itself) that aren't already initialized.
	     * @param {Object} elem - jQuery object containing the element to check inside. Also checks the element itself, unless it's the `document` object.
	     * @param {String|Array} plugins - A list of plugins to initialize. Leave this out to initialize everything.
	     */
	    reflow: function (elem, plugins) {
	
	      // If plugins is undefined, just grab everything
	      if (typeof plugins === 'undefined') {
	        plugins = Object.keys(this._plugins);
	      }
	      // If plugins is a string, convert it to an array with one item
	      else if (typeof plugins === 'string') {
	          plugins = [plugins];
	        }
	
	      var _this = this;
	
	      // Iterate through each plugin
	      $.each(plugins, function (i, name) {
	        // Get the current plugin
	        var plugin = _this._plugins[name];
	
	        // Localize the search to all elements inside elem, as well as elem itself, unless elem === document
	        var $elem = $(elem).find('[data-' + name + ']').addBack('[data-' + name + ']');
	
	        // For each plugin found, initialize it
	        $elem.each(function () {
	          var $el = $(this),
	              opts = {};
	          // Don't double-dip on plugins
	          if ($el.data('zfPlugin')) {
	            console.warn("Tried to initialize " + name + " on an element that already has a Foundation plugin.");
	            return;
	          }
	
	          if ($el.attr('data-options')) {
	            var thing = $el.attr('data-options').split(';').forEach(function (e, i) {
	              var opt = e.split(':').map(function (el) {
	                return el.trim();
	              });
	              if (opt[0]) opts[opt[0]] = parseValue(opt[1]);
	            });
	          }
	          try {
	            $el.data('zfPlugin', new plugin($(this), opts));
	          } catch (er) {
	            console.error(er);
	          } finally {
	            return;
	          }
	        });
	      });
	    },
	    getFnName: functionName,
	    transitionend: function ($elem) {
	      var transitions = {
	        'transition': 'transitionend',
	        'WebkitTransition': 'webkitTransitionEnd',
	        'MozTransition': 'transitionend',
	        'OTransition': 'otransitionend'
	      };
	      var elem = document.createElement('div'),
	          end;
	
	      for (var t in transitions) {
	        if (typeof elem.style[t] !== 'undefined') {
	          end = transitions[t];
	        }
	      }
	      if (end) {
	        return end;
	      } else {
	        end = setTimeout(function () {
	          $elem.triggerHandler('transitionend', [$elem]);
	        }, 1);
	        return 'transitionend';
	      }
	    }
	  };
	
	  Foundation.util = {
	    /**
	     * Function for applying a debounce effect to a function call.
	     * @function
	     * @param {Function} func - Function to be called at end of timeout.
	     * @param {Number} delay - Time in ms to delay the call of `func`.
	     * @returns function
	     */
	    throttle: function (func, delay) {
	      var timer = null;
	
	      return function () {
	        var context = this,
	            args = arguments;
	
	        if (timer === null) {
	          timer = setTimeout(function () {
	            func.apply(context, args);
	            timer = null;
	          }, delay);
	        }
	      };
	    }
	  };
	
	  // TODO: consider not making this a jQuery function
	  // TODO: need way to reflow vs. re-initialize
	  /**
	   * The Foundation jQuery method.
	   * @param {String|Array} method - An action to perform on the current jQuery object.
	   */
	  var foundation = function (method) {
	    var type = typeof method,
	        $meta = $('meta.foundation-mq'),
	        $noJS = $('.no-js');
	
	    if (!$meta.length) {
	      $('<meta class="foundation-mq">').appendTo(document.head);
	    }
	    if ($noJS.length) {
	      $noJS.removeClass('no-js');
	    }
	
	    if (type === 'undefined') {
	      //needs to initialize the Foundation object, or an individual plugin.
	      Foundation.MediaQuery._init();
	      Foundation.reflow(this);
	    } else if (type === 'string') {
	      //an individual method to invoke on a plugin or group of plugins
	      var args = Array.prototype.slice.call(arguments, 1); //collect all the arguments, if necessary
	      var plugClass = this.data('zfPlugin'); //determine the class of plugin
	
	      if (plugClass !== undefined && plugClass[method] !== undefined) {
	        //make sure both the class and method exist
	        if (this.length === 1) {
	          //if there's only one, call it directly.
	          plugClass[method].apply(plugClass, args);
	        } else {
	          this.each(function (i, el) {
	            //otherwise loop through the jQuery collection and invoke the method on each
	            plugClass[method].apply($(el).data('zfPlugin'), args);
	          });
	        }
	      } else {
	        //error for no class or no method
	        throw new ReferenceError("We're sorry, '" + method + "' is not an available method for " + (plugClass ? functionName(plugClass) : 'this element') + '.');
	      }
	    } else {
	      //error for invalid argument type
	      throw new TypeError('We\'re sorry, ' + type + ' is not a valid parameter. You must use a string representing the method you wish to invoke.');
	    }
	    return this;
	  };
	
	  window.Foundation = Foundation;
	  $.fn.foundation = foundation;
	
	  // Polyfill for requestAnimationFrame
	  (function () {
	    if (!Date.now || !window.Date.now) window.Date.now = Date.now = function () {
	      return new Date().getTime();
	    };
	
	    var vendors = ['webkit', 'moz'];
	    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	      var vp = vendors[i];
	      window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
	      window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
	    }
	    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
	      var lastTime = 0;
	      window.requestAnimationFrame = function (callback) {
	        var now = Date.now();
	        var nextTime = Math.max(lastTime + 16, now);
	        return setTimeout(function () {
	          callback(lastTime = nextTime);
	        }, nextTime - now);
	      };
	      window.cancelAnimationFrame = clearTimeout;
	    }
	    /**
	     * Polyfill for performance.now, required by rAF
	     */
	    if (!window.performance || !window.performance.now) {
	      window.performance = {
	        start: Date.now(),
	        now: function () {
	          return Date.now() - this.start;
	        }
	      };
	    }
	  })();
	  if (!Function.prototype.bind) {
	    Function.prototype.bind = function (oThis) {
	      if (typeof this !== 'function') {
	        // closest thing possible to the ECMAScript 5
	        // internal IsCallable function
	        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	      }
	
	      var aArgs = Array.prototype.slice.call(arguments, 1),
	          fToBind = this,
	          fNOP = function () {},
	          fBound = function () {
	        return fToBind.apply(this instanceof fNOP ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
	      };
	
	      if (this.prototype) {
	        // native functions don't have a prototype
	        fNOP.prototype = this.prototype;
	      }
	      fBound.prototype = new fNOP();
	
	      return fBound;
	    };
	  }
	  // Polyfill to get the name of a function in IE9
	  function functionName(fn) {
	    if (Function.prototype.name === undefined) {
	      var funcNameRegex = /function\s([^(]{1,})\(/;
	      var results = funcNameRegex.exec(fn.toString());
	      return results && results.length > 1 ? results[1].trim() : "";
	    } else if (fn.prototype === undefined) {
	      return fn.constructor.name;
	    } else {
	      return fn.prototype.constructor.name;
	    }
	  }
	  function parseValue(str) {
	    if (/true/.test(str)) return true;else if (/false/.test(str)) return false;else if (!isNaN(str * 1)) return parseFloat(str);
	    return str;
	  }
	  // Convert PascalCase to kebab-case
	  // Thank you: http://stackoverflow.com/a/8955580
	  function hyphenate(str) {
	    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	  }
	}(jQuery);
	'use strict';
	
	!function ($) {
	
	  Foundation.Box = {
	    ImNotTouchingYou: ImNotTouchingYou,
	    GetDimensions: GetDimensions,
	    GetOffsets: GetOffsets
	  };
	
	  /**
	   * Compares the dimensions of an element to a container and determines collision events with container.
	   * @function
	   * @param {jQuery} element - jQuery object to test for collisions.
	   * @param {jQuery} parent - jQuery object to use as bounding container.
	   * @param {Boolean} lrOnly - set to true to check left and right values only.
	   * @param {Boolean} tbOnly - set to true to check top and bottom values only.
	   * @default if no parent object passed, detects collisions with `window`.
	   * @returns {Boolean} - true if collision free, false if a collision in any direction.
	   */
	  function ImNotTouchingYou(element, parent, lrOnly, tbOnly) {
	    var eleDims = GetDimensions(element),
	        top,
	        bottom,
	        left,
	        right;
	
	    if (parent) {
	      var parDims = GetDimensions(parent);
	
	      bottom = eleDims.offset.top + eleDims.height <= parDims.height + parDims.offset.top;
	      top = eleDims.offset.top >= parDims.offset.top;
	      left = eleDims.offset.left >= parDims.offset.left;
	      right = eleDims.offset.left + eleDims.width <= parDims.width + parDims.offset.left;
	    } else {
	      bottom = eleDims.offset.top + eleDims.height <= eleDims.windowDims.height + eleDims.windowDims.offset.top;
	      top = eleDims.offset.top >= eleDims.windowDims.offset.top;
	      left = eleDims.offset.left >= eleDims.windowDims.offset.left;
	      right = eleDims.offset.left + eleDims.width <= eleDims.windowDims.width;
	    }
	
	    var allDirs = [bottom, top, left, right];
	
	    if (lrOnly) {
	      return left === right === true;
	    }
	
	    if (tbOnly) {
	      return top === bottom === true;
	    }
	
	    return allDirs.indexOf(false) === -1;
	  };
	
	  /**
	   * Uses native methods to return an object of dimension values.
	   * @function
	   * @param {jQuery || HTML} element - jQuery object or DOM element for which to get the dimensions. Can be any element other that document or window.
	   * @returns {Object} - nested object of integer pixel values
	   * TODO - if element is window, return only those values.
	   */
	  function GetDimensions(elem, test) {
	    elem = elem.length ? elem[0] : elem;
	
	    if (elem === window || elem === document) {
	      throw new Error("I'm sorry, Dave. I'm afraid I can't do that.");
	    }
	
	    var rect = elem.getBoundingClientRect(),
	        parRect = elem.parentNode.getBoundingClientRect(),
	        winRect = document.body.getBoundingClientRect(),
	        winY = window.pageYOffset,
	        winX = window.pageXOffset;
	
	    return {
	      width: rect.width,
	      height: rect.height,
	      offset: {
	        top: rect.top + winY,
	        left: rect.left + winX
	      },
	      parentDims: {
	        width: parRect.width,
	        height: parRect.height,
	        offset: {
	          top: parRect.top + winY,
	          left: parRect.left + winX
	        }
	      },
	      windowDims: {
	        width: winRect.width,
	        height: winRect.height,
	        offset: {
	          top: winY,
	          left: winX
	        }
	      }
	    };
	  }
	
	  /**
	   * Returns an object of top and left integer pixel values for dynamically rendered elements,
	   * such as: Tooltip, Reveal, and Dropdown
	   * @function
	   * @param {jQuery} element - jQuery object for the element being positioned.
	   * @param {jQuery} anchor - jQuery object for the element's anchor point.
	   * @param {String} position - a string relating to the desired position of the element, relative to it's anchor
	   * @param {Number} vOffset - integer pixel value of desired vertical separation between anchor and element.
	   * @param {Number} hOffset - integer pixel value of desired horizontal separation between anchor and element.
	   * @param {Boolean} isOverflow - if a collision event is detected, sets to true to default the element to full width - any desired offset.
	   * TODO alter/rewrite to work with `em` values as well/instead of pixels
	   */
	  function GetOffsets(element, anchor, position, vOffset, hOffset, isOverflow) {
	    var $eleDims = GetDimensions(element),
	        $anchorDims = anchor ? GetDimensions(anchor) : null;
	
	    switch (position) {
	      case 'top':
	        return {
	          left: Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left,
	          top: $anchorDims.offset.top - ($eleDims.height + vOffset)
	        };
	        break;
	      case 'left':
	        return {
	          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
	          top: $anchorDims.offset.top
	        };
	        break;
	      case 'right':
	        return {
	          left: $anchorDims.offset.left + $anchorDims.width + hOffset,
	          top: $anchorDims.offset.top
	        };
	        break;
	      case 'center top':
	        return {
	          left: $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2,
	          top: $anchorDims.offset.top - ($eleDims.height + vOffset)
	        };
	        break;
	      case 'center bottom':
	        return {
	          left: isOverflow ? hOffset : $anchorDims.offset.left + $anchorDims.width / 2 - $eleDims.width / 2,
	          top: $anchorDims.offset.top + $anchorDims.height + vOffset
	        };
	        break;
	      case 'center left':
	        return {
	          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
	          top: $anchorDims.offset.top + $anchorDims.height / 2 - $eleDims.height / 2
	        };
	        break;
	      case 'center right':
	        return {
	          left: $anchorDims.offset.left + $anchorDims.width + hOffset + 1,
	          top: $anchorDims.offset.top + $anchorDims.height / 2 - $eleDims.height / 2
	        };
	        break;
	      case 'center':
	        return {
	          left: $eleDims.windowDims.offset.left + $eleDims.windowDims.width / 2 - $eleDims.width / 2,
	          top: $eleDims.windowDims.offset.top + $eleDims.windowDims.height / 2 - $eleDims.height / 2
	        };
	        break;
	      case 'reveal':
	        return {
	          left: ($eleDims.windowDims.width - $eleDims.width) / 2,
	          top: $eleDims.windowDims.offset.top + vOffset
	        };
	      case 'reveal full':
	        return {
	          left: $eleDims.windowDims.offset.left,
	          top: $eleDims.windowDims.offset.top
	        };
	        break;
	      case 'left bottom':
	        return {
	          left: $anchorDims.offset.left - ($eleDims.width + hOffset),
	          top: $anchorDims.offset.top + $anchorDims.height
	        };
	        break;
	      case 'right bottom':
	        return {
	          left: $anchorDims.offset.left + $anchorDims.width + hOffset - $eleDims.width,
	          top: $anchorDims.offset.top + $anchorDims.height
	        };
	        break;
	      default:
	        return {
	          left: Foundation.rtl() ? $anchorDims.offset.left - $eleDims.width + $anchorDims.width : $anchorDims.offset.left,
	          top: $anchorDims.offset.top + $anchorDims.height + vOffset
	        };
	    }
	  }
	}(jQuery);
	/*******************************************
	 *                                         *
	 * This util was created by Marius Olbertz *
	 * Please thank Marius on GitHub /owlbertz *
	 * or the web http://www.mariusolbertz.de/ *
	 *                                         *
	 ******************************************/
	
	'use strict';
	
	!function ($) {
	
	  var keyCodes = {
	    9: 'TAB',
	    13: 'ENTER',
	    27: 'ESCAPE',
	    32: 'SPACE',
	    37: 'ARROW_LEFT',
	    38: 'ARROW_UP',
	    39: 'ARROW_RIGHT',
	    40: 'ARROW_DOWN'
	  };
	
	  var commands = {};
	
	  var Keyboard = {
	    keys: getKeyCodes(keyCodes),
	
	    /**
	     * Parses the (keyboard) event and returns a String that represents its key
	     * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
	     * @param {Event} event - the event generated by the event handler
	     * @return String key - String that represents the key pressed
	     */
	    parseKey: function (event) {
	      var key = keyCodes[event.which || event.keyCode] || String.fromCharCode(event.which).toUpperCase();
	      if (event.shiftKey) key = 'SHIFT_' + key;
	      if (event.ctrlKey) key = 'CTRL_' + key;
	      if (event.altKey) key = 'ALT_' + key;
	      return key;
	    },
	
	
	    /**
	     * Handles the given (keyboard) event
	     * @param {Event} event - the event generated by the event handler
	     * @param {String} component - Foundation component's name, e.g. Slider or Reveal
	     * @param {Objects} functions - collection of functions that are to be executed
	     */
	    handleKey: function (event, component, functions) {
	      var commandList = commands[component],
	          keyCode = this.parseKey(event),
	          cmds,
	          command,
	          fn;
	
	      if (!commandList) return console.warn('Component not defined!');
	
	      if (typeof commandList.ltr === 'undefined') {
	        // this component does not differentiate between ltr and rtl
	        cmds = commandList; // use plain list
	      } else {
	          // merge ltr and rtl: if document is rtl, rtl overwrites ltr and vice versa
	          if (Foundation.rtl()) cmds = $.extend({}, commandList.ltr, commandList.rtl);else cmds = $.extend({}, commandList.rtl, commandList.ltr);
	        }
	      command = cmds[keyCode];
	
	      fn = functions[command];
	      if (fn && typeof fn === 'function') {
	        // execute function  if exists
	        var returnValue = fn.apply();
	        if (functions.handled || typeof functions.handled === 'function') {
	          // execute function when event was handled
	          functions.handled(returnValue);
	        }
	      } else {
	        if (functions.unhandled || typeof functions.unhandled === 'function') {
	          // execute function when event was not handled
	          functions.unhandled();
	        }
	      }
	    },
	
	
	    /**
	     * Finds all focusable elements within the given `$element`
	     * @param {jQuery} $element - jQuery object to search within
	     * @return {jQuery} $focusable - all focusable elements within `$element`
	     */
	    findFocusable: function ($element) {
	      return $element.find('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]').filter(function () {
	        if (!$(this).is(':visible') || $(this).attr('tabindex') < 0) {
	          return false;
	        } //only have visible elements and those that have a tabindex greater or equal 0
	        return true;
	      });
	    },
	
	
	    /**
	     * Returns the component name name
	     * @param {Object} component - Foundation component, e.g. Slider or Reveal
	     * @return String componentName
	     */
	
	    register: function (componentName, cmds) {
	      commands[componentName] = cmds;
	    }
	  };
	
	  /*
	   * Constants for easier comparing.
	   * Can be used like Foundation.parseKey(event) === Foundation.keys.SPACE
	   */
	  function getKeyCodes(kcs) {
	    var k = {};
	    for (var kc in kcs) {
	      k[kcs[kc]] = kcs[kc];
	    }return k;
	  }
	
	  Foundation.Keyboard = Keyboard;
	}(jQuery);
	'use strict';
	
	!function ($) {
	
	  // Default set of media queries
	  var defaultQueries = {
	    'default': 'only screen',
	    landscape: 'only screen and (orientation: landscape)',
	    portrait: 'only screen and (orientation: portrait)',
	    retina: 'only screen and (-webkit-min-device-pixel-ratio: 2),' + 'only screen and (min--moz-device-pixel-ratio: 2),' + 'only screen and (-o-min-device-pixel-ratio: 2/1),' + 'only screen and (min-device-pixel-ratio: 2),' + 'only screen and (min-resolution: 192dpi),' + 'only screen and (min-resolution: 2dppx)'
	  };
	
	  var MediaQuery = {
	    queries: [],
	
	    current: '',
	
	    /**
	     * Initializes the media query helper, by extracting the breakpoint list from the CSS and activating the breakpoint watcher.
	     * @function
	     * @private
	     */
	    _init: function () {
	      var self = this;
	      var extractedStyles = $('.foundation-mq').css('font-family');
	      var namedQueries;
	
	      namedQueries = parseStyleToObject(extractedStyles);
	
	      for (var key in namedQueries) {
	        if (namedQueries.hasOwnProperty(key)) {
	          self.queries.push({
	            name: key,
	            value: 'only screen and (min-width: ' + namedQueries[key] + ')'
	          });
	        }
	      }
	
	      this.current = this._getCurrentSize();
	
	      this._watcher();
	    },
	
	
	    /**
	     * Checks if the screen is at least as wide as a breakpoint.
	     * @function
	     * @param {String} size - Name of the breakpoint to check.
	     * @returns {Boolean} `true` if the breakpoint matches, `false` if it's smaller.
	     */
	    atLeast: function (size) {
	      var query = this.get(size);
	
	      if (query) {
	        return window.matchMedia(query).matches;
	      }
	
	      return false;
	    },
	
	
	    /**
	     * Gets the media query of a breakpoint.
	     * @function
	     * @param {String} size - Name of the breakpoint to get.
	     * @returns {String|null} - The media query of the breakpoint, or `null` if the breakpoint doesn't exist.
	     */
	    get: function (size) {
	      for (var i in this.queries) {
	        if (this.queries.hasOwnProperty(i)) {
	          var query = this.queries[i];
	          if (size === query.name) return query.value;
	        }
	      }
	
	      return null;
	    },
	
	
	    /**
	     * Gets the current breakpoint name by testing every breakpoint and returning the last one to match (the biggest one).
	     * @function
	     * @private
	     * @returns {String} Name of the current breakpoint.
	     */
	    _getCurrentSize: function () {
	      var matched;
	
	      for (var i = 0; i < this.queries.length; i++) {
	        var query = this.queries[i];
	
	        if (window.matchMedia(query.value).matches) {
	          matched = query;
	        }
	      }
	
	      if (typeof matched === 'object') {
	        return matched.name;
	      } else {
	        return matched;
	      }
	    },
	
	
	    /**
	     * Activates the breakpoint watcher, which fires an event on the window whenever the breakpoint changes.
	     * @function
	     * @private
	     */
	    _watcher: function () {
	      var _this = this;
	
	      $(window).on('resize.zf.mediaquery', function () {
	        var newSize = _this._getCurrentSize(),
	            currentSize = _this.current;
	
	        if (newSize !== currentSize) {
	          // Change the current media query
	          _this.current = newSize;
	
	          // Broadcast the media query change on the window
	          $(window).trigger('changed.zf.mediaquery', [newSize, currentSize]);
	        }
	      });
	    }
	  };
	
	  Foundation.MediaQuery = MediaQuery;
	
	  // matchMedia() polyfill - Test a CSS media type/query in JS.
	  // Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license
	  window.matchMedia || (window.matchMedia = function () {
	    'use strict';
	
	    // For browsers that support matchMedium api such as IE 9 and webkit
	
	    var styleMedia = window.styleMedia || window.media;
	
	    // For those that don't support matchMedium
	    if (!styleMedia) {
	      var style = document.createElement('style'),
	          script = document.getElementsByTagName('script')[0],
	          info = null;
	
	      style.type = 'text/css';
	      style.id = 'matchmediajs-test';
	
	      script.parentNode.insertBefore(style, script);
	
	      // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
	      info = 'getComputedStyle' in window && window.getComputedStyle(style, null) || style.currentStyle;
	
	      styleMedia = {
	        matchMedium: function (media) {
	          var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';
	
	          // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
	          if (style.styleSheet) {
	            style.styleSheet.cssText = text;
	          } else {
	            style.textContent = text;
	          }
	
	          // Test if media query is true or false
	          return info.width === '1px';
	        }
	      };
	    }
	
	    return function (media) {
	      return {
	        matches: styleMedia.matchMedium(media || 'all'),
	        media: media || 'all'
	      };
	    };
	  }());
	
	  // Thank you: https://github.com/sindresorhus/query-string
	  function parseStyleToObject(str) {
	    var styleObject = {};
	
	    if (typeof str !== 'string') {
	      return styleObject;
	    }
	
	    str = str.trim().slice(1, -1); // browsers re-quote string style values
	
	    if (!str) {
	      return styleObject;
	    }
	
	    styleObject = str.split('&').reduce(function (ret, param) {
	      var parts = param.replace(/\+/g, ' ').split('=');
	      var key = parts[0];
	      var val = parts[1];
	      key = decodeURIComponent(key);
	
	      // missing `=` should be `null`:
	      // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
	      val = val === undefined ? null : decodeURIComponent(val);
	
	      if (!ret.hasOwnProperty(key)) {
	        ret[key] = val;
	      } else if (Array.isArray(ret[key])) {
	        ret[key].push(val);
	      } else {
	        ret[key] = [ret[key], val];
	      }
	      return ret;
	    }, {});
	
	    return styleObject;
	  }
	
	  Foundation.MediaQuery = MediaQuery;
	}(jQuery);
	'use strict';
	
	!function ($) {
	
	  /**
	   * Motion module.
	   * @module foundation.motion
	   */
	
	  var initClasses = ['mui-enter', 'mui-leave'];
	  var activeClasses = ['mui-enter-active', 'mui-leave-active'];
	
	  var Motion = {
	    animateIn: function (element, animation, cb) {
	      animate(true, element, animation, cb);
	    },
	
	    animateOut: function (element, animation, cb) {
	      animate(false, element, animation, cb);
	    }
	  };
	
	  function Move(duration, elem, fn) {
	    var anim,
	        prog,
	        start = null;
	    // console.log('called');
	
	    function move(ts) {
	      if (!start) start = window.performance.now();
	      // console.log(start, ts);
	      prog = ts - start;
	      fn.apply(elem);
	
	      if (prog < duration) {
	        anim = window.requestAnimationFrame(move, elem);
	      } else {
	        window.cancelAnimationFrame(anim);
	        elem.trigger('finished.zf.animate', [elem]).triggerHandler('finished.zf.animate', [elem]);
	      }
	    }
	    anim = window.requestAnimationFrame(move);
	  }
	
	  /**
	   * Animates an element in or out using a CSS transition class.
	   * @function
	   * @private
	   * @param {Boolean} isIn - Defines if the animation is in or out.
	   * @param {Object} element - jQuery or HTML object to animate.
	   * @param {String} animation - CSS class to use.
	   * @param {Function} cb - Callback to run when animation is finished.
	   */
	  function animate(isIn, element, animation, cb) {
	    element = $(element).eq(0);
	
	    if (!element.length) return;
	
	    var initClass = isIn ? initClasses[0] : initClasses[1];
	    var activeClass = isIn ? activeClasses[0] : activeClasses[1];
	
	    // Set up the animation
	    reset();
	
	    element.addClass(animation).css('transition', 'none');
	
	    requestAnimationFrame(function () {
	      element.addClass(initClass);
	      if (isIn) element.show();
	    });
	
	    // Start the animation
	    requestAnimationFrame(function () {
	      element[0].offsetWidth;
	      element.css('transition', '').addClass(activeClass);
	    });
	
	    // Clean up the animation when it finishes
	    element.one(Foundation.transitionend(element), finish);
	
	    // Hides the element (for out animations), resets the element, and runs a callback
	    function finish() {
	      if (!isIn) element.hide();
	      reset();
	      if (cb) cb.apply(element);
	    }
	
	    // Resets transitions and removes motion-specific classes
	    function reset() {
	      element[0].style.transitionDuration = 0;
	      element.removeClass(initClass + ' ' + activeClass + ' ' + animation);
	    }
	  }
	
	  Foundation.Move = Move;
	  Foundation.Motion = Motion;
	}(jQuery);
	'use strict';
	
	!function ($) {
	
	  var Nest = {
	    Feather: function (menu) {
	      var type = arguments.length <= 1 || arguments[1] === undefined ? 'zf' : arguments[1];
	
	      menu.attr('role', 'menubar');
	
	      var items = menu.find('li').attr({ 'role': 'menuitem' }),
	          subMenuClass = 'is-' + type + '-submenu',
	          subItemClass = subMenuClass + '-item',
	          hasSubClass = 'is-' + type + '-submenu-parent';
	
	      menu.find('a:first').attr('tabindex', 0);
	
	      items.each(function () {
	        var $item = $(this),
	            $sub = $item.children('ul');
	
	        if ($sub.length) {
	          $item.addClass(hasSubClass).attr({
	            'aria-haspopup': true,
	            'aria-expanded': false,
	            'aria-label': $item.children('a:first').text()
	          });
	
	          $sub.addClass('submenu ' + subMenuClass).attr({
	            'data-submenu': '',
	            'aria-hidden': true,
	            'role': 'menu'
	          });
	        }
	
	        if ($item.parent('[data-submenu]').length) {
	          $item.addClass('is-submenu-item ' + subItemClass);
	        }
	      });
	
	      return;
	    },
	    Burn: function (menu, type) {
	      var items = menu.find('li').removeAttr('tabindex'),
	          subMenuClass = 'is-' + type + '-submenu',
	          subItemClass = subMenuClass + '-item',
	          hasSubClass = 'is-' + type + '-submenu-parent';
	
	      menu.find('*').removeClass(subMenuClass + ' ' + subItemClass + ' ' + hasSubClass + ' is-submenu-item submenu is-active').removeAttr('data-submenu').css('display', '');
	
	      // console.log(      menu.find('.' + subMenuClass + ', .' + subItemClass + ', .has-submenu, .is-submenu-item, .submenu, [data-submenu]')
	      //           .removeClass(subMenuClass + ' ' + subItemClass + ' has-submenu is-submenu-item submenu')
	      //           .removeAttr('data-submenu'));
	      // items.each(function(){
	      //   var $item = $(this),
	      //       $sub = $item.children('ul');
	      //   if($item.parent('[data-submenu]').length){
	      //     $item.removeClass('is-submenu-item ' + subItemClass);
	      //   }
	      //   if($sub.length){
	      //     $item.removeClass('has-submenu');
	      //     $sub.removeClass('submenu ' + subMenuClass).removeAttr('data-submenu');
	      //   }
	      // });
	    }
	  };
	
	  Foundation.Nest = Nest;
	}(jQuery);
	'use strict';
	
	!function ($) {
	
	  function Timer(elem, options, cb) {
	    var _this = this,
	        duration = options.duration,
	        //options is an object for easily adding features later.
	    nameSpace = Object.keys(elem.data())[0] || 'timer',
	        remain = -1,
	        start,
	        timer;
	
	    this.isPaused = false;
	
	    this.restart = function () {
	      remain = -1;
	      clearTimeout(timer);
	      this.start();
	    };
	
	    this.start = function () {
	      this.isPaused = false;
	      // if(!elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
	      clearTimeout(timer);
	      remain = remain <= 0 ? duration : remain;
	      elem.data('paused', false);
	      start = Date.now();
	      timer = setTimeout(function () {
	        if (options.infinite) {
	          _this.restart(); //rerun the timer.
	        }
	        cb();
	      }, remain);
	      elem.trigger('timerstart.zf.' + nameSpace);
	    };
	
	    this.pause = function () {
	      this.isPaused = true;
	      //if(elem.data('paused')){ return false; }//maybe implement this sanity check if used for other things.
	      clearTimeout(timer);
	      elem.data('paused', true);
	      var end = Date.now();
	      remain = remain - (end - start);
	      elem.trigger('timerpaused.zf.' + nameSpace);
	    };
	  }
	
	  /**
	   * Runs a callback function when images are fully loaded.
	   * @param {Object} images - Image(s) to check if loaded.
	   * @param {Func} callback - Function to execute when image is fully loaded.
	   */
	  function onImagesLoaded(images, callback) {
	    var self = this,
	        unloaded = images.length;
	
	    if (unloaded === 0) {
	      callback();
	    }
	
	    images.each(function () {
	      if (this.complete) {
	        singleImageLoaded();
	      } else if (typeof this.naturalWidth !== 'undefined' && this.naturalWidth > 0) {
	        singleImageLoaded();
	      } else {
	        $(this).one('load', function () {
	          singleImageLoaded();
	        });
	      }
	    });
	
	    function singleImageLoaded() {
	      unloaded--;
	      if (unloaded === 0) {
	        callback();
	      }
	    }
	  }
	
	  Foundation.Timer = Timer;
	  Foundation.onImagesLoaded = onImagesLoaded;
	}(jQuery);
	//**************************************************
	//**Work inspired by multiple jquery swipe plugins**
	//**Done by Yohai Ararat ***************************
	//**************************************************
	(function ($) {
	
		$.spotSwipe = {
			version: '1.0.0',
			enabled: 'ontouchstart' in document.documentElement,
			preventDefault: false,
			moveThreshold: 75,
			timeThreshold: 200
		};
	
		var startPosX,
		    startPosY,
		    startTime,
		    elapsedTime,
		    isMoving = false;
	
		function onTouchEnd() {
			//  alert(this);
			this.removeEventListener('touchmove', onTouchMove);
			this.removeEventListener('touchend', onTouchEnd);
			isMoving = false;
		}
	
		function onTouchMove(e) {
			if ($.spotSwipe.preventDefault) {
				e.preventDefault();
			}
			if (isMoving) {
				var x = e.touches[0].pageX;
				var y = e.touches[0].pageY;
				var dx = startPosX - x;
				var dy = startPosY - y;
				var dir;
				elapsedTime = new Date().getTime() - startTime;
				if (Math.abs(dx) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
					dir = dx > 0 ? 'left' : 'right';
				}
				// else if(Math.abs(dy) >= $.spotSwipe.moveThreshold && elapsedTime <= $.spotSwipe.timeThreshold) {
				//   dir = dy > 0 ? 'down' : 'up';
				// }
				if (dir) {
					e.preventDefault();
					onTouchEnd.call(this);
					$(this).trigger('swipe', dir).trigger('swipe' + dir);
				}
			}
		}
	
		function onTouchStart(e) {
			if (e.touches.length == 1) {
				startPosX = e.touches[0].pageX;
				startPosY = e.touches[0].pageY;
				isMoving = true;
				startTime = new Date().getTime();
				this.addEventListener('touchmove', onTouchMove, false);
				this.addEventListener('touchend', onTouchEnd, false);
			}
		}
	
		function init() {
			this.addEventListener && this.addEventListener('touchstart', onTouchStart, false);
		}
	
		function teardown() {
			this.removeEventListener('touchstart', onTouchStart);
		}
	
		$.event.special.swipe = { setup: init };
	
		$.each(['left', 'up', 'down', 'right'], function () {
			$.event.special['swipe' + this] = { setup: function () {
					$(this).on('swipe', $.noop);
				} };
		});
	})(jQuery);
	/****************************************************
	 * Method for adding psuedo drag events to elements *
	 ***************************************************/
	!function ($) {
		$.fn.addTouch = function () {
			this.each(function (i, el) {
				$(el).bind('touchstart touchmove touchend touchcancel', function () {
					//we pass the original event object because the jQuery event
					//object is normalized to w3c specs and does not provide the TouchList
					handleTouch(event);
				});
			});
	
			var handleTouch = function (event) {
				var touches = event.changedTouches,
				    first = touches[0],
				    eventTypes = {
					touchstart: 'mousedown',
					touchmove: 'mousemove',
					touchend: 'mouseup'
				},
				    type = eventTypes[event.type],
				    simulatedEvent;
	
				if ('MouseEvent' in window && typeof window.MouseEvent === 'function') {
					simulatedEvent = new window.MouseEvent(type, {
						'bubbles': true,
						'cancelable': true,
						'screenX': first.screenX,
						'screenY': first.screenY,
						'clientX': first.clientX,
						'clientY': first.clientY
					});
				} else {
					simulatedEvent = document.createEvent('MouseEvent');
					simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/, null);
				}
				first.target.dispatchEvent(simulatedEvent);
			};
		};
	}(jQuery);
	
	//**********************************
	//**From the jQuery Mobile Library**
	//**need to recreate functionality**
	//**and try to improve if possible**
	//**********************************
	
	/* Removing the jQuery function ****
	************************************
	
	(function( $, window, undefined ) {
	
		var $document = $( document ),
			// supportTouch = $.mobile.support.touch,
			touchStartEvent = 'touchstart'//supportTouch ? "touchstart" : "mousedown",
			touchStopEvent = 'touchend'//supportTouch ? "touchend" : "mouseup",
			touchMoveEvent = 'touchmove'//supportTouch ? "touchmove" : "mousemove";
	
		// setup new event shortcuts
		$.each( ( "touchstart touchmove touchend " +
			"swipe swipeleft swiperight" ).split( " " ), function( i, name ) {
	
			$.fn[ name ] = function( fn ) {
				return fn ? this.bind( name, fn ) : this.trigger( name );
			};
	
			// jQuery < 1.8
			if ( $.attrFn ) {
				$.attrFn[ name ] = true;
			}
		});
	
		function triggerCustomEvent( obj, eventType, event, bubble ) {
			var originalType = event.type;
			event.type = eventType;
			if ( bubble ) {
				$.event.trigger( event, undefined, obj );
			} else {
				$.event.dispatch.call( obj, event );
			}
			event.type = originalType;
		}
	
		// also handles taphold
	
		// Also handles swipeleft, swiperight
		$.event.special.swipe = {
	
			// More than this horizontal displacement, and we will suppress scrolling.
			scrollSupressionThreshold: 30,
	
			// More time than this, and it isn't a swipe.
			durationThreshold: 1000,
	
			// Swipe horizontal displacement must be more than this.
			horizontalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,
	
			// Swipe vertical displacement must be less than this.
			verticalDistanceThreshold: window.devicePixelRatio >= 2 ? 15 : 30,
	
			getLocation: function ( event ) {
				var winPageX = window.pageXOffset,
					winPageY = window.pageYOffset,
					x = event.clientX,
					y = event.clientY;
	
				if ( event.pageY === 0 && Math.floor( y ) > Math.floor( event.pageY ) ||
					event.pageX === 0 && Math.floor( x ) > Math.floor( event.pageX ) ) {
	
					// iOS4 clientX/clientY have the value that should have been
					// in pageX/pageY. While pageX/page/ have the value 0
					x = x - winPageX;
					y = y - winPageY;
				} else if ( y < ( event.pageY - winPageY) || x < ( event.pageX - winPageX ) ) {
	
					// Some Android browsers have totally bogus values for clientX/Y
					// when scrolling/zooming a page. Detectable since clientX/clientY
					// should never be smaller than pageX/pageY minus page scroll
					x = event.pageX - winPageX;
					y = event.pageY - winPageY;
				}
	
				return {
					x: x,
					y: y
				};
			},
	
			start: function( event ) {
				var data = event.originalEvent.touches ?
						event.originalEvent.touches[ 0 ] : event,
					location = $.event.special.swipe.getLocation( data );
				return {
							time: ( new Date() ).getTime(),
							coords: [ location.x, location.y ],
							origin: $( event.target )
						};
			},
	
			stop: function( event ) {
				var data = event.originalEvent.touches ?
						event.originalEvent.touches[ 0 ] : event,
					location = $.event.special.swipe.getLocation( data );
				return {
							time: ( new Date() ).getTime(),
							coords: [ location.x, location.y ]
						};
			},
	
			handleSwipe: function( start, stop, thisObject, origTarget ) {
				if ( stop.time - start.time < $.event.special.swipe.durationThreshold &&
					Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
					Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold ) {
					var direction = start.coords[0] > stop.coords[ 0 ] ? "swipeleft" : "swiperight";
	
					triggerCustomEvent( thisObject, "swipe", $.Event( "swipe", { target: origTarget, swipestart: start, swipestop: stop }), true );
					triggerCustomEvent( thisObject, direction,$.Event( direction, { target: origTarget, swipestart: start, swipestop: stop } ), true );
					return true;
				}
				return false;
	
			},
	
			// This serves as a flag to ensure that at most one swipe event event is
			// in work at any given time
			eventInProgress: false,
	
			setup: function() {
				var events,
					thisObject = this,
					$this = $( thisObject ),
					context = {};
	
				// Retrieve the events data for this element and add the swipe context
				events = $.data( this, "mobile-events" );
				if ( !events ) {
					events = { length: 0 };
					$.data( this, "mobile-events", events );
				}
				events.length++;
				events.swipe = context;
	
				context.start = function( event ) {
	
					// Bail if we're already working on a swipe event
					if ( $.event.special.swipe.eventInProgress ) {
						return;
					}
					$.event.special.swipe.eventInProgress = true;
	
					var stop,
						start = $.event.special.swipe.start( event ),
						origTarget = event.target,
						emitted = false;
	
					context.move = function( event ) {
						if ( !start || event.isDefaultPrevented() ) {
							return;
						}
	
						stop = $.event.special.swipe.stop( event );
						if ( !emitted ) {
							emitted = $.event.special.swipe.handleSwipe( start, stop, thisObject, origTarget );
							if ( emitted ) {
	
								// Reset the context to make way for the next swipe event
								$.event.special.swipe.eventInProgress = false;
							}
						}
						// prevent scrolling
						if ( Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.scrollSupressionThreshold ) {
							event.preventDefault();
						}
					};
	
					context.stop = function() {
							emitted = true;
	
							// Reset the context to make way for the next swipe event
							$.event.special.swipe.eventInProgress = false;
							$document.off( touchMoveEvent, context.move );
							context.move = null;
					};
	
					$document.on( touchMoveEvent, context.move )
						.one( touchStopEvent, context.stop );
				};
				$this.on( touchStartEvent, context.start );
			},
	
			teardown: function() {
				var events, context;
	
				events = $.data( this, "mobile-events" );
				if ( events ) {
					context = events.swipe;
					delete events.swipe;
					events.length--;
					if ( events.length === 0 ) {
						$.removeData( this, "mobile-events" );
					}
				}
	
				if ( context ) {
					if ( context.start ) {
						$( this ).off( touchStartEvent, context.start );
					}
					if ( context.move ) {
						$document.off( touchMoveEvent, context.move );
					}
					if ( context.stop ) {
						$document.off( touchStopEvent, context.stop );
					}
				}
			}
		};
		$.each({
			swipeleft: "swipe.left",
			swiperight: "swipe.right"
		}, function( event, sourceEvent ) {
	
			$.event.special[ event ] = {
				setup: function() {
					$( this ).bind( sourceEvent, $.noop );
				},
				teardown: function() {
					$( this ).unbind( sourceEvent );
				}
			};
		});
	})( jQuery, this );
	*/
	'use strict';
	
	!function ($) {
	
	  var MutationObserver = function () {
	    var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
	    for (var i = 0; i < prefixes.length; i++) {
	      if (prefixes[i] + 'MutationObserver' in window) {
	        return window[prefixes[i] + 'MutationObserver'];
	      }
	    }
	    return false;
	  }();
	
	  var triggers = function (el, type) {
	    el.data(type).split(' ').forEach(function (id) {
	      $('#' + id)[type === 'close' ? 'trigger' : 'triggerHandler'](type + '.zf.trigger', [el]);
	    });
	  };
	  // Elements with [data-open] will reveal a plugin that supports it when clicked.
	  $(document).on('click.zf.trigger', '[data-open]', function () {
	    triggers($(this), 'open');
	  });
	
	  // Elements with [data-close] will close a plugin that supports it when clicked.
	  // If used without a value on [data-close], the event will bubble, allowing it to close a parent component.
	  $(document).on('click.zf.trigger', '[data-close]', function () {
	    var id = $(this).data('close');
	    if (id) {
	      triggers($(this), 'close');
	    } else {
	      $(this).trigger('close.zf.trigger');
	    }
	  });
	
	  // Elements with [data-toggle] will toggle a plugin that supports it when clicked.
	  $(document).on('click.zf.trigger', '[data-toggle]', function () {
	    triggers($(this), 'toggle');
	  });
	
	  // Elements with [data-closable] will respond to close.zf.trigger events.
	  $(document).on('close.zf.trigger', '[data-closable]', function (e) {
	    e.stopPropagation();
	    var animation = $(this).data('closable');
	
	    if (animation !== '') {
	      Foundation.Motion.animateOut($(this), animation, function () {
	        $(this).trigger('closed.zf');
	      });
	    } else {
	      $(this).fadeOut().trigger('closed.zf');
	    }
	  });
	
	  $(document).on('focus.zf.trigger blur.zf.trigger', '[data-toggle-focus]', function () {
	    var id = $(this).data('toggle-focus');
	    $('#' + id).triggerHandler('toggle.zf.trigger', [$(this)]);
	  });
	
	  /**
	  * Fires once after all other scripts have loaded
	  * @function
	  * @private
	  */
	  $(window).load(function () {
	    checkListeners();
	  });
	
	  function checkListeners() {
	    eventsListener();
	    resizeListener();
	    scrollListener();
	    closemeListener();
	  }
	
	  //******** only fires this function once on load, if there's something to watch ********
	  function closemeListener(pluginName) {
	    var yetiBoxes = $('[data-yeti-box]'),
	        plugNames = ['dropdown', 'tooltip', 'reveal'];
	
	    if (pluginName) {
	      if (typeof pluginName === 'string') {
	        plugNames.push(pluginName);
	      } else if (typeof pluginName === 'object' && typeof pluginName[0] === 'string') {
	        plugNames.concat(pluginName);
	      } else {
	        console.error('Plugin names must be strings');
	      }
	    }
	    if (yetiBoxes.length) {
	      var listeners = plugNames.map(function (name) {
	        return 'closeme.zf.' + name;
	      }).join(' ');
	
	      $(window).off(listeners).on(listeners, function (e, pluginId) {
	        var plugin = e.namespace.split('.')[0];
	        var plugins = $('[data-' + plugin + ']').not('[data-yeti-box="' + pluginId + '"]');
	
	        plugins.each(function () {
	          var _this = $(this);
	
	          _this.triggerHandler('close.zf.trigger', [_this]);
	        });
	      });
	    }
	  }
	
	  function resizeListener(debounce) {
	    var timer = void 0,
	        $nodes = $('[data-resize]');
	    if ($nodes.length) {
	      $(window).off('resize.zf.trigger').on('resize.zf.trigger', function (e) {
	        if (timer) {
	          clearTimeout(timer);
	        }
	
	        timer = setTimeout(function () {
	
	          if (!MutationObserver) {
	            //fallback for IE 9
	            $nodes.each(function () {
	              $(this).triggerHandler('resizeme.zf.trigger');
	            });
	          }
	          //trigger all listening elements and signal a resize event
	          $nodes.attr('data-events', "resize");
	        }, debounce || 10); //default time to emit resize event
	      });
	    }
	  }
	
	  function scrollListener(debounce) {
	    var timer = void 0,
	        $nodes = $('[data-scroll]');
	    if ($nodes.length) {
	      $(window).off('scroll.zf.trigger').on('scroll.zf.trigger', function (e) {
	        if (timer) {
	          clearTimeout(timer);
	        }
	
	        timer = setTimeout(function () {
	
	          if (!MutationObserver) {
	            //fallback for IE 9
	            $nodes.each(function () {
	              $(this).triggerHandler('scrollme.zf.trigger');
	            });
	          }
	          //trigger all listening elements and signal a scroll event
	          $nodes.attr('data-events', "scroll");
	        }, debounce || 10); //default time to emit scroll event
	      });
	    }
	  }
	
	  function eventsListener() {
	    if (!MutationObserver) {
	      return false;
	    }
	    var nodes = document.querySelectorAll('[data-resize], [data-scroll], [data-mutate]');
	
	    //element callback
	    var listeningElementsMutation = function (mutationRecordsList) {
	      var $target = $(mutationRecordsList[0].target);
	      //trigger the event handler for the element depending on type
	      switch ($target.attr("data-events")) {
	
	        case "resize":
	          $target.triggerHandler('resizeme.zf.trigger', [$target]);
	          break;
	
	        case "scroll":
	          $target.triggerHandler('scrollme.zf.trigger', [$target, window.pageYOffset]);
	          break;
	
	        // case "mutate" :
	        // console.log('mutate', $target);
	        // $target.triggerHandler('mutate.zf.trigger');
	        //
	        // //make sure we don't get stuck in an infinite loop from sloppy codeing
	        // if ($target.index('[data-mutate]') == $("[data-mutate]").length-1) {
	        //   domMutationObserver();
	        // }
	        // break;
	
	        default:
	          return false;
	        //nothing
	      }
	    };
	
	    if (nodes.length) {
	      //for each element that needs to listen for resizing, scrolling, (or coming soon mutation) add a single observer
	      for (var i = 0; i <= nodes.length - 1; i++) {
	        var elementObserver = new MutationObserver(listeningElementsMutation);
	        elementObserver.observe(nodes[i], { attributes: true, childList: false, characterData: false, subtree: false, attributeFilter: ["data-events"] });
	      }
	    }
	  }
	
	  // ------------------------------------
	
	  // [PH]
	  // Foundation.CheckWatchers = checkWatchers;
	  Foundation.IHearYou = checkListeners;
	  // Foundation.ISeeYou = scrollListener;
	  // Foundation.IFeelYou = closemeListener;
	}(jQuery);
	
	// function domMutationObserver(debounce) {
	//   // !!! This is coming soon and needs more work; not active  !!! //
	//   var timer,
	//   nodes = document.querySelectorAll('[data-mutate]');
	//   //
	//   if (nodes.length) {
	//     // var MutationObserver = (function () {
	//     //   var prefixes = ['WebKit', 'Moz', 'O', 'Ms', ''];
	//     //   for (var i=0; i < prefixes.length; i++) {
	//     //     if (prefixes[i] + 'MutationObserver' in window) {
	//     //       return window[prefixes[i] + 'MutationObserver'];
	//     //     }
	//     //   }
	//     //   return false;
	//     // }());
	//
	//
	//     //for the body, we need to listen for all changes effecting the style and class attributes
	//     var bodyObserver = new MutationObserver(bodyMutation);
	//     bodyObserver.observe(document.body, { attributes: true, childList: true, characterData: false, subtree:true, attributeFilter:["style", "class"]});
	//
	//
	//     //body callback
	//     function bodyMutation(mutate) {
	//       //trigger all listening elements and signal a mutation event
	//       if (timer) { clearTimeout(timer); }
	//
	//       timer = setTimeout(function() {
	//         bodyObserver.disconnect();
	//         $('[data-mutate]').attr('data-events',"mutate");
	//       }, debounce || 150);
	//     }
	//   }
	// }
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Abide module.
	   * @module foundation.abide
	   */
	
	  var Abide = function () {
	    /**
	     * Creates a new instance of Abide.
	     * @class
	     * @fires Abide#init
	     * @param {Object} element - jQuery object to add the trigger to.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Abide(element) {
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      _classCallCheck(this, Abide);
	
	      this.$element = element;
	      this.options = $.extend({}, Abide.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Abide');
	    }
	
	    /**
	     * Initializes the Abide plugin and calls functions to get Abide functioning on load.
	     * @private
	     */
	
	
	    _createClass(Abide, [{
	      key: '_init',
	      value: function _init() {
	        this.$inputs = this.$element.find('input, textarea, select');
	
	        this._events();
	      }
	
	      /**
	       * Initializes events for Abide.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this2 = this;
	
	        this.$element.off('.abide').on('reset.zf.abide', function () {
	          _this2.resetForm();
	        }).on('submit.zf.abide', function () {
	          return _this2.validateForm();
	        });
	
	        if (this.options.validateOn === 'fieldChange') {
	          this.$inputs.off('change.zf.abide').on('change.zf.abide', function (e) {
	            _this2.validateInput($(e.target));
	          });
	        }
	
	        if (this.options.liveValidate) {
	          this.$inputs.off('input.zf.abide').on('input.zf.abide', function (e) {
	            _this2.validateInput($(e.target));
	          });
	        }
	      }
	
	      /**
	       * Calls necessary functions to update Abide upon DOM change
	       * @private
	       */
	
	    }, {
	      key: '_reflow',
	      value: function _reflow() {
	        this._init();
	      }
	
	      /**
	       * Checks whether or not a form element has the required attribute and if it's checked or not
	       * @param {Object} element - jQuery object to check for required attribute
	       * @returns {Boolean} Boolean value depends on whether or not attribute is checked or empty
	       */
	
	    }, {
	      key: 'requiredCheck',
	      value: function requiredCheck($el) {
	        if (!$el.attr('required')) return true;
	
	        var isGood = true;
	
	        switch ($el[0].type) {
	          case 'checkbox':
	            isGood = $el[0].checked;
	            break;
	
	          case 'select':
	          case 'select-one':
	          case 'select-multiple':
	            var opt = $el.find('option:selected');
	            if (!opt.length || !opt.val()) isGood = false;
	            break;
	
	          default:
	            if (!$el.val() || !$el.val().length) isGood = false;
	        }
	
	        return isGood;
	      }
	
	      /**
	       * Based on $el, get the first element with selector in this order:
	       * 1. The element's direct sibling('s).
	       * 3. The element's parent's children.
	       *
	       * This allows for multiple form errors per input, though if none are found, no form errors will be shown.
	       *
	       * @param {Object} $el - jQuery object to use as reference to find the form error selector.
	       * @returns {Object} jQuery object with the selector.
	       */
	
	    }, {
	      key: 'findFormError',
	      value: function findFormError($el) {
	        var $error = $el.siblings(this.options.formErrorSelector);
	
	        if (!$error.length) {
	          $error = $el.parent().find(this.options.formErrorSelector);
	        }
	
	        return $error;
	      }
	
	      /**
	       * Get the first element in this order:
	       * 2. The <label> with the attribute `[for="someInputId"]`
	       * 3. The `.closest()` <label>
	       *
	       * @param {Object} $el - jQuery object to check for required attribute
	       * @returns {Boolean} Boolean value depends on whether or not attribute is checked or empty
	       */
	
	    }, {
	      key: 'findLabel',
	      value: function findLabel($el) {
	        var id = $el[0].id;
	        var $label = this.$element.find('label[for="' + id + '"]');
	
	        if (!$label.length) {
	          return $el.closest('label');
	        }
	
	        return $label;
	      }
	
	      /**
	       * Get the set of labels associated with a set of radio els in this order
	       * 2. The <label> with the attribute `[for="someInputId"]`
	       * 3. The `.closest()` <label>
	       *
	       * @param {Object} $el - jQuery object to check for required attribute
	       * @returns {Boolean} Boolean value depends on whether or not attribute is checked or empty
	       */
	
	    }, {
	      key: 'findRadioLabels',
	      value: function findRadioLabels($els) {
	        var _this3 = this;
	
	        var labels = $els.map(function (i, el) {
	          var id = el.id;
	          var $label = _this3.$element.find('label[for="' + id + '"]');
	
	          if (!$label.length) {
	            $label = $(el).closest('label');
	          }
	          return $label[0];
	        });
	
	        return $(labels);
	      }
	
	      /**
	       * Adds the CSS error class as specified by the Abide settings to the label, input, and the form
	       * @param {Object} $el - jQuery object to add the class to
	       */
	
	    }, {
	      key: 'addErrorClasses',
	      value: function addErrorClasses($el) {
	        var $label = this.findLabel($el);
	        var $formError = this.findFormError($el);
	
	        if ($label.length) {
	          $label.addClass(this.options.labelErrorClass);
	        }
	
	        if ($formError.length) {
	          $formError.addClass(this.options.formErrorClass);
	        }
	
	        $el.addClass(this.options.inputErrorClass).attr('data-invalid', '');
	      }
	
	      /**
	       * Remove CSS error classes etc from an entire radio button group
	       * @param {String} groupName - A string that specifies the name of a radio button group
	       *
	       */
	
	    }, {
	      key: 'removeRadioErrorClasses',
	      value: function removeRadioErrorClasses(groupName) {
	        var $els = this.$element.find(':radio[name="' + groupName + '"]');
	        var $labels = this.findRadioLabels($els);
	        var $formErrors = this.findFormError($els);
	
	        if ($labels.length) {
	          $labels.removeClass(this.options.labelErrorClass);
	        }
	
	        if ($formErrors.length) {
	          $formErrors.removeClass(this.options.formErrorClass);
	        }
	
	        $els.removeClass(this.options.inputErrorClass).removeAttr('data-invalid');
	      }
	
	      /**
	       * Removes CSS error class as specified by the Abide settings from the label, input, and the form
	       * @param {Object} $el - jQuery object to remove the class from
	       */
	
	    }, {
	      key: 'removeErrorClasses',
	      value: function removeErrorClasses($el) {
	        // radios need to clear all of the els
	        if ($el[0].type == 'radio') {
	          return this.removeRadioErrorClasses($el.attr('name'));
	        }
	
	        var $label = this.findLabel($el);
	        var $formError = this.findFormError($el);
	
	        if ($label.length) {
	          $label.removeClass(this.options.labelErrorClass);
	        }
	
	        if ($formError.length) {
	          $formError.removeClass(this.options.formErrorClass);
	        }
	
	        $el.removeClass(this.options.inputErrorClass).removeAttr('data-invalid');
	      }
	
	      /**
	       * Goes through a form to find inputs and proceeds to validate them in ways specific to their type
	       * @fires Abide#invalid
	       * @fires Abide#valid
	       * @param {Object} element - jQuery object to validate, should be an HTML input
	       * @returns {Boolean} goodToGo - If the input is valid or not.
	       */
	
	    }, {
	      key: 'validateInput',
	      value: function validateInput($el) {
	        var clearRequire = this.requiredCheck($el),
	            validated = false,
	            customValidator = true,
	            validator = $el.attr('data-validator'),
	            equalTo = true;
	
	        // don't validate ignored inputs or hidden inputs
	        if ($el.is('[data-abide-ignore]') || $el.is('[type="hidden"]')) {
	          return true;
	        }
	
	        switch ($el[0].type) {
	          case 'radio':
	            validated = this.validateRadio($el.attr('name'));
	            break;
	
	          case 'checkbox':
	            validated = clearRequire;
	            break;
	
	          case 'select':
	          case 'select-one':
	          case 'select-multiple':
	            validated = clearRequire;
	            break;
	
	          default:
	            validated = this.validateText($el);
	        }
	
	        if (validator) {
	          customValidator = this.matchValidation($el, validator, $el.attr('required'));
	        }
	
	        if ($el.attr('data-equalto')) {
	          equalTo = this.options.validators.equalTo($el);
	        }
	
	        var goodToGo = [clearRequire, validated, customValidator, equalTo].indexOf(false) === -1;
	        var message = (goodToGo ? 'valid' : 'invalid') + '.zf.abide';
	
	        this[goodToGo ? 'removeErrorClasses' : 'addErrorClasses']($el);
	
	        /**
	         * Fires when the input is done checking for validation. Event trigger is either `valid.zf.abide` or `invalid.zf.abide`
	         * Trigger includes the DOM element of the input.
	         * @event Abide#valid
	         * @event Abide#invalid
	         */
	        $el.trigger(message, [$el]);
	
	        return goodToGo;
	      }
	
	      /**
	       * Goes through a form and if there are any invalid inputs, it will display the form error element
	       * @returns {Boolean} noError - true if no errors were detected...
	       * @fires Abide#formvalid
	       * @fires Abide#forminvalid
	       */
	
	    }, {
	      key: 'validateForm',
	      value: function validateForm() {
	        var acc = [];
	        var _this = this;
	
	        this.$inputs.each(function () {
	          acc.push(_this.validateInput($(this)));
	        });
	
	        var noError = acc.indexOf(false) === -1;
	
	        this.$element.find('[data-abide-error]').css('display', noError ? 'none' : 'block');
	
	        /**
	         * Fires when the form is finished validating. Event trigger is either `formvalid.zf.abide` or `forminvalid.zf.abide`.
	         * Trigger includes the element of the form.
	         * @event Abide#formvalid
	         * @event Abide#forminvalid
	         */
	        this.$element.trigger((noError ? 'formvalid' : 'forminvalid') + '.zf.abide', [this.$element]);
	
	        return noError;
	      }
	
	      /**
	       * Determines whether or a not a text input is valid based on the pattern specified in the attribute. If no matching pattern is found, returns true.
	       * @param {Object} $el - jQuery object to validate, should be a text input HTML element
	       * @param {String} pattern - string value of one of the RegEx patterns in Abide.options.patterns
	       * @returns {Boolean} Boolean value depends on whether or not the input value matches the pattern specified
	       */
	
	    }, {
	      key: 'validateText',
	      value: function validateText($el, pattern) {
	        // A pattern can be passed to this function, or it will be infered from the input's "pattern" attribute, or it's "type" attribute
	        pattern = pattern || $el.attr('pattern') || $el.attr('type');
	        var inputText = $el.val();
	        var valid = false;
	
	        if (inputText.length) {
	          // If the pattern attribute on the element is in Abide's list of patterns, then test that regexp
	          if (this.options.patterns.hasOwnProperty(pattern)) {
	            valid = this.options.patterns[pattern].test(inputText);
	          }
	          // If the pattern name isn't also the type attribute of the field, then test it as a regexp
	          else if (pattern !== $el.attr('type')) {
	              valid = new RegExp(pattern).test(inputText);
	            } else {
	              valid = true;
	            }
	        }
	        // An empty field is valid if it's not required
	        else if (!$el.prop('required')) {
	            valid = true;
	          }
	
	        return valid;
	      }
	
	      /**
	       * Determines whether or a not a radio input is valid based on whether or not it is required and selected. Although the function targets a single `<input>`, it validates by checking the `required` and `checked` properties of all radio buttons in its group.
	       * @param {String} groupName - A string that specifies the name of a radio button group
	       * @returns {Boolean} Boolean value depends on whether or not at least one radio input has been selected (if it's required)
	       */
	
	    }, {
	      key: 'validateRadio',
	      value: function validateRadio(groupName) {
	        // If at least one radio in the group has the `required` attribute, the group is considered required
	        // Per W3C spec, all radio buttons in a group should have `required`, but we're being nice
	        var $group = this.$element.find(':radio[name="' + groupName + '"]');
	        var valid = false,
	            required = false;
	
	        // For the group to be required, at least one radio needs to be required
	        $group.each(function (i, e) {
	          if ($(e).attr('required')) {
	            required = true;
	          }
	        });
	        if (!required) valid = true;
	
	        if (!valid) {
	          // For the group to be valid, at least one radio needs to be checked
	          $group.each(function (i, e) {
	            if ($(e).prop('checked')) {
	              valid = true;
	            }
	          });
	        };
	
	        return valid;
	      }
	
	      /**
	       * Determines if a selected input passes a custom validation function. Multiple validations can be used, if passed to the element with `data-validator="foo bar baz"` in a space separated listed.
	       * @param {Object} $el - jQuery input element.
	       * @param {String} validators - a string of function names matching functions in the Abide.options.validators object.
	       * @param {Boolean} required - self explanatory?
	       * @returns {Boolean} - true if validations passed.
	       */
	
	    }, {
	      key: 'matchValidation',
	      value: function matchValidation($el, validators, required) {
	        var _this4 = this;
	
	        required = required ? true : false;
	
	        var clear = validators.split(' ').map(function (v) {
	          return _this4.options.validators[v]($el, required, $el.parent());
	        });
	        return clear.indexOf(false) === -1;
	      }
	
	      /**
	       * Resets form inputs and styles
	       * @fires Abide#formreset
	       */
	
	    }, {
	      key: 'resetForm',
	      value: function resetForm() {
	        var $form = this.$element,
	            opts = this.options;
	
	        $('.' + opts.labelErrorClass, $form).not('small').removeClass(opts.labelErrorClass);
	        $('.' + opts.inputErrorClass, $form).not('small').removeClass(opts.inputErrorClass);
	        $(opts.formErrorSelector + '.' + opts.formErrorClass).removeClass(opts.formErrorClass);
	        $form.find('[data-abide-error]').css('display', 'none');
	        $(':input', $form).not(':button, :submit, :reset, :hidden, :radio, :checkbox, [data-abide-ignore]').val('').removeAttr('data-invalid');
	        $(':input:radio', $form).not('[data-abide-ignore]').prop('checked', false).removeAttr('data-invalid');
	        $(':input:checkbox', $form).not('[data-abide-ignore]').prop('checked', false).removeAttr('data-invalid');
	        /**
	         * Fires when the form has been reset.
	         * @event Abide#formreset
	         */
	        $form.trigger('formreset.zf.abide', [$form]);
	      }
	
	      /**
	       * Destroys an instance of Abide.
	       * Removes error styles and classes from elements, without resetting their values.
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        var _this = this;
	        this.$element.off('.abide').find('[data-abide-error]').css('display', 'none');
	
	        this.$inputs.off('.abide').each(function () {
	          _this.removeErrorClasses($(this));
	        });
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Abide;
	  }();
	
	  /**
	   * Default settings for plugin
	   */
	
	
	  Abide.defaults = {
	    /**
	     * The default event to validate inputs. Checkboxes and radios validate immediately.
	     * Remove or change this value for manual validation.
	     * @option
	     * @example 'fieldChange'
	     */
	    validateOn: 'fieldChange',
	
	    /**
	     * Class to be applied to input labels on failed validation.
	     * @option
	     * @example 'is-invalid-label'
	     */
	    labelErrorClass: 'is-invalid-label',
	
	    /**
	     * Class to be applied to inputs on failed validation.
	     * @option
	     * @example 'is-invalid-input'
	     */
	    inputErrorClass: 'is-invalid-input',
	
	    /**
	     * Class selector to use to target Form Errors for show/hide.
	     * @option
	     * @example '.form-error'
	     */
	    formErrorSelector: '.form-error',
	
	    /**
	     * Class added to Form Errors on failed validation.
	     * @option
	     * @example 'is-visible'
	     */
	    formErrorClass: 'is-visible',
	
	    /**
	     * Set to true to validate text inputs on any value change.
	     * @option
	     * @example false
	     */
	    liveValidate: false,
	
	    patterns: {
	      alpha: /^[a-zA-Z]+$/,
	      alpha_numeric: /^[a-zA-Z0-9]+$/,
	      integer: /^[-+]?\d+$/,
	      number: /^[-+]?\d*(?:[\.\,]\d+)?$/,
	
	      // amex, visa, diners
	      card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
	      cvv: /^([0-9]){3,4}$/,
	
	      // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
	      email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
	
	      url: /^(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
	      // abc.de
	      domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,8}$/,
	
	      datetime: /^([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))$/,
	      // YYYY-MM-DD
	      date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/,
	      // HH:MM:SS
	      time: /^(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}$/,
	      dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
	      // MM/DD/YYYY
	      month_day_year: /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.]\d{4}$/,
	      // DD/MM/YYYY
	      day_month_year: /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.]\d{4}$/,
	
	      // #FFF or #FFFFFF
	      color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
	    },
	
	    /**
	     * Optional validation functions to be used. `equalTo` being the only default included function.
	     * Functions should return only a boolean if the input is valid or not. Functions are given the following arguments:
	     * el : The jQuery element to validate.
	     * required : Boolean value of the required attribute be present or not.
	     * parent : The direct parent of the input.
	     * @option
	     */
	    validators: {
	      equalTo: function (el, required, parent) {
	        return $('#' + el.attr('data-equalto')).val() === el.val();
	      }
	    }
	  };
	
	  // Window exports
	  Foundation.plugin(Abide, 'Abide');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Accordion module.
	   * @module foundation.accordion
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.motion
	   */
	
	  var Accordion = function () {
	    /**
	     * Creates a new instance of an accordion.
	     * @class
	     * @fires Accordion#init
	     * @param {jQuery} element - jQuery object to make into an accordion.
	     * @param {Object} options - a plain object with settings to override the default options.
	     */
	
	    function Accordion(element, options) {
	      _classCallCheck(this, Accordion);
	
	      this.$element = element;
	      this.options = $.extend({}, Accordion.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Accordion');
	      Foundation.Keyboard.register('Accordion', {
	        'ENTER': 'toggle',
	        'SPACE': 'toggle',
	        'ARROW_DOWN': 'next',
	        'ARROW_UP': 'previous'
	      });
	    }
	
	    /**
	     * Initializes the accordion by animating the preset active pane(s).
	     * @private
	     */
	
	
	    _createClass(Accordion, [{
	      key: '_init',
	      value: function _init() {
	        this.$element.attr('role', 'tablist');
	        this.$tabs = this.$element.children('li, [data-accordion-item]');
	
	        this.$tabs.each(function (idx, el) {
	          var $el = $(el),
	              $content = $el.children('[data-tab-content]'),
	              id = $content[0].id || Foundation.GetYoDigits(6, 'accordion'),
	              linkId = el.id || id + '-label';
	
	          $el.find('a:first').attr({
	            'aria-controls': id,
	            'role': 'tab',
	            'id': linkId,
	            'aria-expanded': false,
	            'aria-selected': false
	          });
	
	          $content.attr({ 'role': 'tabpanel', 'aria-labelledby': linkId, 'aria-hidden': true, 'id': id });
	        });
	        var $initActive = this.$element.find('.is-active').children('[data-tab-content]');
	        if ($initActive.length) {
	          this.down($initActive, true);
	        }
	        this._events();
	      }
	
	      /**
	       * Adds event handlers for items within the accordion.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	
	        this.$tabs.each(function () {
	          var $elem = $(this);
	          var $tabContent = $elem.children('[data-tab-content]');
	          if ($tabContent.length) {
	            $elem.children('a').off('click.zf.accordion keydown.zf.accordion').on('click.zf.accordion', function (e) {
	              // $(this).children('a').on('click.zf.accordion', function(e) {
	              e.preventDefault();
	              if ($elem.hasClass('is-active')) {
	                if (_this.options.allowAllClosed || $elem.siblings().hasClass('is-active')) {
	                  _this.up($tabContent);
	                }
	              } else {
	                _this.down($tabContent);
	              }
	            }).on('keydown.zf.accordion', function (e) {
	              Foundation.Keyboard.handleKey(e, 'Accordion', {
	                toggle: function () {
	                  _this.toggle($tabContent);
	                },
	                next: function () {
	                  var $a = $elem.next().find('a').focus();
	                  if (!_this.options.multiExpand) {
	                    $a.trigger('click.zf.accordion');
	                  }
	                },
	                previous: function () {
	                  var $a = $elem.prev().find('a').focus();
	                  if (!_this.options.multiExpand) {
	                    $a.trigger('click.zf.accordion');
	                  }
	                },
	                handled: function () {
	                  e.preventDefault();
	                  e.stopPropagation();
	                }
	              });
	            });
	          }
	        });
	      }
	
	      /**
	       * Toggles the selected content pane's open/close state.
	       * @param {jQuery} $target - jQuery object of the pane to toggle.
	       * @function
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle($target) {
	        if ($target.parent().hasClass('is-active')) {
	          if (this.options.allowAllClosed || $target.parent().siblings().hasClass('is-active')) {
	            this.up($target);
	          } else {
	            return;
	          }
	        } else {
	          this.down($target);
	        }
	      }
	
	      /**
	       * Opens the accordion tab defined by `$target`.
	       * @param {jQuery} $target - Accordion pane to open.
	       * @param {Boolean} firstTime - flag to determine if reflow should happen.
	       * @fires Accordion#down
	       * @function
	       */
	
	    }, {
	      key: 'down',
	      value: function down($target, firstTime) {
	        var _this2 = this;
	
	        if (!this.options.multiExpand && !firstTime) {
	          var $currentActive = this.$element.children('.is-active').children('[data-tab-content]');
	          if ($currentActive.length) {
	            this.up($currentActive);
	          }
	        }
	
	        $target.attr('aria-hidden', false).parent('[data-tab-content]').addBack().parent().addClass('is-active');
	
	        $target.slideDown(this.options.slideSpeed, function () {
	          /**
	           * Fires when the tab is done opening.
	           * @event Accordion#down
	           */
	          _this2.$element.trigger('down.zf.accordion', [$target]);
	        });
	
	        $('#' + $target.attr('aria-labelledby')).attr({
	          'aria-expanded': true,
	          'aria-selected': true
	        });
	      }
	
	      /**
	       * Closes the tab defined by `$target`.
	       * @param {jQuery} $target - Accordion tab to close.
	       * @fires Accordion#up
	       * @function
	       */
	
	    }, {
	      key: 'up',
	      value: function up($target) {
	        var $aunts = $target.parent().siblings(),
	            _this = this;
	        var canClose = this.options.multiExpand ? $aunts.hasClass('is-active') : $target.parent().hasClass('is-active');
	
	        if (!this.options.allowAllClosed && !canClose) {
	          return;
	        }
	
	        // Foundation.Move(this.options.slideSpeed, $target, function(){
	        $target.slideUp(_this.options.slideSpeed, function () {
	          /**
	           * Fires when the tab is done collapsing up.
	           * @event Accordion#up
	           */
	          _this.$element.trigger('up.zf.accordion', [$target]);
	        });
	        // });
	
	        $target.attr('aria-hidden', true).parent().removeClass('is-active');
	
	        $('#' + $target.attr('aria-labelledby')).attr({
	          'aria-expanded': false,
	          'aria-selected': false
	        });
	      }
	
	      /**
	       * Destroys an instance of an accordion.
	       * @fires Accordion#destroyed
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.find('[data-tab-content]').stop(true).slideUp(0).css('display', '');
	        this.$element.find('a').off('.zf.accordion');
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Accordion;
	  }();
	
	  Accordion.defaults = {
	    /**
	     * Amount of time to animate the opening of an accordion pane.
	     * @option
	     * @example 250
	     */
	    slideSpeed: 250,
	    /**
	     * Allow the accordion to have multiple open panes.
	     * @option
	     * @example false
	     */
	    multiExpand: false,
	    /**
	     * Allow the accordion to close all panes.
	     * @option
	     * @example false
	     */
	    allowAllClosed: false
	  };
	
	  // Window exports
	  Foundation.plugin(Accordion, 'Accordion');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * AccordionMenu module.
	   * @module foundation.accordionMenu
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.motion
	   * @requires foundation.util.nest
	   */
	
	  var AccordionMenu = function () {
	    /**
	     * Creates a new instance of an accordion menu.
	     * @class
	     * @fires AccordionMenu#init
	     * @param {jQuery} element - jQuery object to make into an accordion menu.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function AccordionMenu(element, options) {
	      _classCallCheck(this, AccordionMenu);
	
	      this.$element = element;
	      this.options = $.extend({}, AccordionMenu.defaults, this.$element.data(), options);
	
	      Foundation.Nest.Feather(this.$element, 'accordion');
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'AccordionMenu');
	      Foundation.Keyboard.register('AccordionMenu', {
	        'ENTER': 'toggle',
	        'SPACE': 'toggle',
	        'ARROW_RIGHT': 'open',
	        'ARROW_UP': 'up',
	        'ARROW_DOWN': 'down',
	        'ARROW_LEFT': 'close',
	        'ESCAPE': 'closeAll',
	        'TAB': 'down',
	        'SHIFT_TAB': 'up'
	      });
	    }
	
	    /**
	     * Initializes the accordion menu by hiding all nested menus.
	     * @private
	     */
	
	
	    _createClass(AccordionMenu, [{
	      key: '_init',
	      value: function _init() {
	        this.$element.find('[data-submenu]').not('.is-active').slideUp(0); //.find('a').css('padding-left', '1rem');
	        this.$element.attr({
	          'role': 'tablist',
	          'aria-multiselectable': this.options.multiOpen
	        });
	
	        this.$menuLinks = this.$element.find('.is-accordion-submenu-parent');
	        this.$menuLinks.each(function () {
	          var linkId = this.id || Foundation.GetYoDigits(6, 'acc-menu-link'),
	              $elem = $(this),
	              $sub = $elem.children('[data-submenu]'),
	              subId = $sub[0].id || Foundation.GetYoDigits(6, 'acc-menu'),
	              isActive = $sub.hasClass('is-active');
	          $elem.attr({
	            'aria-controls': subId,
	            'aria-expanded': isActive,
	            'role': 'tab',
	            'id': linkId
	          });
	          $sub.attr({
	            'aria-labelledby': linkId,
	            'aria-hidden': !isActive,
	            'role': 'tabpanel',
	            'id': subId
	          });
	        });
	        var initPanes = this.$element.find('.is-active');
	        if (initPanes.length) {
	          var _this = this;
	          initPanes.each(function () {
	            _this.down($(this));
	          });
	        }
	        this._events();
	      }
	
	      /**
	       * Adds event handlers for items within the menu.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	
	        this.$element.find('li').each(function () {
	          var $submenu = $(this).children('[data-submenu]');
	
	          if ($submenu.length) {
	            $(this).children('a').off('click.zf.accordionMenu').on('click.zf.accordionMenu', function (e) {
	              e.preventDefault();
	
	              _this.toggle($submenu);
	            });
	          }
	        }).on('keydown.zf.accordionmenu', function (e) {
	          var $element = $(this),
	              $elements = $element.parent('ul').children('li'),
	              $prevElement,
	              $nextElement,
	              $target = $element.children('[data-submenu]');
	
	          $elements.each(function (i) {
	            if ($(this).is($element)) {
	              $prevElement = $elements.eq(Math.max(0, i - 1)).find('a').first();
	              $nextElement = $elements.eq(Math.min(i + 1, $elements.length - 1)).find('a').first();
	
	              if ($(this).children('[data-submenu]:visible').length) {
	                // has open sub menu
	                $nextElement = $element.find('li:first-child').find('a').first();
	              }
	              if ($(this).is(':first-child')) {
	                // is first element of sub menu
	                $prevElement = $element.parents('li').first().find('a').first();
	              } else if ($prevElement.children('[data-submenu]:visible').length) {
	                // if previous element has open sub menu
	                $prevElement = $prevElement.find('li:last-child').find('a').first();
	              }
	              if ($(this).is(':last-child')) {
	                // is last element of sub menu
	                $nextElement = $element.parents('li').first().next('li').find('a').first();
	              }
	
	              return;
	            }
	          });
	          Foundation.Keyboard.handleKey(e, 'AccordionMenu', {
	            open: function () {
	              if ($target.is(':hidden')) {
	                _this.down($target);
	                $target.find('li').first().find('a').first().focus();
	              }
	            },
	            close: function () {
	              if ($target.length && !$target.is(':hidden')) {
	                // close active sub of this item
	                _this.up($target);
	              } else if ($element.parent('[data-submenu]').length) {
	                // close currently open sub
	                _this.up($element.parent('[data-submenu]'));
	                $element.parents('li').first().find('a').first().focus();
	              }
	            },
	            up: function () {
	              $prevElement.attr('tabindex', -1).focus();
	              return true;
	            },
	            down: function () {
	              $nextElement.attr('tabindex', -1).focus();
	              return true;
	            },
	            toggle: function () {
	              if ($element.children('[data-submenu]').length) {
	                _this.toggle($element.children('[data-submenu]'));
	              }
	            },
	            closeAll: function () {
	              _this.hideAll();
	            },
	            handled: function (preventDefault) {
	              if (preventDefault) {
	                e.preventDefault();
	              }
	              e.stopImmediatePropagation();
	            }
	          });
	        }); //.attr('tabindex', 0);
	      }
	
	      /**
	       * Closes all panes of the menu.
	       * @function
	       */
	
	    }, {
	      key: 'hideAll',
	      value: function hideAll() {
	        this.$element.find('[data-submenu]').slideUp(this.options.slideSpeed);
	      }
	
	      /**
	       * Toggles the open/close state of a submenu.
	       * @function
	       * @param {jQuery} $target - the submenu to toggle
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle($target) {
	        if (!$target.is(':animated')) {
	          if (!$target.is(':hidden')) {
	            this.up($target);
	          } else {
	            this.down($target);
	          }
	        }
	      }
	
	      /**
	       * Opens the sub-menu defined by `$target`.
	       * @param {jQuery} $target - Sub-menu to open.
	       * @fires AccordionMenu#down
	       */
	
	    }, {
	      key: 'down',
	      value: function down($target) {
	        var _this = this;
	
	        if (!this.options.multiOpen) {
	          this.up(this.$element.find('.is-active').not($target.parentsUntil(this.$element).add($target)));
	        }
	
	        $target.addClass('is-active').attr({ 'aria-hidden': false }).parent('.is-accordion-submenu-parent').attr({ 'aria-expanded': true });
	
	        //Foundation.Move(this.options.slideSpeed, $target, function() {
	        $target.slideDown(_this.options.slideSpeed, function () {
	          /**
	           * Fires when the menu is done opening.
	           * @event AccordionMenu#down
	           */
	          _this.$element.trigger('down.zf.accordionMenu', [$target]);
	        });
	        //});
	      }
	
	      /**
	       * Closes the sub-menu defined by `$target`. All sub-menus inside the target will be closed as well.
	       * @param {jQuery} $target - Sub-menu to close.
	       * @fires AccordionMenu#up
	       */
	
	    }, {
	      key: 'up',
	      value: function up($target) {
	        var _this = this;
	        //Foundation.Move(this.options.slideSpeed, $target, function(){
	        $target.slideUp(_this.options.slideSpeed, function () {
	          /**
	           * Fires when the menu is done collapsing up.
	           * @event AccordionMenu#up
	           */
	          _this.$element.trigger('up.zf.accordionMenu', [$target]);
	        });
	        //});
	
	        var $menus = $target.find('[data-submenu]').slideUp(0).addBack().attr('aria-hidden', true);
	
	        $menus.parent('.is-accordion-submenu-parent').attr('aria-expanded', false);
	      }
	
	      /**
	       * Destroys an instance of accordion menu.
	       * @fires AccordionMenu#destroyed
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.find('[data-submenu]').slideDown(0).css('display', '');
	        this.$element.find('a').off('click.zf.accordionMenu');
	
	        Foundation.Nest.Burn(this.$element, 'accordion');
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return AccordionMenu;
	  }();
	
	  AccordionMenu.defaults = {
	    /**
	     * Amount of time to animate the opening of a submenu in ms.
	     * @option
	     * @example 250
	     */
	    slideSpeed: 250,
	    /**
	     * Allow the menu to have multiple open panes.
	     * @option
	     * @example true
	     */
	    multiOpen: true
	  };
	
	  // Window exports
	  Foundation.plugin(AccordionMenu, 'AccordionMenu');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Drilldown module.
	   * @module foundation.drilldown
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.motion
	   * @requires foundation.util.nest
	   */
	
	  var Drilldown = function () {
	    /**
	     * Creates a new instance of a drilldown menu.
	     * @class
	     * @param {jQuery} element - jQuery object to make into an accordion menu.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Drilldown(element, options) {
	      _classCallCheck(this, Drilldown);
	
	      this.$element = element;
	      this.options = $.extend({}, Drilldown.defaults, this.$element.data(), options);
	
	      Foundation.Nest.Feather(this.$element, 'drilldown');
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Drilldown');
	      Foundation.Keyboard.register('Drilldown', {
	        'ENTER': 'open',
	        'SPACE': 'open',
	        'ARROW_RIGHT': 'next',
	        'ARROW_UP': 'up',
	        'ARROW_DOWN': 'down',
	        'ARROW_LEFT': 'previous',
	        'ESCAPE': 'close',
	        'TAB': 'down',
	        'SHIFT_TAB': 'up'
	      });
	    }
	
	    /**
	     * Initializes the drilldown by creating jQuery collections of elements
	     * @private
	     */
	
	
	    _createClass(Drilldown, [{
	      key: '_init',
	      value: function _init() {
	        this.$submenuAnchors = this.$element.find('li.is-drilldown-submenu-parent').children('a');
	        this.$submenus = this.$submenuAnchors.parent('li').children('[data-submenu]');
	        this.$menuItems = this.$element.find('li').not('.js-drilldown-back').attr('role', 'menuitem').find('a');
	
	        this._prepareMenu();
	
	        this._keyboardEvents();
	      }
	
	      /**
	       * prepares drilldown menu by setting attributes to links and elements
	       * sets a min height to prevent content jumping
	       * wraps the element if not already wrapped
	       * @private
	       * @function
	       */
	
	    }, {
	      key: '_prepareMenu',
	      value: function _prepareMenu() {
	        var _this = this;
	        // if(!this.options.holdOpen){
	        //   this._menuLinkEvents();
	        // }
	        this.$submenuAnchors.each(function () {
	          var $link = $(this);
	          var $sub = $link.parent();
	          if (_this.options.parentLink) {
	            $link.clone().prependTo($sub.children('[data-submenu]')).wrap('<li class="is-submenu-parent-item is-submenu-item is-drilldown-submenu-item" role="menu-item"></li>');
	          }
	          $link.data('savedHref', $link.attr('href')).removeAttr('href');
	          $link.children('[data-submenu]').attr({
	            'aria-hidden': true,
	            'tabindex': 0,
	            'role': 'menu'
	          });
	          _this._events($link);
	        });
	        this.$submenus.each(function () {
	          var $menu = $(this),
	              $back = $menu.find('.js-drilldown-back');
	          if (!$back.length) {
	            $menu.prepend(_this.options.backButton);
	          }
	          _this._back($menu);
	        });
	        if (!this.$element.parent().hasClass('is-drilldown')) {
	          this.$wrapper = $(this.options.wrapper).addClass('is-drilldown');
	          this.$wrapper = this.$element.wrap(this.$wrapper).parent().css(this._getMaxDims());
	        }
	      }
	
	      /**
	       * Adds event handlers to elements in the menu.
	       * @function
	       * @private
	       * @param {jQuery} $elem - the current menu item to add handlers to.
	       */
	
	    }, {
	      key: '_events',
	      value: function _events($elem) {
	        var _this = this;
	
	        $elem.off('click.zf.drilldown').on('click.zf.drilldown', function (e) {
	          if ($(e.target).parentsUntil('ul', 'li').hasClass('is-drilldown-submenu-parent')) {
	            e.stopImmediatePropagation();
	            e.preventDefault();
	          }
	
	          // if(e.target !== e.currentTarget.firstElementChild){
	          //   return false;
	          // }
	          _this._show($elem.parent('li'));
	
	          if (_this.options.closeOnClick) {
	            var $body = $('body');
	            $body.off('.zf.drilldown').on('click.zf.drilldown', function (e) {
	              if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target)) {
	                return;
	              }
	              e.preventDefault();
	              _this._hideAll();
	              $body.off('.zf.drilldown');
	            });
	          }
	        });
	      }
	
	      /**
	       * Adds keydown event listener to `li`'s in the menu.
	       * @private
	       */
	
	    }, {
	      key: '_keyboardEvents',
	      value: function _keyboardEvents() {
	        var _this = this;
	
	        this.$menuItems.add(this.$element.find('.js-drilldown-back > a')).on('keydown.zf.drilldown', function (e) {
	
	          var $element = $(this),
	              $elements = $element.parent('li').parent('ul').children('li').children('a'),
	              $prevElement,
	              $nextElement;
	
	          $elements.each(function (i) {
	            if ($(this).is($element)) {
	              $prevElement = $elements.eq(Math.max(0, i - 1));
	              $nextElement = $elements.eq(Math.min(i + 1, $elements.length - 1));
	              return;
	            }
	          });
	
	          Foundation.Keyboard.handleKey(e, 'Drilldown', {
	            next: function () {
	              if ($element.is(_this.$submenuAnchors)) {
	                _this._show($element.parent('li'));
	                $element.parent('li').one(Foundation.transitionend($element), function () {
	                  $element.parent('li').find('ul li a').filter(_this.$menuItems).first().focus();
	                });
	                return true;
	              }
	            },
	            previous: function () {
	              _this._hide($element.parent('li').parent('ul'));
	              $element.parent('li').parent('ul').one(Foundation.transitionend($element), function () {
	                setTimeout(function () {
	                  $element.parent('li').parent('ul').parent('li').children('a').first().focus();
	                }, 1);
	              });
	              return true;
	            },
	            up: function () {
	              $prevElement.focus();
	              return true;
	            },
	            down: function () {
	              $nextElement.focus();
	              return true;
	            },
	            close: function () {
	              _this._back();
	              //_this.$menuItems.first().focus(); // focus to first element
	            },
	            open: function () {
	              if (!$element.is(_this.$menuItems)) {
	                // not menu item means back button
	                _this._hide($element.parent('li').parent('ul'));
	                $element.parent('li').parent('ul').one(Foundation.transitionend($element), function () {
	                  setTimeout(function () {
	                    $element.parent('li').parent('ul').parent('li').children('a').first().focus();
	                  }, 1);
	                });
	              } else if ($element.is(_this.$submenuAnchors)) {
	                _this._show($element.parent('li'));
	                $element.parent('li').one(Foundation.transitionend($element), function () {
	                  $element.parent('li').find('ul li a').filter(_this.$menuItems).first().focus();
	                });
	              }
	              return true;
	            },
	            handled: function (preventDefault) {
	              if (preventDefault) {
	                e.preventDefault();
	              }
	              e.stopImmediatePropagation();
	            }
	          });
	        }); // end keyboardAccess
	      }
	
	      /**
	       * Closes all open elements, and returns to root menu.
	       * @function
	       * @fires Drilldown#closed
	       */
	
	    }, {
	      key: '_hideAll',
	      value: function _hideAll() {
	        var $elem = this.$element.find('.is-drilldown-submenu.is-active').addClass('is-closing');
	        $elem.one(Foundation.transitionend($elem), function (e) {
	          $elem.removeClass('is-active is-closing');
	        });
	        /**
	         * Fires when the menu is fully closed.
	         * @event Drilldown#closed
	         */
	        this.$element.trigger('closed.zf.drilldown');
	      }
	
	      /**
	       * Adds event listener for each `back` button, and closes open menus.
	       * @function
	       * @fires Drilldown#back
	       * @param {jQuery} $elem - the current sub-menu to add `back` event.
	       */
	
	    }, {
	      key: '_back',
	      value: function _back($elem) {
	        var _this = this;
	        $elem.off('click.zf.drilldown');
	        $elem.children('.js-drilldown-back').on('click.zf.drilldown', function (e) {
	          e.stopImmediatePropagation();
	          // console.log('mouseup on back');
	          _this._hide($elem);
	        });
	      }
	
	      /**
	       * Adds event listener to menu items w/o submenus to close open menus on click.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_menuLinkEvents',
	      value: function _menuLinkEvents() {
	        var _this = this;
	        this.$menuItems.not('.is-drilldown-submenu-parent').off('click.zf.drilldown').on('click.zf.drilldown', function (e) {
	          // e.stopImmediatePropagation();
	          setTimeout(function () {
	            _this._hideAll();
	          }, 0);
	        });
	      }
	
	      /**
	       * Opens a submenu.
	       * @function
	       * @fires Drilldown#open
	       * @param {jQuery} $elem - the current element with a submenu to open, i.e. the `li` tag.
	       */
	
	    }, {
	      key: '_show',
	      value: function _show($elem) {
	        $elem.children('[data-submenu]').addClass('is-active');
	        /**
	         * Fires when the submenu has opened.
	         * @event Drilldown#open
	         */
	        this.$element.trigger('open.zf.drilldown', [$elem]);
	      }
	    }, {
	      key: '_hide',
	
	
	      /**
	       * Hides a submenu
	       * @function
	       * @fires Drilldown#hide
	       * @param {jQuery} $elem - the current sub-menu to hide, i.e. the `ul` tag.
	       */
	      value: function _hide($elem) {
	        var _this = this;
	        $elem.addClass('is-closing').one(Foundation.transitionend($elem), function () {
	          $elem.removeClass('is-active is-closing');
	          $elem.blur();
	        });
	        /**
	         * Fires when the submenu has closed.
	         * @event Drilldown#hide
	         */
	        $elem.trigger('hide.zf.drilldown', [$elem]);
	      }
	
	      /**
	       * Iterates through the nested menus to calculate the min-height, and max-width for the menu.
	       * Prevents content jumping.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_getMaxDims',
	      value: function _getMaxDims() {
	        var max = 0,
	            result = {};
	        this.$submenus.add(this.$element).each(function () {
	          var numOfElems = $(this).children('li').length;
	          max = numOfElems > max ? numOfElems : max;
	        });
	
	        result['min-height'] = max * this.$menuItems[0].getBoundingClientRect().height + 'px';
	        result['max-width'] = this.$element[0].getBoundingClientRect().width + 'px';
	
	        return result;
	      }
	
	      /**
	       * Destroys the Drilldown Menu
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this._hideAll();
	        Foundation.Nest.Burn(this.$element, 'drilldown');
	        this.$element.unwrap().find('.js-drilldown-back, .is-submenu-parent-item').remove().end().find('.is-active, .is-closing, .is-drilldown-submenu').removeClass('is-active is-closing is-drilldown-submenu').end().find('[data-submenu]').removeAttr('aria-hidden tabindex role');
	        this.$submenuAnchors.each(function () {
	          $(this).off('.zf.drilldown');
	        });
	        this.$element.find('a').each(function () {
	          var $link = $(this);
	          if ($link.data('savedHref')) {
	            $link.attr('href', $link.data('savedHref')).removeData('savedHref');
	          } else {
	            return;
	          }
	        });
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Drilldown;
	  }();
	
	  Drilldown.defaults = {
	    /**
	     * Markup used for JS generated back button. Prepended to submenu lists and deleted on `destroy` method, 'js-drilldown-back' class required. Remove the backslash (`\`) if copy and pasting.
	     * @option
	     * @example '<\li><\a>Back<\/a><\/li>'
	     */
	    backButton: '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>',
	    /**
	     * Markup used to wrap drilldown menu. Use a class name for independent styling; the JS applied class: `is-drilldown` is required. Remove the backslash (`\`) if copy and pasting.
	     * @option
	     * @example '<\div class="is-drilldown"><\/div>'
	     */
	    wrapper: '<div></div>',
	    /**
	     * Adds the parent link to the submenu.
	     * @option
	     * @example false
	     */
	    parentLink: false,
	    /**
	     * Allow the menu to return to root list on body click.
	     * @option
	     * @example false
	     */
	    closeOnClick: false
	    // holdOpen: false
	  };
	
	  // Window exports
	  Foundation.plugin(Drilldown, 'Drilldown');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Dropdown module.
	   * @module foundation.dropdown
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.box
	   * @requires foundation.util.triggers
	   */
	
	  var Dropdown = function () {
	    /**
	     * Creates a new instance of a dropdown.
	     * @class
	     * @param {jQuery} element - jQuery object to make into a dropdown.
	     *        Object should be of the dropdown panel, rather than its anchor.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Dropdown(element, options) {
	      _classCallCheck(this, Dropdown);
	
	      this.$element = element;
	      this.options = $.extend({}, Dropdown.defaults, this.$element.data(), options);
	      this._init();
	
	      Foundation.registerPlugin(this, 'Dropdown');
	      Foundation.Keyboard.register('Dropdown', {
	        'ENTER': 'open',
	        'SPACE': 'open',
	        'ESCAPE': 'close',
	        'TAB': 'tab_forward',
	        'SHIFT_TAB': 'tab_backward'
	      });
	    }
	
	    /**
	     * Initializes the plugin by setting/checking options and attributes, adding helper variables, and saving the anchor.
	     * @function
	     * @private
	     */
	
	
	    _createClass(Dropdown, [{
	      key: '_init',
	      value: function _init() {
	        var $id = this.$element.attr('id');
	
	        this.$anchor = $('[data-toggle="' + $id + '"]') || $('[data-open="' + $id + '"]');
	        this.$anchor.attr({
	          'aria-controls': $id,
	          'data-is-focus': false,
	          'data-yeti-box': $id,
	          'aria-haspopup': true,
	          'aria-expanded': false
	
	        });
	
	        this.options.positionClass = this.getPositionClass();
	        this.counter = 4;
	        this.usedPositions = [];
	        this.$element.attr({
	          'aria-hidden': 'true',
	          'data-yeti-box': $id,
	          'data-resize': $id,
	          'aria-labelledby': this.$anchor[0].id || Foundation.GetYoDigits(6, 'dd-anchor')
	        });
	        this._events();
	      }
	
	      /**
	       * Helper function to determine current orientation of dropdown pane.
	       * @function
	       * @returns {String} position - string value of a position class.
	       */
	
	    }, {
	      key: 'getPositionClass',
	      value: function getPositionClass() {
	        var verticalPosition = this.$element[0].className.match(/(top|left|right|bottom)/g);
	        verticalPosition = verticalPosition ? verticalPosition[0] : '';
	        var horizontalPosition = /float-(\S+)\s/.exec(this.$anchor[0].className);
	        horizontalPosition = horizontalPosition ? horizontalPosition[1] : '';
	        var position = horizontalPosition ? horizontalPosition + ' ' + verticalPosition : verticalPosition;
	        return position;
	      }
	
	      /**
	       * Adjusts the dropdown panes orientation by adding/removing positioning classes.
	       * @function
	       * @private
	       * @param {String} position - position class to remove.
	       */
	
	    }, {
	      key: '_reposition',
	      value: function _reposition(position) {
	        this.usedPositions.push(position ? position : 'bottom');
	        //default, try switching to opposite side
	        if (!position && this.usedPositions.indexOf('top') < 0) {
	          this.$element.addClass('top');
	        } else if (position === 'top' && this.usedPositions.indexOf('bottom') < 0) {
	          this.$element.removeClass(position);
	        } else if (position === 'left' && this.usedPositions.indexOf('right') < 0) {
	          this.$element.removeClass(position).addClass('right');
	        } else if (position === 'right' && this.usedPositions.indexOf('left') < 0) {
	          this.$element.removeClass(position).addClass('left');
	        }
	
	        //if default change didn't work, try bottom or left first
	        else if (!position && this.usedPositions.indexOf('top') > -1 && this.usedPositions.indexOf('left') < 0) {
	            this.$element.addClass('left');
	          } else if (position === 'top' && this.usedPositions.indexOf('bottom') > -1 && this.usedPositions.indexOf('left') < 0) {
	            this.$element.removeClass(position).addClass('left');
	          } else if (position === 'left' && this.usedPositions.indexOf('right') > -1 && this.usedPositions.indexOf('bottom') < 0) {
	            this.$element.removeClass(position);
	          } else if (position === 'right' && this.usedPositions.indexOf('left') > -1 && this.usedPositions.indexOf('bottom') < 0) {
	            this.$element.removeClass(position);
	          }
	          //if nothing cleared, set to bottom
	          else {
	              this.$element.removeClass(position);
	            }
	        this.classChanged = true;
	        this.counter--;
	      }
	
	      /**
	       * Sets the position and orientation of the dropdown pane, checks for collisions.
	       * Recursively calls itself if a collision is detected, with a new position class.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_setPosition',
	      value: function _setPosition() {
	        if (this.$anchor.attr('aria-expanded') === 'false') {
	          return false;
	        }
	        var position = this.getPositionClass(),
	            $eleDims = Foundation.Box.GetDimensions(this.$element),
	            $anchorDims = Foundation.Box.GetDimensions(this.$anchor),
	            _this = this,
	            direction = position === 'left' ? 'left' : position === 'right' ? 'left' : 'top',
	            param = direction === 'top' ? 'height' : 'width',
	            offset = param === 'height' ? this.options.vOffset : this.options.hOffset;
	
	        if ($eleDims.width >= $eleDims.windowDims.width || !this.counter && !Foundation.Box.ImNotTouchingYou(this.$element)) {
	          this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, 'center bottom', this.options.vOffset, this.options.hOffset, true)).css({
	            'width': $eleDims.windowDims.width - this.options.hOffset * 2,
	            'height': 'auto'
	          });
	          this.classChanged = true;
	          return false;
	        }
	
	        this.$element.offset(Foundation.Box.GetOffsets(this.$element, this.$anchor, position, this.options.vOffset, this.options.hOffset));
	
	        while (!Foundation.Box.ImNotTouchingYou(this.$element, false, true) && this.counter) {
	          this._reposition(position);
	          this._setPosition();
	        }
	      }
	
	      /**
	       * Adds event listeners to the element utilizing the triggers utility library.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	        this.$element.on({
	          'open.zf.trigger': this.open.bind(this),
	          'close.zf.trigger': this.close.bind(this),
	          'toggle.zf.trigger': this.toggle.bind(this),
	          'resizeme.zf.trigger': this._setPosition.bind(this)
	        });
	
	        if (this.options.hover) {
	          this.$anchor.off('mouseenter.zf.dropdown mouseleave.zf.dropdown').on('mouseenter.zf.dropdown', function () {
	            clearTimeout(_this.timeout);
	            _this.timeout = setTimeout(function () {
	              _this.open();
	              _this.$anchor.data('hover', true);
	            }, _this.options.hoverDelay);
	          }).on('mouseleave.zf.dropdown', function () {
	            clearTimeout(_this.timeout);
	            _this.timeout = setTimeout(function () {
	              _this.close();
	              _this.$anchor.data('hover', false);
	            }, _this.options.hoverDelay);
	          });
	          if (this.options.hoverPane) {
	            this.$element.off('mouseenter.zf.dropdown mouseleave.zf.dropdown').on('mouseenter.zf.dropdown', function () {
	              clearTimeout(_this.timeout);
	            }).on('mouseleave.zf.dropdown', function () {
	              clearTimeout(_this.timeout);
	              _this.timeout = setTimeout(function () {
	                _this.close();
	                _this.$anchor.data('hover', false);
	              }, _this.options.hoverDelay);
	            });
	          }
	        }
	        this.$anchor.add(this.$element).on('keydown.zf.dropdown', function (e) {
	
	          var $target = $(this),
	              visibleFocusableElements = Foundation.Keyboard.findFocusable(_this.$element);
	
	          Foundation.Keyboard.handleKey(e, 'Dropdown', {
	            tab_forward: function () {
	              if (_this.$element.find(':focus').is(visibleFocusableElements.eq(-1))) {
	                // left modal downwards, setting focus to first element
	                if (_this.options.trapFocus) {
	                  // if focus shall be trapped
	                  visibleFocusableElements.eq(0).focus();
	                  e.preventDefault();
	                } else {
	                  // if focus is not trapped, close dropdown on focus out
	                  _this.close();
	                }
	              }
	            },
	            tab_backward: function () {
	              if (_this.$element.find(':focus').is(visibleFocusableElements.eq(0)) || _this.$element.is(':focus')) {
	                // left modal upwards, setting focus to last element
	                if (_this.options.trapFocus) {
	                  // if focus shall be trapped
	                  visibleFocusableElements.eq(-1).focus();
	                  e.preventDefault();
	                } else {
	                  // if focus is not trapped, close dropdown on focus out
	                  _this.close();
	                }
	              }
	            },
	            open: function () {
	              if ($target.is(_this.$anchor)) {
	                _this.open();
	                _this.$element.attr('tabindex', -1).focus();
	                e.preventDefault();
	              }
	            },
	            close: function () {
	              _this.close();
	              _this.$anchor.focus();
	            }
	          });
	        });
	      }
	
	      /**
	       * Adds an event handler to the body to close any dropdowns on a click.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_addBodyHandler',
	      value: function _addBodyHandler() {
	        var $body = $(document.body).not(this.$element),
	            _this = this;
	        $body.off('click.zf.dropdown').on('click.zf.dropdown', function (e) {
	          if (_this.$anchor.is(e.target) || _this.$anchor.find(e.target).length) {
	            return;
	          }
	          if (_this.$element.find(e.target).length) {
	            return;
	          }
	          _this.close();
	          $body.off('click.zf.dropdown');
	        });
	      }
	
	      /**
	       * Opens the dropdown pane, and fires a bubbling event to close other dropdowns.
	       * @function
	       * @fires Dropdown#closeme
	       * @fires Dropdown#show
	       */
	
	    }, {
	      key: 'open',
	      value: function open() {
	        // var _this = this;
	        /**
	         * Fires to close other open dropdowns
	         * @event Dropdown#closeme
	         */
	        this.$element.trigger('closeme.zf.dropdown', this.$element.attr('id'));
	        this.$anchor.addClass('hover').attr({ 'aria-expanded': true });
	        // this.$element/*.show()*/;
	        this._setPosition();
	        this.$element.addClass('is-open').attr({ 'aria-hidden': false });
	
	        if (this.options.autoFocus) {
	          var $focusable = Foundation.Keyboard.findFocusable(this.$element);
	          if ($focusable.length) {
	            $focusable.eq(0).focus();
	          }
	        }
	
	        if (this.options.closeOnClick) {
	          this._addBodyHandler();
	        }
	
	        /**
	         * Fires once the dropdown is visible.
	         * @event Dropdown#show
	         */
	        this.$element.trigger('show.zf.dropdown', [this.$element]);
	      }
	
	      /**
	       * Closes the open dropdown pane.
	       * @function
	       * @fires Dropdown#hide
	       */
	
	    }, {
	      key: 'close',
	      value: function close() {
	        if (!this.$element.hasClass('is-open')) {
	          return false;
	        }
	        this.$element.removeClass('is-open').attr({ 'aria-hidden': true });
	
	        this.$anchor.removeClass('hover').attr('aria-expanded', false);
	
	        if (this.classChanged) {
	          var curPositionClass = this.getPositionClass();
	          if (curPositionClass) {
	            this.$element.removeClass(curPositionClass);
	          }
	          this.$element.addClass(this.options.positionClass)
	          /*.hide()*/.css({ height: '', width: '' });
	          this.classChanged = false;
	          this.counter = 4;
	          this.usedPositions.length = 0;
	        }
	        this.$element.trigger('hide.zf.dropdown', [this.$element]);
	      }
	
	      /**
	       * Toggles the dropdown pane's visibility.
	       * @function
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle() {
	        if (this.$element.hasClass('is-open')) {
	          if (this.$anchor.data('hover')) return;
	          this.close();
	        } else {
	          this.open();
	        }
	      }
	
	      /**
	       * Destroys the dropdown.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.off('.zf.trigger').hide();
	        this.$anchor.off('.zf.dropdown');
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Dropdown;
	  }();
	
	  Dropdown.defaults = {
	    /**
	     * Amount of time to delay opening a submenu on hover event.
	     * @option
	     * @example 250
	     */
	    hoverDelay: 250,
	    /**
	     * Allow submenus to open on hover events
	     * @option
	     * @example false
	     */
	    hover: false,
	    /**
	     * Don't close dropdown when hovering over dropdown pane
	     * @option
	     * @example true
	     */
	    hoverPane: false,
	    /**
	     * Number of pixels between the dropdown pane and the triggering element on open.
	     * @option
	     * @example 1
	     */
	    vOffset: 1,
	    /**
	     * Number of pixels between the dropdown pane and the triggering element on open.
	     * @option
	     * @example 1
	     */
	    hOffset: 1,
	    /**
	     * Class applied to adjust open position. JS will test and fill this in.
	     * @option
	     * @example 'top'
	     */
	    positionClass: '',
	    /**
	     * Allow the plugin to trap focus to the dropdown pane if opened with keyboard commands.
	     * @option
	     * @example false
	     */
	    trapFocus: false,
	    /**
	     * Allow the plugin to set focus to the first focusable element within the pane, regardless of method of opening.
	     * @option
	     * @example true
	     */
	    autoFocus: false,
	    /**
	     * Allows a click on the body to close the dropdown.
	     * @option
	     * @example false
	     */
	    closeOnClick: false
	  };
	
	  // Window exports
	  Foundation.plugin(Dropdown, 'Dropdown');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * DropdownMenu module.
	   * @module foundation.dropdown-menu
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.box
	   * @requires foundation.util.nest
	   */
	
	  var DropdownMenu = function () {
	    /**
	     * Creates a new instance of DropdownMenu.
	     * @class
	     * @fires DropdownMenu#init
	     * @param {jQuery} element - jQuery object to make into a dropdown menu.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function DropdownMenu(element, options) {
	      _classCallCheck(this, DropdownMenu);
	
	      this.$element = element;
	      this.options = $.extend({}, DropdownMenu.defaults, this.$element.data(), options);
	
	      Foundation.Nest.Feather(this.$element, 'dropdown');
	      this._init();
	
	      Foundation.registerPlugin(this, 'DropdownMenu');
	      Foundation.Keyboard.register('DropdownMenu', {
	        'ENTER': 'open',
	        'SPACE': 'open',
	        'ARROW_RIGHT': 'next',
	        'ARROW_UP': 'up',
	        'ARROW_DOWN': 'down',
	        'ARROW_LEFT': 'previous',
	        'ESCAPE': 'close'
	      });
	    }
	
	    /**
	     * Initializes the plugin, and calls _prepareMenu
	     * @private
	     * @function
	     */
	
	
	    _createClass(DropdownMenu, [{
	      key: '_init',
	      value: function _init() {
	        var subs = this.$element.find('li.is-dropdown-submenu-parent');
	        this.$element.children('.is-dropdown-submenu-parent').children('.is-dropdown-submenu').addClass('first-sub');
	
	        this.$menuItems = this.$element.find('[role="menuitem"]');
	        this.$tabs = this.$element.children('[role="menuitem"]');
	        this.$tabs.find('ul.is-dropdown-submenu').addClass(this.options.verticalClass);
	
	        if (this.$element.hasClass(this.options.rightClass) || this.options.alignment === 'right' || Foundation.rtl() || this.$element.parents('.top-bar-right').is('*')) {
	          this.options.alignment = 'right';
	          subs.addClass('opens-left');
	        } else {
	          subs.addClass('opens-right');
	        }
	        this.changed = false;
	        this._events();
	      }
	    }, {
	      key: '_events',
	
	      /**
	       * Adds event listeners to elements within the menu
	       * @private
	       * @function
	       */
	      value: function _events() {
	        var _this = this,
	            hasTouch = 'ontouchstart' in window || typeof window.ontouchstart !== 'undefined',
	            parClass = 'is-dropdown-submenu-parent';
	
	        // used for onClick and in the keyboard handlers
	        var handleClickFn = function (e) {
	          var $elem = $(e.target).parentsUntil('ul', '.' + parClass),
	              hasSub = $elem.hasClass(parClass),
	              hasClicked = $elem.attr('data-is-click') === 'true',
	              $sub = $elem.children('.is-dropdown-submenu');
	
	          if (hasSub) {
	            if (hasClicked) {
	              if (!_this.options.closeOnClick || !_this.options.clickOpen && !hasTouch || _this.options.forceFollow && hasTouch) {
	                return;
	              } else {
	                e.stopImmediatePropagation();
	                e.preventDefault();
	                _this._hide($elem);
	              }
	            } else {
	              e.preventDefault();
	              e.stopImmediatePropagation();
	              _this._show($elem.children('.is-dropdown-submenu'));
	              $elem.add($elem.parentsUntil(_this.$element, '.' + parClass)).attr('data-is-click', true);
	            }
	          } else {
	            return;
	          }
	        };
	
	        if (this.options.clickOpen || hasTouch) {
	          this.$menuItems.on('click.zf.dropdownmenu touchstart.zf.dropdownmenu', handleClickFn);
	        }
	
	        if (!this.options.disableHover) {
	          this.$menuItems.on('mouseenter.zf.dropdownmenu', function (e) {
	            var $elem = $(this),
	                hasSub = $elem.hasClass(parClass);
	
	            if (hasSub) {
	              clearTimeout(_this.delay);
	              _this.delay = setTimeout(function () {
	                _this._show($elem.children('.is-dropdown-submenu'));
	              }, _this.options.hoverDelay);
	            }
	          }).on('mouseleave.zf.dropdownmenu', function (e) {
	            var $elem = $(this),
	                hasSub = $elem.hasClass(parClass);
	            if (hasSub && _this.options.autoclose) {
	              if ($elem.attr('data-is-click') === 'true' && _this.options.clickOpen) {
	                return false;
	              }
	
	              clearTimeout(_this.delay);
	              _this.delay = setTimeout(function () {
	                _this._hide($elem);
	              }, _this.options.closingTime);
	            }
	          });
	        }
	        this.$menuItems.on('keydown.zf.dropdownmenu', function (e) {
	          var $element = $(e.target).parentsUntil('ul', '[role="menuitem"]'),
	              isTab = _this.$tabs.index($element) > -1,
	              $elements = isTab ? _this.$tabs : $element.siblings('li').add($element),
	              $prevElement,
	              $nextElement;
	
	          $elements.each(function (i) {
	            if ($(this).is($element)) {
	              $prevElement = $elements.eq(i - 1);
	              $nextElement = $elements.eq(i + 1);
	              return;
	            }
	          });
	
	          var nextSibling = function () {
	            if (!$element.is(':last-child')) {
	              $nextElement.children('a:first').focus();
	              e.preventDefault();
	            }
	          },
	              prevSibling = function () {
	            $prevElement.children('a:first').focus();
	            e.preventDefault();
	          },
	              openSub = function () {
	            var $sub = $element.children('ul.is-dropdown-submenu');
	            if ($sub.length) {
	              _this._show($sub);
	              $element.find('li > a:first').focus();
	              e.preventDefault();
	            } else {
	              return;
	            }
	          },
	              closeSub = function () {
	            //if ($element.is(':first-child')) {
	            var close = $element.parent('ul').parent('li');
	            close.children('a:first').focus();
	            _this._hide(close);
	            e.preventDefault();
	            //}
	          };
	          var functions = {
	            open: openSub,
	            close: function () {
	              _this._hide(_this.$element);
	              _this.$menuItems.find('a:first').focus(); // focus to first element
	              e.preventDefault();
	            },
	            handled: function () {
	              e.stopImmediatePropagation();
	            }
	          };
	
	          if (isTab) {
	            if (_this.$element.hasClass(_this.options.verticalClass)) {
	              // vertical menu
	              if (_this.options.alignment === 'left') {
	                // left aligned
	                $.extend(functions, {
	                  down: nextSibling,
	                  up: prevSibling,
	                  next: openSub,
	                  previous: closeSub
	                });
	              } else {
	                // right aligned
	                $.extend(functions, {
	                  down: nextSibling,
	                  up: prevSibling,
	                  next: closeSub,
	                  previous: openSub
	                });
	              }
	            } else {
	              // horizontal menu
	              $.extend(functions, {
	                next: nextSibling,
	                previous: prevSibling,
	                down: openSub,
	                up: closeSub
	              });
	            }
	          } else {
	            // not tabs -> one sub
	            if (_this.options.alignment === 'left') {
	              // left aligned
	              $.extend(functions, {
	                next: openSub,
	                previous: closeSub,
	                down: nextSibling,
	                up: prevSibling
	              });
	            } else {
	              // right aligned
	              $.extend(functions, {
	                next: closeSub,
	                previous: openSub,
	                down: nextSibling,
	                up: prevSibling
	              });
	            }
	          }
	          Foundation.Keyboard.handleKey(e, 'DropdownMenu', functions);
	        });
	      }
	
	      /**
	       * Adds an event handler to the body to close any dropdowns on a click.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_addBodyHandler',
	      value: function _addBodyHandler() {
	        var $body = $(document.body),
	            _this = this;
	        $body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu').on('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu', function (e) {
	          var $link = _this.$element.find(e.target);
	          if ($link.length) {
	            return;
	          }
	
	          _this._hide();
	          $body.off('mouseup.zf.dropdownmenu touchend.zf.dropdownmenu');
	        });
	      }
	
	      /**
	       * Opens a dropdown pane, and checks for collisions first.
	       * @param {jQuery} $sub - ul element that is a submenu to show
	       * @function
	       * @private
	       * @fires DropdownMenu#show
	       */
	
	    }, {
	      key: '_show',
	      value: function _show($sub) {
	        var idx = this.$tabs.index(this.$tabs.filter(function (i, el) {
	          return $(el).find($sub).length > 0;
	        }));
	        var $sibs = $sub.parent('li.is-dropdown-submenu-parent').siblings('li.is-dropdown-submenu-parent');
	        this._hide($sibs, idx);
	        $sub.css('visibility', 'hidden').addClass('js-dropdown-active').attr({ 'aria-hidden': false }).parent('li.is-dropdown-submenu-parent').addClass('is-active').attr({ 'aria-expanded': true });
	        var clear = Foundation.Box.ImNotTouchingYou($sub, null, true);
	        if (!clear) {
	          var oldClass = this.options.alignment === 'left' ? '-right' : '-left',
	              $parentLi = $sub.parent('.is-dropdown-submenu-parent');
	          $parentLi.removeClass('opens' + oldClass).addClass('opens-' + this.options.alignment);
	          clear = Foundation.Box.ImNotTouchingYou($sub, null, true);
	          if (!clear) {
	            $parentLi.removeClass('opens-' + this.options.alignment).addClass('opens-inner');
	          }
	          this.changed = true;
	        }
	        $sub.css('visibility', '');
	        if (this.options.closeOnClick) {
	          this._addBodyHandler();
	        }
	        /**
	         * Fires when the new dropdown pane is visible.
	         * @event DropdownMenu#show
	         */
	        this.$element.trigger('show.zf.dropdownmenu', [$sub]);
	      }
	
	      /**
	       * Hides a single, currently open dropdown pane, if passed a parameter, otherwise, hides everything.
	       * @function
	       * @param {jQuery} $elem - element with a submenu to hide
	       * @param {Number} idx - index of the $tabs collection to hide
	       * @private
	       */
	
	    }, {
	      key: '_hide',
	      value: function _hide($elem, idx) {
	        var $toClose;
	        if ($elem && $elem.length) {
	          $toClose = $elem;
	        } else if (idx !== undefined) {
	          $toClose = this.$tabs.not(function (i, el) {
	            return i === idx;
	          });
	        } else {
	          $toClose = this.$element;
	        }
	        var somethingToClose = $toClose.hasClass('is-active') || $toClose.find('.is-active').length > 0;
	
	        if (somethingToClose) {
	          $toClose.find('li.is-active').add($toClose).attr({
	            'aria-expanded': false,
	            'data-is-click': false
	          }).removeClass('is-active');
	
	          $toClose.find('ul.js-dropdown-active').attr({
	            'aria-hidden': true
	          }).removeClass('js-dropdown-active');
	
	          if (this.changed || $toClose.find('opens-inner').length) {
	            var oldClass = this.options.alignment === 'left' ? 'right' : 'left';
	            $toClose.find('li.is-dropdown-submenu-parent').add($toClose).removeClass('opens-inner opens-' + this.options.alignment).addClass('opens-' + oldClass);
	            this.changed = false;
	          }
	          /**
	           * Fires when the open menus are closed.
	           * @event DropdownMenu#hide
	           */
	          this.$element.trigger('hide.zf.dropdownmenu', [$toClose]);
	        }
	      }
	
	      /**
	       * Destroys the plugin.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$menuItems.off('.zf.dropdownmenu').removeAttr('data-is-click').removeClass('is-right-arrow is-left-arrow is-down-arrow opens-right opens-left opens-inner');
	        $(document.body).off('.zf.dropdownmenu');
	        Foundation.Nest.Burn(this.$element, 'dropdown');
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return DropdownMenu;
	  }();
	
	  /**
	   * Default settings for plugin
	   */
	
	
	  DropdownMenu.defaults = {
	    /**
	     * Disallows hover events from opening submenus
	     * @option
	     * @example false
	     */
	    disableHover: false,
	    /**
	     * Allow a submenu to automatically close on a mouseleave event, if not clicked open.
	     * @option
	     * @example true
	     */
	    autoclose: true,
	    /**
	     * Amount of time to delay opening a submenu on hover event.
	     * @option
	     * @example 50
	     */
	    hoverDelay: 50,
	    /**
	     * Allow a submenu to open/remain open on parent click event. Allows cursor to move away from menu.
	     * @option
	     * @example true
	     */
	    clickOpen: false,
	    /**
	     * Amount of time to delay closing a submenu on a mouseleave event.
	     * @option
	     * @example 500
	     */
	
	    closingTime: 500,
	    /**
	     * Position of the menu relative to what direction the submenus should open. Handled by JS.
	     * @option
	     * @example 'left'
	     */
	    alignment: 'left',
	    /**
	     * Allow clicks on the body to close any open submenus.
	     * @option
	     * @example true
	     */
	    closeOnClick: true,
	    /**
	     * Class applied to vertical oriented menus, Foundation default is `vertical`. Update this if using your own class.
	     * @option
	     * @example 'vertical'
	     */
	    verticalClass: 'vertical',
	    /**
	     * Class applied to right-side oriented menus, Foundation default is `align-right`. Update this if using your own class.
	     * @option
	     * @example 'align-right'
	     */
	    rightClass: 'align-right',
	    /**
	     * Boolean to force overide the clicking of links to perform default action, on second touch event for mobile.
	     * @option
	     * @example false
	     */
	    forceFollow: true
	  };
	
	  // Window exports
	  Foundation.plugin(DropdownMenu, 'DropdownMenu');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Equalizer module.
	   * @module foundation.equalizer
	   */
	
	  var Equalizer = function () {
	    /**
	     * Creates a new instance of Equalizer.
	     * @class
	     * @fires Equalizer#init
	     * @param {Object} element - jQuery object to add the trigger to.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Equalizer(element, options) {
	      _classCallCheck(this, Equalizer);
	
	      this.$element = element;
	      this.options = $.extend({}, Equalizer.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Equalizer');
	    }
	
	    /**
	     * Initializes the Equalizer plugin and calls functions to get equalizer functioning on load.
	     * @private
	     */
	
	
	    _createClass(Equalizer, [{
	      key: '_init',
	      value: function _init() {
	        var eqId = this.$element.attr('data-equalizer') || '';
	        var $watched = this.$element.find('[data-equalizer-watch="' + eqId + '"]');
	
	        this.$watched = $watched.length ? $watched : this.$element.find('[data-equalizer-watch]');
	        this.$element.attr('data-resize', eqId || Foundation.GetYoDigits(6, 'eq'));
	
	        this.hasNested = this.$element.find('[data-equalizer]').length > 0;
	        this.isNested = this.$element.parentsUntil(document.body, '[data-equalizer]').length > 0;
	        this.isOn = false;
	        this._bindHandler = {
	          onResizeMeBound: this._onResizeMe.bind(this),
	          onPostEqualizedBound: this._onPostEqualized.bind(this)
	        };
	
	        var imgs = this.$element.find('img');
	        var tooSmall;
	        if (this.options.equalizeOn) {
	          tooSmall = this._checkMQ();
	          $(window).on('changed.zf.mediaquery', this._checkMQ.bind(this));
	        } else {
	          this._events();
	        }
	        if (tooSmall !== undefined && tooSmall === false || tooSmall === undefined) {
	          if (imgs.length) {
	            Foundation.onImagesLoaded(imgs, this._reflow.bind(this));
	          } else {
	            this._reflow();
	          }
	        }
	      }
	
	      /**
	       * Removes event listeners if the breakpoint is too small.
	       * @private
	       */
	
	    }, {
	      key: '_pauseEvents',
	      value: function _pauseEvents() {
	        this.isOn = false;
	        this.$element.off({
	          '.zf.equalizer': this._bindHandler.onPostEqualizedBound,
	          'resizeme.zf.trigger': this._bindHandler.onResizeMeBound
	        });
	      }
	
	      /**
	       * function to handle $elements resizeme.zf.trigger, with bound this on _bindHandler.onResizeMeBound
	       * @private
	       */
	
	    }, {
	      key: '_onResizeMe',
	      value: function _onResizeMe(e) {
	        this._reflow();
	      }
	
	      /**
	       * function to handle $elements postequalized.zf.equalizer, with bound this on _bindHandler.onPostEqualizedBound
	       * @private
	       */
	
	    }, {
	      key: '_onPostEqualized',
	      value: function _onPostEqualized(e) {
	        if (e.target !== this.$element[0]) {
	          this._reflow();
	        }
	      }
	
	      /**
	       * Initializes events for Equalizer.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	        this._pauseEvents();
	        if (this.hasNested) {
	          this.$element.on('postequalized.zf.equalizer', this._bindHandler.onPostEqualizedBound);
	        } else {
	          this.$element.on('resizeme.zf.trigger', this._bindHandler.onResizeMeBound);
	        }
	        this.isOn = true;
	      }
	
	      /**
	       * Checks the current breakpoint to the minimum required size.
	       * @private
	       */
	
	    }, {
	      key: '_checkMQ',
	      value: function _checkMQ() {
	        var tooSmall = !Foundation.MediaQuery.atLeast(this.options.equalizeOn);
	        if (tooSmall) {
	          if (this.isOn) {
	            this._pauseEvents();
	            this.$watched.css('height', 'auto');
	          }
	        } else {
	          if (!this.isOn) {
	            this._events();
	          }
	        }
	        return tooSmall;
	      }
	
	      /**
	       * A noop version for the plugin
	       * @private
	       */
	
	    }, {
	      key: '_killswitch',
	      value: function _killswitch() {
	        return;
	      }
	
	      /**
	       * Calls necessary functions to update Equalizer upon DOM change
	       * @private
	       */
	
	    }, {
	      key: '_reflow',
	      value: function _reflow() {
	        if (!this.options.equalizeOnStack) {
	          if (this._isStacked()) {
	            this.$watched.css('height', 'auto');
	            return false;
	          }
	        }
	        if (this.options.equalizeByRow) {
	          this.getHeightsByRow(this.applyHeightByRow.bind(this));
	        } else {
	          this.getHeights(this.applyHeight.bind(this));
	        }
	      }
	
	      /**
	       * Manually determines if the first 2 elements are *NOT* stacked.
	       * @private
	       */
	
	    }, {
	      key: '_isStacked',
	      value: function _isStacked() {
	        return this.$watched[0].getBoundingClientRect().top !== this.$watched[1].getBoundingClientRect().top;
	      }
	
	      /**
	       * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
	       * @param {Function} cb - A non-optional callback to return the heights array to.
	       * @returns {Array} heights - An array of heights of children within Equalizer container
	       */
	
	    }, {
	      key: 'getHeights',
	      value: function getHeights(cb) {
	        var heights = [];
	        for (var i = 0, len = this.$watched.length; i < len; i++) {
	          this.$watched[i].style.height = 'auto';
	          heights.push(this.$watched[i].offsetHeight);
	        }
	        cb(heights);
	      }
	
	      /**
	       * Finds the outer heights of children contained within an Equalizer parent and returns them in an array
	       * @param {Function} cb - A non-optional callback to return the heights array to.
	       * @returns {Array} groups - An array of heights of children within Equalizer container grouped by row with element,height and max as last child
	       */
	
	    }, {
	      key: 'getHeightsByRow',
	      value: function getHeightsByRow(cb) {
	        var lastElTopOffset = this.$watched.length ? this.$watched.first().offset().top : 0,
	            groups = [],
	            group = 0;
	        //group by Row
	        groups[group] = [];
	        for (var i = 0, len = this.$watched.length; i < len; i++) {
	          this.$watched[i].style.height = 'auto';
	          //maybe could use this.$watched[i].offsetTop
	          var elOffsetTop = $(this.$watched[i]).offset().top;
	          if (elOffsetTop != lastElTopOffset) {
	            group++;
	            groups[group] = [];
	            lastElTopOffset = elOffsetTop;
	          }
	          groups[group].push([this.$watched[i], this.$watched[i].offsetHeight]);
	        }
	
	        for (var j = 0, ln = groups.length; j < ln; j++) {
	          var heights = $(groups[j]).map(function () {
	            return this[1];
	          }).get();
	          var max = Math.max.apply(null, heights);
	          groups[j].push(max);
	        }
	        cb(groups);
	      }
	
	      /**
	       * Changes the CSS height property of each child in an Equalizer parent to match the tallest
	       * @param {array} heights - An array of heights of children within Equalizer container
	       * @fires Equalizer#preequalized
	       * @fires Equalizer#postequalized
	       */
	
	    }, {
	      key: 'applyHeight',
	      value: function applyHeight(heights) {
	        var max = Math.max.apply(null, heights);
	        /**
	         * Fires before the heights are applied
	         * @event Equalizer#preequalized
	         */
	        this.$element.trigger('preequalized.zf.equalizer');
	
	        this.$watched.css('height', max);
	
	        /**
	         * Fires when the heights have been applied
	         * @event Equalizer#postequalized
	         */
	        this.$element.trigger('postequalized.zf.equalizer');
	      }
	
	      /**
	       * Changes the CSS height property of each child in an Equalizer parent to match the tallest by row
	       * @param {array} groups - An array of heights of children within Equalizer container grouped by row with element,height and max as last child
	       * @fires Equalizer#preequalized
	       * @fires Equalizer#preequalizedRow
	       * @fires Equalizer#postequalizedRow
	       * @fires Equalizer#postequalized
	       */
	
	    }, {
	      key: 'applyHeightByRow',
	      value: function applyHeightByRow(groups) {
	        /**
	         * Fires before the heights are applied
	         */
	        this.$element.trigger('preequalized.zf.equalizer');
	        for (var i = 0, len = groups.length; i < len; i++) {
	          var groupsILength = groups[i].length,
	              max = groups[i][groupsILength - 1];
	          if (groupsILength <= 2) {
	            $(groups[i][0][0]).css({ 'height': 'auto' });
	            continue;
	          }
	          /**
	            * Fires before the heights per row are applied
	            * @event Equalizer#preequalizedRow
	            */
	          this.$element.trigger('preequalizedrow.zf.equalizer');
	          for (var j = 0, lenJ = groupsILength - 1; j < lenJ; j++) {
	            $(groups[i][j][0]).css({ 'height': max });
	          }
	          /**
	            * Fires when the heights per row have been applied
	            * @event Equalizer#postequalizedRow
	            */
	          this.$element.trigger('postequalizedrow.zf.equalizer');
	        }
	        /**
	         * Fires when the heights have been applied
	         */
	        this.$element.trigger('postequalized.zf.equalizer');
	      }
	
	      /**
	       * Destroys an instance of Equalizer.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this._pauseEvents();
	        this.$watched.css('height', 'auto');
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Equalizer;
	  }();
	
	  /**
	   * Default settings for plugin
	   */
	
	
	  Equalizer.defaults = {
	    /**
	     * Enable height equalization when stacked on smaller screens.
	     * @option
	     * @example true
	     */
	    equalizeOnStack: true,
	    /**
	     * Enable height equalization row by row.
	     * @option
	     * @example false
	     */
	    equalizeByRow: false,
	    /**
	     * String representing the minimum breakpoint size the plugin should equalize heights on.
	     * @option
	     * @example 'medium'
	     */
	    equalizeOn: ''
	  };
	
	  // Window exports
	  Foundation.plugin(Equalizer, 'Equalizer');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Interchange module.
	   * @module foundation.interchange
	   * @requires foundation.util.mediaQuery
	   * @requires foundation.util.timerAndImageLoader
	   */
	
	  var Interchange = function () {
	    /**
	     * Creates a new instance of Interchange.
	     * @class
	     * @fires Interchange#init
	     * @param {Object} element - jQuery object to add the trigger to.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Interchange(element, options) {
	      _classCallCheck(this, Interchange);
	
	      this.$element = element;
	      this.options = $.extend({}, Interchange.defaults, options);
	      this.rules = [];
	      this.currentPath = '';
	
	      this._init();
	      this._events();
	
	      Foundation.registerPlugin(this, 'Interchange');
	    }
	
	    /**
	     * Initializes the Interchange plugin and calls functions to get interchange functioning on load.
	     * @function
	     * @private
	     */
	
	
	    _createClass(Interchange, [{
	      key: '_init',
	      value: function _init() {
	        this._addBreakpoints();
	        this._generateRules();
	        this._reflow();
	      }
	
	      /**
	       * Initializes events for Interchange.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        $(window).on('resize.zf.interchange', Foundation.util.throttle(this._reflow.bind(this), 50));
	      }
	
	      /**
	       * Calls necessary functions to update Interchange upon DOM change
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_reflow',
	      value: function _reflow() {
	        var match;
	
	        // Iterate through each rule, but only save the last match
	        for (var i in this.rules) {
	          if (this.rules.hasOwnProperty(i)) {
	            var rule = this.rules[i];
	
	            if (window.matchMedia(rule.query).matches) {
	              match = rule;
	            }
	          }
	        }
	
	        if (match) {
	          this.replace(match.path);
	        }
	      }
	
	      /**
	       * Gets the Foundation breakpoints and adds them to the Interchange.SPECIAL_QUERIES object.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_addBreakpoints',
	      value: function _addBreakpoints() {
	        for (var i in Foundation.MediaQuery.queries) {
	          if (Foundation.MediaQuery.queries.hasOwnProperty(i)) {
	            var query = Foundation.MediaQuery.queries[i];
	            Interchange.SPECIAL_QUERIES[query.name] = query.value;
	          }
	        }
	      }
	
	      /**
	       * Checks the Interchange element for the provided media query + content pairings
	       * @function
	       * @private
	       * @param {Object} element - jQuery object that is an Interchange instance
	       * @returns {Array} scenarios - Array of objects that have 'mq' and 'path' keys with corresponding keys
	       */
	
	    }, {
	      key: '_generateRules',
	      value: function _generateRules(element) {
	        var rulesList = [];
	        var rules;
	
	        if (this.options.rules) {
	          rules = this.options.rules;
	        } else {
	          rules = this.$element.data('interchange').match(/\[.*?\]/g);
	        }
	
	        for (var i in rules) {
	          if (rules.hasOwnProperty(i)) {
	            var rule = rules[i].slice(1, -1).split(', ');
	            var path = rule.slice(0, -1).join('');
	            var query = rule[rule.length - 1];
	
	            if (Interchange.SPECIAL_QUERIES[query]) {
	              query = Interchange.SPECIAL_QUERIES[query];
	            }
	
	            rulesList.push({
	              path: path,
	              query: query
	            });
	          }
	        }
	
	        this.rules = rulesList;
	      }
	
	      /**
	       * Update the `src` property of an image, or change the HTML of a container, to the specified path.
	       * @function
	       * @param {String} path - Path to the image or HTML partial.
	       * @fires Interchange#replaced
	       */
	
	    }, {
	      key: 'replace',
	      value: function replace(path) {
	        if (this.currentPath === path) return;
	
	        var _this = this,
	            trigger = 'replaced.zf.interchange';
	
	        // Replacing images
	        if (this.$element[0].nodeName === 'IMG') {
	          this.$element.attr('src', path).load(function () {
	            _this.currentPath = path;
	          }).trigger(trigger);
	        }
	        // Replacing background images
	        else if (path.match(/\.(gif|jpg|jpeg|png|svg|tiff)([?#].*)?/i)) {
	            this.$element.css({ 'background-image': 'url(' + path + ')' }).trigger(trigger);
	          }
	          // Replacing HTML
	          else {
	              $.get(path, function (response) {
	                _this.$element.html(response).trigger(trigger);
	                $(response).foundation();
	                _this.currentPath = path;
	              });
	            }
	
	        /**
	         * Fires when content in an Interchange element is done being loaded.
	         * @event Interchange#replaced
	         */
	        // this.$element.trigger('replaced.zf.interchange');
	      }
	
	      /**
	       * Destroys an instance of interchange.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        //TODO this.
	      }
	    }]);
	
	    return Interchange;
	  }();
	
	  /**
	   * Default settings for plugin
	   */
	
	
	  Interchange.defaults = {
	    /**
	     * Rules to be applied to Interchange elements. Set with the `data-interchange` array notation.
	     * @option
	     */
	    rules: null
	  };
	
	  Interchange.SPECIAL_QUERIES = {
	    'landscape': 'screen and (orientation: landscape)',
	    'portrait': 'screen and (orientation: portrait)',
	    'retina': 'only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx)'
	  };
	
	  // Window exports
	  Foundation.plugin(Interchange, 'Interchange');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Magellan module.
	   * @module foundation.magellan
	   */
	
	  var Magellan = function () {
	    /**
	     * Creates a new instance of Magellan.
	     * @class
	     * @fires Magellan#init
	     * @param {Object} element - jQuery object to add the trigger to.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Magellan(element, options) {
	      _classCallCheck(this, Magellan);
	
	      this.$element = element;
	      this.options = $.extend({}, Magellan.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Magellan');
	    }
	
	    /**
	     * Initializes the Magellan plugin and calls functions to get equalizer functioning on load.
	     * @private
	     */
	
	
	    _createClass(Magellan, [{
	      key: '_init',
	      value: function _init() {
	        var id = this.$element[0].id || Foundation.GetYoDigits(6, 'magellan');
	        var _this = this;
	        this.$targets = $('[data-magellan-target]');
	        this.$links = this.$element.find('a');
	        this.$element.attr({
	          'data-resize': id,
	          'data-scroll': id,
	          'id': id
	        });
	        this.$active = $();
	        this.scrollPos = parseInt(window.pageYOffset, 10);
	
	        this._events();
	      }
	
	      /**
	       * Calculates an array of pixel values that are the demarcation lines between locations on the page.
	       * Can be invoked if new elements are added or the size of a location changes.
	       * @function
	       */
	
	    }, {
	      key: 'calcPoints',
	      value: function calcPoints() {
	        var _this = this,
	            body = document.body,
	            html = document.documentElement;
	
	        this.points = [];
	        this.winHeight = Math.round(Math.max(window.innerHeight, html.clientHeight));
	        this.docHeight = Math.round(Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight));
	
	        this.$targets.each(function () {
	          var $tar = $(this),
	              pt = Math.round($tar.offset().top - _this.options.threshold);
	          $tar.targetPoint = pt;
	          _this.points.push(pt);
	        });
	      }
	
	      /**
	       * Initializes events for Magellan.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this,
	            $body = $('html, body'),
	            opts = {
	          duration: _this.options.animationDuration,
	          easing: _this.options.animationEasing
	        };
	        $(window).one('load', function () {
	          if (_this.options.deepLinking) {
	            if (location.hash) {
	              _this.scrollToLoc(location.hash);
	            }
	          }
	          _this.calcPoints();
	          _this._updateActive();
	        });
	
	        this.$element.on({
	          'resizeme.zf.trigger': this.reflow.bind(this),
	          'scrollme.zf.trigger': this._updateActive.bind(this)
	        }).on('click.zf.magellan', 'a[href^="#"]', function (e) {
	          e.preventDefault();
	          var arrival = this.getAttribute('href');
	          _this.scrollToLoc(arrival);
	        });
	      }
	
	      /**
	       * Function to scroll to a given location on the page.
	       * @param {String} loc - a properly formatted jQuery id selector. Example: '#foo'
	       * @function
	       */
	
	    }, {
	      key: 'scrollToLoc',
	      value: function scrollToLoc(loc) {
	        var scrollPos = Math.round($(loc).offset().top - this.options.threshold / 2 - this.options.barOffset);
	
	        $('html, body').stop(true).animate({ scrollTop: scrollPos }, this.options.animationDuration, this.options.animationEasing);
	      }
	
	      /**
	       * Calls necessary functions to update Magellan upon DOM change
	       * @function
	       */
	
	    }, {
	      key: 'reflow',
	      value: function reflow() {
	        this.calcPoints();
	        this._updateActive();
	      }
	
	      /**
	       * Updates the visibility of an active location link, and updates the url hash for the page, if deepLinking enabled.
	       * @private
	       * @function
	       * @fires Magellan#update
	       */
	
	    }, {
	      key: '_updateActive',
	      value: function _updateActive() /*evt, elem, scrollPos*/{
	        var winPos = /*scrollPos ||*/parseInt(window.pageYOffset, 10),
	            curIdx;
	
	        if (winPos + this.winHeight === this.docHeight) {
	          curIdx = this.points.length - 1;
	        } else if (winPos < this.points[0]) {
	          curIdx = 0;
	        } else {
	          var isDown = this.scrollPos < winPos,
	              _this = this,
	              curVisible = this.points.filter(function (p, i) {
	            return isDown ? p - _this.options.barOffset <= winPos : p - _this.options.barOffset - _this.options.threshold <= winPos;
	          });
	          curIdx = curVisible.length ? curVisible.length - 1 : 0;
	        }
	
	        this.$active.removeClass(this.options.activeClass);
	        this.$active = this.$links.eq(curIdx).addClass(this.options.activeClass);
	
	        if (this.options.deepLinking) {
	          var hash = this.$active[0].getAttribute('href');
	          if (window.history.pushState) {
	            window.history.pushState(null, null, hash);
	          } else {
	            window.location.hash = hash;
	          }
	        }
	
	        this.scrollPos = winPos;
	        /**
	         * Fires when magellan is finished updating to the new active element.
	         * @event Magellan#update
	         */
	        this.$element.trigger('update.zf.magellan', [this.$active]);
	      }
	
	      /**
	       * Destroys an instance of Magellan and resets the url of the window.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.off('.zf.trigger .zf.magellan').find('.' + this.options.activeClass).removeClass(this.options.activeClass);
	
	        if (this.options.deepLinking) {
	          var hash = this.$active[0].getAttribute('href');
	          window.location.hash.replace(hash, '');
	        }
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Magellan;
	  }();
	
	  /**
	   * Default settings for plugin
	   */
	
	
	  Magellan.defaults = {
	    /**
	     * Amount of time, in ms, the animated scrolling should take between locations.
	     * @option
	     * @example 500
	     */
	    animationDuration: 500,
	    /**
	     * Animation style to use when scrolling between locations.
	     * @option
	     * @example 'ease-in-out'
	     */
	    animationEasing: 'linear',
	    /**
	     * Number of pixels to use as a marker for location changes.
	     * @option
	     * @example 50
	     */
	    threshold: 50,
	    /**
	     * Class applied to the active locations link on the magellan container.
	     * @option
	     * @example 'active'
	     */
	    activeClass: 'active',
	    /**
	     * Allows the script to manipulate the url of the current page, and if supported, alter the history.
	     * @option
	     * @example true
	     */
	    deepLinking: false,
	    /**
	     * Number of pixels to offset the scroll of the page on item click if using a sticky nav bar.
	     * @option
	     * @example 25
	     */
	    barOffset: 0
	  };
	
	  // Window exports
	  Foundation.plugin(Magellan, 'Magellan');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * OffCanvas module.
	   * @module foundation.offcanvas
	   * @requires foundation.util.mediaQuery
	   * @requires foundation.util.triggers
	   * @requires foundation.util.motion
	   */
	
	  var OffCanvas = function () {
	    /**
	     * Creates a new instance of an off-canvas wrapper.
	     * @class
	     * @fires OffCanvas#init
	     * @param {Object} element - jQuery object to initialize.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function OffCanvas(element, options) {
	      _classCallCheck(this, OffCanvas);
	
	      this.$element = element;
	      this.options = $.extend({}, OffCanvas.defaults, this.$element.data(), options);
	      this.$lastTrigger = $();
	      this.$triggers = $();
	
	      this._init();
	      this._events();
	
	      Foundation.registerPlugin(this, 'OffCanvas');
	    }
	
	    /**
	     * Initializes the off-canvas wrapper by adding the exit overlay (if needed).
	     * @function
	     * @private
	     */
	
	
	    _createClass(OffCanvas, [{
	      key: '_init',
	      value: function _init() {
	        var id = this.$element.attr('id');
	
	        this.$element.attr('aria-hidden', 'true');
	
	        // Find triggers that affect this element and add aria-expanded to them
	        this.$triggers = $(document).find('[data-open="' + id + '"], [data-close="' + id + '"], [data-toggle="' + id + '"]').attr('aria-expanded', 'false').attr('aria-controls', id);
	
	        // Add a close trigger over the body if necessary
	        if (this.options.closeOnClick) {
	          if ($('.js-off-canvas-exit').length) {
	            this.$exiter = $('.js-off-canvas-exit');
	          } else {
	            var exiter = document.createElement('div');
	            exiter.setAttribute('class', 'js-off-canvas-exit');
	            $('[data-off-canvas-content]').append(exiter);
	
	            this.$exiter = $(exiter);
	          }
	        }
	
	        this.options.isRevealed = this.options.isRevealed || new RegExp(this.options.revealClass, 'g').test(this.$element[0].className);
	
	        if (this.options.isRevealed) {
	          this.options.revealOn = this.options.revealOn || this.$element[0].className.match(/(reveal-for-medium|reveal-for-large)/g)[0].split('-')[2];
	          this._setMQChecker();
	        }
	        if (!this.options.transitionTime) {
	          this.options.transitionTime = parseFloat(window.getComputedStyle($('[data-off-canvas-wrapper]')[0]).transitionDuration) * 1000;
	        }
	      }
	
	      /**
	       * Adds event handlers to the off-canvas wrapper and the exit overlay.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        this.$element.off('.zf.trigger .zf.offcanvas').on({
	          'open.zf.trigger': this.open.bind(this),
	          'close.zf.trigger': this.close.bind(this),
	          'toggle.zf.trigger': this.toggle.bind(this),
	          'keydown.zf.offcanvas': this._handleKeyboard.bind(this)
	        });
	
	        if (this.options.closeOnClick && this.$exiter.length) {
	          this.$exiter.on({ 'click.zf.offcanvas': this.close.bind(this) });
	        }
	      }
	
	      /**
	       * Applies event listener for elements that will reveal at certain breakpoints.
	       * @private
	       */
	
	    }, {
	      key: '_setMQChecker',
	      value: function _setMQChecker() {
	        var _this = this;
	
	        $(window).on('changed.zf.mediaquery', function () {
	          if (Foundation.MediaQuery.atLeast(_this.options.revealOn)) {
	            _this.reveal(true);
	          } else {
	            _this.reveal(false);
	          }
	        }).one('load.zf.offcanvas', function () {
	          if (Foundation.MediaQuery.atLeast(_this.options.revealOn)) {
	            _this.reveal(true);
	          }
	        });
	      }
	
	      /**
	       * Handles the revealing/hiding the off-canvas at breakpoints, not the same as open.
	       * @param {Boolean} isRevealed - true if element should be revealed.
	       * @function
	       */
	
	    }, {
	      key: 'reveal',
	      value: function reveal(isRevealed) {
	        var $closer = this.$element.find('[data-close]');
	        if (isRevealed) {
	          this.close();
	          this.isRevealed = true;
	          // if (!this.options.forceTop) {
	          //   var scrollPos = parseInt(window.pageYOffset);
	          //   this.$element[0].style.transform = 'translate(0,' + scrollPos + 'px)';
	          // }
	          // if (this.options.isSticky) { this._stick(); }
	          this.$element.off('open.zf.trigger toggle.zf.trigger');
	          if ($closer.length) {
	            $closer.hide();
	          }
	        } else {
	          this.isRevealed = false;
	          // if (this.options.isSticky || !this.options.forceTop) {
	          //   this.$element[0].style.transform = '';
	          //   $(window).off('scroll.zf.offcanvas');
	          // }
	          this.$element.on({
	            'open.zf.trigger': this.open.bind(this),
	            'toggle.zf.trigger': this.toggle.bind(this)
	          });
	          if ($closer.length) {
	            $closer.show();
	          }
	        }
	      }
	
	      /**
	       * Opens the off-canvas menu.
	       * @function
	       * @param {Object} event - Event object passed from listener.
	       * @param {jQuery} trigger - element that triggered the off-canvas to open.
	       * @fires OffCanvas#opened
	       */
	
	    }, {
	      key: 'open',
	      value: function open(event, trigger) {
	        if (this.$element.hasClass('is-open') || this.isRevealed) {
	          return;
	        }
	        var _this = this,
	            $body = $(document.body);
	
	        if (this.options.forceTop) {
	          $('body').scrollTop(0);
	        }
	        // window.pageYOffset = 0;
	
	        // if (!this.options.forceTop) {
	        //   var scrollPos = parseInt(window.pageYOffset);
	        //   this.$element[0].style.transform = 'translate(0,' + scrollPos + 'px)';
	        //   if (this.$exiter.length) {
	        //     this.$exiter[0].style.transform = 'translate(0,' + scrollPos + 'px)';
	        //   }
	        // }
	        /**
	         * Fires when the off-canvas menu opens.
	         * @event OffCanvas#opened
	         */
	        Foundation.Move(this.options.transitionTime, this.$element, function () {
	          $('[data-off-canvas-wrapper]').addClass('is-off-canvas-open is-open-' + _this.options.position);
	
	          _this.$element.addClass('is-open');
	
	          // if (_this.options.isSticky) {
	          //   _this._stick();
	          // }
	        });
	
	        this.$triggers.attr('aria-expanded', 'true');
	        this.$element.attr('aria-hidden', 'false').trigger('opened.zf.offcanvas');
	
	        if (this.options.closeOnClick) {
	          this.$exiter.addClass('is-visible');
	        }
	
	        if (trigger) {
	          this.$lastTrigger = trigger;
	        }
	
	        if (this.options.autoFocus) {
	          this.$element.one(Foundation.transitionend(this.$element), function () {
	            _this.$element.find('a, button').eq(0).focus();
	          });
	        }
	
	        if (this.options.trapFocus) {
	          $('[data-off-canvas-content]').attr('tabindex', '-1');
	          this._trapFocus();
	        }
	      }
	
	      /**
	       * Traps focus within the offcanvas on open.
	       * @private
	       */
	
	    }, {
	      key: '_trapFocus',
	      value: function _trapFocus() {
	        var focusable = Foundation.Keyboard.findFocusable(this.$element),
	            first = focusable.eq(0),
	            last = focusable.eq(-1);
	
	        focusable.off('.zf.offcanvas').on('keydown.zf.offcanvas', function (e) {
	          if (e.which === 9 || e.keycode === 9) {
	            if (e.target === last[0] && !e.shiftKey) {
	              e.preventDefault();
	              first.focus();
	            }
	            if (e.target === first[0] && e.shiftKey) {
	              e.preventDefault();
	              last.focus();
	            }
	          }
	        });
	      }
	
	      /**
	       * Allows the offcanvas to appear sticky utilizing translate properties.
	       * @private
	       */
	      // OffCanvas.prototype._stick = function() {
	      //   var elStyle = this.$element[0].style;
	      //
	      //   if (this.options.closeOnClick) {
	      //     var exitStyle = this.$exiter[0].style;
	      //   }
	      //
	      //   $(window).on('scroll.zf.offcanvas', function(e) {
	      //     console.log(e);
	      //     var pageY = window.pageYOffset;
	      //     elStyle.transform = 'translate(0,' + pageY + 'px)';
	      //     if (exitStyle !== undefined) { exitStyle.transform = 'translate(0,' + pageY + 'px)'; }
	      //   });
	      //   // this.$element.trigger('stuck.zf.offcanvas');
	      // };
	      /**
	       * Closes the off-canvas menu.
	       * @function
	       * @param {Function} cb - optional cb to fire after closure.
	       * @fires OffCanvas#closed
	       */
	
	    }, {
	      key: 'close',
	      value: function close(cb) {
	        if (!this.$element.hasClass('is-open') || this.isRevealed) {
	          return;
	        }
	
	        var _this = this;
	
	        //  Foundation.Move(this.options.transitionTime, this.$element, function() {
	        $('[data-off-canvas-wrapper]').removeClass('is-off-canvas-open is-open-' + _this.options.position);
	        _this.$element.removeClass('is-open');
	        // Foundation._reflow();
	        // });
	        this.$element.attr('aria-hidden', 'true')
	        /**
	         * Fires when the off-canvas menu opens.
	         * @event OffCanvas#closed
	         */
	        .trigger('closed.zf.offcanvas');
	        // if (_this.options.isSticky || !_this.options.forceTop) {
	        //   setTimeout(function() {
	        //     _this.$element[0].style.transform = '';
	        //     $(window).off('scroll.zf.offcanvas');
	        //   }, this.options.transitionTime);
	        // }
	        if (this.options.closeOnClick) {
	          this.$exiter.removeClass('is-visible');
	        }
	
	        this.$triggers.attr('aria-expanded', 'false');
	        if (this.options.trapFocus) {
	          $('[data-off-canvas-content]').removeAttr('tabindex');
	        }
	      }
	
	      /**
	       * Toggles the off-canvas menu open or closed.
	       * @function
	       * @param {Object} event - Event object passed from listener.
	       * @param {jQuery} trigger - element that triggered the off-canvas to open.
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle(event, trigger) {
	        if (this.$element.hasClass('is-open')) {
	          this.close(event, trigger);
	        } else {
	          this.open(event, trigger);
	        }
	      }
	
	      /**
	       * Handles keyboard input when detected. When the escape key is pressed, the off-canvas menu closes, and focus is restored to the element that opened the menu.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_handleKeyboard',
	      value: function _handleKeyboard(event) {
	        if (event.which !== 27) return;
	
	        event.stopPropagation();
	        event.preventDefault();
	        this.close();
	        this.$lastTrigger.focus();
	      }
	
	      /**
	       * Destroys the offcanvas plugin.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.close();
	        this.$element.off('.zf.trigger .zf.offcanvas');
	        this.$exiter.off('.zf.offcanvas');
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return OffCanvas;
	  }();
	
	  OffCanvas.defaults = {
	    /**
	     * Allow the user to click outside of the menu to close it.
	     * @option
	     * @example true
	     */
	    closeOnClick: true,
	
	    /**
	     * Amount of time in ms the open and close transition requires. If none selected, pulls from body style.
	     * @option
	     * @example 500
	     */
	    transitionTime: 0,
	
	    /**
	     * Direction the offcanvas opens from. Determines class applied to body.
	     * @option
	     * @example left
	     */
	    position: 'left',
	
	    /**
	     * Force the page to scroll to top on open.
	     * @option
	     * @example true
	     */
	    forceTop: true,
	
	    /**
	     * Allow the offcanvas to remain open for certain breakpoints.
	     * @option
	     * @example false
	     */
	    isRevealed: false,
	
	    /**
	     * Breakpoint at which to reveal. JS will use a RegExp to target standard classes, if changing classnames, pass your class with the `revealClass` option.
	     * @option
	     * @example reveal-for-large
	     */
	    revealOn: null,
	
	    /**
	     * Force focus to the offcanvas on open. If true, will focus the opening trigger on close.
	     * @option
	     * @example true
	     */
	    autoFocus: true,
	
	    /**
	     * Class used to force an offcanvas to remain open. Foundation defaults for this are `reveal-for-large` & `reveal-for-medium`.
	     * @option
	     * TODO improve the regex testing for this.
	     * @example reveal-for-large
	     */
	    revealClass: 'reveal-for-',
	
	    /**
	     * Triggers optional focus trapping when opening an offcanvas. Sets tabindex of [data-off-canvas-content] to -1 for accessibility purposes.
	     * @option
	     * @example true
	     */
	    trapFocus: false
	  };
	
	  // Window exports
	  Foundation.plugin(OffCanvas, 'OffCanvas');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Orbit module.
	   * @module foundation.orbit
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.motion
	   * @requires foundation.util.timerAndImageLoader
	   * @requires foundation.util.touch
	   */
	
	  var Orbit = function () {
	    /**
	    * Creates a new instance of an orbit carousel.
	    * @class
	    * @param {jQuery} element - jQuery object to make into an Orbit Carousel.
	    * @param {Object} options - Overrides to the default plugin settings.
	    */
	
	    function Orbit(element, options) {
	      _classCallCheck(this, Orbit);
	
	      this.$element = element;
	      this.options = $.extend({}, Orbit.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Orbit');
	      Foundation.Keyboard.register('Orbit', {
	        'ltr': {
	          'ARROW_RIGHT': 'next',
	          'ARROW_LEFT': 'previous'
	        },
	        'rtl': {
	          'ARROW_LEFT': 'next',
	          'ARROW_RIGHT': 'previous'
	        }
	      });
	    }
	
	    /**
	    * Initializes the plugin by creating jQuery collections, setting attributes, and starting the animation.
	    * @function
	    * @private
	    */
	
	
	    _createClass(Orbit, [{
	      key: '_init',
	      value: function _init() {
	        this.$wrapper = this.$element.find('.' + this.options.containerClass);
	        this.$slides = this.$element.find('.' + this.options.slideClass);
	        var $images = this.$element.find('img'),
	            initActive = this.$slides.filter('.is-active');
	
	        if (!initActive.length) {
	          this.$slides.eq(0).addClass('is-active');
	        }
	
	        if (!this.options.useMUI) {
	          this.$slides.addClass('no-motionui');
	        }
	
	        if ($images.length) {
	          Foundation.onImagesLoaded($images, this._prepareForOrbit.bind(this));
	        } else {
	          this._prepareForOrbit(); //hehe
	        }
	
	        if (this.options.bullets) {
	          this._loadBullets();
	        }
	
	        this._events();
	
	        if (this.options.autoPlay && this.$slides.length > 1) {
	          this.geoSync();
	        }
	
	        if (this.options.accessible) {
	          // allow wrapper to be focusable to enable arrow navigation
	          this.$wrapper.attr('tabindex', 0);
	        }
	      }
	
	      /**
	      * Creates a jQuery collection of bullets, if they are being used.
	      * @function
	      * @private
	      */
	
	    }, {
	      key: '_loadBullets',
	      value: function _loadBullets() {
	        this.$bullets = this.$element.find('.' + this.options.boxOfBullets).find('button');
	      }
	
	      /**
	      * Sets a `timer` object on the orbit, and starts the counter for the next slide.
	      * @function
	      */
	
	    }, {
	      key: 'geoSync',
	      value: function geoSync() {
	        var _this = this;
	        this.timer = new Foundation.Timer(this.$element, {
	          duration: this.options.timerDelay,
	          infinite: false
	        }, function () {
	          _this.changeSlide(true);
	        });
	        this.timer.start();
	      }
	
	      /**
	      * Sets wrapper and slide heights for the orbit.
	      * @function
	      * @private
	      */
	
	    }, {
	      key: '_prepareForOrbit',
	      value: function _prepareForOrbit() {
	        var _this = this;
	        this._setWrapperHeight(function (max) {
	          _this._setSlideHeight(max);
	        });
	      }
	
	      /**
	      * Calulates the height of each slide in the collection, and uses the tallest one for the wrapper height.
	      * @function
	      * @private
	      * @param {Function} cb - a callback function to fire when complete.
	      */
	
	    }, {
	      key: '_setWrapperHeight',
	      value: function _setWrapperHeight(cb) {
	        //rewrite this to `for` loop
	        var max = 0,
	            temp,
	            counter = 0;
	
	        this.$slides.each(function () {
	          temp = this.getBoundingClientRect().height;
	          $(this).attr('data-slide', counter);
	
	          if (counter) {
	            //if not the first slide, set css position and display property
	            $(this).css({ 'position': 'relative', 'display': 'none' });
	          }
	          max = temp > max ? temp : max;
	          counter++;
	        });
	
	        if (counter === this.$slides.length) {
	          this.$wrapper.css({ 'height': max }); //only change the wrapper height property once.
	          cb(max); //fire callback with max height dimension.
	        }
	      }
	
	      /**
	      * Sets the max-height of each slide.
	      * @function
	      * @private
	      */
	
	    }, {
	      key: '_setSlideHeight',
	      value: function _setSlideHeight(height) {
	        this.$slides.each(function () {
	          $(this).css('max-height', height);
	        });
	      }
	
	      /**
	      * Adds event listeners to basically everything within the element.
	      * @function
	      * @private
	      */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	
	        //***************************************
	        //**Now using custom event - thanks to:**
	        //**      Yohai Ararat of Toronto      **
	        //***************************************
	        if (this.$slides.length > 1) {
	
	          if (this.options.swipe) {
	            this.$slides.off('swipeleft.zf.orbit swiperight.zf.orbit').on('swipeleft.zf.orbit', function (e) {
	              e.preventDefault();
	              _this.changeSlide(true);
	            }).on('swiperight.zf.orbit', function (e) {
	              e.preventDefault();
	              _this.changeSlide(false);
	            });
	          }
	          //***************************************
	
	          if (this.options.autoPlay) {
	            this.$slides.on('click.zf.orbit', function () {
	              _this.$element.data('clickedOn', _this.$element.data('clickedOn') ? false : true);
	              _this.timer[_this.$element.data('clickedOn') ? 'pause' : 'start']();
	            });
	
	            if (this.options.pauseOnHover) {
	              this.$element.on('mouseenter.zf.orbit', function () {
	                _this.timer.pause();
	              }).on('mouseleave.zf.orbit', function () {
	                if (!_this.$element.data('clickedOn')) {
	                  _this.timer.start();
	                }
	              });
	            }
	          }
	
	          if (this.options.navButtons) {
	            var $controls = this.$element.find('.' + this.options.nextClass + ', .' + this.options.prevClass);
	            $controls.attr('tabindex', 0)
	            //also need to handle enter/return and spacebar key presses
	            .on('click.zf.orbit touchend.zf.orbit', function (e) {
	              e.preventDefault();
	              _this.changeSlide($(this).hasClass(_this.options.nextClass));
	            });
	          }
	
	          if (this.options.bullets) {
	            this.$bullets.on('click.zf.orbit touchend.zf.orbit', function () {
	              if (/is-active/g.test(this.className)) {
	                return false;
	              } //if this is active, kick out of function.
	              var idx = $(this).data('slide'),
	                  ltr = idx > _this.$slides.filter('.is-active').data('slide'),
	                  $slide = _this.$slides.eq(idx);
	
	              _this.changeSlide(ltr, $slide, idx);
	            });
	          }
	
	          this.$wrapper.add(this.$bullets).on('keydown.zf.orbit', function (e) {
	            // handle keyboard event with keyboard util
	            Foundation.Keyboard.handleKey(e, 'Orbit', {
	              next: function () {
	                _this.changeSlide(true);
	              },
	              previous: function () {
	                _this.changeSlide(false);
	              },
	              handled: function () {
	                // if bullet is focused, make sure focus moves
	                if ($(e.target).is(_this.$bullets)) {
	                  _this.$bullets.filter('.is-active').focus();
	                }
	              }
	            });
	          });
	        }
	      }
	
	      /**
	      * Changes the current slide to a new one.
	      * @function
	      * @param {Boolean} isLTR - flag if the slide should move left to right.
	      * @param {jQuery} chosenSlide - the jQuery element of the slide to show next, if one is selected.
	      * @param {Number} idx - the index of the new slide in its collection, if one chosen.
	      * @fires Orbit#slidechange
	      */
	
	    }, {
	      key: 'changeSlide',
	      value: function changeSlide(isLTR, chosenSlide, idx) {
	        var $curSlide = this.$slides.filter('.is-active').eq(0);
	
	        if (/mui/g.test($curSlide[0].className)) {
	          return false;
	        } //if the slide is currently animating, kick out of the function
	
	        var $firstSlide = this.$slides.first(),
	            $lastSlide = this.$slides.last(),
	            dirIn = isLTR ? 'Right' : 'Left',
	            dirOut = isLTR ? 'Left' : 'Right',
	            _this = this,
	            $newSlide;
	
	        if (!chosenSlide) {
	          //most of the time, this will be auto played or clicked from the navButtons.
	          $newSlide = isLTR ? //if wrapping enabled, check to see if there is a `next` or `prev` sibling, if not, select the first or last slide to fill in. if wrapping not enabled, attempt to select `next` or `prev`, if there's nothing there, the function will kick out on next step. CRAZY NESTED TERNARIES!!!!!
	          this.options.infiniteWrap ? $curSlide.next('.' + this.options.slideClass).length ? $curSlide.next('.' + this.options.slideClass) : $firstSlide : $curSlide.next('.' + this.options.slideClass) : //pick next slide if moving left to right
	          this.options.infiniteWrap ? $curSlide.prev('.' + this.options.slideClass).length ? $curSlide.prev('.' + this.options.slideClass) : $lastSlide : $curSlide.prev('.' + this.options.slideClass); //pick prev slide if moving right to left
	        } else {
	            $newSlide = chosenSlide;
	          }
	
	        if ($newSlide.length) {
	          if (this.options.bullets) {
	            idx = idx || this.$slides.index($newSlide); //grab index to update bullets
	            this._updateBullets(idx);
	          }
	
	          if (this.options.useMUI) {
	            Foundation.Motion.animateIn($newSlide.addClass('is-active').css({ 'position': 'absolute', 'top': 0 }), this.options['animInFrom' + dirIn], function () {
	              $newSlide.css({ 'position': 'relative', 'display': 'block' }).attr('aria-live', 'polite');
	            });
	
	            Foundation.Motion.animateOut($curSlide.removeClass('is-active'), this.options['animOutTo' + dirOut], function () {
	              $curSlide.removeAttr('aria-live');
	              if (_this.options.autoPlay && !_this.timer.isPaused) {
	                _this.timer.restart();
	              }
	              //do stuff?
	            });
	          } else {
	              $curSlide.removeClass('is-active is-in').removeAttr('aria-live').hide();
	              $newSlide.addClass('is-active is-in').attr('aria-live', 'polite').show();
	              if (this.options.autoPlay && !this.timer.isPaused) {
	                this.timer.restart();
	              }
	            }
	          /**
	          * Triggers when the slide has finished animating in.
	          * @event Orbit#slidechange
	          */
	          this.$element.trigger('slidechange.zf.orbit', [$newSlide]);
	        }
	      }
	
	      /**
	      * Updates the active state of the bullets, if displayed.
	      * @function
	      * @private
	      * @param {Number} idx - the index of the current slide.
	      */
	
	    }, {
	      key: '_updateBullets',
	      value: function _updateBullets(idx) {
	        var $oldBullet = this.$element.find('.' + this.options.boxOfBullets).find('.is-active').removeClass('is-active').blur(),
	            span = $oldBullet.find('span:last').detach(),
	            $newBullet = this.$bullets.eq(idx).addClass('is-active').append(span);
	      }
	
	      /**
	      * Destroys the carousel and hides the element.
	      * @function
	      */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.off('.zf.orbit').find('*').off('.zf.orbit').end().hide();
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Orbit;
	  }();
	
	  Orbit.defaults = {
	    /**
	    * Tells the JS to look for and loadBullets.
	    * @option
	    * @example true
	    */
	    bullets: true,
	    /**
	    * Tells the JS to apply event listeners to nav buttons
	    * @option
	    * @example true
	    */
	    navButtons: true,
	    /**
	    * motion-ui animation class to apply
	    * @option
	    * @example 'slide-in-right'
	    */
	    animInFromRight: 'slide-in-right',
	    /**
	    * motion-ui animation class to apply
	    * @option
	    * @example 'slide-out-right'
	    */
	    animOutToRight: 'slide-out-right',
	    /**
	    * motion-ui animation class to apply
	    * @option
	    * @example 'slide-in-left'
	    *
	    */
	    animInFromLeft: 'slide-in-left',
	    /**
	    * motion-ui animation class to apply
	    * @option
	    * @example 'slide-out-left'
	    */
	    animOutToLeft: 'slide-out-left',
	    /**
	    * Allows Orbit to automatically animate on page load.
	    * @option
	    * @example true
	    */
	    autoPlay: true,
	    /**
	    * Amount of time, in ms, between slide transitions
	    * @option
	    * @example 5000
	    */
	    timerDelay: 5000,
	    /**
	    * Allows Orbit to infinitely loop through the slides
	    * @option
	    * @example true
	    */
	    infiniteWrap: true,
	    /**
	    * Allows the Orbit slides to bind to swipe events for mobile, requires an additional util library
	    * @option
	    * @example true
	    */
	    swipe: true,
	    /**
	    * Allows the timing function to pause animation on hover.
	    * @option
	    * @example true
	    */
	    pauseOnHover: true,
	    /**
	    * Allows Orbit to bind keyboard events to the slider, to animate frames with arrow keys
	    * @option
	    * @example true
	    */
	    accessible: true,
	    /**
	    * Class applied to the container of Orbit
	    * @option
	    * @example 'orbit-container'
	    */
	    containerClass: 'orbit-container',
	    /**
	    * Class applied to individual slides.
	    * @option
	    * @example 'orbit-slide'
	    */
	    slideClass: 'orbit-slide',
	    /**
	    * Class applied to the bullet container. You're welcome.
	    * @option
	    * @example 'orbit-bullets'
	    */
	    boxOfBullets: 'orbit-bullets',
	    /**
	    * Class applied to the `next` navigation button.
	    * @option
	    * @example 'orbit-next'
	    */
	    nextClass: 'orbit-next',
	    /**
	    * Class applied to the `previous` navigation button.
	    * @option
	    * @example 'orbit-previous'
	    */
	    prevClass: 'orbit-previous',
	    /**
	    * Boolean to flag the js to use motion ui classes or not. Default to true for backwards compatability.
	    * @option
	    * @example true
	    */
	    useMUI: true
	  };
	
	  // Window exports
	  Foundation.plugin(Orbit, 'Orbit');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * ResponsiveMenu module.
	   * @module foundation.responsiveMenu
	   * @requires foundation.util.triggers
	   * @requires foundation.util.mediaQuery
	   * @requires foundation.util.accordionMenu
	   * @requires foundation.util.drilldown
	   * @requires foundation.util.dropdown-menu
	   */
	
	  var ResponsiveMenu = function () {
	    /**
	     * Creates a new instance of a responsive menu.
	     * @class
	     * @fires ResponsiveMenu#init
	     * @param {jQuery} element - jQuery object to make into a dropdown menu.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function ResponsiveMenu(element, options) {
	      _classCallCheck(this, ResponsiveMenu);
	
	      this.$element = $(element);
	      this.rules = this.$element.data('responsive-menu');
	      this.currentMq = null;
	      this.currentPlugin = null;
	
	      this._init();
	      this._events();
	
	      Foundation.registerPlugin(this, 'ResponsiveMenu');
	    }
	
	    /**
	     * Initializes the Menu by parsing the classes from the 'data-ResponsiveMenu' attribute on the element.
	     * @function
	     * @private
	     */
	
	
	    _createClass(ResponsiveMenu, [{
	      key: '_init',
	      value: function _init() {
	        // The first time an Interchange plugin is initialized, this.rules is converted from a string of "classes" to an object of rules
	        if (typeof this.rules === 'string') {
	          var rulesTree = {};
	
	          // Parse rules from "classes" pulled from data attribute
	          var rules = this.rules.split(' ');
	
	          // Iterate through every rule found
	          for (var i = 0; i < rules.length; i++) {
	            var rule = rules[i].split('-');
	            var ruleSize = rule.length > 1 ? rule[0] : 'small';
	            var rulePlugin = rule.length > 1 ? rule[1] : rule[0];
	
	            if (MenuPlugins[rulePlugin] !== null) {
	              rulesTree[ruleSize] = MenuPlugins[rulePlugin];
	            }
	          }
	
	          this.rules = rulesTree;
	        }
	
	        if (!$.isEmptyObject(this.rules)) {
	          this._checkMediaQueries();
	        }
	      }
	
	      /**
	       * Initializes events for the Menu.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	
	        $(window).on('changed.zf.mediaquery', function () {
	          _this._checkMediaQueries();
	        });
	        // $(window).on('resize.zf.ResponsiveMenu', function() {
	        //   _this._checkMediaQueries();
	        // });
	      }
	
	      /**
	       * Checks the current screen width against available media queries. If the media query has changed, and the plugin needed has changed, the plugins will swap out.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_checkMediaQueries',
	      value: function _checkMediaQueries() {
	        var matchedMq,
	            _this = this;
	        // Iterate through each rule and find the last matching rule
	        $.each(this.rules, function (key) {
	          if (Foundation.MediaQuery.atLeast(key)) {
	            matchedMq = key;
	          }
	        });
	
	        // No match? No dice
	        if (!matchedMq) return;
	
	        // Plugin already initialized? We good
	        if (this.currentPlugin instanceof this.rules[matchedMq].plugin) return;
	
	        // Remove existing plugin-specific CSS classes
	        $.each(MenuPlugins, function (key, value) {
	          _this.$element.removeClass(value.cssClass);
	        });
	
	        // Add the CSS class for the new plugin
	        this.$element.addClass(this.rules[matchedMq].cssClass);
	
	        // Create an instance of the new plugin
	        if (this.currentPlugin) this.currentPlugin.destroy();
	        this.currentPlugin = new this.rules[matchedMq].plugin(this.$element, {});
	      }
	
	      /**
	       * Destroys the instance of the current plugin on this element, as well as the window resize handler that switches the plugins out.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.currentPlugin.destroy();
	        $(window).off('.zf.ResponsiveMenu');
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return ResponsiveMenu;
	  }();
	
	  ResponsiveMenu.defaults = {};
	
	  // The plugin matches the plugin classes with these plugin instances.
	  var MenuPlugins = {
	    dropdown: {
	      cssClass: 'dropdown',
	      plugin: Foundation._plugins['dropdown-menu'] || null
	    },
	    drilldown: {
	      cssClass: 'drilldown',
	      plugin: Foundation._plugins['drilldown'] || null
	    },
	    accordion: {
	      cssClass: 'accordion-menu',
	      plugin: Foundation._plugins['accordion-menu'] || null
	    }
	  };
	
	  // Window exports
	  Foundation.plugin(ResponsiveMenu, 'ResponsiveMenu');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * ResponsiveToggle module.
	   * @module foundation.responsiveToggle
	   * @requires foundation.util.mediaQuery
	   */
	
	  var ResponsiveToggle = function () {
	    /**
	     * Creates a new instance of Tab Bar.
	     * @class
	     * @fires ResponsiveToggle#init
	     * @param {jQuery} element - jQuery object to attach tab bar functionality to.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function ResponsiveToggle(element, options) {
	      _classCallCheck(this, ResponsiveToggle);
	
	      this.$element = $(element);
	      this.options = $.extend({}, ResponsiveToggle.defaults, this.$element.data(), options);
	
	      this._init();
	      this._events();
	
	      Foundation.registerPlugin(this, 'ResponsiveToggle');
	    }
	
	    /**
	     * Initializes the tab bar by finding the target element, toggling element, and running update().
	     * @function
	     * @private
	     */
	
	
	    _createClass(ResponsiveToggle, [{
	      key: '_init',
	      value: function _init() {
	        var targetID = this.$element.data('responsive-toggle');
	        if (!targetID) {
	          console.error('Your tab bar needs an ID of a Menu as the value of data-tab-bar.');
	        }
	
	        this.$targetMenu = $('#' + targetID);
	        this.$toggler = this.$element.find('[data-toggle]');
	
	        this._update();
	      }
	
	      /**
	       * Adds necessary event handlers for the tab bar to work.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	
	        this._updateMqHandler = this._update.bind(this);
	
	        $(window).on('changed.zf.mediaquery', this._updateMqHandler);
	
	        this.$toggler.on('click.zf.responsiveToggle', this.toggleMenu.bind(this));
	      }
	
	      /**
	       * Checks the current media query to determine if the tab bar should be visible or hidden.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_update',
	      value: function _update() {
	        // Mobile
	        if (!Foundation.MediaQuery.atLeast(this.options.hideFor)) {
	          this.$element.show();
	          this.$targetMenu.hide();
	        }
	
	        // Desktop
	        else {
	            this.$element.hide();
	            this.$targetMenu.show();
	          }
	      }
	
	      /**
	       * Toggles the element attached to the tab bar. The toggle only happens if the screen is small enough to allow it.
	       * @function
	       * @fires ResponsiveToggle#toggled
	       */
	
	    }, {
	      key: 'toggleMenu',
	      value: function toggleMenu() {
	        if (!Foundation.MediaQuery.atLeast(this.options.hideFor)) {
	          this.$targetMenu.toggle(0);
	
	          /**
	           * Fires when the element attached to the tab bar toggles.
	           * @event ResponsiveToggle#toggled
	           */
	          this.$element.trigger('toggled.zf.responsiveToggle');
	        }
	      }
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.off('.zf.responsiveToggle');
	        this.$toggler.off('.zf.responsiveToggle');
	
	        $(window).off('changed.zf.mediaquery', this._updateMqHandler);
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return ResponsiveToggle;
	  }();
	
	  ResponsiveToggle.defaults = {
	    /**
	     * The breakpoint after which the menu is always shown, and the tab bar is hidden.
	     * @option
	     * @example 'medium'
	     */
	    hideFor: 'medium'
	  };
	
	  // Window exports
	  Foundation.plugin(ResponsiveToggle, 'ResponsiveToggle');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Reveal module.
	   * @module foundation.reveal
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.box
	   * @requires foundation.util.triggers
	   * @requires foundation.util.mediaQuery
	   * @requires foundation.util.motion if using animations
	   */
	
	  var Reveal = function () {
	    /**
	     * Creates a new instance of Reveal.
	     * @class
	     * @param {jQuery} element - jQuery object to use for the modal.
	     * @param {Object} options - optional parameters.
	     */
	
	    function Reveal(element, options) {
	      _classCallCheck(this, Reveal);
	
	      this.$element = element;
	      this.options = $.extend({}, Reveal.defaults, this.$element.data(), options);
	      this._init();
	
	      Foundation.registerPlugin(this, 'Reveal');
	      Foundation.Keyboard.register('Reveal', {
	        'ENTER': 'open',
	        'SPACE': 'open',
	        'ESCAPE': 'close',
	        'TAB': 'tab_forward',
	        'SHIFT_TAB': 'tab_backward'
	      });
	    }
	
	    /**
	     * Initializes the modal by adding the overlay and close buttons, (if selected).
	     * @private
	     */
	
	
	    _createClass(Reveal, [{
	      key: '_init',
	      value: function _init() {
	        this.id = this.$element.attr('id');
	        this.isActive = false;
	        this.cached = { mq: Foundation.MediaQuery.current };
	        this.isMobile = mobileSniff();
	
	        this.$anchor = $('[data-open="' + this.id + '"]').length ? $('[data-open="' + this.id + '"]') : $('[data-toggle="' + this.id + '"]');
	        this.$anchor.attr({
	          'aria-controls': this.id,
	          'aria-haspopup': true,
	          'tabindex': 0
	        });
	
	        if (this.options.fullScreen || this.$element.hasClass('full')) {
	          this.options.fullScreen = true;
	          this.options.overlay = false;
	        }
	        if (this.options.overlay && !this.$overlay) {
	          this.$overlay = this._makeOverlay(this.id);
	        }
	
	        this.$element.attr({
	          'role': 'dialog',
	          'aria-hidden': true,
	          'data-yeti-box': this.id,
	          'data-resize': this.id
	        });
	
	        if (this.$overlay) {
	          this.$element.detach().appendTo(this.$overlay);
	        } else {
	          this.$element.detach().appendTo($('body'));
	          this.$element.addClass('without-overlay');
	        }
	        this._events();
	        if (this.options.deepLink && window.location.hash === '#' + this.id) {
	          $(window).one('load.zf.reveal', this.open.bind(this));
	        }
	      }
	
	      /**
	       * Creates an overlay div to display behind the modal.
	       * @private
	       */
	
	    }, {
	      key: '_makeOverlay',
	      value: function _makeOverlay(id) {
	        var $overlay = $('<div></div>').addClass('reveal-overlay').appendTo('body');
	        return $overlay;
	      }
	
	      /**
	       * Updates position of modal
	       * TODO:  Figure out if we actually need to cache these values or if it doesn't matter
	       * @private
	       */
	
	    }, {
	      key: '_updatePosition',
	      value: function _updatePosition() {
	        var width = this.$element.outerWidth();
	        var outerWidth = $(window).width();
	        var height = this.$element.outerHeight();
	        var outerHeight = $(window).height();
	        var left, top;
	        if (this.options.hOffset === 'auto') {
	          left = parseInt((outerWidth - width) / 2, 10);
	        } else {
	          left = parseInt(this.options.hOffset, 10);
	        }
	        if (this.options.vOffset === 'auto') {
	          if (height > outerHeight) {
	            top = parseInt(Math.min(100, outerHeight / 10), 10);
	          } else {
	            top = parseInt((outerHeight - height) / 4, 10);
	          }
	        } else {
	          top = parseInt(this.options.vOffset, 10);
	        }
	        this.$element.css({ top: top + 'px' });
	        // only worry about left if we don't have an overlay or we havea  horizontal offset,
	        // otherwise we're perfectly in the middle
	        if (!this.$overlay || this.options.hOffset !== 'auto') {
	          this.$element.css({ left: left + 'px' });
	          this.$element.css({ margin: '0px' });
	        }
	      }
	
	      /**
	       * Adds event handlers for the modal.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this2 = this;
	
	        var _this = this;
	
	        this.$element.on({
	          'open.zf.trigger': this.open.bind(this),
	          'close.zf.trigger': function (event, $element) {
	            if (event.target === _this.$element[0] || $(event.target).parents('[data-closable]')[0] === $element) {
	              // only close reveal when it's explicitly called
	              return _this2.close.apply(_this2);
	            }
	          },
	          'toggle.zf.trigger': this.toggle.bind(this),
	          'resizeme.zf.trigger': function () {
	            _this._updatePosition();
	          }
	        });
	
	        if (this.$anchor.length) {
	          this.$anchor.on('keydown.zf.reveal', function (e) {
	            if (e.which === 13 || e.which === 32) {
	              e.stopPropagation();
	              e.preventDefault();
	              _this.open();
	            }
	          });
	        }
	
	        if (this.options.closeOnClick && this.options.overlay) {
	          this.$overlay.off('.zf.reveal').on('click.zf.reveal', function (e) {
	            if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target)) {
	              return;
	            }
	            _this.close();
	          });
	        }
	        if (this.options.deepLink) {
	          $(window).on('popstate.zf.reveal:' + this.id, this._handleState.bind(this));
	        }
	      }
	
	      /**
	       * Handles modal methods on back/forward button clicks or any other event that triggers popstate.
	       * @private
	       */
	
	    }, {
	      key: '_handleState',
	      value: function _handleState(e) {
	        if (window.location.hash === '#' + this.id && !this.isActive) {
	          this.open();
	        } else {
	          this.close();
	        }
	      }
	
	      /**
	       * Opens the modal controlled by `this.$anchor`, and closes all others by default.
	       * @function
	       * @fires Reveal#closeme
	       * @fires Reveal#open
	       */
	
	    }, {
	      key: 'open',
	      value: function open() {
	        var _this3 = this;
	
	        if (this.options.deepLink) {
	          var hash = '#' + this.id;
	
	          if (window.history.pushState) {
	            window.history.pushState(null, null, hash);
	          } else {
	            window.location.hash = hash;
	          }
	        }
	
	        this.isActive = true;
	
	        // Make elements invisible, but remove display: none so we can get size and positioning
	        this.$element.css({ 'visibility': 'hidden' }).show().scrollTop(0);
	        if (this.options.overlay) {
	          this.$overlay.css({ 'visibility': 'hidden' }).show();
	        }
	
	        this._updatePosition();
	
	        this.$element.hide().css({ 'visibility': '' });
	
	        if (this.$overlay) {
	          this.$overlay.css({ 'visibility': '' }).hide();
	          if (this.$element.hasClass('fast')) {
	            this.$overlay.addClass('fast');
	          } else if (this.$element.hasClass('slow')) {
	            this.$overlay.addClass('slow');
	          }
	        }
	
	        if (!this.options.multipleOpened) {
	          /**
	           * Fires immediately before the modal opens.
	           * Closes any other modals that are currently open
	           * @event Reveal#closeme
	           */
	          this.$element.trigger('closeme.zf.reveal', this.id);
	        }
	        // Motion UI method of reveal
	        if (this.options.animationIn) {
	          var _this;
	
	          (function () {
	            var afterAnimationFocus = function () {
	              _this.$element.attr({
	                'aria-hidden': false,
	                'tabindex': -1
	              }).focus();
	              console.log('focus');
	            };
	
	            _this = _this3;
	
	            if (_this3.options.overlay) {
	              Foundation.Motion.animateIn(_this3.$overlay, 'fade-in');
	            }
	            Foundation.Motion.animateIn(_this3.$element, _this3.options.animationIn, function () {
	              _this3.focusableElements = Foundation.Keyboard.findFocusable(_this3.$element);
	              afterAnimationFocus();
	            });
	          })();
	        }
	        // jQuery method of reveal
	        else {
	            if (this.options.overlay) {
	              this.$overlay.show(0);
	            }
	            this.$element.show(this.options.showDelay);
	          }
	
	        // handle accessibility
	        this.$element.attr({
	          'aria-hidden': false,
	          'tabindex': -1
	        }).focus();
	
	        /**
	         * Fires when the modal has successfully opened.
	         * @event Reveal#open
	         */
	        this.$element.trigger('open.zf.reveal');
	
	        if (this.isMobile) {
	          this.originalScrollPos = window.pageYOffset;
	          $('html, body').addClass('is-reveal-open');
	        } else {
	          $('body').addClass('is-reveal-open');
	        }
	
	        setTimeout(function () {
	          _this3._extraHandlers();
	        }, 0);
	      }
	
	      /**
	       * Adds extra event handlers for the body and window if necessary.
	       * @private
	       */
	
	    }, {
	      key: '_extraHandlers',
	      value: function _extraHandlers() {
	        var _this = this;
	        this.focusableElements = Foundation.Keyboard.findFocusable(this.$element);
	
	        if (!this.options.overlay && this.options.closeOnClick && !this.options.fullScreen) {
	          $('body').on('click.zf.reveal', function (e) {
	            if (e.target === _this.$element[0] || $.contains(_this.$element[0], e.target)) {
	              return;
	            }
	            _this.close();
	          });
	        }
	
	        if (this.options.closeOnEsc) {
	          $(window).on('keydown.zf.reveal', function (e) {
	            Foundation.Keyboard.handleKey(e, 'Reveal', {
	              close: function () {
	                if (_this.options.closeOnEsc) {
	                  _this.close();
	                  _this.$anchor.focus();
	                }
	              }
	            });
	          });
	        }
	
	        // lock focus within modal while tabbing
	        this.$element.on('keydown.zf.reveal', function (e) {
	          var $target = $(this);
	          // handle keyboard event with keyboard util
	          Foundation.Keyboard.handleKey(e, 'Reveal', {
	            tab_forward: function () {
	              if (_this.$element.find(':focus').is(_this.focusableElements.eq(-1))) {
	                // left modal downwards, setting focus to first element
	                _this.focusableElements.eq(0).focus();
	                return true;
	              }
	              if (_this.focusableElements.length === 0) {
	                // no focusable elements inside the modal at all, prevent tabbing in general
	                return true;
	              }
	            },
	            tab_backward: function () {
	              if (_this.$element.find(':focus').is(_this.focusableElements.eq(0)) || _this.$element.is(':focus')) {
	                // left modal upwards, setting focus to last element
	                _this.focusableElements.eq(-1).focus();
	                return true;
	              }
	              if (_this.focusableElements.length === 0) {
	                // no focusable elements inside the modal at all, prevent tabbing in general
	                return true;
	              }
	            },
	            open: function () {
	              if (_this.$element.find(':focus').is(_this.$element.find('[data-close]'))) {
	                setTimeout(function () {
	                  // set focus back to anchor if close button has been activated
	                  _this.$anchor.focus();
	                }, 1);
	              } else if ($target.is(_this.focusableElements)) {
	                // dont't trigger if acual element has focus (i.e. inputs, links, ...)
	                _this.open();
	              }
	            },
	            close: function () {
	              if (_this.options.closeOnEsc) {
	                _this.close();
	                _this.$anchor.focus();
	              }
	            },
	            handled: function (preventDefault) {
	              if (preventDefault) {
	                e.preventDefault();
	              }
	            }
	          });
	        });
	      }
	
	      /**
	       * Closes the modal.
	       * @function
	       * @fires Reveal#closed
	       */
	
	    }, {
	      key: 'close',
	      value: function close() {
	        if (!this.isActive || !this.$element.is(':visible')) {
	          return false;
	        }
	        var _this = this;
	
	        // Motion UI method of hiding
	        if (this.options.animationOut) {
	          if (this.options.overlay) {
	            Foundation.Motion.animateOut(this.$overlay, 'fade-out', finishUp);
	          } else {
	            finishUp();
	          }
	
	          Foundation.Motion.animateOut(this.$element, this.options.animationOut);
	        }
	        // jQuery method of hiding
	        else {
	            if (this.options.overlay) {
	              this.$overlay.hide(0, finishUp);
	            } else {
	              finishUp();
	            }
	
	            this.$element.hide(this.options.hideDelay);
	          }
	
	        // Conditionals to remove extra event listeners added on open
	        if (this.options.closeOnEsc) {
	          $(window).off('keydown.zf.reveal');
	        }
	
	        if (!this.options.overlay && this.options.closeOnClick) {
	          $('body').off('click.zf.reveal');
	        }
	
	        this.$element.off('keydown.zf.reveal');
	
	        function finishUp() {
	          if (_this.isMobile) {
	            $('html, body').removeClass('is-reveal-open');
	            if (_this.originalScrollPos) {
	              $('body').scrollTop(_this.originalScrollPos);
	              _this.originalScrollPos = null;
	            }
	          } else {
	            $('body').removeClass('is-reveal-open');
	          }
	
	          _this.$element.attr('aria-hidden', true);
	
	          /**
	          * Fires when the modal is done closing.
	          * @event Reveal#closed
	          */
	          _this.$element.trigger('closed.zf.reveal');
	        }
	
	        /**
	        * Resets the modal content
	        * This prevents a running video to keep going in the background
	        */
	        if (this.options.resetOnClose) {
	          this.$element.html(this.$element.html());
	        }
	
	        this.isActive = false;
	        if (_this.options.deepLink) {
	          if (window.history.replaceState) {
	            window.history.replaceState("", document.title, window.location.pathname);
	          } else {
	            window.location.hash = '';
	          }
	        }
	      }
	
	      /**
	       * Toggles the open/closed state of a modal.
	       * @function
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle() {
	        if (this.isActive) {
	          this.close();
	        } else {
	          this.open();
	        }
	      }
	    }, {
	      key: 'destroy',
	
	
	      /**
	       * Destroys an instance of a modal.
	       * @function
	       */
	      value: function destroy() {
	        if (this.options.overlay) {
	          this.$element.appendTo($('body')); // move $element outside of $overlay to prevent error unregisterPlugin()
	          this.$overlay.hide().off().remove();
	        }
	        this.$element.hide().off();
	        this.$anchor.off('.zf');
	        $(window).off('.zf.reveal:' + this.id);
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Reveal;
	  }();
	
	  Reveal.defaults = {
	    /**
	     * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
	     * @option
	     * @example 'slide-in-left'
	     */
	    animationIn: '',
	    /**
	     * Motion-UI class to use for animated elements. If none used, defaults to simple show/hide.
	     * @option
	     * @example 'slide-out-right'
	     */
	    animationOut: '',
	    /**
	     * Time, in ms, to delay the opening of a modal after a click if no animation used.
	     * @option
	     * @example 10
	     */
	    showDelay: 0,
	    /**
	     * Time, in ms, to delay the closing of a modal after a click if no animation used.
	     * @option
	     * @example 10
	     */
	    hideDelay: 0,
	    /**
	     * Allows a click on the body/overlay to close the modal.
	     * @option
	     * @example true
	     */
	    closeOnClick: true,
	    /**
	     * Allows the modal to close if the user presses the `ESCAPE` key.
	     * @option
	     * @example true
	     */
	    closeOnEsc: true,
	    /**
	     * If true, allows multiple modals to be displayed at once.
	     * @option
	     * @example false
	     */
	    multipleOpened: false,
	    /**
	     * Distance, in pixels, the modal should push down from the top of the screen.
	     * @option
	     * @example auto
	     */
	    vOffset: 'auto',
	    /**
	     * Distance, in pixels, the modal should push in from the side of the screen.
	     * @option
	     * @example auto
	     */
	    hOffset: 'auto',
	    /**
	     * Allows the modal to be fullscreen, completely blocking out the rest of the view. JS checks for this as well.
	     * @option
	     * @example false
	     */
	    fullScreen: false,
	    /**
	     * Percentage of screen height the modal should push up from the bottom of the view.
	     * @option
	     * @example 10
	     */
	    btmOffsetPct: 10,
	    /**
	     * Allows the modal to generate an overlay div, which will cover the view when modal opens.
	     * @option
	     * @example true
	     */
	    overlay: true,
	    /**
	     * Allows the modal to remove and reinject markup on close. Should be true if using video elements w/o using provider's api, otherwise, videos will continue to play in the background.
	     * @option
	     * @example false
	     */
	    resetOnClose: false,
	    /**
	     * Allows the modal to alter the url on open/close, and allows the use of the `back` button to close modals. ALSO, allows a modal to auto-maniacally open on page load IF the hash === the modal's user-set id.
	     * @option
	     * @example false
	     */
	    deepLink: false
	  };
	
	  // Window exports
	  Foundation.plugin(Reveal, 'Reveal');
	
	  function iPhoneSniff() {
	    return (/iP(ad|hone|od).*OS/.test(window.navigator.userAgent)
	    );
	  }
	
	  function androidSniff() {
	    return (/Android/.test(window.navigator.userAgent)
	    );
	  }
	
	  function mobileSniff() {
	    return iPhoneSniff() || androidSniff();
	  }
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Slider module.
	   * @module foundation.slider
	   * @requires foundation.util.motion
	   * @requires foundation.util.triggers
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.touch
	   */
	
	  var Slider = function () {
	    /**
	     * Creates a new instance of a drilldown menu.
	     * @class
	     * @param {jQuery} element - jQuery object to make into an accordion menu.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Slider(element, options) {
	      _classCallCheck(this, Slider);
	
	      this.$element = element;
	      this.options = $.extend({}, Slider.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Slider');
	      Foundation.Keyboard.register('Slider', {
	        'ltr': {
	          'ARROW_RIGHT': 'increase',
	          'ARROW_UP': 'increase',
	          'ARROW_DOWN': 'decrease',
	          'ARROW_LEFT': 'decrease',
	          'SHIFT_ARROW_RIGHT': 'increase_fast',
	          'SHIFT_ARROW_UP': 'increase_fast',
	          'SHIFT_ARROW_DOWN': 'decrease_fast',
	          'SHIFT_ARROW_LEFT': 'decrease_fast'
	        },
	        'rtl': {
	          'ARROW_LEFT': 'increase',
	          'ARROW_RIGHT': 'decrease',
	          'SHIFT_ARROW_LEFT': 'increase_fast',
	          'SHIFT_ARROW_RIGHT': 'decrease_fast'
	        }
	      });
	    }
	
	    /**
	     * Initilizes the plugin by reading/setting attributes, creating collections and setting the initial position of the handle(s).
	     * @function
	     * @private
	     */
	
	
	    _createClass(Slider, [{
	      key: '_init',
	      value: function _init() {
	        this.inputs = this.$element.find('input');
	        this.handles = this.$element.find('[data-slider-handle]');
	
	        this.$handle = this.handles.eq(0);
	        this.$input = this.inputs.length ? this.inputs.eq(0) : $('#' + this.$handle.attr('aria-controls'));
	        this.$fill = this.$element.find('[data-slider-fill]').css(this.options.vertical ? 'height' : 'width', 0);
	
	        var isDbl = false,
	            _this = this;
	        if (this.options.disabled || this.$element.hasClass(this.options.disabledClass)) {
	          this.options.disabled = true;
	          this.$element.addClass(this.options.disabledClass);
	        }
	        if (!this.inputs.length) {
	          this.inputs = $().add(this.$input);
	          this.options.binding = true;
	        }
	        this._setInitAttr(0);
	        this._events(this.$handle);
	
	        if (this.handles[1]) {
	          this.options.doubleSided = true;
	          this.$handle2 = this.handles.eq(1);
	          this.$input2 = this.inputs.length > 1 ? this.inputs.eq(1) : $('#' + this.$handle2.attr('aria-controls'));
	
	          if (!this.inputs[1]) {
	            this.inputs = this.inputs.add(this.$input2);
	          }
	          isDbl = true;
	
	          this._setHandlePos(this.$handle, this.options.initialStart, true, function () {
	
	            _this._setHandlePos(_this.$handle2, _this.options.initialEnd, true);
	          });
	          // this.$handle.triggerHandler('click.zf.slider');
	          this._setInitAttr(1);
	          this._events(this.$handle2);
	        }
	
	        if (!isDbl) {
	          this._setHandlePos(this.$handle, this.options.initialStart, true);
	        }
	      }
	
	      /**
	       * Sets the position of the selected handle and fill bar.
	       * @function
	       * @private
	       * @param {jQuery} $hndl - the selected handle to move.
	       * @param {Number} location - floating point between the start and end values of the slider bar.
	       * @param {Function} cb - callback function to fire on completion.
	       * @fires Slider#moved
	       * @fires Slider#changed
	       */
	
	    }, {
	      key: '_setHandlePos',
	      value: function _setHandlePos($hndl, location, noInvert, cb) {
	        // don't move if the slider has been disabled since its initialization
	        if (this.$element.hasClass(this.options.disabledClass)) {
	          return;
	        }
	        //might need to alter that slightly for bars that will have odd number selections.
	        location = parseFloat(location); //on input change events, convert string to number...grumble.
	
	        // prevent slider from running out of bounds, if value exceeds the limits set through options, override the value to min/max
	        if (location < this.options.start) {
	          location = this.options.start;
	        } else if (location > this.options.end) {
	          location = this.options.end;
	        }
	
	        var isDbl = this.options.doubleSided;
	
	        if (isDbl) {
	          //this block is to prevent 2 handles from crossing eachother. Could/should be improved.
	          if (this.handles.index($hndl) === 0) {
	            var h2Val = parseFloat(this.$handle2.attr('aria-valuenow'));
	            location = location >= h2Val ? h2Val - this.options.step : location;
	          } else {
	            var h1Val = parseFloat(this.$handle.attr('aria-valuenow'));
	            location = location <= h1Val ? h1Val + this.options.step : location;
	          }
	        }
	
	        //this is for single-handled vertical sliders, it adjusts the value to account for the slider being "upside-down"
	        //for click and drag events, it's weird due to the scale(-1, 1) css property
	        if (this.options.vertical && !noInvert) {
	          location = this.options.end - location;
	        }
	
	        var _this = this,
	            vert = this.options.vertical,
	            hOrW = vert ? 'height' : 'width',
	            lOrT = vert ? 'top' : 'left',
	            handleDim = $hndl[0].getBoundingClientRect()[hOrW],
	            elemDim = this.$element[0].getBoundingClientRect()[hOrW],
	
	        //percentage of bar min/max value based on click or drag point
	        pctOfBar = percent(location - this.options.start, this.options.end - this.options.start).toFixed(2),
	
	        //number of actual pixels to shift the handle, based on the percentage obtained above
	        pxToMove = (elemDim - handleDim) * pctOfBar,
	
	        //percentage of bar to shift the handle
	        movement = (percent(pxToMove, elemDim) * 100).toFixed(this.options.decimal);
	        //fixing the decimal value for the location number, is passed to other methods as a fixed floating-point value
	        location = parseFloat(location.toFixed(this.options.decimal));
	        // declare empty object for css adjustments, only used with 2 handled-sliders
	        var css = {};
	
	        this._setValues($hndl, location);
	
	        // TODO update to calculate based on values set to respective inputs??
	        if (isDbl) {
	          var isLeftHndl = this.handles.index($hndl) === 0,
	
	          //empty variable, will be used for min-height/width for fill bar
	          dim,
	
	          //percentage w/h of the handle compared to the slider bar
	          handlePct = ~ ~(percent(handleDim, elemDim) * 100);
	          //if left handle, the math is slightly different than if it's the right handle, and the left/top property needs to be changed for the fill bar
	          if (isLeftHndl) {
	            //left or top percentage value to apply to the fill bar.
	            css[lOrT] = movement + '%';
	            //calculate the new min-height/width for the fill bar.
	            dim = parseFloat(this.$handle2[0].style[lOrT]) - movement + handlePct;
	            //this callback is necessary to prevent errors and allow the proper placement and initialization of a 2-handled slider
	            //plus, it means we don't care if 'dim' isNaN on init, it won't be in the future.
	            if (cb && typeof cb === 'function') {
	              cb();
	            } //this is only needed for the initialization of 2 handled sliders
	          } else {
	              //just caching the value of the left/bottom handle's left/top property
	              var handlePos = parseFloat(this.$handle[0].style[lOrT]);
	              //calculate the new min-height/width for the fill bar. Use isNaN to prevent false positives for numbers <= 0
	              //based on the percentage of movement of the handle being manipulated, less the opposing handle's left/top position, plus the percentage w/h of the handle itself
	              dim = movement - (isNaN(handlePos) ? this.options.initialStart / ((this.options.end - this.options.start) / 100) : handlePos) + handlePct;
	            }
	          // assign the min-height/width to our css object
	          css['min-' + hOrW] = dim + '%';
	        }
	
	        this.$element.one('finished.zf.animate', function () {
	          /**
	           * Fires when the handle is done moving.
	           * @event Slider#moved
	           */
	          _this.$element.trigger('moved.zf.slider', [$hndl]);
	        });
	
	        //because we don't know exactly how the handle will be moved, check the amount of time it should take to move.
	        var moveTime = this.$element.data('dragging') ? 1000 / 60 : this.options.moveTime;
	
	        Foundation.Move(moveTime, $hndl, function () {
	          //adjusting the left/top property of the handle, based on the percentage calculated above
	          $hndl.css(lOrT, movement + '%');
	
	          if (!_this.options.doubleSided) {
	            //if single-handled, a simple method to expand the fill bar
	            _this.$fill.css(hOrW, pctOfBar * 100 + '%');
	          } else {
	            //otherwise, use the css object we created above
	            _this.$fill.css(css);
	          }
	        });
	
	        /**
	         * Fires when the value has not been change for a given time.
	         * @event Slider#changed
	         */
	        clearTimeout(_this.timeout);
	        _this.timeout = setTimeout(function () {
	          _this.$element.trigger('changed.zf.slider', [$hndl]);
	        }, _this.options.changedDelay);
	      }
	
	      /**
	       * Sets the initial attribute for the slider element.
	       * @function
	       * @private
	       * @param {Number} idx - index of the current handle/input to use.
	       */
	
	    }, {
	      key: '_setInitAttr',
	      value: function _setInitAttr(idx) {
	        var id = this.inputs.eq(idx).attr('id') || Foundation.GetYoDigits(6, 'slider');
	        this.inputs.eq(idx).attr({
	          'id': id,
	          'max': this.options.end,
	          'min': this.options.start,
	          'step': this.options.step
	        });
	        this.handles.eq(idx).attr({
	          'role': 'slider',
	          'aria-controls': id,
	          'aria-valuemax': this.options.end,
	          'aria-valuemin': this.options.start,
	          'aria-valuenow': idx === 0 ? this.options.initialStart : this.options.initialEnd,
	          'aria-orientation': this.options.vertical ? 'vertical' : 'horizontal',
	          'tabindex': 0
	        });
	      }
	
	      /**
	       * Sets the input and `aria-valuenow` values for the slider element.
	       * @function
	       * @private
	       * @param {jQuery} $handle - the currently selected handle.
	       * @param {Number} val - floating point of the new value.
	       */
	
	    }, {
	      key: '_setValues',
	      value: function _setValues($handle, val) {
	        var idx = this.options.doubleSided ? this.handles.index($handle) : 0;
	        this.inputs.eq(idx).val(val);
	        $handle.attr('aria-valuenow', val);
	      }
	
	      /**
	       * Handles events on the slider element.
	       * Calculates the new location of the current handle.
	       * If there are two handles and the bar was clicked, it determines which handle to move.
	       * @function
	       * @private
	       * @param {Object} e - the `event` object passed from the listener.
	       * @param {jQuery} $handle - the current handle to calculate for, if selected.
	       * @param {Number} val - floating point number for the new value of the slider.
	       * TODO clean this up, there's a lot of repeated code between this and the _setHandlePos fn.
	       */
	
	    }, {
	      key: '_handleEvent',
	      value: function _handleEvent(e, $handle, val) {
	        var value, hasVal;
	        if (!val) {
	          //click or drag events
	          e.preventDefault();
	          var _this = this,
	              vertical = this.options.vertical,
	              param = vertical ? 'height' : 'width',
	              direction = vertical ? 'top' : 'left',
	              eventOffset = vertical ? e.pageY : e.pageX,
	              halfOfHandle = this.$handle[0].getBoundingClientRect()[param] / 2,
	              barDim = this.$element[0].getBoundingClientRect()[param],
	              windowScroll = vertical ? $(window).scrollTop() : $(window).scrollLeft();
	
	          var elemOffset = this.$element.offset()[direction];
	
	          // touch events emulated by the touch util give position relative to screen, add window.scroll to event coordinates...
	          // best way to guess this is simulated is if clientY == pageY
	          if (e.clientY === e.pageY) {
	            eventOffset = eventOffset + windowScroll;
	          }
	          var eventFromBar = eventOffset - elemOffset;
	          var barXY;
	          if (eventFromBar < 0) {
	            barXY = 0;
	          } else if (eventFromBar > barDim) {
	            barXY = barDim;
	          } else {
	            barXY = eventFromBar;
	          }
	          offsetPct = percent(barXY, barDim);
	
	          value = (this.options.end - this.options.start) * offsetPct + this.options.start;
	
	          // turn everything around for RTL, yay math!
	          if (Foundation.rtl() && !this.options.vertical) {
	            value = this.options.end - value;
	          }
	
	          value = _this._adjustValue(null, value);
	          //boolean flag for the setHandlePos fn, specifically for vertical sliders
	          hasVal = false;
	
	          if (!$handle) {
	            //figure out which handle it is, pass it to the next function.
	            var firstHndlPos = absPosition(this.$handle, direction, barXY, param),
	                secndHndlPos = absPosition(this.$handle2, direction, barXY, param);
	            $handle = firstHndlPos <= secndHndlPos ? this.$handle : this.$handle2;
	          }
	        } else {
	          //change event on input
	          value = this._adjustValue(null, val);
	          hasVal = true;
	        }
	
	        this._setHandlePos($handle, value, hasVal);
	      }
	
	      /**
	       * Adjustes value for handle in regard to step value. returns adjusted value
	       * @function
	       * @private
	       * @param {jQuery} $handle - the selected handle.
	       * @param {Number} value - value to adjust. used if $handle is falsy
	       */
	
	    }, {
	      key: '_adjustValue',
	      value: function _adjustValue($handle, value) {
	        var val,
	            step = this.options.step,
	            div = parseFloat(step / 2),
	            left,
	            prev_val,
	            next_val;
	        if (!!$handle) {
	          val = parseFloat($handle.attr('aria-valuenow'));
	        } else {
	          val = value;
	        }
	        left = val % step;
	        prev_val = val - left;
	        next_val = prev_val + step;
	        if (left === 0) {
	          return val;
	        }
	        val = val >= prev_val + div ? next_val : prev_val;
	        return val;
	      }
	
	      /**
	       * Adds event listeners to the slider elements.
	       * @function
	       * @private
	       * @param {jQuery} $handle - the current handle to apply listeners to.
	       */
	
	    }, {
	      key: '_events',
	      value: function _events($handle) {
	        var _this = this,
	            curHandle,
	            timer;
	
	        this.inputs.off('change.zf.slider').on('change.zf.slider', function (e) {
	          var idx = _this.inputs.index($(this));
	          _this._handleEvent(e, _this.handles.eq(idx), $(this).val());
	        });
	
	        if (this.options.clickSelect) {
	          this.$element.off('click.zf.slider').on('click.zf.slider', function (e) {
	            if (_this.$element.data('dragging')) {
	              return false;
	            }
	
	            if (!$(e.target).is('[data-slider-handle]')) {
	              if (_this.options.doubleSided) {
	                _this._handleEvent(e);
	              } else {
	                _this._handleEvent(e, _this.$handle);
	              }
	            }
	          });
	        }
	
	        if (this.options.draggable) {
	          this.handles.addTouch();
	
	          var $body = $('body');
	          $handle.off('mousedown.zf.slider').on('mousedown.zf.slider', function (e) {
	            $handle.addClass('is-dragging');
	            _this.$fill.addClass('is-dragging'); //
	            _this.$element.data('dragging', true);
	
	            curHandle = $(e.currentTarget);
	
	            $body.on('mousemove.zf.slider', function (e) {
	              e.preventDefault();
	              _this._handleEvent(e, curHandle);
	            }).on('mouseup.zf.slider', function (e) {
	              _this._handleEvent(e, curHandle);
	
	              $handle.removeClass('is-dragging');
	              _this.$fill.removeClass('is-dragging');
	              _this.$element.data('dragging', false);
	
	              $body.off('mousemove.zf.slider mouseup.zf.slider');
	            });
	          })
	          // prevent events triggered by touch
	          .on('selectstart.zf.slider touchmove.zf.slider', function (e) {
	            e.preventDefault();
	          });
	        }
	
	        $handle.off('keydown.zf.slider').on('keydown.zf.slider', function (e) {
	          var _$handle = $(this),
	              idx = _this.options.doubleSided ? _this.handles.index(_$handle) : 0,
	              oldValue = parseFloat(_this.inputs.eq(idx).val()),
	              newValue;
	
	          // handle keyboard event with keyboard util
	          Foundation.Keyboard.handleKey(e, 'Slider', {
	            decrease: function () {
	              newValue = oldValue - _this.options.step;
	            },
	            increase: function () {
	              newValue = oldValue + _this.options.step;
	            },
	            decrease_fast: function () {
	              newValue = oldValue - _this.options.step * 10;
	            },
	            increase_fast: function () {
	              newValue = oldValue + _this.options.step * 10;
	            },
	            handled: function () {
	              // only set handle pos when event was handled specially
	              e.preventDefault();
	              _this._setHandlePos(_$handle, newValue, true);
	            }
	          });
	          /*if (newValue) { // if pressed key has special function, update value
	            e.preventDefault();
	            _this._setHandlePos(_$handle, newValue);
	          }*/
	        });
	      }
	
	      /**
	       * Destroys the slider plugin.
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.handles.off('.zf.slider');
	        this.inputs.off('.zf.slider');
	        this.$element.off('.zf.slider');
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Slider;
	  }();
	
	  Slider.defaults = {
	    /**
	     * Minimum value for the slider scale.
	     * @option
	     * @example 0
	     */
	    start: 0,
	    /**
	     * Maximum value for the slider scale.
	     * @option
	     * @example 100
	     */
	    end: 100,
	    /**
	     * Minimum value change per change event.
	     * @option
	     * @example 1
	     */
	    step: 1,
	    /**
	     * Value at which the handle/input *(left handle/first input)* should be set to on initialization.
	     * @option
	     * @example 0
	     */
	    initialStart: 0,
	    /**
	     * Value at which the right handle/second input should be set to on initialization.
	     * @option
	     * @example 100
	     */
	    initialEnd: 100,
	    /**
	     * Allows the input to be located outside the container and visible. Set to by the JS
	     * @option
	     * @example false
	     */
	    binding: false,
	    /**
	     * Allows the user to click/tap on the slider bar to select a value.
	     * @option
	     * @example true
	     */
	    clickSelect: true,
	    /**
	     * Set to true and use the `vertical` class to change alignment to vertical.
	     * @option
	     * @example false
	     */
	    vertical: false,
	    /**
	     * Allows the user to drag the slider handle(s) to select a value.
	     * @option
	     * @example true
	     */
	    draggable: true,
	    /**
	     * Disables the slider and prevents event listeners from being applied. Double checked by JS with `disabledClass`.
	     * @option
	     * @example false
	     */
	    disabled: false,
	    /**
	     * Allows the use of two handles. Double checked by the JS. Changes some logic handling.
	     * @option
	     * @example false
	     */
	    doubleSided: false,
	    /**
	     * Potential future feature.
	     */
	    // steps: 100,
	    /**
	     * Number of decimal places the plugin should go to for floating point precision.
	     * @option
	     * @example 2
	     */
	    decimal: 2,
	    /**
	     * Time delay for dragged elements.
	     */
	    // dragDelay: 0,
	    /**
	     * Time, in ms, to animate the movement of a slider handle if user clicks/taps on the bar. Needs to be manually set if updating the transition time in the Sass settings.
	     * @option
	     * @example 200
	     */
	    moveTime: 200, //update this if changing the transition time in the sass
	    /**
	     * Class applied to disabled sliders.
	     * @option
	     * @example 'disabled'
	     */
	    disabledClass: 'disabled',
	    /**
	     * Will invert the default layout for a vertical<span data-tooltip title="who would do this???"> </span>slider.
	     * @option
	     * @example false
	     */
	    invertVertical: false,
	    /**
	     * Milliseconds before the `changed.zf-slider` event is triggered after value change.
	     * @option
	     * @example 500
	     */
	    changedDelay: 500
	  };
	
	  function percent(frac, num) {
	    return frac / num;
	  }
	  function absPosition($handle, dir, clickPos, param) {
	    return Math.abs($handle.position()[dir] + $handle[param]() / 2 - clickPos);
	  }
	
	  // Window exports
	  Foundation.plugin(Slider, 'Slider');
	}(jQuery);
	
	//*********this is in case we go to static, absolute positions instead of dynamic positioning********
	// this.setSteps(function() {
	//   _this._events();
	//   var initStart = _this.options.positions[_this.options.initialStart - 1] || null;
	//   var initEnd = _this.options.initialEnd ? _this.options.position[_this.options.initialEnd - 1] : null;
	//   if (initStart || initEnd) {
	//     _this._handleEvent(initStart, initEnd);
	//   }
	// });
	
	//***********the other part of absolute positions*************
	// Slider.prototype.setSteps = function(cb) {
	//   var posChange = this.$element.outerWidth() / this.options.steps;
	//   var counter = 0
	//   while(counter < this.options.steps) {
	//     if (counter) {
	//       this.options.positions.push(this.options.positions[counter - 1] + posChange);
	//     } else {
	//       this.options.positions.push(posChange);
	//     }
	//     counter++;
	//   }
	//   cb();
	// };
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Sticky module.
	   * @module foundation.sticky
	   * @requires foundation.util.triggers
	   * @requires foundation.util.mediaQuery
	   */
	
	  var Sticky = function () {
	    /**
	     * Creates a new instance of a sticky thing.
	     * @class
	     * @param {jQuery} element - jQuery object to make sticky.
	     * @param {Object} options - options object passed when creating the element programmatically.
	     */
	
	    function Sticky(element, options) {
	      _classCallCheck(this, Sticky);
	
	      this.$element = element;
	      this.options = $.extend({}, Sticky.defaults, this.$element.data(), options);
	
	      this._init();
	
	      Foundation.registerPlugin(this, 'Sticky');
	    }
	
	    /**
	     * Initializes the sticky element by adding classes, getting/setting dimensions, breakpoints and attributes
	     * @function
	     * @private
	     */
	
	
	    _createClass(Sticky, [{
	      key: '_init',
	      value: function _init() {
	        var $parent = this.$element.parent('[data-sticky-container]'),
	            id = this.$element[0].id || Foundation.GetYoDigits(6, 'sticky'),
	            _this = this;
	
	        if (!$parent.length) {
	          this.wasWrapped = true;
	        }
	        this.$container = $parent.length ? $parent : $(this.options.container).wrapInner(this.$element);
	        this.$container.addClass(this.options.containerClass);
	
	        this.$element.addClass(this.options.stickyClass).attr({ 'data-resize': id });
	
	        this.scrollCount = this.options.checkEvery;
	        this.isStuck = false;
	        $(window).one('load.zf.sticky', function () {
	          if (_this.options.anchor !== '') {
	            _this.$anchor = $('#' + _this.options.anchor);
	          } else {
	            _this._parsePoints();
	          }
	
	          _this._setSizes(function () {
	            _this._calc(false);
	          });
	          _this._events(id.split('-').reverse().join('-'));
	        });
	      }
	
	      /**
	       * If using multiple elements as anchors, calculates the top and bottom pixel values the sticky thing should stick and unstick on.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_parsePoints',
	      value: function _parsePoints() {
	        var top = this.options.topAnchor == "" ? 1 : this.options.topAnchor,
	            btm = this.options.btmAnchor == "" ? document.documentElement.scrollHeight : this.options.btmAnchor,
	            pts = [top, btm],
	            breaks = {};
	        for (var i = 0, len = pts.length; i < len && pts[i]; i++) {
	          var pt;
	          if (typeof pts[i] === 'number') {
	            pt = pts[i];
	          } else {
	            var place = pts[i].split(':'),
	                anchor = $('#' + place[0]);
	
	            pt = anchor.offset().top;
	            if (place[1] && place[1].toLowerCase() === 'bottom') {
	              pt += anchor[0].getBoundingClientRect().height;
	            }
	          }
	          breaks[i] = pt;
	        }
	
	        this.points = breaks;
	        return;
	      }
	
	      /**
	       * Adds event handlers for the scrolling element.
	       * @private
	       * @param {String} id - psuedo-random id for unique scroll event listener.
	       */
	
	    }, {
	      key: '_events',
	      value: function _events(id) {
	        var _this = this,
	            scrollListener = this.scrollListener = 'scroll.zf.' + id;
	        if (this.isOn) {
	          return;
	        }
	        if (this.canStick) {
	          this.isOn = true;
	          $(window).off(scrollListener).on(scrollListener, function (e) {
	            if (_this.scrollCount === 0) {
	              _this.scrollCount = _this.options.checkEvery;
	              _this._setSizes(function () {
	                _this._calc(false, window.pageYOffset);
	              });
	            } else {
	              _this.scrollCount--;
	              _this._calc(false, window.pageYOffset);
	            }
	          });
	        }
	
	        this.$element.off('resizeme.zf.trigger').on('resizeme.zf.trigger', function (e, el) {
	          _this._setSizes(function () {
	            _this._calc(false);
	            if (_this.canStick) {
	              if (!_this.isOn) {
	                _this._events(id);
	              }
	            } else if (_this.isOn) {
	              _this._pauseListeners(scrollListener);
	            }
	          });
	        });
	      }
	
	      /**
	       * Removes event handlers for scroll and change events on anchor.
	       * @fires Sticky#pause
	       * @param {String} scrollListener - unique, namespaced scroll listener attached to `window`
	       */
	
	    }, {
	      key: '_pauseListeners',
	      value: function _pauseListeners(scrollListener) {
	        this.isOn = false;
	        $(window).off(scrollListener);
	
	        /**
	         * Fires when the plugin is paused due to resize event shrinking the view.
	         * @event Sticky#pause
	         * @private
	         */
	        this.$element.trigger('pause.zf.sticky');
	      }
	
	      /**
	       * Called on every `scroll` event and on `_init`
	       * fires functions based on booleans and cached values
	       * @param {Boolean} checkSizes - true if plugin should recalculate sizes and breakpoints.
	       * @param {Number} scroll - current scroll position passed from scroll event cb function. If not passed, defaults to `window.pageYOffset`.
	       */
	
	    }, {
	      key: '_calc',
	      value: function _calc(checkSizes, scroll) {
	        if (checkSizes) {
	          this._setSizes();
	        }
	
	        if (!this.canStick) {
	          if (this.isStuck) {
	            this._removeSticky(true);
	          }
	          return false;
	        }
	
	        if (!scroll) {
	          scroll = window.pageYOffset;
	        }
	
	        if (scroll >= this.topPoint) {
	          if (scroll <= this.bottomPoint) {
	            if (!this.isStuck) {
	              this._setSticky();
	            }
	          } else {
	            if (this.isStuck) {
	              this._removeSticky(false);
	            }
	          }
	        } else {
	          if (this.isStuck) {
	            this._removeSticky(true);
	          }
	        }
	      }
	
	      /**
	       * Causes the $element to become stuck.
	       * Adds `position: fixed;`, and helper classes.
	       * @fires Sticky#stuckto
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_setSticky',
	      value: function _setSticky() {
	        var _this = this,
	            stickTo = this.options.stickTo,
	            mrgn = stickTo === 'top' ? 'marginTop' : 'marginBottom',
	            notStuckTo = stickTo === 'top' ? 'bottom' : 'top',
	            css = {};
	
	        css[mrgn] = this.options[mrgn] + 'em';
	        css[stickTo] = 0;
	        css[notStuckTo] = 'auto';
	        css['left'] = this.$container.offset().left + parseInt(window.getComputedStyle(this.$container[0])["padding-left"], 10);
	        this.isStuck = true;
	        this.$element.removeClass('is-anchored is-at-' + notStuckTo).addClass('is-stuck is-at-' + stickTo).css(css)
	        /**
	         * Fires when the $element has become `position: fixed;`
	         * Namespaced to `top` or `bottom`, e.g. `sticky.zf.stuckto:top`
	         * @event Sticky#stuckto
	         */
	        .trigger('sticky.zf.stuckto:' + stickTo);
	        this.$element.on("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
	          _this._setSizes();
	        });
	      }
	
	      /**
	       * Causes the $element to become unstuck.
	       * Removes `position: fixed;`, and helper classes.
	       * Adds other helper classes.
	       * @param {Boolean} isTop - tells the function if the $element should anchor to the top or bottom of its $anchor element.
	       * @fires Sticky#unstuckfrom
	       * @private
	       */
	
	    }, {
	      key: '_removeSticky',
	      value: function _removeSticky(isTop) {
	        var stickTo = this.options.stickTo,
	            stickToTop = stickTo === 'top',
	            css = {},
	            anchorPt = (this.points ? this.points[1] - this.points[0] : this.anchorHeight) - this.elemHeight,
	            mrgn = stickToTop ? 'marginTop' : 'marginBottom',
	            notStuckTo = stickToTop ? 'bottom' : 'top',
	            topOrBottom = isTop ? 'top' : 'bottom';
	
	        css[mrgn] = 0;
	
	        css['bottom'] = 'auto';
	        if (isTop) {
	          css['top'] = 0;
	        } else {
	          css['top'] = anchorPt;
	        }
	
	        css['left'] = '';
	        this.isStuck = false;
	        this.$element.removeClass('is-stuck is-at-' + stickTo).addClass('is-anchored is-at-' + topOrBottom).css(css)
	        /**
	         * Fires when the $element has become anchored.
	         * Namespaced to `top` or `bottom`, e.g. `sticky.zf.unstuckfrom:bottom`
	         * @event Sticky#unstuckfrom
	         */
	        .trigger('sticky.zf.unstuckfrom:' + topOrBottom);
	      }
	
	      /**
	       * Sets the $element and $container sizes for plugin.
	       * Calls `_setBreakPoints`.
	       * @param {Function} cb - optional callback function to fire on completion of `_setBreakPoints`.
	       * @private
	       */
	
	    }, {
	      key: '_setSizes',
	      value: function _setSizes(cb) {
	        this.canStick = Foundation.MediaQuery.atLeast(this.options.stickyOn);
	        if (!this.canStick) {
	          cb();
	        }
	        var _this = this,
	            newElemWidth = this.$container[0].getBoundingClientRect().width,
	            comp = window.getComputedStyle(this.$container[0]),
	            pdng = parseInt(comp['padding-right'], 10);
	
	        if (this.$anchor && this.$anchor.length) {
	          this.anchorHeight = this.$anchor[0].getBoundingClientRect().height;
	        } else {
	          this._parsePoints();
	        }
	
	        this.$element.css({
	          'max-width': newElemWidth - pdng + 'px'
	        });
	
	        var newContainerHeight = this.$element[0].getBoundingClientRect().height || this.containerHeight;
	        if (this.$element.css("display") == "none") {
	          newContainerHeight = 0;
	        }
	        this.containerHeight = newContainerHeight;
	        this.$container.css({
	          height: newContainerHeight
	        });
	        this.elemHeight = newContainerHeight;
	
	        if (this.isStuck) {
	          this.$element.css({ "left": this.$container.offset().left + parseInt(comp['padding-left'], 10) });
	        }
	
	        this._setBreakPoints(newContainerHeight, function () {
	          if (cb) {
	            cb();
	          }
	        });
	      }
	
	      /**
	       * Sets the upper and lower breakpoints for the element to become sticky/unsticky.
	       * @param {Number} elemHeight - px value for sticky.$element height, calculated by `_setSizes`.
	       * @param {Function} cb - optional callback function to be called on completion.
	       * @private
	       */
	
	    }, {
	      key: '_setBreakPoints',
	      value: function _setBreakPoints(elemHeight, cb) {
	        if (!this.canStick) {
	          if (cb) {
	            cb();
	          } else {
	            return false;
	          }
	        }
	        var mTop = emCalc(this.options.marginTop),
	            mBtm = emCalc(this.options.marginBottom),
	            topPoint = this.points ? this.points[0] : this.$anchor.offset().top,
	            bottomPoint = this.points ? this.points[1] : topPoint + this.anchorHeight,
	
	        // topPoint = this.$anchor.offset().top || this.points[0],
	        // bottomPoint = topPoint + this.anchorHeight || this.points[1],
	        winHeight = window.innerHeight;
	
	        if (this.options.stickTo === 'top') {
	          topPoint -= mTop;
	          bottomPoint -= elemHeight + mTop;
	        } else if (this.options.stickTo === 'bottom') {
	          topPoint -= winHeight - (elemHeight + mBtm);
	          bottomPoint -= winHeight - mBtm;
	        } else {
	          //this would be the stickTo: both option... tricky
	        }
	
	        this.topPoint = topPoint;
	        this.bottomPoint = bottomPoint;
	
	        if (cb) {
	          cb();
	        }
	      }
	
	      /**
	       * Destroys the current sticky element.
	       * Resets the element to the top position first.
	       * Removes event listeners, JS-added css properties and classes, and unwraps the $element if the JS added the $container.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this._removeSticky(true);
	
	        this.$element.removeClass(this.options.stickyClass + ' is-anchored is-at-top').css({
	          height: '',
	          top: '',
	          bottom: '',
	          'max-width': ''
	        }).off('resizeme.zf.trigger');
	        if (this.$anchor && this.$anchor.length) {
	          this.$anchor.off('change.zf.sticky');
	        }
	        $(window).off(this.scrollListener);
	
	        if (this.wasWrapped) {
	          this.$element.unwrap();
	        } else {
	          this.$container.removeClass(this.options.containerClass).css({
	            height: ''
	          });
	        }
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Sticky;
	  }();
	
	  Sticky.defaults = {
	    /**
	     * Customizable container template. Add your own classes for styling and sizing.
	     * @option
	     * @example '&lt;div data-sticky-container class="small-6 columns"&gt;&lt;/div&gt;'
	     */
	    container: '<div data-sticky-container></div>',
	    /**
	     * Location in the view the element sticks to.
	     * @option
	     * @example 'top'
	     */
	    stickTo: 'top',
	    /**
	     * If anchored to a single element, the id of that element.
	     * @option
	     * @example 'exampleId'
	     */
	    anchor: '',
	    /**
	     * If using more than one element as anchor points, the id of the top anchor.
	     * @option
	     * @example 'exampleId:top'
	     */
	    topAnchor: '',
	    /**
	     * If using more than one element as anchor points, the id of the bottom anchor.
	     * @option
	     * @example 'exampleId:bottom'
	     */
	    btmAnchor: '',
	    /**
	     * Margin, in `em`'s to apply to the top of the element when it becomes sticky.
	     * @option
	     * @example 1
	     */
	    marginTop: 1,
	    /**
	     * Margin, in `em`'s to apply to the bottom of the element when it becomes sticky.
	     * @option
	     * @example 1
	     */
	    marginBottom: 1,
	    /**
	     * Breakpoint string that is the minimum screen size an element should become sticky.
	     * @option
	     * @example 'medium'
	     */
	    stickyOn: 'medium',
	    /**
	     * Class applied to sticky element, and removed on destruction. Foundation defaults to `sticky`.
	     * @option
	     * @example 'sticky'
	     */
	    stickyClass: 'sticky',
	    /**
	     * Class applied to sticky container. Foundation defaults to `sticky-container`.
	     * @option
	     * @example 'sticky-container'
	     */
	    containerClass: 'sticky-container',
	    /**
	     * Number of scroll events between the plugin's recalculating sticky points. Setting it to `0` will cause it to recalc every scroll event, setting it to `-1` will prevent recalc on scroll.
	     * @option
	     * @example 50
	     */
	    checkEvery: -1
	  };
	
	  /**
	   * Helper function to calculate em values
	   * @param Number {em} - number of em's to calculate into pixels
	   */
	  function emCalc(em) {
	    return parseInt(window.getComputedStyle(document.body, null).fontSize, 10) * em;
	  }
	
	  // Window exports
	  Foundation.plugin(Sticky, 'Sticky');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Tabs module.
	   * @module foundation.tabs
	   * @requires foundation.util.keyboard
	   * @requires foundation.util.timerAndImageLoader if tabs contain images
	   */
	
	  var Tabs = function () {
	    /**
	     * Creates a new instance of tabs.
	     * @class
	     * @fires Tabs#init
	     * @param {jQuery} element - jQuery object to make into tabs.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Tabs(element, options) {
	      _classCallCheck(this, Tabs);
	
	      this.$element = element;
	      this.options = $.extend({}, Tabs.defaults, this.$element.data(), options);
	
	      this._init();
	      Foundation.registerPlugin(this, 'Tabs');
	      Foundation.Keyboard.register('Tabs', {
	        'ENTER': 'open',
	        'SPACE': 'open',
	        'ARROW_RIGHT': 'next',
	        'ARROW_UP': 'previous',
	        'ARROW_DOWN': 'next',
	        'ARROW_LEFT': 'previous'
	        // 'TAB': 'next',
	        // 'SHIFT_TAB': 'previous'
	      });
	    }
	
	    /**
	     * Initializes the tabs by showing and focusing (if autoFocus=true) the preset active tab.
	     * @private
	     */
	
	
	    _createClass(Tabs, [{
	      key: '_init',
	      value: function _init() {
	        var _this = this;
	
	        this.$tabTitles = this.$element.find('.' + this.options.linkClass);
	        this.$tabContent = $('[data-tabs-content="' + this.$element[0].id + '"]');
	
	        this.$tabTitles.each(function () {
	          var $elem = $(this),
	              $link = $elem.find('a'),
	              isActive = $elem.hasClass('is-active'),
	              hash = $link[0].hash.slice(1),
	              linkId = $link[0].id ? $link[0].id : hash + '-label',
	              $tabContent = $('#' + hash);
	
	          $elem.attr({ 'role': 'presentation' });
	
	          $link.attr({
	            'role': 'tab',
	            'aria-controls': hash,
	            'aria-selected': isActive,
	            'id': linkId
	          });
	
	          $tabContent.attr({
	            'role': 'tabpanel',
	            'aria-hidden': !isActive,
	            'aria-labelledby': linkId
	          });
	
	          if (isActive && _this.options.autoFocus) {
	            $link.focus();
	          }
	        });
	
	        if (this.options.matchHeight) {
	          var $images = this.$tabContent.find('img');
	
	          if ($images.length) {
	            Foundation.onImagesLoaded($images, this._setHeight.bind(this));
	          } else {
	            this._setHeight();
	          }
	        }
	
	        this._events();
	      }
	
	      /**
	       * Adds event handlers for items within the tabs.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        this._addKeyHandler();
	        this._addClickHandler();
	        this._setHeightMqHandler = null;
	
	        if (this.options.matchHeight) {
	          this._setHeightMqHandler = this._setHeight.bind(this);
	
	          $(window).on('changed.zf.mediaquery', this._setHeightMqHandler);
	        }
	      }
	
	      /**
	       * Adds click handlers for items within the tabs.
	       * @private
	       */
	
	    }, {
	      key: '_addClickHandler',
	      value: function _addClickHandler() {
	        var _this = this;
	
	        this.$element.off('click.zf.tabs').on('click.zf.tabs', '.' + this.options.linkClass, function (e) {
	          e.preventDefault();
	          e.stopPropagation();
	          if ($(this).hasClass('is-active')) {
	            return;
	          }
	          _this._handleTabChange($(this));
	        });
	      }
	
	      /**
	       * Adds keyboard event handlers for items within the tabs.
	       * @private
	       */
	
	    }, {
	      key: '_addKeyHandler',
	      value: function _addKeyHandler() {
	        var _this = this;
	        var $firstTab = _this.$element.find('li:first-of-type');
	        var $lastTab = _this.$element.find('li:last-of-type');
	
	        this.$tabTitles.off('keydown.zf.tabs').on('keydown.zf.tabs', function (e) {
	          if (e.which === 9) return;
	
	          var $element = $(this),
	              $elements = $element.parent('ul').children('li'),
	              $prevElement,
	              $nextElement;
	
	          $elements.each(function (i) {
	            if ($(this).is($element)) {
	              if (_this.options.wrapOnKeys) {
	                $prevElement = i === 0 ? $elements.last() : $elements.eq(i - 1);
	                $nextElement = i === $elements.length - 1 ? $elements.first() : $elements.eq(i + 1);
	              } else {
	                $prevElement = $elements.eq(Math.max(0, i - 1));
	                $nextElement = $elements.eq(Math.min(i + 1, $elements.length - 1));
	              }
	              return;
	            }
	          });
	
	          // handle keyboard event with keyboard util
	          Foundation.Keyboard.handleKey(e, 'Tabs', {
	            open: function () {
	              $element.find('[role="tab"]').focus();
	              _this._handleTabChange($element);
	            },
	            previous: function () {
	              $prevElement.find('[role="tab"]').focus();
	              _this._handleTabChange($prevElement);
	            },
	            next: function () {
	              $nextElement.find('[role="tab"]').focus();
	              _this._handleTabChange($nextElement);
	            },
	            handled: function () {
	              e.stopPropagation();
	              e.preventDefault();
	            }
	          });
	        });
	      }
	
	      /**
	       * Opens the tab `$targetContent` defined by `$target`.
	       * @param {jQuery} $target - Tab to open.
	       * @fires Tabs#change
	       * @function
	       */
	
	    }, {
	      key: '_handleTabChange',
	      value: function _handleTabChange($target) {
	        var $tabLink = $target.find('[role="tab"]'),
	            hash = $tabLink[0].hash,
	            $targetContent = this.$tabContent.find(hash),
	            $oldTab = this.$element.find('.' + this.options.linkClass + '.is-active').removeClass('is-active').find('[role="tab"]').attr({ 'aria-selected': 'false' });
	
	        $('#' + $oldTab.attr('aria-controls')).removeClass('is-active').attr({ 'aria-hidden': 'true' });
	
	        $target.addClass('is-active');
	
	        $tabLink.attr({ 'aria-selected': 'true' });
	
	        $targetContent.addClass('is-active').attr({ 'aria-hidden': 'false' });
	
	        /**
	         * Fires when the plugin has successfully changed tabs.
	         * @event Tabs#change
	         */
	        this.$element.trigger('change.zf.tabs', [$target]);
	      }
	
	      /**
	       * Public method for selecting a content pane to display.
	       * @param {jQuery | String} elem - jQuery object or string of the id of the pane to display.
	       * @function
	       */
	
	    }, {
	      key: 'selectTab',
	      value: function selectTab(elem) {
	        var idStr;
	
	        if (typeof elem === 'object') {
	          idStr = elem[0].id;
	        } else {
	          idStr = elem;
	        }
	
	        if (idStr.indexOf('#') < 0) {
	          idStr = '#' + idStr;
	        }
	
	        var $target = this.$tabTitles.find('[href="' + idStr + '"]').parent('.' + this.options.linkClass);
	
	        this._handleTabChange($target);
	      }
	    }, {
	      key: '_setHeight',
	
	      /**
	       * Sets the height of each panel to the height of the tallest panel.
	       * If enabled in options, gets called on media query change.
	       * If loading content via external source, can be called directly or with _reflow.
	       * @function
	       * @private
	       */
	      value: function _setHeight() {
	        var max = 0;
	        this.$tabContent.find('.' + this.options.panelClass).css('height', '').each(function () {
	          var panel = $(this),
	              isActive = panel.hasClass('is-active');
	
	          if (!isActive) {
	            panel.css({ 'visibility': 'hidden', 'display': 'block' });
	          }
	
	          var temp = this.getBoundingClientRect().height;
	
	          if (!isActive) {
	            panel.css({
	              'visibility': '',
	              'display': ''
	            });
	          }
	
	          max = temp > max ? temp : max;
	        }).css('height', max + 'px');
	      }
	
	      /**
	       * Destroys an instance of an tabs.
	       * @fires Tabs#destroyed
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.find('.' + this.options.linkClass).off('.zf.tabs').hide().end().find('.' + this.options.panelClass).hide();
	
	        if (this.options.matchHeight) {
	          if (this._setHeightMqHandler != null) {
	            $(window).off('changed.zf.mediaquery', this._setHeightMqHandler);
	          }
	        }
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Tabs;
	  }();
	
	  Tabs.defaults = {
	    /**
	     * Allows the window to scroll to content of active pane on load if set to true.
	     * @option
	     * @example false
	     */
	    autoFocus: false,
	
	    /**
	     * Allows keyboard input to 'wrap' around the tab links.
	     * @option
	     * @example true
	     */
	    wrapOnKeys: true,
	
	    /**
	     * Allows the tab content panes to match heights if set to true.
	     * @option
	     * @example false
	     */
	    matchHeight: false,
	
	    /**
	     * Class applied to `li`'s in tab link list.
	     * @option
	     * @example 'tabs-title'
	     */
	    linkClass: 'tabs-title',
	
	    /**
	     * Class applied to the content containers.
	     * @option
	     * @example 'tabs-panel'
	     */
	    panelClass: 'tabs-panel'
	  };
	
	  function checkClass($elem) {
	    return $elem.hasClass('is-active');
	  }
	
	  // Window exports
	  Foundation.plugin(Tabs, 'Tabs');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Toggler module.
	   * @module foundation.toggler
	   * @requires foundation.util.motion
	   * @requires foundation.util.triggers
	   */
	
	  var Toggler = function () {
	    /**
	     * Creates a new instance of Toggler.
	     * @class
	     * @fires Toggler#init
	     * @param {Object} element - jQuery object to add the trigger to.
	     * @param {Object} options - Overrides to the default plugin settings.
	     */
	
	    function Toggler(element, options) {
	      _classCallCheck(this, Toggler);
	
	      this.$element = element;
	      this.options = $.extend({}, Toggler.defaults, element.data(), options);
	      this.className = '';
	
	      this._init();
	      this._events();
	
	      Foundation.registerPlugin(this, 'Toggler');
	    }
	
	    /**
	     * Initializes the Toggler plugin by parsing the toggle class from data-toggler, or animation classes from data-animate.
	     * @function
	     * @private
	     */
	
	
	    _createClass(Toggler, [{
	      key: '_init',
	      value: function _init() {
	        var input;
	        // Parse animation classes if they were set
	        if (this.options.animate) {
	          input = this.options.animate.split(' ');
	
	          this.animationIn = input[0];
	          this.animationOut = input[1] || null;
	        }
	        // Otherwise, parse toggle class
	        else {
	            input = this.$element.data('toggler');
	            // Allow for a . at the beginning of the string
	            this.className = input[0] === '.' ? input.slice(1) : input;
	          }
	
	        // Add ARIA attributes to triggers
	        var id = this.$element[0].id;
	        $('[data-open="' + id + '"], [data-close="' + id + '"], [data-toggle="' + id + '"]').attr('aria-controls', id);
	        // If the target is hidden, add aria-hidden
	        this.$element.attr('aria-expanded', this.$element.is(':hidden') ? false : true);
	      }
	
	      /**
	       * Initializes events for the toggle trigger.
	       * @function
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        this.$element.off('toggle.zf.trigger').on('toggle.zf.trigger', this.toggle.bind(this));
	      }
	
	      /**
	       * Toggles the target class on the target element. An event is fired from the original trigger depending on if the resultant state was "on" or "off".
	       * @function
	       * @fires Toggler#on
	       * @fires Toggler#off
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle() {
	        this[this.options.animate ? '_toggleAnimate' : '_toggleClass']();
	      }
	    }, {
	      key: '_toggleClass',
	      value: function _toggleClass() {
	        this.$element.toggleClass(this.className);
	
	        var isOn = this.$element.hasClass(this.className);
	        if (isOn) {
	          /**
	           * Fires if the target element has the class after a toggle.
	           * @event Toggler#on
	           */
	          this.$element.trigger('on.zf.toggler');
	        } else {
	          /**
	           * Fires if the target element does not have the class after a toggle.
	           * @event Toggler#off
	           */
	          this.$element.trigger('off.zf.toggler');
	        }
	
	        this._updateARIA(isOn);
	      }
	    }, {
	      key: '_toggleAnimate',
	      value: function _toggleAnimate() {
	        var _this = this;
	
	        if (this.$element.is(':hidden')) {
	          Foundation.Motion.animateIn(this.$element, this.animationIn, function () {
	            _this._updateARIA(true);
	            this.trigger('on.zf.toggler');
	          });
	        } else {
	          Foundation.Motion.animateOut(this.$element, this.animationOut, function () {
	            _this._updateARIA(false);
	            this.trigger('off.zf.toggler');
	          });
	        }
	      }
	    }, {
	      key: '_updateARIA',
	      value: function _updateARIA(isOn) {
	        this.$element.attr('aria-expanded', isOn ? true : false);
	      }
	
	      /**
	       * Destroys the instance of Toggler on the element.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.off('.zf.toggler');
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Toggler;
	  }();
	
	  Toggler.defaults = {
	    /**
	     * Tells the plugin if the element should animated when toggled.
	     * @option
	     * @example false
	     */
	    animate: false
	  };
	
	  // Window exports
	  Foundation.plugin(Toggler, 'Toggler');
	}(jQuery);
	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	!function ($) {
	
	  /**
	   * Tooltip module.
	   * @module foundation.tooltip
	   * @requires foundation.util.box
	   * @requires foundation.util.triggers
	   */
	
	  var Tooltip = function () {
	    /**
	     * Creates a new instance of a Tooltip.
	     * @class
	     * @fires Tooltip#init
	     * @param {jQuery} element - jQuery object to attach a tooltip to.
	     * @param {Object} options - object to extend the default configuration.
	     */
	
	    function Tooltip(element, options) {
	      _classCallCheck(this, Tooltip);
	
	      this.$element = element;
	      this.options = $.extend({}, Tooltip.defaults, this.$element.data(), options);
	
	      this.isActive = false;
	      this.isClick = false;
	      this._init();
	
	      Foundation.registerPlugin(this, 'Tooltip');
	    }
	
	    /**
	     * Initializes the tooltip by setting the creating the tip element, adding it's text, setting private variables and setting attributes on the anchor.
	     * @private
	     */
	
	
	    _createClass(Tooltip, [{
	      key: '_init',
	      value: function _init() {
	        var elemId = this.$element.attr('aria-describedby') || Foundation.GetYoDigits(6, 'tooltip');
	
	        this.options.positionClass = this.options.positionClass || this._getPositionClass(this.$element);
	        this.options.tipText = this.options.tipText || this.$element.attr('title');
	        this.template = this.options.template ? $(this.options.template) : this._buildTemplate(elemId);
	
	        this.template.appendTo(document.body).text(this.options.tipText).hide();
	
	        this.$element.attr({
	          'title': '',
	          'aria-describedby': elemId,
	          'data-yeti-box': elemId,
	          'data-toggle': elemId,
	          'data-resize': elemId
	        }).addClass(this.triggerClass);
	
	        //helper variables to track movement on collisions
	        this.usedPositions = [];
	        this.counter = 4;
	        this.classChanged = false;
	
	        this._events();
	      }
	
	      /**
	       * Grabs the current positioning class, if present, and returns the value or an empty string.
	       * @private
	       */
	
	    }, {
	      key: '_getPositionClass',
	      value: function _getPositionClass(element) {
	        if (!element) {
	          return '';
	        }
	        // var position = element.attr('class').match(/top|left|right/g);
	        var position = element[0].className.match(/\b(top|left|right)\b/g);
	        position = position ? position[0] : '';
	        return position;
	      }
	    }, {
	      key: '_buildTemplate',
	
	      /**
	       * builds the tooltip element, adds attributes, and returns the template.
	       * @private
	       */
	      value: function _buildTemplate(id) {
	        var templateClasses = (this.options.tooltipClass + ' ' + this.options.positionClass + ' ' + this.options.templateClasses).trim();
	        var $template = $('<div></div>').addClass(templateClasses).attr({
	          'role': 'tooltip',
	          'aria-hidden': true,
	          'data-is-active': false,
	          'data-is-focus': false,
	          'id': id
	        });
	        return $template;
	      }
	
	      /**
	       * Function that gets called if a collision event is detected.
	       * @param {String} position - positioning class to try
	       * @private
	       */
	
	    }, {
	      key: '_reposition',
	      value: function _reposition(position) {
	        this.usedPositions.push(position ? position : 'bottom');
	
	        //default, try switching to opposite side
	        if (!position && this.usedPositions.indexOf('top') < 0) {
	          this.template.addClass('top');
	        } else if (position === 'top' && this.usedPositions.indexOf('bottom') < 0) {
	          this.template.removeClass(position);
	        } else if (position === 'left' && this.usedPositions.indexOf('right') < 0) {
	          this.template.removeClass(position).addClass('right');
	        } else if (position === 'right' && this.usedPositions.indexOf('left') < 0) {
	          this.template.removeClass(position).addClass('left');
	        }
	
	        //if default change didn't work, try bottom or left first
	        else if (!position && this.usedPositions.indexOf('top') > -1 && this.usedPositions.indexOf('left') < 0) {
	            this.template.addClass('left');
	          } else if (position === 'top' && this.usedPositions.indexOf('bottom') > -1 && this.usedPositions.indexOf('left') < 0) {
	            this.template.removeClass(position).addClass('left');
	          } else if (position === 'left' && this.usedPositions.indexOf('right') > -1 && this.usedPositions.indexOf('bottom') < 0) {
	            this.template.removeClass(position);
	          } else if (position === 'right' && this.usedPositions.indexOf('left') > -1 && this.usedPositions.indexOf('bottom') < 0) {
	            this.template.removeClass(position);
	          }
	          //if nothing cleared, set to bottom
	          else {
	              this.template.removeClass(position);
	            }
	        this.classChanged = true;
	        this.counter--;
	      }
	
	      /**
	       * sets the position class of an element and recursively calls itself until there are no more possible positions to attempt, or the tooltip element is no longer colliding.
	       * if the tooltip is larger than the screen width, default to full width - any user selected margin
	       * @private
	       */
	
	    }, {
	      key: '_setPosition',
	      value: function _setPosition() {
	        var position = this._getPositionClass(this.template),
	            $tipDims = Foundation.Box.GetDimensions(this.template),
	            $anchorDims = Foundation.Box.GetDimensions(this.$element),
	            direction = position === 'left' ? 'left' : position === 'right' ? 'left' : 'top',
	            param = direction === 'top' ? 'height' : 'width',
	            offset = param === 'height' ? this.options.vOffset : this.options.hOffset,
	            _this = this;
	
	        if ($tipDims.width >= $tipDims.windowDims.width || !this.counter && !Foundation.Box.ImNotTouchingYou(this.template)) {
	          this.template.offset(Foundation.Box.GetOffsets(this.template, this.$element, 'center bottom', this.options.vOffset, this.options.hOffset, true)).css({
	            // this.$element.offset(Foundation.GetOffsets(this.template, this.$element, 'center bottom', this.options.vOffset, this.options.hOffset, true)).css({
	            'width': $anchorDims.windowDims.width - this.options.hOffset * 2,
	            'height': 'auto'
	          });
	          return false;
	        }
	
	        this.template.offset(Foundation.Box.GetOffsets(this.template, this.$element, 'center ' + (position || 'bottom'), this.options.vOffset, this.options.hOffset));
	
	        while (!Foundation.Box.ImNotTouchingYou(this.template) && this.counter) {
	          this._reposition(position);
	          this._setPosition();
	        }
	      }
	
	      /**
	       * reveals the tooltip, and fires an event to close any other open tooltips on the page
	       * @fires Tooltip#closeme
	       * @fires Tooltip#show
	       * @function
	       */
	
	    }, {
	      key: 'show',
	      value: function show() {
	        if (this.options.showOn !== 'all' && !Foundation.MediaQuery.atLeast(this.options.showOn)) {
	          // console.error('The screen is too small to display this tooltip');
	          return false;
	        }
	
	        var _this = this;
	        this.template.css('visibility', 'hidden').show();
	        this._setPosition();
	
	        /**
	         * Fires to close all other open tooltips on the page
	         * @event Closeme#tooltip
	         */
	        this.$element.trigger('closeme.zf.tooltip', this.template.attr('id'));
	
	        this.template.attr({
	          'data-is-active': true,
	          'aria-hidden': false
	        });
	        _this.isActive = true;
	        // console.log(this.template);
	        this.template.stop().hide().css('visibility', '').fadeIn(this.options.fadeInDuration, function () {
	          //maybe do stuff?
	        });
	        /**
	         * Fires when the tooltip is shown
	         * @event Tooltip#show
	         */
	        this.$element.trigger('show.zf.tooltip');
	      }
	
	      /**
	       * Hides the current tooltip, and resets the positioning class if it was changed due to collision
	       * @fires Tooltip#hide
	       * @function
	       */
	
	    }, {
	      key: 'hide',
	      value: function hide() {
	        // console.log('hiding', this.$element.data('yeti-box'));
	        var _this = this;
	        this.template.stop().attr({
	          'aria-hidden': true,
	          'data-is-active': false
	        }).fadeOut(this.options.fadeOutDuration, function () {
	          _this.isActive = false;
	          _this.isClick = false;
	          if (_this.classChanged) {
	            _this.template.removeClass(_this._getPositionClass(_this.template)).addClass(_this.options.positionClass);
	
	            _this.usedPositions = [];
	            _this.counter = 4;
	            _this.classChanged = false;
	          }
	        });
	        /**
	         * fires when the tooltip is hidden
	         * @event Tooltip#hide
	         */
	        this.$element.trigger('hide.zf.tooltip');
	      }
	
	      /**
	       * adds event listeners for the tooltip and its anchor
	       * TODO combine some of the listeners like focus and mouseenter, etc.
	       * @private
	       */
	
	    }, {
	      key: '_events',
	      value: function _events() {
	        var _this = this;
	        var $template = this.template;
	        var isFocus = false;
	
	        if (!this.options.disableHover) {
	
	          this.$element.on('mouseenter.zf.tooltip', function (e) {
	            if (!_this.isActive) {
	              _this.timeout = setTimeout(function () {
	                _this.show();
	              }, _this.options.hoverDelay);
	            }
	          }).on('mouseleave.zf.tooltip', function (e) {
	            clearTimeout(_this.timeout);
	            if (!isFocus || _this.isClick && !_this.options.clickOpen) {
	              _this.hide();
	            }
	          });
	        }
	
	        if (this.options.clickOpen) {
	          this.$element.on('mousedown.zf.tooltip', function (e) {
	            e.stopImmediatePropagation();
	            if (_this.isClick) {
	              //_this.hide();
	              // _this.isClick = false;
	            } else {
	                _this.isClick = true;
	                if ((_this.options.disableHover || !_this.$element.attr('tabindex')) && !_this.isActive) {
	                  _this.show();
	                }
	              }
	          });
	        } else {
	          this.$element.on('mousedown.zf.tooltip', function (e) {
	            e.stopImmediatePropagation();
	            _this.isClick = true;
	          });
	        }
	
	        if (!this.options.disableForTouch) {
	          this.$element.on('tap.zf.tooltip touchend.zf.tooltip', function (e) {
	            _this.isActive ? _this.hide() : _this.show();
	          });
	        }
	
	        this.$element.on({
	          // 'toggle.zf.trigger': this.toggle.bind(this),
	          // 'close.zf.trigger': this.hide.bind(this)
	          'close.zf.trigger': this.hide.bind(this)
	        });
	
	        this.$element.on('focus.zf.tooltip', function (e) {
	          isFocus = true;
	          if (_this.isClick) {
	            // If we're not showing open on clicks, we need to pretend a click-launched focus isn't
	            // a real focus, otherwise on hover and come back we get bad behavior
	            if (!_this.options.clickOpen) {
	              isFocus = false;
	            }
	            return false;
	          } else {
	            _this.show();
	          }
	        }).on('focusout.zf.tooltip', function (e) {
	          isFocus = false;
	          _this.isClick = false;
	          _this.hide();
	        }).on('resizeme.zf.trigger', function () {
	          if (_this.isActive) {
	            _this._setPosition();
	          }
	        });
	      }
	
	      /**
	       * adds a toggle method, in addition to the static show() & hide() functions
	       * @function
	       */
	
	    }, {
	      key: 'toggle',
	      value: function toggle() {
	        if (this.isActive) {
	          this.hide();
	        } else {
	          this.show();
	        }
	      }
	
	      /**
	       * Destroys an instance of tooltip, removes template element from the view.
	       * @function
	       */
	
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.$element.attr('title', this.template.text()).off('.zf.trigger .zf.tootip')
	        //  .removeClass('has-tip')
	        .removeAttr('aria-describedby').removeAttr('data-yeti-box').removeAttr('data-toggle').removeAttr('data-resize');
	
	        this.template.remove();
	
	        Foundation.unregisterPlugin(this);
	      }
	    }]);
	
	    return Tooltip;
	  }();
	
	  Tooltip.defaults = {
	    disableForTouch: false,
	    /**
	     * Time, in ms, before a tooltip should open on hover.
	     * @option
	     * @example 200
	     */
	    hoverDelay: 200,
	    /**
	     * Time, in ms, a tooltip should take to fade into view.
	     * @option
	     * @example 150
	     */
	    fadeInDuration: 150,
	    /**
	     * Time, in ms, a tooltip should take to fade out of view.
	     * @option
	     * @example 150
	     */
	    fadeOutDuration: 150,
	    /**
	     * Disables hover events from opening the tooltip if set to true
	     * @option
	     * @example false
	     */
	    disableHover: false,
	    /**
	     * Optional addtional classes to apply to the tooltip template on init.
	     * @option
	     * @example 'my-cool-tip-class'
	     */
	    templateClasses: '',
	    /**
	     * Non-optional class added to tooltip templates. Foundation default is 'tooltip'.
	     * @option
	     * @example 'tooltip'
	     */
	    tooltipClass: 'tooltip',
	    /**
	     * Class applied to the tooltip anchor element.
	     * @option
	     * @example 'has-tip'
	     */
	    triggerClass: 'has-tip',
	    /**
	     * Minimum breakpoint size at which to open the tooltip.
	     * @option
	     * @example 'small'
	     */
	    showOn: 'small',
	    /**
	     * Custom template to be used to generate markup for tooltip.
	     * @option
	     * @example '&lt;div class="tooltip"&gt;&lt;/div&gt;'
	     */
	    template: '',
	    /**
	     * Text displayed in the tooltip template on open.
	     * @option
	     * @example 'Some cool space fact here.'
	     */
	    tipText: '',
	    touchCloseText: 'Tap to close.',
	    /**
	     * Allows the tooltip to remain open if triggered with a click or touch event.
	     * @option
	     * @example true
	     */
	    clickOpen: true,
	    /**
	     * Additional positioning classes, set by the JS
	     * @option
	     * @example 'top'
	     */
	    positionClass: '',
	    /**
	     * Distance, in pixels, the template should push away from the anchor on the Y axis.
	     * @option
	     * @example 10
	     */
	    vOffset: 10,
	    /**
	     * Distance, in pixels, the template should push away from the anchor on the X axis, if aligned to a side.
	     * @option
	     * @example 12
	     */
	    hOffset: 12
	  };
	
	  /**
	   * TODO utilize resize event trigger
	   */
	
	  // Window exports
	  Foundation.plugin(Tooltip, 'Tooltip');
	}(jQuery);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }
]);
//# sourceMappingURL=index.js.map