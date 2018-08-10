const {ipcRenderer} = require('electron');

window.onload = function() {

    $('.menuBtn').click(function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.chats_block').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);


    });
};

ipcRenderer.on('ping', (event, arg) => {
    console.log(arg); // prints "ping"
    alert(arg); // prints "ping"
});
