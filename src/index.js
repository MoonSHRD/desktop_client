const {ipcRenderer} = require('electron');
// const dict = require('./langs/lang');
const slick = require('slick-carousel');
const {dialog} = require('electron').remote;
const fs = require('fs');
require('waypoints/lib/noframework.waypoints.min');
require('waypoints/lib/shortcuts/sticky.min');
require('bootstrap');
require('bootstrap-notify');
require('slick-carousel');
const SimpleScrollbar = require('simple-scrollbar');
const shell = require('electron').shell; //open links externally by default

let p = null;
let d = null;
let r = null;
let curr_width = null;
let unlock = false;

/* AUTH VARIABLES */
let current_fs, next_fs, previous_fs; //fieldsets
let left, opacity, scale; //fieldset properties which we will animate
let animating; //flag to prevent quick multi-click glitches
let data = {}; //flag to prevent quick multi-click glitches
let mnemonic_text = '';
let array_mnemonic_text = [];
/* /AUTH VARIABLES */

let validate_totalSupply = (val) => {
    let regexp = /^[0-9\.]*$/;
    if (regexp.test(val)){
        console.log(val);
        return (val);
    }
};

let validate_subscriptionPrice = (val) => {
    let regexp = /^[0-9\.]*$/;
    if (regexp.test(val)){
        console.log(val);
        return (val);
    }
};

let validate_tokenPrice = (val) => {
    let regexp = /^[0-9]*\.?[0-9]*$/;
    if (regexp.test(val)) {
        console.log(val);
        return (val);
    }
};

let validate_firstname = (val) => {
    return (val);
};

let validate_mnemonic = (mnem) => {
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
};

let validate_confirm_mnemonic = (val) => {
    if (val.trim() === mnemonic_text) {
        console.log(val);
        console.log(mnemonic_text);
        return (val);
    }
};

