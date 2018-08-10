// const router = new Navigo(null, true, '#!');

const {ipcRenderer} = require('electron');


ipcRenderer.on('online', (event, arg) => {
    console.log(arg); // prints "ping"
    // alert(arg); // prints "ping"
});

// const pug = require('pug');
// const html=pug.renderFile(__dirname+'/components/chatsblock/chats/imDialog.pug', {
//     address: "fwafwafwafa",
// });

// console.log(html);


window.onload = function () {

    $('.menuBtn').click(function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.dialogs').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);
    });

    $('.searchButton').click(function () {
        let text = $('.subscribeInput').val()
        ipcRenderer.send("send_subscribe", text)
        console.log(text)
    });

    $('.send_message_btn').click(function () {
        const obj = {
            to: $('.active_dialog').attr('id'),
            message: $('.send_message_input').val(),
            group: false
        }
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
            $('.messaging_history').append(obj.message);
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

    // ipcRenderer.on('online', obj => {
    //     console.log(obj);
    // });


    function add() {
        let arrObjects = [];

        arrObjects[0] = {
            name: "Nikita Vonk",
            jid: "0x0feab3b11b087c9e6f1b861e265b78c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[1] = {
            name: "Sdfucker Wertuhan",
            jid: "0x1111b3b11b087c9e6f1b861e265b78c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[2] = {
            name: "Alex Dichovsky",
            jid: "0x0feab3b11b087c9e6f1b861e265b3478c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[3] = {
            name: "Glamurny Podonok",
            jid: "343434",
            state: Math.random() >= 0.5
        }
        arrObjects[4] = {
            name: "Nikita Vonk",
            jid: "0x0feab3b11b087c9e6f1b861e265b78c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[5] = {
            name: "Sdfucker Wertuhan",
            jid: "0x1111b3b11b087c9e6f1b861e265b78c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[6] = {
            name: "Alex Dichovsky",
            jid: "0x0feab3b11b087c9e6f1b861e265b3478c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[7] = {
            name: "Glamurny Podonok",
            jid: "343434",
            state: Math.random() >= 0.5
        }
        // console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
        $('.chats ul').empty();

        arrObjects.map(function (value, index) {

            $('.chats ul').append("<li id=" + value.jid + "><a href='#/user_messages/" + value.jid + "'><img src='./components/chatsblock/chats/img/mat_61911.jpg' width='40' height='40' /><span class='stateLabel'></span>" + value.name + "\n" + "</a></li>")

            // $('.chats li a').click(function () {
            //     console.log($(this).attr('href'));
            //     $('.text').text($(this).attr('href'));
            //     //router.navigate($(this).attr('href'))
            //
            // })
            $('.chats li').on('click', function () {
                $(this).addClass('active_dialog').siblings().removeClass('active_dialog');

            })
        })

    }

    setTimeout(add, 1000);
};
