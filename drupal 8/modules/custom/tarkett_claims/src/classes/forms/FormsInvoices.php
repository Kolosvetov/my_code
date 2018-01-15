<?php

namespace Drupal\tarkett_claims\classes\forms;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\tarkett_claims\classes\forms\BaseForm;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;

class FormsInvoices extends BaseForm
{

	public $clone = false;
	public $count = null;

	public function get_form($parms = [])
	{
		$this->clone = $parms[0];
		$this->count = $parms[1];
		return \Drupal::formBuilder()->getForm($this);
	}

	public function fields($parms = [])
	{
		if (count($parms) == 0) {
			$count = $this->count;
			$clone = $this->clone;
		} else {
			$clone = $parms[0];
			$count = $parms[1];
		}

		$fields = [
			'invoices_fieldset' => [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'table table_on-center without-header'],
				'title' => [
					"#title" => 'Счет фактура',
					"#type" => 'textfield',
				],
				'field_data' => [
					"#title" => 'Дата',
					"#type" => 'textfield',
					'#attributes' => ['class' => ['date']],
				],
				'del_invoice_container' => [
					'#type' => 'container',
					'#attributes' => [
						'class' => ['form-item', 'del-link-container'],
					],
					'del_invoice_link' => [
						'#type' => 'html_tag',
						'#value' => 'Удалить',
						'#attributes' => [
							'class' => ['del_form_line'],
						],
						'#tag' => 'a',
					],
				],
			],
			'add_invoices_fieldset' => [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'without-header b-col10 b-col10--offset-end'],
				'add_invoices' => [
					'#type' => 'html_tag',
					'#value' => "Добавить",
					'#attributes' => ['class' => ['add_form_line'], 'style' => 'float:left;margin-bottom:20px;', 'data-target' => '.distributor_invoices', 'data-action' => '/ajax/distributors_invoices'],
					'#tag' => "a",
				],
			],
		];

		if (boolval($clone) === true) {
			$fields['invoices_fieldset']['#attributes'] = ['class' => 'table table_on-center without-header clone'];
			unset($fields['add_invoices_fieldset']);
		}
		foreach ($fields['invoices_fieldset'] as $key => $value) {
			if (!preg_match("/^#/", $key)) {

				$a = $fields['invoices_fieldset'][$key];
				$fields['invoices_fieldset'][$key . "[$count]"] = $a;
				unset($fields['invoices_fieldset'][$key]);
			}
		}

		return $fields;
	}

	/**
	 * 
	 * @return string
	 */
	public function getFormId()
	{
		return 'formsinvoices';
	}

	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 * @return string
	 */
	public function buildForm(array $form, FormStateInterface $form_state)
	{
		$form = $this->fields();
		return $form;
	}

	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 */
	public function submitForm(array &$form, FormStateInterface $form_state)
	{
//		$main_node = \Drupal\node\Entity\Node::load($_POST['current_node_id']); // Нода к которой будем привязывать информацию о магазине.
//		
//		$claim = $this->add_market_info($main_node);

		drupal_set_message($this->t('Thank you @name, your phone number is @number', array(
					'@name' => $form_state->getValue('name'),
					'@number' => $form_state->getValue('phone_number')
		)));
	}

}
