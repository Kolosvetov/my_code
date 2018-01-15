<?php define('INCLUDE_HEADER', true)?>
<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="format-detection" content="telephone=no">
	<link rel="icon" type="image/ico" href="/favicon.ico">
	<title> <?php $APPLICATION->ShowTitle(); ?></title>

	

	
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-47296181-16', 'auto');
	  ga('send', 'pageview');

	</script>
	
		<!-- calltouch code -->
<script type="text/javascript">
(function (w, d, nv, ls){
var cid  = function () { try { var m1 = d.cookie.match('(?:^|;)\\s*_ga=([^;]*)');if (!(m1 && m1.length > 1)) return null; var m2 = decodeURIComponent(m1[1]).match(/(\d+\.\d+)$/); if (!(m2 && m2.length > 1)) return null; return m2[1]} catch (err) {}}();
var ct = function (w, d, e, c, n){ var a = 'all', b = 'tou', src = b + 'c' + 'h';  src = 'm' + 'o' + 'd.c' + a + src;
    var jsHost = "https://" + src, p = d.getElementsByTagName(e)[0],s = d.createElement(e);
    s.async = 1; s.src = jsHost + "." + "r" + "u/d_client.js?param;" + (c ? "client_id" + c + ";" : "") + "ref" + escape(d.referrer) + ";url" + escape(d.URL) + ";cook" + escape(d.cookie) + ";attrs" + escape("{\"attrh\":" + n + ",\"ver\":170310}") + ";";
    if (!w.jQuery) { var jq = d.createElement(e); jq.src = jsHost + "." + "r" + 'u/js/jquery-1.7.min.js'; jq.onload = function () { 
        p.parentNode.insertBefore(s, p);};
        p.parentNode.insertBefore(jq, p);}else{
        p.parentNode.insertBefore(s, p);}};
var gaid = function(w, d, o, ct, n){ if (!!o){ w.ct_timer = 0; w.ct_max_iter = (navigator.userAgent.match(/Opera|OPR\//) ? 10 : 20); w.ct_interval = setInterval(function(){
w.ct_timer++; if (w.ct_timer>=w.ct_max_iter) { clearInterval(w.ct_interval); ct(w, d, 'script', null, n); }},200);
w[o](function (){ var clId = null; try { var cnt = w[o] && w[o].getAll ? w[o].getAll() : null; clId = cnt && cnt.length > 0 && !!cnt[0] && cnt[0].get ? cnt[0].get('clientId') : null;} catch(e){ console.warn("Unable to get clientId, Error: "+e.message);} clearInterval(w.ct_interval); if(w.ct_timer < w.ct_max_iter){ct(w, d, 'script', clId, n);}});}else{ct(w, d, 'script', null, n);}};
if (cid === null && !!w.GoogleAnalyticsObject){
    if (w.GoogleAnalyticsObject=='ga_ckpr') w.ct_ga='ga'; else w.ct_ga = w.GoogleAnalyticsObject;
        if (typeof Promise !== "undefined" && Promise.toString().indexOf("[native code]") !== -1){new Promise(function (resolve) {var db, on = function () {  resolve(true)  }, off = function () {  resolve(false)}, tryls = function tryls() { try { ls && ls.length ? off() : (ls.x = 1, ls.removeItem("x"), off());} catch (e) { nv.cookieEnabled ? on() : off(); }};w.webkitRequestFileSystem ? webkitRequestFileSystem(0, 0, off, on) : "MozAppearance" in d.documentElement.style ? (db = indexedDB.open("test"), db.onerror = on, db.onsuccess = off) : /constructor/i.test(w.HTMLElement) ? tryls() : !w.indexedDB && (w.PointerEvent || w.MSPointerEvent) ? on() : off();}).then(function (pm){
            if (pm){gaid(w, d, w.ct_ga, ct, 2);}else{gaid(w, d, w.ct_ga, ct, 3);}})}else{gaid(w, d, w.ct_ga, ct, 4);}
}else{ct(w, d, 'script', cid, 1);}})(window, document, navigator, localStorage);
</script>
<!-- /calltouch code -->
</head>
<body>
	<?php $APPLICATION->ShowPanel() ?>
	<?= \TAO::frontend()->render('common/btn-up', ['text' => 'Наверх'])?>
	<?= \TAO::frontend()->render('common/btn-up', ['text' => ''])?>
	<div class="drop-menu-overlay"></div>
	<div class="wrapper">

		<div class="b-top-wrapper">
			<div class="b-top base-row">
				<div class="b-top__buttons"><div>
					<a class="button dark dashed js-appointment-btn" data-form-type="js-analytic-header-appointment" href="#" <?//data-open="make_appointment"?>>
						<span>Записаться на прием</span>
					</a>
				</div>
				<div>
					<a class="button x-dark dashed js-question-btn" data-form-type="js-analytic-header-question" href="#"<?//= data-open="ask"?> >
						<span>Задать вопрос</span>
					</a>
				</div>
					<a class="button light login"  href="https://lk.smclinic.ru/#/auth" target="_blank">
						<span>Личный кабинет</span>
					</a>
				</div>
				<div class="b-callback">
					<a href="#" class="js-callback-btn" data-form-type="js-analytic-header-callback" <?//data-open="callback"?>>Заказать обратный звонок</a>
				</div>
				<?php $phone = \TAO\Ext\Vars::get('number_phone')->previewText() ?>
				<a class="button light phone right" href="tel:<?= $phone ?>"><?= $phone ?></a>
			</div>
		</div>


		<div class="b-top-menu base-row">
			<a href="#" class="m-burger"></a>
			<a href="/" class="logo"></a>

			<?= \TAO::navigation()->render('top_menu'); ?>

			<div class="b-top-menu__search">
				<form action="/search/">
					<input type="text" placeholder="Поиск..." name="q">
					<input type="submit" value="">
				</form>
			</div>
		</div>
