<?php

namespace Drupal\tarkett_claims\classes;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ChangedCommand;
use Drupal\Core\Ajax\DataCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\tarkett_claims\classes\forms\BaseForm;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;
use Drupal\taxonomy\Entity\Term;

class Distributors extends BaseForm
{

	protected $collection_wrapper = 'product-collection';
	protected $design_wrapper = 'collection-design';

	public $type = null;

	public function get_form($type = '')
	{
		$this->type = $type;
		return \Drupal::formBuilder()->getForm($this);
	}

	/**
	 * 
	 * @return string
	 */
	public function getFormId()
	{
		return 'claims';
	}

	
	
	public function add_claim()
	{
		
//		$default_status = array_shift(\Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['field_code'=>'c-consideration']))->id();
//		$d_default_status = array_shift(\Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['field_code'=>'d-heading']))->id();
		$d_default_status = $this->get('tarkett_claims.claims_class_utils')->get_term_id_by_code('d-heading');
		$_date = date('h:i:s d.m.y');
		$node = Node::create([
					'type' => 'obrasenie_pretenzia',
					'title' => 'Обращение ' . $_date,
//					'field_consumer_status' => [$default_status],
//					'field_market_status' => [$default_status],
					'field_status_processa_u_distribu' => [$d_default_status],
					'field_product_address_full' => "Регион: " . $_POST['product_region'] . "<br /> Город: " . $_POST['product_city'] . "<br /> Место:" . $_POST['product_address'], //Адрес местонахождения товара
					'field_product_address_region' => $_POST['product_region'], //Адрес местонахождения товара
					'field_product_address_city' => $_POST['product_city'], //Адрес местонахождения товара
					'field_product_address' => $_POST['product_address'], //Адрес местонахождения товара
					'field_product_can_show' => $_POST['d_can_show'], //Возможно предоставить образец
					'field_claims_date' => date('Y-m-d'), //Дата покупки
//					'field_product_cat' => $_POST['product_cat'], //Категория продукта
//					'field_product_name' => $_POST['product_name'], //Коллекция
					'field_defect_text' => isset($_POST['defect_text'])? $_POST['defect_text']:"", //Описание проблемы
					'field_claims_status' => 0,
					'field_claims_type' => 4,
					'field_d_claim_type' => $_POST['d_claim_type'],
					'field_d_can_show' => $_POST['d_can_show'],
		]);
		$node->save();
		$node->title = 'Обращение №' . $node->nid->value . ' - ' . $_date;
		$node->save();
		return $node;
	}
	
	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 * @return string
	 */
	public function buildForm(array $form, FormStateInterface $form_state)
	{
		$values = $form_state->getValues();
		$name_options = ['' => ''];
		$design_options = ['' => ''];

		$form = $this->get('tarkett_claims.claims_class_fields')->getFields('distributor_claims_fields');

		if (isset($form['step-2']) &&
			isset($form['step-2']['distributor_consumer_info_3'])) {

			if (isset($form['step-2']['distributor_consumer_info_3']['field_product_cat'])) {

				$form['step-2']['distributor_consumer_info_3']['field_product_cat']['#ajax'] = [
					'callback' => [$this, 'getCollectionOnTypeAjax'],
					'event' => 'change',
					'wrapper' => $this->collection_wrapper,
				];

				if ((isset($values['field_product_cat'])) && ($type_name = $values['field_product_cat'])) {
					$categories = new XMLDesigns();
					if ($type_id = $categories->getTypeID($type_name)) {
						foreach ($categories->getCollections($type_id) as $name) {
							$name_options[$name] = $name;
						}
					}
					if ($collection_name = $values['field_kollekcia']) {
						foreach ($categories->getDesigns($type_id, $collection_name) as $name) {
							$design_options[$name] = $name;
						}
					}
				}
			}
			if (isset($form['step-2']['distributor_consumer_info_3']['field_kollekcia'])) {

				$form['step-2']['distributor_consumer_info_3']['field_kollekcia']['#options'] = $name_options;
				$form['step-2']['distributor_consumer_info_3']['field_kollekcia']['#prefix'] = '<div id="' . $this->collection_wrapper . '">';
				$form['step-2']['distributor_consumer_info_3']['field_kollekcia']['#suffix'] = '</div>';
				$form['step-2']['distributor_consumer_info_3']['field_kollekcia']['#ajax'] = [
					'callback' => [$this, 'getDesignOnCollectionAjax'],
					'event' => 'change',
					'wrapper' => $this->design_wrapper,
				];

			}
		}

		return $form;
	}

	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 */
	public function submitForm(array &$form, FormStateInterface $form_state)
	{
		$claim = $this->add_claim();
		$distributor_info = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_distributor_info($claim, true); //Информация о дистрибьюторе
		$this->get('tarkett_claims.claims_class_updater')->createProcess(['claim' => $claim, 'problems' => [], 'distributor_info' => $distributor_info]);
		
		$claim_id = strval($claim->id());
		$claim_status = Term::load($claim->field_status_processa_u_distribu[0]->target_id)->name->value;
		$message = "<b>Спасибо за Ваше обращение!</b><br>Процесс с номером {$claim_id} зарегистрирован в системе и вскоре будет обработан.<br>Текущий статус обращения №{$claim_id}: {$claim_status}.<br>Вы всегда можете проверить статус вашего обращения по ссылке <a href=\"http://claims.tarkett.ru/node/{$claim_id}\" target=\"_blank\">http://claims.tarkett.ru/node/{$claim_id}</a> или номеру.<br>О всех изменениях статуса вы будет проинформированы по электронной почте.";

		drupal_set_message($this->t($message));
		$form_state->setRedirectUrl(
			\Drupal\Core\Url::fromUserInput('/claims_lists_distributors')
		);
	}


