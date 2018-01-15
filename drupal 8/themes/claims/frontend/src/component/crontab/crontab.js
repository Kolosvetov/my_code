/**
 * Минидиспетчер для периодического выполнения задач
 * 
 */

var TAO_JSCrontab = (function() {
	var TAO_JSCrontab = {

		interval: null,
		period: 500,
		queue: {
			_unnamed: []
		},
		debug_mode: false,

		debug: function(mode) {
			TAO_JSCrontab.debug_mode = (true === mode);
		},

		start: function(period) {
			if (TAO_JSCrontab.interval) {
				TAO_JSCrontab.stop.apply(TAO_JSCrontab);
			}
			if (period) {
				TAO_JSCrontab.period = period;
			}
			TAO_JSCrontab.interval = setInterval(
				function() {
					TAO_JSCrontab.run.apply(TAO_JSCrontab);
				},
				TAO_JSCrontab.period
			);
			if (TAO_JSCrontab.debug_mode) {
				console.log('TAO_JSCrontab has started at', TAO_JSCrontab.period, 'ms interval.');
			}
		},

		stop: function() {
			clearInterval(TAO_JSCrontab.interval);
			TAO_JSCrontab.interval = null;
			if (TAO_JSCrontab.debug_mode) {
				console.log('TAO_JSCrontab has stoped.');
			}
		},

		run: function() {
			var l = 0, i = 0, name = '';
			for (name in TAO_JSCrontab.queue) {
				if (!(TAO_JSCrontab.queue.hasOwnProperty(name))) {
					continue;
				}
				if ('_unnamed' === name) {
					l = TAO_JSCrontab.queue._unnamed.length;
					for (i = 0; i < l; i++) {
						if (TAO_JSCrontab.debug_mode) {
							console.log('TAO_JSCrontab unnamed callback #', i.toString(), 'is running...');
						}
						TAO_JSCrontab.queue._unnamed[i]();
					}
				} else {
					if (TAO_JSCrontab.debug_mode) {
						console.log('TAO_JSCrontab callback', name, 'is running...');
					}
					TAO_JSCrontab.queue[name]();
				}
			}
		},

		add: function(callback) {
			TAO_JSCrontab.queue._unnamed.push(callback);
			if (TAO_JSCrontab.debug_mode) {
				console.log('TAO_JSCrontab unnamed callback #', (TAO_JSCrontab.queue._unnamed.length - 1).toString(), 'has added.');
			}
		},

		addNamed: function(name, callback) {
			if (TAO_JSCrontab.isInternalName(name)) {
				return;
			}
			TAO_JSCrontab.queue[name] = callback;
			if (TAO_JSCrontab.debug_mode) {
				console.log('TAO_JSCrontab callback', name, 'has added.');
			}
		},

		remove: function(callback) {
			var l = TAO_JSCrontab.queue._unnamed.length,
				i = 0;
			for (i = 0; i < l; i++) {
				if (callback === TAO_JSCrontab.queue._unnamed[i]) {
					delete TAO_JSCrontab.queue._unnamed[i];
					if (TAO_JSCrontab.debug_mode) {
						console.log('TAO_JSCrontab unnamed callback #', i.toString(), 'has removed.');
					}
					break;
				}
			}
		},

		removeNamed: function(name) {
			if (TAO_JSCrontab.isInternalName(name)) {
				return;
			}
			if ('undefined' !== typeof TAO_JSCrontab.queue[name]) {
				delete TAO_JSCrontab.queue[name];
				if (TAO_JSCrontab.debug_mode) {
					console.log('TAO_JSCrontab callback', name.toString(), 'has removed.');
				}
			}
		},

		isInternalName: function(name) {
			return ('_unnamed' === name);
		}

	};

	return TAO_JSCrontab;
})();

module.exports = TAO_JSCrontab;
