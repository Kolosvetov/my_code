<?php

namespace Drupal\tarkett_claims\services;

use Drupal\tarkett_claims\classes\Consumers;
use Drupal\tarkett_claims\classes\Distributors;
use Drupal\tarkett_claims\classes\Retail;
use Drupal\Core\Form\FormStateInterface;
use Drupal\file\Entity\File;
use Drupal\file\Plugin\Field\FieldWidget\FileWidget;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Entity\Entity\Term;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\tarkett_api\TarkettSite;
/**
 * Class AssetsExtension
 * @package TAO\Bundle\Template\Twig
 */
class ClaimsExtension extends \Twig_Extension
{

	/**
	 * @return array
	 */
	public function getFunctions()
	{
		return [
			new \Twig_SimpleFunction('claims_form', [$this, 'claims_form'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_draw_defects', [$this, 'claims_draw_defects'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_defects_forms', [$this, 'claims_defects_forms'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_defects_photo', [$this, 'claims_defects_photo'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_defects_photo_only', [$this, 'claims_defects_photo_only'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_defects_video', [$this, 'claims_defects_video'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_docs', [$this, 'claims_docs'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_add_block', [$this, 'claims_add_block'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_solutions_block', [$this, 'claims_solutions_block'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_solutions_form', [$this, 'claims_solutions_form'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_answers_block', [$this, 'claims_answers_block'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_draw_image', [$this, 'claims_draw_image'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_user_header', [$this, 'claims_user_header'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_invoices_form', [$this, 'claims_invoices_form'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('claims_defects_list_form', [$this, 'claims_defects_list_form'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('block_claims_list_tabs', [$this, 'block_claims_list_tabs'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('element_by_target_id', [$this, 'element_by_target_id'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('user_mail', [$this, 'user_mail'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('redirect_from_this_hell', [$this, 'redirect_to'], ['is_safe' => ['all']]),
			new \Twig_SimpleFunction('onload', [$this, 'onload'], ['is_safe' => ['all']]),

			new \Twig_SimpleFunction('claims_format_size', function ($size) {
				return format_size($size);
			}, ['is_safe' => ['all']]),
		];
	}
	
	public function onload()
	{
		$url = explode("?", $_SERVER['REQUEST_URI']);
		if ($url != '/user/login') {
			\Drupal::service("tarkett_claims.claims_class_utils")->tryLogin();
		}
		$host = trim($_SERVER['HTTP_HOST'], 'www.');
		$intra = str_replace("claims.tarkett.ru", "", $host);
		$host = str_replace("claims", "", $host);
		if (isset($_COOKIE['logout']) && $_COOKIE['logout'] == 'yes') {
			setcookie('logout', '', 0, '/', $host);
			user_logout();
			$this->redirect_to('list');
		}
	}

	public function claims_answers_block()
	{
		$parms = func_get_args();
		$out = null;
		$form_info = [];
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$roles = $user->getRoles();

		$userUid = $user->field_uid->value;
//		$State = $this->get('tarkett_api.index')->process_getState([
//			'userUid' => $userUid,
//			'processUid' => $parms[1]->field_process_uid->value,
//		]);
		

		if (array_search("pokupatel", $roles) !== false) {
			if ($parms[1]->field_claims_type->value != 2 || count($parms[1]->field_trebovanie) > 0) {
				$parms[0] = false;
			}
			$form_info = [];
		}
		if (array_search("magazin", $roles) !== false) {
			if ($parms[1]->get('field_d_answer')->count() > 0) {
				$out[] = array(
					'title' => 'Комментарий дистрибьютора',
					'text' => $parms[1]->get('field_d_answer'),
				);
			}
			if ($parms[1]->get('field_m_answer')->count() > 0) {
				$out[] = array(
					'title' => 'Комментарий магазина',
					'text' => $parms[1]->get('field_m_answer'),
				);
				$parms[0] = false;
			} elseif (array_search($parms[1]->field_schemeuid->value, ["25e6282c-d502-44fa-8130-3569f326a2e6", "15292cf0-99f2-4470-b495-0dafb45246fd"]) === false) {
				$parms[0] = false;
			}
			$form_info = [
				'title' => 'Ответ Магазина покупателю',
			];
		}
		if (array_search("distributor", $roles) !== false) {
			if ($parms[1]->get('field_answers')->count() > 0) {
				$out[] = array(
					'title' => 'Комментарий Tarkett',
					'text' => $parms[1]->get('field_answers'),
				);
			}
			if ($parms[1]->get('field_d_answer')->count() > 0) {
				$out[] = array(
					'title' => 'Комментарий дистрибьютора',
					'text' => $parms[1]->get('field_d_answer'),
				);
				$parms[0] = false;
			} elseif (array_search($parms[1]->field_schemeuid->value, ["e3838b1a-1b0c-4aef-bd81-637a0d0e6cc5", "ce330d10-58bc-4d96-a748-bd4dcdb533cf", "96a9766b-bd22-4352-a48c-d127bef70be9"]) === false) {
				$parms[0] = false;
			}
			$form_info = [
				'title' => 'Ответ Дистрибьютора',
				'description' => 'Укажите причину отклонения претензии (данная информация будет доступна Магазину!)'
			];
		}
		return $this->get('tarkett_structure.claims_blocks_block')->block_answers_block($out, $parms[0], $parms[1], $form_info);
	}

	public function redirect_to($path)
	{

		if ($path == 'list') {
			$roles = \Drupal::currentUser()->getRoles();
			$main_role = array_pop($roles);
			
			if (in_array($main_role, ['pokupatel', 'magazin', 'distributor'])) {
				$path = \Drupal::url("tarkett_structure.claims_lists_{$main_role}_notab");
			} else {
				$path = '/user/login';
			}
		} 		
		$response = new RedirectResponse($path);
		return $response->send();
	}

	public function user_mail()
	{
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		return $user->field_user_email->value;
	}

	public function element_by_target_id($id, $type = "node")
	{
		$el = false;
		switch ($type) {
			case "node":
				$el = \Drupal\node\Entity\Node::load((int) $id);
				break;
			case "user":
				$el = \Drupal\user\Entity\User::load((int) $id);
				break;
			case "term":
				$el = \Drupal\taxonomy\Entity\Term::load((int) $id);
				break;
		}
		return $el;
	}

	public function claims_invoices_form()
	{
		$parms = func_get_args();
		return $this->get('tarkett_structure.claims_blocks_block')->block_invoices_form($parms);
	}

	public function claims_defects_list_form()
	{
		$parms = func_get_args();
		return $this->get('tarkett_structure.claims_blocks_block')->block_defects_list_form($parms);
	}

	public function block_claims_list_tabs($view_id, $current_tab)
	{
		return $this->get('tarkett_structure.claims_blocks_block')->block_claims_list_tabs($view_id, $current_tab);
	}

	public function claims_user_header($title = "")
	{
		return $this->get('tarkett_structure.claims_blocks_block')->block_user_header($title);
	}

	public function claims_draw_image($image, $mode = "default")
	{
		$image_data = $image->getValue();
		$file = File::load($image_data['target_id']);

		$image_style = [
			'#weight' => -10,
			'#theme' => 'image_style',
			'#width' => $image_data['width'],
			'#height' => $image_data['height'],
			'#style_name' => $mode,
			'#uri' => $file->getFileUri(),
		];
		return drupal_render($image_style);
	}

	public function claims_add_block($node, $datatype = null)
	{
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
//		$process = $this->get('tarkett_api.index')->process_getState([
//				'userUid' => $user->field_uid->value,
//				'processUid' => $node->field_process_uid->value,
//			]);
//			var_dump($process);
//			die;

		$user = \Drupal::currentUser();
		$UserRoles = $user->getRoles();

		$datatype = $datatype ?: array_pop($UserRoles);
		switch ($datatype) {
			case "magazin":
				$result = $this->get('tarkett_structure.claims_blocks_block')->claims_market_data($node);
				break;
			case "distributor":
				$result = $this->get('tarkett_structure.claims_blocks_block')->claims_distributor_data($node);
				break;
			case "pokupatel":
				// $result = $this->get('tarkett_structure.claims_blocks_block')->claims_consumer_solution($node);
				// break;
			default :
				$result = $this->get('tarkett_structure.claims_blocks_block')->claims_consumer_solution($node);
				break;
		}
		return $result;
	}

	public function claims_solutions_form($form_name, $node)
	{
		return $this->get('tarkett_claims.claims_class_solutions')->get_form($form_name, $node);
	}

	public function claims_form($f_name, $options = null)
	{
//		$user = \Drupal::currentUser();
//		$UserRoles = $user->getRoles();
//		
//		$service_class = $role;
//		$service_class = 'claims_class_pokupatel';
//
//		if (in_array('magazin', $UserRoles)) {
//			$service_class = 'claims_class_magazin';
//		}
//		if (in_array('distributor', $UserRoles)) {
//			$service_class = 'claims_class_distributor';
//		}

		$s_name = 'tarkett_claims.claims_class_' . $f_name;

		if ($options !== null)
			return $this->get($s_name)->get_form($options);

		return $this->get($s_name)->get_form();
	}

	public function claims_defects_forms($code, $type, $count)
	{
		$user = \Drupal::currentUser();
		$user->getRoles();
		$form = $this->get('tarkett_claims.claims_class_forms_controller')->getForm($code, $type, $count);
		return $form;
	}

	public function claims_draw_defects()
	{
		$user = \Drupal::currentUser();
		$user->getRoles();

		return $this->get('tarkett_claims.claims_class_controller')->form();
	}

	public function claims_defects_photo($name, $defect = "", $status = 0, $service = 'parket')
	{
		$description = "";
		$service_name = 'tarkett_claims.claims_class_forms_' . $service;
		if (($defect != 'default') &&
			\Drupal::hasService($service_name)) {
			$obj = $this->get($service_name);

			$description = call_user_func_array([$obj, $defect], [$status]);
			$user = \Drupal::currentUser();
			$user->getRoles();
		}
		return $this->get('tarkett_claims.claims_class_controller')->defects_photo($name, $description);
	}

	public function claims_defects_photo_only($name)
	{
		return $this->get('tarkett_claims.claims_class_controller')->defects_photo_only($name);
	}

	public function claims_defects_video($name, $embeded = false)
	{
		return $this->get('tarkett_claims.claims_class_controller')->defects_video($name, $embeded);
	}

	public function claims_docs($name)
	{
		return $this->get('tarkett_claims.claims_class_controller')->distributor_docs($name);
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

	/**
	 * @return string
	 */
	public function getName()
	{
		return 'tarkett_twig_extension_forms';
	}

}
