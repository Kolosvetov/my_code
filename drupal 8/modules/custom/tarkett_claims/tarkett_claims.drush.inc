<?php
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\user\Entity\User;
use \Drupal\tarkett_claims\classes\Updater;
/**
* @file Contains the code to generate the custom drush commands.
*/
/**
* Implements hook_drush_command().
*/
function tarkett_claims_drush_command() {
	$items = array();
	$items['say-hello'] = [
		'description' => 'Echo the name you type with Say hello command',
		'arguments' => [
			'name' => 'The name for saying hello',
		],
		'drupal dependencies' => ['tarkett_claims'],
		'aliases' => ['say:hello'],
	];
	$items['fix-archive'] = [
		'description' => 'Add new fields to existing nodes',
		'arguments' => [],
		'drupal dependencies' => ['tarkett_claims'],
		'aliases' => ['fix:archive'],
	];
	$items['fix-responsible'] = [
		'description' => 'Remove responsible person UUID for archived claims',
		'arguments' => [],
		'drupal dependencies' => ['tarkett_claims'],
		'aliases' => ['fix:responsible'],
	];
	$items['fix-filelists'] = [
		'description' => 'Fix file lists in distributor info nodes.',
		'arguments' => [],
		'drupal dependencies' => ['tarkett_claims'],
		'aliases' => ['fix:filelists'],
	];
	return $items;
}

/**
* Call back function drush_custom_drush_command_say_hello()
* The call back function name in the  following format
*   drush_{module_name}_{item_id_for_command}()
*/
function drush_tarkett_claims_say_hello($name = '') {
	$config = \Drupal::configFactory()->getEditable('tarkett_claims.settings');
	if ($config->get('Test') !== true) {
		$config->set('Test', true);
		$ids = \Drupal::entityQuery('user')->condition('status', 1)->execute();
		$users = User::loadMultiple($ids);
		foreach ($users as $user)
			\Drupal::service("tarkett_claims.claims_class_updater")->checkList($user);
		$config->set('Test', false);
		var_dump("OK");
	}
}

/**
* Add new fields to existing nodes
*/
function drush_tarkett_claims_fix_archive() {
	$nids = \Drupal::entityQuery('node')->condition('type','obrasenie_pretenzia')->execute();
	$nodes = \Drupal\node\Entity\Node::loadMultiple($nids);
	foreach ($nodes as $node) {
		$needs_to_save = false;
		if (!($node->field_distributor_just_closed->value)) {
			$node->field_distributor_just_closed->value = 0;
			$needs_to_save = true;
		}
		if (!($node->field_market_just_closed->value)) {
			$node->field_market_just_closed->value = 0;
			$needs_to_save = true;
		}
		if ($needs_to_save) {
			$node->save();
			echo 'Обращение #', $node->nid->value, ' обновлено', PHP_EOL;
		}
	}
}

/**
* Remove responsible person UUID for archived claims
*/
function drush_tarkett_claims_fix_responsible() {
	$nids = \Drupal::entityQuery('node')->condition('type','obrasenie_pretenzia')->execute();
	$nodes = \Drupal\node\Entity\Node::loadMultiple($nids);
	foreach ($nodes as $node) {
		if (!($node->field_v_arhive->value)) {
			continue;
		}
		$node->field_responsiblecontactuid->value = '';
		$node->save();
		echo 'Обращение #', $node->nid->value, ' обновлено', PHP_EOL;
	}
}

