import $ from 'jquery';
		$(function () {
			var ProgressBar = require('progressbar.js');
			var bars = [];
			var duration = 5400;
			var slides = [];
			var listIntrval = null;
			var sHeight = $('.b-advantages__list .b-advantages__item:first-child').height();
			$('.b-advantages__list').height(sHeight);
			function changeSlide(index, abs) {
				window.clearInterval(listIntrval);
				showSlide(index, abs);
				intervalControll();
			}
			function showSlide(nav, abs) {
				var active = null;
				var next = null;
				var index = 0;
				$(slides).each(function () {
					if (this.hasClass('active') || this.hasClass('start')) {
						active = this;
					}
					this.removeClass('start')
					this.removeClass('active')
				});
				index = active.index();
				if (abs == true) {
					next = slides[nav];
				} else {
					if (slides[index+nav]) {
						next = slides[index+nav];
					} else {
						next = slides[0];
					}
				}
				next.addClass('active');
				$('.b-advantages__list').height(next.height());
				$(".b-advantages__pager a").removeClass('action');
				$(bars).each(function(){
					this.destroy();
				});
				bars = [];
				setProgress($(".b-advantages__pager a")[next.index()]);
			}
			function setProgress(a) {
				var bar = new ProgressBar.Circle(a, {
					strokeWidth: 2,
					easing: 'easeInOut',
					duration: duration,
					color: '#FF6C0F',
					trailColor: '#eee',
					trailWidth: 1,
					svgStyle: null
				});
				bar.animate(1.0);
				bars.push(bar);
			}
			function intervalControll() {
				listIntrval = setInterval(function(){
					changeSlide(1, false);
				},
				duration
				);
			}
			$(".b-advantages__pager a").click(function(){
				changeSlide($(this).index(), true);
				return false;
			});
			$('.b-advantages__prev').click(function () {
				changeSlide(-1, false);
			});
			$('.b-advantages__next').click(function () {
				changeSlide(1, false);
			});
			$('.b-advantages__list .b-advantages__item').each(function () {
				var slide = $(this);
				if (slide.outerHeight() > sHeight) {
					sHeight = slide.height();
				}
				if (slide.index() == 0) {
					slide.addClass('start');
					setProgress($(".b-advantages__pager a")[0]);
				}
				slides.push(slide);
			});
			$(window).resize(function(){
				sHeight = $('.b-advantages__list .b-advantages__item.active').height();
//				sHeight = 0;
//				$('.b-advantages__list .b-advantages__item').each(function () {
//					var slide = $(this);
//					if (slide.height() > sHeight) {
//						sHeight = slide.height();
//					}
//				});
				
				$('.b-advantages__list').height(sHeight);
			})
			
			intervalControll();
		})
