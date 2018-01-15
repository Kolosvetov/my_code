<?php

namespace Drupal\tarkett_claims\classes;

use \Drupal\tarkett_claims\controller\Controller;
use \Drupal\Core\Entity\EntityViewBuilderInterface;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;
use \Drupal\node\NodeForm;
use Drupal\tarkett_api\TarkettSite;

class Updater
{

	public function __construct()
	{
		$this->user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
	}
	
	protected $tarkett = "196d3282-cd6f-4c55-b767-129bc58c0ba0";

	public $mail_notify_addresses = ['webmaster@tarkett.com'];
	public $mail_notify_address_from = ['notify@claims.tarkett.ru' => 'Tarkett Claims'];
	public $lastUpdated = null;
	public $claim = null;
	public $process_state = null;
	public $process_brief = null;
	public $user = null;
	public $shop = null;
	public $is_drush = false;
	public $extra_info_node = null;
	public $status_mail_text = '<p><strong>Здравствуйте{FIO}.</strong></p><p>Изменился статус обращения/претензии №{ID}<br /> Новый статус: {STATUS}.</p><p>Вы всегда можете проверить статус вашего обращения по ссылке <a href="http://claims.tarkett.ru/node/{ID}" target="_blank" style="color:#284864;text-decoration:none;">http://claims.tarkett.ru/node/{ID}</a> или номеру в вашем личном кабинете.</p>';
	public $status_mail_theme = 'Изменение статуса обращения/претензии на сервисе Claims.Tarkett';
	public $process_types = [
		1 => ['id' => 48, 'title' => 'Обращение покупателя'],
		2 => ['id' => 50, 'title' => 'Претензия покупателя'],
		3 => ['id' => 51, 'title' => 'Претензия магазина'],
		4 => ['id' => 53, 'title' => 'Претензия дистрибьютора'],
	];
	public $fields = [
		'common' => [
			'ru.claims.purchase.address' => "c_street",
			'ru.claims.purchase.shop' => 'field_c_market_name',
			'ru.claims.purchase.date' => 'field_c_buy_date',
			'ru.claims.purchase.checkno' => 'field_c_check_num',
			'ru.claims.purchase.product_category' => 'product_cat',
			'ru.claims.purchase.product_collection' => ['product_name', "field_kollekcia"],
			'ru.claims.purchase.purchased_amount' => 'product_count_all',
			'ru.claims.purchase.purchased_munit' => 'product_count_all_ez',
			'ru.claims.purchase.cost' => 'product_price',
			'ru.claims.purchase.defect_amount' => 'product_count_bad',
			'ru.claims.purchase.provide_sample' => 'product_can_show',
			'ru.claims.purchase.product_address' => 'product_address_full',
			'ru.claims.purchase.shop_contact_name' => 'market_consumer_fio',
			'ru.claims.purchase.shop_contact_email' => 'market_consumer_email',
			'ru.claims.purchase.shop_contact_phone' => 'market_consumer_phone',
			'ru.claims.purchase.torg12_no' => 'market_torg_12',
			'ru.claims.purchase.torg12_date' => 'market_torg_12_date',
			'ru.claims.purchase.invoice_no' => 'market_consumer_invoices',
			'ru.claims.purchase.invoice_date' => 'market_consumer_invoices_d',
			'ru.claims.purchase.distributor_contact_name' => 'd_fio',
			'ru.claims.purchase.distributor_contact_email' => 'distributor_email',
			'ru.claims.purchase.distributor_contact_phone' => 'distributor_phone',
			'ru.claims.purchase.distributor_tarkett_documents' => 'field_distributor_invoices',
			'ru.claims.purchase.distributor_claim_type' => 'field_d_claim_type',
			'ru.claims.purchase.defect_type' => ['field_defect_type', 'field_d_defect_type'],
			'ru.claims.purchase.product_design' => 'field_products_with_defects',
			'ru.claims.purchase.contract_no' => 'd_supply_contract',
			'ru.claims.purchase.agent_visit' => 'agent_visit',
			'ru.claims.purchase.agent_visit_date' => 'agent_visit_date',
			'ru.claims.purchase.agent_visit_result' => 'agent_visit_result',
			'ru.claims.purchase.sample_request' => 'sample_request',
			'ru.claims.purchase.sample_request_date' => 'sample_request_date',
			'ru.claims.purchase.sample_test_date' => 'sample_test_date',
			'ru.claims.purchase.tarkett_conclusion' => 'tip_resenia',
			'ru.claims.purchase.tarkett_conclusion_reject_reason' => 'body',
			'ru.claims.purchase.consumer_passport_issueplace' => 'field_c_passport_issueplace', //Паспорт, место выдачи
			'ru.claims.purchase.consumer_passport_date' => 'field_data_vydaci', //Паспорт, дата выдачи
			'ru.claims.purchase.consumer_passport_no' => 'field_pasportnye_dannye', //Паспорт, номер
			'ru.claims.purchase.requirement' => 'field_trebovanie_po_pretenzii',
//			'ru.claims.purchase.tarkett_conclusion_reject_reason' => 'body',
//			'ru.claims.purchase.tarkett_conclusion' => 'body',
		],
		'type_4' => [
			'ru.claims.purchase.address' => "c_street",
			'ru.claims.purchase.shop' => 'field_c_market_name',
			'ru.claims.purchase.date' => 'field_c_buy_date',
			'ru.claims.purchase.checkno' => 'field_c_check_num',
			'ru.claims.purchase.product_category' => 'product_cat',
			'ru.claims.purchase.product_collection' => ['product_name', "field_kollekcia"],
			'ru.claims.purchase.purchased_amount' => 'product_count_all',
			'ru.claims.purchase.purchased_munit' => 'product_count_all_ez',
			'ru.claims.purchase.cost' => 'product_price',
			'ru.claims.purchase.defect_amount' => 'product_count_bad',
			'ru.claims.purchase.provide_sample' => 'd_can_show',
			'ru.claims.purchase.product_address' => 'product_address_full',
			'ru.claims.purchase.shop_contact_name' => 'market_consumer_fio',
			'ru.claims.purchase.shop_contact_email' => 'market_consumer_email',
			'ru.claims.purchase.shop_contact_phone' => 'market_consumer_phone',
			'ru.claims.purchase.torg12_no' => 'market_torg_12',
			'ru.claims.purchase.torg12_date' => 'market_torg_12_date',
			'ru.claims.purchase.invoice_no' => 'market_consumer_invoices',
			'ru.claims.purchase.invoice_date' => 'market_consumer_invoices_d',
			'ru.claims.purchase.distributor_contact_name' => 'd_fio',
			'ru.claims.purchase.distributor_contact_email' => 'distributor_email',
			'ru.claims.purchase.distributor_contact_phone' => 'distributor_phone',
			'ru.claims.purchase.distributor_claim_type' => 'field_d_claim_type',
			'ru.claims.purchase.defect_type' => ['field_defect_type', 'field_d_defect_type'],
			'ru.claims.purchase.invoices' => 'field_distributor_invoices',
			'ru.claims.purchase.product_design' => 'field_products_with_defects',
			'ru.claims.purchase.contract_no' => 'd_supply_contract',
			'ru.claims.purchase.agent_visit' => 'agent_visit',
			'ru.claims.purchase.agent_visit_date' => 'agent_visit_date',
			'ru.claims.purchase.agent_visit_result' => 'agent_visit_result',
			'ru.claims.purchase.sample_request' => 'sample_request',
			'ru.claims.purchase.sample_request_date' => 'sample_request_date',
			'ru.claims.purchase.sample_test_date' => 'sample_test_date',
			'ru.claims.purchase.tarkett_conclusion' => 'tip_resenia',
			'ru.claims.purchase.tarkett_conclusion_reject_reason' => 'body',
			'ru.claims.purchase.consumer_passport_issueplace' => 'field_c_passport_issueplace', //Паспорт, место выдачи
			'ru.claims.purchase.consumer_passport_date' => 'field_data_vydaci', //Паспорт, дата выдачи
			'ru.claims.purchase.consumer_passport_no' => 'field_pasportnye_dannye', //Паспорт, номер
			'ru.claims.purchase.requirement' => 'field_trebovanie_po_pretenzii',
		],
	];

