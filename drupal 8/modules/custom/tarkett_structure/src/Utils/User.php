<?php

namespace Drupal\tarkett_structure\Utils;

class User
{
	public function update_user_info($post)
	{
		$user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
		$user->field_user_fio->setValue(htmlspecialchars($post['user_fio']));
		$user->field_user_phone->setValue(htmlspecialchars($post['user_phone']));
		$user->field_user_email->setValue(htmlspecialchars($post['user_email']));
		if ($_FILES['files']['size'] > 0) {
			if (is_dir("public://images/users/" . \Drupal::currentUser()->id() . '/') === false)
				mkdir("public://images/users/" . \Drupal::currentUser()->id() . '/');
				$picture = file_save_upload("user_avatar", [], "public://images/users/" . \Drupal::currentUser()->id() . '/');
				if ($picture[0]) {
					$user->user_picture->setValue(['target_id' => $picture[0]->id()]);
				}
		}
		$t = $user->save();
		header("Location: ".$_SERVER["REQUEST_URI"],TRUE,301);
		die;
	}
}