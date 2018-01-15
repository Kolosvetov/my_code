<?php

namespace Drupal\tarkett_claims\classes;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\tarkett_claims\classes\forms\BaseForm;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;

class Solutions extends BaseForm
{

	public $type = null;
	public $node = null;

	public function get_form($type = null, $node = null)
	{
		$this->type = $type;
		$this->node = $node;
		return \Drupal::formBuilder()->getForm($this);
	}

	public function fields($type)
	{
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());

		// Проверяем право на заполнение формы, чтобы её показать
		if (($this->node->field_responsiblecontactuid->value != $user->field_contactuid->value) &&
			($this->node->field_responsiblecontactuid->value != $user->field_uid->value)) {
			return array();
		}

		// $roles = $user->getRoles();
		switch ($type) {
			case "solution_consumer":
				$fields = $this->get('tarkett_claims.claims_class_fields')->getFields('consumer_solution_fields', ['node' => $this->node]);
			break;
			case "market_data":
				$fields = $this->get('tarkett_claims.claims_class_fields')->getFields('market_solution_fields', ['node' => $this->node]);
			break;
			case "distributor_data":
				$fields = $this->get('tarkett_claims.claims_class_fields')->getFields('distributor_solution_fields', ['node' => $this->node]);
			break;
			case "market_answer":
				$fields = $this->get('tarkett_claims.claims_class_fields')->getFields('answer', ['node' => $this->node]);
			break;
			case "distributor_answer":
				$fields = $this->get('tarkett_claims.claims_class_fields')->getFields('answer', ['node' => $this->node]);
			break;
		}
		return $fields;
	}

	/**
	 * 
	 * @return string
	 */
	public function getFormId()
	{
		return 'claims_solutions';
	}

	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 * @return string
	 */
	public function buildForm(array $form, FormStateInterface $form_state)
	{
		$form = $this->fields($this->type);
		return $form;
	}

	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 */
	public function submitForm(array &$form, FormStateInterface $form_state)
	{
		$main_node = \Drupal\node\Entity\Node::load($_POST['current_node_id']); // Нода к которой будем привязывать информацию о магазине.
		$msg = 'Что-то пошло не так!!!';

		switch ($_POST['form_name']) {
			case 'distributor':
				$claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_distributor_info($main_node);
				$msg = 'Данные дистрибьютора добавлены';
				break;
			case 'market':
				$claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_market_info($main_node);
				$msg = 'Данные магазина добавлены';
				break;
			case 'solution':
				if ($claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_consumer_requirements($main_node)) {
					$msg = 'Требования по претензии приняты';
					$values = $form_state->getValues();
					if (isset($values['needs_printing']) &&
						('1' == $values['needs_printing'])) {
						$form_state->setRedirectUrl(\Drupal\Core\Url::fromUserInput("/node/{$main_node->nid->value}#printing"));
					}
				} else {
					$msg = '';
				}
				break;
			case "answer_distributor":
				$claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_answer($main_node, 'answer_distributor', htmlspecialchars($_POST['answer_text']));
				$msg = "Ваш ответ добавлен";
				break;
			case "answer_magazin":
				$claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_answer($main_node, 'answer_magazin', htmlspecialchars($_POST['answer_text']));
				$msg = "Ваш ответ добавлен";
				break;
		}
		if ($msg) {
			drupal_set_message($this->t($msg));
		}
	}
}
