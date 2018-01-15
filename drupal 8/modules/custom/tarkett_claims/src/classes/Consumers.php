<?php

namespace Drupal\tarkett_claims\classes;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\ChangedCommand;
use Drupal\Core\Ajax\DataCommand;
use Drupal\Core\Ajax\ReplaceCommand;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\tarkett_claims\classes\forms\BaseForm;
use Drupal\Core\DependencyInjection;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use \Drupal\taxonomy\Entity\Term;
use Drupal\tarkett_api\TarkettSite;

class Consumers extends BaseForm
{

	public $type = 'from_consumer';
	public $user = null;
	protected $collection_wrapper = 'product-collection';
	protected $submit_wrapper = '';

	public function get_form()
	{
		$roles = \Drupal::currentUser()->getRoles();
		$this->type = ('anonymous' == $roles[0]) ? 'pokupatel' : $roles[1];
		return \Drupal::formBuilder()->getForm($this);
	}

	/**
	 *
	 * @return string
	 */
	public function getFormId()
	{
		return 'claims';
	}

	public function fields($type)
	{
		$fields = $this->get('tarkett_claims.claims_class_fields')->getFields('consumer_claims_fields', $type);
		return $fields;
	}

	/**
	 *
	 * @param array $form
	 * @param FormStateInterface $form_state
	 * @return string
	 */
	public function buildForm(array $form, FormStateInterface $form_state)
	{
		$values = $form_state->getValues();
		$name_options = ['' => ''];

		$form = $this->fields($this->type);

		if (isset($form['step-2']) &&
				isset($form['step-2']['product_info'])) {

			if (isset($form['step-2']['product_info']['product_cat'])) {

				$form['step-2']['product_info']['product_cat']['#ajax'] = [
					'callback' => [$this, 'getCollectionOnTypeAjax'],
					'event' => 'change',
					'wrapper' => $this->collection_wrapper,
				];

				if (isset($values['product_cat']) && ($type_name = $values['product_cat'])) {
					$categories = new XMLCategories();
					if ($type_id = $categories->getTypeID($type_name)) {
						foreach ($categories->getCollections($type_id) as $name) {
							$name_options[$name] = $name;
						}
					}
				}
			}
			if (isset($form['step-2']['product_info']['product_name'])) {
				$form['step-2']['product_info']['product_name']['#options'] = $name_options;
				$form['step-2']['product_info']['product_name']['#prefix'] = '<div id="' . $this->collection_wrapper . '">';
				$form['step-2']['product_info']['product_name']['#suffix'] = '</div>';
			}
		}

		return $form;
	}

	/**
	 *
	 * @param array $form
	 * @param FormStateInterface $form_state
	 */
	public function submitForm(array &$form, FormStateInterface $form_state)
	{
		$list_link_suffix = '';

		$result = $this->processFormData($form, $form_state);
		if ($result['email_exists']) {
			$message = 'Пользователь с указанным Вами email уже зарегистрирован в нашей системе.<br>Пожалуйста, <a href="/user/login">авторизуйтесь</a> прежде, чем добавите обращение.';
		} else {
			$user_notified = ($result['needs_to_notify'] && $this->sendNotify($result));

			$message = "<b>Спасибо за Ваше обращение!</b><br>Процесс с номером {$result['claim_id']} зарегистрирован в системе и вскоре будет обработан.<br>Текущий статус обращения №{$result['claim_id']}: {$result['claim_status']}.<br>Вы всегда можете проверить статус вашего обращения по ссылке <a href=\"http://claims.tarkett.ru/node/{$result['claim_id']}\" target=\"_blank\">http://claims.tarkett.ru/node/{$result['claim_id']}</a> или номеру.<br>О всех изменениях статуса вы будет проинформированы по электронной почте.";
			if ($result['user_registered'] && !$result['saler_user']) {
				if ($user_notified) {
					$message .= '<br>Для вас был зарегистрирован новый аккаунт, данные для доступа к которому отправлены по электронной почте.';
				}
				$message .= '<br><br><a href="/user/login">Авторизоваться</a>';
			} else {
				if ($user_notified) {
					if ($result['user_registered']) {
						$message .= '<br>Для пользователя был зарегистрирован новый аккаунт, данные для доступа к которому отправлены по электронной почте.';
					} else {
						$message .= '<br>Пользователю было отправлено письмо с данными процесса.';
					}
				}
				$roles = \Drupal::currentUser()->getRoles();
				if ('anonymous' !== $roles[0]) {
					if ('magazin' === $roles[1]) {
						$list_link_suffix = 'magazin';
					} elseif ('distributor' === $roles[1]) {
						$list_link_suffix = 'distributors';
					} else {
						$list_link_suffix = 'pokupatel';
					}
				}
			}
		}

		drupal_set_message($this->t($message));

		if ('' !== $list_link_suffix) {
			$form_state->setRedirectUrl(
					\Drupal\Core\Url::fromUserInput(
							'/claims_lists_' . $list_link_suffix
					)
			);
		}
	}

