// const router = new Navigo(null, true, '#!');

const {ipcRenderer} = require('electron');


ipcRenderer.on('online', (event, arg) => {
    console.log(arg); // prints "ping"
    // alert(arg); // prints "ping"
});


window.onload = function () {

    $('.menuBtn').click(function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.dialogs').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);
    });

    $('.searchButton').click(function () {
        let text = $('.subscribeInput').val()+"@localhost";
        ipcRenderer.send("send_subscribe", text)
        console.log(text)
    });

    $('.send_message_btn').click(function () {
        const obj = {
            to: $('.active_dialog').attr('id'),
            message: $('.send_message_input').val(),
            group: false
        }
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
};