	public function getCollectionOnTypeAjax(array &$form, FormStateInterface $form_state)
	{
		// Читаем выбранное значение "Категории товара"
		$values = $form_state->getValues();
		$type_name = $values['field_product_cat'];
		// Список вариантов для "Коллекция"
		$options = ["" => ""];
		$unit = '';

		// Работаем с XML-файлом категорий
		$categories = new XMLDesigns();
		if ($type_id = $categories->getTypeID($type_name)) {
			foreach ($categories->getCollections($type_id) as $name) {
				$options[$name] = $name;
			}
			$unit = $categories->getUnitForTypeID($type_id);
		}
		$form['step-2']['distributor_consumer_info_3']['field_kollekcia']['#options'] = $options;

		$response = new AjaxResponse();
		$response->addCommand(
			new ReplaceCommand(
				'#' . $this->collection_wrapper,
				trim(drupal_render($form['step-2']['distributor_consumer_info_3']['field_kollekcia']))
			)
		);
		if ('' !== $unit) {
			$response->addCommand(
				new DataCommand(
					'#' . $this->collection_wrapper,
					'product-unit',
					$unit
				)
			);
		}
		$response->addCommand(
			new ChangedCommand(
				'#' . $this->collection_wrapper
			)
		);
		return $response;
	}

	public function getDesignOnCollectionAjax(array &$form, FormStateInterface $form_state)
	{
		// Читаем выбранные значения "Категории товара" и "Коллекции"
		$values = $form_state->getValues();
		$type_name = $values['field_product_cat'];
		$collection_name = $values['field_kollekcia'];
		// Список вариантов для "Дизайна"
		$design_options = [''];

		// Работаем с XML-файлом категорий
		$categories = new XMLDesigns();
		if ($type_id = $categories->getTypeID($type_name)) {
			foreach ($categories->getDesigns($type_id, $collection_name) as $name) {
				$design_options[] = $name;
			}
		}

		$response = new AjaxResponse();
		$response->addCommand(
			new DataCommand(
				'#' . $this->collection_wrapper,
				'design-id',
				'edit-field-dizain'
			)
		);
		$response->addCommand(
			new DataCommand(
				'#' . $this->collection_wrapper,
				'design-options',
				json_encode($design_options)
			)
		);
		$response->addCommand(
			new ChangedCommand(
				'#' . $this->collection_wrapper
			)
		);
		return $response;
	}

}
