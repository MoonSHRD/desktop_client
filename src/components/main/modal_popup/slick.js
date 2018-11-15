// window.jQuery = window.$ = require('jquery');
// var slick = require('slick-carousel');

//DOM Ready
$(function() {
    $('.slick').slick({
        prevArrow: false,
        nextArrow: false,
        infinite: true,
        // arrows: true,
        // speed: 300,
        // centerMode: true,
        variableWidth: true,
        slidesToShow: 3,
        slidesToScroll: 1

    });

    $('#list > li > a').click(function (event) {
        $(this).parent().children('img').toggleClass('rotate');
        $(this).parent().children('ul').slideToggle();
        event.stopPropagation();
    });

    $('#listGallery > li > a').click(function (event) {
        $(this).parent().children('img').toggleClass('rotate');
        $(this).parent().children('ul').slideToggle();
        event.stopPropagation();
    });

$('.listOfParticipants').tooltip('enable');
$('.blockedParticipants').tooltip('enable');
});
