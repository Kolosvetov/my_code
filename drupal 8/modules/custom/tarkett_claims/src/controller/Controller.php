<?php
/**
@file
Contains \Drupal\tarkett_claims\controller\Controller.
 */
 
namespace Drupal\tarkett_claims\controller;
 
use Drupal\Component\Utility\Crypt;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DateFormatterInterface;
use Drupal\node\Entity\Node;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\RedirectResponse;

class Controller extends ControllerBase {
	public function form() {
		return array(
			'#type' => 'markup',
			'#theme' => 'claims_form',
		);
	}

	public function defects_photo($name, $description) {
		return array(
			'#type' => 'markup',
			'#theme' => 'defects_photo',
			'#name' => $name,
			'#description' => $description,
		);
	}

	public function defects_photo_only($name) {
		return array(
			'#type' => 'markup',
			'#theme' => 'defects_photo_only',
			'#name' => $name,
		);
	}

	public function defects_video($name, $embeded = false) {
		return array(
			'#type' => 'markup',
			'#theme' => 'defects_video',
			'#name' => $name,
			'#embeded' => $embeded,
		);
	}

	public function distributor_docs($name) {
		return array(
			'#type' => 'markup',
			'#theme' => 'docs_list',
			'#name' => $name,
		);
	}

	public function print_claim($claim_id) {
		if (!($node = Node::load($claim_id))) {
			throw new NotFoundHttpException();
		}

		$user = \Drupal::currentUser();

		if (!($node->access('view', $user))) {
			throw new AccessDeniedHttpException();
		}

		switch ($node->field_claims_type->value) {
			case 4:
				$template = 'printing_distributor_claim';
				break;
			case 3:
				$template = 'printing_magazin_claim';
				break;
			case 2:
			default:
				$template = 'printing_pokupatel_claim';
		}
		return array(
			'#type' => 'page',
			'#theme' => $template,
			'#node' => $node,
			'#user' => \Drupal\user\Entity\User::load($user->id()),
			'#qrurl' => \Drupal::service('tarkett_claims.claims_class_utils')->get_claim_qr_code($claim_id),
		);
	}

	public function qr_code($claim_id) {
		$response = new RedirectResponse(
			\Drupal::service('tarkett_claims.claims_class_utils')->get_claim_qr_code($claim_id)
		);
		return $response->send();
	}
}