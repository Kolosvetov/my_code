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
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\Routing\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use \Drupal\user\UserInterface;

class Controller extends ControllerBase
{
	public function structureIndex()
	{
		$url_parts = explode("?", $_SERVER['REQUEST_URI']);
		$url = str_replace("/index_dev.php", "", $url_parts[0]);

		if ($url == '/') {
			\Drupal::service("tarkett_claims.claims_class_utils")->tryLogin();
			$roles = \Drupal::currentUser()->getRoles();
			$main_role = array_pop($roles);
			if (in_array($main_role, ['pokupatel', 'magazin', 'distributor'])) {
				$response = new RedirectResponse(\Drupal::url("tarkett_structure.claims_lists_{$main_role}_notab"));
			} else {
				$response = new RedirectResponse("/user/login");
			}
			$response->send();
		}
		return ;
	}

	public function add_claim_distributor_defect()
	{
		$roles = \Drupal::currentUser()->getRoles();
		$main_role = array_pop($roles);
		if ($response = $this->maybe_redirect($main_role, 'distributor')) {
			drupal_set_message(t('Вы не можете добавлять претензии Дистрибьютора.'), 'error');
			$response->send();
			return;
		}
		return array(
			'#type' => 'markup',
			'#theme' => 'structure_add_claim_distributor_defect',
		);
	}

	public function add_claim_distributor_logistic()
	{
		$roles = \Drupal::currentUser()->getRoles();
		$main_role = array_pop($roles);
		if ($response = $this->maybe_redirect($main_role, 'distributor')) {
			drupal_set_message(t('Вы не можете добавлять претензии Дистрибьютора.'), 'error');
			$response->send();
			return;
		}
		\Drupal::service("tarkett_claims.claims_class_utils")->tryLogin();
		return array(
			'#type' => 'markup',
			'#theme' => 'structure_add_claim_distributor_logistic',
		);
	}

	public function add_market_claim()
	{
		$roles = \Drupal::currentUser()->getRoles();
		$main_role = array_pop($roles);
		if ($response = $this->maybe_redirect($main_role, 'magazin')) {
			drupal_set_message(t('Вы не можете добавлять претензии Магазина.'), 'error');
			$response->send();
			return;
		}
		\Drupal::service("tarkett_claims.claims_class_utils")->tryLogin();
		return array(
			'#type' => 'markup',
			'#theme' => 'structure_add_market_claim',
		);
	}

	public function add_consumer_claim()
	{
		\Drupal::service("tarkett_claims.claims_class_utils")->tryLogin();
		$roles = \Drupal::currentUser()->getRoles();
		$main_role = array_pop($roles);
		$redirect_role = ('magazin' == $main_role) ? 'market' : $main_role;
		$_title = 'Новое обращение Покупателя';
		if ($requested_role = \Drupal::request()->get('role')) {
			if ('anonymous' == $main_role) {
				$dest = drupal_get_destination();
				$dest['destination'] .= '?role=' . $requested_role;
				$response = new RedirectResponse(
					\Drupal\Core\Url::fromUserInput(
						'/user/login',
						['query' => $dest]
					)->toString()
				);
				$response->send();
				return;
			} elseif ($requested_role != $redirect_role) {
				$is_distributor = ('distributor' == $requested_role);
				$response = new RedirectResponse(
					 ('distributor' == $main_role) ? '/claims_lists_distributors' : '/claims_lists_' . $main_role
				);
				drupal_set_message(
					t('Вы не можете добавлять претензии Покупателя от лица ' . ($is_distributor ? 'Дистрибьютора' : 'Магазина') . '.'),
					'error'
				);
				$response->send();
				return;
			}
			$_title = 'Новая претензия Покупателя';
		} elseif (!in_array($main_role, array('anonymous', 'pokupatel'))) {
			$response = new RedirectResponse(
				 '/add_consumer_claim?role=' . $redirect_role
			);
			$response->send();
			return;
		}
		return array(
			'#type' => 'markup',
			'#theme' => 'structure_add_consumer_claim',
			'#title' => $_title,
		);
	}

	public function lists($tab = NULL)
	{
		\Drupal::service("tarkett_claims.claims_class_utils")->tryLogin();
		$this->get('tarkett_claims.claims_class_updater')->checkList();

		$roles = \Drupal::currentUser()->getRoles();
		
		if ($roles[1] == "pokupatel") {
			$tab = "in_work";
		}
		if ($roles[1] == "magazin" || $roles[1] == "distributor") {
			$view = \Drupal\views\Views::getView($roles[1] == "magazin"? 'prodavec_spisok_obrasenii':'distributor_spisok_obrasenii');
			$view->setDisplay("new");
			$view->execute();
			
			if(count($view->result) == 0 && $tab == null) {
				$tab = "in_work";
			} elseif($tab == null) {
				$tab = "new";
			}
		}
		
		return array(
			'#type' => 'markup',
			'#theme' => 'structure_claims_lists',
			'#tab' => $tab,
		);
	}

	public function user_settings()
	{	
		if ($_POST) {
			\Drupal::service("tarkett_structure.claims_utils_user")->update_user_info($_POST);
		}
		return array(
			'#type' => 'markup',
			'#theme' => 'structure_claims_user_settings',
		);
	}
	
	public function about()
	{
		return array(
			'#type' => 'markup',
			'#theme' => 'about',
		);
	}
	
	public function access(AccountInterface $account) 
	{
		$roles = $account->getRoles();
		$main_role = array_pop($roles);
		if (!in_array($main_role, ['pokupatel', 'magazin', 'distributor'])) {
			return AccessResult::forbidden();
		}
		$url = $_SERVER['REQUEST_URI'];
		$role_url = \Drupal::url("tarkett_structure.claims_lists_{$main_role}_notab");
		return AccessResult::allowedIf(strpos($url, $role_url) === false ? false : true);
	}
	
	public static function get($name)
	{
		return \Drupal::service($name);
	}

	protected function maybe_redirect($current_role, $needed_role)
	{
		$response = NULL;
		if ('anonymous' == $current_role) {
			$response = new RedirectResponse(
				\Drupal\Core\Url::fromUserInput(
					'/user/login',
					['query' => drupal_get_destination()]
				)->toString()
			);
		} elseif ($needed_role != $current_role) {
			$response = new RedirectResponse(
				('distributor' == $current_role) ? '/claims_lists_distributors' : '/claims_lists_' . $current_role
			);
		}
		return $response;
	}
}
