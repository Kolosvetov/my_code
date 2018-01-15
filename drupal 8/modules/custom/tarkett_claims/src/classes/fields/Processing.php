<?php

namespace Drupal\tarkett_claims\classes\fields;

class Processing
{

	public function fields_process($name, $fields, $parms = [])
	{
		$method_name = $name . '_process';
		if (method_exists($this, $method_name)) {
			return call_user_func([$this, $method_name], $fields, $parms);
		}
		return $fields;
	}

	public function answer_process($fields, $parms = [])
	{
		$roles = \Drupal::currentUser()->getRoles();
		$fields['form_name']['#default_value'] = $fields['form_name']['#default_value'] . "_" . $roles[1];
		$fields['current_node_id']['#default_value'] = $parms['node']->nid->value;
		return $fields;
	}

	public function consumer_claims_fields_process($fields, $parms = [])
	{
//		if ($parms == 'pokupatel') {

		$fields['step-1'] = array_merge($fields['step-1'], $this->get('tarkett_claims.claims_class_fields')->getFields('consumer_personal_data', $parms));

		if ($parms == "magazin" || $parms == "distributor") {
//			$form = $fields;
			$fields['step-4'] = $this->get('tarkett_claims.claims_class_fields')->getFields(($parms == 'magazin' ? 'market_solution_fields' : "distributor_solution_fields"));
			unset($fields['steps-panel']);
			unset($fields['step-3']['next-step-block-4']);
			unset($fields['step-4']['distributor_consumer_info_6']);
			$fields['step-4']['#attributes'] = ['class' => 'b-step step-4'];

			$fields['step-4']['next-step-block-4'] = [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'without-header next-step-block'],
				'cancel' => [
					'#type' => 'html_tag',
					'#value' => "Отмена",
					'#attributes' => ['class' => ['c-button', 'c-margin-left-30 form-cancel']],
					'#tag' => "div",
				],
				'send' => [
					'#type' => 'submit',
					'#value' => "Отправить",
					'#attributes' => ['class' => ['c-button', 'c-margin-left-30']],
					'#tag' => "div",
				],
			];
			$fields['step-3']['next-step-block-3'] = [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'without-header next-step-block'],
				'cancel-4' => [
					'#type' => 'html_tag',
					'#value' => "Отмена",
					'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
					'#tag' => "div",
				],
				'to_4_step' => [
					'#type' => 'html_tag',
					'#value' => "Далее",
					'#attributes' => ['class' => ['c-button']],
					'#tag' => "div",
				],
			];
			$fields['step-1']['personal']['passport'] = [
				'#type' => 'textfield',
				'#title' => "Паспортные данные,<br/> серия и номер",
			];
			$fields['step-1']['personal']['date_of_issue'] = [
				'#type' => 'textfield',
				'#title' => "Дата выдачи",
				'#attributes' => ['class' => ['date']],
			];

			// Поле "Требование по претензии" показывается на третьем шаге
			// И поле для загрузки изображений документа с претензией
			$_step_3 = [];
			foreach ($fields['step-3'] as $key => $val) {
				if ('agrer_to_process_info' == $key) {

					// Требование по претензии
					$_step_3['requirement_wrapper'] = [
						'#type' => 'fieldset',
						'#attributes' => ['class' => ['without-header']],
						'requirement' => [
							'#type' => 'textarea',
							'#title' => 'Требование по претензии',
							// '#attributes' => ['style' => 'width: 827px;'],
						],
					];

					// Загрузка изображений документа с претензией
					$_step_3['pretenzia_photos_description'] = [
						'#type' => 'fieldset',
						'#title' => 'Загрузка файлов',
						'#attributes' => ['class' => 'b-col-wide'],
						'pretenzia_photos_comments' => [
							'#type' => 'html_tag',
							'#value' => 'Пожалуйста, отсканируйте или сфотографируйте согласие на обработку персональных данных и претензию покупателя.',
							'#tag' => 'div',
							'#attributes' => ['style' => 'font-size: 16px;font-weight: 400;text-align: center;margin-bottom: 26px;line-height: 22px;'],
						],
					];
					$_step_3['pretenzia_photos'] = [
						'#type' => 'inline_template',
						'#template' => "{{ claims_defects_photo_only('files[photo-pretenzia]') }}",
					];
				}
				$_step_3[$key] = $val;
			}
			$fields['step-3'] = $_step_3;