	public function getTarkettUid()
	{
		return $this->tarkett;
	}

	public function checkList($user = null)
	{
		if (isset($user)) {
			$this->user = $user;
			$this->is_drush = true;
		} else {
			$this->user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		}
		if (!isset($this->user->field_uid->value))
			return false;
		$parms = [
			"userUid" => $this->getUserUid(),
			"category" => "OwnWithArchive",
			"processTypeIds" => [48, 50, 51, 53],
			"keywords" => "",
			"period" => [
				"startTime" => date('Y-m-d', strtotime("-1 days")) . "T00:00:00.521Z"
			]
		];
		$list = $this->get('tarkett_api.index')->process_list($parms);
		if (!isset($list['result']->processes) || count($list['result']->processes) == 0)
			return false;
		foreach ($list['result']->processes as $process) {
			$maxdate = date('Y-m-d', strtotime("-30 days")) . "T00:00:00.521Z";
			if (!isset($process->lastUpdated) || $process->lastUpdated < $maxdate)
				continue;
			$this->lastUpdated = $process->lastUpdated;
			$this->claim = $this->get('tarkett_claims.claims_class_utils')->get_node_by_field('field_process_uid', $process->uid);
			if (!isset($this->claim))
				continue;
			if ($this->claim->field_lastupdated->value && $this->claim->field_lastupdated->value >= $this->lastUpdated)
				continue;
			$this->process_state = $this->get('tarkett_api.index')->process_getState([
				'userUid' => $this->getUserUid(),
				'processUid' => $process->uid,
//				'stateUid' => $this->claim->field_stateuid->value,
			]);
			$this->checkNode('obrasenie_pretenzia');
//			$this->checkNode('dannye_pokupatela'); // не думаю, что когда-то понадобится, но все таки оставлю это здесь
			$this->checkNode('dannye_magazina');
			$this->checkNode('dannye_distributora');
			$this->checkNode('answers');
			$is_changed = $this->get('tarkett_claims.claims_class_utils')->setStatus($this->claim, $this->process_state['result']);
			$this->sendNotify($is_changed);
			$this->claim->save();
		}
	}

	protected function sendNotify($is_changed)
	{
		if (is_array($is_changed) && count($is_changed) > 0) {
			$transport = \Swift_MailTransport::newInstance();
			$mailer = \Swift_Mailer::newInstance($transport);
	
			foreach ($is_changed as $key => $value) {
				$mail_list = [];
				$status = '';
				$fio = '';
				switch ($key) {
					case "distributor":
						$status = $this->claim->field_status_processa_u_distribu->entity->description->value;
						$mail_list[] = isset($this->claim->field_privazka_distributor->entity->mail) ? $this->claim->field_privazka_distributor->entity->mail->value : "";
						if (isset($this->claim->field_privazka_distributor->entity->field_user_fio)) {
							$fio = ', ' . $this->claim->field_privazka_distributor->entity->field_user_fio->value;
						}
						break;
					case "market":
						$status = $this->claim->field_market_status->entity->description->value;
						$mail_list[] = isset($this->claim->field_privazka_magazina->entity->mail) ? $this->claim->field_privazka_magazina->entity->mail->value : "";
						if (isset($this->claim->field_privazka_magazina->entity->field_user_fio)) {
							$fio = ', ' . $this->claim->field_privazka_magazina->entity->field_user_fio->value;
						}
						break;
					case "consumer":
						if ($this->claim->field_claims_type->value != 3 && $this->claim->field_claims_type->value != 4) {
							$status = $this->claim->field_consumer_status->entity->description->value;
							$mail_list[] = isset($this->claim->uid->entity->mail) ? $this->claim->uid->entity->mail->value : "";
							if (isset($this->claim->uid->entity->field_user_fio)) {
								$fio = ', ' . $this->claim->uid->entity->field_user_fio->value;
							}
						}
						break;
				}
				if (!$status) {
					continue;
				}
				$content = str_replace('{ID}', $this->claim->nid->value, $this->status_mail_text);
				$content = str_replace('{STATUS}', strip_tags($status), $content);
				$content = str_replace('{FIO}', $fio, $content);
				$mail_theme = array(
					'#type' => 'markup',
					'#theme' => 'mail_template',
					'#content' => $content,
				);
				try {
					$logo_image = \Swift_Image::fromPath('sites/default/files/images/logo/mail-logo.png');
					if ($this->is_drush === true) {
						//$html = $content;
						$html = \Drupal::service('renderer')->renderRoot($mail_theme);
					} else {
						$html = \Drupal::service('renderer')->render($mail_theme);
					}
					if (count($mail_list) > 0) { 
						$message = \Swift_Message::newInstance($this->status_mail_theme);
						$message->setBody(
							str_replace('%%LOGO_SRC%%', $message->embed($logo_image), $html),
							'text/html',
							'utf-8'
						)->setFrom($this->mail_notify_address_from)->setTo($mail_list);
						$mailer->send($message);
					}
					
					$message_no_show = \Swift_Message::newInstance($this->status_mail_theme);
					$message_no_show->setBody(
						str_replace('%%LOGO_SRC%%', $message_no_show->embed($logo_image), $html),
						'text/html',
						'utf-8'
					)->setFrom($this->mail_notify_address_from)->setTo($this->mail_notify_addresses);
					$mailer->send($message_no_show);
				} catch (\Swift_RfcComplianceException $e) {
					//drupal_set_message($e->getMessage());
				}
			}
		}
	}

