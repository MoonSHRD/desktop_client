const router = new Navigo(null, true, '#!');
const UserController = require('./controllers/UserController');
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
    console.log(messages);

    messages.forEach(function (msg) {
        $('.messaging_history').append(pug.renderFile('src/components/messagingblock/inMessage.pug', {
            text: msg.text
        },PUG_OPTIONS));
    });
});

router.on('add_user/:id', function (params) {
    UserController.add_user(params.id);
});

// set the 404 route
// router.notFound((query) => {
//     $id('messaging_block').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>';
// });

router.resolve();
