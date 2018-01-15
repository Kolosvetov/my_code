<?php

namespace Drupal\tarkett_claims\services;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Render\Renderer;
use Drupal\views\Views;

/**
 * Class AssetsExtension
 * @package TAO\Bundle\Template\Twig
 */
class Lists extends \Twig_Extension
{

	/**
	 * @return array
	 */
	public function getFunctions()
	{
		return [
			new \Twig_SimpleFunction('claims_list', [$this, 'ClaimsList'], ['is_safe' => ['all']]),
		];
	}

	public function ClaimsList($tab = "in_work")
	{
		$url = $_SERVER['REQUEST_URI'];
		$block_name = 'pokupatel';
		//	TODO:: refactoring
		if (substr_count($url, 'claims_lists_pokupatel')>0) {
			$view_name = 'pokupatel_spisok_obrasenii';
		}
		if (substr_count($url, 'claims_lists_magazin')>0) {
			$view_name = 'prodavec_spisok_obrasenii';
		}
		if (substr_count($url, 'claims_lists_distributors')>0) {
			$view_name = 'distributor_spisok_obrasenii';
		}
		$view = views_embed_view($view_name, $tab);
		$content['#markup'] = drupal_render($view);
		return $content;
	}

	/**
	 * 
	 * @param type $name
	 * @return type
	 */
	public static function get($name)
	{
		return \Drupal::service($name);
	}

	/**
	 * @return string
	 */
	public function getName()
	{
		return 'tarkett_twig_extension_lists';
	}

}
