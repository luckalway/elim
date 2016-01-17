(function($) {
	var defaultSettings = {
		width : 500,
		height : 300,
		speed : 200,
		autoPlay : false,
		slideItemJExp : ".elim-slider-item"
	}

	var settings = null;
	var animating = false;

	$.fn.elimSlider = function(options) {
		if (typeof options == 'string') {
			var sliderContainer = $(this).find(".elim-slider-container");
			var offset = sliderContainer.css("left").replace("px", "");
			var action = options;
			if (action == 'next') {
				if (animating || sliderContainer.width() + offset < settings.width * 2)
					return false;

				offset -= settings.width;
				animating = true;
				sliderContainer.animate({
					left : "-=" + settings.width + "px"
				}, 1000, function(){
					animating=false;
				});
			} else if (action == 'prev') {
				if (animating || offset == 0)
					return false;

				offset += settings.width;
				animating = true;
				sliderContainer.animate({
					left : "+=" + settings.width + "px"
				}, 1000, function(){
					animating = false;
				});
			}
			return this;
		}

		settings = $.extend({}, defaultSettings, options);

		return this.each(function() {
			var container = $(this);
			if (!container.hasClass("elim-slider")) {
				container.addClass("elim-slider")
			}

			container.css({
				width : settings.width,
				height : settings.height
			});

			var sliderItems = container.find(settings.slideItemJExp);
			if (!sliderItems.hasClass('elim-slider-item')) {
				sliderItems.addClass('elim-slider-item');
			}

			sliderItems.css({
				width : settings.width,
				height : settings.height
			});

			if (settings.autoPlay) {
				setInterval(function() {
					moveRight();
				}, settings.autoPlay.speed);
			}

			var slideCount = sliderItems.size();
			container.find(".elim-slider-container").css({
				width : slideCount * settings.width,
			});
		});
	};

}(jQuery));
