/*!
 * airCenter v1.0.0
 *
 * Require:	jquery
 * Copyright:	2016, AiR&D Inc. (http://a-i-r-d.co.jp/)
 * Author:      Kyoji Osada
 * Licensed:	Under the Apache2.0 License
 */

//* Extension Plugin
(function($) {

	$.fn.airCenter = function(_options)
	{
		//** Default Options + JS Style Options
		var options = $.extend(
		{
			basis: window,
		}, _options);

		//** Windos Half Size Get
		var window_half_left = $(options['basis']).innerWidth() / 2;
		var window_half_top = $(options['basis']).innerHeight() / 2;

		return this.each(function()
		{
			//** Element Half Size Get
			var elem_half_width = $(this).width() / 2;
			var elem_half_height = $(this).height() / 2;

			//** Element Position Set
			var elem_left = window_half_left - elem_half_width;
			var elem_top = window_half_top - elem_half_height;

			$(this).css({top: elem_top+'px', left: elem_left+'px'}).prop('data-air-center-element', true)
		});
	};

})(jQuery);

//* Object Function
var AirCenter =
{
	a: function()
	{
		$(window).on('resize', function()
		{
			$('body *').each(function()
			{
				if ($(this).prop('data-air-center-element') === true) {
					$(this).airCenter();
				}
			});
		});
	},
};

//* Ready
$(function()
{
	AirCenter.a();
});

