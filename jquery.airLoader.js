/*!
 * airLoader v1.1.0
 *
 * Require:     jquery
 *              jquery.airCenter.js
 * Copyright:   2016, AiR&D Inc. (http://a-i-r-d.co.jp/)
 * Author:      Kyoji Osada
 * Licensed:    Under the Apache License 2.0
 */

(function($) {

        $.fn.airLoader = function(_options)
        {
                //* Method
                var that = this;
                return {
                        //** Start
                        start: function(_start_options)
                        {
                                //*** Current Max zIndex Get
                                var zindex_top = 1;
                                $('body *').each(function()
                                {
                                        var zindex_max = $(this).css('zIndex');
                                        if (zindex_max === 'auto' || zindex_max === '') {
                                                zindex_top++;
                                                return true;
                                        }

                                        if (zindex_top < zindex_max) {
                                                zindex_top = zindex_max + 1;
                                        }
                                });

                                //*** Default Option
                                var start_options = $.extend(
                                {
                                        zIndex: zindex_top,
                                        backgroundColor: '#000000',
                                        opacity: '0.5',
                                        src: '',
                                        imageWidth: '',
                                        imageHeight: ''
                                }, _start_options);

                                //*** Overlay
                                if (that.find('.airloader-overlay').length === 0) {
                                        $("<div class='airloader-overlay'></div>").appendTo(that).css(
                                        {
                                                position: 'fixed',
                                                top: '0px',
                                                left: '0px',
                                                zIndex: start_options['zIndex'],
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: start_options['backgroundColor'],
                                                opacity: start_options['opacity']
                                        }).show();
                                }

                                //*** Loader Image
                                if (that.find('.airloader-img').length === 0) {

                                        //**** Array Loader Image
                                        if ($.isArray(start_options['src'])) {
                                                //* Count
                                                var count = start_options['src'].length;

                                                //* Random Select
                                                var i = Math.floor(Math.random() * count);
                                                start_options['src'] = start_options['src'][i];

                                        //**** Loader Image Empty
                                        } else if (start_options['src'] === '') {
                                                //***** Default Image
                                                start_options['src'] = 'data:image/apng;base64,'+getDefaultLoaderImage();
                                        }

                                        $("<img class='airloader-img' src='"+start_options['src']+"'>").appendTo(that).css(
                                        {
                                                position: 'fixed',
                                                top: '0px',
                                                left: '0px',
                                                zIndex: start_options['zIndex'] + 1,
                                                width: start_options['imageWidth'],
                                                height: start_options['imageHeight'],
                                                backgroundColor: 'transparent',
                                                height: '32px',
                                        }).airCenter();
                                }

                                return that;
                        },

                        //* End
                        end: function(_end_options)
                        {
                                that.find('.airloader-overlay').remove();
                                that.find('.airloader-img').remove();
                                return that;
                        },
                }

                //* Default Loader Image Get
                function getDefaultLoaderImage()
                {

var loader = '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';
                        return loader;
                }

                return this;
        };

})(jQuery);