	public function add_answer($node, $user, $data)
	{
		$this->process_state = $this->get('tarkett_api.index')->process_getState([
			'userUid' => $data['userUid'],
			'processUid' => $data['processUid'],
		]);
		$mode = '';
		if (array_search("distributor", $user->getRoles()) !== false) {
			$mode = "distributor";
		} elseif (array_search("magazin", $user->getRoles()) !== false) {
			$mode = "magazin";
		}
		if ($mode != '') {
			$this->claim = $node;
			$request = [
				"userUid" => $user->field_contactuid->value,
				"clientUpdateUid" => $this->process_state['result']->clientUpdateUid,
				"processUid" => $node->field_process_uid->value,
				"state" => [
					"uid" => $this->process_state['result']->state->uid,
					"importanceId" => 1,
					"commentary" => $data['content'],
				],
			];
			$this->addComment($data['content']);
			$this->getNextState($request, $this->process_state['result'], 'add_' . $mode . '_answer');
			$response = $this->sendProcessUpdate($request);
		}
	}

	public function addComment($comment)
	{
		$this->get('tarkett_api.index')->process_addComment([
			'userUid' => $this->process_state['result']->state->responsibleContact->uid,
			'processUid' => $this->process_state['result']->process->uid,
			"importanceId" => 1,
			"content" => $comment
		]);
	}

	protected function processParametrs($api_parametrs, $send_parametrs)
	{
		foreach ($api_parametrs as $parm) {
			foreach ($send_parametrs as $s_parm_key => $s_parm) {
				if ($s_parm['code'] == $parm->code) {
					if ($parm->type == 'dictionary') {
						foreach ($parm->dictionary as $dict) {
							$text = $send_parametrs[$s_parm_key]['value'];
							if ($text == "All") {
								$send_parametrs[$s_parm_key]['value'] = (int) $dict->id;
								break;
							}
							if (str_replace(" ", "", $dict->text) == $text || $dict->text == $text) {
								$send_parametrs[$s_parm_key]['value'] = (int) $dict->id;
							}
						}
					} elseif ($parm->type == 'check') {
						$send_parametrs[$s_parm_key]['value'] = (bool) $send_parametrs[$s_parm_key]['value'];
					} else {
						if (substr_count($parm->code, "date")) {
							$send_parametrs[$s_parm_key]['value'] = date(DATE_ATOM, strtotime($send_parametrs[$s_parm_key]['value']));
						}
					}
				}
			}
		}
		return $send_parametrs;
	}

	public function process_data($parameters)
	{
		$data = [];
		$_fields = $this->getFields($this->claim->field_claims_type->value);
		foreach ($parameters as $parameter) {
			if (isset($_fields[$parameter->code])) {
				if ($parameter->type == 'dictionary') {
					if (isset($parameter->value)) {
						$value = "";
						foreach ($parameter->dictionary as $d_value) {
							if ($parameter->value == $d_value->id) {
								$value = $d_value->text;
							}
						}
						$data[$_fields[$parameter->code]] = $value;
					}
				} else {
					$data[$_fields[$parameter->code]] = isset($parameter->value) ? $parameter->value : '';
				}
			}
		}
		return $data;
	}

	protected function getFields($claims_type)
	{
		$type_key = 'type_' . strval($claims_type);
		return isset($this->fields[$type_key]) ? $this->fields[$type_key] : $this->fields['common'];
	}

	protected function getFieldCode($field_name)
	{
		$out = [];
		$_fields = $this->getFields($this->claim->field_claims_type->value);
		foreach ($_fields as $field_api_name => $node_fields) {
			if (is_array($node_fields) && count($node_fields) > 0) {
				if (array_search($field_name, $node_fields) !== false || array_search(str_replace('field_', '', $field_name), $node_fields) !== false) {
					$out[] = $field_api_name;
				}
			} else {
				if ($node_fields == $field_name || $node_fields == str_replace('field_', '', $field_name)) {
					$out[] = $field_api_name;
				}
			}
		}
		if (count($out) == 1) {
			return $out[0];
		} elseif (count($out) > 1) {
			return $out;
		} else {
			return null;
		}
	}

	public function addExtraInfo($claim, $extra_info, $mode = null)
	{
		$this->claim = $claim;
		$this->extra_info_node = $extra_info;
		$this->user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$types = $extra_info->type->getValue();
		$type = array_shift($types);
		$fields = $this->get('tarkett_claims.claims_class_utils')->get_datatype_form_fields($type['target_id']);
		$parametrs = [];

		foreach ($fields as $field_name => $field_data) {
			$code = $this->getFieldCode($field_name);
			if (!$code)
				continue;
			$values = $extra_info->$field_name->getValue();
			$value = array_shift($values);
			$value = isset($value['value']) ? $value['value'] : '';
			$value = strip_tags($value);

			$parametr = [];
			if (is_array($code) && count($code) > 0) {
				foreach ($code as $code_version) {
					$parametr[] = [
						'code' => $code_version,
						'value' => strip_tags($value),
					];
				}
			} else {
				$parametr[] = [
					'code' => $code,
					'value' => strip_tags($value),
				];
			}
			if (trim($value) != '') {
				$parametrs = array_merge($parametrs, $parametr);
			}
		}
		$result = $this->updateProcessData($claim->field_process_uid->value, $this->user->field_uid->value, ['parametrs' => $parametrs], $mode);
		$claim->field_clientupdateuid = isset($result['result']->clientUpdateUid) ? $result['result']->clientUpdateUid : "";
		$claim->save();
	}

	/*
	  public function addExtraInfo($claim, $extra_info, $mode = null)
	  {
	  $this->claim = $claim;
	  $this->extra_info_node = $extra_info;
	  $this->user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
	  $types = $extra_info->type->getValue();
	  $type = array_shift($types);
	  $fields = $this->get('tarkett_claims.claims_class_utils')->get_datatype_form_fields($type['target_id']);
	  >>>>>>> bcdcde3a184041c49b8e933b1d7215e766c6e111
	  foreach ($fields as $field_name => $field_data) {
	  $code = $this->getFieldCode($field_name);
	  if (!$code)
	  continue;
	  $values = $extra_info->$field_name->getValue();
	  $value = array_shift($values);
	  $value = isset($value['value']) ? $value['value'] : '';
	  $value = strip_tags($value);

	  $parametr = [];
	  if (is_array($code) && count($code) > 0) {
	  foreach ($code as $code_version) {
	  $parametr[] = [
	  'code' => $code_version,
	  'value' => strip_tags($value),
	  ];
	  }
	  } else {
	  $parametr[] = [
	  'code' => $code,
	  'value' => strip_tags($value),
	  ];
	  }
	  if (trim($value) != '') {
	  $parametrs = array_merge($parametrs, $parametr);
	  }
	  }
	  $result = $this->updateProcessData($claim->field_process_uid->value, $this->user->field_uid->value, ['parametrs' => $parametrs], $mode);
	  $claim->field_clientupdateuid = isset($result['result']->clientUpdateUid) ? $result['result']->clientUpdateUid : "";
	  $claim->save();
	  }
	 */

