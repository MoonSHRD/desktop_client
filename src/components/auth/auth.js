// const {ipcRenderer} = require('electron');
//jQuery time
let current_fs, next_fs, previous_fs; //fieldsets
let left, opacity, scale; //fieldset properties which we will animate
let animating; //flag to prevent quick multi-click glitches
let data = {}; //flag to prevent quick multi-click glitches
let mnemonic_text = '';
let array_mnemonic_text = [];

$(document).on('click', '.next', function(){
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

$(document).on('click', '.previous', function(){
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

/*$(document).on('submit', '#profile_form', function (e) {
    e.preventDefault();
    if ($('fieldset.active')!==$('fieldset').last()) {
        $('.next').toggle('click');
    }
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
});*/

/* Отправка формы */
document.addEventListener('submit', (e) => {
    const $this = e.target;
    if ($this.id === 'profile_form') {
        e.preventDefault();
        let fieldsetArr = document.querySelectorAll('fieldset');
        for (let i=0; i < fieldsetArr.length; i++) {
            if (fieldsetArr[i].classList.contains('active') !== fieldsetArr[fieldsetArr.length - 1]){
                console.log('done');
                document.querySelector('.next').click();
            }
        }
        let obj = serializeArray($this);
        console.log(obj);
        let prof = {};
        obj.forEach(function (elem) {
            prof[elem.name] = elem.value;
        });
        prof.avatar = null;
        if ($this.querySelector('[name=avatar]').files.length)
            prof.avatar = $this.querySelector('#avatar_preview').getAttribute('src');
        console.log('Msg1', prof);
        ipcRenderer.send('submit_profile', prof);
    }
});
/* /Отправка формы */

document.querySelector('html').classList.add('js');

// let fileInput  = document.querySelector( '.input-file' ),
//     button     = document.querySelector( '.input-file-trigger' );
//
// button.addEventListener( 'click', function( event ) {
//     fileInput.focus();
//     return false;
// });

function check_fields(fieldset) {
    let err = false;
    const $this=document.querySelector(fieldset);
    // let els = $this.serializeArray();
    let els = serializeArray($this);
    if (els.length===0) return err;

    els.forEach(function (elem) {
        // console.log(window['validate_'+elem.name]);
        if (window['validate_'+elem.name]!==undefined){
            const $element = $this.find(`[name=${elem.name}]`);
            // console.log($element)
            if (!window['validate_'+elem.name](elem.value)){
                $element.classList.add('invalid');
                err = true;
            } else {
                $element.classList.remove('invalid');
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
    if (val.trim() === mnemonic_text.trim()) {
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
    // console.log($(this).val());
    if (!validate_confirm_mnemonic($(this).val()) === mnemonic_text + ' ') $(this).addClass('invalid');
    else $(this).removeClass('invalid');
});

document.addEventListener('click', (e) => {

    if (e.target.id === 'generate_mnemonic') {
        ipcRenderer.send('generate_mnemonic');
        document.getElementById('input_mnemonic_next').focus();
    }

    else if (e.target.id === 'input_mnemonic_next') {
        let mnemonicVal = document.getElementById('input_mnemonic').value;
        if (validate_mnemonic(mnemonicVal)) {
            mnemonic_text = mnemonicVal.trim();
            array_mnemonic_text = mnemonic_text.split(' ');
            console.log(array_mnemonic_text);
            array_mnemonic_text.sort().map(function (item) {
                let a = document.createElement('a');
                a.innerText = item;
                a.classList.add('mnemonic__item');
                document.querySelector('.words').appendChild(a);
            });
        }
    }

    else if (e.target.classList.contains('mnemonic__item')){
        let $this = e.target;
        let confirmMnemonic = document.getElementById('confirm_input_mnemonic');
        let confirmMnemonicText = confirmMnemonic.value;

        if(!$this.classList.contains('mnemonic__item_use')){
            // console.log('this is item');
            confirmMnemonicText += ($this.innerText + ' ');
            confirmMnemonic.value = confirmMnemonicText;
            $this.classList.add('mnemonic__item_use');
            console.log(`confirmMnemonicText : ${confirmMnemonicText}`);
            console.log(mnemonic_text);
            if(confirmMnemonicText === mnemonic_text + ' '){
                confirmMnemonic.classList.remove('invalid');
            }
        } else {
            // console.log('this is item USE');
            let text = confirmMnemonicText.replace($this.innerText + ' ','');
            confirmMnemonic.value = text;
            $this.classList.remove('mnemonic__item_use');
            console.log(text);
            if(!(text === mnemonic_text + ' ')){
                confirmMnemonic.classList.add('invalid');
            }
        }
    }
});

ipcRenderer.on('generate_mnemonic', (event, arg) => {
    // const mnemonic = $('#input_mnemonic');
    const mnemonic = document.getElementById('input_mnemonic');
    mnemonic.value = arg;
    mnemonic.classList.remove('invalid');
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

document.addEventListener('keydown', (e) => {
    if (e.target.id === 'input_mnemonic'){
        let mnemonicClr = e.target.value.replace(/\s\s/g, " ");
        console.log(`vanilla keydown : ${mnemonicClr}`);
        e.target.value = mnemonicClr;
    } else if (e.target.id === 'confirm_input_mnemonic') {
        e.preventDefault();
        e.target.blur();
    }
});

/*$(document).on('click', '#input_mnemonic_next', function () {
    let mnemonicVal = $('#input_mnemonic').val();
    if (validate_mnemonic(mnemonicVal)) {
        mnemonic_text = mnemonicVal.trim();
        array_mnemonic_text = mnemonic_text.split(' ');
        console.log(array_mnemonic_text);

        array_mnemonic_text.sort().map(function (item) {
            $('.words').prepend(`<a>${item}</a>`);
        });
    }
});*/
/*$(document).on('click', '.mnemonic__item', function () {
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
});*/

/*$(document).on('click', '.words .use', function () {
    let $this = $(this);
    let text = $('#confirm_input_mnemonic').val().replace($this.text() + ' ','');

    $('#confirm_input_mnemonic').val(text);
    $this.removeClass('use');
    console.log(text);

    if(!(text == mnemonic_text + ' ')){
        $('#confirm_input_mnemonic').addClass('invalid');
    }

});*/

/*ipcRenderer.on('generate_mnemonic', (event, arg) => {
    // const mnemonic = $('#input_mnemonic');
    const mnemonic = document.getElementById('input_mnemonic');
    mnemonic.value = arg;
    mnemonic.classList.remove('invalid');
});*/

/*$('#confirm_input_mnemonic').keydown(function(e){
    e.preventDefault();
});*/

/*$('#confirm_input_mnemonic').on('focus', function() {
    $(this).blur();
});*/

/*!
 * Serialize all form data into an array
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   form The form to serialize
 * @return {String}      The serialized form data
 */
let serializeArray = (form) => {

    // Setup our serialized data
    let serialized = [];

    // Loop through each field in the form
    for (let i = 0; i < form.elements.length; i++) {

        let field = form.elements[i];

        // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
        if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

        // If a multi-select, get all selections
        if (field.type === 'select-multiple') {
            for (let n = 0; n < field.options.length; n++) {
                if (!field.options[n].selected) continue;
                serialized.push({
                    name: field.name.trim(),
                    value: field.options[n].value.trim()
                });
            }
        }

        // Convert field data to a query string
        else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
            serialized.push({
                name: field.name.trim(),
                value: field.value.trim()
            });
        }
    }

    return serialized;
};