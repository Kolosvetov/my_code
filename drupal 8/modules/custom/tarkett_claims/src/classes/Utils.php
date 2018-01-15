<?php

namespace Drupal\tarkett_claims\classes;

use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;
use Drupal\tarkett_api\TarkettSite;
use Symfony\Component\HttpFoundation\RedirectResponse;

class Utils
{

	public function get_users_list_by_role($role)
	{
		$ids = \Drupal::entityQuery('user')
				->condition('status', 1)
				->condition('roles', $role)
				->execute();
		$users = User::loadMultiple($ids);
		$distributors = [];
		$distributors[''] = '';
		foreach ($users as $key => $user) {
			$distributors[$key] = $user->name->value;
		}
		return $distributors;
	}

	public function loginUserWithoutRedirect($account, $with_redirect = false)
	{
		
		\Drupal::currentUser()->setAccount($account);
		\Drupal::logger('user')->notice('Session opened for %name.', array('%name' => $account->getUsername()));
		$account->setLastLoginTime(REQUEST_TIME);
		
		\Drupal::entityManager()
				->getStorage('user')
				->updateLastLoginTimestamp($account);
		
		\Drupal::service('session')->migrate();
		\Drupal::service('session')->set('uid', $account->id());
		if ($with_redirect === true) {
			$response = new RedirectResponse($_SERVER['REQUEST_URI']);
			return $response->send();
		}
	}