	public function createProcess($data)
	{

		$this->claim = $data['claim'];
		$consumer_info = isset($data['consumer_info']) ? $data['consumer_info'] : null;
		$problems = $data['problems'];
		unset($data['problems']);
		$this->user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$files = [];
		if (count($problems) > 0) {
			foreach ($problems as $key => $problem) {
				$files = array_merge($files, $this->attachFiles($problem->field_test_image->getValue(), "№{$this->claim->nid->value}, изображение к дефекту №" . ($key + 1)));
				$files = array_merge($files, $this->attachFiles($problem->field_video_defekta->getValue(), "№{$this->claim->nid->value}, видеоматериал к дефекту №" . ($key + 1)));
				$files = array_merge($files, $this->attachFiles($problem->field_opisanie_defekta_v_faile->getValue(), $problem->title->value . " PDF"));
			}
		}
		if (isset($consumer_info)) {
			$files = array_merge($files, $this->attachFiles($consumer_info->field_c_check_photo->getValue(), "№{$this->claim->nid->value}, Фото чека"));
		}
		if (isset($this->claim->field_photo_pokupatel)) {
			$files = array_merge($files, $this->attachFiles($this->claim->field_photo_pokupatel->getValue(), "№{$this->claim->nid->value}, Фото дефекта"));
		}
		if (isset($this->claim->field_video_pokupatel)) {
			$files = array_merge($files, $this->attachFiles($this->claim->field_video_pokupatel->getValue(), "№{$this->claim->nid->value}, Видеоматериал"));
		}
		if (isset($this->claim->field_photo_magazin)) {
			$files = array_merge($files, $this->attachFiles($this->claim->field_photo_magazin->getValue(), "№{$this->claim->nid->value}, Фото дефекта - магазин"));
		}
		if (isset($this->claim->field_video_magazin)) {
			$files = array_merge($files, $this->attachFiles($this->claim->field_video_magazin->getValue(), "№{$this->claim->nid->value}, Видеоматериал - магазин"));
		}
		if (isset($this->claim->field_fotokopii_pretenzii)) {
			$files = array_merge($files, $this->attachFiles($this->claim->field_fotokopii_pretenzii->getValue(), "№{$this->claim->nid->value}, Фото бланка претензии"));
		}
		$new_process = $this->get('tarkett_api.index')->process_create([
			"userUid" => $this->getUserUid(),
			"process" => [
				"typeId" => $this->process_types[$this->claim->field_claims_type->value]['id'],
				"title" => $this->process_types[$this->claim->field_claims_type->value]['title'] . " #" . $this->claim->nid->value,
				"authorContactUid" => $this->getUserUid(),
				"description" => $this->claim->field_defect_text->value
			],
			"startState" => [
				"plannedStartTime" => date('Y-m-d') . "T13:00:13.521Z",
				"plannedFinishTime" => date('Y-m-d', strtotime("+10 days")) . "T13:30:13.521Z",
				"importanceId" => 2,
				"responsibleContactUid" => $this->getUserUid(),
				"description" => $this->claim->field_defect_text->value
			]
		]);

		if ($new_process['result'] !== false) {
			$this->claim->field_process_uid = $new_process['result']->processUid;
			$this->claim->field_schemeuid = $new_process['result']->stateSchemeUid;
			$this->claim->field_stateuid = $new_process['result']->stateUid;

			$parametrs = [];
			$widgets = [];
			foreach ($data as $node) {
				if ($node === false || $node === null)
					continue;
				$types = $node->type->getValue();
				$type = array_shift($types);
				$fields = $this->get('tarkett_claims.claims_class_utils')->get_datatype_form_fields($type['target_id']);
				if (isset($node->field_d_foto)) {
					$files = array_merge($files, $this->attachFiles($node->field_d_foto->getValue()));
				}
				if (isset($node->field_d_docs)) {
					$files = array_merge($files, $this->attachFiles($node->field_d_docs->getValue()));
				}
				if (isset($node->field_d_video)) {
					$files = array_merge($files, $this->attachFiles($node->field_d_video->getValue()));
				}
				foreach ($fields as $field_name => $field_data) {
					$code = $this->getFieldCode($field_name);
					if (!$code)
						continue;
					if ($code == 'ru.claims.purchase.address') {
						$c_city_v = $node->field_c_city->getValue();
						$c_city = array_shift($c_city_v);
						$c_city = $c_city['value'];
						$c_street_v = $node->field_c_street->getValue();
						$c_street = array_shift($c_street_v);
						$c_street = $c_street['value'];
						$c_home_num_v = $node->field_c_home_num->getValue();
						$c_home_num = array_shift($c_home_num_v);
						$c_home_num = $c_home_num['value'];

						$value = $c_city . ' ' . $c_street . ' ' . $c_home_num;
					} elseif ($field_name == 'field_distributor_invoices') {
						if (count($node->$field_name->count()) > 0) {
							$invoices = "";
							$invoices_xml = "<documents>";
							foreach ($node->$field_name as $val) {
								$in_title = $node->$field_name->entity->title->value;
								$in_date = $node->$field_name->entity->field_data->value . "T13:00:13.521Z";
								$invoices .="Счет фактура №{$in_title} Дата:{$in_date} ; "; //Счет фактура №{input1.1} Дата:{input1.2} ;
								$invoices_xml .= "<document type='invoice' no='{$in_title}' date='{$in_date}'></document>";
							}
							$invoices_xml .= "</documents>";
							$widgets[] = [
								"code" => "WorkDocuments",
								"group" => "process",
								"data" => $invoices_xml
							];
						}
						$value = $invoices;
					} elseif ($field_name == 'field_products_with_defects') {
						if (count($node->$field_name->count()) > 0) {
							$products_with_defects = ""; //product_design
							$products_with_defects_xml = "<documents>";
							foreach ($node->$field_name as $val) {
								$design = $node->$field_name->entity->field_dizain->value;
								$bad_count = $node->$field_name->entity->field_count->value;
								$rolls_num = $node->$field_name->entity->field_rolls_num->value;
								$price = $node->$field_name->entity->field_price->value;
								$products_with_defects .="Дизайн №{$design} Колличество брака:{$bad_count} Стоимость:{$rolls_num} Номера рулонов:{$price} ; "; //Счет фактура №{input1.1} Дата:{input1.2} ;
							}
							$products_with_defects_xml .= "</documents>";
						}
						$value = $products_with_defects;
					} else {
						$values = $node->$field_name->getValue();
						$value = array_shift($values);
						$value = $value['value'];
					}
					$value = strip_tags($value);

					if (is_array($code) && count($code) > 0) {
						$parametr = [];
						foreach ($code as $code_version) {
							$parametr[] = [
								'code' => $code_version,
								'value' => strip_tags($value),
							];
						}
					} else {
						$parametr = [
							'code' => $code,
							'value' => strip_tags($value),
						];
					}
					if (trim($value) != '') {
						if (is_array($code) && count($code) > 0) {
							$parametrs = array_merge($parametrs, $parametr);
						} else {
							$parametrs[] = $parametr;
						}
					}
				}
			}
			$result = $this->updateProcessData($new_process['result']->processUid, $this->user->field_uid->value, ["parametrs" => $parametrs, "files" => $files, "widgets" => $widgets], 'add');
			$this->claim->field_clientupdateuid = isset($result['result']->clientUpdateUid) ? $result['result']->clientUpdateUid : '';
			//$this->get('tarkett_claims.claims_class_utils')->setStatus($this->claim, $this->process_state['result']);
			$this->claim->save();
		}

	}

