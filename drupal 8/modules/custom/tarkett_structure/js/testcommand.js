(function ($, window, Drupal, drupalSettings) {
	'use strict';
	/**
	 * [commandName description]
	 *
	 * @param {Drupal.Ajax} [ajax]
	 * @param {object} response
	 * @param {number} [status]
	 */
	Drupal.AjaxCommands.prototype.testcommand = function (ajax, response, status) {

		alert('its work!');

	}

})(jQuery, this, Drupal, drupalSettings);