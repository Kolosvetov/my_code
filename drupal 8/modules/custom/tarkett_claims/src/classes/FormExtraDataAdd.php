<?php

namespace Drupal\tarkett_claims\classes;

use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;
use \Drupal\Core\Entity\EntityStorageException;
use \Drupal\taxonomy\Entity\Term;

class FormExtraDataAdd
{

	public $date_input_demiliter = '.';

	public function add_user($email, $passwd, $parms = null)
	{
		try {
			$UserUID = "";
			$CompanyUID = "";
			$fio = '';
			$company_name = '';
			$roles_list = [];
			if (isset($parms)) {
				foreach ($parms->roles as $t_role) {
					$roles_list[] = $t_role->role_name;
				}
				$email = $parms->email!=""? $parms->email: $email;
				$user_name = $parms->name!=""? $parms->name: $parms->nickname;
				$user_phone = $parms->phone;
				$fio = $parms->name;
				$company_name = $parms->company_name;
				$UserUID = $parms->UserUID;
				$CompanyUID = $parms->CompanyUID;
				if ((trim($UserUID) == "" || $UserUID == "0") && trim($UserUID) != "" && trim($UserUID) != "0") {
					$UserUID = $CompanyUID;
				}
			} else {
				$user_name = $this->setFieldValue($_POST, 'field_c_fio');
				$user_phone = $this->setFieldValue($_POST, 'field_c_phone');
			}
			$user = User::create([
						'field_user_email' => $email,
						'field_user_fio' => $fio!=""? $fio:$user_name,
						'field_user_phone' => $user_phone,
						'field_uid' => $UserUID,
						'field_ur_lico_name' => $company_name,
						'field_contactuid' => $CompanyUID,
			]);
			$user->setUsername($email);
			$user->setEmail($email);
			$user->setPassword($passwd);
			if (array_search("distributor", $roles_list) !== false && (trim($CompanyUID) != "" && $CompanyUID != "0")) {
				$user->addRole('distributor');
			} elseif(array_search("retail", $roles_list) !== false && (trim($CompanyUID) != "" && $CompanyUID != "0")) {
				$user->addRole('magazin');
			} else {
				$user->addRole('pokupatel');
			}
			$user->activate();
			$user->save();

			if ($user && $user->field_uid->value == "" && $user->field_contactuid->value == "") {
				$user_name_p = explode(" ", $user_name);
				$person = $this->get('tarkett_api.index')->person_put([
					"lastName" => isset($user_name_p[0]) ? $user_name_p[0] : "",
					"firstName" => isset($user_name_p[1]) ? $user_name_p[1] : "",
					"secondName" => isset($user_name_p[2]) ? $user_name_p[2] : "",
					"phoneNumber" => $user_phone,
					"email" => $email
				]);
				$user->field_uid->setValue($person['result']->contactUid);
				$user->field_contactuid->setValue($person['result']->contactUid);
			}
			$user->save();
		} catch (EntityStorageException $e) {
			return false;
		}
		return $user;
	}

	public function add_claim($data = [], $node = null, $claim_type = 1)
	{
		if (count($data) == 0 && isset($_POST)) {
			$data = $_POST;
		}

		//\Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['field_id'=>(string)$ProductType['ID']])

		$user_roles = \Drupal::currentUser()->getRoles();
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());

		$default_status = $this->get('tarkett_claims.claims_class_utils')->get_term_id_by_code('c-consideration');
		$market_status = [$default_status];
		$distributor_status = [$default_status];
		if ($user_roles[1] == 'magazin') {
			$m_provider = $this->get('tarkett_claims.claims_class_utils')->get_term_id_by_code('m-provider'); //Поставщик
			$market_status = [$m_provider];
		}
		if ($user_roles[1] == 'distributor') {
			$d_heading = $this->get('tarkett_claims.claims_class_utils')->get_term_id_by_code('d-heading'); //d-heading
			$distributor_status = [$d_heading];
		}
		$_date = date('h:i:s d.m.y');
		if ($node == null || $node === false) {
			$node = Node::create([
						'type' => 'obrasenie_pretenzia',
						'title' => 'Обращение ' . $_date,
			]);
		}


//		$node->field_consumer_status = [$this->get('tarkett_claims.claims_class_utils')->get_term_id_by_code('c-shop')];
//		$node->field_market_status = $market_status;
//		$node->field_status_processa_u_distribu = $distributor_status;

