<?php

namespace Drupal\tarkett_claims\classes\forms;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class FormsParket extends FormBase
{
	public static $recursive_types = ['container', 'fieldset'];

	public $form_name = null;
	public $type = 2;
	public $with_merge = true;
	public $count = 1;

	public function get_form($form_name, $type = 2, $count = true)
	{
		$this->form_name = $form_name;
		$this->type = $type;
		$this->count = $count;
		return \Drupal::formBuilder()->getForm($this);
	}

	public function getFormId()
	{
		return 'parket_form_' . $this->count;
	}

	public function buildForm(array $form, FormStateInterface $form_state)
	{
		return $this->getCurrentForm($this->form_name, $this->type, $this->count);
	}

	public function submitForm(array &$form, FormStateInterface $form_state)
	{
		
	}

	public function changeFieldName($fields, $defect_num)
	{
		
	}

	// @TODO: сделать обработку контейнеров рекурсией, ибо для "размерности" придётся вводить ещё один уровень

	public function checkFieldsStates(&$fields, $replaces)
	{
		$replaces_from = array_keys($replaces);
		$replaces_to = array_values($replaces);
		foreach ($fields as $field_name => &$field_data) {
			if (!is_array($field_data) || !isset($field_data['#type'])) {
				continue;
			}
			if (isset($field_data['#states'])) {
				foreach ($field_data['#states']['visible'] as $v_name => $v_value) {
					$new_v_name = str_replace($replaces_from, $replaces_to, $v_name);
					if ($v_name != $new_v_name) {
						unset($field_data['#states']['visible'][$v_name]);
						$field_data['#states']['visible'][$new_v_name] = $v_value;
					}
				}
			}
			if (in_array($field_data['#type'], self::$recursive_types)) {
				$this->checkFieldsStates($field_data, $replaces);
			}
		}
	}

	function getCurrentForm($form_name, $type = 1, $count)
	{
		$fields = $this->$form_name($type);

		$replaces = [];

		foreach ($fields as $fieldset_name => $fieldset) {
			if ($fieldset['#type'] == "fieldset") {
				foreach ($fieldset as $field_name => $field_data) {
					if (!is_array($field_data) || !isset($field_data['#type'])) {
						continue;
					}
					if (in_array($field_data['#type'], self::$recursive_types)) {
						foreach ($field_data as $cfield_name => $cfield_data) {
							if (!is_array($cfield_data) || !isset($cfield_data['#type'])) {
								continue;
							}
							if ('fieldset' === $cfield_data['#type']) {
								foreach ($cfield_data as $fs_field_name => $fs_field_data) {
									if (!is_array($fs_field_data) || !isset($fs_field_data['#type'])) {
										continue;
									}
									$old_fs_field_name = $fs_field_name;
									$new_fs_field_name = "defect[$count][$fs_field_name]";
									$fields[$fieldset_name][$field_name][$cfield_name] = $this->replace_in_array(
										$fields[$fieldset_name][$field_name][$cfield_name],
										$old_fs_field_name,
										$new_fs_field_name
									);
									$replaces[$old_fs_field_name.'"'] = $new_fs_field_name.'"';
								}
							} else {
								$old_cfield_name = $cfield_name;
								$new_cfield_name = "defect[$count][$cfield_name]";
								$fields[$fieldset_name][$field_name] = $this->replace_in_array(
									$fields[$fieldset_name][$field_name],
									$old_cfield_name,
									$new_cfield_name
								);
								$replaces[$old_cfield_name.'"'] = $new_cfield_name.'"';
							}
						}
					} else {
						$old_field_name = $field_name;
						$new_field_name = "defect[$count][$field_name]";
						$fields[$fieldset_name] = $this->replace_in_array(
							$fields[$fieldset_name],
							$old_field_name,
							$new_field_name
						);
						$replaces[$old_field_name.'"'] = $new_field_name.'"';
					}
				}
			} else {
				if ($fieldset['#type'] == "inline_template") {
					if (substr_count($fieldset['#template'], "claims_defects_photo") > 0) {
						$old_field_name = $fieldset_name;
						$new_field_name = "files[$fieldset_name-$count]";
						$tmp_arr = $fields[$old_field_name];
						$foto_fields[$new_field_name] = $tmp_arr;
						$foto_fields[$new_field_name]['#template'] = str_replace("{name}", $new_field_name, $foto_fields[$new_field_name]['#template']);
						$foto_fields[$new_field_name]['#template'] = str_replace("{defect}", $form_name, $foto_fields[$new_field_name]['#template']);
						$foto_fields[$new_field_name]['#template'] = str_replace("{status}", $type, $foto_fields[$new_field_name]['#template']);
						unset($fields[$old_field_name]);
						// Добавляем к блоку загрузки фото блок загрузки видео
						if ('foto-1' === $old_field_name) {
							$new_video_name = 'files[video-1-' . strval($count) . ']';
							$foto_fields[$new_video_name] = [
								'#type' => 'inline_template',
								'#template' => '{{claims_defects_video(\'' . $new_video_name . '\', true)}}',
							];
						}
					}
				}
			}
		}
		if (0 < count($replaces)) {
			$this->checkFieldsStates($fields, $replaces);
		}
		$fields = array_merge($foto_fields, $fields);
	
		$fields['#attributes'] = ['class' => 'b-ajax-defect-form'];
		$fields["defect_type[$count]"] = [
			'#type' => 'hidden',
			'#value' => $form_name,
		];
		$fields["defect_status[$count]"] = [
			'#type' => 'hidden',
			'#value' => $type,
		];
		$fields["defect_count[$count]"] = [
			'#type' => 'hidden',
			'#value' => $count,
		];
		return $fields;

		if (count($fields) == 0 && $with_merge !== false)
			return $this->default_fields($type);
		if ($with_merge === true) {
			return array_merge($this->default_fields($type), $fields);
		} else {
			return $fields;
		}
	}

