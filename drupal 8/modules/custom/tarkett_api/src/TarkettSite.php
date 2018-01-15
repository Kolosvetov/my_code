<?php

namespace Drupal\tarkett_api;

use Drupal\Core\Password\PhpassHashedPassword;
use Drupal\Core\Password\PasswordInterface;

class TarkettSite
{
	public function findUser($email = "", $password = '')
	{
		$client = \Drupal::httpClient();
		$data = [
			'email' => $email,
			'password' => $password,
			'fields' => [
				'nickname',
				'email',
				'name',
				'phone',
				'company_name',
				'address',
				'UserUID',
				'CompanyUID',
			],
		];

		$response = $client->request('POST', "http://www.".(trim(trim($_SERVER['HTTP_HOST'], 'www.'), 'claims.'))."/users/login/", ['form_params' => $data, 'verify' => false]);
//		$response = $client->request('POST', "http://www.tarkett.ru.projects.techart.ru/users/login/", ['form_params' => $data, 'verify' => false]);

		$answer = $response->getBody()->getContents();
//		return $answer;
		return \GuzzleHttp\json_decode($answer);
	}
	
	public function findUserBySession($uid = null, $contactuid = null)
	{
		if (!isset($uid)) {
			$uid = isset($_COOKIE['uid'])? $_COOKIE['uid']:null;
		}
		if (!isset($contactuid)) {
			$contactuid = isset($_COOKIE['contactuid'])? $_COOKIE['contactuid']:null;
		}
		
		$client = \Drupal::httpClient();
		$response = $client->request('POST', "http://www.".(trim(trim($_SERVER['HTTP_HOST'], 'www.'), 'claims.'))."/users/finduserbysession/", ['form_params' => [
			'uid' => $uid, 
			'contactuid' => $contactuid
			
		], 'verify' => false]);
		$answer = $response->getBody()->getContents();
		return $answer;		
	}


	public function findUserByEmail($mail)
	{
		$client = \Drupal::httpClient();
		$response = $client->request('POST', "http://www.".(trim(trim($_SERVER['HTTP_HOST'], 'www.'), 'claims.'))."/users/checkmail/", ['form_params' => ['mail' => $mail], 'verify' => false]);
		$answer = $response->getBody()->getContents();
		return $answer;
	}
	
	public function loginUser($form)
	{
		$errors = [];
		$ts = new TarkettSite();
		$t_user = $ts->findUser($form['name'], $form['pass']);

		if ($t_user->Ok === true) {
			if ($t_user->CompanyUID != "") {
				$d_user = \Drupal::service('tarkett_claims.claims_class_utils')->get_user_by_field('field_contactuid', $t_user->CompanyUID);
			} elseif (isset($t_user->UserUID)) {
				$d_user = \Drupal::service('tarkett_claims.claims_class_utils')->get_user_by_field('field_uid', $t_user->UserUID);
			}
			if (!isset($d_user)) {
				$d_user = \Drupal::service('tarkett_claims.claims_class_forms_extra_data_add')->add_user($form['name'], $form['pass'], $t_user);
			}
		} else {
			$d_user = user_load_by_mail($form['name']);
			if (!$d_user) 
				$d_user = user_load_by_name($form['name']);
			if (!$d_user) {
				$errors[] = 'user not found';
			} else {
				$PasswordCheckClass = new \Drupal\Core\Password\PhpassHashedPassword('Noop');
				if ($PasswordCheckClass->check($form['pass'], $d_user->pass->value) !== true) {
					$errors[] = 'password';
				}
			}
		}
		if ($d_user && count($errors) == 0) {
			
			$this->get("tarkett_claims.claims_class_utils")->loginUserWithoutRedirect($d_user);
		} else {
			return $errors;
		}
		return true;
	}
	
	public function checkMail($mail)
	{
		return $this->findUserByEmail($mail);
	}
	
	public function addUser($data)
	{
		$client = \Drupal::httpClient();
		$response = $client->request('POST', "http://www.".(trim(trim($_SERVER['HTTP_HOST'], 'www.'), 'claims.'))."/users/ajax_user_add/", ['form_params' => ['data' => $data], 'verify' => false]);
		$answer = $response->getBody()->getContents();
		return $answer;
	}
	
	public static function get($name)
	{
		return \Drupal::service($name);
	}
}