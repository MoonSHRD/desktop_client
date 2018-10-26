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
        $($(this).attr('data-id')).removeClass('bl-hide');
    });
    $('.switch-btn').on('off.switch', function () {
        $($(this).attr('data-id')).addClass('bl-hide');
    });
});