	protected function replace_in_array($arr, $old_key, $new_key)
	{
		if (!is_array($arr)) {
			return;
		}
		if (!isset($arr[$old_key])) {
			return;
		}
		$list = [];
		foreach ($arr as $key => $value) {
			if ($old_key === $key) {
				$key = $new_key;
			}
			$list[$key] = $value;
		}
		return $list;
	}

	function default_fields($type)
	{
		$fields = [
			0 => [],
			1 => [],
		];

		return $fields[$type];
	}

	function parket_1_1($status)
	{
		$fields = [
			0 => [
				// Загрузка фотографий 
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				// Дополнительная информация
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => ['questions', 'without-header']],
					'question_1_wrapper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах<br> на момент укладки:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wrapper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах<br> на момент укладки:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'break_10_11' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ,<br> ухода за паркетной <br>доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток<br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть <br>войлочные накладки:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
			],
			1 => [
				// Загрузка фотографий
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				// Дополнительная информация
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
				],
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах , где хранилась <br>паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах,<br> где хранилась <br>паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_1_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_4_5_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_4' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_5' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
						'#title' => 'Фотографии сделаны вами?',
					],
					
				],
			],	
		];

		return $fields[$status];
	}

	function parket_1_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_4_5_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_4' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_5' => [
							'#title' => 'Укажите название<br> чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '2',
									],
								],
							],
						],
					],

					'question_6' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
			],
		];

		return $fields[$status];
	}

	function parket_1_4($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_4_5_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_4' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_5' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '2',
									],
								],
							],
						],
					],

					'question_6' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
						'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
					],
				],
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_1_5($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите фотографию помещения вместе с мебелью.'
						],
					],
				],
				// Дополнительная информация
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'break_10_11' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_1_6($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите чёткую фотографию расширительных зазоров, с линейкой.'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}
	
	function parket_1_7($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите чёткую фотографию расширительных зазоров с линейкой.'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}
	
	function parket_1_8($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Не выбрано",
							1 => "до 25% поверхности",
							2 => "до 50% поверхности",
							3 => "до 75% поверхности",
							4 => "75% и более поверхности",
						],
						'#title' => 'Какой процент от всей поверхности занимает:',
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				
			],
		];

		return $fields[$status];
	}
	
	function parket_2_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию расширительных зазоров, с линейкой;',
							'Загрузите чёткую фотографию с измерением величины прогиба, с линейкой.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию с измерением величины прогиба, с линейкой.',
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_2_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию расширительных зазоров, с линейкой;',
							'Загрузите чёткую фотографию с измерением величины прогиба, с линейкой.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию с измерением величины прогиба, с линейкой.',
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_2_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию расширительных зазоров, с линейкой;',
							
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_3_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию расширительных зазоров, с линейкой;',
							'Загрузите четкие фотографии досок паркета, в связи с качеством которых направляется обращение с горизонтальной линейкой (покажите величину перепада).',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите четкие фотографии досок паркета, в связи с качеством которых направляется обращение  
