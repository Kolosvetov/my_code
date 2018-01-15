<?php
$ya_coords = [];
if (count($this->property('EVENT_YA_MAP')->value()) > 0) {
	foreach ($this->property('EVENT_YA_MAP')->value() as $coords) {
		$ya_coords[] = [
			"coords" => explode(",", $coords)
		];
	}
	if (count($this->property('EVENT_YA_MAP_DESCR')->value()) > 0) {
		$coords_descr_counter = 0;
		foreach ($this->property('EVENT_YA_MAP_DESCR')->value() as $coords_descr) {
			$ya_coords[$coords_descr_counter]['coords_descr'] = $coords_descr['TEXT'];
			$coords_descr_counter++;
		}
	}
}
ob_start();
?>
<div id="map"></div>
<script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
<script>
	ymaps.ready(init);

	function init() {
		var myPlacemark = '';
		var myMap = new ymaps.Map("map", {
			center: [55.762211649296, 37.648223843426],
			zoom: 9
		}, {
			searchControlProvider: 'yandex#search'
		});
		var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
				'<div class="popover top">' +
				'<div class="arrow"></div>' +
				'<div class="popover-inner">' +
				'$[properties.balloonHeader]' +
				'$[properties.balloonContent]' +
				'</div>' +
				'<img id="map-img" src="/local/templates/tn25/builds/dev/img/common/marker-brown.png">' +
				'</div>',
				{
					build: function () {
						this.constructor.superclass.build.call(this);
						this._$element = $('.popover', this.getParentElement());
						this.applyElementOffset();

						this._$element.find('.close')
								.on('click', $.proxy(this.onCloseClick, this));
					},
					clear: function () {
						this._$element.find('.close')
								.off('click');

						this.constructor.superclass.clear.call(this);
					},
					onSublayoutSizeChange: function () {
						MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

						if (!this._isElement(this._$element)) {
							return;
						}

						this.applyElementOffset();

						this.events.fire('shapechange');
					},
					applyElementOffset: function () {
						this._$element.css({
							left: -(this._$element[0].offsetWidth / 2),
							top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
						});
					},
					onCloseClick: function (e) {
						e.preventDefault();

						this.events.fire('userclose');
					},
					getShape: function () {
						if (!this._isElement(this._$element)) {
							return MyBalloonLayout.superclass.getShape.call(this);
						}
						return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
							[this._$element[0].offsetLeft, this._$element[0].offsetTop], [
								this._$element[0].offsetLeft + this._$element[0].offsetWidth,
								this._$element[0].offsetTop + this._$element[0].offsetHeight
							]
						]));
					},
					_isElement: function (element) {
						return element && element[0] && element.find('.arrow')[0];
					}
				}),
<?php
if (count($ya_coords) > 0) {
	foreach ($ya_coords as $count => $ya_coord) {
		?>
				myPlacemark = new ymaps.Placemark([<?= $ya_coord['coords'][0] ?>, <?= $ya_coord['coords'][1] ?>], {
					balloonContent: '<?= $ya_coord['coords_descr'] ?>',
				},
						{
							balloonShadow: false,
							balloonLayout: MyBalloonLayout,
							balloonPanelMaxMapArea: 0
						});
				myMap.geoObjects.add(myPlacemark);
		<?php if ($count == count($ya_coords) - 1) { ?>
					myMap.setCenter([<?= $ya_coord['coords'][0] ?>, <?= $ya_coord['coords'][1] ?>], 13);
					myPlacemark.balloon.open();
			<?
		}
	}
}
?>
		myMap.behaviors.disable('scrollZoom');
	}
</script>
<?php
$map = ob_get_clean();
?>