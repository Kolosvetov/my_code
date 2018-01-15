import 'jquery.inputmask/dist/jquery.inputmask.bundle';
import 'datepicker-js/dist/datepicker';
import $ from 'jquery';
import SelectFx from 'periodicjs.component.selectfx/lib/component.selectfx';
import TAO_JSCrontab from 'component/crontab';

// Контроль "мягкого" поведения кнопок переключения шагов
var _stepButtonStrongBehavior = true;

$(function () {
	// Блокируем работу скрипта для страниц с пользовательскими соглашениями,
	// подгружаемыми через fancybox
	if (0 !== $('.do-not-add-defects').length) {
		return;
	}

	var _today = new Date();
	$.fn.datepicker.dates['ru'] = {
		days: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		daysShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		daysMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthsShort: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'],
		today: "Сегодня",
		clear: "Clear",
		format: "dd.mm.yyyy",
		titleFormat: "MM yyyy",
		weekStart: 1		// Первый день недели - Понедельник
	};
	$('input[name="date"], .date').datepicker({language: 'ru', autoclose: true, endDate: _today});

	// Хак для назначения обработчика Datepicker на добавляемые сценарием поля
	TAO_JSCrontab.addNamed('datePickerRefresh', function () {
		$('input[name="date"], .date').datepicker({language: 'ru', autoclose: true, endDate: _today});
	});

	// $('input[name="phone"], .phone').inputmask("+7 (999) 999 99 99");
	$('input[name="phone"], .phone').inputmask("9{10,15}").data('mask', '^[1-9][0-9]{9,14}$');
	$('.number').inputmask("9{1,10}");
	
	$('main div.form-item').each(function () {
		var $this = $(this);
		if ($this.find('.description').length > 0) {
			$('label', $this).addClass('with-description');
		}
	});
	
	var CustomForms = [];

	$('body .custom-form').each(function () {
		CustomForms.push(new window.CustomForm($(this)));
	});
	StepControll();
	// Файл со сканом чека
	$('.form-item.js-form-type-file [type="file"]').change(function () {
		var input = this, $input = $(this),
			$parent = $input.parent(),
			$label = $('label', $parent),
			$preview = $('.photo-preview', $parent),
			$image = $('img', $preview),
			$delete = $('.photo-preview__delete', $parent),
			reader = null;

		if (!$input.data('title')) {
			$input.data('title', $label.text());
		}

		if (input.files && (0 < input.files.length)) {
			if (!(/\.(gif|jpe?g|png)$/i.test(input.files[0].name))) {
				return alert('Выберите файл изображения');
			}

			$label.empty().append('Файл прикреплен');

			if (window['FileReader']) {
				if (0 == $image.length) {
					$delete = $('<div/>')
						.addClass('photo-preview__delete')
						.on('click', function() {
							$input.val('');
							$input.trigger('change');
						});
					$image = $('<img/>');
					$preview = $('<div>')
						.addClass('photo-preview')
						.append($image, $delete);
					$parent.append($preview);
				}

				reader = new FileReader();
				reader.onload = function(e) {
					$image.attr('src', e.target.result);
					// Пытаемся вернуть панель с кнопками шагов
					setTimeout(function () { ScrollStepPanel(); }, 500);
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
	$('[name="button-step"]').change(function () {
		$('body,html').animate({scrollTop: 0}, 500);
	});

	// Управление ссылками "Удалить" в динамических формах
		// - функция управления показом этих ссылок
	var toggleDelLinks = function($block) {
			var $dels = $('.del_form_line', $block);
			if (1 < $dels.length) {
				$dels.css('display', 'inline-block');
			} else {
				$dels.css('display', 'none');
			}
			$dels.first().css('display', 'none');
		},
		// - функция удаления соответствующего ссылке блока формы
		delFormLine = function() {
			var $table = $(this).parents('.table').first(),
				$block = $table.parent();
			$table.remove();
			toggleDelLinks($block);
			return false;
		};

	// По умолчанию скрываем ссылки удаления для первых строк динамических форм
	$('.table').each(function() {
		$('.del_form_line', $(this)).first().hide();
	});

	// Назначаем обработчик ссылок удаления
	$('.del_form_line').on('click', delFormLine);

	// Назначаем обработчик ссылок добавления строк динамических форм
	$('.add_form_line').on('click', function () {
		var add_button = this, $add_button = $(add_button),
			$block = $($add_button.attr('data-target')),
			$last = $('.table', $block).last(),
			ajax_url = $add_button.attr('data-action') +
							'?count=' + $block.find('.table').length +
							'&without_add_button=true';

		// добавляем параметры для выбора "дизайна" продукта с дефектом
		if ('edit-add-defect' == $add_button.attr('data-drupal-selector')) {
			ajax_url += '&type=' + $('select[name="field_product_cat"] > option:selected').val() +
						'&collection=' + $('select[name="field_kollekcia"] > option:selected').val();
		}

		// запрашиваем сервер для получения фрагмента формы
		$.get(ajax_url, function (data) {
			// добавляем код фрагмента в хвост списка
			$last.after(data);
			// заменяем выпадающие списки на красивые
			$('select', $block).each(function() {
				var select = this, $select = $(select);
				if ($select.parent().hasClass('form-select') === false) {
					new SelectFx(select);
				}
			})
			// назначаем маску ввода датам
			$('.date').inputmask('99.99.9999');
			// цепляемся к обработчикам Drupal
			Drupal.behaviors.states.attach('body');
			// проверяем и выполняем "правила видимости" блоков внутри фрагмента формы
			$('select, input', data).each(function() {
				var control = this, $control = $(control);
				if ($control.attr('data-drupal-states')) {
					var drupal_states = $.parseJSON($control.attr('data-drupal-states')),
						states_keys = Object.keys(drupal_states.visible),
						select = states_keys[0],
						select_markup = $(select).parent(),
						value = select_markup.find('.cs-options li.cs-selected').attr('data-value')
					;
					
					if (!value) {
						value = select_markup.find('.cs-options li:first').attr('data-value');
					}
					
					$(select).trigger({type: 'state:value', value: value});
				}
			});
			// определяем показ ссылок для удаления
			toggleDelLinks($block);
			// назначаем обработчики ссылкам для удаления
			$('.del_form_line', $block).on('click', delFormLine);
		});
		return false;
	});


	// Обработка кнопки "Отказать" в форме решения
	$('#reject').on('click', function () {
		var $comment = $('.saler-comment'),
			$reasons = $('.reject-reasons'),
			reasons_invisible = ('none' === $reasons.css('display')),
			$reason = $('input[type="radio"]:checked', $reasons)
		;

		// выставляем в форме признак отказа
		$('input[name="reject_markup"]').val('true');

		if (0 < $reasons.length) {
			if (reasons_invisible) {
				$('.validation-error').removeClass('validation-error');
				$comment.hide({
					duration: 300,
					queue: true
				});
				$('textarea', $comment).val('');
				if (1 === $reason.length) {
					$reason.get(0).checked = false;
				}
				$reasons.show({
					duration: 300,
					queue: true,
					complete: function () {
						var alert_was_shown = false;
						$('body,html').animate(
							{scrollTop: $reasons.offset().top - 10},
							500,
							'swing',
							function () {
								if (!alert_was_shown) {
									alert('Укажите причину отказа!');
									alert_was_shown = true;
								}
							}
						)
					}
				});
				this.blur();
				return false;
			}
			if (0 === $reason.length) {
				alert('Укажите причину отказа!');
				this.blur();
				return false;
			} else {
				$('textarea', $comment).val(
					$reason.val()
				);
			}
		}

		// запускаем отправку формы
		$(this).parents('form').first().trigger('submit');
	});


	// Обработка кнопки "Отправить" в форме решения
	$('#send').on('click', function () {
		var $comment = $('.saler-comment'),
			$reasons = $('.reject-reasons'),
			reasons_visible = ('none' !== $reasons.css('display')),
			$reason = $('input[type="radio"]:checked', $reasons)
		;

		// выставляем в форме признак отправки
		$('input[name="reject_markup"]').val('false');

		if (0 < $reasons.length) {
			if (reasons_visible) {
				$reasons.hide({
					duration: 300,
					queue: true
				});
				if (1 === $reason.length) {
					$reason.get(0).checked = false;
				}
				$('textarea', $comment).val('');
				$comment.show({
					duration: 300,
					queue: true,
					complete: function () {
						var alert_was_shown = false;
						$('body,html').animate(
							{scrollTop: $comment.offset().top - 10},
							500,
							'swing',
							function () {
								if (!alert_was_shown) {
									alert('Укажите комментарий!');
									alert_was_shown = true;
								}
							}
						)
					}
				});
				this.blur();
				return false;
			}
		}

		// запускаем отправку формы
		return true;
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
		$('#place-for-forms').append('<div class="defect el-' + (this.count) + '"></div>');
		this.defect = $('#place-for-forms .el-' + (this.count));
		this.LoadDefectList();
	};
	DefectObject.prototype.LoadDefectList = function () {
		var DObject = this,
			product_cat = '',
			$cat_select = $('select[name=product_cat]'),
			oi = 0, ol = 0
		;
		if (0 < $cat_select.length) {
			ol = $cat_select[0].options.length;
			for (oi = 0; oi < ol; oi++) {
				if ($cat_select[0].options[oi].selected) {
					product_cat = $cat_select[0].options[oi].value;
					break;
				}
			}
		}
		$.ajax({
			type: "POST",
			url: "/index_dev.php/ajax/get_defect_list",
			data: ({count: DObject.count, category: product_cat}),
			success: function (msg) {
				DObject.defect.append(msg);
				DObject.BindEvents();
			}
		});
	};
	DefectObject.prototype.LoadDefectForm = function () {
		var DObject = this,
			$state_select = $('select[name=product_state]'),
			$defect_select = $('select[name="defect_type[' + DObject.count.toString() + ']"]'),
			product_state = '', defect_code = '',
			oi = 0, ol = 0
		;
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

		$.ajax({
			type: "POST",
			url: "/index_dev.php/ajax/get_defect_form",
			data: ({code: defect_code, type: product_state, count: DObject.count}),
			success: function (msg) {
				DObject.defect.find('.form').remove();
				DObject.defect.append('<div class="form" style="float:left; width: 100%;">' + msg + '</div>');
				var CustomForms = [];
				$('body .custom-form:not(.custom-form_processed)').each(function () {
					CustomForms.push(new window.CustomForm($(this)));
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

		$('.del_defect_line').each(function() {
			var $this = $(this);
			if ($this.hasClass('click-assigned')) {
				return;
			}
			$this.on('click', function() {
				$this.parents('.defect').first().remove();
				return false;
			}).addClass('click-assigned');
		});
	};

	$('#add-defect').on('click', function () {
		Defects.push(new DefectObject(Defects.length));
		return false;
	});
	$('#add-defect').click();
	
	// Отправка формы - проверка всех шагов
	$('form').on('submit', function () {
		var $form = $(this);
		// Контроль полей
		if (!(StepValidate($form))) {
			return StepFailure();
		}
		// Контроль изображений
		if (!(StepImageValidate($form))) {
			return StepImageFailure();
		}

		// Включаем "прелоадер"
		$('.b-loading__canvas').removeClass('b-loading__canvas_hidden');
		$('.b-loading').removeClass('b-loading_hidden');
		return true;
	});


	$('.with-loading').on('click', function () {
		$('.b-loading__canvas').removeClass('b-loading__canvas_hidden');
		$('.b-loading').removeClass('b-loading_hidden');
		return true;
	});


	// Работа с переключаемыми блоками
	var TriggeredPanels = {
		list: function ($container) {
			Defects = [];
			$container.find('#place-for-forms').empty();
			$('#add-defect').click();
		},
		empty: function ($container) {
			$container.find('.b-defect-list__item:not(.clone)').remove();
		}
	};
	var processTriggeredPanels = function () {
		var label = '';
		for (label in TriggeredPanels) {
			if (!(TriggeredPanels.hasOwnProperty(label))) {
				continue;
			}
			TriggeredPanels[label]($('#edit-defects-for-' + label));
		}
	};
	$('#edit-product-cat').on('change', processTriggeredPanels);
	$('#edit-product-state').on('change', processTriggeredPanels);


	if ($('.b-steps-panel').length > 0) {
		ScrollStepPanel();
		$(window).scroll(function () {
			ScrollStepPanel();
		});
	}
});


// Позиционирование панели с переключателем шагов
function ScrollStepPanel() {
	var $block = $('.next-step-block:visible').parent(),
		$window = $(window),
		$steps = $('.b-steps-panel'),
		$footer = $('.b-footer'),
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
	var $steps = $('.b-steps-panel');

	// "Кнопки" с номерами шагов
	$('label', $steps).on('click', function(e) {
		var $this = $(this), $step = $('.b-step:visible');

		// Переходить на текущий шаг не надо - мы уже здесь
		if ($('[type=radio]:checked', $steps).attr('id') == $this.attr('for')) {
			return false;
		}

		// Проверка режима срабатывания проверки на "кнопке" шага
		if (_stepButtonStrongBehavior) {
			// Проверка обязательных полей
			if (!(StepValidate($step))) {
				return StepFailure();
			}
			// Проверка изображений
			if (!(StepImageValidate($step))) {
				return StepImageFailure();
			}
		}

		return true;
	});

	// Кнопка "Далее" - просто следующий шаг
	$('.next-step-block .fieldset-wrapper > div:not(.form-cancel):not([id="reject"])').on('click', function (e) {
		var next_step = parseInt($steps.find('[type=radio]:checked').val()) + 1;
		return $('label[for="edit-button-step-' + next_step.toString() + '"]').click();
	});
}

// Проверка полей шага
function StepValidate($step) {
	var has_error = false,
		$reject_markup = $step.find('input[name="reject_markup"]').first()
	;

	// Выбираем все поля
	$step.find('input,select,textarea').each(function () {
		var $this = $(this),
			value = $this.val(),
			vmask = $this.data('mask'),
			_error = false,
			reject_markup_set = (1 === $reject_markup.length) && ('true' === $reject_markup.val())
		;

		// Проверяем только те, что помечены как обязательные
		if (!($this.hasClass('required'))) {
			return;
		}

		// Хак скрытого листбокса для дефектов паркета
		if ($this.hasClass('form-select_wide') &&
			('none' === $this.parents('#edit-defects-for-list').first().css('display'))) {
			return;
		}

		// Хак скрытого поля для типа дефекта
		if (('edit-field-defect-type' == $this.data('drupal-selector')) &&
			('none' === $this.parents('.form-item-field-defect-type').first().css('display'))) {
			return;
		}

		if ($this.data('notmatch') == "true") {
			_error = true;
		}
		// Хак формы решения Магазина или Дистрибьютора на кнопку "Отказать"
		if (reject_markup_set) {
			// Игнорируем то, что не должно быть заполнено
			if ($this.hasClass('no-reject-markup')) {
				return;
			}
		}

		// Проверяем checkbox по отметке
		if (('checkbox' == $this.attr('type')) && !(this.checked)) {
			_error = true;
		} else
		// Проверяем заполнение и соответствие маске, если она есть
		if (('' == value) ||
			(vmask && !(value.match(vmask)))) {
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
	var has_error = false, Image_RE = /\.(gif|jpe?g|png)$/i;

	// Проверяем блоки с изображениями
	$step.find('.with-images').each(function () {
		var $this = $(this), images_count = 0;
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
			var i = 0, l = 0;
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
	var $errors = $('.validation-error:visible'),
		pos = (0 < $errors.length) ? $errors.first().offset() : {top: 0}
	;
	alert('Заполните обязательные поля!');
	$('body,html').animate({scrollTop: Math.max(0, pos.top - 10)}, 500);
	return false;
}

// Сообщение об отсутствующих изображениях
function StepImageFailure() {
	var $images = $('.with-images.no-images:visible'),
		pos = (0 < $images.length) ? $images.first().offset() : {top: 0}
	;
	alert('Загрузите хотя бы одно изображение!');
	$('body,html').animate({scrollTop: Math.max(0, pos.top - 10)}, 500);
	return false;
}

// Пометка поля
function MarkupErrorField(field, add_class) {
	var elem = field[0],
		tag = elem.tagName, type = elem.type, id = elem.id,
		obj = [];

	if ('undefined' == typeof add_class) {
		add_class = true;
	}

	if ('SELECT' == tag) {
		obj = field.parent().find('.cs-placeholder');
	} else if (('INPUT' == tag) && ('checkbox' == type)) {
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
	var CF = this, $videoEl = null;

	CF.PHOTO_FILES = /\.(gif|jpe?g|png)$/i;
	CF.VIDEO_FILES = /\.(3g2|3gpp|asf|avi|divx|f4v|flv|h264|ifo|m2ts|m4v|mkv|mod|mov|mp4|mpe?g|mswmm|mts|mxf|ogv|rm|swf|ts|vep|vob|webm|wlmp|wmv)$/i;
	CF.VIDEO_SIZE_LIMIT = 20 * 1024 * 1024;

	CF.PHOTO_FILES = /\.(gif|jpe?g|png)$/i;
	CF.VALID_FILES = /\.(7z|docx?|ods|odt|pdf|potx?|ppsx?|pptx?|rar|xlsx?|zip)$/i;

	CF.form = obj;
	CF.list = CF.form.find('.list');
	CF.action = CF.list.data('action');
	CF.type = CF.list.data('type');
	CF.items = [];
	CF.list.find('.b-defect-list__item').each(function () {
		CF.events($(this).find('.b-defect-list__delete'), "click", CF.delete);
		CF.events($(this).find('.b-defect-list__edit'), "click", CF.edit);
		CF.items.push($(this));
	})
	CF.list.find('.b-docs__item').each(function () {
		CF.events($(this).find('.b-docs__delete'), "click", CF.delete);
		CF.events($(this).find('.b-docs-list__edit'), "click", CF.edit);
		CF.items.push($(this));
	})
	CF.events(CF.form.find('.add-photo-btn'), "click", CF.addPhoto);
	CF.events(CF.form.find('.add-docs-btn'), "click", CF.addFile);
	CF.events(CF.form.find('.add-video-btn'), "click", CF.addVideo);

	$videoEl = CF.form.find('.b-video__item');
	$videoEl.find('input[type="file"]').on('change', function () {
		var input = this,
			$video = CF.form.find('.b-video__item'),
			$label = CF.form.find('.add-video-btn label')
		;

		if (input.files && (0 < input.files.length)) {
			if (!(CF.VIDEO_FILES.test(input.files[0].name))) {
				return alert('Выберите файл видео');
			}
			if (CF.VIDEO_SIZE_LIMIT < input.files[0].size) {
				return alert('Максимальный размер файла - 20 мегабайт');
			}
			$video.show();
			$label.text('Видео прикреплено');
		} else {
			$video.hide();
			$label.text('Загрузить видео');
		}
		return false;
	});
	CF.items.push($videoEl);
	$videoEl.attr('data-id', CF.items.length);
	CF.list.append($videoEl);

	CF.events(CF.form.find('.b-video__delete'), "click", CF.deleteVideo);
	CF.events(CF.form.find('.b-video__edit'), "click", CF.edit);

	obj.addClass('custom-form_processed');
};

window.CustomForm.prototype.edit = function (CF, el) {
	CF.form.find('[data-id=' + el.parent().data('id') + ']').find('input').click();
};

window.CustomForm.prototype.delete = function (CF, el) {
	CF.form.find('[data-id=' + el.parent().data('id') + ']').remove();
};

window.CustomForm.prototype.deleteVideo = function (CF, el) {
	CF.form.find('.b-video__item input').val('').trigger('change');
};

window.CustomForm.prototype.addPhoto = function (CF, el) {
	var AddEl = CF.form.find('.clone').clone();

	CF.items.push(AddEl);
	CF.events(AddEl.find('.b-defect-list__delete'), "click", CF.delete);
	CF.events(AddEl.find('.b-defect-list__edit'), "click", CF.edit);
	AddEl.attr('data-id', CF.items.length);
	AddEl.removeClass('clone');
	AddEl.find("input").attr('name', AddEl.find("input").attr('name') + "[" + CF.items.length + "]").change(function () {
		var input = this, reader = null,
			$image = $('.b-defect-list__title img', AddEl);
		if (input.files && (0 < input.files.length)) {
			if (!(CF.PHOTO_FILES.test(input.files[0].name))) {
				return alert('Выберите файл изображения');
			}
			if (window['FileReader']) {
				reader = new FileReader();
				reader.onload = function(e) {
					$image.attr('src', e.target.result);
				};
				reader.readAsDataURL(input.files[0]);
			}
		}
		CF.list.append(AddEl);
	});
	AddEl.find("input").click();
};

window.CustomForm.prototype.addVideo = function (CF, el) {
	CF.form.find('.b-video__item input[type="file"]').click();
};

window.CustomForm.prototype.addFile = function (CF, el) {
	var AddEl = CF.form.find('.clone').clone();

	CF.items.push(AddEl);
	CF.events(AddEl.find('.b-docs__delete'), "click", CF.delete);
	CF.events(AddEl.find('.b-docs__edit'), "click", CF.edit);
	AddEl.attr('data-id', CF.items.length);
	AddEl.removeClass('clone');
	AddEl.find("input").attr('name', AddEl.find("input").attr('name') + "[" + CF.items.length + "]").change(function () {
		var input = this,
			$title = $('.b-docs__title', AddEl);
		if (input.files && (0 < input.files.length)) {
			if (!(CF.VALID_FILES.test(input.files[0].name))) {
				return alert('Выберите файл документа');
			}
			$title.html(
				input.files[0].name + ' &mdash; ' + CF.fancySize(input.files[0].size)
			);
		}
		CF.list.append(AddEl);
	});
	AddEl.find("input").click();
};

window.CustomForm.prototype.fancySize = function (size) {
	var units = ['б', 'КБ', 'МБ', 'ГБ', 'ТБ'],
		result_size = size,
		result_unit = 0, unit_limit = units.length - 1;

	while (result_unit < unit_limit) {
		if (1024 > result_size) {
			break;
		}
		result_size /= 1024.0;
		result_unit += 1;
	}

	return Math.round(result_size).toString() + ' ' + units[result_unit];
};

window.CustomForm.prototype.refresh = function () {
};

window.CustomForm.prototype.events = function (El, EventType, Callback) {
	var CF = this;

	switch (EventType) {
		case 'click':
			El.on('click', function () {
				Callback(CF, $(this))
			});
			break;
	}
};
