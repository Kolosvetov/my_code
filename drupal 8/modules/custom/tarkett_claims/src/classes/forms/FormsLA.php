<?php

namespace Drupal\tarkett_claims\classes\forms;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class FormsLA extends FormBase
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
		return 'laminat_form_' . $this->count;
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
				if ($fieldset['#type'] == "inline_template" && substr_count($fieldset['#template'], "claims_defects_photo") > 0) {
					$old_field_name = $fieldset_name;
					$new_field_name = "files[$fieldset_name-$count]";
					$tmp_arr = $fields[$old_field_name];
					$foto_fields[$new_field_name] = $tmp_arr;
					$foto_fields[$new_field_name]['#template'] = str_replace("{name}", $new_field_name, $foto_fields[$new_field_name]['#template']);
					$foto_fields[$new_field_name]['#template'] = str_replace("{defect}", $form_name, $foto_fields[$new_field_name]['#template']);
					$foto_fields[$new_field_name]['#template'] = str_replace("{status}", $type, $foto_fields[$new_field_name]['#template']);
					$foto_fields[$new_field_name]['#template'] = str_replace("{service}", 'laminat', $foto_fields[$new_field_name]['#template']);
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

	function laminat_1_1($status)
	{
		$fields = [
			0 => [
				// Загрузка фотографий 
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткую фотография образца рядом с приобретённым ламинатом.',
						],
					],
				],
				// Дополнительная информация
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
			1 => [
				// Загрузка фотографий
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткую фотография образца рядом с приобретённым ламинатом.',
						],
					],
				],
				// Дополнительная информация
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

	function laminat_1_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите чёткую фотографию двух панелей с одинаковым декором (рисунком), но разными оттенками;',
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
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузите чёткую фотографию двух панелей с одинаковым декором (рисунком), но разными оттенками;',
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

	function laminat_1_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт).',
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
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт).',
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

	function laminat_1_4($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткую фотография повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],

					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткую фотография повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],	
			],
		];
		
		return $fields[$status];
	}

	function laminat_1_5($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
						],
					],
				],
				// Дополнительная информация
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
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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

	function laminat_1_6($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
						],
					],
				],
				
				'fieldset-3' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					
					'question_17' => [
						'#title' => 'Когда заметили<br> заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
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
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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
	
	function laminat_1_7($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
						],
					],
				],
				
				
				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}
	
	function laminat_1_8($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							'Загрузить чёткие фотографии расширительных зазоров между ламинатом и неподвижными препятствиями (стены, трубы) с приложенным измерительным инструментом (линейка);',
							'Загрузить чёткие фотографии наличия гидроизоляционной плёнки между ламинатом и основанием пола;',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_17' => [
							'#title' => 'Дата монтажа ламината:',
							'#type' => 'textfield',
					],
					
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где выявлен заявляемый недостаток материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 1,
							'#options' => [
								1 => "Да",
								2 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть войлочные накладки:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					
					'question_34_35_36_37_38_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_34' => [
							'#title' => 'На какое основание смонтирован ламинат?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Деревянное основание",
								1 => "Цементно-песчаная стяжка",
								2 => "Прочее",
							],
						],
						'question_35' => [
							'#title' => 'Опишите основание:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '2',
									],
								],
							],
						],
						'question_36' => [
							'#title' => 'Когда (дата) заливалась стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_37' => [
							'#title' => 'Максимальная толщина стяжки?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_38' => [
							'#title' => 'Сколько времени сохла стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					'question_7' => [
						'#title' => 'Неровности основания (глубиной более 2мм на 2-х м длине):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Есть",
							1 => "Нет",
						],
					],
					'question_8' => [
						'#title' => 'Ламинат прошёл акклиматизацию<br> (48 часов в помещении):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					
				],

				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_12_112_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность основания:',
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
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
						'question_112' => [
							'#title' => 'Указать название прибора:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
						],
						'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
					],
					],
					
					
				],
				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между ламинатом и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Толщина звукопоглощающей подложки',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "не использовалась",
							1 => "2 мм и менее",
							2 => "3 мм",
							3 => "более 3мм",
						],
					],
					'question_22' => [
						'#title' => 'У вас пол с подогревом (тёплый пол)?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, максимально возможная температура основания пола не более 28С ",
							2 => "Да, максимально возможная температура основания пола более 28С ",
						],
					],
					'question_23' => [
						'#title' => 'Кто производил монтаж напольного покрытия?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Самостоятельно",
							1 => "Монтажники от магазина",
							2 => "Монтажники",
							3 => "Монтажники ТАРКЕТТ Академии",
						],
					],
					'question_24' => [
						'#title' => 'Расстояние между поперечными стыками панелей в прилегающих  рядах',
						'#type' => 'select',
						'#default_value' => 1,
						'#options' => [
							
							1 => "30 см и более",
							2 => "менее 30 см",
						],
					],
					'question_25' => [
						'#title' => 'Расширительные зазоры между ламинатом и неподвижными препятствиями:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены ",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					'question_26' => [
						'#title' => 'Способ крепления плинтуса и порожков',
						'#type' => 'select',
						'#default_value' => 1,
						'#options' => [
							
							1 => "к ламинату",
							2 => "к стене",
						],
					],
					'question_40' => [
							'#title' => 'Максимальная длина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_41' => [
							'#title' => 'Максимальная ширина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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
	
	function laminat_1_9($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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

	function laminat_1_10($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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
	
	function laminat_1_11($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
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
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					
				],
				
			],
		];

		return $fields[$status];
	}

	function laminat_1_12($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
					],
					
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}
	
	function laminat_2_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							'Загрузить чёткие фотографии расширительных зазоров между ламинатом и неподвижными препятствиями (стены, трубы) с приложенным измерительным инструментом (линейка);',
							'Загрузить чёткие фотографии наличия гидроизоляционной плёнки между ламинатом и основанием пола;',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_17' => [
							'#title' => 'Дата монтажа ламината:',
							'#type' => 'textfield',
					],
					
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где выявлен заявляемый недостаток материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 1,
							'#options' => [
								
								1 => "Да",
								2 => "Нет",
							],
						],
						'question_16' => [
							'#title' => 'На мебели есть войлочные накладки:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
							'#states' => [
								'visible' => [
									'select[name="question_15"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					
					'question_34_35_36_37_38_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_34' => [
							'#title' => 'На какое основание смонтирован ламинат?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Деревянное основание",
								1 => "Цементно-песчаная стяжка",
								2 => "Прочее",
							],
						],
						'question_35' => [
							'#title' => 'Опишите основание:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '2',
									],
								],
							],
						],
						'question_36' => [
							'#title' => 'Когда (дата) заливалась стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_37' => [
							'#title' => 'Максимальная толщина стяжки?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_38' => [
							'#title' => 'Сколько времени сохла стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					'question_7' => [
						'#title' => 'Неровности основания (глубиной более 2мм на 2-х м длине):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Есть",
							1 => "Нет",
						],
					],
					'question_8' => [
						'#title' => 'Ламинат прошёл акклиматизацию<br> (48 часов в помещении):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					
				],

				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_12_112_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность основания:',
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
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
						'question_112' => [
							'#title' => 'Указать название прибора:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
						],
						'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
					],
				],
				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между ламинатом и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Толщина звукопоглощающей подложки',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "не использовалась",
							1 => "2 мм и менее",
							2 => "3 мм",
							3 => "более 3мм",
						],
					],
					'question_22' => [
						'#title' => 'У вас пол с подогревом (тёплый пол)?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, максимально возможная температура основания пола не более 28С ",
							2 => "Да, максимально возможная температура основания пола более 28С ",
						],
					],
					'question_23' => [
						'#title' => 'Кто производил монтаж напольного покрытия?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Самостоятельно",
							1 => "Монтажники от магазина",
							2 => "Монтажники",
							3 => "Монтажники ТАРКЕТТ Академии",
						],
					],
					'question_24' => [
						'#title' => 'Расстояние между поперечными стыками панелей в прилегающих  рядах',
						'#type' => 'select',
						'#default_value' => 1,
						'#options' => [
							
							1 => "30 см и более",
							2 => "менее 30 см",
						],
					],
					'question_25' => [
						'#title' => 'Расширительные зазоры между ламинатом и неподвижными препятствиями:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены ",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					'question_26' => [
						'#title' => 'Способ крепления плинтуса и порожков',
						'#type' => 'select',
						'#default_value' => 1,
						'#options' => [
							
							1 => "к ламинату",
							2 => "к стене",
						],
					],
					'question_40' => [
							'#title' => 'Максимальная длина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_41' => [
							'#title' => 'Максимальная ширина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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

	function laminat_2_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
					],
					
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
						'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								
								1 => "Да",
								2 => "Нет",
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
										'value' => '1',
									],
								],
							],
						],
					],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function laminat_3_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_3' => [
						'#type' => 'textarea',
						'#title' => 'Какие инструменты использовались при монтаже ламината:',
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function laminat_3_2($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
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
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}
	
	function laminat_3_3($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
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

	function laminat_3_4($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
                    '#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Данный пункт не возможен для выбора из списка при выборе «Не уложен», выберите пожалуйста другой вариант.',
						],
					],
				],	
				// не возможно
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть).',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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

	function laminat_3_5($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							'Загрузить чёткие фотографии расширительных зазоров между ламинатом и неподвижными препятствиями (стены, трубы) с приложенным измерительным инструментом (линейка);',
							'Загрузить чёткие фотографии наличия гидроизоляционной плёнки между ламинатом и основанием пола;',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_17' => [
							'#title' => 'Дата монтажа ламината:',
							'#type' => 'textfield',
					],
					
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								
								1 => "Да",
								2 => "Нет",
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
										'value' => '1',
									],
								],
							],
						],
					],
					
					'question_34_35_36_37_38_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_34' => [
							'#title' => 'На какое основание смонтирован ламинат?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Деревянное основание",
								1 => "Цементно-песчаная стяжка",
								2 => "Прочее",
							],
						],
						'question_35' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '2',
									],
								],
							],
						],
						'question_36' => [
							'#title' => 'Когда (дата) заливалась стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_37' => [
							'#title' => 'Максимальная толщина стяжки?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_38' => [
							'#title' => 'Сколько времени сохла стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					'question_7' => [
						'#title' => 'Неровности основания (глубиной более 2мм на 2-х м длине):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Есть",
							1 => "Нет",
						],
					],
					'question_8' => [
						'#title' => 'Ламинат прошёл акклиматизацию<br> (48 часов в помещении):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					
				],

				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_12_112_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность основания:',
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
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
						'question_112' => [
							'#title' => 'Указать название прибора:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
						],
						'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
					],
				],
				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между ламинатом и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Толщина звукопоглощающей подложки',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "не использовалась",
							1 => "2 мм и менее",
							2 => "3 мм",
							3 => "более 3мм",
						],
					],
					'question_22' => [
						'#title' => 'У вас пол с подогревом (тёплый пол)?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, максимально возможная температура основания пола не более 28С ",
							2 => "Да, максимально возможная температура основания пола более 28С ",
						],
					],
					'question_23' => [
						'#title' => 'Кто производил монтаж напольного покрытия?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Самостоятельно",
							1 => "Монтажники от магазина",
							2 => "Монтажники",
							3 => "Монтажники ТАРКЕТТ Академии",
						],
					],
					'question_24' => [
						'#title' => 'Расстояние между поперечными стыками панелей в прилегающих  рядах',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "30 см и более",
							2 => "менее 30 см",
						],
					],
					'question_25' => [
						'#title' => 'Расширительные зазоры между ламинатом и неподвижными препятствиями:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены ",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					'question_26' => [
						'#title' => 'Способ крепления плинтуса и порожков',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "к ламинату",
							2 => "к стене",
						],
					],
					'question_40' => [
							'#title' => 'Максимальная длина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_41' => [
							'#title' => 'Максимальная ширина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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
	
	function laminat_3_6($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							'Загрузить чёткие фотографии расширительных зазоров между ламинатом и неподвижными препятствиями (стены, трубы) с приложенным измерительным инструментом (линейка);',
							'Загрузить чёткие фотографии наличия гидроизоляционной плёнки между ламинатом и основанием пола;',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_17' => [
							'#title' => 'Дата монтажа ламината:',
							'#type' => 'textfield',
					],
					
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								
								1 => "Да",
								2 => "Нет",
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
										'value' => '1',
									],
								],
							],
						],
					],
					
					'question_34_35_36_37_38_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_34' => [
							'#title' => 'На какое основание смонтирован ламинат?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Деревянное основание",
								1 => "Цементно-песчаная стяжка",
								2 => "Прочее",
							],
						],
						'question_35' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '2',
									],
								],
							],
						],
						'question_36' => [
							'#title' => 'Когда (дата) заливалась стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_37' => [
							'#title' => 'Максимальная толщина стяжки?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_38' => [
							'#title' => 'Сколько времени сохла стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					'question_7' => [
						'#title' => 'Неровности основания (глубиной более 2мм на 2-х м длине):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Есть",
							1 => "Нет",
						],
					],
					'question_8' => [
						'#title' => 'Ламинат прошёл акклиматизацию<br> (48 часов в помещении):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					
				],

				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_12_112_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность основания:',
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
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
						'question_112' => [
							'#title' => 'Указать название прибора:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
						],
						'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
					],
				],
				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между ламинатом и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Толщина звукопоглощающей подложки',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "не использовалась",
							1 => "2 мм и менее",
							2 => "3 мм",
							3 => "более 3мм",
						],
					],
					'question_22' => [
						'#title' => 'У вас пол с подогревом (тёплый пол)?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, максимально возможная температура основания пола не более 28С ",
							2 => "Да, максимально возможная температура основания пола более 28С ",
						],
					],
					'question_23' => [
						'#title' => 'Кто производил монтаж напольного покрытия?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Самостоятельно",
							1 => "Монтажники от магазина",
							2 => "Монтажники",
							3 => "Монтажники ТАРКЕТТ Академии",
						],
					],
					'question_24' => [
						'#title' => 'Расстояние между поперечными стыками панелей в прилегающих  рядах',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "30 см и более",
							2 => "менее 30 см",
						],
					],
					'question_25' => [
						'#title' => 'Расширительные зазоры между ламинатом и неподвижными препятствиями:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены ",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					'question_26' => [
						'#title' => 'Способ крепления плинтуса и порожков',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "к ламинату",
							2 => "к стене",
						],
					],
					'question_40' => [
							'#title' => 'Максимальная длина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_41' => [
							'#title' => 'Максимальная ширина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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

	function laminat_3_7($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							'Загрузить чёткие фотографии расширительных зазоров между ламинатом и неподвижными препятствиями (стены, трубы) с приложенным измерительным инструментом (линейка);',
							'Загрузить чёткие фотографии наличия гидроизоляционной плёнки между ламинатом и основанием пола.',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_17' => [
							'#title' => 'Дата монтажа ламината:',
							'#type' => 'textfield',
					],
					
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								
								1 => "Да",
								2 => "Нет",
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
										'value' => '1',
									],
								],
							],
						],
					],
					
					'question_34_35_36_37_38_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_34' => [
							'#title' => 'На какое основание смонтирован ламинат?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Деревянное основание",
								1 => "Цементно-песчаная стяжка",
								2 => "Прочее",
							],
						],
						'question_35' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '2',
									],
								],
							],
						],
						'question_36' => [
							'#title' => 'Когда (дата) заливалась стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_37' => [
							'#title' => 'Максимальная толщина стяжки?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_38' => [
							'#title' => 'Сколько времени сохла стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					'question_7' => [
						'#title' => 'Неровности основания (глубиной более 2мм на 2-х м длине):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Есть",
							1 => "Нет",
						],
					],
					'question_8' => [
						'#title' => 'Ламинат прошёл акклиматизацию<br> (48 часов в помещении):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					
				],

				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_12_112_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность основания:',
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
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
						'question_112' => [
							'#title' => 'Указать название прибора:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
						],
						'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
					],
				],
				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между ламинатом и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_21' => [
						'#title' => 'Толщина звукопоглощающей подложки',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "не использовалась",
							1 => "2 мм и менее",
							2 => "3 мм",
							3 => "более 3мм",
						],
					],
					'question_22' => [
						'#title' => 'У вас пол с подогревом (тёплый пол)?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, максимально возможная температура основания пола не более 28С ",
							2 => "Да, максимально возможная температура основания пола более 28С ",
						],
					],
					'question_23' => [
						'#title' => 'Кто производил монтаж напольного покрытия?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Самостоятельно",
							1 => "Монтажники от магазина",
							2 => "Монтажники",
							3 => "Монтажники ТАРКЕТТ Академии",
						],
					],
					'question_24' => [
						'#title' => 'Расстояние между поперечными стыками панелей в прилегающих  рядах',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "30 см и более",
							2 => "менее 30 см",
						],
					],
					'question_25' => [
						'#title' => 'Расширительные зазоры между ламинатом и неподвижными препятствиями:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены ",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					'question_26' => [
						'#title' => 'Способ крепления плинтуса и порожков',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							
							1 => "к ламинату",
							2 => "к стене",
						],
					],
					'question_40' => [
							'#title' => 'Максимальная длина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_41' => [
							'#title' => 'Максимальная ширина смонтированного полотна ламината:',
							'#type' => 'textfield',
					],
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Данный пункт невозможен для выбора из списка при выборе «Не уложен»;',
						],
					],
				],
				
			],
		];

		return $fields[$status];
	}
	
	function laminat_3_8($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
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

				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
					
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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

	function laminat_4_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии упаковки;',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии упаковки.',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function laminat_4_2($status)
	{
		$fields = [
			0 => [
				
				'foto-1' => [
                    '#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Данный пункт не возможен для выбора из списка при выборе «Не уложен», выберите пожалуйста другой вариант.',
						],
					],
				],	
				// не возможно
				
				
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии упаковки ;',
							'Загрузить чёткую фотографию панели ламината (лицевая поверхность ламината) рядом с печатью на торце упаковки: наименование материала, дата производства;',	
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
				],
			],
		];

		return $fields[$status];
	}

	function laminat_5_1($status)
	{
		$fields = [
			0 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
							'Загрузить чёткие фотографии расширительных зазоров между ламинатом и неподвижными препятствиями (стены, трубы) с приложенным измерительным инструментом (линейка);',
							'Загрузить чёткие фотографии наличия гидроизоляционной плёнки между ламинатом и основанием пола;',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
										'value' => '0',
									],
								],
							],
						],
					],
					'question_6' => [
						'#title' => 'Когда заметили заявляемый недостаток:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "перед укладкой уже было на продукте",
							1 => "во время укладки",
							2 => "сразу после укладки",
							3 => "после укладки во время эксплуатации",
						],
					],
					'question_17' => [
							'#title' => 'Дата монтажа ламината:',
							'#type' => 'textfield',
					],
					
					'question_15_16_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_15' => [
							'#title' => 'В помещении, где<br> выявлен заявляемый недостаток <br> материала, есть Мебель:',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								
								1 => "Да",
								2 => "Нет",
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
										'value' => '1',
									],
								],
							],
						],
					],
					
					'question_34_35_36_37_38_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_34' => [
							'#title' => 'На какое основание смонтирован ламинат?',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Деревянное основание",
								1 => "Цементно-песчаная стяжка",
								2 => "Прочее",
							],
						],
						'question_35' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '2',
									],
								],
							],
						],
						'question_36' => [
							'#title' => 'Когда (дата) заливалась стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_37' => [
							'#title' => 'Максимальная толщина стяжки?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
						'question_38' => [
							'#title' => 'Сколько времени сохла стяжка?',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_34"]' => [
										'value' => '1',
									],
								],
							],
						],
					],
					'question_7' => [
						'#title' => 'Неровности основания (глубиной более 2мм на 2-х м длине):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Есть",
							1 => "Нет",
						],
					],
					'question_8' => [
						'#title' => 'Ламинат прошёл акклиматизацию<br> (48 часов в помещении):',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Да",
							1 => "Нет",
						],
					],
					
				],

				'fieldset-2' => [
					'#type' => 'fieldset',
					'#attributes' => ['class' => 'questions without-header'],
					'question_12_112_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_12' => [
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Измерялась",
								1 => "Не измерялась",
							],
							'#title' => 'Влажность основания:',
						],
						'question_12_combo' => [
							'#type' => 'fieldset',
							'#attributes' => ['class' => 'without-header merge-fields'],
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
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
						'question_112' => [
							'#title' => 'Указать название прибора:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_12"]' => [
										'value' => '0',
									],
								],
							],
						],
						'break_1_2' => [
						'#type' => 'html_tag',
						'#tag' => 'div',
						'#attributes' => ['class' => ['break-until-end']],
						],
					],
				],
				'fieldset-3' => [
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
							'#title' => 'Влажность воздуха в процентах в помещении, где уложен материал:',
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
							'#title' => 'Температура воздуха в градусах в помещении, где уложен материал:',
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
						'#title' => 'Использовалась ли гидроизоляционная<br> плёнка между ламинатом и основанием?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет ",
							1 => "Да, толщиной менее 0,2 мм",
							2 => "Да, толщиной 0,2 мм",
						],
					],
					'question_24' => [
						'#title' => 'Расстояние между поперечными стыками панелей в прилегающих  рядах',
						'#type' => 'select',
						'#default_value' => 1,
						'#options' => [
							
							1 => "30 см и более",
							2 => "менее 30 см",
						],
					],

					'question_26' => [
						'#title' => 'Способ крепления плинтуса и порожков',
						'#type' => 'select',
						'#default_value' => 1,
						'#options' => [
							
							1 => "к ламинату",
							2 => "к стене",
						],
					],
					'question_21' => [
						'#title' => 'Толщина звукопоглощающей подложки',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "не использовалась",
							1 => "2 мм и менее",
							2 => "3 мм",
							3 => "более 3мм",
						],
					],
					'question_22' => [
						'#title' => 'У вас пол с подогревом (тёплый пол)?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Нет",
							1 => "Да, максимально возможная температура основания пола не более 28С ",
							2 => "Да, максимально возможная температура основания пола более 28С ",
						],
					],
					'question_23' => [
						'#title' => 'Кто производил монтаж напольного покрытия?',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "Самостоятельно",
							1 => "Монтажники от магазина",
							2 => "Монтажники",
							3 => "Монтажники ТАРКЕТТ Академии",
						],
					],
					
					'question_25' => [
						'#title' => 'Расширительные зазоры между ламинатом и неподвижными препятствиями:',
						'#type' => 'select',
						'#default_value' => 0,
						'#options' => [
							0 => "соблюдены ",
							1 => "были соблюдены при монтаже, в данный момент отсутствуют",
							2 => "не соблюдены при монтаже",
						],
					],
					
					'question_11_12_wraper' => [
						'#type' => 'container',
						'#attributes' => ['class' => ['question-container']],
						'question_11' => [
							'#title' => 'Выберите способ ухода за ламинатом:',
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
				],
			],
			1 => [
				'foto-1' => [
					'#type' => 'inline_template',
					'#template' => "{{claims_defects_photo('{name}','{defect}','{status}','{service}')}}",
					'#context' => [
						'description' => [
							'Загрузите чёткую фотографию номера из цифр на оборотной стороне панели, по которой направляется обращение (если имеются не уложенные доски, отрезки досок с напечатанным номером);',
							'Загрузите чёткую фотографию печати с торца упаковки: наименование материала, дата производства (если упаковка сохранилась);',
							'Загрузите чёткие фотографии панелей, в связи с качеством которых направляется обращение (предмет обращения крупным планом);',
							'Загрузите чёткие фотографии всего объёма продукции, заявленного по претензии (общего вида помещения (ий) – уложенный продукт,сложенный в стопки товар  - неуложенный продукт);',
							'Загрузить чёткие фотографии повреждений упаковки (если они есть);',
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
							'#title' => 'Была ли повреждена заводская упаковка (вмятины, порывы плёнки, следы намокания, влага):',
							'#type' => 'select',
							'#default_value' => 0,
							'#options' => [
								0 => "Да",
								1 => "Нет",
							],
						],
						'question_5' => [
							'#title' => 'Опишите подробнее:',
							'#type' => 'textfield',
							'#states' => [
								'visible' => [
									'select[name="question_4"]' => [
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
							'#title' => 'Влажность воздуха в процентах, где хранился ламинат:',
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
							'#title' => 'Температура воздуха в градусах, где хранился ламинат:',
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

}
