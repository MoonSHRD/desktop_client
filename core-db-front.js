let {dxmpp} = require('moonshard_core');
const db = require('electron-db');

//let addr="0x0feab3b11b087c9e6f1b861e265b78c693aa100b";
let priv="0xe8662f419b434b3e17854f26eb37878fdcfd34adfa0c6c7990fa8e546efd1951";

dxmpp.on('online',function (data) {
    console.log(data);
});

dxmpp.on('buddy', function(jid, state, statusText) {

    console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
});

dxmpp.on('joined_room', function(role, room_data) {
    console.log(`joined ${room_data.name} as ${role}`);
    dxmpp.send(room_data.id+"@localhost", "fucka", true);
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
