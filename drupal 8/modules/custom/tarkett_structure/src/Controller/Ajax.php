<?php

/**
  @file
  Contains \Drupal\tarkett_structure\Controller\Controller.
 */

namespace Drupal\tarkett_structure\Controller;

use Drupal\Component\Utility\Crypt;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DateFormatterInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
use Drupal\tarkett_api\TarkettSite;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ChangedCommand;
use Drupal\Core\Ajax\DataCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\Core\Ajax\PrependCommand;

//TODO: refactoring
class Ajax extends ControllerBase
{

	public function defect_list()
	{
		$element = array(
			'#type' => 'markup',
			'#theme' => 'ajax_defect_list',
		);
		echo (string) drupal_render($element);
		die;
	}

	public function login()
	{
		$response = new AjaxResponse();
		$ts = new TarkettSite();
		if ($ts->loginUser($_POST) === true) {
			if ($url = \Drupal::request()->cookies->get('destination')) {
				$command = new RedirectCommand($url);
				setcookie('destination', '', 0, '/');
			} else {
				$command = new RedirectCommand("http://" . $_SERVER['HTTP_HOST'] . '/');
			}
			$response->addCommand($command);
		} else {
			$status_messages = array('#type' => 'status_messages');
			drupal_set_message("Имя пользователя и пароль не совпадают или у вас еще нет учетной записи на сайте", 'error');
			$messages = \Drupal::service('renderer')->renderRoot($status_messages);
			if (!empty($messages)) {
				$response->addCommand(new ReplaceCommand('.status-msg', $messages));
			}
		}
		return $response;
	}

	public function defect_form()
	{
		$element = array(
			'#type' => 'markup',
			'#theme' => 'ajax_defect_form',
		);
		echo (string) drupal_render($element);
		die;
	}

	public function distributors_defects_list()
	{
		$element = @$this->get('tarkett_claims.claims_class_forms_controller')->getForm("tarkett_claims.claims_class_forms_defects_list", [$_GET['without_add_button'], $_GET['count'], $_GET['type'], $_GET['collection']]);
		echo (string) drupal_render($element);
		die;
	}

	public function distributors_invoices()
	{
		$element = @$this->get('tarkett_claims.claims_class_forms_controller')->getForm("tarkett_claims.claims_class_forms_invoices", [$_GET['without_add_button'], $_GET['count']]);
		echo (string) drupal_render($element);
		die;
	}

	public function add_defect()
	{
		$fields = $this->get('tarkett_claims.claims_class_forms_parket')->get_form($_POST['defect_type'], $_POST['defect_status'], $_POST['defect_count']);
		$res_arr = [];
		foreach ($fields as $fieldset_name => $fieldset_data) {
			foreach ($fieldset_data as $field_name => $field_data) {
				if (isset($_POST[$field_name])) {

					if ($field_data['#type'] == "radios" || $field_data['#type'] == "select") {
						$value = $field_data['#options'][$_POST[$field_name]];
					} else {
						$value = htmlspecialchars($_POST[$field_name]);
					}

					$res_arr[($field_data['#title'] ? $field_data['#title'] : $fieldset_data['#title'])] = $value ? $value : "-";
				}
			}
		}

		$node = Node::create([
					'type' => 'opisanie_problemy',
					'title' => 'Defect',
					'field_opisanie_defekta' => \GuzzleHttp\json_encode($res_arr),
		]);
		$node->save();
		die('ok');
	}

	public function check_email()
	{
		$response = new AjaxResponse();
		$ts = new TarkettSite();
		$res = $ts->checkMail($_POST['field_c_email']);
		$res = \GuzzleHttp\json_decode($res);
		if ($res->find === true) {
			$status_messages = array('#type' => 'status_messages');
			drupal_set_message("Пользователь с таким Email, существует в системе таркетт, прежде чем заполнять обращение, войдите в систему.", 'error');
			$messages = \Drupal::service('renderer')->renderRoot($status_messages);
			if (!empty($messages)) {
				$response->addCommand(new ReplaceCommand('.status-msg', $messages));
				$response->addCommand(new DataCommand('#edit-field-c-email', 'notmatch', "true"));
			}
		} else {
			$response->addCommand(new ReplaceCommand('.status-msg', '<div class="status-msg"></div>'));
		}
		return $response;
	}

	public function import_producttypes()
	{

//		

		$file = file_get_contents("./sites/default/files/xml/productTypesCut.xml");

		$ProductTypes = new \SimpleXMLElement($file);
//		var_dump($SimpleXMLElement);

		foreach ($ProductTypes as $ProductType) {
//			var_dump($ProductType['ID'], $ProductType['Name'], $ProductType['Unit']);
			$term = array_shift(\Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['field_id' => (string) $ProductType['ID']]));
			$n_term = null;

			if (!$term) {
				$n_term = Term::create([
							'parent' => [],
							'name' => (string) $ProductType['Name'],
							'field_name' => (string) $ProductType['Name'],
							'field_id' => (string) $ProductType['ID'],
							'field_unit' => (string) $ProductType['Unit'],
							'vid' => 'product_type',
						])->save();
			}

			foreach ($ProductType->Collection as $Collection) {
//				var_dump((string)$Collection['Name']);
				$c_term = null;
				if ($n_term) {
					Term::create([
						'parent' => [$n_term->id],
						'name' => (string) $ProductType['Name'],
						'vid' => 'product_type',
					])->save();
				} elseif ($term) {
					$c_term = array_shift(\Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['name' => (string) $Collection["Name"]]));
					if (!$c_term) {
						Term::create([
							'parent' => [$term->id()],
							'name' => (string) $Collection['Name'],
							'vid' => 'product_type',
						])->save();
					}
				}

//				var_dump($Collection["Name"]);
			}
		}

//		$finds = \Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties(['field_id'=>"test1"]);
//		$term_fields = $finds[30]->getFields();
//		var_dump($term_fields['parent']);
//		var_dump(get_class_methods($finds[30]));
//		Term::create([
//			'parent' => [29],
//			'name' => 'test',
//			'vid' => 'product_type',
//		])->save();

		die('import_producttypes');
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
