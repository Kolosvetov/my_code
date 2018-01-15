<?php

namespace Drupal\tarkett_api;

class Contact_API
{
	/**
	 * Получить контакт персоны
	 * @param type $data
	 * @return type
	 */
	public function person_get($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/contact/person/get', $data);
	}
	/**
	 * Создать контакт персоны
	 * Изменить контакт персоны
	 * @param type $data
	 * @return type
	 */
	public function person_put($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/contact/person/put', $data);
	}
	/**
	 * Поиск контактов
	 * @param type $data
	 * @return type
	 */
	public function person_search($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/contact/search', $data);
	}
	/**
	 * Создать запрос получения роли
	 * @param type $data
	 * @return type
	 */
	public function person_CreateRoleRequest($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/contact/person/createRoleRequest', $data);
	}
	/**
	 * Статус запроса получения роли
	 * @param type $data
	 * @return type
	 */
	public function person_GetRoleRequestStatus($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/contact/person/getRoleRequestStatus', $data);
	}
	/**
	 * Получить контакт организации
	 * @param type $data
	 * @return type
	 */
	public function company_get($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/contact/company/get', $data);
	}
	public static function get($name)
	{
		return \Drupal::service($name);
	}
}