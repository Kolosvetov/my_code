<?php

namespace Drupal\tarkett_api;

class Proxy
{
	public $host = 'https://195.75.72.138';
	public $test_user_id = '196d3282-cd6f-4c55-b767-129bc58c0ba0';
	
	public function makeRequest($location, $data, $timeout = false)
	{
		$errors = [];
//		$data['userUid'] = $this->test_user_id;
		try {
			if (preg_match("/^http/", $location)) {
				$full_url = $location;
			} else {
				$full_url = $this->host.$location;
			}
			
			$result = $this->send($full_url, $data, $timeout);
		} catch (\GuzzleHttp\Exception\ClientException $e) {
			$result = false;
			$errors[] = $e;
		} catch (\GuzzleHttp\Exception\ServerException $e) {
			$result = false;
			$errors[] = $e;
		} 
		if (count($errors) > 0) {
			return ['errors' => $errors, 'result' => $result];
		}
		return ['errors' => false, 'result' => \GuzzleHttp\json_decode($result), 'md5' => md5($result)];
	}
	
	public function checkErrors($data)
	{
		return [];
	}
	
	public function send($location, $data, $timeout = false)
	{
		$client = \Drupal::httpClient();
		$options = [
			'verify' => false,
		];
		if (false !== $timeout) {
			$options['timeout'] = $timeout;
		}
		
		if (substr_count($location, '/api/is/bpm/process/putState') > 0 || substr_count($location, '/api/is/bpm/process/putFile') > 0) {
			$options['json'] = $data;
		} else {
			$options['form_params'] = $data;
		}
		$response = $client->request('POST', $location, $options);
		
		return $response->getBody()->getContents();
	}
}