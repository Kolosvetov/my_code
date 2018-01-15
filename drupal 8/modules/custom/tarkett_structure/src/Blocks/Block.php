<?php

/**
  @file
  Contains \Drupal\tarkett_structure\Blocks\Solution.
 */

namespace Drupal\tarkett_structure\Blocks;

use Drupal\Component\Utility\Crypt;
use Drupal\Component\Utility\Xss;
use Drupal\views\ViewExecutable;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DateFormatterInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class Block extends ControllerBase
{
	public function block_answers_block($parms, $form_name, $node, $form_info)
	{
		$res = [
			'#type' => 'markup',
			'#theme' => 'block_answers_block',
			'#answer' => $parms,
			'#form_name' => $form_name,
			'#node' => $node,
			'#form_info' => $form_info,
		];
		return $res;
	}
	
	public function block_claims_list_tabs($view_id, $current_tab) 
	{
		$count = 0;
		if ($view_id != 'pokupatel_spisok_obrasenii') {
			$view = \Drupal\views\Views::getView($view_id);
			$view->setDisplay('new');
			$view->execute();
			$count = count($view->result);
		}
		
		$tabs = [
			'pokupatel_spisok_obrasenii' => [
				'in_work' => [
					'title' => 'Обращения/претензии',
					'url' => \Drupal::url("tarkett_structure.claims_lists_pokupatel", ['tab'=>'in_work'])
				],
			],
			'prodavec_spisok_obrasenii' => [
				'new' => [
					'title' => 'Входящие обращения',
					'url' => \Drupal::url("tarkett_structure.claims_lists_magazin", ['tab'=>'new']),
					'count' => $count
				],
				'in_work' => [
					'title' => 'Обращения/претензии в работе',
					'url' => \Drupal::url("tarkett_structure.claims_lists_magazin", ['tab'=>'in_work'])
				],
				'archive' => [
					'title' => 'Архив обращений/претензий',
					'url' => \Drupal::url("tarkett_structure.claims_lists_magazin", ['tab'=>'archive'])
				],
			],
			'distributor_spisok_obrasenii' => [
				'new' => [
					'title' => 'Входящие обращения',
					'url' => \Drupal::url("tarkett_structure.claims_lists_distributor", ['tab'=>'new']),
					'count' => $count
				],
				'in_work' => [
					'title' => 'Обращения/претензии в работе',
					'url' => \Drupal::url("tarkett_structure.claims_lists_distributor", ['tab'=>'in_work'])
				],
				'archive' => [
					'title' => 'Архив обращений/претензий',
					'url' => \Drupal::url("tarkett_structure.claims_lists_distributor", ['tab'=>'archive'])
				],
			],
		];
		
		$res = [
			'#type' => 'markup',
			'#theme' => 'block_claims_list_tabs',
			'#tabs' => $tabs[$view_id],
			'#current_tab' => $current_tab,
		];
		return $res;
	}
	public function block_invoices_form($parms)
	{
		return $this->get('tarkett_claims.claims_class_forms_controller')->getForm("tarkett_claims.claims_class_forms_invoices", $parms);
	}
	public function block_defects_list_form($parms)
	{
		return $this->get('tarkett_claims.claims_class_forms_controller')->getForm("tarkett_claims.claims_class_forms_defects_list", $parms);
	}
	public function block_user_header($title = "") 
	{
		$currentUser = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$res = [
			'#type' => 'markup',
			'#theme' => 'block_user_header',
			'#full_user' => $currentUser,
		];
		if ($title != "") {
			$res['#title'] = $title;
		} else {
			$roles = $currentUser->getRoles(true);
			$role = array_shift($roles);
			$title = "Обращения и&nbsp;претензии";
			switch ($role) {
				case "magazin":
					$title .= " магазина";
					break;
				case "distributor":
					$title .= " дистрибьютора";
					break;
				case "pokupatel":
					$title .= " покупателя";
					break;
			}
			$res['#title'] = $title;
		}
		return $res;
	}
	

	public function claims_market_data($node)
	{
		$ref_node = NULL;
		if (count($node->field_claims_dannye_magazina->getValue()) > 0) {
			foreach ($node->field_claims_dannye_magazina->getValue() as $ref_entity) {
				$ids[] = $ref_entity['target_id'];
			}
			
			if (isset($ids)) {
				$ref_node =  \Drupal\node\Entity\Node::load(array_shift($ids));
			}
		}
		return [
			'#type' => 'markup',
			'#theme' => 'structure_market_block',
			'#node' => $ref_node,
			'#current_node' => $node,
		];
	}
	public function claims_distributor_data($node)
	{
		$ref_node = null;
		if (count($node->field_dannye_distributora->getValue()) > 0) {
			foreach ($node->field_dannye_distributora->getValue() as $ref_entity) {
				$ids[] = $ref_entity['target_id'];
			}
			
			if (isset($ids)) {
				$ref_node =  \Drupal\node\Entity\Node::load(array_shift($ids));
			}
		}
		
		return [
			'#type' => 'markup',
			'#theme' => 'structure_distributor_block',
			'#node' => $ref_node,
			'#current_node' => $node,
		];
	}

	public function claims_consumer_solution($node)
	{
		$ref_node = null;
		$trebovanie = null;
		
//		if ($node->field_claims_type->value == 2) {
//			
//		}
//		die('!!');
//		if (count($node->field_claims_resenia_po_obraseni->getValue()) > 0) {
//			foreach ($node->field_claims_resenia_po_obraseni->getValue() as $ref_entity) {
//				$ids[] = $ref_entity['target_id'];
//			}
//			
//			if (isset($ids)) {
//				$ref_node =  \Drupal\node\Entity\Node::load(array_shift($ids));
//			}
//		}
		
		if (count($node->field_trebovanie->getValue()) > 0) {
			foreach ($node->field_trebovanie->getValue() as $ref_entity) {
				$ids[] = $ref_entity['target_id'];
			}
			
			if (isset($ids)) {
				$trebovanie =  \Drupal\node\Entity\Node::load(array_shift($ids));
			}
		}

		return [
			'#type' => 'markup',
			'#theme' => 'structure_solutions_block',
			'#node' => $node,
			'#current_node' => $node,
			'#trebovanie' => $trebovanie,
		];
	}

	public function claims_distributors_data()
	{
		
	}

	public static function get($name)
	{
		return \Drupal::service($name);
	}

}