/**
* Fix file lists in distributor data nodes
*/
function drush_tarkett_claims_fix_filelists() {
	$nids = \Drupal::entityQuery('node')->condition('type','obrasenie_pretenzia')->execute();
	$claims = \Drupal\node\Entity\Node::loadMultiple($nids);

echo 'Найдено обращений: ', count($claims), PHP_EOL, PHP_EOL;

	foreach ($claims as $claim) {

		if ((4 != $claim->field_claims_type->value) ||
			(0 == $claim->field_privazka_distributor->count()) ||
			(0 == $claim->field_dannye_distributora->count())) {
			continue;
		}

		$d_node = \Drupal\node\Entity\Node::load($claim->field_dannye_distributora->getValue()[0]['target_id']);

echo 'Обращение №', $claim->nid->value, ', данные дистрибьютора #', $d_node->nid->value, PHP_EOL;

		// Проверяем чтение пустого списка
		$file_list = $d_node->field_d_file_list->getValue();

		// Изображение
		if (($values = $d_node->field_d_foto->getValue()) &&
			(0 < count($values)) &&
			($pictures = \Drupal\file\Entity\File::loadMultiple(array_map(
				function ($e) { return $e['target_id']; },
				$values
			)))) {
			foreach ($pictures as $picture) {
				$name = $picture->getFileName();
				$f_node = Node::create([
					'type' => 'file_info',
					'title' => 'Сведения о файле Дистрибьютора ' . $name . ' (№' . $claim->nid->value . ')',
					'field_f_fieldname' => 'field_d_foto',
					'field_f_filename' => $name,
					'field_f_drupal_id' => $picture->id(),
					'field_f_api_uuid' => '',
				]);
				$f_node->save();
				$file_list[] = ['target_id' => $f_node->id()];
			}
		}

		// Видео
		if (($values = $d_node->field_d_video->getValue()) &&
			(0 < count($values)) &&
			($videos = \Drupal\file\Entity\File::loadMultiple(array_map(
				function ($e) { return $e['target_id']; },
				$values
			)))) {
			foreach ($videos as $video) {
				$name = $video->getFileName();
				$f_node = Node::create([
					'type' => 'file_info',
					'title' => 'Сведения о файле Дистрибьютора ' . $name . ' (№' . $claim->nid->value . ')',
					'field_f_fieldname' => 'field_d_video',
					'field_f_filename' => $name,
					'field_f_drupal_id' => $video->id(),
					'field_f_api_uuid' => '',
				]);
				$f_node->save();
				$file_list[] = ['target_id' => $f_node->id()];
			}
		}

		// Документы
		if (($values = $d_node->field_d_docs->getValue()) &&
			(0 < count($values)) &&
			($docs = \Drupal\file\Entity\File::loadMultiple(array_map(
				function ($e) { return $e['target_id']; },
				$values
			)))) {
			foreach ($docs as $doc) {
				$name = $doc->getFileName();
				$f_node = Node::create([
					'type' => 'file_info',
					'title' => 'Сведения о файле Дистрибьютора ' . $name . ' (№' . $claim->nid->value . ')',
					'field_f_fieldname' => 'field_d_docs',
					'field_f_filename' => $name,
					'field_f_drupal_id' => $doc->id(),
					'field_f_api_uuid' => '',
				]);
				$f_node->save();
				$file_list[] = ['target_id' => $f_node->id()];
			}
		}

		// Файлы Таркетта
		if (($values = $d_node->field_d_tarkett_files->getValue()) &&
			(0 < count($values)) &&
			($tarkett_files = \Drupal\file\Entity\File::loadMultiple(array_map(
				function ($e) { return $e['target_id']; },
				$values
			)))) {
			foreach ($tarkett_files as $file) {
				$name = $file->getFileName();
				$f_node = Node::create([
					'type' => 'file_info',
					'title' => 'Сведения о файле Дистрибьютора ' . $name . ' (№' . $claim->nid->value . ')',
					'field_f_fieldname' => 'field_d_tarkett_files',
					'field_f_filename' => $name,
					'field_f_drupal_id' => $file->id(),
					'field_f_api_uuid' => '',
				]);
				$f_node->save();
				$file_list[] = ['target_id' => $f_node->id()];
			}
		}

		$d_node->field_d_file_list->setValue($file_list);
		$d_node->save();
echo 'Список обновлён: ', count($file_list), PHP_EOL, PHP_EOL;
	}
}