window.onload = function () {

    // $.html5Translate = function(dict, lang){
    //
    //     $('[data-translate-key]').each(function(){
    //         $(this).html( dict[ lang ][ $(this).data('translateKey') ] );
    //     });
    //
    // };

    /* AUTH.js */
    $(document).on('click', '.next', function(){
        if ( check_fields(this.closest('fieldset')) ) return;

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

    function check_fields(fieldset) {
        let err = false;
        const $this=document.querySelector(`[data-step="${fieldset.dataset.step}"]`);
        // let els = $this.serializeArray();
        let els = serializeArray($this);
        if (els.length===0) return err;

        els.forEach(function (elem) {
            // console.log(window['validate_'+elem.name]);
            if (window['validate_'+elem.name]!==undefined){
                const $element = $this.querySelector(`[name=${elem.name}]`);
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

    document.addEventListener('input', (e) => {
        let $this = e.target;
        if ( $this.getAttribute('name') === 'firstname' ){
            if (!$this.value) {
                $this.classList.add('invalid');
            } else {
                $this.classList.remove('invalid');
            }
        }
        else if ( $this.getAttribute('name') === 'mnemonic' ){
            if (!validate_mnemonic($this.value)) {
                $this.classList.add('invalid');
            } else {
                $this.classList.remove('invalid');
            }
        }
        else if ( $this.getAttribute('name') === 'confirm_mnemonic '){
            if (!validate_confirm_mnemonic($this.value) === mnemonic_text + ' ') {
                $this.classList.add('invalid');
            } else {
                $this.classList.remove('invalid');
            }
        }
    });

    document.addEventListener('click', (e) => {
        let $this = e.target;

        if ($this.id === 'generate_mnemonic') {
            ipcRenderer.send('generate_mnemonic');
            document.getElementById('input_mnemonic_next').focus();
        }

        else if ($this.id === 'input_mnemonic_next') {
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

        else if ($this.classList.contains('mnemonic__item')){
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

    /* Загрузка аватарки */
    document.addEventListener('change', (e) => {
        let $this = e.target;

        if ( $this.name === 'avatar' ) {
            console.log('change avatar');
            const file = $this.files[0];
            let fileType = file.type;
            if (file) {
                let reader = new FileReader();
                reader.onloadend = function () {
                    // var image = new Image();
                    // image.src = reader.result;
                    document
                        .getElementById('avatar_preview')
                        .setAttribute('src', reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    });
    /* /Загрузка аватарки */

    ipcRenderer.on('generate_mnemonic', (event, arg) => {
        const mnemonic = document.getElementById('input_mnemonic');
        mnemonic.value = arg;
        mnemonic.classList.remove('invalid');
    });

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
    /* /AUTH.js*/

    document.addEventListener('click', (e) => {
        let $this = e.target;
        // console.log(e.which);
        /* Обработка ссылок */
        if ( $this.hasAttribute('href') ) {
            let url = $this.getAttribute('href');
            let rgx = new RegExp("^(http|https)://", "i");
            if (rgx.test(url)) {
                shell.openExternal($this.href);
            }
            e.preventDefault();
        }
        /* /Обработка ссылок */

        /* Обработка ссылок стартовой странице */
        else if ( $this.dataset.id === 'start' ){
            let menuId = $this.dataset.menu; // id основного пункта меню
            let submenuId = $this.dataset.submenu; // id подпункта меню
            let menuItem = document.querySelector('.menu__item[data-id='+menuId+']'); // основной пункт меню

            menuItem.click(); // эмуляция клика на пункт меню

            if ( menuItem.classList.contains('active_menu') ){ // проверяем активность искомого меню
                setTimeout(() => { // даем задержку для обработки
                    if (document.querySelector('.nav_menu')) { // проверяем наличие подменю
                        document.querySelector('[data-toggle="nav"][data-name=' + submenuId + ']').click(); // Эмулируем клик по подменю
                    }
                }, 500);
            }
        }
        /* /Обработка ссылок стартовой странице */

        /* Копирование id пользователя */
        else if ( $this.classList.contains('copyButton') ){
            let elem = document.getElementById('copyTo');
            let body = document.body, range, sel;

            if(document.createRange && window.getSelection) {
                range = document.createRange();
                sel = window.getSelection();
                sel.removeAllRanges();
                try {
                    range.selectNodeContents(elem);
                    sel.addRange(range);
                } catch (e) {
                    range.selectNode(elem);
                    sel.addRange(range);
                }
            } else if (body.createTextRange) {
                range = body.createTextRange();
                range.moveToElementText(elem);
                range.select();
            }
            document.execCommand('copy');
            console.log(range, sel, elem);

            $.notify('address copied \n' + range, {

                placement: {
                    from: 'bottom',
                    align: 'right'
                },
                animate: {
                    enter: 'animated fadeInRight',
                    exit: 'animated fadeOutRight'
                },
                z_index: 10031,
                offset: 20,
                spacing: 10
            });
        }
        /* /Копирование id пользователя */

        /* Обработка клика на добавление файлов/картинок в чат */
        else if ( $this.classList.contains('attachFileToChat') ){
            console.log('hello MF');
            document.getElementById('attachFileToChat').click();
        }
        else if ( $this.classList.contains('attachFileToGroup') ){
            console.log('hello MF');
            document.getElementById('attachFileToGroup').click();
        }
        /* /Обработка клика на добавление файлов/картинок в чат */

        /* Обработка клика на меню */
        else if ( $this.classList.contains('menu__item') ){
            const type = $this.dataset.id;

            if (!$this.classList.contains('active_menu') && type) {
                console.log($this.classList.contains('active_menu'), type);
                ipcRenderer.send('change_menu_state', type);
            }

            if (
                (type !== 'menu_create_chat')
                &&
                !$this.classList.contains('not_active')
            ) {
                // $this.classList.add('active_menu');
                let parent = $this.parentNode; // родитель - li
                let parentList = parent.parentNode; // родитель - ul
                let sibling = parentList.firstChild;

                console.log(parent, parentList, sibling, sibling.childNodes);

                // Перебераем весь список элементов
                while (sibling) {
                    // Удаляем все активные классы
                    if (sibling.nodeType === 1)
                        sibling.children[0].classList.remove('active_menu');
                    // Добавляем активный класс для назатого пункта
                    if (sibling.nodeType === 1 && $this === sibling.children[0])
                        sibling.children[0].classList.add('active_menu');
                    sibling = sibling.nextSibling;
                }
            }
        }
        /* /Обработка клика на меню */

        /* Клик по аватрке */
        else if ( $this.classList.contains('infopanel') ){
            ipcRenderer.send('get_my_vcard');
        }
        /* /Клик по аватрке */
    });

    /* Запрет средней кнопки мыши */
    (function() {
        let callback = (e) => {
            // let e = window.e || e;
            console.log(e);
            if (e.target.localName === 'a') {
                e.preventDefault();
                shell.openExternal(e.target.href);
            }
            return
        };

        if (document.addEventListener) {
            document.addEventListener('auxclick', callback, false);
        } else {
            document.attachEvent('onauxclick', callback);
        }
    })();
    /* /Запрет средней кнопки мыши */

    /* Обработка добавления файлов/картинок в чат */
    document.addEventListener('change', (e) => {
        let $this = e.target;
        if ( $this.getAttribute('id') === 'attachFileToChat' ){
            console.log('Selected files', $this.files);
            readURL($this);
        } else if ( $this.getAttribute('id') === 'attachFileToGroup' ){
            console.log('Selected files', $this.files);
            readURL($this);
        }
    });
    /* /Обработка добавления файлов/картинок в чат */

    /* Считывание урла на файл/картинку */
    let readURL = (input) => {

        // let imgFileMsg = $('#upload_file');
        let imgFileMsg = document.getElementById('upload_file');

        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                imgFileMsg.classList.add('added');
                imgFileMsg.setAttribute('src', e.target.result);
                imgFileMsg.style.cursor = 'pointer';
            };

            reader.readAsDataURL(input.files[0]);
        }
    };
    /* /Считывание урла на файл/картинку */

    // $(document).on('click', '#upload_file', function () {
    //     let imgFileMsg = $(this);
    //
    //     imgFileMsg
    //         .removeClass('added')
    //         .attr('src', '')
    //         .css('cursor', 'default');
    //     $('input[id="attachFileToChat"], input[id="attachFileToGroup"]').prop('value', null);
    // });

    document.addEventListener('click', (e) => {
        let $this = e.target;
        if ( $this.dataset.id === 'menu_create_chat' ){
            ipcRenderer.send('change_menu_state', 'menu_create_chat');
        }
    });

    ipcRenderer.on('change_menu_state', (event, arg) => {
        document.getElementById('working_side').innerHTML = arg;
    });

    ipcRenderer.on('online', (event, arg) => {
        console.log(arg);
    });

    let widthMsgWindow = (target = '[data-msgs-window]') => {
        let msgWindow =  document.querySelector(target);
        if ( msgWindow ) {
            if (msgWindow.offsetWidth > 900) {
                msgWindow.classList.add('messaging_block_lg');
            } else {
                msgWindow.classList.remove('messaging_block_lg');
            }
        }
    };

    ipcRenderer.on('change_app_state', (event, obj) => {
        console.log('autyh', obj);
        // $('#view').html(obj.arg);
        document.getElementById('view').innerHTML = obj.arg;
        // $.html5Translate(dict, obj.language);
        scrollbarInit();
        widthMsgWindow('[data-msgs-window]');
    });

    window.addEventListener('resize', function(e){
        widthMsgWindow('[data-msgs-window]');
        scrollbarInit();
        e.preventDefault();
    });

    /*$(document).on('click', '.menuBtn', function () {
        $('.dialogs').toggleClass('resize1', 400);
        $('.icon-bar').toggleClass('resize', 400);
    });*/

    /*$(document).on('click', 'a.infopanel', function () {
        ipcRenderer.send('get_my_vcard');
    });*/


    /*$(document).on('keydown', '[data-msg="data-msg"]', function () {
        if (event.ctrlKey && event.keyCode === 13) {
            send_message();
        }
    });*/

    document.addEventListener('keydown', (e) => {
        let $this = e.target;
        /* Отправка сообщение на CTRL+ENTER */
        if ( $this.dataset.msg ){
            if (event.ctrlKey && event.keyCode === 13) {
                send_message();
            }
        }
        /* /Отправка сообщение на CTRL+ENTER */
    });

    document.addEventListener('keyup', (e) => {
        let $this = e.target;
        if ( $this.dataset.msg ){
            autoResizeTextarea();
            if($this.value === '') {
                $this.setAttribute('rows', 1);
            }
            if($this.value === '' && event.keyCode === 13) {
                event.preventDefault();
            }
            if (event.ctrlKey && event.keyCode === 13 ) {
                $this.setAttribute('rows', 1);
            }
        }
    });

    /*$(document).on('keyup', '[data-msg="data-msg"]', function () {
        if (event.ctrlKey && event.keyCode === 13 ) {
            $(this).attr('rows', 1);
        }
    });*/

    /*$(document).on('keydown','.send_message__input',function(e) {
        autoResizeTextarea();
        if($(this).val() === '') {
            $(this).attr('rows', 1);
        }
        if($(this).val() === '' && event.keyCode === 13) {
            event.preventDefault();
        }
        // if ( event.keyCode === 13 && $(this).val()!=='') {
        //     ResizeTextArea(this,0);
        // }
    });*/

    /*$(document).on('input','.send_message__input',function(e) {
        // console.log('hello!')
        if($(this).val() === '') {
            $(this).attr('rows', 1);
        }

    });*/

    /*$(document).on('paste','.send_message__input',function(e) {
        // console.log('paste!');
        var text = $(this).outerHeight();   //помещаем в var text содержимое текстареи
        let val = $(this).text();
        // if($(this).val() !==''){
        //     $(this).attr('rows', $(this).attr('rows'));
        // } else {
        //     ResizeTextArea(this,1);
        // }
        console.log(text);

    });*/


    $(document).on('click', '[data-toggle="send-msg"]', function () {
        send_message();
        autoResizeTextarea();
        $('[data-msg="data-msg"]').focus();
    });

    let send_message = () => {
        // let msg_input = $('.send_message__input');
        const msg_input = document.querySelector('.send_message__input'); // поле ввода сообщения
        const active_dialog = document.querySelector('.active_dialog'); // активный диалог
        const chatFiles = document.getElementById('attachFileToChat'); // загрузка файлов для чата
        const groupFiles = document.getElementById('attachFileToGroup'); // загрузка файлов для канала/группы
        const uploadFile = document.getElementById('upload_file'); // отображение загруженного файла
        let files = chatFiles.files;

        msg_input.setAttribute('rows', 1);

        if (msg_input.value.trim() === '') {
            msg_input.value = '';
            return;
        }

        let obj = {
            user: {
                id: active_dialog.getAttribute('id'),
                domain: active_dialog.dataset.domain,
            },
            text: msg_input.value.trim(),
            group: active_dialog.dataset.type === 'channel',
        };

        obj = {
            id: active_dialog.getAttribute('id'),
            text: msg_input.value.trim()
        };

        if (files && files[0]) {
            msg_input.setAttribute('rows', 1);
            let file = files[0];
            console.log(file);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                obj.file = {
                    file: reader.result,
                    type: file.type,
                    name: file.name
                };
                console.log('send file', file);
                // console.log(obj);
                ipcRenderer.send('send_message', obj);
            };
        } else {
            ipcRenderer.send('send_message', obj);
        }

        msg_input.value = '';

        if ( chatFiles ) chatFiles.value = '';
        if ( groupFiles ) groupFiles.value = '';

        /* Очистка прикрепленных файлов */
        uploadFile.setAttribute('src', '');
        uploadFile.style.cursor = 'default';
        uploadFile.classList.remove('added');
    };

    /*ipcRenderer.on('add_out_msg', (event, obj) => {
        console.log(obj);
        $('[data-msg-list]').append(obj);
    });*/

    let scrollDown = (target) => {
        let targetBlock = document.querySelector(target);
        targetBlock.scrollTop = targetBlock.scrollHeight;
    };

    let scrollDownAnimate = (target = '[data-msg-history]', list = '[data-msg-list]') => {
        const targetBlock = document.querySelector(target);
        let targetHeight = document.querySelector(list).offsetHeight;
        animate(targetBlock, "scrollTop", "", targetBlock.scrollTop, targetHeight, 1000, true);
    };

    let animate = (elem, style, unit, from, to, time, prop) => {
        if (!elem) return;
        let start = new Date().getTime();
        let timer = setInterval(function () {
            let step = Math.min(1, (new Date().getTime() - start) / time);

            if (prop) {
                elem[style] = (from + step * (to - from))+unit;
            } else {
                elem.style[style] = (from + step * (to - from))+unit;
            }

            if (step === 1) {
                clearInterval(timer);
            }
        }, 25);

        if (prop) {
            elem[style] = from+unit;
        } else {
            elem.style[style] = from+unit;
        }
    };

    // ipcRenderer.on('get_chat_msgs', (event, obj) => {
    //     console.log(obj);
    //     $('[data-msg-list]').append(obj);
    //     // scrollDown('[data-msg-history]');
    // });

    ipcRenderer.on('received_message', (event, obj) => {
        // let chat = $('#'+obj.id);
        const chat = document.getElementById(obj.id);
        const chatActive = document.querySelector('.active_dialog');
        const msgList = document.querySelector('[data-msg-list]');

        // console.log(chat, obj);

        //console.log('received_message', obj);

        if (obj.message.fresh) {

            if (chat) {
                // chat.find('[data-name=chat_last_time]').text(obj.message.time);
                // chat.find('[data-name=chat_last_text]').text(obj.message.text);
                chat.querySelector('[data-name=chat_last_time]').innerText = obj.message.time;
                chat.querySelector('[data-name=chat_last_text]').innerText = obj.message.text;
            }

            // chat.prependTo($('.chats ul')[0]);
            document.querySelector('.chats__list').prepend(chat);
            console.log('1');
        }
        if ( chatActive.id === obj.id ) {
            chat.querySelector('[data-name=unread_messages]').style.display = 'none';
            ipcRenderer.send('reading_messages', obj.id);

            /* TODO: подумай над этим */
            let p_count = ($('p:contains(' + obj.time + ')'));

            if (p_count.length === 0) {
                msgList.insertAdjacentHTML('beforeend', obj.html_date);
            }

            msgList.insertAdjacentHTML('beforeend', obj.html);

            scrollbarInit();
            console.log('[[data-msg-history]]');

            scrollDown('[data-msg-history] .ss-content');
        } else {
            // chat.find('[data-name=unread_messages]').text(obj.unread_messages);
            if (obj.message.fresh) {
                let un_m = chat.querySelector('[data-name=unread_messages]');
                let txt_now = un_m.innerText;
                if (txt_now == 0)
                    un_m.innerText = 1;
                else
                    un_m.innerText = un_m.innerText + 1;
                un_m.style.display = 'inherit';
                // chat.find('[data-name=unread_message]').text(obj.message.unread_messages);
                // chat.find('[data-name=unread_messages]').show();
            }
        }
        // ipcRenderer.send('load_chat s', 'menu_chats');
    });

    /* Загразка блока с информацией */
    ipcRenderer.on('firstLoad', (event, obj) => {
        document.querySelector('.messaging_block').innerHTML = obj;
        scrollbarInit();
    });
    /* /Загразка блока с информацией */

    ipcRenderer.on('buddy', (event, obj) => {
        // if (
        //     !$(`[data-id=${obj.type}]`).hasClass('active_menu') ||
        //     (obj.type === "menu_chats" && $('.searchInput').val())
        // ) {
        //     return;
        // }
        console.log(obj);
        // const chatList = $('.chats ul');
        const chatList = document.querySelector('.chats__list');
        // const user = chatList.find('#' + obj.id);
        const user = document.getElementById(obj.id);
        widthMsgWindow();
        if (user) {
            user.replaceWith(obj.html);
        } else {
            // chatList.prepend(obj.html);
            chatList.insertAdjacentHTML('afterbegin', obj.html);
        }

    });

    ipcRenderer.on('reload_chat', (event, obj) => {
        // $('#messaging_block').html(obj);
        document.getElementById('messaging_block').innerHTML = obj;
        if (document.querySelector('[data-msg]')) {
            document.querySelector('[data-msg]').focus();
        }
    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        document.querySelector('[data-msg-list]').prepend(obj);
    });

    ipcRenderer.on('join_channel_html', (event, obj) => {
        // $('.send_message_block').html(obj);
        document.querySelector('.send_message_block').innerHTML = obj;
    });

    /* Очистка поиска при вводе сообщения */
    /*document.addEventListener('input', (e) => {
        let $this = e.target;
        let searchInput = document.querySelector('.searchInput'); // Поле поиска
        let chatsList = document.querySelector('.chats__list'); // Список чатов
        let msgLength = 2; // Число введенных символов сообщения
        if ( $this.dataset.msg ){
            if ( searchInput.value ) {
                // Проверим длинну введенного сообщения
                if ($this.value.length > msgLength) {
                    searchInput.value = ''; // Очистим поле поиска
                    // Удалим результаты поиска
                    while (chatsList.firstChild) {
                        chatsList.removeChild(chatsList.firstChild)
                    }
                    ipcRenderer.send('load_chats', 'group_chat'); // Загружаем наши чаты
                }
            }
        }
    });*/
    /* Очистка поиска при вводе сообщения */

    /*$(document).on('click', '[data-name=join_channel]', function () {
        $(this).attr('disabled', 'disabled');
        let active_dialog = $('.active_dialog');
        ipcRenderer.send('join_channel', {
            id: active_dialog.attr('id'),
            domain: active_dialog.attr('data-domain'),
            contract_address: active_dialog.attr('data-contract_address')
        });
    });*/

    document.addEventListener('click', (e) =>{
        let $this = e.target;
        let activeDialog = document.querySelector('.active_dialog');
        // let searchInput = document.querySelector('.searchInput'); // Поле поиска
        // let chatsList = document.querySelector('.chats__list'); // Список чатов

        if ( $this.dataset.name === 'join_channel' ){
            /*if ( searchInput.value ) {
                // Проверим длинну введенного сообщения
                searchInput.value = ''; // Очистим поле поиска
                // Удалим результаты поиска
                while (chatsList.firstChild) {
                    chatsList.removeChild(chatsList.firstChild)
                }*/
            $this.setAttribute('disabled', 'disabled');
            ipcRenderer.send('join_channel', {
                id: activeDialog.getAttribute('id'),
                domain: activeDialog.dataset.domain,
                contract_address: activeDialog.dataset.contract_address
            });
            /*    ipcRenderer.send('load_chats', 'group_chat'); // Загружаем наши чаты
            }*/
        }
    });

    /*let click_anim = (e) => {
        $('.ripple').remove();
        var posX = $(this).offset().left,
            posY = $(this).offset().top,
            buttonWidth = $(this).width(),
            buttonHeight =  $(this).height();
        $(this).children('a').prepend('<span class=\'ripple\'></span>');
        if(buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }
        var x = e.pageX - posX - buttonWidth / 2;
        var y = e.pageY - posY - buttonHeight / 2;
        $('.ripple').css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass('rippleEffect');
    };*/

    document.addEventListener('click', (e) => {
        let $this = e.target;
        if ( $this.classList.contains('chats__item') ){
            console.log('chat_clicked');

            let parent = $this.parentNode; // родитель
            let sibling = parent.firstChild;

            // Перебераем весь список элементов
            while (sibling) {
                // Удаляем все активные классы
                if (sibling.nodeType === 1)
                    sibling.classList.remove('have_history', 'active_dialog');
                // Добавляем активный класс для назатого пункта
                if (sibling.nodeType === 1 && $this === sibling)
                    sibling.classList.add('active_dialog');
                sibling = sibling.nextSibling;
            }

            let chat = {
                id : $this.getAttribute('id'),
                type : $this.dataset.type
            };

            $this.querySelector('[data-name="unread_messages"]').style.display = 'none';
            $this.querySelector('[data-name="unread_messages"]').innerText = '0';

            if ( !(
                $this.classList.contains('active_dialog')
                &&
                $this.classList.contains('have_history')
            ) ) {
                ipcRenderer.send('get_chat_msgs', chat);
                console.log(chat);
                $this.classList.add('have_history');
            }
        }
    });


    ipcRenderer.on('get_my_vcard', (event, data) => {
        let modal = document.getElementById('AppModal').querySelector('[data-modal-content]');
        modal.innerHTML = data;
        $('#AppModal').modal('toggle');
        scrollbarInit();
    });

    ipcRenderer.on('offer_publication', (event, data) => {
        $('#AppModal').modal('toggle');
        $('#AppModal1').modal('toggle');
        $('.modal-content1').html(data);

    });

    ipcRenderer.on('found_chats', (event, data) => {
        $('.chats ul').append(data);
    });

    ipcRenderer.on('load_chat', (event, data) => {
        $('.chats ul').append(data);
    });

    // $(document).on("change", '.modal-content select[name=substype]', function () {
    //     if ($(this).find(":selected").val() === 'unfree') {
    //         $("#token_row").show();
    //     } else {
    //         $("#token_row").hide();
    //     }
    // });

    $(document).on('change', '[name="openPrivate"]', function () {
        if ($(this).attr('id') === 'private') {
            $('#token_row').collapse('show');
        } else {
            $('#token_row').collapse('hide');
        }
    });

    /*
     * Tooltips init
     */
    $(document)
        .on('mouseover', '[data-toggle="tooltip"]', function () {
            $(this).tooltip('show');
        })
        .on('mouseout', '[data-toogle="tooltip"]', function () {
            $(this).tooltip('hide');
        })
        .on('keydown', '[data-toggle="tooltip2"]', function () {
            $(this).tooltip('show');
        })
        .on('backspace-down', '[data-toggle="tooltip2"]', function () {
            $(this).tooltip('hide');
        });

    /*
     * Форма создная группы/канала
     */

    /*function validationInputs(target = '[data-require]'){
        const $this = $(target);
        const minChars = $this.attr('minlength');
        const maxChars = $this.attr('maxlength');
        const typeChars = $this.data('require-chars');
        let value = $this.val();
        let rgx;

        console.log($this);

        if (value.length < minChars){
            $this.addClass('error').removeClass('correct');
        } else {
            $this.removeClass('error').addClass('correct');
        }

        if (typeChars === 'integer') {
            rgx = /[0-9]|\./;
            if (!rgx.test(value)) {
                // e.preventDefault();
                $this.addClass('error').removeClass('correct');
                // alert("введите латинские символы");
                return false;
            } else {
                $this.removeClass('error').addClass('correct');
            }
        } else if (typeChars === 'num') {
            rgx = /^[0-9]*\.?[0-9]*$/;
            if (!rgx.test(value)) {
                // e.preventDefault();
                $this.addClass('error').removeClass('correct');
                // alert("введите латинские символы");
                return false;
            } else {
                $this.removeClass('error').addClass('correct');
            }
        }
    };*/

    function checkFields(fieldset) {
        let err = false;
        const $this=$(fieldset);
        let els = $this.serializeArray();
        console.log(els);
        // if (els.length===0) return err;
        let ret={
            err:true,
            data:{}
        };

        els.forEach(function (elem) {
            const $element = $this.find(`[name=${elem.name}]`);
            if (window['validate_'+elem.name]!==undefined){
                if (!window['validate_'+elem.name](elem.value)){
                    $element.addClass('invalid');
                    ret.err = true;
                } else {
                    $element.removeClass('invalid');
                    ret.data[elem.name]=elem.value;
                    ret.err = false;
                }
            } else {
                // data[elem.name] = elem.value;
                if (!elem.value) {
                    $element.addClass('invalid');
                    ret.err = true;
                } else {
                    $element.removeClass('invalid');
                    ret.data[elem.name]=elem.value;
                    ret.err = false;
                }
            }
        });

        return ret;
    }

    $(document).on('submit', '.modal-content', function (e) {
        let button = $(this).find('.btn-primary');
        button.attr('disabled', 'disabled');
        e.preventDefault();
        const $this = $(this);
        let groupNameEl = $this.find('[name=\'name\']');
        let groupName = groupNameEl.val().trim();
        let openPrivateRadio = $this.find('[name="openPrivate"]:checked');

        let {data,err}=checkFields(this);

        console.log(data);
        console.log(err);

        // let obj = {};
        if (groupName.length > 2) {
            if (openPrivateRadio.val() === 'off' ){
                err = false;
            }
            if (!err) {
                ipcRenderer.send('create_group', data);
                console.log(data);
                $('#AppModal').modal('toggle');
            }
        }
        else
            button.removeAttr('disabled');
    });

    $(document).on('focusin', '[data-name="crowdsale__input"]', function (e) {
        let $this = $(this);
        let parent = $this.closest('[data-name="crowdsale"]');
        parent.addClass('crowdsale_focus');
    });

    $(document).on('focusout', '[data-name="crowdsale__input"]', function (e) {
        let $this = $(this);
        let parent = $this.closest('[data-name="crowdsale"]');
        parent.removeClass('crowdsale_focus');
    });

    /*
     * /Форма создания группы/канала
     */

    $(document).on('click', '[data-event=show_chat_info]', function () {
        const active_dialog = $('.active_dialog');
        const id = active_dialog.attr('id');
        const type = active_dialog.attr('data-type');
        // let data = $this.attr('href');
        ipcRenderer.send('show_popup', {id, type});
    });

    function update_notify(title, message){
        $.notify({
            icon:  __dirname + '/img/navbar/img/logo.svg',
            title: title,
            message: message
        },{

            placement: {
                from: 'bottom',
                align: 'right'
            },
            type: 'minimalist',
            delay: 5000,
            icon_type: 'image',
            template: '<div data-notify="container" class="col-xs-11 col-sm-5 alert alert-{0}" role="alert">' +
                '<img data-notify="icon" class="float-left">' +
                '<span data-notify="title">{1}</span>' +
                '<span data-notify="message">{2}</span>' +
                '</div>'
        });
    }


    // $(document).on('click', '[data-name=submit_suggest_to_channel]', function () {
    //     let textbox = $('[data-name=suggest_to_channel]');
    //     let text = textbox.val();
    //     if (text.trim() === "") return;
    //     console.log(`Suggest: ${text}`);
    //     textbox.val('');
    //
    //     bot_notif("Success! Your suggest has been sent");
    //     console.log(text);
    //     // return;
    //     let active_dialog = $('.active_dialog');
    //     // console.log({id:active_dialog.attr('id'),domain:active_dialog.attr('data-domain')});
    //     ipcRenderer.send('channel_suggestion', {
    //         id:active_dialog.attr('id'),
    //         domain:active_dialog.attr('data-domain'),
    //         contract_address:active_dialog.attr('data-contract_address'),
    //         text: text
    //     });
    // });

    function bot_notif(text) {
        $.notify(text, {

            placement: {
                from: 'bottom',
                align: 'right'
            },
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            z_index: 10031,
            offset: 20,
            spacing: 10
        });
    }

    ipcRenderer.on('throw_error', (event, text) => {
        $.notify(text, {

            placement: {
                from: 'bottom',
                align: 'right'
            },
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            z_index: 10031,
            offset: 20,
            spacing: 10,
            type: 'danger'
        });
    });

    ipcRenderer.on('user_joined_room', (event, text) => {
        bot_notif(text);
    });

    ipcRenderer.on('get_notice', (event, obj) => {
        if ($('.active_dialog').attr('id') === obj.id) {
            $('.notifyBlock').append((obj.html));
        }
    });

    ipcRenderer.on('checking_updates', (event, data) => {
        // $('#download_updates').css('width', obj+'%')
        console.log(data);
        if(data) {
            setTimeout(() => {
                if (data) $('#update_button').fadeIn().addClass('update_animate');

                update_notify( 'New Version !', 'A new version of the Moonshard is available');



            }, 1000);
        }
    });

    ipcRenderer.on('get_updates', (event, obj) => {

        console.log(typeof(obj));
        if(obj === 100){

            update_notify( 'Install updates', 'Now you can install updates');

            $('#update_button').fadeIn();
            $('[data-name=download_updates]').attr('data-name','install_updates');
            setTimeout(() => {
                $('#download_img').fadeOut();

                setTimeout(() => {
                    $('#update_img').fadeIn();
                },500);
            },500);

        }
        $('#download_updates').css('width', obj+'%');
    });

    $(document).on('click', '[data-name=download_updates]', function (e) {
        $('#update_button').fadeOut();
        update_notify('Download updates', 'Updates will download in the background');

        ipcRenderer.send('get_updates', {});
    });

    $(document).on('click', '[data-name=install_updates]', function (e) {
        ipcRenderer.send('install_updates', {});

    });




    // Context menu
    $(document).mousedown(function (event) {
        if (event.which === 1) {
            $('.context-menu').remove();

        }
    });


    $(document).on('mousedown', '.chats li', function (e) {
        $('*').removeClass('selected-html-element');
        $('.context-menu').remove();
        if (e.which === 3) {
            var target = $(e.target);
            target.addClass('selected-html-element');
            $('<div/>', {
                class: 'context-menu'
            })
                .css({
                    left: e.pageX + 'px',
                    top: e.pageY + 'px'
                })
                .appendTo('body')
                .append(
                    $('<ul/>').append('<li><a href="#">Remove element</a></li>')
                        .append('<li><a href="#">Add element</a></li>')
                        .append('<li><a href="#">Element style</a></li>')
                )
                .fadeIn(300);
        }
    });

    $(document).on('click', '.dropDown_menu > ul > li ', function (e) {
        $(this).children('ul').toggleClass('d-block');
    });

    $(document).on('click', '.offerPublication', function (e) {
        ipcRenderer.send('channel_suggestion', {});
    });

    $(document).on('click', '[data-type=file][data-subtype=file]', function (e) {
        // todo: возможность отменить закачку файла
        if (!$(this).hasClass('load'))
            $(this).addClass('load');
        ipcRenderer.send('download_file', $(this).attr('data-id'));
    });

    ipcRenderer.on('file_downloaded', (event, obj) => {
        let file=$(`[data-id=${obj.id}]`);
        if (file.hasClass('load'))
            file.removeClass('load').addClass('complite');
    });

    ipcRenderer.on('wallet_token_table', (event, obj) => {
        console.log('token table');
        $('.loader').remove();
        $('.myTokens').append(obj);
    });

    ipcRenderer.on('get_contacts', (event, obj) => {
        // console.log('1234567')
        $('#browsers').html(obj);

    });

    // var p = $(".dialogs");
    // var d = $(".messaging_block");
    // var r = $("#resize01");
    // var curr_width = p.width()
    // var unlock = false;

    let p = null;
    // let d = $(".messaging_block");
    // let r = $("#resize01");
    let curr_width = null;
    let unlock = false;

    $(document).mousemove(function(e) {
        if (!$('[data-id="menu_chats"]').hasClass('active_menu'))
            return;
        p = $('.dialogs');
        let d = $('.messaging_block');
        let change = curr_width + (e.clientX - curr_width);
        widthMsgWindow('[data-msgs-window]');
        if(unlock) {
            if(change > 369 && change < 501) {

                p.css('width', change);
                d.css('margin-left', change);
            }
        }
    });

    $(document).on('mousedown','#resize01',function(e) {
        // console.log('resize_clicked');
        unlock = true;
        $(document).on('mouseup', function(e) {
            ipcRenderer.send('change_chats_size', p.width());
        });
    });

    $(document).on('click','[data-id=add_new_user]',function(e) {
        let input = $('[data-name=user_search]');
        let data={id:input.val(),domain:'localhost'};
        input.val('');
        ipcRenderer.send('send_subscribe', data);
    });

    $(document).mouseup(function(e) {
        unlock = false;
    });



    function countLines(strtocount, cols) {
        var hard_lines = 1;
        var last = 0;
        while ( true ) {
            last = strtocount.indexOf('\n', last+1);
            hard_lines ++;
            if ( last === -1 ) break;
        }
        var soft_lines = Math.ceil(strtocount.length / (cols-1));
        var hard = eval('hard_lines ' + unescape('%3e') + 'soft_lines;');
        if ( hard ) soft_lines = hard_lines;
        return soft_lines;
    }

// функция вызывается при каждом нажатии клавиши в области ввода текста
//     function ResizeTextArea(the_form, min_rows) {
//         the_form.rows = Math.max(min_rows, countLines(the_form.value,the_form.cols) );
//     }
    let autoResizeTextarea = (element = '[data-msg]') => {
        let el = document.querySelector(element);
        let offset = el.offsetHeight - el.clientHeight;
        console.log(el.scrollHeight + offset, offset);
        setTimeout( function() {
            $(element).css('height', 'auto').css('height', el.scrollHeight + offset);
        }, 0);
    };

    $(document).on('click', '[data-toggle="switcher"]', function(e) {
        let $this = $(this);
        let $thisPosition = $this.data('switcher');
        let $thisSwitcherToggle = $this.data('switcher-toggle');
        let target = $this.data('target');
        let $parent = $this.closest('.control-switcher');

        $(target).attr('class', 'custom-control-switcher custom-control-switcher_' + $thisPosition);
    });

    $('[data-toggle="collapse"]').collapse('toggle');
    $(document).on('click', '[data-toggle="collapse"] a', function (e) {
        e.preventDefault();
    });

    let scrollBottom = (target = '[data-msg-history]', child = '[data-msg-list]') => {
        let param = {
            bottom : '',
            height : $(target).outerHeight(true)
        };
        param.bottom = $(child).outerHeight(true) - ( $(target).scrollTop() + $(target).outerHeight(true));
        return param;
    };

    document.addEventListener('scroll', function (event) {

        if (event.target.id === 'messaging_history') {
            let {bottom, height} = scrollBottom();
            if ( bottom > height ) {
                $('[data-toggle="scrollDown"]').addClass('show');
            } else {
                $('[data-toggle="scrollDown"]').removeClass('show');
            }

            /* Скролл даты */
            // if ( $('.dialogDate').length ) {
            //     $('.dialogDate').addClass('slicky');
            // }
            /* /Скролл даты */
        }

    }, true);


    const wayElem = document.getElementsByClassName('dialogDate');
    if (wayElem.length > 0) {
        let waypoint = new Waypoint({
            element: wayElem[0],
            handler: function(direction) {
                console.log('Direction: ' + direction);
            },
            context: document.querySelector('data-msg-list'),
        });
    }

    $(document).on('click', '[name=change_download]', function (e) {
        dialog.showOpenDialog({
            properties: ['openDirectory','openFile']
        },function (directory) {
            ipcRenderer.send('change_directory', directory + '/');
        });
    });

    /*$(document).on('click', '[data-toggle="scrollDown"]', function (e){
        e.preventDefault();
        scrollDownAnimate();
    });*/
    document.addEventListener('click', (e) => {
        let $this = e.target;
        if ( $this.dataset.toggle === 'scrollDown' ) {
            scrollDownAnimate();
        }
    });

    /*$(document).on('click', '.switch-btn', function () {
        $(this).toggleClass('switch-on');
        if ($(this).hasClass('switch-on')) {
            $(this).trigger('on.switch');
        } else {
            $(this).trigger('off.switch');
        }
    });
    $(document).on('on.switch', function () {
        $('.bl-hide-1').val('');
        ipcRenderer.send('load_chats', 'menu_chats');
        $('.bl-hide').css('display', 'block');
        $('.bl-hide-1').css('display', 'none');
        $('.chats').css('height', 'calc(100% - 153px)');

    });
    $(document).on('off.switch', function () {
        $('.bl-hide').val('');
        $('.bl-hide').css('display', 'none');
        $('.bl-hide-1').css('display', 'block');
        $('.chats').css('height', 'calc(100% - 200px)');
    });*/

    /* Ресайз окна мессенджера */
    window.addEventListener('resize', (e) => {
        let mainMenu = document.getElementById('main-menu');
        // if ( mainMenu.length !== 0 ) {
        if ( mainMenu ) {
            // console.log('resize',  window.innerWidth, window.innerHeight);
            ipcRenderer.send('change_size_window', window.innerWidth, window.innerHeight);
        }
    });
    /* /Ресайз окна мессенджера */

    /* Зашифровать/Разшифровть данные */
    document.addEventListener('click', (e) => {
        let $this = e.target;
        if ( $this.getAttribute('name') === 'encrypt_database' ){
            ipcRenderer.send('encrypt_db');
        } else if ( $this.getAttribute('name') === 'decrypt_database' ) {
            ipcRenderer.send('decrypt_db');
        }
    });
    /* /Зашифровать/Разшифровть данные */

    /*$(document).on('click', '[name=encrypt_database]', function (e) {
        ipcRenderer.send('encrypt_db');
    });

    $(document).on('click', '[name=decrypt_database]', function (e) {
        ipcRenderer.send('decrypt_db');
    });*/

    $(document).on('click', '.sendTokenButton', function (e) {
        // let data_arr=$(this).closest('form');
        // console.log(data_arr);
        // return;
        let sendTo = document.getElementById('sendTokenTo');
        let data_arr = $(this).closest('tr').find('input').serializeArray();
        let data = {};
        data_arr.forEach((el) => {
            data[el.name] = el.value;
        });
        // console.log(data_arr);
        // console.log(sendTo.value.length);
        if (sendTo.value.length > 0) {
            sendTo.classList.remove('error');
            ipcRenderer.send('transfer_token', data);
        } else {
            sendTo.classList.add('error');
            sendTo.focus();
        }
    });

    /*
     * WALLET/SETTINGS MENU
     */
    document.addEventListener('click', function (e) {
        let target = e.target;
        if (target.dataset.toggle === 'nav') {
            let nav = target.dataset.nav; // data-nav
            let name = target.dataset.name; // data-name
            let parent = target.parentNode; // родитель - li
            let parentList = parent.parentNode; // родитель - ul

            ipcRenderer.send(`change_${nav}_menu`, name);

            let sibling = parentList.firstChild; // первый элемент (li) в списке (ul)
            // Перебераем весь список элементов
            while (sibling) {
                // Удаляем все активные классы
                if (sibling.nodeType === 1)
                    sibling.classList.remove('active');
                // Добавляем активный класс для назатого пункта
                if (sibling.nodeType === 1 && target.parentNode === sibling )
                    sibling.classList.add('active');
                sibling = sibling.nextSibling;
            }
        }
    });
    let renderRight = (selector, content) => {
        let $this = document.querySelector(selector);
        $this.innerHTML = content;
    };
    ipcRenderer.on('change_wallet_menu', (event, obj) => {
        renderRight('.walletRight', obj);
        scrollbarInit('.walletLeft, .walletRight');

    });
    ipcRenderer.on('change_settings_menu', (event, obj) => {
        renderRight('.settings__right', obj);
        scrollbarInit('.settings__left, .settings__right');
    });
    /*
     * /WALLET/SETTINGS MENU
     */

    /*$(document).on('input', 'input[name=amount]', function (e) {
        const $this = $(this);
        $this.css('box-shadow', 'none');
        if($this.val() != '') {
            var regexp = /^[0-9\.]*$/;
            if (!regexp.test($this.val())) {
                e.preventDefault();
                $this.css('box-shadow', '0px 0px 16px 0px rgba(255, 59, 0, 0.6) inset');
                // alert("введите латинские символы");
                return false;
            }
        }
    });*/

    document.addEventListener('input', (e) => {
        let $this = e.target;
        if ( $this.getAttribute('name') === 'amount') {
            $this.style.boxShadow = 'none';

            if ( $this.value.length > 0 ) {
                let regexp = /^[0-9\.]*$/;
                if ( !regexp.test($this.value) ){
                    // $this.style.boxShadow = '0px 0px 16px 0px rgba(255, 59, 0, 0.6) inset';
                    $this.classList.add('error');
                    return false;
                } else {
                    $this.classList.remove('error');
                }
            }
        }
    });

    /* Вывод истории транзакций */
    ipcRenderer.on('load_tx_history', (event, obj) => {
        let history = document.querySelector('[data-name="tx_history_table"]');
        history.insertAdjacentHTML('beforeend', obj);
    });
    /* /Вывод истории транзакций */

    /* Поиск каналов и пользователей */
    document.addEventListener('input', (e) => {
        // let menu = 'menu_chats';
        let $this = e.target;
        if ($this.dataset.name === 'group_search') {
            let group = $this.value;
            let chatsList = document.querySelector('.chats__list');
            if (!group) {
                // console.log(`!group`);
                ipcRenderer.send('load_chats', 'group_chat');
            } else {
                // $('.chats ul').empty();
                while (chatsList.firstChild) {
                    chatsList.removeChild(chatsList.firstChild)
                }
            }

            if (group.length > 2) {
                // console.log(`length > 2`);
                ipcRenderer.send('find_groups', group);
            } else if (group.length === 0) {
                // $('.chats ul').empty();
                while (chatsList.firstChild) {
                    chatsList.removeChild(chatsList.firstChild)
                }
            }
        }
    });
    /* /Поиск каналов и пользователей */

    $(document).on('mousedown',function(event) {

        // Убираем css класс selected-html-element у абсолютно всех элементов на странице с помощью селектора "*":
        $('*').removeClass('selected-html-element');
        // Удаляем предыдущие вызванное контекстное меню:
        $('.context-menu').remove();

        // Проверяем нажата ли именно правая кнопка мыши:
        if (event.which === 3)  {

            // Получаем элемент на котором был совершен клик:
            var target = $(event.target);

            // Добавляем класс selected-html-element что бы наглядно показать на чем именно мы кликнули (исключительно для тестирования):
            target.addClass('selected-html-element');

            // Создаем меню:
            $('<div/>', {
                class: 'context-menu' // Присваиваем блоку наш css класс контекстного меню:
            })
                .css({
                    left: event.pageX+'px', // Задаем позицию меню на X
                    top: event.pageY+'px' // Задаем позицию меню по Y
                })
                .appendTo('body') // Присоединяем наше меню к body документа:
                .append( // Добавляем пункты меню:
                    $('<ul/>').append('<li><a href="#">Remove element</a></li>')
                        .append('<li><a href="#">Add element</a></li>')
                        .append('<li><a href="#">Element style</a></li>')
                        .append('<li><a href="#">Element props</a></li>')
                        .append('<li><a href="#">Open Inspector</a></li>')
                )
                .show('fast'); // Показываем меню с небольшим стандартным эффектом jQuery. Как раз очень хорошо подходит для меню
        }
    });

    /* Инициализация кастомного скролла */
    let scrollbarInit = (target = '.ss-container, .custom-scrollbar') => {
        let el = document.querySelectorAll(target);
        for (let i = 0; i<el.length; i++) {
            el[i].setAttribute('ss-container', true);
            SimpleScrollbar.initEl(el[i]);
            console.log(i + ' : ' + el[i]);
        }
    };
    /* /Инициализация кастомного скролла */
};
