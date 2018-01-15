<?php

namespace Drupal\frontend\Bundle;

use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpKernel\KernelInterface;

class FrontendAssets
{

    protected $kernel;
    protected $env;
    protected $jsonDir;
    protected $jsonData = [];
    protected $publicPath;
    protected $defaultAttrs = [];

	
    public function __construct($kernel, $jsonDir = 'frontend/assets', $publicPath = 'builds')
    {
        $this->kernel = $kernel;
		$config = \Drupal::config('frontend.settings'); 
        $this->env = \Drupal::getContainer()->getParameter('kernel.environment');
        $this->jsonDir = $jsonDir;
        $this->readJson($this->env);
        $this->publicPath = $publicPath;
        $this->defaultAttrs = [
            'css' => ['media' => 'screen', 'rel' => 'stylesheet'],
            'js'  => []
        ];
    }

    public function readJson($env)
    {
        $path = $this->getJsonPath($env);
        if ($path) {
            $this->jsonData = json_decode(file_get_contents($path), true);
        }
    }

    public function getJsonPath($env)
    {
		return realpath('./' . $this->jsonDir . '/' . $env . '.json');
    }

    public function include_file($type, $name, $attrs = [])
    {
        if (isset($this->jsonData[$name])) {
            $url = $this->getJsonUrl($name, $type);
        } else {
            $url = $this->getStaticUrl($name, $type);
        }
        if ($url) {
            $defaultAttrs = $this->defaultAttrs[$type];
            $attrs = array_merge($defaultAttrs, $attrs);
            return $this->tag($type, $url, $attrs);
        }
        return '';
    }

    public function include_css($name, $attrs = [])
    {
        return $this->include_file('css', $name, $attrs);
    }

    public function include_js($name, $attrs = [])
    {
        return $this->include_file('js', $name, $attrs);
    }

    protected function attrsToString($attrs)
    {
        $attrsString = '';
        foreach($attrs as $name => $value) {
            $attrsString .= " {$name}=\"{$value}\"";
        }
        return trim($attrsString);
    }

    public function tag($type, $url, $attrs)
    {
        $attrsString = $this->attrsToString($attrs);
		$url .= "?".time();
        if ($type == 'css') {
            return "<link href=\"$url\" $attrsString>";
        }
        if ($type == 'js') {
            return "<script src=\"$url\" $attrsString></script>";
        }
        return '';
    }

    public function getStaticUrl($name, $type)
    {
        $url = "/{$this->publicPath}/{$this->env}/{$type}/{$name}.{$type}";
        if (is_file("./{$url}")) {
            return $url;
        }
        return null;
    }

    public function getJsonUrl($name, $type)
    {
        $data  = $this->jsonData[$name];
        if (isset($data[$type])) {
            return $data[$type];
        }
        return null;
    }


}