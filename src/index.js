// const router = new Navigo(null, true, '#!');

const {ipcRenderer} = require('electron');


window.onload = function () {
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

    ipcRenderer.on('generate_mnemonic',(event,arg)=>{
        $('#input_mnemonic').val(arg);
    });

    $(document).on('submit','#profile_form', function (e) {
        e.preventDefault();
        let obj=$(this).serializeArray();
        let prof = {};

        obj.forEach(function (elem) {
            prof[elem.name]=elem.value;
        });

        const file = $(this).find('[name=avatar]').prop('files')[0];
        if (file) {
            let reader = new FileReader();
            reader.onloadend = function () {
                prof.avatar = reader.result;
                ipcRenderer.send('submit_profile',prof);
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('change','[name=avatar]',function () {
        const file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onloadend = function () {
                // console.log(reader.result);
                $(document).find('#avatar_preview').attr('src',reader.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $(document).on('click', '.menuBtn', function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.dialogs').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);
    });

    $(document).on('click','.searchButton', function () {
        let text = $('.subscribeInput').val()+"@localhost";
        ipcRenderer.send("send_subscribe", text);
        console.log(text)
    });

    $(document).on('click','.send_message_btn', function () {
        let date = new Date();
        const obj = {
            to: $('.active_dialog').attr('id'),
            message: $('.send_message_input').val().trim(),
            group: false,
            time: `${date.getHours()}:${date.getMinutes()}`
        };
        // $('.messaging_history ul').append(`<li class="outMessage">time\n${obj.message}</li>`);
        $('.send_message_input').val('');
        // console.log(obj.message);

        ipcRenderer.send("send_message", obj)
    });

    ipcRenderer.on('add_out_msg', (event, obj) => {
        $('.messaging_history ul').append(obj);

    });


    ipcRenderer.on('received_message', (event,obj) => {
        // console.log(obj);
        // arg = {
        //     from:jid,
        //     message:
        //     group:false
        // }
        if ($('.active_dialog').attr('id') === obj.jid) {
            $('.messaging_history ul').append(obj.message);
        }
    });

    ipcRenderer.on('buddy', (event,obj) => {
        console.log(obj);
        $('.chats ul').append(obj);

    });

    $(document).on('click','.chats li',function () {
        $('.messaging_history ul').empty();
        // console.log($(this).attr('href'));
        $(this).addClass('active_dialog').siblings().removeClass('active_dialog');
        //router.navigate($(this).attr('href'))

    });

    $(document).on('keyup', '.search', function() {
        $('div.chats ul').empty();
        let group = $('input').val();
       ipcRenderer.send('find_groups', group);

    });

    $(document).on('click', '.aboutMe', function () {
        ipcRenderer.send('get_my_vcard');
    });

    ipcRenderer.on('get_my_vcard', (event, data) => {
        window.alert(`full name: ${data.full_name}\n
                      first name: ${data.firstname}\n
                      last name: ${data.lastname}\n
                      bio: ${data.bio}`);
    });
};