	public static $cr = null;
	
	protected function processFormData(array &$form, FormStateInterface $form_state)
	{
		
		$result = [
			'email_exists' => false,		// Указанный E-mail анонимного пользователя уже есть в системе
			'user_registered' => false,		// Пользователь был зарегистрирован при добавлении обращения/претензии
			'saler_user' => false,			// Претензию добавлял продавец
			'needs_to_notify' => false,		// Пользователю необходимо выслать письмо

			'claim_id' => 0,				// Номер обращения/претензии
			'claim_status' => '',			// Статус обращения/претензии
			'fio' => '',					// ФИО пользователя
			'email' => '',					// E-mail пользователя
			'passwd' => '',					// Пароль свежезарегистрированного пользователя
		];
		$problems = [];
		$consumer_requirements = null;
		$defects = [
			'defect' => [],
			'defect_type' => [],
			'defect_status' => [],
			'defect_count' => [],
		];
		if (!empty($_POST['defect'])) {
			$defects['defect'] = $_POST['defect'];
		}
		if (!empty($_POST['defect_type'])) {
			$defects['defect_type'] = $_POST['defect_type'];
		}
		if (!empty($_POST['defect_status'])) {
			$defects['defect_status'] = $_POST['defect_status'];
		}
		if (!empty($_POST['defect_count'])) {
			$defects['defect_count'] = $_POST['defect_count'];
		}

		$user = NULL;
		$current_user = \Drupal::currentUser()->getAccount();
		$roles = $current_user->getRoles();

		$_length = count($roles);
		$main_role = (0 < $_length) ? $roles[$_length - 1] : null;
		$anonymous_user = ('anonymous' === $main_role);
		$saler_user = (false !== array_search('magazin', $roles)) ||
					  (false !== array_search('distributor', $roles));
		$result['saler_user'] = $saler_user;
		// Требуется принудительно создать аккаунт для нового пользователя системы
		if ($anonymous_user || $saler_user) {
			$user = user_load_by_mail($_POST['field_c_email']);
			if (!$user) {
				$result['email'] = $_POST['field_c_email'];
				$result['passwd'] = $this->generatePassword();
				if ($user = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_user($result['email'], $result['passwd'])) {
					$ts = new TarkettSite();
					$ts->addUser([
						'email' => $result['email'],
						'passwd' => $result['passwd'],
						'fio' => $_POST['field_c_fio'],
						'phone' => $_POST['field_c_phone'],
						'UserUID' => $user->field_uid->value,
					]);
					// Пытаемся "авторизовать" свежедобавленного пользователя
					\Drupal::currentUser()->setAccount($user);
					$result['user_registered'] = true;
					$result['needs_to_notify'] = true;
				} else {
					$result['email_exists'] = true;
					return $result;
				}
			} else {
				\Drupal::currentUser()->setAccount($user);
				$result['needs_to_notify'] = true;
			}
		}

		$claim_type = 1;
		if ($saler_user) {
			$claim_type = 2;
		}

		$claim = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_claim([], null, $claim_type); // Добавляет базовую сущность
		if ($current_user->isAnonymous() !== true) {
			if ($user && $result['needs_to_notify']) {
				$result['fio'] = $user->field_user_fio->value;
				\Drupal::currentUser()->setAccount($current_user);
			}
		}
		$consumer_info = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_consumer_info($claim); //Информация о покупателе

		if (count($defects['defect_count']) != 0) {
			$problems = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_problems($defects, $claim); //Список дефектов
		} else {
			$this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_pokupatel_photos($claim); //Список изображений из претензии покупателя
			$this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_pokupatel_video($claim); //Видеоматериал из претензии покупателя
		}
		if (in_array($main_role, ['magazin', 'distributor'])) {
			$consumer_requirements = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_consumer_requirements($claim, true); //Требования покупателя

			if (array_search("magazin", $roles) !== false) {
				$claim->field_privazka_magazina->setValue($current_user->id());
			} elseif (array_search("distributor", $roles) !== false) {
				$claim->field_privazka_distributor->setValue($current_user->id());
			}
		}
		$claim->save();
		
		$this->get('tarkett_claims.claims_class_updater')->createProcess(['claim' => $claim, 'consumer_info' => $consumer_info, 'problems' => $problems, 'consumer_requirements' => $consumer_requirements]);

		$distributor_info = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_distributor_info($claim); //Информация о дистрибьюторе]
		$market_info = $this->get('tarkett_claims.claims_class_forms_extra_data_add')->add_market_info($claim); //Информация о магазине

		$result['claim_id'] = strval($claim->id());
		$_roles = \Drupal::currentUser()->getRoles();
		if ('magazin' === $_roles[1]) {
			$term_id = $claim->field_market_status->entity;
		} elseif ('distributor' === $_roles[1]) {
			$term_id = $claim->field_status_processa_u_distribu->entity;
		} else {
			$term_id = $claim->field_consumer_status->entity;
		}
		if ($term_id) {
			$result['claim_status'] = $term_id->name->value;
		}

		if ($current_user->isAnonymous() === true) {
			if ($user && $result['needs_to_notify']) {
				$result['fio'] = $user->field_user_fio->value;
				\Drupal::currentUser()->setAccount($current_user);
			}
		}

		return $result;
	}

