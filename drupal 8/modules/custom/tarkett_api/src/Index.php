<?php

namespace Drupal\tarkett_api;

class Index
{	
    public function __call($name, $arguments)
	{
		if (!is_array($arguments) || 0 === count($arguments)) {
			$params = [];
		} else {
			$params = $arguments[0];
		}
		return $this->callMethod($name, $params);
	}

	protected function callMethod($methodName, $params = [])
	{
		$bpmapi = new BPM_API();
		$contactapi = new Contact_API();
		if (method_exists($bpmapi, $methodName)) {
			return call_user_func([$bpmapi, $methodName], $params);
		} elseif(method_exists($contactapi, $methodName)) {
			return call_user_func([$contactapi, $methodName], $params);
		}
		return "method not found";
	}
}