		$node->field_product_address_full = ((isset($data['product_address_full']) && $data['product_address_full']) ?
						$data['product_address_full'] :
						"Регион: " . $this->setFieldValue($data, 'product_region') . "<br /> Город: " . $this->setFieldValue($data, 'product_city') . "<br /> Место:" . $this->setFieldValue($data, 'product_address')); //Адрес местонахождения товара

		$node->field_product_address_region = $this->setFieldValue($data, 'product_region'); //Адрес местонахождения товара
		$node->field_product_address_city = $this->setFieldValue($data, 'product_city'); //Адрес местонахождения товара
		$node->field_product_address = $this->setFieldValue($data, 'product_address'); //Адрес местонахождения товара
		$node->field_product_can_show = $this->setFieldValue($data, 'product_can_show'); //Возможно предоставить образец

		$node->field_claims_date = date("Y-m-d"); //Дата обращения
		$node->field_product_cat = $this->setFieldValue($data, 'product_cat'); //Категория продукта
		$node->field_product_name = $this->setFieldValue($data, 'product_name'); //Коллекция
		$node->field_market_name = $this->setFieldValue($data, 'market_name'); //Название магазина
		$node->field_product_price = $this->setFieldValue($data, 'product_price'); //Стоимость
		$node->field_product_count_bad = $this->setFieldValue($data, 'product_count_bad'); //Товар с дефектом
		$node->field_product_count_bad_ez = $this->setFieldValue($data, 'product_count_bad_ez'); //Товара с дефектом, ед.изм.
		$node->field_product_count_all = $this->setFieldValue($data, 'product_count_all'); //Купленное количество товара
		$node->field_product_count_all_ez = $this->setFieldValue($data, 'product_count_all_ez'); //количество товара, ед.изм.
		$node->field_product_condition = $this->setFieldValue($data, 'product_state'); //Состояние продукта
		$node->field_defect_text = $this->setFieldValue($data, 'defect_text'); //Описание проблемы
		$node->field_claims_status = 0;
//		$field_claims_type = $this->setFieldValue($data, 'field_claims_type');
		$node->field_claims_type = $claim_type;
		$node->save();

		$node->title = 'Обращение №' . $node->nid->value . ' - ' . $_date;
		$node->save();

		$this->add_pretenzia_photos($node);