	protected function getApiCompany($data, $type)
	{
		$c_uid = null;
		foreach ($data as $contact) {

			if ($contact->code == $type && isset($contact->contact->uid)) {
				if (!property_exists($contact, 'contact') ||
						!$contact->contact) {
					continue;
				}
				$c_uid = $contact->contact->uid;
			}
		}
		if ($c_uid == null)
			return false;
		$shop = $this->get('tarkett_api.index')->company_get([
			'contactUid' => $c_uid,
		]);
		return $shop['result'];
	}

	public function getState($name)
	{
		foreach ($this->process_state['result']->state->parameters as $parameter) {
			if ($parameter->code == $name && isset($parameter->value)) {
				return $parameter->value;
			}
		}
		if (isset($this->process_brief)) {
			foreach ($this->process_brief['result']->parameters as $parameter) {
				if ($parameter->code == $name && isset($parameter->value)) {
					return $parameter->value;
				}
			}
		}
		return '';
	}

	protected function checkNode($datatype)
	{
		switch ($datatype) {
			case "obrasenie_pretenzia":
				$process_is_finished = !empty($this->process_state['result']->process->finishTime);
				if ($process_is_finished) {
					$this->process_brief = $this->get('tarkett_api.index')->process_getBrief([
						'processUid' => $this->process_state['result']->process->uid,
					]);
					$this->claim->field_conclusion_reject_reason = $this->getState('ru.claims.purchase.tarkett_conclusion_reject_reason');
					$this->claim->field_conclusion = $this->getState('ru.claims.purchase.tarkett_conclusion');

					// $this->process_state = $this->get('tarkett_api.index')->process_getState([
					// 	'userUid' => $this->getUserUid(),
					// 	'processUid' =>  $this->process_state['result']->process->uid,
					// 	'stateUid' => $this->process_state['result']->structure->connections[count($this->process_state['result']->structure->connections)-1]->destinationStateUid,
					// ]);
				}

				$prev_v_arhive = $this->claim->field_v_arhive->value;

				$this->claim->field_process_uid = $this->process_state['result']->process->uid;
				$this->claim->field_schemeuid = $this->process_state['result']->state->schemeUid;
				$this->claim->field_stateuid = $this->process_state['result']->state->uid;
				$this->claim->field_useruid = $this->process_state['result']->process->authorContact->uid;
				// $this->claim->field_responsiblecontactuid = $this->process_state['result']->state->responsibleContact->uid;
				$this->claim->field_responsiblecontactuid = $process_is_finished ? '' : $this->process_state['result']->state->responsibleContact->uid;
				$this->claim->field_v_arhive = $process_is_finished;
				$this->claim->field_lastupdated = $this->lastUpdated;
				$this->claim->field_agent_visit = $this->getState('ru.claims.purchase.agent_visit');
				$this->claim->field_agent_visit_date = $this->getState('ru.claims.purchase.agent_visit_date');
				$this->claim->field_agent_visit_result = $this->getState('ru.claims.purchase.agent_visit_result');
				$this->claim->field_sample_request = $this->getState('ru.claims.purchase.sample_request');
				$this->claim->field_sample_test_date = $this->getState('ru.claims.purchase.sample_test_date');
				$this->claim->field_sample_request_date = $this->getState('ru.claims.purchase.sample_request_date');
				$this->claim->field_conclusion_reject_reason = $this->getState('ru.claims.purchase.tarkett_conclusion_reject_reason');
				$this->claim->field_conclusion = $this->getState('ru.claims.purchase.tarkett_conclusion');

				if ($this->claim->field_v_arhive->value && !$prev_v_arhive) {
					if (($values = $this->claim->field_privazka_magazina->getValue()) &&
						(0 < count($values)) &&
						(isset($values[0]['target_id'])) &&
						(0 < $values[0]['target_id'])) {
						$this->claim->field_market_just_closed = true;
					}
					if (($values = $this->claim->field_privazka_distributor->getValue()) &&
						(0 < count($values)) &&
						(isset($values[0]['target_id'])) &&
						(0 < $values[0]['target_id'])) {
						$this->claim->field_distributor_just_closed = true;
					}
				}

				break;
			case "dannye_pokupatela":
				$pokupatel = $this->get('tarkett_claims.claims_class_utils')->get_user_by_field('field_uid', $this->process_state['result']->process->uid);
				if (!$pokupatel)
					return false;
				$data = $this->process_data($this->process_state['result']->state->parameters);
				$data['field_c_fio'] = $pokupatel->field_user_fio->value;
				$data['field_c_email'] = $pokupatel->field_user_email->value;
				$data['field_c_phone'] = $pokupatel->field_user_phone->value;
				$this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_consumer_info($this->claim, $data);
				break;
			case "dannye_magazina":
				$shop = $this->getApiCompany($this->process_state['result']->state->contacts, "Shop");
				if (!$shop)
					return false;
				$s_user = $this->get('tarkett_claims.claims_class_utils')->get_user_by_field('field_contactuid', $shop->contactUid);
				if (!$s_user) {
					$s_user = $this->createAccount($shop, 'magazin');
				}
				$this->claim->field_privazka_magazina->setValue($s_user->uid->value);
				break;
			case "dannye_distributora":
				$distr = $this->getApiCompany($this->process_state['result']->state->contacts, 'Distributor');
				if (!$distr)
					return false;
				$s_user = $this->get('tarkett_claims.claims_class_utils')->get_user_by_field('field_contactuid', $distr->contactUid);
				if (!$s_user) {
					$s_user = $this->createAccount($distr, 'distributor');
				}
				if ($this->claim->field_privazka_distributor->count() == 0) {
					$this->claim->field_privazka_distributor->setValue($s_user->uid->value);
				}

				// Работаем с файлами Таркетта
				$this->checkFiles();

				break;
			case "answers":
				if ($this->claim->field_answers->count() == 0 && $this->getState("ru.claims.purchase.tarkett_conclusion") != "") {

					if (!empty($this->process_state['result']->process->finishTime) == true && ($this->process_state['result']->state->schemeUid == "4735af89-a4e1-4bea-a56c-e2e3a6ab6805")) {
						$PrevState = $this->get('tarkett_api.index')->process_getState([
							'userUid' => $this->getUserUid(),
							'processUid' => $this->process_state['result']->process->uid,
							'stateUid' => $this->process_state['result']->structure->connections[count($this->process_state['result']->structure->connections) - 2]->destinationStateUid,
						]);
					} else {
						$PrevStateUid = $this->getPrevStateUid($this->process_state['result']->state->uid, $this->process_state['result']->structure->connections);
						$PrevState = $this->get('tarkett_api.index')->process_getState([
							'userUid' => $this->getUserUid(),
							'processUid' => $this->process_state['result']->process->uid,
							'stateUid' => $PrevStateUid,
						]);
					}

					$comment = "";
					$comment = $this->getState("ru.claims.purchase.tarkett_conclusion_reject_reason");
					if (trim($comment) == "") {
						$comment = $PrevState['result']->state->commentary->text;
					}
					if ($comment != '') {
						$this->get("tarkett_claims.claims_class_forms_extra_data_add")->add_answer($this->claim, 'answer_tarkett', $comment, $PrevStateUid);
					}
				}
				break;
		}
	}

