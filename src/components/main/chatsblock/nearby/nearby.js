var offset = 0;
// var height = parseInt($('.sliderImage').attr('width'));
var items = $('.element').length;
var rightFlag =false;
var leftFlag = false;
var leftButton = $('.leftButton');
var rightButton = $('.rightButton');



if(items < 4) {
    $( ".element:eq( 1 )" ).addClass("activeNearby")
    leftButton.hide()
    rightButton.hide()
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


leftButton.click(prevSlide);

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
    leftFlag = true;


}

rightButton.click(nextSlide);

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

    rightFlag = true;


}


$slider.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
    if(rightFlag === true)
    {
        var $last = $('.element').get(0);
        $last.remove();
        $slider.append($last);
        rightFlag = false;


    }
    if(leftFlag === true){

        var $first = $('.element').get(items-1);
        $first.remove();
        $slider.prepend($first);
        leftFlag = false;


    }

    $slider.css('transition','none');
    $slider.css('transform','translate(0, 0)');

    setTimeout(function(){
        $slider.css('transition','');
    })

});

