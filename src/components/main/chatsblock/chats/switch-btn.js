$(function () {
    $('.switch-btn').click(function () {
        $(this).toggleClass('switch-on');
        if ($(this).hasClass('switch-on')) {
            $(this).trigger('on.switch');
        } else {
            $(this).trigger('off.switch');
        }
    });
    $('.switch-btn').on('on.switch', function () {
            $('.bl-hide').css('display', 'block');
            $('.bl-hide-1').css('display', 'none');
            $('.chats').css('height', 'calc(100% - 153px)');

    });
    $('.switch-btn').on('off.switch', function () {
        $('.bl-hide').css('display', 'none');
        $('.bl-hide-1').css('display', 'block');
        $('.chats').css('height', 'calc(100% - 200px)');
    });
});