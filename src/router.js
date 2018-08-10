
const Navigo = require('navigo')
const router = new Navigo(null, true, '#!');
const UserController = require('../controllers/UserController');
const pug = require('pug');

function $id(id) {
    return document.getElementById(id);
}

// set the default route
// router.on(() => {
//     console.log(UserController.get_messages(421421));
//     pug.renderFile('index.pug', {});
//     // $id('view').innerHTML = loadHTML('./index.pug', 'view');
// });

router.on('user_messages/:id', function (params) {
    console.log('got route');
    const messages = UserController.get_messages(params.id);
    const options = {
        cache:true,
    };
    console.log(messages);

    messages.forEach(function (msg) {
        $('.messaging_history ul').append('<li>' + pug.renderFile(__dirname+'/components/messagingblock/inMessage.pug', {text: msg.text},options) + '</li>');
    });
});

router.on('men/', function () {
    function add() {
        var arrObjects = [];

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
        // console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
        $('.chats ul').empty();

        arrObjects.map(function (value, index) {

            $('.chats ul').append("<li><a id=" +value.jid+ " href='#/user_messages/" + value.jid + "' data-navigo><img src='./components/chatsblock/chats/img/mat_61911.jpg' width='40' height='40' /><span class='stateLabel'></span>" + value.name + "\n" + "<div class='label'></div></a></li>")

            $('.chats li a').click(function () {
                console.log($(this).attr('href'));
                $('.text').text($(this).attr('href'));
                router.navigate($(this).attr('href'))
            })
        })

    }

    setTimeout(add, 1000);

    $('.im_dialogs_col_wrap').empty()
    $('.im_dialogs_col_wrap').append(pug.renderFile(__dirname+'/components/chatsblock/chats/men.pug'))
    console.log('got route');


});

router.on('groups/', function () {
    $('.im_dialogs_col_wrap').empty()
    $('.im_dialogs_col_wrap').append(pug.renderFile(__dirname+'/components/chatsblock/chats/groups.pug'))
    console.log('got route');


});

router.on('settings/', function () {
    $('.im_dialogs_col_wrap').empty()
    $('.im_dialogs_col_wrap').append(pug.renderFile(__dirname+'/components/chatsblock/settigs/sittings.pug'))
    console.log('got route');


});



// set the 404 route
// router.notFound((query) => {
//     $id('messaging_block').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>';
// });

router.resolve();
