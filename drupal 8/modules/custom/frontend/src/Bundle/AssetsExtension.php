<?php

namespace Drupal\frontend\Bundle;

/**
 * Class AssetsExtension
 * @package TAO\Bundle\Template\Twig
 */
class AssetsExtension extends \Twig_Extension
{
    /**
     * @return array
     */
    public function getFunctions()
    {
        return [
            new \Twig_SimpleFunction('frontend_css', [$this, 'frontend_css'], ['is_safe' => ['all']]),
            new \Twig_SimpleFunction('frontend_js', [$this, 'frontend_js'], ['is_safe' => ['all']]),
        ];
    }

    public function frontend_css($name, $attrs = [])
    {
        return $this->get('frontend.frontend_assets')->include_css($name, $attrs);
    }

    public function frontend_js($name, $attrs = [])
    {
        return $this->get('frontend.frontend_assets')->include_js($name, $attrs);
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
        return 'tao_twig_extension_assets';
    }
}
