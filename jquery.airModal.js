/*!
 * airModal v1.0.0
 *
 * Require:		jquery
 *				jquery.airCenter.js
 * Author:      Kyoji Osada
 * Copyright:	2016, AiR&D Inc. (http://a-i-r-d.co.jp/)
 * Licensed:	Under the Apache License 2.0
 */

(function($) {

	$.fn.airModal = function(_options)
	{
		//* Method
		var that = this;
		return {
			//** Open
			start: function(_open_options)
			{
				//*** Current Max zIndex Get
				var zindex_top = 0;
				$('body *').each(function()
				{
					var zindex_max = $(this).css('zIndex');
					if (zindex_max === 'auto' || zindex_max === '') {
						return true;
					}

					if (zindex_top < zindex_max) {
						zindex_top = zindex_max++;
					}
				});

				//*** Default Option + JS Style
				var open_options = $.extend(
				{
					overlay_zIndex: zindex_top,
					overlay_backgroundColor: '#000000',
					overlay_opacity: '0.5',
					overlay_speed: 0,
					box_width: '200px',
					box_height: '50px',
					box_border: '1px solid #EEEEEE',
					box_borderRadius: '5px',
					box_backgroundColor: '#000000',
					box_opacity: '1',
					box_zIndex: zindex_top + 1,
					box_speed: 0,
				}, _open_options);

				//*** Overlay
				$("<div class='airmodal-overlay'></div>").appendTo('body').css(
				{
					position: 'fixed',
					top: '0px',
					left: '0px',
					zIndex: open_options['overlay_zIndex'],
					width: '100%',
					height: '100%',
					backgroundColor: open_options['overlay_backgroundColor'],
					opacity: open_options['overlay_opacity']
				}).hide().fadeIn(open_options['overlay_speed']);
				//*** Box
				$("<div class='airmodal-box'></div>").prependTo(that).css(
				{
					position: 'fixed',
					top: '0px',
					left: '0px',
					zIndex: open_options['box_zIndex'],
					width: open_options['box_width'],
					height: open_options['box_height'],
					backgroundColor: open_options['box_backgroundColor'],
					border: open_options['box_border'],
					borderRadius: open_options['box_borderRadius'],
					opacity: open_options['box_opacity'],
				}).hide().fadeIn(open_options['box_speed']);

				$('.airmodal-box').airCenter();


				return that;
			},

			//* End
			end: function(_end_options)
			{
				that.find('.airmodal-overlay').hide();
				that.find('.airmodal-box').hide();
				return that;
			},
		}

		return this;
	};

})(jQuery);
