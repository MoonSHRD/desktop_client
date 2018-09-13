window.jQuery = window.$ = require('jquery');
var slick = require('slick-carousel');

//DOM Ready
$(function(){
    $('.slick').slick({
        slidesToShow: 1,
        speed: 300,
        autoplay: true,
        dots: true
    });
});