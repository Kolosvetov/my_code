<?php
ob_start();
if (CSite::InGroup([6]) === true && $this->property('IS_EVENT')->value() == "YES") {
	$APPLICATION->IncludeComponent("techart:forms", "tehnooskar", ['FORM_CODE' => "form_event_reg_results"]);
}
$form = ob_get_clean();
