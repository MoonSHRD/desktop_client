const UserController = require('./controllers/UserController');
// const pug = require('pug');
const {ipcMain} = require('electron');
let {dxmpp,eth} = require('moonshard_core');

const PUG_OPTIONS = {
    cache:true,
};

function router(renderer) {

    renderer.webContents.on('did-finish-load', () => {
        renderer.webContents.send('ping', 'whoooooooh!')
    });

    ipcMain.on('msg', (event, arg) => {
        console.log(arg); // prints "ping"
        ipcMain.send('msg', 'echo: '+arg)
    });

    dxmpp.on('online',function (data) {
        renderer.webContents.send('online', data);
        console.log(data);
    });

    dxmpp.on('buddy', function(jid, state, statusText) {
        const html=pug.renderFile(__dirname+'/components/chatsblock/chats/imDialog.pug', {
            address: jid,
            img: __dirname+'/components/chatsblock/chats/img/mat_61911.jpg',
        },PUG_OPTIONS);
        renderer.webContents.send('buddy', html);
        // ipcMain.send('buddy', html);
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

    ipcMain.on('send_subscribe',(event, arg) => {
        dxmpp.subscribe(arg);
    });

    ipcMain.on('send_message',(event, arg) => {
        dxmpp.send(arg);
    });

    dxmpp.on('subscribe', function(from) {
        console.log(from);
        dxmpp.acceptSubscription(from);
        // dxmpp.send(from,"fuck you");
    });

    dxmpp.on('chat', function(from, message) {
        const html=pug.renderFile(__dirname+'/components/messagingblock/inMessage.pug', {
            text: message,
        },PUG_OPTIONS);
        renderer.webContents.send('received_message', html);
        console.log(`received msg: "${message}", from: "${from}"`);
    });

    dxmpp.on('groupchat', function(room_data, message, sender, stamp) {
        console.log(`${sender} says ${message} in ${room_data.name} chat on ${stamp}`);
    });

    dxmpp.on('error', function (err) {
        console.log(err);
    });

    const priv=eth.generate_priv_key();
    console.log(priv);

    const config={
        jidhost				: 'localhost',
        privKey				: priv,
        host				: 'localhost',
        port				: 5222,
        firstname		    : "Nikita",
        lastname		    : "Metelkin"
    };

    dxmpp.connect(config);
    dxmpp.get_contacts();
}

module.exports = router;
