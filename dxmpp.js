let {dxmpp,eth} = require('moonshard_core');
// const {net} = require('electron');
// const {ipcRenderer} = require('electron');

// ipcRenderer.send('asynchronous-message', 'ping');

let ipc=require('node-ipc');

ipc.config.id   = 'hello';
ipc.config.retry= 1500;

ipc.connectTo(
    'world',
    function(){
        ipc.of.world.on(
            'connect',
            function(){
                ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
                ipc.of.world.emit(
                    'message',  //any event or message type your server listens for
                    'hello'
                )
            }
        );
        ipc.of.world.on(
            'disconnect',
            function(){
                ipc.log('disconnected from world'.notice);
            }
        );
        ipc.of.world.on(
            'message',  //any event or message type your server listens for
            function(data){
                ipc.log('got a message from world : '.debug, data);
            }
        );
    }
);

// const request = net.request('/ow_hellow');
// console.log('ow_hellow');
// request.on('response', (response) => {
//     console.log(`STATUS: ${response.statusCode}`);
//     console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
//     response.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`)
//     });
//     response.on('end', () => {
//         console.log('No more data in response.')
//     })
// });
// request.end();

const PUG_OPTIONS = {
    cache:true,
};

let priv=eth.generate_priv_key();
console.log(priv);

dxmpp.on('online',function (data) {
    console.log(data);
});

dxmpp.on('buddy', function(jid, state, statusText) {
    // $('#users_chats_box').append(pug.renderFile('src/components/chatsblock/chats/imDialog.pug', {
    //     address: jid,
    //     img: '.src/components/chatsblock/chats/img/mat_61911.jpg',
    // },PUG_OPTIONS));
    console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
});

dxmpp.on('groupbuddy', function(id, groupBuddy, state, statusText) {
    console.log(id);
    console.log(groupBuddy);
    console.log(state);
    console.log(statusText);
});

dxmpp.on('joined_room', function(role, room_data) {
    console.log(`joined ${room_data.name} as ${role}`);
    dxmpp.send(room_data.id+"@localhost", "fucka", true);
});

$(document).on('click','#subscribe_user',function () {
    const address = $('#input_subscribe_user').val();
    console.log(`subscribe user ${address}`);
    dxmpp.subscribe(address);
});

dxmpp.on('subscribe', function(from) {
    console.log(from);
    dxmpp.acceptSubscription(from);
    dxmpp.send(from,"fuck you");
});

dxmpp.on('chat', function(from, message) {
    console.log(`received msg: "${message}", from: "${from}"`);
});

dxmpp.on('groupchat', function(room_data, message, sender, stamp) {
    console.log(`${sender} says ${message} in ${room_data.name} chat on ${stamp}`);
});

dxmpp.on('error', function (err) {
    console.log(err);
});

let config={
    jidhost				: 'localhost',
    privKey				: priv,
    host				: 'localhost',
    port				: 5222,
    firstname		    : "Nikita",
    lastname		    : "Metelkin"
};

dxmpp.connect(config);
dxmpp.get_contacts();

