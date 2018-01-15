<?php define('INCLUDE_HEADER', true)?>
<?php
global $USER;

if (\TAO::getCurrentLang() == 'en') {
	$ru_url = "/";
	$en_url = $_SERVER['REQUEST_URI'];
} else {
	$en_url = "/en/";
	$ru_url = $_SERVER['REQUEST_URI'];
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="format-detection" content="telephone=no">
	<link rel="icon" type="image/ico" href="/favicon.png">
	<title> <?php $APPLICATION->ShowTitle(); ?></title>
	<?php
		\TAO::frontendCss('index');
		\TAO::frontendJs('index');
		\TAO::app()->ShowHead(false);
	?>
</head>
<body class="<?= substr_count($_SERVER['REQUEST_URI'], "/competitions/tehno-oskar/") > 0 && CSite::InGroup([6]) === true? "tehno-oskar":"" ?>">
<?php $APPLICATION->ShowPanel() ?>
<div class="c-content">
	<header class="b-header">
		<a class="b-header__logo" href="<?= \TAO::getCurrentLang() == 'en'? "/en/":"/" ?>"><img src="/<?= \TAO::t('logo') ?>"></a>
		<div class="b-header__menu">
			<?= \TAO::navigation()->render(); ?>
		</div>
		<div class="b-header__lang">
			<a href="<?= $ru_url ?>" class="ru <?= \TAO::getCurrentLang() == 'en'? "":"active" ?>">Рус</a>
			<a href="<?= $en_url ?>" class="en <?= \TAO::getCurrentLang() == 'en'? "active":"" ?>">Eng</a>
		</div>
		<div class="b-header__login <?= $USER->GetID()? "login":"" ?>">
			<?php if ($USER->GetID()) { 
				$dbUser = CUser::GetByID($USER->GetID());
				$arUser = $dbUser->Fetch();
				?>
				<div class="b-header__username"><?= substr($arUser['NAME'], 0, 1) ?><?= substr($arUser['LAST_NAME'], 0, 1) ?></div>
				<a href="/?logout=yes"><?= \TAO::t('logout') ?></a>
			<?php } else { ?>
				<a href="#login" class="fancybox"><?= \TAO::t('login') ?></a>
			<?php } ?>
		</div>
	</header>
	<div id="login" style="display: none;">
	<?php $APPLICATION->IncludeComponent("bitrix:system.auth.form","",Array(
		 "REGISTER_URL" => "register.php",
		 "FORGOT_PASSWORD_URL" => "",
		 "STORE_PASSWORD" => "N",
		 "PROFILE_URL" => "profile.php",
		 "SHOW_ERRORS" => "Y" 
		 )
	);?>
	</div>
	