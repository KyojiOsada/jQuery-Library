/*!
 * actDisplayKeyboard v1.0.0
 *
 * Require:     jquery
 * Copyright:   2016, AiR&D Inc. (http://a-i-r-d.co.jp/)
 * Author:      Kyoji Osada
 * Licensed:    Under the Apache License 2.0
 */

var Act =
{

    _:function()
    {},

    // display keyboard inflater
    a:function()
    {
        $('.kb_toggle, .kb_top .close').click(function()
        {
            var ww = $(window).width();
            var wh = $(window).height();
            var op = $('.outer').position();
            var oh = $('.outer').outerHeight();
            var kw = $('.kb_outer').outerWidth();
            var kh = $('.kb_outer').outerHeight();
            var kt = op.top + oh;
            var kl = (ww / 2) - (kw / 2);
            var kt_init = kt + ((wh - kt) / 2);
            var kl_init = ww / 2;
            if ($('.kb_outer').css('display') === 'none') {
                $('.kb_outer').css({position: 'absolute', top: kt_init+'px', left: kl_init+'px'});
                $('.kb_outer').css({position: 'absolute', width: '0px', height: '0px', display: 'block'}).animate(
                {
                    top: kt-30+'px',
                    left: kl+'px',
                    width: kw+'px',
                    height: kh+'px',
                },300);
            } else {
                $('.kb_outer').css({position: 'absolute'}).animate(
                {
                    top: kt_init+'px',
                    left: kl_init+'px',
                    width: '0px',
                    height: '0px'
                },300,
                    function()
                    {
                        $(this).hide().css({width: kw, height: kh});
                    }
                );
            }
        });
    },

    // display keyboard toucher
    b:function()
    {
        // focus form history set
        var fc = [];
        $('*').focus(function(){
            if (fc.length == undefined) {
                fc.length = 0;
            }
            fc[fc.length] = $(this).attr('id');
        });
        // display keyboard touch
        $(document).on('mouseup', '.kb_inner .btn', function()
        {
            // focus history getter
            var pre_focus = fc[fc.length - 2];
            if (pre_focus !== 'lid' && pre_focus !== 'lpw') {
                return false;
            }
            // pre focus caret position get
            var pos = document.getElementById(pre_focus).selectionStart;
            var value = $('#'+pre_focus).val();
            var len = value.length;
            var top = value.substr(0, pos);
            var end = value.substr(pos, len);
            var char = $(this).text();
            if (! $(this).hasClass('ctrl_kb')) {
                $('#'+pre_focus).val(top+char+end);
            } else {
                switch ($(this).attr('id')) {
                    case 'ctrl_case':
                        var len = top.length;
                        var char = top.substr(len - 1, 1).toUpperCase();
                        var top = top.substr(0, len - 1);
                        $('#'+pre_focus).val(top+char+end);
                    break;
                    case 'ctrl_left':
                        $('#'+pre_focus).focus();
                        document.getElementById(pre_focus).setSelectionRange(pos - 1, pos - 1);
                        return true;
                    break;
                    case 'ctrl_right':
                        $('#'+pre_focus).focus();
                        document.getElementById(pre_focus).setSelectionRange(pos + 1, pos + 1);
                        return true;
                    break;
                    case 'ctrl_del':
                        $('#'+pre_focus).focus();
                        var len = end.length;
                        var end = end.substr(1, len);
                        $('#'+pre_focus).val(top+end);
                        document.getElementById(pre_focus).setSelectionRange(pos, pos);
                        return true;
                    break;
                    case 'ctrl_bs':
                        $('#'+pre_focus).focus();
                        var len = top.length;
                        var top = top.substr(0, len - 1);
                        $('#'+pre_focus).val(top+end);
                        document.getElementById(pre_focus).setSelectionRange(pos - 1, pos - 1);
                        return true;
                    break;
                    case 'ctrl_up':
                        $('#'+pre_focus).focus();
                        var index = $('#'+pre_focus).index('input, button');
                        $('input:eq('+(index - 1)+')').trigger('focus');
                        return true;
                    break;
                    case 'ctrl_down':
                        $('#'+pre_focus).focus();
                        var index = $('#'+pre_focus).index('input, button');
                        $('input:eq('+(index + 1)+')').trigger('focus');
                        return true;
                    break;
                    case 'ctrl_enter':
                        $('#login').trigger('focus');
                        $('#login').trigger('click');
                        return true;
                    break;

                }
            }
            $('#'+pre_focus).focus();
            pos++;
            // pre focus caret position return
            document.getElementById(pre_focus).setSelectionRange(pos, pos);
        });
    },

    // display keyboard touch color
    c:function()
    {
        var bg_init = $('.kb_inner .kb_group .btn').css('background');
        $('.kb_inner .kb_group .btn').mousedown(function()
        {
            $(this).css({background: 'linear-gradient(#2D6CA2, #558FC1, #2D6CA2)'});
        }).mouseup(function()
        {
            $(this).css({background: bg_init});
        });
    },
};

$(function()
{
    Act._();
    Act.a();
    Act.b();
    Act.c();
});
