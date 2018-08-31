var offset = 0;
var height = parseInt($('.sliderImage').attr('width'));
var items = $('.element').length

$('.sliderWrapper').css('height', height + 60)

$('.right').click(function(){
    if(offset > -((items * 100) - 300)){
        offset = offset - 80;
        $('.activeNearby').next('.element').addClass('activeNearby');
        $('.activeNearby').prev('.element').removeClass('activeNearby');

    }

    $('.slider').css('left', offset+'px')
})

$('.left').click(function(){
    if(offset < 0){
        offset = offset + 80;

        $('.activeNearby').prev('.element').addClass('activeNearby');
        $('.activeNearby').next('.element').removeClass('activeNearby');

    }

    $('.slider').css('left', offset+'px')
})