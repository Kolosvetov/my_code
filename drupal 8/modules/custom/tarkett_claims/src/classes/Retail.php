<?php

namespace Drupal\tarkett_claims\classes;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ChangedCommand;
use Drupal\Core\Ajax\DataCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use \Drupal\taxonomy\Entity\Term;
use Drupal\tarkett_claims\classes\forms\BaseForm;

class Retail extends BaseForm
{
	protected $collection_wrapper = 'product-collection';

	/**
	 * 
	 * @return string
	 */
	public function getFormId()
	{
		return 'claims';
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

		$form = $this->get('tarkett_claims.claims_class_fields')->getFields('market_claims_fields');

		if (isset($form['step-2']) &&
			isset($form['step-2']['product_info'])) {

			if (isset($form['step-2']['product_info']['product_cat'])) {

				$form['step-2']['product_info']['product_cat']['#ajax'] = [
					'callback' => [$this, 'getCollectionOnTypeAjax'],
					'event' => 'change',
					'wrapper' => $this->collection_wrapper,
				];

				if (isset($values['product_cat']) && ($type_name = $values['product_cat'])) {
					$categories = new XMLCategories();
					if ($type_id = $categories->getTypeID($type_name)) {
						foreach ($categories->getCollections($type_id) as $name) {
							$name_options[$name] = $name;
						}
					}
				}
			}
			if (isset($form['step-2']['product_info']['product_name'])) {

				$form['step-2']['product_info']['product_name']['#options'] = $name_options;
				$form['step-2']['product_info']['product_name']['#prefix'] = '<div id="' . $this->collection_wrapper . '">';
				$form['step-2']['product_info']['product_name']['#suffix'] = '</div>';

			}
		}

		$form['#attributes']['enctype'] = 'multipart/form-data';

		return $form;
	}

	/**
	 * 
	 * @param array $form
	 * @param FormStateInterface $form_state
	 */
	public function submitForm(array &$form, FormStateInterface $form_state)
	{
		$problems = [];
		$defects = [
			'defect' => [],
			'defect_type' => [],
			'defect_status' => [],
			'defect_count' => [],
		];
		if (!empty($_POST['defect'])) {
			$defects['defect'] = $_POST['defect'];
		}
		if (!empty($_POST['defect_type'])) {
			$defects['defect_type'] = $_POST['defect_type'];
		}
		if (!empty($_POST['defect_status'])) {
			$defects['defect_status'] = $_POST['defect_status'];
		}
		if (!empty($_POST['defect_count'])) {
			$defects['defect_count'] = $_POST['defect_count'];
		}

		$claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_claim([], null, 3); // Добавляет базовую сущность
		if (count($defects['defect_count']) != 0) {
			$problems = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_problems($defects, $claim); //Список дефектов
		}
		$this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_magazin_photos($claim); //Список изображений из претензии магазина
		$this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_magazin_video($claim); //Видеоматериал из претензии магазина
		$market_info = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_market_info($claim, true); //Информация о магазине
		
		$this->get('tarkett_claims.claims_class_updater')->createProcess(['claim' => $claim, 'problems' => $problems, 'market_info' => $market_info]);
		
		$this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_distributor_info($claim); //Информация о дистрибьюторе
		$claim_id = strval($claim->id());
		$claim_status = Term::load($claim->field_market_status[0]->target_id)->name->value;
		$message = "<b>Спасибо за Ваше обращение!</b><br>Процесс с номером {$claim_id} зарегистрирован в системе и вскоре будет обработан.<br>Текущий статус обращения №{$claim_id}: {$claim_status}.<br>Вы всегда можете проверить статус вашего обращения по ссылке <a href=\"http://claims.tarkett.ru/node/{$claim_id}\" target=\"_blank\">http://claims.tarkett.ru/node/{$claim_id}</a> или номеру.<br>О всех изменениях статуса вы будет проинформированы по электронной почте.";

		drupal_set_message($this->t($message));
		$form_state->setRedirectUrl(
			\Drupal\Core\Url::fromUserInput('/claims_lists_magazin')
		);
	}


	public function getCollectionOnTypeAjax(array &$form, FormStateInterface $form_state)
	{
		// Читаем выбранное значение "Категории товара"
		$values = $form_state->getValues();
		$type_name = $values['product_cat'];
		// Список вариантов для "Коллекция"
		$options = ["" => ""];
		$unit = '';

		// Работаем с XML-файлом категорий
		$categories = new XMLCategories();
		if ($type_id = $categories->getTypeID($type_name)) {
			foreach ($categories->getCollections($type_id) as $name) {
				$options[$name] = $name;
			}
			$unit = $categories->getUnitForTypeID($type_id);
		}
		$form['step-2']['product_info']['product_name']['#options'] = $options;

		$response = new AjaxResponse();
		$response->addCommand(
			new ReplaceCommand(
				'#' . $this->collection_wrapper,
				trim(drupal_render($form['step-2']['product_info']['product_name']))
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
}