	protected function sendNotify($data = [])
	{
		if (!is_array($data) ||
				(0 == count($data)) ||
				!isset($data['email']) ||
				('' == $data['email'])) {
			return false;
		}

		$to_list = [
			$data['email'],
			'webmaster@tarkett.com',
		];

		if ($data['saler_user']) {
			$template = '<p><strong>Здравствуйте, {{ fio }}.</strong></p><p>От Вашего имени оформлена претензия на сайте <a href="http://claims.tarkett.ru/" target="_blank" style="color:#284864;text-decoration:none;">claims.tarkett.ru</a>.</p><p>Процесс с номером {{ claim_id }} зарегистрирован в системе и вскоре будет обработан.<br/>Текущий статус обращения(претензии) №{{ claim_id }} - {{ claim_status }}</p><p>Вы всегда можете проверить статус вашего обращения в личном кабинете по ссылке<br/><a href="http://claims.tarkett.ru/node/{{ claim_id }}" target="_blank" style="color:#284864;text-decoration:none;">http://claims.tarkett.ru/node/{{ claim_id }}</a> .</p>';
		} else {
			$template = '<p><strong>Здравствуйте, {{ fio }}.</strong></p><p>Вы успешно заполнили форму обращения на сайте <a href="http://claims.tarkett.ru/" target="_blank" style="color:#284864;text-decoration:none;">claims.tarkett.ru</a>.</p><p>Процесс с номером {{ claim_id }} зарегистрирован в системе и вскоре будет обработан.<br/>Текущий статус обращения(претензии) №{{ claim_id }} - {{ claim_status }}</p><p>Вы всегда можете проверить статус вашего обращения в личном кабинете по ссылке<br/><a href="http://claims.tarkett.ru/node/{{ claim_id }}" target="_blank" style="color:#284864;text-decoration:none;">http://claims.tarkett.ru/node/{{ claim_id }}</a> .</p>';
		}
		if ($data['user_registered']) {
			$template .= '<p>Сгенерированы данные для входа в личный кабинет:<br/>Логин: {{ email }}<br/>Пароль: {{ passwd }}<br/></p>';
		}

		$content = str_replace(
			['{{ fio }}', '{{ claim_id }}', '{{ claim_status }}', '{{ email }}', '{{ passwd }}'],
			[$data['fio'], $data['claim_id'], $data['claim_status'], $data['email'], $data['passwd']],
			$template
		);
		$mail_theme = [
			'#type' => 'markup',
			'#theme' => 'mail_template',
			'#content' => $content,
		];
		$html = \Drupal::service('renderer')->render($mail_theme);

		$transport = \Swift_MailTransport::newInstance();
		$mailer = \Swift_Mailer::newInstance($transport);
		$logo_image = \Swift_Image::fromPath('sites/default/files/images/logo/mail-logo.png');

		foreach ($to_list as $to) {
			$message = \Swift_Message::newInstance('Регистрация в Tarkett Claims');
			$message->setBody(
				str_replace('%%LOGO_SRC%%', $message->embed($logo_image), $html),
				'text/html',
				'utf-8'
			)->setFrom(array('notify@claims.tarkett.ru' => 'Tarkett Claims'))->setTo(array($to));
			$mailer->send($message);
		}

		return true;
	}

	protected $abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	protected function generatePassword($len = 16)
	{
		srand();
		$limit = strlen($this->abc) - 1;
		$pwd = [];
		for ($i = 0; $i < $len; $i++) {
			$pwd[] = substr($this->abc, rand(0, $limit), 1);
		}
		return implode('', $pwd);
	}

	public function getCollectionOnTypeAjax(array &$form, FormStateInterface $form_state)
	{
		// Читаем выбранное значение "Категории товара"
		$values = $form_state->getValues();
		$type_name = $values['product_cat'];

		// Список вариантов для "Коллекция"
		$options = ["" => ""];
		$unit = '';

		// Работаем с XML-файлом категорий
		$categories = new XMLCategories();
		if ($type_id = $categories->getTypeID($type_name)) {
			foreach ($categories->getCollections($type_id) as $name) {
				$options[$name] = $name;
			}
			$unit = $categories->getUnitForTypeID($type_id);
		}
		$form['step-2']['product_info']['product_name']['#options'] = $options;

		$response = new AjaxResponse();
		$response->addCommand(
				new ReplaceCommand(
				'#' . $this->collection_wrapper, trim(drupal_render($form['step-2']['product_info']['product_name']))
				)
		);
		if ('' !== $unit) {
			$response->addCommand(
					new DataCommand(
					'#' . $this->collection_wrapper, 'product-unit', $unit
					)
			);
		}
		$response->addCommand(
				new ChangedCommand(
				'#' . $this->collection_wrapper
				)
		);
		return $response;
	}

}
