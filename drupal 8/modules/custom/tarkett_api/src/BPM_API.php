<?php

namespace Drupal\tarkett_api;

class BPM_API
{
	/**
	 * Создать новый процесс.
	 * @param type $data
	 * @return type
	 */
	public function process_create($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/create', $data);
	}
	/**
	 * Получить фильтрованный список процессов.
	 * @param type $data
	 * @return type
	 */
	public function process_list($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/list', $data);
	}
	/**
	 * Получить объект с параметрами текущего этапа процесса.
	 * @param type $data
	 * @return type
	 */
	public function process_getState($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/getState', $data);
	}
	/**
	 * Добавить комментарий.
	 * @param type $data
	 * @return type
	 */
	public function process_addComment($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/addComment', $data);
	}
	/**
	 * Сохранить произведённые изменения в этапе.
	 * @param type $data
	 * @return type
	 */
	public function process_putState($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/putState', $data);
	}
	/**
	 * Следующий этап.
	 * @param type $data
	 * @return type
	 */
	public function process_putStateAndNewState($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/putStateAndNewState', $data);
	}
	/**
	 * Получение содержимого файла по идентификатору файла.
	 * @param type $data
	 * @return type
	 */
	public function process_getFile($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/getFile', $data, 0);
	}
	/**
	 * Полный список параметров процесса.
	 * @param type $data
	 * @return type
	 */
	public function process_getBrief($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/getBrief', $data);
	}
	/**
	 * Загрузка файла.
	 * @param type $data
	 * @return type
	 */
	public function process_putFile($data)
	{
		return $this->get('tarkett_api.proxy')->makeRequest('/api/is/bpm/process/putFile', $data, 0);
	}
	public static function get($name)
	{
		return \Drupal::service($name);
	}
}