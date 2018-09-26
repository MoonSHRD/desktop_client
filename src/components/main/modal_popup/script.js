// window.jQuery = window.$ = require('jquery');
// var slick = require('slick-carousel');

//DOM Ready
$(function(){
    $('.slick').slick({
        prevArrow: false,
        nextArrow: false,
        infinite: true,
        // speed: 300,
        slidesToShow: 3,
        // centerMode: true,
        variableWidth: true,

    });
});