	protected function getPrevStateUid($currentStateUid, $connections)
	{
		foreach ($connections as $connection) {
			if ($connection->destinationStateUid == $currentStateUid) {

				return $connection->sourceStateUid;
			}
		}
	}

	protected function updateProcessData($p_uid, $uid, $data = [], $mode = null)
	{
		$parametrs = $data['parametrs'];
		$files = isset($data['files']) ? $data['files'] : [];
		$this->process_state = $this->get('tarkett_api.index')->process_getState([
			'userUid' => $this->getUserUid(),
			'processUid' => $p_uid,
		]);



		$parametrs = $this->processParametrs($this->process_state['result']->state->parameters, $parametrs);
		$request = [
			"userUid" => $this->getUserUid(),
			"clientUpdateUid" => $this->process_state['result']->clientUpdateUid,
			"processUid" => $p_uid,
			"state" => [
				"uid" => $this->process_state['result']->state->uid,
				"importanceId" => 1,
				"commentary" => "",
				"parameters" => $parametrs,
				"files" => $files,
			],
		];
		$this->getNextState($request, $this->process_state['result'], $mode);

		return $this->sendProcessUpdate($request);
	}

	protected function sendProcessUpdate($parametrs)
	{

		$res = $this->get('tarkett_api.index')->process_putStateAndNewState($parametrs);
		$this->process_state = $this->get('tarkett_api.index')->process_getState([
			'userUid' => $this->getUserUid(),
			'processUid' => $parametrs['processUid'],
		]);
		$this->checkNode('obrasenie_pretenzia');
		$is_changed = $this->get('tarkett_claims.claims_class_utils')->setStatus($this->claim, $this->process_state['result']);
		$this->sendNotify($is_changed);
	}

	protected function createAccount($data, $type)
	{
		$ts = new TarkettSite();
		$found_acc = $ts->findUserBySession("no", $data->contactUid);
		$found_acc = \GuzzleHttp\json_decode($found_acc);
		if ($found_acc !== false) {
			$info = [
				'name' => $found_acc->nickname,
				'mail' => $found_acc->email,
				'pass' => $found_acc->password_hash,
				'status' => 1,
				'roles' => [$type],
				'field_uid' => $data->UserUID,
				'field_contactuid' => $data->CompanyUID,
				'field_ur_lico_name' => $found_acc->company_name,
				'field_user_fio' => $found_acc->name,
				'field_user_phone' => $found_acc->phone,
			];
		} else {
			$info = [
				'name' => $data->fullName,
				'mail' => 'test-' . date('d-m-Y-H-i-s') . '@test.com',
				'pass' => $data->fullName,
				'status' => 1,
				'roles' => [$type],
				'field_contactuid' => $data->contactUid,
			];
		}
		$user = User::create($info);
		$user->save();
		return $user;
	}

	protected function attachFiles($attachFiles, $description = "")
	{

		$files = [];
		if (count($attachFiles) > 0) {
			$count = 0;
			foreach ($attachFiles as $file_id) {
				$count++;
				$file = \Drupal\file\Entity\File::load($file_id['target_id']);

				$type = pathinfo($file->getFileUri(), PATHINFO_EXTENSION);
				if (($res = $this->get('tarkett_api.index')->process_putFile(['content' => trim(base64_encode(file_get_contents($file->getFileUri())))])) &&
					isset($res['result']) && $res['result']) {
					$files[] = [
						"group" => "process",
						"fileUid" => $res['result']->fileUid,
						"name" => $file->getFilename(),
						"size" => $file->getSize(),
						"description" => $description . (count($attachFiles) > 1 ? ' файл №' . $count : '')
					];
				}
			}
		}
		return $files;
	}


	// Проверка и выгрузка к нам файлов от Таркетта
	protected function checkFiles()
	{
		// Работа с файлами доступна только в Претензии дистрибьютора (процесс 53)
		if (4 != $this->claim->field_claims_type->value) {
			return;
		}

		// Работа с файлами доступна только, если
		// есть связанный блок данных дистрибьютора, и
		// в ответе BPM API есть список файлов
		if (!($distr = $this->claim->field_dannye_distributora->getValue()) ||
			(0 == count($distr)) ||
			!($state_files = $this->process_state['result']->state->files) ||
			(0 == count($state_files))) {
			return;
		}

		$dannye = \Drupal\node\Entity\Node::load($distr[0]['target_id']);
		$needs_to_save = false;

		// Читаем список ID сведений о файлах дистрибьютора
		$ids = [];
		$list = $dannye->field_d_file_list->getValue();
		foreach ($list as $item) {
			$ids[] = $item['target_id'];
		}

		// Загружаем сведения о файлах и формируем проверочный словарь
		$list = \Drupal\node\Entity\Node::loadMultiple($ids);
		$check_file = [];
		foreach ($list as $item) {
			// Если есть UUID из системы Таркетта, используем его как ключ
			if ($item->field_f_api_uuid->value) {
				$check_file[$item->field_f_api_uuid->value] = $item;
			// Иначе используем имя файла как ключ
			} else {
				$check_file[$item->field_f_filename->value] = $item;
			}
		}

		// Проверяем путь к папке для хранения файлов
		$tarkett_path = 'public://tarkett/distributor_info/' . $this->claim->nid->value . '/';

		// Разбираем данные о файлах из ответа BPM API
		foreach ($state_files as $state_file) {
			// Обработка данных файла:

			$uuid = $state_file->fileUid;
			$name = $state_file->name;

			// - уже известные нам файлы не рассматриваются
			if (isset($check_file[$uuid])) {
				continue;

			// - ранее закачанным нами файлам выставляем UUID
			} elseif (isset($check_file[$name])) {
				$f_node = $check_file[$name];
				if ($uuid != $f_node->field_f_api_uuid->value) {
					$f_node->field_f_api_uuid = $uuid;
					$f_node->save();
				}

			// - скачиваем и добавляем новые файлы от Таркетта
			} else {
				if (!($downloaded = $this->get('tarkett_api.index')->process_getFile(['fileUid' => $uuid])) ||
					$downloaded['errors']) {
					continue;
				}

				if (is_dir($tarkett_path) === false) {
					mkdir($tarkett_path, 0755, true);
				}

				// Сохраняем скачанный файл в соответствующей папке
				$tarkett_file = file_save_data(
					base64_decode($downloaded['result']->content),
					$tarkett_path . $name,
					FILE_EXISTS_REPLACE
				);
				// Добавляем файл в список файлов Таркетта
				$tarkett_files = $dannye->field_d_tarkett_files->getValue();
				$tarkett_files[] = ['target_id' => $tarkett_file->id()];
				$dannye->field_d_tarkett_files->setValue($tarkett_files);

				// Создаём блок сведений о новом файле
				$f_node = Node::create([
					'type' => 'file_info',
					'title' => 'Сведения о файле Дистрибьютора ' . $name . ' (№' . $this->claim->nid->value . ')',
					'field_f_fieldname' => 'field_d_tarkett_files',
					'field_f_filename' => $name,
					'field_f_drupal_id' => $tarkett_file->id(),
					'field_f_api_uuid' => $uuid,
				]);
				$f_node->save();
				// Добавляем сведения о файле в список сведений
				$file_list = $dannye->field_d_file_list->getValue();
				$file_list[] = ['target_id' => $f_node->id()];
				$dannye->field_d_file_list->setValue($file_list);

				$needs_to_save = true;
			}
		}

		if ($needs_to_save) {
			$dannye->save();
		}
	}

