<?php

namespace Drupal\tarkett_api;

class Test
{
	public function index()
	{
		$result = $this->get('tarkett_api.index')->process_list(['contactUid'=>'196d3282-cd6f-4c55-b767-129bc58c0ba0']);
		return [
			'#theme' => 'index',
			'#result' => $result,
		];
	}
	public static function get($name)
	{
		return \Drupal::service($name);
	}
}