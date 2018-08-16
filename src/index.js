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
        console.log(obj);
        obj.forEach(function (elem) {
            prof[elem.name]=elem.value;
        });
        ipcRenderer.send('submit_profile',prof);
        console.log(prof);
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
        const obj = {
            to: $('.active_dialog').attr('id'),
            message: $('.send_message_input').val(),
            group: false
        };
        $('.messaging_history ul').append('<li class="outMessage">send</li>');
        console.log(obj)

        ipcRenderer.send("send_message", obj)
    });

    ipcRenderer.on('received_message', (event,obj) => {
        console.log(obj);
        // arg = {
        //     from:jid,
        //     message:
        //     group:false
        // }
        if ($('.active_dialog').attr('id') === obj.jid) {
            $('.messaging_history ul').append(obj.message);
        }
    })

    ipcRenderer.on('buddy', (event,obj) => {
        console.log(obj);
        // arg = {
        //     jid:jid,
        //     status:
        //     state:false
        // }
        $('.chats ul').append(obj);

    });

    $(document).on('click','.chats li',function () {
        // console.log($(this).attr('href'));
        $(this).addClass('active_dialog').siblings().removeClass('active_dialog');
        //router.navigate($(this).attr('href'))

    });

    $(document).on('keyup', '.search', function() {
       let group = $('input').val();
       console.log(group);
       console.log('Start search');
       ipcRenderer.send('find_groups', group);

    });
};
