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
    // console.log(params.id);
    // return UserController.get_messages(params.id);
    console.log(UserController.get_messages(params.id));
});

// set the 404 route
router.notFound((query) => {
    $id('messaging_block').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>';
});

router.resolve();
