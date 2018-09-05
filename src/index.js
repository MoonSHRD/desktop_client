// const router = new Navigo(null, true, '#!');

const {ipcRenderer} = require('electron');
const {events,chat_types} = require('./env_vars.js');
const dict = require('./langs/lang');



window.onload = function () {



    $.html5Translate = function(dict, lang){

        $('[data-translate-key]').each(function(){
            $(this).html( dict[ lang ][ $(this).data('translateKey') ] );
        });

    };



    $(document).on('click','[data-id=menu_user_chats]',function () {
        const type = $(this).attr('data-id');
        ipcRenderer.send('change_state',type);
    });

    $(document).on('click','.menu a',function () {
        const $this=$(this);
        if ($this.attr('data-id')!=='menu_create_chat')
            $this.addClass('active_menu').siblings().removeClass('active_menu');
        const type = $this.attr('data-id');
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
        $.html5Translate(dict, 'en');
        setTimeout(()=>{
            console.log('click');
            console.log($('#0x0000000000000000000000000000000000000000').attr('data-domain'));
            $('#0x0000000000000000000000000000000000000000').trigger("click");
        },100);
    });

    // $(document).on('click', '#generate_mnemonic', function () {
    //     ipcRenderer.send('generate_mnemonic');
    // });
    //
    // $(document).on('click', '#submit_mnemonic', function () {
    //     const mnem = $('#input_mnemonic').val();
    //     //todo: validate >=12 words
    //     ipcRenderer.send('submit_mnemonic', mnem);
    // });
    //
    // ipcRenderer.on('generate_mnemonic', (event, arg) => {
    //     $('#input_mnemonic').val(arg);
    // });

    // function validate_mnemonic(mnem){
    //     if (!mnem) return false;
    //     const words_count=mnem.split(/\s+/).length;
    //     const err=mnem.substr(-1,1)===" ";
    //     return (words_count === 12 && !err);
    // }

    // $(document).on('submit', '#profile_form', function (e) {
    //     e.preventDefault();
    //     const $this = $(this);
    //     let obj = $(this).serializeArray();
    //     let prof = {};
    //     let err = {};
    //
    //     obj.forEach(function (elem) {
    //         $this.find(`[name=${elem.name}]`).removeClass('invalid');
    //         switch (elem.name) {
    //             case "mnemonic":
    //                 if (!validate_mnemonic(elem.value)) err[elem.name]=true;
    //                 break;
    //             case "firstname":
    //                 if (!elem.value) err[elem.name]=true;
    //                 break;
    //         }
    //         prof[elem.name] = elem.value;
    //     });
    //
    //     if (Object.keys(err).length !== 0){
    //         for (let el in err){
    //             $this.find(`[name=${el}]`).addClass('invalid');
    //         }
    //         console.log(err);
    //         return;
    //     }
    //
    //     const file = $(this).find('[name=avatar]').prop('files')[0];
    //     if (file) {
    //         let reader = new FileReader();
    //         reader.onloadend = function () {
    //             prof.avatar = reader.result;
    //             ipcRenderer.send('submit_profile', prof);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         ipcRenderer.send('submit_profile', prof);
    //     }
    // });

    // $(document).on('change', '[name=avatar]', function () {
    //     const file = this.files[0];
    //     if (file) {
    //         let reader = new FileReader();
    //         reader.onloadend = function () {
    //             // console.log(reader.result);
    //             $('#avatar_preview').attr('src', reader.result);
    //             $('#avatar_preview').show();
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // });

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


    $(document).on('click', '.send_message_btn', function () {
        let msg_input = $('.send_message_input');
        if (msg_input.val().trim() === ''){
            msg_input.val('');
            return;
        }
        let date = new Date();
        let active_dialog = $('.active_dialog');
        const obj = {
            id: active_dialog.attr('id'),
            domain: active_dialog.attr('data-domain'),
            text: msg_input.val().trim(),
            group: $('.active_dialog').attr('data-type')==='channel',
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
        console.log(obj)
        if ($('.active_dialog').attr('id') === obj.jid) {
            $('.messaging_history ul').append(obj.message);
        }
    });

    ipcRenderer.on('buddy', (event, obj) => {
        // console.log(obj);
        // console.log($(`[data-id=${obj.type}]`).hasClass('active_menu'));
        // console.log(obj);
        if (
            !$(`[data-id=${obj.type}]`).hasClass('active_menu') ||
            (obj.type === "menu_chats" && $('.searchInput').val())
        ){
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
    });

    ipcRenderer.on('get_chat_msgs', (event, obj) => {
        $('.messaging_history ul').prepend(obj);
    });

    ipcRenderer.on('join_channel_html', (event, obj) => {
        $('.send_message_block').html(obj);
    });

    $(document).on('click', '[data-name=join_channel]', function () {
        $(this).attr('disabled','disabled');
        let active_dialog = $('.active_dialog');
        // console.log({id:active_dialog.attr('id'),domain:active_dialog.attr('data-domain')});
        ipcRenderer.send('join_channel', {
            id:active_dialog.attr('id'),
            domain:active_dialog.attr('data-domain'),
            contract_address:active_dialog.attr('data-contract_address')
        });
        $('#style-11').empty();
        $(this).fadeOut();
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
                ipcRenderer.send('get_chat_msgs', {id:$this.attr('id'), full_name:$this.text()});
                console.log("1");

                break;
            case chat_types.channel:
                console.log("2");
                ipcRenderer.send('get_channel_msgs', {id:$this.attr('id')});
                break;
        }
    });


    //
    //
    // $(document).on('change', '.searchInput', function () {
    //     if ($('.active_menu').attr('data-id')!=='menu_chats') return;
    //     let group = $('input').val();
    //     if (!group){
    //         ipcRenderer.send('get_chats');
    //     }
    //     if (group.length > 2) {
    //         ipcRenderer.send('find_groups', group);
    //     }
    // });
    //
    // $(document).on('click', '.submit_searchInput', function () {
    //     if ($('.active_menu').attr('data-id')!=='menu_user_chats') return;
    //     // (data-id="menu_user_chats" class='active_menu')
    //     let text = $('.searchInput').val() + "@localhost";
    //     ipcRenderer.send("send_subscribe", text);
    //     console.log(text)
    // });

    ipcRenderer.on('get_my_vcard', (event, data) => {
        $('.modal-content').html(data);
        $('#AppModal').modal('toggle');

    });

    ipcRenderer.on('found_chats', (event, data) => {
        $('.chats ul').html(data);
    });

    ipcRenderer.on('load_chat', (event, data) => {
        $('.chats ul').append(data);
    });

    $(document).on("change", '.modal-content select[name=substype]', function () {
        // console.log($(this).find(":selected").val());
        if ($(this).find(":selected").val()==='unfree') {
            $("#token_row").show();
        } else {
            $("#token_row").hide();
        }
    });

    $(document).on('submit', '.modal-content', function (e) {
        e.preventDefault();
        // $('#popup_error').html("Can't connect to&nbsp;<a href='#'>node1.moonshrd.io</a>, please try again later.");
        // $('#popup_error').show();
        // return;
        const data=$(this).serializeArray();
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

    $(document).on('click', '.peer_name', function () {
        const $this=$(this);
        let data = $this.attr('href');
        ipcRenderer.send('show_popup', data.split('/'));
    });

    $(document).on('click', '.btn-primary.col-sm-12', function () {
        let text = $('.form-control');
        if (text.val().trim() === "") return;
        // console.log(`Suggest: ${text.val()}`);
        text.val('');
        const alert = $(".alert");
        alert.fadeIn(200).show();
        alert.delay(2000).fadeOut(200);
        return;
        let active_dialog = $('.active_dialog');
        // console.log({id:active_dialog.attr('id'),domain:active_dialog.attr('data-domain')});
        ipcRenderer.send('channel_suggestion', {
            id:active_dialog.attr('id'),
            domain:active_dialog.attr('data-domain'),
            contract_address:active_dialog.attr('data-contract_address'),
            text: text.val()
        });
        // $(".send").removeAttr("hidden");
    });

    ipcRenderer.on('suggestion_answer', (event, data) => {
        const alert = $(".alert");
        alert.text("Your suggest has been sent.");
        alert.fadeIn(200).show();
        alert.delay(2000).fadeOut(200);
    });

    ipcRenderer.on('user_joined_room', (event, data) => {
        const alert = $(".alert");
        alert.text(`user ${data.user.username} joined ${data.room_data.name} channel`);
        alert.fadeIn(200).show();
        alert.delay(2000).fadeOut(200);
    });

        $.notify("Success! Your suggest has been sent", {

            placement: {
                from: "bottom",
                align: "right"
            },
            animate: {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            z_index: 10031,
        });
};