	protected function setStateToParametrs($code, $value, &$parameters)
	{
		foreach ($parameters as $key => $val) {
			if ($val['code'] == $code) {
				$parameters[$key]['value'] = $value;
			}
		}
	}

	protected function getNextState(&$request, $process, $mode)
	{
		$reject = false;
		if (preg_match("/_reject/", $mode)) {
			$mode = str_replace("_reject", "", $mode);
			$reject = true;
		}
		switch ($mode) {
			case "add":
				$state_index = 0;
				switch ($this->claim->field_claims_type->value) {
					case 1:
						$state_index = 0;
						$contacts = [
							"state" => [
								"contacts" => [
									[
										'caption' => 'Покупатель',
										'useNotifications' => false,
										'allowChange' => true,
										'group' => 'process',
										'required' => true,
										'code' => 'EndConsumer',
										"contact" => [
											"type" => 'Person',
											"uid" => $this->user->field_uid->value,
											"text" => $this->user->field_user_fio->value
										]
									]
								]
							]
						];
						$responsibleContactUid = $this->tarkett;
						break;
					case 2:
						if ($this->claim->field_dannye_pokupatela->count() > 0) {
							$responsibleContactUid = $this->user->field_uid->value;
							$contacts['state']['contacts'][] = [
								'caption' => 'Покупатель',
								'useNotifications' => false,
								'allowChange' => true,
								'group' => 'process',
								'required' => true,
								'code' => 'EndConsumer',
								"contact" => [
									"type" => 'Person',
									"uid" => $this->claim->uid->entity->field_uid->value,
									"text" => $this->claim->field_dannye_pokupatela->entity->field_c_fio->value
								]
							];
						}
						if (array_search("magazin", $this->user->getRoles())) {
							$state_index = 0;
							$responsibleContactUid = $this->user->field_contactuid->value;
							$contacts['state']['contacts'][] = [
								'caption' => 'Магазин',
								'useNotifications' => false,
								'allowChange' => true,
								'group' => 'process',
								'required' => true,
								'code' => 'Shop',
								"contact" => [
									"type" => 'Person',
									"uid" => $this->user->field_contactuid->value,
									"text" => $this->user->field_user_fio->value
								]
							];
						} elseif (array_search("distributor", $this->user->getRoles())) {
							$state_index = 1;
							$responsibleContactUid = $this->user->field_contactuid->value;
							$contacts['state']['contacts'][] = [
								'caption' => 'Дистрибьютор',
								'useNotifications' => false,
								'allowChange' => true,
								'group' => 'process',
								'required' => true,
								'code' => 'Distributor',
								"contact" => [
									"type" => 'Person',
									"uid" => $this->user->field_contactuid->value,
									"text" => $this->user->field_user_fio->value
								]
							];
						}
						break;
					case 3:
						if (array_search("magazin", $this->user->getRoles())) {
							$state_index = 0;
							$responsibleContactUid = $this->claim->field_privazka_distributor->entity->field_contactuid->value;
							$contacts['state']['contacts'][] = [
								'caption' => 'Магазин',
								'useNotifications' => false,
								'allowChange' => true,
								'group' => 'process',
								'required' => true,
								'code' => 'Shop',
								"contact" => [
									"type" => 'Person',
									"uid" => $this->user->field_contactuid->value,
									"text" => $this->user->field_user_fio->value
								]
							];
							$contacts['state']['contacts'][] = [
								'caption' => 'Дистрибьютор',
								'useNotifications' => false,
								'allowChange' => true,
								'group' => 'process',
								'required' => true,
								'code' => 'Distributor',
								"contact" => [
									"type" => 'Person',
									"uid" => $this->claim->field_privazka_distributor->entity->field_contactuid->value,
									"text" => $this->claim->field_privazka_distributor->entity->field_user_fio->value
								]
							];
						}
						break;
					case 4:
						$state_index = 0;
						$responsibleContactUid = $this->tarkett;
						$contacts['state']['contacts'][] = [
							'caption' => 'Дистрибьютор',
							'useNotifications' => false,
							'allowChange' => true,
							'group' => 'process',
							'required' => true,
							'code' => 'Distributor',
							"contact" => [
								"type" => 'Person',
								"uid" => $this->user->field_contactuid->value,
								"text" => $this->user->field_user_fio->value
							]
						];
						$needle = "ru.claims.purchase.distributor_claim_type";
						$result = array_filter($request['state']['parameters'], function($innerArray) use ($needle) {
							$val = ($innerArray['code'] == $needle) ? $innerArray['value'] : false;
							return $val;
						});
						if ($result[1]['value'] == 2) {
							$this->setStateToParametrs("ru.claims.purchase.provide_sample", false, $request['state']['parameters']);
							$this->setStateToParametrs("ru.claims.purchase.defect_type", "", $request['state']['parameters']);
						}
						break;
				}
				$nextState = $process->state->nextStatesData[$state_index];

				$p = [
					'actionCode' => $nextState->code,
					'nextState' => [
						"title" => $nextState->text,
						"plannedStartTime" => $nextState->nextState->plannedStartTime->time,
						"plannedFinishTime" => $nextState->nextState->plannedFinishTime->time,
						"importanceId" => 1,
						"responsibleContactUid" => $responsibleContactUid,
					]
				];
				if (isset($contacts)) {
					$request = array_merge_recursive($request, $contacts);
				}
				$request = array_merge($request, $p);

				break;
			case "add_market_info":
				if ($reject === false) {
					$state = 0;

					$privazka_distributor = $this->claim->field_privazka_distributor->getValue();
					$distr_info = \Drupal\user\Entity\User::load($privazka_distributor[0]['target_id']);
					$fio = $distr_info->field_user_fio->getValue();
					$uid = $distr_info->field_contactuid->getValue();
					$uid = $uid[0]['value'];
					$contacts = [
						"state" => [
							"contacts" => [
								[
									'caption' => 'Дистрибьютор',
									'useNotifications' => false,
									'allowChange' => true,
									'group' => 'process',
									'required' => true,
									'code' => 'Distributor',
									"contact" => [
										"type" => 'Person',
										"uid" => $uid,
										"text" => $fio[0]['value']
									]
								]
							]
						]
					];
					$request['state']['commentary'] = htmlspecialchars($_POST['market_consumer_comments']);
					$this->addComment($request['state']['commentary']);
				} else {
					$state = 1;
					$request['state']['commentary'] = htmlspecialchars($_POST['market_consumer_comments']);
					$this->addComment($request['state']['commentary']);

					$this->get("tarkett_claims.claims_class_forms_extra_data_add")->add_answer($this->claim, 'answer_magazin', htmlspecialchars($_POST['market_consumer_comments']), true);
					$uid = $this->tarkett;
				}
				$nextState = $process->state->nextStatesData[$state];
				$p = [
					'actionCode' => $nextState->code,
					'nextState' => [
						"title" => $nextState->text,
						"plannedStartTime" => $nextState->nextState->plannedStartTime->time,
						"plannedFinishTime" => $nextState->nextState->plannedFinishTime->time,
						"importanceId" => 1,
						"responsibleContactUid" => $uid,
					]
				];
				if (isset($contacts)) {
					$request = array_merge_recursive($request, $contacts);
				}
				$request = array_merge($request, $p);
				break;
			case "add_distributor_info":
				if ($reject === false) {
					$state = 0;
					$responsibleContactUid = $this->tarkett;
				} else {
					$state = 1;
					$this->get("tarkett_claims.claims_class_forms_extra_data_add")->add_answer($this->claim, 'answer_distributor', htmlspecialchars($_POST['distributor_consumer_comments']), true);


					$shop = $this->getApiCompany($process->state->contacts, 'Shop');

					if ($shop !== false) {
						$responsibleContactUid = $shop->contactUid;
					}
				}
				if (!isset($responsibleContactUid)) {
					$responsibleContactUid = $this->claim->uid->entity->field_uid->value;
				}

				$nextState = $process->state->nextStatesData[$state];

				$request['state']['commentary'] = htmlspecialchars($_POST['distributor_consumer_comments']);
				$this->addComment($request['state']['commentary']);
				$p = [
					'actionCode' => $nextState->code,
					'nextState' => [
						"title" => $nextState->text,
						"plannedStartTime" => $nextState->nextState->plannedStartTime->time,
						"plannedFinishTime" => $nextState->nextState->plannedFinishTime->time,
						"importanceId" => 1,
						"responsibleContactUid" => $responsibleContactUid,
					]
				];
				$request = array_merge($request, $p);
				$entity_ref = $this->extra_info_node->get('field_distributor_invoices');
				$invoices = '';
				if ($this->claim->field_claims_type->value != 4) {
					$request['state']['parameters'][] = [
						'code' => 'ru.claims.purchase.distributor_claim_type',
						'value' => 1,
					];
				}
				if ($entity_ref->count() > 0) {
					$invoices_xml = "<documents>";
					foreach ($entity_ref as $entity) {
						$invoices .="Счет фактура №{$entity->entity->title->value} Дата:{$entity->entity->field_data->value} ; "; //Счет фактура №{input1.1} Дата:{input1.2} ;
						$invoices_xml .= "<document type='invoice' no='{$entity->entity->title->value}' date='{$entity->entity->field_data->value}'></document>";
					}
					$invoices_xml .= "</documents>";
					$request['state']['widgets'][] = [
						"code" => "WorkDocuments",
						"group" => "process",
						"data" => $invoices_xml
					];
					$request['state']['parameters'][] = [
						'code' => 'ru.claims.purchase.distributor_tarkett_documents',
						'value' => $invoices,
					];
					if ($reject === true) {
						$request['state']['parameters'][] = [
							'code' => 'ru.claims.purchase.tarkett_conclusion_reject_reason',
							'value' => $request['state']['commentary'],
						];
					}
				}
				break;
			case "add_distributor_answer":

				if (empty($this->claim->field_privazka_magazina->getValue())) {
					$state = 1;
				} else {
					$state = 0;
				}

				$nextState = $process->state->nextStatesData[$state];
				$shop = $this->getApiCompany($process->state->contacts, 'Shop');
				$p = [
					'actionCode' => $nextState->code,
					'nextState' => [
						"title" => $nextState->text,
						"plannedStartTime" => $nextState->nextState->plannedStartTime->time,
						"plannedFinishTime" => $nextState->nextState->plannedFinishTime->time,
						"importanceId" => 1,
						"responsibleContactUid" => $shop->contactUid,
					]
				];
				$request = array_merge($request, $p);
				break;
			case "add_magazin_answer":
				$nextState = $process->state->nextStatesData[0];
				$p = [
					'actionCode' => $nextState->code,
					'nextState' => [
						"title" => $nextState->text,
						"plannedStartTime" => $nextState->nextState->plannedStartTime->time,
						"plannedFinishTime" => $nextState->nextState->plannedFinishTime->time,
						"importanceId" => 1,
					]
				];
				$request = array_merge($request, $p);
				break;
			case "add_consumer_requirements":
				$request['state']['commentary'] = htmlspecialchars($_POST['requirement']);
				$this->addComment($request['state']['commentary']);
				$nextState = $process->state->nextStatesData[0];
				$p = [
					'actionCode' => $nextState->code,
					'nextState' => [
						"title" => $nextState->text,
						"plannedStartTime" => $nextState->nextState->plannedStartTime->time,
						"plannedFinishTime" => $nextState->nextState->plannedFinishTime->time,
						"importanceId" => 1,
						"responsibleContactUid" => $this->tarkett,
					]
				];
				$request = array_merge($request, $p);
				break;
		}
		$this->attachFieldsFromGetState($request, ['state', 'contacts']);
		$this->attachFieldsFromGetState($request, ['state', 'files']);
	}

