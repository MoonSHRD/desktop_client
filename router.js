router = new Navigo(null, true, '#!');


// set the default route
router.on(() => {
    $id('view').innerHTML = loadHTML('./index.pug', 'view');
});

// set the 404 route
router.notFound((query) => {
    $id('messaging_block').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>';
});

router.resolve();
