<?php

namespace Drupal\tarkett_claims\classes;

use Drupal\tarkett_claims\classes\XMLCategories;

class XMLDesigns extends XMLCategories
{
	protected $xml_path = 'sites/default/files/xml/productTypes.xml';


	public function getDesigns($type_id, $collection_name)
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
		$design_list = [];
		foreach ($this->categories[$type_id]['list'] as $collection) {
			if ($collection_name == $collection['name']) {
				$design_list = $collection['list'];
				break;
			}
		}
		foreach ($design_list as $design) {
			$list[] = $design['name'];
		}
		return $list;
	}


	public function getDesignsByTypeName($type_name, $collection_name)
	{
		$list = [];
		if (!($type_id = $this->getTypeId($type_name))) {
			return $list;
		}
		$list = $this->getDesigns($type_id, $collection_name);
		return $list;
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

		$count = 0;
		foreach ($node->childNodes as $child) {
			if ('Collection' !== $child->nodeName) {
				continue;
			}
			$this->categories[$catid]['list'][$count] = [
				'name' => $child->attributes->getNamedItem('Name')->value,
				'list' => [],
			];
			foreach ($child->childNodes as $grandchild) {
				if ('Desing' !== $grandchild->nodeName) {
					continue;
				}
				$this->categories[$catid]['list'][$count]['list'][] = [
					'name' => $grandchild->attributes->getNamedItem('Name')->value,
				];
			}
			$count += 1;
		}
	}

}