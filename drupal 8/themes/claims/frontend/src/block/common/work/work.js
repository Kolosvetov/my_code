/* global ymaps */
import $ from 'jquery';
import SelectFx from 'periodicjs.component.selectfx/lib/component.selectfx';
import TAO_JSCrontab from 'component/crontab';
import 'jquery-fancybox/source/js/jquery.fancybox.pack';

$(function () {
	// Блокируем работу скрипта для страниц с пользовательскими соглашениями,
	// подгружаемыми через fancybox
	if (0 !== $('.do-not-add-defects').length) {
		return;
	}

	// Пытаемся зачистить заголовок "всплывающего окна"
	// Код взят из статьи - http://internetdevels.com/blog/creating-popups-in-Drupal-8
	Drupal.behaviors.Crutch = {
		attach: function (context, settings) {
			function strip_tags(input, allowed) {
				allowed = (((allowed || '') + '')
							.toLowerCase()
							.match(/<[a-z][a-z0-9]*>/g) || [])
							.join('');
				var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
					commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
				return input
							.replace(commentsAndPhpTags, '')
							.replace(tags, function ($0, $1) {
								return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
							});
			}

			$(document).bind('ajaxSuccess.Crutch', function () {
				var value = $('.ui-dialog-title');

				if ((0 < value.length) && !(value.hasClass('do-once'))) {
					var $value = $(value),
						text = strip_tags($value.text());
					$value.text(text);
					value.addClass('do-once');
				}
				$(this).unbind('ajaxSuccess.Crutch');
			});
		}
	};

	// Настраиваем показ изображений и соглашений во "всплывающем окне"
	$('.fancybox:not(.fancybox-processed)').each(function () {
		var $this = $(this);
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
				helpers:{
					title:{
						type:'inside'
					}
				}
			});
		}
		$this.addClass('fancybox-processed');
	});

	// Хаки для обновляемых выпадающих списков
	// - Запоминаем SelectFx в списке по ID select'а, чтобы уметь его обновлять
	var selectFxList = [];
	var selectFxInit = function() {
		var select = this,
			$select = $(this),
			select_id = '#' + select.id,
			drupal_selector = $select.data('drupal-selector'),
			scrolled_prefix_list = [
				'product-name',
				'field-kollekcia',
				'field-dizain',
				'select-defect-type'
			], l = 0, i = 0, scrolled_prefix = '';
		
		if ($select.hasClass('selectfx')) {
			return;
		}
		$select.addClass('selectfx');
		selectFxList[select_id] = new SelectFx(select, {onChange: function(val) {
			$select.trigger('change');
			return false;
		}});

		// Назначаем обработчики нажатия на элементы списка, чтобы обновить состояние скрытого select-элемента
		$select.parent().find('.cs-options li').on('click', function () {
			$select.trigger({type: 'state:value', value: $(this).attr('data-value')});
		});
		// Отмечаем изначально выбранный элемент соответствующим стилем
		$select.parent()
			// .find('.cs-options li:nth-child(' + (select.selectedIndex + 1).toString() + ')')
			.find('.cs-options li[data-value="' + $select.val().toString() + '"]')
			.addClass('cs-selected');

		// Делаем список "прокручиваемым", компактным
		l = scrolled_prefix_list.length;
		for (i = 0; i < l; i++) {
			scrolled_prefix = 'edit-' + scrolled_prefix_list[i];
			if (0 === drupal_selector.indexOf(scrolled_prefix)) {
				$('> ul', $select.siblings('div.cs-options')).addClass('scrolled');
			}
		}
	};
	var selectFxReinit = function() {
		var $select = $(this),
			$selectfx = $select.parent();
		$select.detach();
		$select.removeClass('selectfx');
		$selectfx.before($select);
		$selectfx.remove();
		$select.each(selectFxInit);
	};
	var selectFxProcess = function() {
		var selectors = [
				'#product-collection'
			],
			$changed = null,
			l = selectors.length, i = 0,
			unit_selectors = [
				'#edit-product-count-all-ez',
				'#edit-product-count-bad-ez',
				'#edit-field-count-ez'
			], unit_selector = '',
			$units = null, unit = '',
			ul = unit_selectors.length, ui = 0,
			dl = 0, di = 0, dol = 0, doi = 0,
			design_id_prefix = '', design_id = '',
			design_options_json = '', design_options = [],
			$design = null;

		// Обходим список селекторов для проверки изменений
		for (i = 0; i < l; i++) {
			$changed = $(selectors[i] + '.ajax-changed');
			if (0 == $changed.length) {
				continue;
			}
			// Убираем класс, обозначающий изменения
			$changed.removeClass('ajax-changed');
			// Drupal.behaviors.AJAX.attach($changed, window.drupalSettings);
			$('select', $changed).each(selectFxInit);
			// Обрабатываем автоматический выбор единиц измерения количества товара
			if ((unit = $changed.data('product-unit'))) {
				for (ui = 0; ui < ul; ui++) {
					unit_selector = unit_selectors[ui];
					$units = $(unit_selector);
					if (0 == $units.length) {
						continue;
					}
					$units.each(function() {
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
			if ((design_id_prefix = $changed.data('design-id')) &&
				(design_options_json = $changed.data('design-options'))) {
				design_options = JSON.parse(design_options_json);
				dol = design_options.length;
				dl = $('fieldset#edit-formsdefectslist-fieldset').length;
				for (di = 0; di < dl; di++) {
					design_id = '#' + design_id_prefix + '-' + di.toString();
					if (0 == ($design = $(design_id)).length) {
						continue;
					}
					$design.empty();
					for (doi = 0; doi < dol; doi++) {
						$design.append(
							$('<option/>')
								.val(design_options[doi])
								.text(design_options[doi])
						);
					}
					$design.each(selectFxReinit);
				}
			}
		}

	};

	// Делаем "красиво" выпадающим спискам
	$('select').each(selectFxInit);

	// Вывод процентов по статусу
	var showStatusPercentage = function() {
		var $this = $(this),
			$wrapper = $this.parents('.b-claim-item__fields-wrapper'),
			$progressbar = $('.b-claim-item__progressbar-item', $wrapper),
			full = 0, status = 0;
		if (0 < $progressbar.length) {
			full = parseInt($progressbar.parent().width(), 10);
			status = parseInt($progressbar.width(), 10);
			if (0 < full) {
				$this.html(Math.round(status / full * 100).toString() + '%');
			}
		}
	};
	var showMobileStatusPercentage = function() {
		var $this = $(this),
			$wrapper = $this.parents('.b-claim-item__fields-wrapper'),
			$progressbar = $('.b-claim-item__mobile-progressbar-fg', $wrapper),
			full = 0, status = 0;
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
	TAO_JSCrontab.addNamed('selectFxProcess', selectFxProcess);
	// - Вывод статуса в процентах
	TAO_JSCrontab.addNamed('statusPercentage', function () {
		$('.c-status-percentage').each(showStatusPercentage);
		$('.b-claim-item__mobile-progressbar-fg').each(showMobileStatusPercentage);
	});
	// - Разворачивание заявок на "мобильной" версии
	TAO_JSCrontab.addNamed('showMobileDetails', function () {
		$('.b-claim-item__control').each(function () {
			var $this = $(this),
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
	TAO_JSCrontab.start(333);


	// Подстраиваем ширину всплывающего окна Drupal
	var $width = $(window).width();
	if (1000 > $width) {
		$('a[data-dialog-type="modal"]').each(function () {
			var $this = $(this);
			$this.data('dialog-options', {width: $width});
		});
	}

	// Разворачивание и сворачивание меню на "мобильной" версии
	$('.b-nav_mobile__burger').on('click', function () {
		var $burger = $(this),
			$close = $('.b-nav_mobile__close'),
			$menu = $('.b-nav_mobile__menu');
		$menu.addClass('b-nav_mobile__menu_open');
		$burger.hide();
		$close.show();
	});
	$('.b-nav_mobile__close').on('click', function () {
		var $burger = $('.b-nav_mobile__burger'),
			$close = $(this),
			$menu = $('.b-nav_mobile__menu');
		$menu.removeClass('b-nav_mobile__menu_open');
		$close.hide();
		$burger.show();
	});

	$('.form-cancel').on('click', function () {
		location.href = '/';
		return false;
	});


	$("body").bind("DOMSubtreeModified", function (event) {
//		window.Drupal.behaviors.AJAX.attach('body');
		$('select').each(selectFxInit);
		
	});
	FooterReplace();
	$(window).resize(function(){
		FooterReplace();
	})
	
	function init() {
		$('.ya-map').each(function () {
			if ('undefined' !== typeof ymaps['Map']) {
				new YaMaps($(this).attr('id'), ymaps);
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

			obj.myPlacemark.properties
					.set({
						iconCaption: firstGeoObject.properties.get('name'),
						balloonContent: firstGeoObject.properties.get('text')
					});
		});
	};
	YaMaps.prototype.UserAddress = function (firstGeoObject) {
		var obj = this,
			saa = null, street = null, num = null, city = null,
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
		$('input[name="field_c_city"]').val(city);
		$('input[name="field_c_street"]').val(street);
		$('input[name="field_c_home_num"]').val(num);

	};
	YaMaps.prototype.ProductAddress = function (firstGeoObject) {
		var saa = null, city = null,
			region_parts = [], city_index = 0;

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

		$('input[name="product_region"]').val(region_parts.join(', '));
		$('input[name="product_city"]').val(city);
		$('textarea[name="product_address"]').val(firstGeoObject.properties.get('name'));
	};
	ymaps.ready(init);

	// Показ статической карты
	var $showMap = $('.address-map');
	if (0 < $showMap.length) {
		$showMap.each(function() {
			var $this = $(this),
				address = $this.data('address'),
				width = parseInt($this.width(), 10).toString(),
				height = parseInt($this.height(), 10).toString()
			;
			if (address) {
				$.get(
					'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + encodeURIComponent(address),
					null,
					function(data) {
						if (('undefined' === typeof data['response']) ||
							('undefined' === typeof data.response['GeoObjectCollection']) ||
							('undefined' === typeof data.response.GeoObjectCollection['featureMember']) ||
							(0 === data.response.GeoObjectCollection.featureMember.length)) {
							return;
						}
						var coords = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.replace(' ', ',');
						$this.attr(
							'src',
							'https://static-maps.yandex.ru/1.x/?l=map&ll=' + coords + '&z=15&size=' + width + ',' + height + '&pt=' + coords + ',pm2rdl'
						).attr(
							'alt',
							address
						).attr(
							'title',
							address
						);
					},
					'json'
				);
			}
		});
	}
});

function FooterReplace() {
	var $footer = $('footer'),
		$b_footer = $('.b-footer'),
		height = $footer.height();
	if (0 == $b_footer.length) {
		return;
	}
	if ($b_footer.offset().top < ($(window).height() - height)) {
		$footer.addClass('footer--down');
	} else {
		$footer.removeClass('footer--down');
	}
}