с горизонтальной линейкой (покажите величину перепада).',
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_3_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию с измерительным устройством (например, линейкой), чтобы был виден градус угла доски.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите четкие фотографии досок паркета, в связи с качеством которых направляется обращение  
с приложенной линейкой (покажите угол при стыковке досок)
',
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}
	
	function parket_3_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию расширительных зазоров, с линейкой;',
							'Загрузите четкие фотографии зазоров с приложенной линейкой.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха<br> в процентах  в помещении,<br> где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах в помещении,<br>, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '0',
									],
								],
							],
							'question_12' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть<br> войлочные накладки :',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "во время укладки",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите четкие фотографии зазоров с приложенной линейкой.',
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в<br> процентах, где <br> хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха<br> в градусах, где <br> хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_4_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите чёткую фотографию с измерительным устройством (например, линейкой), чтобы был виден размер сучка.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_3_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'#states' => [
							'visible' => [
								'select[name="question_1"]' => [
									'value' => '1',
								],
							],
						],
						'question_3' => [
							'#type' => 'textfield',
							'#title' => ' Укажите точное количество досок с заявленным дефектом:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
				],
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',						
							'Загрузите чёткую фотографию с измерительным устройством (например, линейкой), чтобы был видна ширина белой полосы.',	
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_3_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'#states' => [
							'visible' => [
								'select[name="question_1"]' => [
									'value' => '1',
								],
							],
						],
						'question_3' => [
							'#type' => 'textfield',
							'#title' => ' Укажите точное количество досок с заявленным дефектом:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_4_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							' Загрузите чёткую фотографию с измерительным устройством (например, линейкой), чтобы был видна ширина белой полосы.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_3_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'#states' => [
							'visible' => [
								'select[name="question_1"]' => [
									'value' => '1',
								],
							],
						],
						'question_3' => [
							'#type' => 'textfield',
							'#title' => ' Укажите точное количество досок с заявленным дефектом:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
				],
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',						
							'Загрузите чёткую фотографию с измерительным устройством (например, линейкой), чтобы был видна ширина белой полосы.',	
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_3_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'#states' => [
							'visible' => [
								'select[name="question_1"]' => [
									'value' => '1',
								],
							],
						],
						'question_3' => [
							'#type' => 'textfield',
							'#title' => ' Укажите точное количество досок с заявленным дефектом:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_4_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
						],
						'break_10_11' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
						'question_13' => [
							'#title' => 'Выберите способ,<br> ухода за паркетной <br>доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток<br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть <br>войлочные накладки:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
					'question_5' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
						],
						'break_10_11' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_4_4($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							'Фотографии образца, с которым производится сравнение.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_20' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
						'#title' => 'Материал соответствует образцу в магазине:',
					],
				],
				
				
				'fieldset-4' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_10' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения',
					],
					
					'question_12_18_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_18_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
							'question_18' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_14' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_15' => [
						'#title' => 'В помещении, где<br> выявлена особенность<br> материала, есть шторы:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					'question_16' => [
						'#title' => 'Помещение находится:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "На солнечной стороне",
							1 => "На теневой стороне",
						],
					],
					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Фотографии образца, с которым производится сравнение.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_8' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
						'#title' => 'Материал соответствует образцу в магазине:',
					],
					'question_7' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					
				],
				
			],
		];

		return $fields[$status];
	}

	function parket_4_6($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в процентах в период хранения, обнаружения и укладки:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха в градусах в течение периода хранения, обнаружения укладки:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
					'question_7' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
					'question_8' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).'
						],
					],
				],
				
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_51_wraper' => [
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#title' => 'Была ли повреждена <br>заводская упаковка <br>(вмятины, порывы плёнки, <br>следы намокания, влага):',
						],
						'question_51' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
										],
									],
								],
							],
					],
				],
					

				'fieldset-2' => [
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в процентах, где хранилась паркетная доска:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_3_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_3' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха в градусах, где хранилась паркетная доска:',
						],
						'question_3_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_3"]' => [
										'value' => '0',
									],
								],
							],
							'question_3_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
					'question_7' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения:',
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_5_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
                    '#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
                    '#attributes' => ['class' => 'without-header'],
					'#context' => [
						'description' => [
							'Данный пункт не возможен для выбора из списка при выборе «Уложен», выберите пожалуйста другой вариант.',
						],
					],
				],	
				// не возможно
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите фотографии упаковки, к которой предъявляются претензии (все буквенные и цифровые обозначения);',
							'Загрузите четкие фотографии лицевой стороны досок паркета, не соответствующих заявленным на упаковке.',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'question_1' => [
							'#type' => 'textfield',
							'#title' => 'Количество вскрытых пачек:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
					'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
					],
					
				],
			],
		];

		return $fields[$status];
	}

	function parket_5_2($status)
	{
		$fields = [
			0 => [
				
				'foto-1' => [
                    '#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
                    '#attributes' => ['class' => 'without-header'],
					'#context' => [
						'description' => [
							'Данный пункт не возможен для выбора из списка при выборе «Уложен», выберите пожалуйста другой вариант.',
						],
					],
				],	
				// не возможно
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите фотографии поврежденной упаковки (все буквенные и цифровые обозначения);',
							'Загрузите фотографии поврежденных досок (если есть повреждения).',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields', 'style' => 'float:left;width:50%;'],
						'question_1' => [
							'#type' => 'textfield',
							'#title' => 'Укажите количество<br> поврежденных упаковок:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
					'question_2_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields', 'style' => 'float:left;width:50%;'],
						'question_2' => [
							'#type' => 'textfield',
							'#title' => 'Укажите точное<br> количество паркетных<br> досок, имеющих<br> недостатки в результате<br> повреждения упаковок:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
					'question_3' => [
						'#type' => 'textarea',
						'#title' => 'Опишите характер<br> повреждений:',
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_5_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Покажите количество упаковок, в которых не хватает паркетных досок;',
							'Загрузите фотографии пачки, в которой не хватает досок (все буквенные и цифровые обозначения).',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1' => [
						'#type' => 'select',
						'#title' => 'Была ли вскрыта упаковка при покупке:',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					'question_2_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'question_2' => [
							'#type' => 'textfield',
							'#title' => 'Сколько досок не<br> хватает в упаковке:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
					'question_3' => [
						'#type' => 'select',
						'#title' => 'В упаковке 2 половины одной доски?',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Покажите количество упаковок, в которых не хватает паркетных досок;',
							'Загрузите фотографии пачки, в которой не хватает досок (все буквенные и цифровые обозначения).',
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1' => [
						'#type' => 'select',
						'#title' => 'Была ли вскрыта упаковка при покупке:',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					'question_2_combo' => [
						'#type' => 'fieldset',
						'#attributes' => ['class' => 'without-header merge-fields'],
						'question_2' => [
							'#type' => 'textfield',
							'#title' => 'Сколько досок не<br> хватает в упаковке:',
							'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => 'шт.'],
							'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">шт.</span></div></div>',
						],
					],
					'question_3' => [
						'#type' => 'select',
						'#title' => 'В упаковке 2 половины одной доски?',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function parket_6_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне паркетной доски, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткие фотографии досок паркета, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт, сложенный в стопки товар  - неуложенный продукт).',
							'Загрузите чёткую фотографию расширительных зазоров с линейкой;',
							'Загрузите видеозапись со звуком (около 10 сек), не более 15 Мб.',
						],
					],
				],
				'fieldset-0' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_18' => [
						'#title' => 'Резкий звук присутствует:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "на всей поверхности",
							1 => "в некоторых областях помещения",
						],
					],
					'question_17' => [
						'#title' => 'Укажите, в каком<br> именно помещении:',
						'#type' => 'textfield',
						'#states' => [
							'visible' => [
								'select[name="question_18"]' => [
									'value' => '1',
								],
							],
						],
					],
				],
				'fieldset-1' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_1_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_1' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
						],
						'question_1_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_1"]' => [
										'value' => '0',
									],
								],
							],
							'question_1_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '%'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">%</span></div></div>',
							],
						],
					],
					'question_2_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_2' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
						],
						'question_2_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_2"]' => [
										'value' => '0',
									],
								],
							],
							'question_2_count' => [
								'#type' => 'textfield',
								'#title' => 'Укажите значение:',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					
					'question_7' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "в пачке",
							1 => "без пачки",
						],
						'#title' => 'Условия хранения',
					],
					'question_8' => [
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Паркетная доска приклеена",
							1 => "Плавающий способ",
						],
						'#title' => 'Выберите способ<br> монтажа:',
					],
					'question_9_10_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_9' => [
							'#title' => 'У вас пол с подогревом<br> (тёплый пол)?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_10_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_9"]' => [
										'value' => '0',
									],
								],
							],
							'question_10' => [
								'#title' => 'Укажите максимальную<br> температуру теплого<br> пола в градусах:',
								'#type' => 'textfield',
								'#attributes' => ['class' => ['number', 'with-units'], 'data-unit' => '°C'],
								'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">°C</span></div></div>',
							],
						],
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за паркетной доской:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Влажная уборка",
								1 => "Сухая уборка",
								2 => "Моющее средство",
							],
						],
						'question_12' => [
							'#title' => 'Укажите название<br> моющего/чистящего<br> средства:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_11"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_13_14_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_13' => [
							'#title' => 'В помещении, где выявлен заявляемый недостаток материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_14' => [
							'#title' => 'На мебели есть войлочные накладки:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_13"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_15' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_18_58_wraper' => [
						'question_18' => [
						'#title' => 'Какое у Вас основание пола?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "ДСП",
							1 => "ДВП",
							2 => "ГВЛ",
							3 => "фанера",
							4 => "цементная стяжка",
							5 => "бетонная стяжка",
							6 => "старое ПВХ покрытие",
							7 => "окрашенный деревянный пол",
							8 => "другое",
							],
						],	
						'question_58' => [
							'#title' => 'Укажите тип основания:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_18"]' => [
										'value' => '8',
									],
								],
							],
						],
					],
					'question_19_59_wraper' => [
						'question_19' => [
						'#title' => 'Этап ремонтных работ, на котором производился монтаж:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "до поклейки обоев, покраски стен, монтажа керамической плитки",
							1 => "во время поклейки обоев, покраски стен, монтажа керамической плитки ",
							2 => "после поклейки обоев, покраски стен, монтажа керамической плитки",
							3 => "ремонтные работы кроме замены пола не производились ",
							],
						],	
						'question_59' => [
							'#title' => 'Через какое время?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_19"]' => [
										'value' => '2',
									],
								],
							],
						],
					],
					'question_20' => [
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между паркетной <br>доской и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Расширительные зазоры <br>(не менее 8 мм) между полом и неподвижными препятствиями',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					
				],
			],
			1 => [
				'foto-1' => [
                    '#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}')}}",
                    '#attributes' => ['class' => 'without-header'],
					'#context' => [
						'description' => [
							'Данный пункт не возможен для выбора из списка при выборе «Не уложен», выберите пожалуйста другой вариант.',
						],
					],
				],	
				// не возможно
			],
		];

		return $fields[$status];
	}

}
