<?php
namespace Drupal\tarkett_claims\classes\forms;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;

class BaseForm extends FormBase {
	
	public function get_form()
	{
		return \Drupal::formBuilder()->getForm($this);
	}
	public static function get($name)
	{
		return \Drupal::service($name);
	}

	public function getFormId() {}
	public function buildForm(array $form, FormStateInterface $form_state) {}
	public function submitForm(array &$form, FormStateInterface $form_state) {}
}