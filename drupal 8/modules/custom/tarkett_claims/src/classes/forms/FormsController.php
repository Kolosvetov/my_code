<?php

namespace Drupal\tarkett_claims\classes\forms;

use Drupal\tarkett_claims\classes\forms\FormsParket;
use Drupal\tarkett_claims\classes\forms\FormsLA;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Render\Renderer;

class FormsController 
{

	function getForm()
	{
		$args = func_get_args();
		$code = $args[0];
		if (substr_count($code, "parket") > 0) {
			$type = $args[1];
			$count = $args[2];
			$form = $this->get('tarkett_claims.claims_class_forms_parket')->get_form($code, $type, $count);
			$fields = $this->get('tarkett_claims.claims_class_forms_parket')->getCurrentForm($code, $type, $count);
		} else if (substr_count($code, "laminat") > 0) {
			$type = $args[1];
			$count = $args[2];
			$form = $this->get('tarkett_claims.claims_class_forms_laminat')->get_form($code, $type, $count);
			$fields = $this->get('tarkett_claims.claims_class_forms_laminat')->getCurrentForm($code, $type, $count);
		} else {
			$parms = $args[1];
			$form = $this->get($code)->get_form($parms);
			$fields = $this->get($code)->fields($parms);
			// TODO Для других типов продукции, кроме ламината
		}
		foreach ($form as $field_name => $field_data) {
			if (!isset($fields[$field_name])){
				unset($form[$field_name]);
			}
		}
		return $form;
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
