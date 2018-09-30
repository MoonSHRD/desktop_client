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
        slidesToScroll: 3

    });
})
