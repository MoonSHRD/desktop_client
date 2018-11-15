const {ipcRenderer} = require('electron');
const dict = require('./langs/lang');
const slick = require('slick-carousel');
const {dialog} = require('electron').remote;
const fs = require('fs');
require('waypoints/lib/noframework.waypoints.min');
require('waypoints/lib/shortcuts/sticky.min');

let p = null;
let d = null;
let r = null;
let curr_width = null;
let unlock = false;

function validate_totalSupply(val) {
    let regexp = /^[0-9\.]*$/;
    if (regexp.test(val)){
        console.log(val);
        return (val);
    }
}

function validate_subscriptionPrice(val) {
    let regexp = /^[0-9\.]*$/;
    if (regexp.test(val)){
        console.log(val);
        return (val);
    }
}

function validate_tokenPrice(val) {
    let regexp = /^[0-9]*\.?[0-9]*$/;
    if (regexp.test(val)){
        console.log(val);
        return (val);
    }
}



window.onload = function () {

    $.html5Translate = function(dict, lang){

        $('[data-translate-key]').each(function(){
            $(this).html( dict[ lang ][ $(this).data('translateKey') ] );
        });

    };

    $(document).on('click','.copyButton',function () {
        // if (document.selection) {
        //     var range = document.body.createTextRange();
        //     range.moveToElementText(document.getElementById('copyTo'));
        //     range.select().createTextRange();
        //     document.execCommand("Copy");
        //
        // } else if (window.getSelection) {
        //     var range = document.createRange();
        //     range.selectNode(document.getElementById('copyTo'));
        //     window.getSelection().addRange(range);
        //     document.execCommand("Copy");
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
        // }
    });

    $(document).on('click','.attachFileToChat',function () {
        $('input[id=\'attachFileToChat\']').trigger('click');
    });

    $(document).on('click','.attachFileToGroup',function () {
        $('input[id=\'attachFileToGroup\']').trigger('click');
    });


    $(document).on('change','input[id="attachFileToChat"], input[id="attachFileToGroup"]',function () {
        console.log('Selected files', this.files);
    });


    $(document).on('click', '[data-id=menu_user_chats]', function () {
        const type = $(this).attr('data-id');
        ipcRenderer.send('change_state', type);
    });


    $(document).on('change', 'input[id="attachFileToChat"], input[id="attachFileToGroup"]', function () {
        readURL(this);
    });


    function readURL(input) {

        let imgFileMsg = $('#upload_file');

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                imgFileMsg
                    .addClass('added')
                    .attr('src', e.target.result)
                    .css('cursor', 'pointer');
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $(document).on('click', '#upload_file', function () {
        let imgFileMsg = $(this);

        imgFileMsg
            .removeClass('added')
            .attr('src', '')
            .css('cursor', 'default');
        $('input[id="attachFileToChat"], input[id="attachFileToGroup"]').prop('value', null);
    });

    $(document).on('click', '.menu a', function () {
        const $this = $(this);
        const type = $this.data('id');

        if (!$this.hasClass('active_menu') && type) {
            console.log($this.hasClass('active_menu'), type);

            ipcRenderer.send('change_menu_state', type);
        }

        if (
            (type !== 'menu_create_chat')
            &&
            !$this.hasClass('not_active')
        ) {
            $this
                .addClass('active_menu')
                .parent()
                .siblings('li')
                .children()
                .removeClass('active_menu');
        }
    });

    $(document).on('click','[data-id=menu_create_chat]',function (e) {
        ipcRenderer.send('change_menu_state', 'menu_create_chat');
    });

    ipcRenderer.on('change_menu_state', (event, arg) => {
        $('#working_side').html(arg);
    });

    ipcRenderer.on('online', (event, arg) => {
        console.log(arg);
    });

    let widthMsgWindow = (target) => {
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
        console.log('autyh');
        $('#view').html(obj.arg);
        $.html5Translate(dict, obj.language);
        widthMsgWindow('[data-msgs-window]');
    });

    window.addEventListener('resize', function(e){
        widthMsgWindow('[data-msgs-window]');
        e.preventDefault();
    });

    $(document).on('change', '[name=avatar]', function () {
        const file = this.files[0];
        let fileType = file.type;
        if (file) {
            let reader = new FileReader();
            reader.onloadend = function () {
                // var image = new Image();
                // image.src = reader.result;
                $('#avatar_preview').attr('src', reader.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('click', '.menuBtn', function () {
        $('.dialogs').toggleClass('resize1', 400);
        $('.icon-bar').toggleClass('resize', 400);
    });

    $(document).on('click', 'a.infopanel', function () {
        ipcRenderer.send('get_my_vcard');
    });


    $(document).on('keydown', '[data-msg="data-msg"]', function () {
        if (event.ctrlKey && event.keyCode === 13) {
            send_message();
        }
    });

    $(document).on('keyup', '[data-msg="data-msg"]', function () {
        if (event.ctrlKey && event.keyCode === 13 ) {
            $(this).attr('rows', 1);
        }
    });

    $(document).on('keydown',".send_message__input",function(e) {
        if($(this).val() === '') {
            $(this).attr('rows', 1);
        };
        if($(this).val() === '' && event.keyCode == 13) {
            event.preventDefault();
        };

        if ( event.keyCode === 13 && $(this).val()!=='') {
            ResizeTextArea(this,0);
        }
    });

    $(document).on('input',".send_message__input",function(e) {
        // console.log('hello!')
        if($(this).val() === '') {
            $(this).attr('rows', 1);
        }

    });

    $(document).on('paste',".send_message__input",function(e) {
        // console.log('paste!');
        var text = $(this).outerHeight();   //помещаем в var text содержимое текстареи
        let val = $(this).text();
        if($(this).val() !==''){
            $(this).attr('rows', $(this).attr('rows'));
        } else {
            ResizeTextArea(this,1);
        }
        console.log(text);

    });


    $(document).on('click', '[data-toggle="send-msg"]', function () {
        $('[data-msg="data-msg"]').focus();
        send_message();
    });

    function send_message(){
        let msg_input = $('.send_message__input');
        msg_input.attr('rows', 1);
        if (msg_input.val().trim() === '') {

            msg_input.val('');
            return;
        }
        let active_dialog = $('.active_dialog');
        let obj = {
            user: {
                id: active_dialog.attr('id'),
                domain: active_dialog.attr('data-domain'),
            },
            text: msg_input.val().trim(),
            group: $('.active_dialog').attr('data-type') === 'channel',
        };

        obj = {id: active_dialog.attr('id'), text: msg_input.val().trim()};
        // console.log(obj);
        let files = $('#attachFileToChat').prop('files');
        if (files && files[0]) {
            msg_input.attr('rows', 1);

            let file = files[0];
            console.log(file);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                obj.file = {file: reader.result, type: file.type, name: file.name};
                // console.log(obj);
                ipcRenderer.send('send_message', obj);
            };
        } else {
            ipcRenderer.send('send_message', obj);
        }
        // console.log(file);
        msg_input.val('');
        $('input[id="attachFileToChat"], input[id="attachFileToGroup"]').prop('value', null);
        $('#upload_file')
            .attr('src', '')
            .css('cursor', 'default')
            .removeClass('added');
    }

    ipcRenderer.on('add_out_msg', (event, obj) => {
        $('[data-msg-list]').append(obj);
    });

    let scrollDown = (target) => {
        let targetBlock = document.querySelector(target);
        targetBlock.scrollTop = targetBlock.scrollHeight;
    };

    let scrollDownAnimate = (target = '[data-msg-history]', list = '[data-msg-list]') => {
        const targetBlock = $(target);
        let targetHeight = $(list).outerHeight();
        targetBlock.animate({
            scrollTop: targetHeight
        }, 600);
    };

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        $('[data-msg-list]').append(obj);
        // scrollDown('[data-msg-history]');
    });

    ipcRenderer.on('received_message', (event, obj) => {
        let chat = $('#'+obj.id);

        if (obj.message.fresh) {
            if (chat) {
                chat.find('[data-name=chat_last_time]').text(obj.message.time);
                chat.find('[data-name=chat_last_text]').text(obj.message.text);
                console.log(obj);

                chat.find('[data-name=unread_message]').text(obj.message.unread_messages);
                chat.find('[data-name=unread_messages]').show();
            }
            chat.prependTo($('.chats ul')[0]);
            console.log('1');
        }
        if ($('.active_dialog').attr('id') === obj.id) {
            chat.find('[data-name=unread_messages]').hide();
            ipcRenderer.send('reading_messages', obj.id);

            let p_count = ($("p:contains(" + obj.time + ")"));

            if (p_count.length === 0) {
                $('[data-msg-list]').append(obj.html_date);
            }

            $('[data-msg-list]').append(obj.html);
            scrollDown('[data-msg-history]');
        } else {
            chat.find('[data-name=unread_messages]').text(obj.unread_messages);
        }
        // ipcRenderer.send('load_chat s', 'menu_chats');
    });

    ipcRenderer.on('buddy', (event, obj) => {
        // if (
        //     !$(`[data-id=${obj.type}]`).hasClass('active_menu') ||
        //     (obj.type === "menu_chats" && $('.searchInput').val())
        // ) {
        //     return;
        // }
        const chat_box = $('.chats ul');
        const user = chat_box.find('#' + obj.id);
        if (user.length) {
            user.replaceWith(obj.html);
        } else {
            chat_box.prepend(obj.html);
        }

    });

    ipcRenderer.on('reload_chat', (event, obj) => {
        $('#messaging_block').html(obj);
        $('[data-msg]').focus();
    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        $('[data-msg-list]').prepend(obj);
    });

    ipcRenderer.on('join_channel_html', (event, obj) => {
        $('.send_message_block').html(obj);
    });

    $(document).on('click', '[data-name=join_channel]', function () {
        $(this).attr('disabled', 'disabled');
        let active_dialog = $('.active_dialog');
        ipcRenderer.send('join_channel', {
            id: active_dialog.attr('id'),
            domain: active_dialog.attr('data-domain'),
            contract_address: active_dialog.attr('data-contract_address')
        });
    });

    function click_anim(e){
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
    }


    $(document).on('click', '.chats li', function (e) {
        console.log('chat_clicked');
        const $this = $(this);

        $this.siblings().removeClass('have_history');
        $this.addClass('active_dialog').siblings().removeClass('active_dialog');
        let chat = {
            id : $this.attr('id'),
            type : $this.data('type')
        };

        $this.find('[data-name="unread_messages"]').hide();
        $this.find('[data-name="unread_messages"]').text('0');

        if ( !(
            $this.hasClass('active_dialog')
            &&
            $this.hasClass('have_history')
        ) ) {
            ipcRenderer.send('get_chat_msgs', chat);
            $this.addClass('have_history');
        }
    });

    $(document).on('click', '.walletMenu li', function (e) {
        const $this = $(this);
        $this.addClass('active_wallet').siblings().removeClass('active_wallet');
    });

    $(document).on('click', '.settingsMenu li', function (e) {

        const $this = $(this);
        $this.addClass('active_settings').siblings().removeClass('active_settings');
    });

    ipcRenderer.on('get_my_vcard', (event, data) => {
        $('.modal-content').html(data);
        $('#AppModal').modal('toggle');

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

    function validationInputs(target = '[data-require]'){
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
    };

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

    // $(document).on('keyup', '[data-require="true"]', function (){
    //     validationInputs(this);
    // });

    $(document).on('submit', '.modal-content', function (e) {
        let button = $(this).find(".btn-primary");
        button.attr("disabled", "disabled");
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
            button.removeAttr("disabled");
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
        console.log(data)
        if(data) {
            setTimeout(() => {
                if (data) $('#update_button').fadeIn().addClass('update_animate')

                update_notify( 'New Version !', 'A new version of the Moonshard is available')



            }, 1000)
        }
    });

    ipcRenderer.on('get_updates', (event, obj) => {

        console.log(typeof(obj))
        if(obj == 100){

            update_notify( 'Install updates', 'Now you can install updates')

            $('#update_button').fadeIn();
            $('[data-name=download_updates]').attr('data-name','install_updates')
            setTimeout(()=>{
                $('#download_img').fadeOut()

                setTimeout(()=>{
                    $('#update_img').fadeIn()
                },500)
            },500)

        }
        $('#download_updates').css('width', obj+'%')
    });

    $(document).on('click', '[data-name=download_updates]', function (e) {
        $('#update_button').fadeOut();
        update_notify('Download updates', 'Updates will download in the background')

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
            if(change > 369 && change < 599) {

                p.css('width', change);
                d.css('margin-left', change);
            }
        }
    });

    $(document).on('mousedown','#resize01',function(e) {
        // console.log('resize_clicked');
        unlock = true;
        $(document).on('mouseup', function(e) {
            ipcRenderer.send("change_chats_size", p.width());
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
            if ( last == -1 ) break;
        }
        var soft_lines = Math.ceil(strtocount.length / (cols-1));
        var hard = eval('hard_lines ' + unescape('%3e') + 'soft_lines;');
        if ( hard ) soft_lines = hard_lines;
        return soft_lines;
    }

// функция вызывается при каждом нажатии клавиши в области ввода текста
    function ResizeTextArea(the_form, min_rows) {
        the_form.rows = Math.max(min_rows, countLines(the_form.value,the_form.cols) );
    }

    $(document).on('click', '[data-toggle="switcher"]', function(e) {
        let $this = $(this);
        let $thisPosition = $this.data('switcher');
        let $thisSwitcherToggle = $this.data('switcher-toggle');
        let target = $this.data('target');
        let $parent = $this.closest('.control-switcher');

        $(target).attr('class', 'custom-control-switcher custom-control-switcher_' + $thisPosition);
    });

    $('[data-toggle="collapse"]').collapse('toggle');

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
            if ( $('.dialogDate').length ) {
                $('.dialogDate').addClass('slicky');
            }
            /* /Скролл даты */
        }

    }, true);

    $(document).on('click', '[name=change_download]', function (e) {
        dialog.showOpenDialog({
            properties: ['openDirectory','openFile']
        },function (directory) {
            ipcRenderer.send('change_directory', directory + '/');
        });
    });

    $(document).on('click', '[data-toggle="scrollDown"]', function (e){
        e.preventDefault();
        scrollDownAnimate();
    });


    $(document).on('click', '.switch-btn', function () {
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
    });

    $(window).resize(function(){
        if ($("#main-menu").length !== 0) {
            ipcRenderer.send("change_size_window", $(window).width(), $(window).height());
        }
    });

    $(document).on('click', '[name=encrypt_database]', function (e) {
        ipcRenderer.send("encrypt_db");
    });

    $(document).on('click', '[name=decrypt_database]', function (e) {
        ipcRenderer.send("decrypt_db");
    });

    $(document).on('click', '.sendTokenButton', function (e) {
        // let data_arr=$(this).closest('form');
        // console.log(data_arr);
        // return;
        let data_arr = $(this).closest('tr').find('input').serializeArray();
        let data = {};
        data_arr.forEach((el) => {
            data[el.name] = el.value;
        });
        // console.log(data_arr);
        // console.log(data);
        ipcRenderer.send('transfer_token', data);
    });

    // $(document).on('click', "button[data-block=\"data-block\"]", function (e) {
    //     console.log("Click!");
    //     $(this).attr("disabled", true);
    // });
};
