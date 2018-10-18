const {ipcRenderer} = require('electron');
const dict = require('./langs/lang');
const slick = require('slick-carousel');


window.onload = function () {

    $.html5Translate = function(dict, lang){

        $('[data-translate-key]').each(function(){
            $(this).html( dict[ lang ][ $(this).data('translateKey') ] );
        });

    };

    $(document).on('click','.copyButton',function () {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById('copyTo'));
            range.select().createTextRange();
            document.execCommand("Copy");

        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById('copyTo'));
            window.getSelection().addRange(range);
            document.execCommand("Copy");

            $.notify('address copied \n' + range, {

                placement: {
                    from: "bottom",
                    align: "right"
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
    })

    $(document).on('click','.attachFileToChat',function () {
        $("input[id='attachFileToChat']").trigger('click');
    })

    $(document).on('click','.attachFileToGroup',function () {
        $("input[id='attachFileToGroup']").trigger('click');
    })


    $(document).on('change','input[id="attachFileToChat"], input[id="attachFileToGroup"]',function () {
        console.log('Selected file: ' + this.value);
    })


    $(document).on('click', '[data-id=menu_user_chats]', function () {
        const type = $(this).attr('data-id');
        ipcRenderer.send('change_state', type);
    });


    $(document).on('change', 'input[id="attachFileToChat"], input[id="attachFileToGroup"]', function () {
        readURL(this);
    });


    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#upload_file').attr('src', e.target.result);
                $('#upload_file').css('cursor', 'pointer');

            }

            reader.readAsDataURL(input.files[0]);
        }
    }


    $(document).on('click', '#upload_file', function () {
        $('#upload_file').attr('src', '');
        $('#upload_file').css('cursor', 'default');
        $('input[id="attachFileToChat"], input[id="attachFileToGroup"]').prop('value', null);

    });

    $(document).on('click','.menu a',function () {
        const $this=$(this);
        if ($this.attr('data-id')!=='menu_create_chat' && !$this.hasClass('not_active'))
            $this.addClass('active_menu').siblings().removeClass('active_menu');
        const type = $this.attr('data-id');
        if (type)
            ipcRenderer.send('change_menu_state', type);
    });

    ipcRenderer.on('change_menu_state', (event, arg) => {
        $('#working_side').html(arg);
    });

    ipcRenderer.on('online', (event, arg) => {
        console.log(arg);
    });

    ipcRenderer.on('change_app_state', (event, arg) => {
        console.log('autyh');
        $('#view').html(arg);
        $.html5Translate(dict, 'en');
    });

    $(document).on('change', '[name=avatar]', function () {
        const file = this.files[0];
        let fileType = file.type;
        if (file) {
            let reader = new FileReader();
            reader.onloadend = function () {
                var image = new Image();
                image.src = reader.result;
                image.onload = function () {
                    var maxWidth = 100,
                        maxHeight = 100,
                        imageWidth = image.width,
                        imageHeight = image.height;

                    if (imageWidth > imageHeight) {
                        if (imageWidth > maxWidth) {
                            imageHeight *= maxWidth / imageWidth;
                            imageWidth = maxWidth;
                        }
                    }
                    else {
                        if (imageHeight > maxHeight) {
                            imageWidth *= maxHeight / imageHeight;
                            imageHeight = maxHeight;
                        }
                    }
                    var canvas = document.createElement('canvas');
                    canvas.width = imageWidth;
                    canvas.height = imageHeight;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, imageWidth, imageHeight);
                    // The resized file ready for upload
                    var finalFile = canvas.toDataURL(fileType);
                    $('#avatar_preview').attr('src', finalFile);
                    // console.log($("#avatar_preview").);
                    $('#avatar_preview').show();
                }
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


    $(document).on('keydown', '.send_message_input', function () {

        if (event.ctrlKey && event.keyCode === 13) {
            let msg_input = $('.send_message_input');
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
            let file = $('#attachFileToChat').prop('files')[0];
            if (file) {
                console.log(file);
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    obj.file = {file: reader.result, type: file.type, name: file.name};
                    // console.log(obj);
                    ipcRenderer.send("send_message", obj);
                };
            } else {
                ipcRenderer.send("send_message", obj);
            }
            // console.log(file);
            msg_input.val('');
            $('input[id="attachFileToChat"], input[id="attachFileToGroup"]').prop('value', null);
            $('#upload_file').attr('src', '');
            $('#upload_file').css('cursor', 'default');

        }

    });


    $(document).on('click', '.send_message_btn', function () {
        let msg_input = $('.send_message_input');
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
        obj.id = active_dialog.attr('id');
        obj.text = msg_input.val().trim();
        // console.log(obj);
        let file;
        console.log("obj", obj.group);
        if (obj.group) {
            file = $('#attachFileToGroup').prop('files');
            if (file.length === 0) {
                file = null
            } else {
                file = file[0]
            }
        } else {
            file = $('#attachFileToChat').prop('files')[0];
        }
        if (file) {
            console.log(file);
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                obj.file = {file: reader.result, type: file.type, name: file.name};
                ipcRenderer.send("send_message", obj);
            };
        } else {
            ipcRenderer.send("send_message", obj);
        }
        // console.log(file);
        msg_input.val('');
        $('input[id="attachFileToChat"], input[id="attachFileToGroup"]').prop('value', null);
        $('#upload_file').attr('src', '');
        $('#upload_file').css('cursor', 'default');

    });

    ipcRenderer.on('add_out_msg', (event, obj) => {
        $('.messaging_history ul').append(obj);

    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {

        $('.messaging_history ul').append(obj);
    });

    ipcRenderer.on('received_message', (event, obj) => {
        $('.messaging_history').scrollTop(($('.messaging_history')[0].scrollHeight) + 1);
        console.log(obj)
        if ($('.active_dialog').attr('id') === obj.id) {
            $('.messaging_history ul').append(obj.message);
        }
    });

    ipcRenderer.on('buddy', (event, obj) => {
        if (
            !$(`[data-id=${obj.type}]`).hasClass('active_menu') ||
            (obj.type === "menu_chats" && $('.searchInput').val())
        ) {
            return;
        }
        const chat_box = $('.chats ul');
        const user = chat_box.find('#' + obj.id);
        if (user.length) {
            user.replaceWith(obj.html)
        } else {
            chat_box.prepend(obj.html);
        }

    });

    ipcRenderer.on('reload_chat', (event, obj) => {
        $('#messaging_block').html(obj);
        $(".send_message_input").focus();
    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        $('.messaging_history ul').prepend(obj);
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
        $('#style-11').empty();
        $(this).fadeOut();
    });

    function click_anim(e){
        $(".ripple").remove();
        var posX = $(this).offset().left,
            posY = $(this).offset().top,
            buttonWidth = $(this).width(),
            buttonHeight =  $(this).height();
        $(this).children('a').prepend("<span class='ripple'></span>");
        if(buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }
        var x = e.pageX - posX - buttonWidth / 2;
        var y = e.pageY - posY - buttonHeight / 2;
        $(".ripple").css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");
    }


    $(document).on('click', '.chats li', function (e) {
        const $this = $(this);

        $this.siblings().removeClass('have_history');
        $this.addClass('active_dialog').siblings().removeClass('active_dialog');
        let chat = $this.attr('id');

        if(!($this.hasClass("active_dialog") && $this.hasClass("have_history"))) {

            ipcRenderer.send('get_chat_msgs', chat);
            $this.addClass('have_history')
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

    $(document).on("change", '.modal-content select[name=substype]', function () {
        if ($(this).find(":selected").val() === 'unfree') {
            $("#token_row").show();
        } else {
            $("#token_row").hide();
        }
    });

    $(document).on('submit', '.modal-content', function (e) {
        e.preventDefault();
        // return;
        const data = $(this).serializeArray();
        let obj = {};
        data.forEach(function (elem) {
            obj[elem.name] = elem.value;
        });

        switch (obj.substype) {
            case 'free':
                ipcRenderer.send('create_group', obj.name);
                $('#AppModal').modal('toggle');
                break;
            case 'unfree':
                break;
        }
    });

    $(document).on('click', '[data-event=show_chat_info]', function () {
        const active_dialog = $('.active_dialog');
        const id = active_dialog.attr('id');
        const type = active_dialog.attr('data-type');
        // let data = $this.attr('href');
        ipcRenderer.send('show_popup', {id, type});
    });

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
                from: "bottom",
                align: "right"
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
                from: "bottom",
                align: "right"
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

    ipcRenderer.on("get_notice", (event, obj) => {
        if ($('.active_dialog').attr('id') === obj.id) {
            $('.notifyBlock').append((obj.html));
        }
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
        $(this).children('ul').toggleClass('d-block')
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

    ipcRenderer.on("file_dowloaded", (event, obj) => {
        console.log(obj);
        let file=$(`[data-id=${obj.id}]`);
        if (file.hasClass('load'))
            file.removeClass('load');
    });

    ipcRenderer.on("wallet_token_table", (event, obj) => {
        console.log('token table');
        $('.loader').remove();
        $('.myTokens').append(obj);
    });

    ipcRenderer.on("get_contacts", (event, obj) => {
        $('#browsers').html(obj)

    });
};