		return $node;
	}

	public function add_answer($node, $code, $comment = "", $no_send_tarkett = false)
	{
		if ($comment == "") {
			$comment = htmlspecialchars($_POST['answer_text']);
		}
		$fields_name = null;
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());

		switch ($code) {
			case "answer_distributor":
				$title = 'Ответ дистрибьютора';
				$fields_name = 'field_d_answer';
				break;
			case "answer_magazin":
				$title = 'Ответ магазина';
				$fields_name = 'field_m_answer';
				break;
			case "answer_tarkett":
				$title = 'Ответ Таркетт';
				$fields_name = 'field_answers';
				break;
			default:
				break;
		}
		if ($node->get($fields_name)->count() > 0)
			return FALSE;
		if ($code != 'answer_tarkett' && $no_send_tarkett === false) {
			$this->get('tarkett_claims.claims_class_updater')->add_answer($node, $user, [
				'userUid' => $user->field_contactuid->value,
				'processUid' => $node->field_process_uid->value,
				'importanceId' => 1,
				'content' => $comment,
			]);
		}
		$answer_node = Node::create([
					'type' => 'answer',
					'title' => $title . ' (№' . $node->nid->value . ')',
					'body' => $comment,
		]);
		$answer_node->save();
		$node->get($fields_name)->setValue($answer_node->nid->value);
		$node->save();
	}


	public function add_problems($defects, $claim)
	{
		if (count($defects['defect_count']) == 0)
			return [];
		$ids = [];

		$problems = [];

		if (4 == $claim->field_claims_type->value) {
			$head_title = 'Претензия дистрибьютора';
		} elseif (3 == $claim->field_claims_type->value) {
			$head_title = 'Претензия магазина';
		} elseif (2 == $claim->field_claims_type->value) {
			$head_title = 'Претензия покупателя';
		} else {
			$head_title = 'Обращение покупателя';
		}
		$head_title .= ' № ' . strval($claim->nid->value);
		$category = '';
		if (($cat_value = $claim->field_product_cat->getValue()) &&
			is_array($cat_value) &&
			isset($cat_value[0]) &&
			isset($cat_value[0]['value'])) {
			$category = $cat_value[0]['value'];
		}

		$defects_data = \Drupal::service('tarkett_claims.claims_class_defects')->getDefects($category);
		$defects_list = ($defects_data && isset($defects_data['defects'])) ? $defects_data['defects'] : [];
		$service_name = 'tarkett_claims.claims_class_forms_' . (($defects_data && isset($defects_data['start'])) ? $defects_data['start'] : '');
		$service = \Drupal::hasService($service_name) ? \Drupal::service($service_name) : null;

		$c_link = $claim->field_dannye_pokupatela->getValue();
		if ($c_link) {
			$consumer = \Drupal\node\Entity\Node::load($c_link[0]['target_id']);
		} else {
			$consumer = null;
		}

		$pdf_dir = 'pdf/defects/' . $claim->nid->value . '/';
		$pdf_path = 'public://' . $pdf_dir;
		if (is_dir($pdf_path) === false) {
			mkdir($pdf_path, 0775, true);
		}

		foreach ($defects['defect_count'] as $defect_num) {
			$defect_type = $defects['defect_type'][$defect_num];
			$defect_keys = explode('_', $defect_type);
			$main_type = $defects_list[$defect_keys[1]]['title'];
			$sub_type = $defects_list[$defect_keys[1]]['rows'][$defect_keys[2]];
			$defect_title = $main_type . ': ' . $sub_type;

			$fields = $service ? $service->$defect_type($defects['defect_status'][$defect_num]) : [];

			$test = $this->get('tarkett_claims.claims_class_utils')->p_fieldset($fields);
			$res = [];
			foreach ($test as $level_1) {
				if (isset($level_1['title'])) {
					continue;
				}
				foreach ($level_1 as $level_2) {
					if (!isset($level_2['title'])) {
						// Теперь есть и "третий уровень" - поля с единицами измерений
						if (is_array($level_2)) {
							foreach ($level_2 as $level_3) {
								if (!is_array($level_3) || !isset($level_3['title']) || (null == $level_3['title'])) {
									continue;
								}
								$res[] = $this->get_problem_data($defects, $defect_num, $level_3);
							}
						}
						continue;
					}
					$res[] = $this->get_problem_data($defects, $defect_num, $level_2);
				}
			}

			$json_defect = [
				'defect' => isset($defects['defect'][$defect_num]) ? $defects['defect'][$defect_num] : [],
				'defect_type' => isset($defects['defect_type'][$defect_num]) ? $defects['defect_type'][$defect_num] : [],
				'defect_status' => isset($defects['defect_status'][$defect_num]) ? $defects['defect_status'][$defect_num] : [],
				'defect_count' => $defects['defect_count'][$defect_num]
			];
			$element = array(
				'#type' => 'markup',
				'#theme' => 'pdf_defects',
				'#head_title' => $head_title,
				'#defect_title' => $defect_title,
				'#fields' => $res,
			);
			if ($consumer) {
				$element['#consumer_fio'] = $consumer->field_c_fio->value;
			}

			$node = Node::create([
						'type' => 'opisanie_problemy',
						'title' => 'Дефект №' . $defect_num . ' (№' . $claim->nid->value . ')',
						'field_opisanie_defekta' => \GuzzleHttp\json_encode($json_defect),
			]);
			$node->save();

			$pdf_name = $claim->nid->value . '_' . $defect_num . '.pdf';
			$pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
			$pdf->SetCreator(PDF_CREATOR);
			$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
			$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
			$pdf->setPrintHeader(false);
			$pdf->setPrintFooter(false);
			$pdf->setFontSubsetting(true);
			$pdf->SetFont('freeserif', '', 10);
			$pdf->AddPage();
			$html = (string) drupal_render($element);
			$pdf->writeHTML($html, true, false, true, false, '');
			$pdf->lastPage();

			$pdf_disk_path = $_SERVER['DOCUMENT_ROOT'] . 'sites/default/files/' . $pdf_dir . $pdf_name;
			$pdf->Output($pdf_disk_path, 'F');
			$data = file_get_contents($pdf_disk_path);
			unlink($pdf_disk_path);
			$file = file_save_data($data, $pdf_path . $pdf_name, FILE_EXISTS_REPLACE);
			$node->field_opisanie_defekta_v_faile = ['target_id' => $file->id()];

			$files_fields = $_FILES['files']['name'];
			$images_ids = [];
			$video_ids = [];

			$images_path = 'public://images/defects/' . $node->nid->value . '/';
			$video_path = 'public://video/defects/' . $node->nid->value . '/';

			$video_validators = [
				'file_validate_extensions' => [
					'3g2 3gpp asf avi divx f4v flv h264 ifo m2ts m4v mkv mod mov mp4 mpeg mpg mswmm mts mxf ogv rm swf ts vep vob webm wlmp wmv'
				],
			];

			foreach ($files_fields as $files_field_name => $files_field_data) {
				if ($files_field_name == 'foto-1-' . $defect_num) {
					if (is_dir($images_path) === false) {
						mkdir($images_path, 0775, true);
					}
					$pictures = file_save_upload($files_field_name, [], $images_path);
					if (count($pictures) > 0) {
						foreach ($pictures as $picture) {
							$images_ids[] = ['target_id' => $picture->id()];
						}
					}
				} elseif ($files_field_name == 'video-1-' . $defect_num) {
					if (is_dir($video_path) === false) {
						mkdir($video_path, 0775, true);
					}
					$videos = file_save_upload($files_field_name, $video_validators, $video_path);
					if (count($videos) > 0) {
						foreach ($videos as $video) {
							$video_ids[] = ['target_id' => $video->id()];
						}
					}
				}

			}

			$node->field_fotografii_defekta->setValue($images_ids);
			$node->field_test_image->setValue($images_ids);
			$node->field_video_defekta->setValue($video_ids);
			$node->save();

			$ids[] = $node->nid->value;
			$problems[] = $node;
		}
		$claim->field_defects->setValue($ids);
		$claim->save();
		return $problems;
	}

	protected function get_problem_data(&$defects, $index, $field)
	{
		$key = $field['key'];
		$posted_value = $defects['defect'][$index][$key];
		$value = ($field['#type'] == 'select') ? $field['#options'][$posted_value] : $posted_value;
		if ($value && isset($field['unit']) && (null !== $field['unit'])) {
			$value = strval($value) . ' ' . $field['unit'];
			$defects['defect'][$index][$key] = $value;
		}
		return [
			'title' => $field['title'],
			'type' => $field['#type'],
			'value' => $value,
		];
	}

	public function add_market_info($claim, $without_save_in_api = false)
	{
		if (!isset($_POST['market_consumer_fio']))
			return false;

		$market_consumer_waybill_torg_12_date = explode($this->date_input_demiliter, ($_POST['market_consumer_waybill_torg_12_date'] ? $_POST['market_consumer_waybill_torg_12_date'] : date('d.m.Y')));
		$market_consumer_invoices_data = explode($this->date_input_demiliter, ($_POST['market_consumer_invoices_data'] ? $_POST['market_consumer_invoices_data'] : date('d.m.Y')));

		if ('' == ($market_consumer_distributor = $this->setFieldValue($_POST, 'market_consumer_distributor'))) {
			$market_consumer_distributor = 0;
		}
		$node = Node::create([
					'type' => 'dannye_magazina',
					'title' => 'Даные магазина (№' . $claim->nid->value . ')',
					'field_market_consumer_email' => $this->setFieldValue($_POST, 'market_consumer_email'),
					'field_market_torg_12_date' => (3 == count($market_consumer_waybill_torg_12_date)) ?
													$market_consumer_waybill_torg_12_date[2] . "-" . $market_consumer_waybill_torg_12_date[1] . "-" . $market_consumer_waybill_torg_12_date[0] :
													'',
					'field_market_consumer_invoices_d' => (3 == count($market_consumer_invoices_data)) ?
															$market_consumer_invoices_data[2] . "-" . $market_consumer_invoices_data[1] . "-" . $market_consumer_invoices_data[0] :
															'',
					'field_market_consumer_distributo' => $market_consumer_distributor,
					'field_market_consumer_comments' => $this->setFieldValue($_POST, 'market_consumer_comments'),
					'field_market_consumer_phone' => $this->setFieldValue($_POST, 'market_consumer_phone'),
					'field_market_torg_12' => $this->setFieldValue($_POST, 'market_consumer_waybill_torg_12'),
					'field_market_consumer_invoices' => $this->setFieldValue($_POST, 'market_consumer_invoices'),
					'field_market_consumer_fio' => $this->setFieldValue($_POST, 'market_consumer_fio'),
					'field_market_defect_type' => $this->setFieldValue($_POST, 'market_consumer_type_defect'),
		]);
		$node->save();

		$claim->field_claims_dannye_magazina->setValue([$node->nid->value]);

		$privazka_distributor = [];
		if ('' !== ($market_consumer_distributor = $this->setFieldValue($_POST, 'market_consumer_distributor'))) {
			$privazka_distributor[] = $market_consumer_distributor;
		}
		$claim->field_privazka_distributor->setValue($privazka_distributor);

		if ($this->setFieldValue($_POST, 'reject_markup') == 'true') {
			$this->get('tarkett_claims.claims_class_updater')->addExtraInfo($claim, $node, 'add_market_info_reject');
			$claim->field_market_reject = true;
			$comments = $this->setFieldValue($_POST, 'market_consumer_comments');
			$this->add_decision($claim, $comments);
		} else {
			if ($without_save_in_api === false) {
				$this->get('tarkett_claims.claims_class_updater')->addExtraInfo($claim, $node, 'add_market_info');
			}
		}

		$claim->save();
		return $node;
	}

	public function add_pokupatel_photos($claim, $file_field = 'photo-defect')
	{
		$images_dir = 'public://images/defects/' . $claim->nid->value . '/';
		if (is_dir($images_dir) === false) {
			mkdir($images_dir, 0775, true);
		}
		if ($images_ids = $this->save_photos($images_dir, $file_field)) {
			$claim->field_photo_pokupatel->setValue($images_ids);
			$claim->save();
		}
	}

	public function add_pokupatel_video($claim, $file_field = 'video-defect')
	{
		$video_dir = 'public://video/defects/' . $claim->nid->value . '/';
		if (is_dir($video_dir) === false) {
			mkdir($video_dir, 0775, true);
		}
		if ($video_ids = $this->save_video($video_dir, $file_field)) {
			$claim->field_video_pokupatel->setValue($video_ids);
			$claim->save();
		}
	}

	public function add_magazin_photos($claim, $file_field = 'photo-defect')
	{
		$images_dir = 'public://images/defects/' . $claim->nid->value . '/';
		if (is_dir($images_dir) === false) {
			mkdir($images_dir, 0775, true);
		}
		if ($images_ids = $this->save_photos($images_dir, $file_field)) {
			$claim->field_photo_magazin->setValue($images_ids);
			$claim->save();
		}
	}

	public function add_magazin_video($claim, $file_field = 'video-defect')
	{
		$video_dir = 'public://video/defects/' . $claim->nid->value . '/';
		if (is_dir($video_dir) === false) {
			mkdir($video_dir, 0775, true);
		}
		if ($video_ids = $this->save_video($video_dir, $file_field)) {
			$claim->field_video_magazin->setValue($video_ids);
			$claim->save();
		}
	}

	public function add_pretenzia_photos($claim, $file_field = 'photo-pretenzia')
	{
		$images_dir = 'public://images/pretenzia/' . $claim->nid->value . '/';
		if (is_dir($images_dir) === false) {
			mkdir($images_dir, 0775, true);
		}
		if ($images_ids = $this->save_photos($images_dir, $file_field)) {
			$claim->field_fotokopii_pretenzii->setValue($images_ids);
			$claim->save();
		}
	}

	protected function save_photos($images_dir, $file_field = 'photo-defect')
	{
		$images_ids = [];

		if (isset($_FILES['files']) && isset($_FILES['files']['name'])) {
			$files_fields = $_FILES['files']['name'];
			foreach ($files_fields as $files_field_name => $files_field_data) {
				if ($files_field_name == $file_field) {
					if ($pictures = file_save_upload($files_field_name, [], $images_dir)) {
						foreach ($pictures as $picture) {
							$images_ids[] = ['target_id' => $picture->id()];
						}
					}
				}
			}
		}
		return $images_ids;
	}

	protected function save_video($video_dir, $file_field = 'video-defect')
	{
		$video_ids = [];

		$video_validators = [
			'file_validate_extensions' => [
				'3g2 3gpp asf avi divx f4v flv h264 ifo m2ts m4v mkv mod mov mp4 mpeg mpg mswmm mts mxf ogv rm swf ts vep vob webm wlmp wmv'
			],
		];

		if (isset($_FILES['files']) && isset($_FILES['files']['name'])) {
			$files_fields = $_FILES['files']['name'];
			foreach ($files_fields as $files_field_name => $files_field_data) {
				if ($files_field_name == $file_field) {
					if ($videos = file_save_upload($files_field_name, $video_validators, $video_dir)) {
						foreach ($videos as $video) {
							$video_ids[] = ['target_id' => $video->id()];
						}
					}
				}
			}
		}
		return $video_ids;
	}

	public function add_consumer_requirements($main_node, $without_save_in_api = false)
	{

		$date_of_issue = isset($_POST['date_of_issue']) ? explode($this->date_input_demiliter, $_POST['date_of_issue']) : array();
		if ((!$date_of_issue) ||
				!is_array($date_of_issue) ||
				(3 != count($date_of_issue))) {
			return false;
		}
		$node = Node::create([
					'type' => 'trebovanie_po_pretenzii',
					'title' => 'Требования клиента по претензии',
					'field_data_vydaci' => $date_of_issue[2] . "-" . $date_of_issue[1] . "-" . $date_of_issue[0],
					'field_pasportnye_dannye' => $this->setFieldValue($_POST, 'passport'),
					'field_trebovanie_po_pretenzii' => $this->setFieldValue($_POST, 'requirement'),
					'field_c_passport_issueplace' => $this->setFieldValue($_POST, 'c_passport_issueplace'),
		]);

		$node->save();

		$main_node->field_trebovanie->setValue([$node->nid->value]);
		$main_node->save();

		if ($without_save_in_api === false) {
			$this->get('tarkett_claims.claims_class_updater')->addExtraInfo($main_node, $node, 'add_consumer_requirements');
		}

		return $node;
	}

	public function add_distributor_info($main_node, $without_save_in_api = false)
	{

		if (!isset($_POST["distributor_consumer_fio"]))
			return false;
		$node_data = [];
		$user = \Drupal::currentUser();
		$invoices = [];
		if (isset($_POST['field_data']) && is_array($_POST['field_data']) && count($_POST['field_data']) > 0) {
			foreach ($_POST['field_data'] as $key => $value) {
				$field_data = explode($this->date_input_demiliter, $_POST['field_data'][$key]);
				if (empty($_POST['title'][$key]))
					continue;
				$invoice_node = Node::create([
							'type' => 'scet_faktura',
							'title' => $_POST['title'][$key],
							'field_data' => (3 == count($field_data)) ? ($field_data[2] . "-" . $field_data[1] . "-" . $field_data[0]) : '',
				]);
				$invoice_node->save();
				$invoices[] = $invoice_node->nid->value;
			}
		}

		$defects_list = [];
		if (isset($_POST['field_dizain']) && is_array($_POST['field_dizain']) && count($_POST['field_dizain']) > 0) {
			foreach ($_POST['field_dizain'] as $key => $value) {
				if ($_price = $_POST['field_price'][$key]) {
							$_price .= ' руб.';
				}
				$defects_list_node = Node::create([
							'type' => 'produkcia_so_skrytymi_defektami',
							'title' => "Дефект указанный дистрибьютором (из №" . $main_node->nid->value . ")",
							'field_dizain' => $value,
							'field_count' => $_POST['field_count'][$key],
							'field_rolls_num' => $_POST['field_rolls_num'][$key],
							'field_price' => $_price,
				]);
				$defects_list_node->save();
				$defects_list[] = $defects_list_node->nid->value;
			}
		}

		$node_data = [
			'field_distributor_email' => $this->setFieldValue($_POST, 'distributor_consumer_email'),
			'field_product_cat' => $this->setFieldValue($_POST, 'field_product_cat'),
			'field_kollekcia' => $this->setFieldValue($_POST, 'field_kollekcia'),
			'field_distributor_phone' => $this->setFieldValue($_POST, 'distributor_consumer_phone'),
			'field_products_with_defects' => $defects_list,
			'field_distributor_invoices' => $invoices,
			'field_d_defect_type' => $this->setFieldValue($_POST, 'field_defect_type'),
			'field_d_supply_contract' => $this->setFieldValue($_POST, 'd_supply_contract'),
			'field_d_fio' => $this->setFieldValue($_POST, 'distributor_consumer_fio'),
			'field_kommentarii_distributora' => $this->setFieldValue($_POST, 'distributor_consumer_comments'),
		];
		$node = Node::create(array_merge([
					'type' => 'dannye_distributora',
					'title' => 'Данные Дистрибьютора (из №' . $main_node->nid->value . ')',
								], $node_data));
		$node->save();

		$main_node->field_dannye_distributora->setValue([$node->nid->value]);
		$main_node->field_privazka_distributor->setValue([$user->id()]);

		if ($_POST['reject_markup'] == 'true') {
			$comments = $this->setFieldValue($_POST, 'distributor_consumer_comments');
			$this->add_decision($main_node, $comments);
			$main_node->field_distributor_reject = true;
			$this->get('tarkett_claims.claims_class_updater')->addExtraInfo($main_node, $node, 'add_distributor_info_reject');
		} else {
			if ($without_save_in_api === false) {
				$this->get('tarkett_claims.claims_class_updater')->addExtraInfo($main_node, $node, 'add_distributor_info');
			}
		}

		$images_ids = [];
		$docs_ids = [];
		$video_ids = [];

		$file_list = [];

		$files_fields = isset($_FILES['files']) ? $_FILES['files']['name'] : null;
		if (is_array($files_fields) && (count($files_fields) > 0)) {
			$images_path = 'public://images/distributor_info/' . $node->nid->value . '/';
			$docs_path = 'public://docs/distributor_info/' . $node->nid->value . '/';
			$video_path = 'public://video/distributor_info/' . $node->nid->value . '/';

			$docs_validators = [
				'file_validate_extensions' => [
					'7z doc docx ods odt pdf pot potx pps ppsx ppt pptx rar xls xlsx zip'
				],
			];
			$video_validators = [
				'file_validate_extensions' => [
					'3g2 3gpp asf avi divx f4v flv h264 ifo m2ts m4v mkv mod mov mp4 mpeg mpg mswmm mts mxf ogv rm swf ts vep vob webm wlmp wmv'
				],
			];

			foreach ($files_fields as $files_field_name => $files_field_data) {
				if ($files_field_name == 'distributor') {
					if (is_dir($images_path) === false) {
						mkdir($images_path, 0755, true);
					}
					$pictures = file_save_upload($files_field_name, [], $images_path);
					if (is_array($pictures) && count($pictures) > 0) {
						foreach ($pictures as $picture) {
							$images_ids[] = ['target_id' => $picture->id()];
							$file_list[] = [
								'fieldname' => 'field_d_foto',
								'filename' => $picture->getFileName(),
								'id' => $picture->id(),
							];
						}
					}
				} else if ($files_field_name == 'docs') {
					if (is_dir($docs_path) === false) {
						mkdir($docs_path, 0755, true);
					}
					$docs = file_save_upload($files_field_name, $docs_validators, $docs_path);
					if (is_array($docs) && count($docs) > 0) {
						foreach ($docs as $doc) {
							$docs_ids[] = ['target_id' => $doc->id()];
							$file_list[] = [
								'fieldname' => 'field_d_docs',
								'filename' => $doc->getFileName(),
								'id' => $doc->id(),
							];
						}
					}
				} else if ($files_field_name == 'video-defect') {
					if (is_dir($video_path) === false) {
						mkdir($video_path, 0755, true);
					}
					$videos = file_save_upload($files_field_name, $video_validators, $video_path);
					if (is_array($videos) && count($videos) > 0) {
						foreach ($videos as $video) {
							$video_ids[] = ['target_id' => $video->id()];
							$file_list[] = [
								'fieldname' => 'field_d_video',
								'filename' => $video->getFileName(),
								'id' => $video->id(),
							];
						}
					}
				}
			}
		}

		$node->field_d_foto->setValue($images_ids);
		$node->field_d_docs->setValue($docs_ids);
		$node->field_d_video->setValue($video_ids);
		if (0 < count($file_list)) {
			$list_ids = [];
			foreach ($file_list as $f_data) {
				$f_node = Node::create([
					'type' => 'file_info',
					'title' => 'Сведения о файле Дистрибьютора ' . $f_data['filename'] . ' (№' . $main_node->nid->value . ')',
					'field_f_fieldname' => $f_data['fieldname'],
					'field_f_filename' => $f_data['filename'],
					'field_f_drupal_id' => $f_data['id'],
					'field_f_api_uuid' => '',
				]);
				$f_node->save();
				$list_ids[] = ['target_id' => $f_node->id()];
			}
			$node->field_d_file_list->setValue($list_ids);
		}
		$node->save();

		$main_node->save();
		if ($without_save_in_api === false) {
			$this->get('tarkett_claims.claims_class_updater')->addExtraInfo($main_node, $node);
		}
		return $node;
	}

	public function add_decision($main_node, $comments)
	{

		$node = Node::create([
					'type' => 'resenia_po_obraseniu',
					'title' => 'Решение по обращению №' . $main_node->nid->value,
					'field_tip_resenia' => 1,
					'body' => $comments,
		]);
		$node->save();
		$main_node->field_claims_resenia_po_obraseni->setValue([$node->nid->value]);
		$main_node->save();
	}

	public function add_consumer_info($main_node, $data = [])
	{
		if (count($data) == 0 && isset($_POST)) {
			$data = $_POST;
		}
		if (!isset($data['field_c_fio']))
			return false;

		$node = null;
		$field_dannye_pokupatela_values = $main_node->field_dannye_pokupatela->getValue();
		if (isset($field_dannye_pokupatela_values[0]['target_id'])) {
			$node = \Drupal\node\Entity\Node::load($field_dannye_pokupatela_values[0]['target_id']);
		}

		if ($node == null || $node === false) {
			$node = Node::create([
						'type' => 'dannye_pokupatela',
						'title' => 'Данные покупателя(№' . $main_node->nid->value . ')',
			]);
			$node->save();
			$main_node->field_dannye_pokupatela->setValue([$node->nid->value]);
			$main_node->save();
		}
		$field_c_buy_date = explode($this->date_input_demiliter, ($data['field_c_buy_date'] ? str_replace("-", ".", $data['field_c_buy_date']) : date('Y.m.d')));

		$node->field_c_fio = $this->setFieldValue($data, 'field_c_fio');
		$node->field_c_email = $this->setFieldValue($data, 'field_c_email');
		$node->field_c_phone = $this->setFieldValue($data, 'field_c_phone');
		$node->field_c_city = $this->setFieldValue($data, 'field_c_city');
		$node->field_c_street = $this->setFieldValue($data, 'field_c_street');
		$node->field_c_buy_date = (3 == count($field_c_buy_date)) ? $field_c_buy_date[2] . '-' . $field_c_buy_date[1] . '-' . $field_c_buy_date[0] : '';
		$node->field_c_home_num = $this->setFieldValue($data, 'field_c_home_num');
		$node->field_c_market_name = $this->setFieldValue($data, 'field_c_market_name');
		$node->field_c_check_num = $this->setFieldValue($data, 'field_c_check_num');


		$node->save();
		if (is_dir("public://images/claims/" . $node->nid->value . '/') === false) {
			mkdir("public://images/claims/" . $node->nid->value . '/');
		}
		$pictures = file_save_upload("field_c_check_photo", [], "public://images/claims/" . $node->nid->value . '/');
		if ($pictures[0]) {
			$images_ids[] = ['target_id' => $pictures[0]->id()];
			$node->field_c_check_photo->setValue($images_ids);
			$node->save();
		}
		return $node;
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

	public function setFieldValue($values, $key)
	{
		if (isset($values) && isset($values[$key])) {
			return $values[$key];
		}
		return "";
	}

	public function updater($values, $node)
	{
		
	}

}
