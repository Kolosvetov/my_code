		<div class="b-bottom-menu base-row col-4">
			<div class="column">
				<h3><span>Онкологический центр</span></h3>
				<?= \TAO::navigation('nav_footer_main')->render('footer_menu') ?>
			</div>
			<div class="column">
				<h3><span>Направления</span></h3>
				<?= \TAO::navigation('nav_footer_directions')->render('footer_menu') ?>
			</div>
			<div class="column">
				<h3><span>Наши клиники</span></h3>
				<?= \TAO::navigation('nav_footer_link')->render('footer_menu_target') ?>
			</div>
			<div class="column contacts">
				<h3><span>Контакты</span></h3>
				<?php $phone = \TAO\Ext\Vars::get('number_phone')->previewText() ?>
				<a href="tel:<?= $phone ?>" class="phone"><?= $phone ?></a>
				<div class="b-app">
					<a href="https://itunes.apple.com/ru/app/licnyj-kabinet-pacienta/id1176926240" rel="nofollow" target="_blank"><img src="/html/img/app_store.png" width="90"></a>&nbsp;
					<a href="https://play.google.com/store/apps/details?id=ru.smclinic.lk_android" rel="nofollow" target="_blank"><img src="/html/img/google_play.png" width="90"></a>
				</div>
				<a href="#" class="js-callback-btn" data-form-type="js-analytic-footer-callback"><span>Перезвоните мне</span></a>
				<a href="#" class="js-appointment-btn" data-form-type="js-analytic-footer-appointment"><span>Записаться на прием</span></a>
				<a href="#" class="js-question-btn" data-form-type="js-analytic-footer-question"><span>Задать вопрос</span></a>
				<div class="b-social">
					<a target="_blank" href="https://www.facebook.com/smclinic" class="fb"></a>
					<a target="_blank" href="http://vk.com/smclinica" class="vk"></a>
					<a target="_blank" href="https://ok.ru/smclinica" class="ok"></a>
					<a target="_blank" href="https://www.instagram.com/smclinic/" class="in"></a>
				</div>
				<?= \TAO::frontend()->render('common/techart'); ?>
			</div>
		</div>
		<div class="b-footer base-row">
			<p>© <?= date('Y') ?> «СМ-Клиника» — онкологический центр</p>
			<p class="light">Материалы, размещенные на данной странице, носят информационный характер и предназначены для образовательных целей. Посетители сайта не должны использовать их в качестве медицинских рекомендаций. Определение диагноза и выбор 
				методики лечения остается исключительной прерогативой вашего лечащего врача! ООО «СМ-Клиника» не несёт ответственности за возможные негативные последствия, возникшие в результате использования информации, размещенной на сайте.</p>
			<div class="b-footer-words">
				Имеются противопоказания. Необходимо проконсультироваться со специалистом
			</div>
		</div>
	</div>
	<?//= \TAO::Form('Callback')->setOption('layout', 'callback-popup')->render(); ?>
	<?//= \TAO::Form('Appointment')->setOption('layout', 'appointment-popup')->render(); ?>
	<?//= \TAO::Form('Question')->setOption('layout', 'question-popup')->render(); ?>

<div class="reveal" id="callback" data-reveal>
</div>
<div class="reveal" id="make_appointment" data-reveal>
</div>
<div class="reveal" id="ask" data-reveal>
</div>
<div class="reveal" id="administration" data-reveal>
</div>
<?php /*

 */?>
  <!-- Yandex.Metrika counter -->
	<script type="text/javascript">
	    (function (d, w, c) {
		(w[c] = w[c] || []).push(function() {
		    try {
			w.yaCounter44645254 = new Ya.Metrika({
			    id:44645254,
			    clickmap:true,
			    trackLinks:true,
			    accurateTrackBounce:true,
			    webvisor:true
			});
		    } catch(e) { }
		});

		var n = d.getElementsByTagName("script")[0],
		    s = d.createElement("script"),
		    f = function () { n.parentNode.insertBefore(s, n); };
		s.type = "text/javascript";
		s.async = true;
		s.src = "https://mc.yandex.ru/metrika/watch.js";

		if (w.opera == "[object Opera]") {
		    d.addEventListener("DOMContentLoaded", f, false);
		} else { f(); }
	    })(document, window, "yandex_metrika_callbacks");
	</script>
	<noscript><div><img src="https://mc.yandex.ru/watch/44645254" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
	<!-- /Yandex.Metrika counter -->
		<?php
		\TAO::frontendCss('index');
		\TAO::frontendJs('index');
		$APPLICATION->AddHeadScript('/local/vendor/techart/bitrix.tao/scripts/forms/jquery.form.js'); 
		$APPLICATION->AddHeadScript('/local/vendor/techart/bitrix.tao/scripts/forms/form.js'); 
		$APPLICATION->AddHeadScript(SITE_TEMPLATE_PATH . '/js/analytic.js');
		\TAO::app()->ShowHead(false);
	?>
</body>
</html>
