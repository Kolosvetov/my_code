import $ from 'jquery';
import loadGoogleMapsAPI from 'load-google-maps-api';

$(function () {
	"use strict";
	window.Map = null;
	
	window.GMap = function () {
		this.$list = $('.clinics');
		this.$map = document.getElementById('map');
		if (this.$map) {
			this.load(window.Map);
		}
	};
	window.GMap.prototype.load = function (Map) {
		var that = this;
		var lat = 37.4910744;
		if (document.documentElement.clientWidth > 1000) {
			lat = 37.0010744;
		}
		this.mapOptions = {
			center: new Map.LatLng(55.7406781, lat),
			zoom: 9,
			streetViewControl: false,
			mapTypeControl: false,
			scrollwheel: false,
			mapTypeId: Map.MapTypeId.ROADMAP,
			styles: [{"stylers": [{"hue": "#00ff3c"}, {"saturation": -85}, {"gamma": 1.75}]}],
			zoomControlOptions: {
				position: 4
			}
		}
		this.$gmap = Map
		this.mapInfoWindows = [];
		this.markers = [];
		this.bubbleOptions = {
			shadowStyle: 0,
			borderRadius: 0,
			arrowSize: -20,
			borderColor: '#fff',
			minWidth: '220',
			padding: 40
		};
		this.mapCanvas = document.getElementById('map');
		
		this.$list.find('.b-popup-blocks__controll-prev').click(function(){
			that.changeMarker(-1);
			return false;
		});
		this.$list.find('.b-popup-blocks__controll-next').click(function(){
			that.changeMarker(1);
			return false;
		});
		
		this.loadData();
	}
	window.GMap.prototype.changeMarker = function (index) {
		var num = $(this.$list.find('.is_active')[0]).index()+index;
		this.showInfoWindow(num);
	}
	window.GMap.prototype.init = function () {
		this.map = new this.$gmap.Map(this.mapCanvas, this.mapOptions);
		var i;
		var marker_info;
		var marker;
		for (i in this.markers) {
			if (!this.markers.hasOwnProperty(i)) {
				continue;
			}
			marker_info = this.markers[i];
			marker = new this.$gmap.Marker({
				'position': {lat: marker_info.lat, lng: marker_info.lng},
				'map': this.map,
				'icon': '/local/templates/oncology/builds/dev/img/common/i-green-market.png',
				'title': marker_info['title']
			});
			this.markers[i]['marker'] = marker;
			this.addListener(i);
			if (i == 0) {
				marker.setIcon("/local/templates/oncology/builds/dev/img/common/i-orange-marker.png");
			}
		}
	};
	window.GMap.prototype.loadData = function () {
		var that = this;
		this.$list.find('.clinics__item').each(function (i) {
			var $this = $(this);
			$this.data('marker', i).addClass('marker-' + i);
			that.markers[i] = {
				'lat': $this.data('lat'),
				'lng': $this.data('lng'),
				'phone': $this.find('.clinics__phone').text(),
				'time': $this.data('time'),
				'title': $this.find('.clinics__title').text(),
				'address': $this.find('.clinics__address').text()
			}
		});
		this.$list.find('.clinics__item').click(function () {
			that.showInfoWindow($(this).data('marker'));
		});
		this.init();
	};
	window.GMap.prototype.addListener = function (id) {
		var that = this;
		this.$gmap.event.addListener(this.markers[id]['marker'], 'click', function () {
			that.showInfoWindow(id);
		});
	};
	window.GMap.prototype.showInfoWindow = function (id) {
		var marker = null;
		if (this.markers[id]) {
			marker = this.markers[id];
		} else {
			id = 0;
			marker = this.markers[0];
		}
		this.hideAllInfoWindows();
		marker.marker.setIcon("/local/templates/oncology/builds/dev/img/common/i-orange-marker.png");  
		this.$list.find('.marker-' + id).addClass('is_active');
	};
	window.GMap.prototype.hideAllInfoWindows = function () {
		this.$list.find('.clinics__item').removeClass('is_active');
		$(this.markers).each(function(){
			this.marker.setIcon("/local/templates/oncology/builds/dev/img/common/i-green-market.png");
		})
		if (this.mapInfoWindows.length) {
			var key;
			for (key in this.mapInfoWindows) {
				if (!this.mapInfoWindows.hasOwnProperty(key)) {
					continue;
				}
				this.mapInfoWindows[key].close();
				this.mapInfoWindows.slice(key, key + 1);
			}
		}
	};
	window.GMap.prototype.bubbleContent = function (id) {
		var phone = this.$list.find('.marker-' + id).find('.clinics__phone').text();
		var marker = this.markers[id];
		var content = '<div class="bubble__close" id="close"></div>';
		content += '<div class="bubble__title">' + marker.title + '</div>';
		content += '<div class="bubble__address">' + marker.address + '</div>';
		content += '<div class="bubble__phone">' + phone + '</div>';
		content += '<div class="bubble__time">Режим работы: ' + marker.time + '</div>';
		content += '<div class="bubble__link"><a class="form-button" href="#">Записаться</a></div>';
		content += '<div class="bubble__marker"></div>';
		content += '<div class="decor"><div class="decor__top-left"></div><div class="decor__top-right"></div>';
		content += '<div class="decor__bottom-right"></div><div class="decor__bottom-left"></div></div>';

		return content;
	};
	
	window.simpleGMap = function (id) {
		this.$map = document.getElementById(id);
		this.load(window.Map);

	}
	window.simpleGMap.prototype.load = function (Map) {
		this.map = new Map.Map(this.$map, {
			center: new Map.LatLng(55.7406781, 37.4910744),
			zoom: 15,
			streetViewControl: false,
			mapTypeControl: false,
			scrollwheel: false,
			mapTypeId: Map.MapTypeId.ROADMAP,
			zoomControlOptions: {
				position: 4
			}
		});
		if(typeof window.clinicInfo !== 'undefined') {
			this.marker = new Map.Marker({
				'position': window.clinicInfo.position,
				'map': this.map,
				'icon': '/local/templates/oncology/builds/dev/img/common/i-orange-marker.png',
				'title': window.clinicInfo.title
			});
		} else {
			this.marker = new Map.Marker({
				'position': {lat: 55.814626, lng: 37.6454603},
				'map': this.map,
				'icon': '/local/templates/oncology/builds/dev/img/common/i-orange-marker.png',
				'title': "«СМ-Клиника» на улице Ярославской"
			});
		}
		this.map.setCenter( this.marker.getPosition() );
	}
	
	window.loaderGMap = function () {
		loadGoogleMapsAPI({key: 'AIzaSyDdAN1GsVWgMwu05o_4Vc-_IqD56HQtnao'}).then(this.load.bind(this));
	}
	window.loaderGMap.prototype.load = function (Map) {
		window.Map = Map;
		new window.GMap('map', '.clinics');
		new window.simpleGMap('clinic-map');
	}
	
}());
$(function () {
	new window.loaderGMap();
});