	protected function attachFieldsFromGetState(&$request, $fieldpath)
	{
		$out = $this->process_state['result'];
		foreach ($fieldpath as $path) {
			$out = $out->$path;
		}
		if (array_search('contacts', $fieldpath) !== false) {
			if (isset($request['state']['contacts']) && count($request['state']['contacts']) > 0) {
				foreach ($out as $contact) {
					$dublicat = false;
					foreach ($request['state']['contacts'] as $s_contact) {
						$t = (array) $s_contact;
						if ($t['code'] == $contact->code) {
							$dublicat = true;
						}
					}
					if ($dublicat !== true) {
						$request['state']['contacts'][] = $contact;
					}
				}
			} else {
				$request['state']['contacts'] = $out;
			}
		}
		if (array_search('files', $fieldpath) !== false) {

			if (isset($request['state']['files']) && count($request['state']['files']) > 0) {

				foreach ($out as $file) {
					$dublicat = false;

					foreach ($request['state']['files'] as $s_file) {
						$t = (array) $s_file;
						if ($t['fileUid'] == $file->fileUid) {
							$dublicat = true;
						}
					}
					if ($dublicat !== true) {
						$request['state']['files'][] = $file;
					}
				}
			} else {
				$request['state']['files'] = $out;
			}
		}
	}

	protected function getUserUid()
	{
		if (\Drupal::currentUser()->isAnonymous() === true && isset($this->claim)) {
			return $this->claim->uid->entity->field_uid->value;
		} else {
			$uid = "";
			if (array_search("magazin", $this->user->getRoles()) !== false || array_search("distributor", $this->user->getRoles()) !== false) {
				$uid = $this->user->field_contactuid->value;
			} else {
				$uid = $this->user->field_uid->value;
			}
		}
		return $uid;
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
