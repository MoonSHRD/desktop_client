//const router = new Navigo(null, true, '#!');
const UserController = require('./controllers/UserController');
const AccountController = require('./controllers/AccountController');
const ChatUserController = require('./controllers/ChatUserController');
const ChatController = require('./controllers/ChatController');
const UserMessagesController = require('./controllers/UserMessagesController');
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
        $('.messaging_history').append(pug.renderFile('src/components/messagingblock/inMessage.pug', {
            text: msg.text
        },options));
    });
});

router.on('user_exit', function (){
   console.log('Try exit');
   AccountController.exit('0x1234567890987654321');
});

// set the 404 route
// router.notFound((query) => {
//     $id('messaging_block').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>';
// });

router.resolve();