			$fields['steps-panel'] = [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'b-steps-panel without-header'],
				'button-step' => [
					'#type' => 'radios',
					'#default_value' => 1,
					'#options' => [
						1 => "<div class='step-num'>1</div><div class='step-title'>Шаг №1. Персональные данные</div>",
						2 => "<div class='step-num'>2</div><div class='step-title'>Шаг №2. Информация о продукте</div>",
						3 => "<div class='step-num'>3</div><div class='step-title'>Шаг №3. Местонахождение товара</div>",
						4 => "<div class='step-num'>4</div><div class='step-title'>Шаг №4.<br /> Доп. данные</div>"
					],
				],
			];
		}


		$fields['step-1']['next-step-block'] = [
			'#type' => 'fieldset',
			'#attributes' => ['class' => 'without-header next-step-block'],
			'cancel-5' => [
				'#type' => 'html_tag',
				'#value' => "Отмена",
				'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
				'#tag' => "div",
			],
			'to_2_step' => [
				'#type' => 'html_tag',
				'#value' => "Далее",
				'#attributes' => ['class' => ['c-button']],
				'#tag' => "div",
			],
		];
		return $fields;
	}

	public function consumer_personal_data_process($fields, $parms = [])
	{
		if ($parms == 'pokupatel') {
			$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
			$fio = $user->field_user_fio->value;
			$phone = $user->field_user_phone->value;
			$email = $user->field_user_email->value;

			$roles = \Drupal::currentUser()->getRoles();
			if (array_search("anonymous", $roles) !== false) {
				$fields['personal']['field_c_email']['#ajax'] = [
					'url' => \Drupal\Core\Url::fromRoute('tarkett_structure.ajax.check_email'),
					'event' => 'change',
					'progress' => [
						'type' => 'throbber',
						'message' => NULL,
					],
				];
			}

			$fields['personal']['field_c_fio']['#default_value'] = $fio;
			$fields['personal']['field_c_phone']['#default_value'] = $phone;
			$fields['personal']['field_c_email']['#default_value'] = $email;
		}
		return $fields;
	}

	public function distributor_claims_fields_process($fields, $parms = [])
	{
		$fields['step-1'] = array_merge($fields['step-1'], $this->get('tarkett_claims.claims_class_fields')->getFields('distributor_solution_fields'));
		unset($fields['step-1']['next-step-block-4']);
		unset($fields['step-1']['distributor_consumer_info_6']);
		unset($fields['step-1']['distributor_consumer_info_5']);
		$fields['step-1']['#attributes'] = ['class' => 'b-step step-1 active'];
		$fields['step-1']['#states'] = [
			'visible' => [
				'input[name="button-step"]' => [
					'value' => '1',
				]
			]
		];
		$a = $fields['step-1']['distributor_consumer_info_2'];
		unset($fields['step-1']['distributor_consumer_info_2']);
		$fields['step-1']['distributor_consumer_info_3'] = [
			'#type' => 'fieldset',
			'#attributes' => ['class' => 'b-col12'],
			'#title' => 'Тип претензии',
			'd_claim_type' => [
				'#type' => 'select',
				'#options' => [
					"All" => "Выбрать",
					"Продукция со скрытыми дефектами" => "Продукция со скрытыми дефектами",
					"Логистический брак" => "Логистический брак",
				],
			],
			'd_can_show' => [
				'#type' => 'radios',
				'#attributes' => ['class' => ['switcher']],
				'#default_value' => 0,
				'#options' => [
					1 => "Да",
					0 => "Нет",
				],
				'#title' => "Возможность предоставить образцы",
				'#states' => [
					'invisible' => [
						'select[name="d_claim_type"]' => [
							'value' => 'Логистический брак',
						],
					],
				],
			],
		];
		$fields['step-1']['distributor_consumer_info_2'] = $a;
		$fields['step-1']['next-step-block'] = [
			'#type' => 'fieldset',
			'#attributes' => ['class' => 'without-header next-step-block'],
			'cancel-6' => [
				'#type' => 'html_tag',
				'#value' => "Отмена",
				'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
				'#tag' => "div",
			],
			'to_2_step' => [
				'#type' => 'html_tag',
				'#value' => "Далее",
				'#attributes' => ['class' => ['c-button']],
				'#tag' => "div",
			],
		];
		return $fields;
	}

	public function market_claims_fields_process($fields, $parms = [])
	{
		$fields['step-1'] = array_merge($fields['step-1'], $this->get('tarkett_claims.claims_class_fields')->getFields('market_solution_fields'));
		unset($fields['step-1']['next-step-block-4']);
		unset($fields['step-1']['market_consumer_info_3']['market_consumer_comments']);
		unset($fields['step-1']['accept_fieldset']);
		$fields['step-1']['#attributes'] = ['class' => 'b-step step-1 active'];
		$fields['step-1']['#states'] = [
			'visible' => [
				'input[name="button-step"]' => [
					'value' => '1',
				]
			]
		];
		$fields['step-1']['next-step-block'] = [
			'#type' => 'fieldset',
			'#attributes' => ['class' => 'without-header next-step-block'],
			'cancel-7' => [
				'#type' => 'html_tag',
				'#value' => "Отмена",
				'#attributes' => ['class' => ['c-button c-margin-left-30 form-cancel']],
				'#tag' => "div",
			],
			'to_2_step' => [
				'#type' => 'html_tag',
				'#value' => "Далее",
				'#attributes' => ['class' => ['c-button']],
				'#tag' => "div",
			],
		];

		return $fields;
	}

	public function consumer_solution_fields_process($fields, $parms = [])
	{
		$fields['current_node_id']['#default_value'] = $parms['node']->nid->value;
		return $fields;
	}

	public function market_solution_fields_process($fields, $parms = [])
	{

		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$fio = $user->field_user_fio->value;
		$phone = $user->field_user_phone->value;
		$email = $user->field_user_email->value;

		$distributors = $this->get('tarkett_claims.claims_class_utils')->get_users_list_by_role('distributor');
		$fields['market_consumer_info']['market_consumer_fio']['#default_value'] = $fio;
		$fields['market_consumer_info']['market_consumer_email']['#default_value'] = $email;
		$fields['market_consumer_info']['market_consumer_phone']['#default_value'] = $phone;
		$fields['market_consumer_info_2']['market_consumer_distributor']['#options'] = $distributors;
		$fields['market_consumer_info_2']['current_node_id']['#default_value'] = isset($parms['node']) ? $parms['node']->nid->value : '';

		return $fields;
	}

	public function distributor_solution_fields_process($fields, $parms = [])
	{
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$fio = $user->field_user_fio->value;
		$phone = $user->field_user_phone->value;
		$email = $user->field_user_email->value;

		$fields['distributor_consumer_info_1']['distributor_consumer_fio']['#default_value'] = $fio;
		$fields['distributor_consumer_info_1']['distributor_consumer_email']['#default_value'] = $email;
		$fields['distributor_consumer_info_1']['distributor_consumer_phone']['#default_value'] = $phone;
		$fields['current_node_id']['#default_value'] = isset($parms['node']) ? $parms['node']->nid->value : '';

		return $fields;
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
