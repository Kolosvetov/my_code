<?php

namespace Drupal\tarkett_claims\classes;

class XMLCategories
{
	protected $xml_path = 'sites/default/files/xml/productTypesCut.xml';
	protected $categories = [];


	public function getTypes()
	{
		if (0 == count($this->categories)) {
			$this->readCategories($this->xml_path);
		}
		if (0 == count($this->categories)) {
			return [];
		}
		$types = [];
		foreach ($this->categories as $cat_id => $cat) {
			$types[] = [
				'name' => $cat['name'],
				'unit' => $cat['unit'],
				'id' => $cat_id,
			];
		}
		return $types;
	}


	public function getTypeID($type_name)
	{
		if (0 == count($this->categories)) {
			$this->readCategories($this->xml_path);
		}
		if (0 == count($this->categories)) {
			return [];
		}
		foreach ($this->categories as $cat_id => $cat) {
			if ($type_name == $cat['name']) {
				return $cat_id;
			}
		}
		return false;
	}


	public function getCollections($type_id)
	{
		$list = [];
		if (0 == count($this->categories)) {
			$this->readCategories($this->xml_path);
		}
		if (0 == count($this->categories)) {
			return $list;
		}
		if (!isset($this->categories[$type_id])) {
			return $list;
		}
		foreach ($this->categories[$type_id]['list'] as $collection) {
			$list[] = $collection['name'];
		}
		return $list;
	}


	public function getUnits()
	{
		$units = [];
		if (0 == count($this->categories)) {
			$this->readCategories($this->xml_path);
		}
		if (0 == count($this->categories)) {
			return $units;
		}
		foreach ($this->categories as $cat_id => $cat) {
			$units[] = $cat['unit'];
		}
		return $units;
	}


	public function getUnitForTypeID($type_id)
	{
		$unit = '';
		if (0 == count($this->categories)) {
			$this->readCategories($this->xml_path);
		}
		if (0 == count($this->categories)) {
			return $unit;
		}
		if (!isset($this->categories[$type_id])) {
			return $unit;
		}
		$unit = $this->categories[$type_id]['unit'];
		return $unit;
	}


	protected function readCategories($file_path)
	{
		if (!file_exists($file_path)) {
			return;
		}

		$xml = file_get_contents($file_path);
		$reader = new \XMLReader;
		$reader->xml($xml);
		$this->categories = [];

		while ($reader->read()) {
			if (($reader->nodeType == \XMLReader::ELEMENT) &&
				($reader->localName == 'ProductType')) {
				$node = $reader->expand();
				$this->extractFrom($node);
			}
		}
		$reader->close();
	}


	protected function extractFrom($node)
	{
		$catid = $node->attributes->getNamedItem('ID')->value;
		$catname = $node->attributes->getNamedItem('Name')->value;
		$catunit = $node->attributes->getNamedItem('Unit')->value;

		$this->categories[$catid] = [
			'name' => $catname,
			'unit' => $catunit,
			'list' => [],
		];

		foreach ($node->childNodes as $child) {
			if ('Collection' !== $child->nodeName) {
				continue;
			}
			$this->categories[$catid]['list'][] = [
				'name' => $child->attributes->getNamedItem('Name')->value,
			];
		}
	}

}