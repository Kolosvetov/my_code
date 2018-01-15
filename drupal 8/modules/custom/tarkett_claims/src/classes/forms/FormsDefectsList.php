<?php

namespace Drupal\tarkett_claims\classes\forms;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\tarkett_claims\classes\forms\BaseForm;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;
use Drupal\tarkett_claims\classes\XMLDesigns;

class FormsDefectsList extends BaseForm
{

	public $clone = false;
	public $count = null;

	public $type_name = '';
	public $collection_name = '';

	public function get_form($parms = [])
	{
		$this->clone = $parms[0];
		$this->count = $parms[1];
		$this->type_name = $parms[2];
		$this->collection_name = $parms[3];
		return \Drupal::formBuilder()->getForm($this);
	}

	public function fields($parms = [])
	{
		if (count($parms) == 0) {
			$count = $this->count;
			$clone = $this->clone;
			$type_name = $this->type_name;
			$collection_name = $this->collection_name;
		} else {
			$clone = $parms[0];
			$count = $parms[1];
			$type_name = $parms[2];
			$collection_name = $parms[3];
		}

		$designs = ['' => ''];
		$categories = new XMLDesigns();
		if ($type_name && $collection_name) {
			if ($type_id = $categories->getTypeID($type_name)) {
				foreach ($categories->getDesigns($type_id, $collection_name) as $name) {
					$designs[$name] = $name;
				}
			}
		}

		$fields = [
			'formsdefectslist_fieldset' => [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'table without-header'],
				'field_dizain' => [
					'#type' => 'select',
					'#title' => 'Дизайн',
					'#options' => $designs,
				],
				'field_count' => [
					'#title' => 'Количество брака',
					'#type' => 'textfield',
				],
				'field_price_fs' => [
					'#type' => 'container',
					'#attributes' => ['class' => 'defect-line merge-fields'],
					'field_price' => [
						'#title' => 'Стоимость брака',
						'#type' => 'textfield',
						'#attributes' => ['class' => ['number', 'with-units']],
						'#suffix' => '<div class="form-item form-item-ez"><div class="form-select"><span class="units-text">руб.</span></div></div>',
					],
				],
				'field_rolls_num' => [
					'#title' => 'Номера рулонов',
					'#type' => 'textfield',
					'#states' => [
						'visible' => [
							'select[name="field_product_cat"]' => [
								// 'value' => '2',
							],
						],
					],
				],
				'del_defect_container' => [
					'#type' => 'container',
					'#attributes' => [
						'class' => ['form-item del-link-container'],
					],
					'del_defect_link' => [
						'#type' => 'html_tag',
						'#value' => 'Удалить',
						'#attributes' => [
							'class' => ['del_form_line'],
						],
						'#tag' => 'a',
					],
				],
			],
			'add_defect_fieldset' => [
				'#type' => 'fieldset',
				'#attributes' => ['class' => 'without-header b-col10 b-col10--offset-end'],
				'add_defect' => [
					'#type' => 'html_tag',
					'#value' => 'Добавить',
					'#attributes' => [
						'class' => ['add_form_line'],
						'style' => 'float:left;margin-bottom:20px;',
						'id' => 'add_form_line',
						'data-target' => '.field_products_with_defects',
						'data-action' => '/ajax/distributors_defects_list'
					],
					'#tag' => 'a',
				],
			],
		];

		if (isset($fields['formsdefectslist_fieldset']) &&
			isset($fields['formsdefectslist_fieldset']['field_rolls_num'])) {
			$roll_state_values = [];
			foreach ($categories->getTypes() as $type) {
				if (false === mb_stripos($type['name'], 'линолеум')) {
					continue;
				}
				$roll_state_values[] = $type['name'];
			}
			if (0 < count($roll_state_values)) {
				foreach ($roll_state_values as $value) {
					$fields['formsdefectslist_fieldset']['field_rolls_num']['#states']['visible']['select[name="field_product_cat"]'][] = ['value' => $value];
				}
			}
		}

		if (boolval($clone) === true) {
			$fields['formsdefectslist_fieldset']['#attributes'] = ['class' => 'table without-header clone'];
			unset($fields['add_defect_fieldset']);
		}

		foreach ($fields['formsdefectslist_fieldset'] as $key => $value) {
			if (!preg_match("/^#/", $key)) {
				// Поле стоимости стало "составным"
				if ('field_price_fs' == $key) {
					foreach ($value as $key_fs => $value_fs) {
						if (!preg_match("/^#/", $key_fs)) {
							$value[$key_fs . "[$count]"] = $value_fs;
							unset($value[$key_fs]);
						}
					}
				}
				$fields['formsdefectslist_fieldset'][$key . "[$count]"] = $value;
				unset($fields['formsdefectslist_fieldset'][$key]);
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
		return 'formsdefectslist';
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
