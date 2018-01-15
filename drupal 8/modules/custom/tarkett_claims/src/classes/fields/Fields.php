<?php

namespace Drupal\tarkett_claims\classes\fields;

use Drupal\tarkett_claims\classes\XMLCategories;

class Fields
{

	public function getFields($key, $parms = [])
	{
		$type = !is_array($parms) ? $parms : false;
		$fields = $this->fields($key, $type);
		$fields = $this->get("tarkett_claims.claims_class_processing")->fields_process($key, $fields, $parms);
		return $fields;
	}

	public function fields($key, $form_type = false)
	{
		$categories = new XMLCategories();
		$types = $categories->getTypes();

		$cats = ['' => ''];
		$units = ['' => ''];

		$condition_codes = ['WE','LA'];
		$condition_list = [];

		foreach ($types as $type) {
			$cats[$type['name']] = $type['name'];
			if (!in_array($type['unit'], array_values($units))) {
				$units[$type['unit']] = $type['unit'];
			}
			if (in_array($type['id'], $condition_codes)) {
				if (1 === count($condition_codes)) {
					$condition_list['select[name="product_cat"]'] = [
						'value' => $type['name'],
					];
				} else {
					if (0 < count($condition_list)) {
						$condition_list[] = 'or';
					}
					$condition_list[] = [
						'select[name="product_cat"]' => [
							'value' => $type['name'],
						],
					];
				}
			}
		}

		$reject_reasons = [];
		if ($query = \Drupal::entityQuery('taxonomy_term')) {
			$query->condition('vid', 'reject_reasons');
			$query->sort('weight');
			if (($term_ids = $query->execute()) &&
				($terms = \Drupal\taxonomy\Entity\Term::loadMultiple($term_ids))) {
				foreach ($terms as $term) {
					$name = $term->getName();
					$reject_reasons[$name] = $name;
				}
			}
		}
		$fields = [
			'answer' => [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'b-closeable'],
				'form_name' => [
					"#type" => 'hidden',
					"#default_value" => 'answer',
				],
				'current_node_id' => [
					'#type' => 'hidden',
					'#default_value' => "",
				],
				'answer_fields' => [
					'#type' => 'fieldset',
					'#title' => '',
					'#attributes' => ['class' => ['without-header']],
					'answer_text' => [
						'#type' => 'textarea',
						'#title' => "Укажите причину<br /> отклонения обращения<span>*</span>",
						'#attributes' => ['class' => ['required', 'col-10']],
					],
				],
				'actions' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'without-header next-step-block'],
					'answer_send' => [
						'#type' => 'submit',
						'#value' => "Закрыть обращение",
						'#tag' => "div",
						'#attributes' => ['class' => ['c-button']],
					],
				],
			],
			'consumer_claims_fields' => [
				'#attributes' => ['class' => 'b-closeable'],
				'step-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'b-step step-1 active without-header'],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '1',
							],
						],
					],
				],
				'step-2' => [
					'#type' => 'fieldset',
					'#title' => "Купленный продукт",
					'#attributes' => ['class' => 'b-step step-2 without-header'],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '2',
							]
						]
					],
					'product_info' => [
						'#type' => 'fieldset',
						'#title' => "Купленный продукт",
						'#attributes' => ['class' => ''],
						'product_cat' => [
							'#type' => 'select',
							'#title' => "Категория продукта<span>*</span>",
							'#attributes' => ['class' => ['required']],
							'#options' => $cats,
						],
						'product_count_all_fs' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'product_count_all' => [
								'#type' => 'textfield',
								'#title' => "Купленное<br />количество товара<span>*</span>",
								'#attributes' => ['class' => ['required', 'number']],
							],
							'product_count_all_ez' => [
								'#type' => 'select',
								'#options' => $units,
							],
						],
						'product_name' => [
							'#type' => 'select',
							'#title' => "Коллекция<span>*</span>",
							'#id' => 'edit-product-name',
							'#attributes' => ['class' => ['required']],
						],
						'product_price_fs' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'product_price' => [
								'#type' => 'textfield',
								'#title' => "Стоимость купленного товара<span>*</span>",
								'#attributes' => ['class' => ['required', 'number', 'with-units']],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">руб.</span></div></div>',
							],
						],
						'product_state' => [
							'#type' => 'select',
							'#title' => "Продукт уложен?<span>*</span>",
							'#attributes' => ['class' => ['required']],
							'#options' => [
								0 => "Продукт уложен",
								1 => "Продукт не уложен",
							],
						],
						'product_count_bad_fs' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'product_count_bad' => [
								'#type' => 'textfield',
								'#title' => "Количество<br />товара с дефектом<span>*</span>",
								'#attributes' => ['class' => ['required', 'number']],
							],
							'product_count_bad_ez' => [
								'#type' => 'select',
								'#options' => $units,
							],
						],
						'product_can_show' => [
							'#type' => 'select',
							'#title' => 'Возможно предоставить образец?<span>*</span>',
							'#attributes' => ['class' => ['required']],
							'#options' => [
								0 => "Нет",
								1 => "Да",
							],
						],
					],
					'defect_list' => [
						'#type' => 'fieldset',
						'#title' => "Описание проблемы покупателем<span>*</span>",
						'#attributes' => ['class' => ''],
						'defect_text' => [
							'#type' => 'textarea',
							'#attributes' => ['style' => 'width: 100%;', 'class' => ['required']],
						],
					],
					'defects_for_list' => [
						'#type' => 'container',
						'#html_tag' => 'div',
						'#states' => [
							'visible' => $condition_list,
						],
						'defect_list_fields' => [
							'#type' => 'fieldset',
							'#title' => "Дополнительная информация",
							'#attributes' => ['class' => 'b-col-wide'],
							'defect_text_comments' => [
								'#type' => 'html_tag',
								'#value' => "Пожалуйста, выберите описание случившегося из списка, представленного ниже. В зависимости от Вашего выбора Вам будут предложены дальнейшие варианты вопросов. Обратите внимание, что в зависимости от Вашего выбора список необходимых фотографий будет разным. При этом загрузка фотографий является обязательной. Затем, в случае необходимости, Вы сможете добавить ещё замечания.",
								'#tag' => "div",
								'#attributes' => ['style' => 'font-size:16px;font-weight:400;text-align:center;margin-bottom:26px;line-height:22px;'],
							],
						],
						'defect_insertion' => [
							'#type' => 'inline_template',
							'#template' => "{{claims_draw_defects()}}",
						],
					],
					'defects_for_empty' => [
						'#type' => 'container',
						'#html_tag' => 'div',
						'#states' => [
							'invisible' => $condition_list,
						],
						'defect_list_photos' => [
							'#type' => 'fieldset',
							'#title' => "Дополнительная информация",
							'#attributes' => ['class' => 'b-col-wide'],
							'defect_text_comments' => [
								'#type' => 'html_tag',
								'#value' => 'Пожалуйста, загрузите фотографии, которые помогут понять нам вашу проблему. Фотографии должны давать полное представление о дефекте - например размер(для этого можно приложить линейку), повторяемость дефекта, общий вид. По возможности сфотографируйте штамп Таркетт на обратной стороне продукта, где указана дата и номер партии.',
								'#tag' => "div",
								'#attributes' => ['style' => 'font-size: 16px;font-weight: 400;text-align: center;margin-bottom: 26px;line-height: 22px;'],
							],
						],
						'photo-defect' => [
							'#type' => 'inline_template',
							'#template' => "{{ claims_defects_photo_only('files[photo-defect]') }}",
						],
						'video-defect' => [
							'#type' => 'inline_template',
							'#template' => "{{ claims_defects_video('files[video-defect]') }}",
						],
					],
					'next-step-block-2' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header next-step-block'],
						'cancel-1' => [
							'#type' => 'html_tag',
							'#value' => "Отмена",
							'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
							'#tag' => "div",
						],
						'to_3_step' => [
							'#type' => 'html_tag',
							'#value' => "Далее",
							'#attributes' => ['class' => ['c-button']],
							'#tag' => "div",
						],
					]
				],
				'step-3' => [
					'#type' => 'fieldset',
					'#title' => 'Адрес местонахождения товара<span class="b-with-tooltip tooltip tooltip-' . ($form_type && ('pokupatel' == $form_type) ? 'consumer' : 'common') . '" data-title="Отметьте точку на карте или заполните поля формы."></span>',
					'#attributes' => ['class' => 'b-step step-3'],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '3',
							],
						],
					],
					'product_info' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'with-map without-header'],
						'map' => [
							'#type' => 'inline_template',
							'#template' => '<div class="ya-map" id="ProductAddress"></div>',
						],
						'product_region' => [
							'#type' => 'textfield',
							'#title' => "Регион, область, район",
						],
						'product_city' => [
							'#type' => 'textfield',
							'#title' => "Город, населённый пункт<span>*</span>",
							'#attributes' => ['class' => ['required']],
						],
						'product_address' => [
							'#type' => 'textarea',
							'#title' => "Адрес<span>*</span>",
							'#attributes' => ['class' => ['required']],
							'#placeholder' => "Укажите улицу, дом/корпус, \nквартиру (если необходимо)",
						]
					],
					'agrer_to_process_info' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header'],
						'agree' => [
							'#type' => 'checkbox',
							'#attributes' => ['class' => ['required']],
							'#title' => 'Настоящим я подтверждаю свое согласие на обработку персональных данных.<span>*</span> ' .
										'<a href="/terms-of-use" class="fancybox" data-fancybox-type="iframe" target="_blank">Подробнее</a>'
						],
					],
					'next-step-block-4' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header next-step-block flex--parent--justify-content-center'],
						'cancel' => [
							'#type' => 'html_tag',
							'#value' => "Отмена",
							'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
							'#tag' => "div",
						],
						'send' => [
							'#type' => 'submit',
							'#value' => "Отправить",
							'#tag' => "div",
							'#attributes' => ['class' => ['c-button']],
						],
					],
				],
				'steps-panel' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'b-steps-panel b-steps-panel__floated without-header'],
					'button-step' => [
						'#type' => 'radios',
						'#default_value' => 1,
						'#options' => [
							1 => "<div class='step-num'>1</div><div class='step-title'>Шаг №1. Персональные данные</div>",
							2 => "<div class='step-num'>2</div><div class='step-title'>Шаг №2. Информация о продукте</div>",
							3 => "<div class='step-num'>3</div><div class='step-title'>Шаг №3. Местонахождение товара</div>"
						],
					],
				],
			],
			'consumer_personal_data' => [
				'personal' => [
					'#type' => 'fieldset',
					'#title' => "Персональные данные",
					'field_c_fio' => [
						'#type' => 'textfield',
						'#title' => "ФИО<span>*</span>",
						'#default_value' => "",
						'#attributes' => ['class' => ['required']],
					],
					'field_c_phone' => [
						'#type' => 'textfield',
						'#title' => "Телефон<span>*</span>",
						'#default_value' => "",
						'#attributes' => ['class' => ['required', 'phone']],
					],
					'field_c_email' => [
						'#type' => 'textfield',
						'#title' => "E-mail<span>*</span>",
						'#default_value' => "",
						'#attributes' => ['class' => ['required'], 'data-mask' => '^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'],
					]
				],
				'buy_place_head' => [
					'#type' => 'fieldset',
					'#title' => 'Адрес места покупки<span class="b-with-tooltip tooltip tooltip-' . ($form_type && ('pokupatel' == $form_type) ? 'consumer' : 'common') . '" data-title="Отметьте точку на карте или заполните поля формы."></span>',
					'#attributes' => ['class' => 'without-content'],
				],
				'buy_place' => [
					'#type' => 'fieldset',
					'#title' => "Адрес места покупки",
					'#attributes' => ['class' => 'with-map without-header'],
					'map' => [
						'#type' => 'inline_template',
						'#template' => '<div class="ya-map" id="UserAddress"></div>',
					],
					'field_c_city' => [
						'#type' => 'textfield',
						'#title' => "Город<span>*</span>",
						'#attributes' => ['class' => ['required']],
					],
					'field_c_street' => [
						'#type' => 'textfield',
						'#title' => "Улица<span>*</span>",
						'#attributes' => ['class' => ['required']],
					],
					'field_c_home_num' => [
						'#type' => 'textfield',
						'#title' => "Дом/Корп.<span>*</span>",
						'#attributes' => ['class' => ['required']],
					],
				],
				'market_info' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'without-header'],
					'field_c_market_name' => [
						'#type' => 'textfield',
						'#title' => "Название магазина*",
						'#attributes' => ['class' => ['required']],
					],
					'field_c_check_num' => [
						'#type' => 'textfield',
						'#title' => "Номер чека"
					],
					'field_c_buy_date' => [
						'#type' => 'textfield',
						'#title' => "Дата покупки",
						'#attributes' => ['style' => 'width: 164px;', 'class' => ['date']]
					],
					'field_c_check_photo' => [
						'#type' => 'file',
						'#title' => 'Загрузить скан чека',
					],
				],
			],
			'market_claims_fields' => [
				'#attributes' => ['class' => 'b-closeable'],
				'field_claims_type' => [
					'#type' => 'hidden',
					'#default_value' => '3',
				],
				'step-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'b-step step-1 active without-header'],
				],
				'step-2' => [
					'#type' => 'fieldset',
					'#title' => "Купленный продукт",
					'#attributes' => ['class' => 'b-step step-2 without-header'],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '2',
							]
						]
					],
					'product_info' => [
						'#type' => 'fieldset',
						'#title' => "Купленный продукт",
						'#attributes' => ['class' => ''],
						'product_cat' => [
							'#type' => 'select',
							'#title' => "Категория продукта<span>*</span>",
							'#attributes' => ['class' => ['required']],
							'#options' => $cats,
						],
						'product_count_all_fs' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'product_count_all' => [
								'#type' => 'textfield',
								'#title' => "Купленное<br />количество товара<span>*</span>",
								'#attributes' => ['class' => ['required', 'number']],
							],
							'product_count_all_ez' => [
								'#type' => 'select',
								'#options' => $units,
							],
						],
						'product_name' => [
							'#type' => 'select',
							'#title' => "Коллекция<span>*</span>",
							'#attributes' => ['class' => ['required']],
						],
						'product_price_fs' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'product_price' => [
								'#type' => 'textfield',
								'#title' => "Стоимость купленного товара<span>*</span>",
								'#attributes' => ['class' => ['required', 'number', 'with-units']],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">руб.</span></div></div>',
							],
						],
						'product_can_show' => [
							'#type' => 'select',
							'#title' => 'Возможно предоставить образец?<span>*</span>',
							'#attributes' => ['class' => ['required']],
							'#options' => [
								0 => "Нет",
								1 => "Да",
							],
						],
						'product_count_bad_fs' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'product_count_bad' => [
								'#type' => 'textfield',
								'#title' => "Количество<br /> товара с дефектом<span>*</span>",
								'#attributes' => ['class' => ['required', 'number']],
							],
							'product_count_bad_ez' => [
								'#type' => 'select',
								'#options' => $units,
							],
						],
					],
					'defect_list' => [
						'#type' => 'fieldset',
						'#title' => "Описание проблемы магазином<span>*</span>",
						'#attributes' => ['class' => ''],
						'defect_text' => [
							'#type' => 'textarea',
							'#attributes' => ['style' => 'width: 100%;', 'class' => ['required']],
						],
					],
					'defect_list_fields' => [
						'#type' => 'fieldset',
						'#title' => "Дополнительная информация",
						'#attributes' => ['class' => 'b-col-wide'],
						'defect_text_comments' => [
							'#type' => 'html_tag',
							'#value' => 'Пожалуйста, загрузите фотографии, которые помогут понять нам вашу проблему. Фотографии должны давать полное представление о дефекте - например размер(для этого можно приложить линейку), повторяемость дефекта, общий вид. По возможности сфотографируйте штамп Таркетт на обратной стороне продукта, где указана дата и номер партии.',
							'#tag' => "div",
							'#attributes' => ['style' => 'font-size: 16px;font-weight: 400;text-align: center;margin-bottom: 26px;line-height: 22px;'],
						],
					],
					'photo-defect' => [
						'#type' => 'inline_template',
						'#template' => "{{ claims_defects_photo_only('files[photo-defect]') }}",
					],
					'video-defect' => [
						'#type' => 'inline_template',
						'#template' => "{{ claims_defects_video('files[video-defect]') }}",
					],
					'next-step-block-2' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header next-step-block'],
						'cancel-2' => [
							'#type' => 'html_tag',
							'#value' => "Отмена",
							'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
							'#tag' => "div",
						],
						'to_3_step' => [
							'#type' => 'html_tag',
							'#value' => "Далее",
							'#attributes' => ['class' => ['c-button']],
							'#tag' => "div",
						],
					]
				],
				'step-3' => [
					'#type' => 'fieldset',
					'#title' => 'Адрес местонахождения товара<span class="b-with-tooltip tooltip tooltip-common" data-title="Отметьте точку на карте или заполните поля формы."></span>',
					'#attributes' => ['class' => 'b-step step-3'],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '3',
							],
						],
					],
					'product_info' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'with-map without-header'],
						'map' => [
							'#type' => 'inline_template',
							'#template' => '<div class="ya-map" id="ProductAddress"></div>',
						],
						'product_region' => [
							'#type' => 'textfield',
							'#title' => "Регион, область, район",
						],
						'product_city' => [
							'#type' => 'textfield',
							'#title' => "Город<span>*</span>",
							'#attributes' => ['class' => ['required']],
						],
						'product_address' => [
							'#type' => 'textarea',
							'#title' => 'Адрес<span>*</span>',
							'#attributes' => ['class' => ['required']],
							'#placeholder' => "Укажите улицу, дом/корпус, \nквартиру (если необходимо)",
						]
					],
					'agrer_to_process_info' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header'],
						'agree' => [
							'#type' => 'checkbox',
							'#attributes' => ['class' => ['required']],
							'#title' => 'Настоящим я подтверждаю свое согласие на обработку персональных данных.<span>*</span> ' .
										'<a href="/terms-of-use_shop" class="fancybox" data-fancybox-type="iframe" target="_blank">Подробнее</a>'
						],
					],
					'next-step-block-4' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header next-step-block flex--parent--justify-content-center'],
						'cancel' => [
							'#type' => 'html_tag',
							'#value' => "Отмена",
							'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
							'#tag' => "div",
						],
						'send' => [
							'#type' => 'submit',
							'#value' => "Отправить",
							'#tag' => "div",
							'#attributes' => ['class' => ['c-button']],
						],
					],
				],
				'steps-panel' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'b-steps-panel b-steps-panel__floated without-header'],
					'button-step' => [
						'#type' => 'radios',
						'#default_value' => 1,
						'#options' => [
							1 => "<div class='step-num'>1</div><div class='step-title'>Шаг №1. Персональные данные</div>",
							2 => "<div class='step-num'>2</div><div class='step-title'>Шаг №2. Информация о продукте</div>",
							3 => "<div class='step-num'>3</div><div class='step-title'>Шаг №3. Местонахождение товара</div>"
						],
					],
				],
			],
			'distributor_claims_fields' => [
				'#attributes' => ['class' => 'b-closeable'],
				'field_claims_type' => [
					'#type' => 'hidden',
					'#default_value' => '4',
				],
				'step-0' => [
					'#type' => 'fieldset',
					'#attributes' => ['style' => 'display:none;'],
					'hidden_upload' => [
						'#type' => 'file',
					],
				],
				'step-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['b-step', 'step-1', 'active without-header']],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '1',
							]
						]
					],
				],
				'step-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['b-step', 'step-2', 'active', 'without-header']],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '2',
							]
						]
					],
					'distributor_consumer_info_3' => [
						'#type' => 'fieldset',
						'#title' => 'Информация о продукции',
						'field_product_cat' => [
							'#type' => 'select',
							'#options' => $cats,
							'#title' => 'Категория продукта<span>*</span>',
							'#attributes' => ['class' => ['required']],
						],
						'field_count_ez' => [
							'#type' => 'select',
							'#title' => 'Единицы измерения',
							'#options' => $units,
						],
						'field_kollekcia' => [
							'#type' => 'select',
							'#title' => 'Коллекция<span>*</span>',
							'#id' => 'edit-field-kollekcia',
							'#attributes' => ['class' => ['required']],
						],
					],
					'distributor_consumer_info_4' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header'],
						'field_products_with_defects' => [
							'#type' => 'inline_template',
							'#template' => '<div class="field_products_with_defects">{{claims_defects_list_form(false, 0, "", "")}}</div>',
						],
						'distributor_photo' => [
							'#type' => 'inline_template',
							'#template' => "{{claims_defects_photo('files[distributor]','default','1')}}",
							'#context' => [
								'description' => [
									'Вы можете загрузить фотографии, которые помогут понять нам вашу проблему. Фотографии должны давать полное представление о дефекте - например размер(для этого можно приложить линейку), повторяемость дефекта, общий вид. По возможности сфотографируйте штамп Таркетт на обратной стороне продукта, где указана дата и номер партии.',
								],
							]
						],
						'video-defect' => [
							'#type' => 'inline_template',
							'#template' => "{{ claims_defects_video('files[video-defect]', true) }}",
						],
					],
					'defect_list' => [
						'#type' => 'fieldset',
						'#title' => "Описание проблемы дистрибьютором<span>*</span>",
						'#attributes' => ['class' => ''],
						'defect_text' => [
							'#type' => 'textarea',
							'#attributes' => ['style' => 'width: 100%;', 'class' => ['required']],
						],
						'distributor_docs' => [
							'#type' => 'inline_template',
							'#template' => "{{claims_docs('files[docs]')}}",
						],
					],
					'next-step-block-2' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header next-step-block'],
						'cancel-3' => [
							'#type' => 'html_tag',
							'#value' => "Отмена",
							'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
							'#tag' => "div",
						],
						'to_3_step' => [
							'#type' => 'html_tag',
							'#value' => "Далее",
							'#attributes' => ['class' => ['c-button']],
							'#tag' => "div",
						],
					]
				],
				'step-3' => [
					'#type' => 'fieldset',
					'#title' => 'Адрес местонахождения товара<span class="b-with-tooltip tooltip tooltip-common" data-title="Отметьте точку на карте или заполните поля формы."></span>',
					'#attributes' => ['class' => ['b-step step-3']],
					'#states' => [
						'visible' => [
							'input[name="button-step"]' => [
								'value' => '3',
							],
						],
					],
					'product_info' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => ['with-map', 'without-header']],
						'map' => [
							'#type' => 'inline_template',
							'#template' => '<div class="ya-map" id="ProductAddress"></div>',
						],
						'product_region' => [
							'#type' => 'textfield',
							'#title' => "Регион, область, район",
						],
						'product_city' => [
							'#type' => 'textfield',
							'#title' => "Город<span>*</span>",
							'#attributes' => ['class' => ['required']],
						],
						'product_address' => [
							'#type' => 'textarea',
							'#title' => 'Адрес<span>*</span>',
							'#attributes' => ['class' => ['required']],
							'#placeholder' => "Укажите улицу, дом/корпус, \nквартиру (если необходимо)",
						]
					],
					'agrer_to_process_info' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header'],
						'agree' => [
							'#type' => 'checkbox',
							'#attributes' => ['class' => ['required']],
							'#title' => 'Настоящим я подтверждаю свое согласие на обработку персональных данных.<span>*</span> ' .
										'<a href="/terms-of-use_distributor" class="fancybox" data-fancybox-type="iframe" target="_blank">Подробнее</a>'
						],
					],
					'next-step-block-4' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => ['without-header', 'next-step-block', 'flex--parent--justify-content-center']],
						'cancel' => [
							'#type' => 'html_tag',
							'#value' => "Отмена",
							'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
							'#tag' => "div",
						],
						'send' => [
							'#type' => 'submit',
							'#value' => "Отправить",
							'#tag' => "div",
							'#attributes' => ['class' => ['c-button']],
						],
					],
				],
				'steps-panel' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'b-steps-panel b-steps-panel__floated without-header'],
					'button-step' => [
						'#type' => 'radios',
						'#default_value' => 1,
						'#options' => [
							1 => "<div class='step-num'>1</div><div class='step-title'>Шаг №1. Персональные данные</div>",
							2 => "<div class='step-num'>2</div><div class='step-title'>Шаг №2. Информация о продукте</div>",
							3 => "<div class='step-num'>3</div><div class='step-title'>Шаг №3. Местонахождение товара</div>"
						],
					],
				],
			],
			'consumer_solution_fields' => [
				'#attributes' => ['class' => 'b-closeable'],
				'current_node_id' => [
					'#type' => 'hidden',
					'#default_value' => "",
				],
				'needs_printing' => [
					'#type' => 'hidden',
					'#default_value' => '0',
				],
				'form_name' => [
					"#type" => 'hidden',
					"#default_value" => 'solution',
				],
				'part-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'without-header'],
					'requirement' => [
						'#type' => 'textarea',
						'#title' => "Требование по претензии",
					],
				],
				'part-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'compact-lines']],
					'passport' => [
						'#type' => 'textfield',
						'#title' => "Паспортные данные, серия и номер",
					],
					'date_of_issue' => [
						'#type' => 'textfield',
						'#title' => "Дата выдачи",
						'#attributes' => ['class' => ['date']],
					],
					'c_passport_issueplace' => [
						'#type' => 'textfield',
						'#title' => "Место выдачи",
					],
				],
				'control-block' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'next-step-block', 'compact-lines']],
					'submit' => [
						'#attributes' => ['class' => ['c-button']],
						'#type' => 'submit',
						'#value' => "Сохранить",
						'#$button_type' => 'primary',
					],
					'submit_and_save' => [
						'#attributes' => ['class' => ['c-button'], 'style' => "margin-left:20px;"],
						'#type' => 'submit',
						'#value' => "Сохранить и распечатать претензию",
						'#$button_type' => 'primary',
					],
				],
			],
			'market_solution_fields' => [
				'#type' => 'fieldset',
				'#title' => 'Данные магазина',
				'#attributes' => ['class' => 'b-closeable'],
				'#states' => [
					'visible' => [
						'input[name="button-step"]' => [
							'value' => '4',
						],
					],
				],
				'form_name' => [
					"#type" => 'hidden',
					"#default_value" => 'market',
				],
				'reject_markup' => [
					"#type" => 'hidden',
					"#default_value" => 'false',
				],
				'accept_fieldset' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'padding-bottom-0']],
					'accept' => [
						'#type' => 'checkbox',
						'#title' => 'Настоящим подтверждаем, что данный продукт был приобретен в нашем магазине',
					],
				],
				'market_consumer_info' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'without-header', 'compact-lines'],
					'market_consumer_fio' => [
						'#type' => 'textfield',
						'#title' => 'ФИО контактного лица<span>*</span>',
						'#attributes' => ['class' => ['required']],
						'#default_value' => "",
					],
					'market_consumer_email' => [
						'#type' => 'textfield',
						'#title' => 'E-mail<span>*</span>',
						'#attributes' => ['class' => ['required']],
						'#default_value' => "",
					],
					'market_consumer_phone' => [
						'#type' => 'textfield',
						'#title' => 'Моб. телефон<span>*</span>',
						'#attributes' => ['class' => ['phone', 'required']],
						'#default_value' => "",
					],
				],
				'market_consumer_info_2' => [
					'#type' => 'fieldset',
					'#title' => 'Документы оплаты/поставки:',
					'market_consumer_waybill_torg_12' => [
						'#type' => 'textfield',
						'#title' => 'Накладная ТОРГ&nbsp;12',
						'#attributes' => ['class' => ['number']],
					],
					'market_consumer_waybill_torg_12_date' => [
						'#type' => 'textfield',
						'#title' => 'Дата оформления<br> накладной<span>*</span>',
						'#attributes' => ['class' => ['date', 'required']],
					],
					'market_consumer_invoices' => [
						'#type' => 'textfield',
						'#title' => 'Счет фактура<span>*</span>',
						'#attributes' => ['class' => ['required', 'no-reject-markup', 'number']],
					],
					'market_consumer_invoices_data' => [
						'#type' => 'textfield',
						'#title' => 'Дата оформления<br> счета фактуры<span>*</span>',
						'#attributes' => ['class' => ['date', 'required']],
					],
					'market_consumer_distributor' => [
						'#type' => 'select',
						'#title' => 'Дистрибьютор<span>*</span>',
						'#attributes' => ['class' => ['required', 'no-reject-markup']],
						'#description' => 'Выберите Дистрибьютора, у которого был куплен продукт',
						'#options' => '',
					],
					'current_node_id' => [
						'#type' => 'hidden',
						'#default_value' => "",
					],
				],
				'market_consumer_info_3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'compact-lines', 'saler-comment'], 'style' => 'display:block;'],
					'market_consumer_comments' => [
						'#type' => 'textarea',
						'#title' => 'Комментарий<span>*</span>',
						'#attributes' => ['class' => ['required', 'no-reject-markup', 'col-10']],
					],
				],
				'market_consumer_info_4' => [
					'#type' => 'fieldset',
					'#title' => 'Причина отказа',
					'#attributes' => ['class' => ['with-radios', 'reject-reasons'], 'style' => 'display:none;'],
					'market_consumer_reject_reason' => [
						'#type' => 'radios',
						'#options' => $reject_reasons,
					],
				],
				'next-step-block-4' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'next-step-block', 'compact-lines']],
					'reject' => [
						'#type' => 'html_tag',
						'#value' => 'Отказать',
						'#tag' => 'div',
						'#attributes' => ['class' => ['c-button', 'c-margin-left-30'], 'id' => 'reject'],
					],
					'send' => [
						'#type' => 'submit',
						'#value' => 'Отправить дистрибьютору',
						'#attributes' => ['class' => ['c-button'], 'id' => 'send'],
						'#tag' => "div",
					],
				]
			],
			'distributor_solution_fields' => [
				'#type' => 'fieldset',
				'#title' => 'Ответственное лицо Дистрибьютора',
				'#attributes' => ['class' => 'b-closeable'],
				'#states' => [
					'visible' => [
						'input[name="button-step"]' => [
							'value' => '4',
						],
					],
				],
				'reject_markup' => [
					"#type" => 'hidden',
					"#default_value" => 'false',
				],
				'form_name' => [
					"#type" => 'hidden',
					"#default_value" => 'distributor',
				],
				'current_node_id' => [
					'#type' => 'hidden',
					'#default_value' => "",
				],
				'distributor_consumer_info_1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header']],
					'distributor_consumer_fio' => [
						'#type' => 'textfield',
						'#title' => "ФИО<span>*</span>",
						'#attributes' => ['class' => ['required']],
						'#default_value' => "",
					],
					'distributor_consumer_email' => [
						'#type' => 'textfield',
						'#title' => "E-mail<span>*</span>",
						'#attributes' => ['class' => ['required']],
						'#default_value' => "",
					],
					'distributor_consumer_phone' => [
						'#type' => 'textfield',
						'#title' => "Моб. телефон<span>*</span>",
						'#attributes' => ['class' => ['required', 'phone']],
						'#default_value' => "",
					],
					'd_supply_contract' => [
						'#type' => 'textfield',
						'#title' => "Договор<br /> поставки №",
						'#default_value' => "",
					],
				],
				'distributor_consumer_info_2' => [
					'#type' => 'fieldset',
					'#title' => 'Документы оплаты/поставки',
					'distributor_invoices' => [
						'#type' => 'inline_template',
						'#template' => "<div class='distributor_invoices'>{{claims_invoices_form(false, 0)}}</div>",
					]
				],
				'distributor_consumer_info_5' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'compact-lines', 'saler-comment'], 'style' => 'display:block;'],
					'distributor_consumer_comments' => [
						'#type' => 'textarea',
						'#title' => 'Комментарий<span>*</span>',
						'#attributes' => ['class' => ['required', 'no-reject-markup', 'col-10']],
					],
				],
				'distributor_consumer_info_7' => [
					'#type' => 'fieldset',
					'#title' => 'Причина отказа',
					'#attributes' => ['class' => ['with-radios', 'reject-reasons'], 'style' => 'display:none;'],
					'distributor_consumer_reject_reason' => [
						'#type' => 'radios',
						'#options' => $reject_reasons,
					],
				],
				'distributor_consumer_info_6' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['without-header', 'next-step-block', 'compact-lines']],
					'reject' => [
						'#type' => 'html_tag',
						'#value' => "Отказать ",
						'#tag' => "div",
						'#attributes' => ['class' => ['c-button', 'c-margin-left-30'], 'id' => 'reject'],
					],
					'send' => [
						'#type' => 'submit',
						'#value' => "Отправить в таркетт",
						'#attributes' => ['class' => ['c-button'], 'id' => 'send'],
						'#tag' => "div",
					],
				]
			],
		];
		return $fields[$key];
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