	public function setStatus(&$claim, $process)
	{
		/**
		 * 
		  Покупатель
		 * 1. Продавец
		 * 2. Получено продавцом
		 * 3. Рассмотрение
		 * 4. Запрошен образец
		 * 5. Образец на проверке
		 * 6. Образец получен
		 * 7. Выезд представителя
		 * 8. Принято
		 * 9. Отклонено
		 */
		/**
		 * 
		  Магазин
		 * 1. Поставщик
		 * 2. Рассмотрение
		 * 3. Запрошен образец
		 * 4. Образец на проверке
		 * 5. Образец получен
		 * 6. Выезд представителя
		 * 7. Принято
		 * 8. Отклонено
		 */
		/**
		 * 
		  Дистрибьютор
		 * 1. Направляется
		 * 2. Получено
		 * 3. Рассмотрение
		 * 4. Запрошен образец
		 * 5. Образец на проверке
		 * 6. Образец получен
		 * 7. Выезд представителя
		 * 8. Принято
		 * 9. Отклонено
		 */
		$changed_statuses = [];

		$consumer_status = null;
		$market_status = null;
		$distributor_status = null;

		if (true == $claim->field_distributor_reject->value) {
			$consumer_status = $this->get_term_id_by_code('c-rejected');
			$market_status = $this->get_term_id_by_code('m-rejected');
			$distributor_status = $this->get_term_id_by_code('d-rejected');
		} elseif (true == $claim->field_market_reject->value) {
			$consumer_status = $this->get_term_id_by_code('c-rejected');
			$market_status = $this->get_term_id_by_code('m-rejected');
		} elseif ($claim->field_conclusion->value == 1) {
			$consumer_status = $this->get_term_id_by_code('c-approved');
			$market_status = $this->get_term_id_by_code('m-approved');
			$distributor_status = $this->get_term_id_by_code('d-approved');
			if (1 == $claim->field_claims_type->value) {
				$claim->field_claims_type->setValue(2);
			}
		} elseif ($claim->field_conclusion->value == 2 || $claim->field_conclusion_reject_reason->value != "") {
			// Статус "Отклонено" для Дистрибьютора выставляется на его этапах
			if (array_search($process->state->schemeUid, ['e3838b1a-1b0c-4aef-bd81-637a0d0e6cc5', 'ce330d10-58bc-4d96-a748-bd4dcdb533cf', '96a9766b-bd22-4352-a48c-d127bef70be9', '81304fee-4a4e-4509-a40e-23250490718d']) !== false) {
				$distributor_status = $this->get_term_id_by_code('d-rejected');
			}
			// Статус "Отклонено" для Магазина выставляется на его этапах
			if (array_search($process->state->schemeUid, ['15292cf0-99f2-4470-b495-0dafb45246fd', '25e6282c-d502-44fa-8130-3569f326a2e6', 'dd04984d-cab5-4027-a479-0268e912bb80']) !== false) {
				$market_status = $this->get_term_id_by_code('m-rejected');
			}
			// Статус "Отклонено" для Покупателя выставляется на его этапах
			if (array_search($process->state->schemeUid, ['cab7c209-8487-496f-a21c-01298e9ae76d', '4735af89-a4e1-4bea-a56c-e2e3a6ab6805']) !== false) {
				$consumer_status = $this->get_term_id_by_code('c-rejected');
			}
		} elseif ($claim->field_sample_test_date->value != "") {
			$consumer_status = $this->get_term_id_by_code('c-sample-prepared');
			$market_status = $this->get_term_id_by_code('m-sample-prepared');
			$distributor_status = $this->get_term_id_by_code('d-sample-prepared');
		} elseif ($claim->field_sample_request_date->value != "") {
			$consumer_status = $this->get_term_id_by_code('c-sample-inlab');
			$market_status = $this->get_term_id_by_code('m-sample-inlab');
			$distributor_status = $this->get_term_id_by_code('d-sample-inlab');
		} elseif ($claim->field_sample_request->value != "") {
			$consumer_status = $this->get_term_id_by_code('c-sample-requested');
			$market_status = $this->get_term_id_by_code('m-sample-requested');
			$distributor_status = $this->get_term_id_by_code('d-sample-requested');
		} elseif ($claim->field_agent_visit->value != "") {
			$consumer_status = $this->get_term_id_by_code('c-departure');
			$market_status = $this->get_term_id_by_code('m-departure');
			$distributor_status = $this->get_term_id_by_code('d-departure');
		} elseif ($process->state->schemeUid == "9cf36f4e-7d2a-4943-8bdb-a8122a6683b2") {
			$consumer_status = $this->get_term_id_by_code('c-received-shop');
			$market_status = $this->get_term_id_by_code('m-need-answer');
		} elseif (array_search($process->state->schemeUid, ["20989820-cafc-456f-9acf-ffa4821f1587", "e70b0d14-aac8-400c-97a1-9ff9ade9d52f", "510742ea-c328-4040-b0d5-45e864026331"]) !== false) {
			$distributor_status = $this->get_term_id_by_code('d-need-answer');
			$market_status = $this->get_term_id_by_code('m-consideration');
			$consumer_status = $this->get_term_id_by_code('c-consideration');
		} elseif ($process->state->schemeUid == "0ec01ee2-9172-44be-9ce8-357ef7339252") {
			$consumer_status = $this->get_term_id_by_code('c-shop');
		} elseif ($process->state->schemeUid == "371a1eb9-b723-48a7-916c-a3a9d2809ff4") {
		// Неочевидный кусок логики - выставляет чужой статус магазину на этапах между магазином и дистрибьютором
		// Нужен ли он вообще?
			$consumer_status = $this->get_term_id_by_code('c-received-shop');
			$market_status = $this->get_term_id_by_code('d-heading');
			$distributor_status = $this->get_term_id_by_code('d-consideration');
		} elseif (array_search($process->state->schemeUid, ["4df25582-7608-4ffa-b8f2-3b09a50aa897", "a9c14f1d-82e2-4f65-bf72-6e0c8815a54e", "6eee5b3e-7584-477e-a7a8-9054edef8e95", "9b2c6fcb-fae5-47e5-bcd5-eac44cf23d64"]) !== false) {
			$distributor_status = $this->get_term_id_by_code('d-consideration');
		} elseif (array_search($process->state->schemeUid, ["81304fee-4a4e-4509-a40e-23250490718d"]) !== false) {
			$distributor_status = $this->get_term_id_by_code('d-consideration');
		} elseif (array_search($process->state->schemeUid, ["96a9766b-bd22-4352-a48c-d127bef70be9"]) !== false) {
			$market_status = $this->get_term_id_by_code('m-rejected');
			$distributor_status = $this->get_term_id_by_code('d-rejected');
		}

		if (isset($consumer_status) &&
			(($claim->field_consumer_status->count() == 0) ||
			 ($consumer_status != $claim->field_consumer_status->entity->tid->value))) {
			$claim->field_consumer_status->setValue([$consumer_status]);
			$changed_statuses['consumer'] = $consumer_status;
		}
		if (isset($market_status) &&
			(($claim->field_market_status->count() == 0) ||
			 ($market_status != $claim->field_market_status->entity->tid->value))) {
			$claim->field_market_status->setValue([$market_status]);
			$changed_statuses['market'] = $market_status;
		}
		if (isset($distributor_status) &&
			(($claim->field_status_processa_u_distribu->count() == 0) ||
			 ($distributor_status != $claim->field_status_processa_u_distribu->entity->tid->value))) {
			$claim->field_status_processa_u_distribu->setValue([$distributor_status]);
			$changed_statuses['distributor'] = $distributor_status;
		}
//		var_dump($process->state->schemeUid, $process, $changed_statuses);
//		die;
		return $changed_statuses;
	}

