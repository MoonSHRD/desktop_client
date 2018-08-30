// const router = new Navigo(null, true, '#!');

const {ipcRenderer} = require('electron');
const {events,chat_types} = require('./env_vars.js');


window.onload = function () {



    $(document).on('click','[data-id=menu_user_chats]',function () {
        const type = $(this).attr('data-id');
        ipcRenderer.send('change_state',type);
    });

    $(document).on('click','.menu a',function () {
        const type = $(this).attr('data-id');
        if (type)
            ipcRenderer.send('change_menu_state',type);
    });


























    ipcRenderer.on('change_menu_state', (event, arg) => {
        $('#working_side').html(arg);
    });

    ipcRenderer.on('online', (event, arg) => {
        console.log(arg); // prints "ping"
        // alert(arg); // prints "ping"
    });

    ipcRenderer.on('change_app_state', (event, arg) => {
        // console.log('autyh');
        $('#view').html(arg);
    });

    $(document).on('click', '#generate_mnemonic', function () {
        ipcRenderer.send('generate_mnemonic');
    });

    $(document).on('click', '#submit_mnemonic', function () {
        const mnem = $('#input_mnemonic').val();
        //todo: validate >=12 words
        ipcRenderer.send('submit_mnemonic', mnem);
    });

    ipcRenderer.on('generate_mnemonic', (event, arg) => {
        $('#input_mnemonic').val(arg);
    });

    $(document).on('submit', '#profile_form', function (e) {
        e.preventDefault();
        let obj = $(this).serializeArray();
        let prof = {};

        obj.forEach(function (elem) {
            prof[elem.name] = elem.value;
        });
        prof.avatar = $("#avatar_preview").attr("src");
        console.log("Msg1", prof);
        ipcRenderer.send('submit_profile', prof);
    });

    $(document).on('change', '[name=avatar]', function () {
        const file = this.files[0];
        let fileType = file.type;
        if (file) {
            let reader = new FileReader();
             reader.onloadend = function () {
                var image = new Image();
                image.src = reader.result;
                image.onload = function() {
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

    $(document).on('click', '.submit_searchInput', function () {
        let text = $('.searchInput').val() + "@localhost";
        ipcRenderer.send("send_subscribe", text);
        console.log(text)
    });

    $(document).on('click', '.send_message_btn', function () {
        let date = new Date();
        let active_dialog = $('.active_dialog');
        let msg_input = $('.send_message_input');
        const obj = {
            address: active_dialog.attr('id'),
            domain: active_dialog.attr('data-domain'),
            message: msg_input.val().trim(),
            group: false,
            time: `${date.getHours()}:${date.getMinutes()}`
        };
        msg_input.val('');

        ipcRenderer.send("send_message", obj)
    });

    ipcRenderer.on('add_out_msg', (event, obj) => {
        $('.messaging_history ul').append(obj);

    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        $('.messaging_history ul').append(obj);
    });

    ipcRenderer.on('received_message', (event, obj) => {
        if ($('.active_dialog').attr('id') === obj.jid) {
            $('.messaging_history ul').append(obj.message);
        }
    });

    ipcRenderer.on('buddy', (event, obj) => {
        const chat_box = $('.chats ul');
        const user = chat_box.find('#' + obj.address);
        if (user.length) {
            user.replaceWith(obj.html)
        } else {
            chat_box.prepend(obj.html);
        }

    });

    ipcRenderer.on('reload_chat', (event, obj) => {
        $('#messaging_block').html(obj);
    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        $('.messaging_history ul').prepend(obj);
    });

    ipcRenderer.on('join_channel_html', (event, obj) => {
        $('.send_message_block').html(obj);
    });

    $(document).on('click', '[data-name=join_channel]', function () {
        let active_dialog = $('.active_dialog');
        ipcRenderer.send('join_channel', {id:active_dialog.attr('id'),domain:active_dialog.attr('data-domain')});
    });

    $(document).on('click', '.chats li', function () {
        const $this=$(this);
        $this.addClass('active_dialog').siblings().removeClass('active_dialog');
        $('.messaging_history ul').empty();
        switch ($this.attr('data-type')) {
            case chat_types.join_channel:
                ipcRenderer.send('join_channel_html', {id:$this.attr('id'),domain:$this.attr('domain')});
                console.log('pre join');
                break;
            case chat_types.user:
                ipcRenderer.send('get_chat_msgs',{id:$this.attr('id')});
                break;
            case chat_types.channel:
                ipcRenderer.send('get_channel_msgs', {id:$this.attr('id')});
                break;
        }
    });

    $(document).on('change', '.search', function () {
        let group = $('input').val();
        if (!group){
            ipcRenderer.send('get_chats');
        }
        if (group.length > 2) {
            ipcRenderer.send('find_groups', group);
        }
    });

    ipcRenderer.on('get_my_vcard', (event, data) => {
        $('.modal-content').html(data);
        $('#AppModal').modal('toggle');

    });

    ipcRenderer.on('found_chats', (event, data) => {
        $('.chats ul').html(data);
    });
};
