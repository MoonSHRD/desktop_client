// const {ipcRenderer} = require('electron');
//jQuery time
let current_fs, next_fs, previous_fs; //fieldsets
let left, opacity, scale; //fieldset properties which we will animate
let animating; //flag to prevent quick multi-click glitches
let data = {}; //flag to prevent quick multi-click glitches
let mnemonic_text = '';
let array_mnemonic_text = [];

$('.next').click(function(){
    if (check_fields($(this).closest('fieldset'))) return;

    if(animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $('#progressbar li').eq($('fieldset').index(next_fs)).addClass('active');

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            // console.log(current_fs.offset().top);
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale current_fs down to 80%
            scale = 1 - (1 - now) * 0.4;
            //2. bring next_fs from the right(50%)
            // left = (now * 50)+'%';
            //3. increase opacity of next_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({
                'transform': 'scale('+scale+')',
                'width' : current_fs.width(),
                'position': 'absolute',
                'top' : current_fs.offset().top
            });
            next_fs.css({
                // 'left': left,
                'opacity': opacity
            });
        },
        duration: 800,
        complete: function(){
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        // easing: 'easeInOutBack'
        easing : 'linear'
    });
});

$('.previous').click(function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $('#progressbar li').eq($('fieldset').index(current_fs)).removeClass('active');

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1-now) * 50)+'%';
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({'left': left});
            previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
        },
        duration: 800,
        complete: function(){
            current_fs.hide();
            animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeInOutBack'
    });
});

$(document).on('submit', '#profile_form', function (e) {
    e.preventDefault();
    if ($('fieldset.active')!==$('fieldset').last()) $('.next').toggle('click');
    let obj = $(this).serializeArray();
    let prof = {};

    obj.forEach(function (elem) {
        prof[elem.name] = elem.value;
    });
    prof.avatar = null;
    if ($('[name=avatar]').prop('files').length)
        prof.avatar = $('#avatar_preview').attr('src');
    console.log('Msg1', prof);
    ipcRenderer.send('submit_profile', prof);
});

document.querySelector('html').classList.add('js');

let fileInput  = document.querySelector( '.input-file' ),
    button     = document.querySelector( '.input-file-trigger' );

button.addEventListener( 'click', function( event ) {
    fileInput.focus();
    return false;
});

function check_fields(fieldset) {
    let err = false;
    const $this=$(fieldset);
    let els = $this.serializeArray();
    if (els.length===0) return err;


    console.log(els);
    console.log(array_mnemonic_text);
    console.log(mnemonic_text);
    els.forEach(function (elem) {
        // console.log(window['validate_'+elem.name]);
        if (window['validate_'+elem.name]!==undefined){
            const $element = $this.find(`[name=${elem.name}]`);
            // console.log($element)
            if (!window['validate_'+elem.name](elem.value)){
                $element.addClass('invalid');
                err = true;
            } else {
                $element.removeClass('invalid');
            }
        }
        data[elem.name] = elem.value;

    });

    return err;
}

function validate_firstname(val) {
    return (val);
}

function validate_confirm_mnemonic(val) {
    // return true;
    if (val.trim() == mnemonic_text) {
        console.log(val);
        console.log(mnemonic_text);
        return (val);
    }
}


$('input[name=firstname]').bind('input', function (e) {
    // console.log($(this).val());
    if (!$(this).val()) $(this).addClass('invalid');
    else $(this).removeClass('invalid');
});

$('textarea[name=mnemonic]').bind('input', function (e) {
    // console.log($(this).val());
    if (!validate_mnemonic($(this).val())) $(this).addClass('invalid');
    else $(this).removeClass('invalid');

});

$('textarea[name=confirm_mnemonic]').bind('input', function (e) {
    console.log($(this).val());
    if (!validate_confirm_mnemonic($(this).val()) === mnemonic_text + ' ') $(this).addClass('invalid');
    else $(this).removeClass('invalid');

});


$(document).on('click', '#generate_mnemonic', function () {

    ipcRenderer.send('generate_mnemonic');
    $( '#input_mnemonic_next' ).focus();


});

ipcRenderer.on('generate_mnemonic', (event, arg) => {
    const mnemonic = $('#input_mnemonic');
    mnemonic.val(arg);
    mnemonic.removeClass('invalid');

});


function validate_mnemonic(mnem) {
    if (!mnem) return false;
    let mnemTrim = mnem.trim();
    console.log(`validate_mnemonic : ${mnem}`);
    if (mnem.search(/[А-яЁё]/) !== -1) return false;
    const words_count=mnemTrim.split(/\s+/).length;
    console.log(`menemonik : ${words_count}`);
    // const err=mnem.substr(-1,1)===' ';
    let err = words_count !== 12;
    console.log(err);
    return (words_count === 12 && !err);
}

$(document).on('click', '#generate_mnemonic', function () {
    ipcRenderer.send('generate_mnemonic');

});

$(document).on('keydown', '#input_mnemonic', function () {
    // console.log('keydown');//
    let mnemonicClr = $(this).val().replace(/\s\s/g, " ");
    // console.log(mnemonicClr);
    $(this).val(mnemonicClr);
});

$(document).on('click', '#input_mnemonic_next', function () {

    mnemonic_text  = $('#input_mnemonic').val().trim();
    array_mnemonic_text = mnemonic_text.split(' ');
    console.log(array_mnemonic_text);

    array_mnemonic_text.sort().map(function (item) {

        $('.words').prepend(`<a>${item}</a>`);

    });
});


$(document).on('click', '.words a', function () {
    let $this = $(this);
    let text = $('#confirm_input_mnemonic').val();

    if(!$this.hasClass('use')){

        text += ($this.text() + ' ');
        $('#confirm_input_mnemonic').val(text);
    }else {

    }
    $this.addClass('use');
    console.log(text);
    console.log(mnemonic_text);
    if(text == mnemonic_text + ' '){
        $('#confirm_input_mnemonic').removeClass('invalid');
    }
});

$(document).on('click', '.words .use', function () {
    let $this = $(this);
    let text = $('#confirm_input_mnemonic').val().replace($this.text() + ' ','');

    $('#confirm_input_mnemonic').val(text);
    $this.removeClass('use');
    console.log(text);

    if(!(text == mnemonic_text + ' ')){
        $('#confirm_input_mnemonic').addClass('invalid');
    }

});

ipcRenderer.on('generate_mnemonic', (event, arg) => {
    const mnemonic = $('#input_mnemonic');
    mnemonic.val(arg);
    mnemonic.removeClass('invalid');
});

$('#confirm_input_mnemonic').keydown(function(e){
    e.preventDefault();
});

$('#confirm_input_mnemonic').on('focus', function() {
    $(this).blur();
});

