var offset = 0;
var height = parseInt($('.sliderImage').attr('width'));
var items = $('.element').length
var right =false
var left = false




if(items < 4) {
    $( ".element:eq( 1 )" ).addClass("activeNearby")
    $('.left').hide()
    $('.right').hide()
}else if(items > 4){
    // $('.element').last().clone().prependTo('.slider')
    // // $('.element').last().remove()
    $( ".element:eq( 2 )" ).addClass("activeNearby")

    $('.slider').css('margin-left', '-83px')
}

$('.activeNearby').prev('.element').children('img').addClass('orange')
$('.activeNearby').next('.element').children('img').addClass('purple')

var height = $('.sliderWrapper').height(),
    $slider = $('.slider');


$('.left').click(prevSlide);

function prevSlide(){
    $( ".element:eq( 2 )" ).removeClass("activeNearby")
    $( ".element:eq( 1 )" ).addClass("activeNearby")
    $('.activeNearby').prev('.element').children('img').addClass('orange')
    $('.activeNearby').next('.element').children('img').removeClass('orange')

    $('.activeNearby').prev('.element').children('img').removeClass('purple')
    $('.activeNearby').next('.element').children('img').addClass('purple')


    // $('.active').next('.element').addClass('active');
    $slider.css('transform','translate(80px, 0)');
// right = true;
    left = true;


}

$('.right').click(nextSlide);

function nextSlide(){
    $( ".element:eq( 2 )" ).removeClass("activeNearby")
    $( ".element:eq( 3 )" ).addClass("activeNearby")

    $('.activeNearby').prev('.element').children('img').addClass('orange')
    $('.activeNearby').next('.element').children('img').removeClass('orange')

    $('.activeNearby').prev('.element').children('img').removeClass('purple')
    $('.activeNearby').next('.element').children('img').addClass('purple')
    // $('.active').next('.element').addClass('active');
    $slider.css('transform','translate(-80px, 0)');
    // $('.element').last().remove()

    right = true;


}


$slider.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
    if(right === true)
    {
        var $last = $('.element').get(0);
        $last.remove();
        $slider.append($last);
        right = false;


    }
    if(left === true){

        var $first = $('.element').get(items-1);
        $first.remove();
        $slider.prepend($first);
        left = false;


    }

    $slider.css('transition','none');
    $slider.css('transform','translate(0, 0)');

    setTimeout(function(){
        $slider.css('transition','');
    })

});