	public function get_term_id_by_code($code)
	{
		$terms = \Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['field_code' => $code]);
		$term = array_shift($terms);
		if ($term) {
			return $term->id();
		}
	}

	public function get_datatype_form_fields($datatype)
	{
		$node = Node::create(['type' => $datatype]);
		$form = \Drupal::service('entity.form_builder')->getForm($node, 'default');
		$fields = [];
		foreach ($form as $field_name => $field_data) {
			if (!preg_match("/^field_/", $field_name)) {
				unset($form[$field_name]);
			}
		}
		return $form;
	}

	public function get_node_by_field($field_name, $value)
	{
		$arr = \Drupal::entityManager()->getStorage('node')->loadByProperties([$field_name => $value]);
		$node = array_shift($arr);
		return $node;
	}

	public function get_user_by_field($field_name, $value)
	{
		$arr = \Drupal::entityManager()->getStorage('user')->loadByProperties([$field_name => $value]);
		$node = array_shift($arr);
		return $node;
	}

	public function p_fieldset($p_fieldset, $node_reference = null)
	{
		$res = [];
		foreach ($p_fieldset as $key => $data) {
			if (is_array($data)) {
				if (isset($data['#type']) && ($data['#type'] == 'fieldset')) {
					$res[]['#title'] = isset($data['#title']) ? $data['#title'] : null;
					$res[] = $this->p_fieldset($data, $node_reference);
				} elseif (isset($data['#type']) && ($data['#type'] == 'container')) {
					$res = array_merge($res, $this->p_fieldset($data, $node_reference));
				} else {
					$res[] = $this->p_field($data, $key, $node_reference);
				}
			}
		}
		return $res;
	}

	public function p_field($field, $key, $node_reference = null)
	{
		$value = '-';

		if (isset($node_reference) && property_exists($node_reference->defect, $key)) {
			if (isset($field['#options'])) {
				$value = isset($field['#options'][$node_reference->defect->$key]) ?
						$field['#options'][$node_reference->defect->$key] :
						null;
			} elseif (!empty($node_reference->defect->$key)) {
				$value = $node_reference->defect->$key;
			}
		} else {
			$value = null;
		}

		return [
			'key' => $key,
			'#type' => isset($field['#type']) ? $field['#type'] : null,
			'#options' => isset($field['#options']) ? $field['#options'] : null,
			'title' => isset($field['#title']) ? str_replace('<br>', ' ', $field['#title']) : null,
			'value' => $value,
			'unit' => isset($field['#attributes']) && isset($field['#attributes']['data-unit']) ? $field['#attributes']['data-unit'] : null,
		];
	}

	public function get_claim_qr_code($claim_id)
	{
		$directory = 'public://images/qr/';
		file_prepare_directory(
				$directory, FILE_MODIFY_PERMISSIONS | FILE_CREATE_DIRECTORY
		);

		$uri = $directory . 'claim_' . $claim_id . '.png';
		$path = drupal_realpath($uri);

		if (!file_exists($path)) {
			$url = \Drupal\Core\Url::fromUserInput(
							'/node/' . $claim_id, array('absolute' => true)
			);
			$tcpdf_qr = new \TCPDF2DBarcode($url->toString(), 'QRCODE');
			file_unmanaged_save_data(
					$tcpdf_qr->getBarcodePngData(5, 5), $path, FILE_EXISTS_REPLACE
			);
		}

		return file_create_url($uri);
	}
	/**
	 * TODO:: Написать единую систему обработки пользователей
	 */
//	
//	public static $auth_user = null;
//	
//	public function userProcess($login = null, $pass = null)
//	{
//		
//	}
//	
//	public function tempAuthUser()
//	{
//		
//	}
//
//	public function createUser($login, $pass, $withtempauth = false)
//	{
//		
//	}

	
	
	
	public function tryLogin()
	{
		
		if (\Drupal::currentUser()->isAuthenticated() === true)
			return false;
		
		$f_name = "";
		$f_value = "";
		if (isset($_COOKIE['contactuid'])) {
			$f_name = "field_contactuid";
			$f_value = $_COOKIE['contactuid'];
		} elseif (isset($_COOKIE['uid'])) {
			$f_name = "field_uid";
			$f_value = $_COOKIE['uid'];
		}
//		var_dump($_COOKIE);
//		die('asdf');
		if ($f_value != "" && $f_value != "0") {
			$user = $this->get("tarkett_claims.claims_class_utils")->get_user_by_field($f_name, $f_value);
			if (isset($user)) {
				$this->get("tarkett_claims.claims_class_utils")->loginUserWithoutRedirect($user, true);
			} else {
				
				$ts = new TarkettSite();
				$out = $ts->findUserBySession();
				$out = \GuzzleHttp\json_decode($out);	
				$d_user = \Drupal::service('tarkett_claims.claims_class_forms_extra_data_add')->add_user($out->nickname, $out->password_hash, $out);
				if ($d_user) {
					$this->get("tarkett_claims.claims_class_utils")->loginUserWithoutRedirect($d_user, true);
				} else {
					return false;
				}
			}
		}
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
