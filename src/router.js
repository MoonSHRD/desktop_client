// const UserController = require('./controllers/UserController');
const pug = require('pug');
const {ipcMain} = require('electron');
const {dxmpp,eth} = require('moonshard_core');
const Account = require('../controllers/AccountController');
const fs = require('fs');

const PUG_OPTIONS = {
    cache:false,
};

const states={
    auth:'auth',
    offline:'offline',
    online:'online',
};

let acc_data={
    jidhost				: 'localhost',
    privKey				: '',
    host				: 'localhost',
    port				: 5222,
    firstname		    : "",
    lastname		    : "",
    avatar		        : ""
};

let app_status = states.auth;

fs.readFile('account.json', 'utf8', function (err, data) {
    if (err) return;
    const obj = JSON.parse(data);
    if (obj.privKey){
        app_status = states.offline;
        acc_data.privKey = obj.privKey;
    }
});

function router(renderer) {

    console.log(app_status);
    switch (app_status) {
        case states.auth:
            if (Account.account_exists()) {
                app_status=states.offline
            } else {
                let html = Account.get_auth_html();
                renderer.webContents.send('change_app_state', html);
            }
            break;
        default:
            dxmpp.connect(acc_data);
            break;
    }

    ipcMain.on('generate_mnemonic',() => {
        renderer.webContents.send('generate_mnemonic',eth.generate_mnemonic());
    });

    ipcMain.on('submit_mnemonic',(event,arg) => {
        const key = eth.generate_account(arg).privateKey;
        //todo: validate key
        acc_data.privKey=key;
        let html = Account.get_profuile_html();
        renderer.webContents.send('change_app_state', html);
        // Account.add_account()
    });

    ipcMain.on('submit_profile',(event,arg) => {
        const html=pug.renderFile(__dirname+'/components/loading/loading.pug');
        renderer.webContents.send('change_app_state', html);

        acc_data.firstname=arg.firstname;
        acc_data.lastname=arg.lastname;


        fs.writeFile("account.json", JSON.stringify({privKey:acc_data.privKey}), function(err) {
            if (err) {
                console.log(err);
            }
        });

        dxmpp.connect(acc_data);
    });

    //will be used later

    dxmpp.on('online',function (data) {
        renderer.webContents.send('online', data);
        const html = pug.renderFile(__dirname+'/components/main/main.pug');
        renderer.webContents.send('change_app_state', html);
        // console.log(data);
    });
    //
    dxmpp.on('buddy', function(jid, state, statusText) {
        console.log(`buddy online`);
        const html=pug.renderFile(__dirname+'/components/main/chatsblock/chats/imDialog.pug', {
            address: jid,
        },PUG_OPTIONS);
        renderer.webContents.send('buddy', html);
        // ipcMain.send('buddy', html);
        console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
    });
    //
    // dxmpp.on('groupbuddy', function(id, groupBuddy, state, statusText) {
    //     console.log(id);
    //     console.log(groupBuddy);
    //     console.log(state);
    //     console.log(statusText);
    // });
    //
    // dxmpp.on('joined_room', function(role, room_data) {
    //     console.log(`joined ${room_data.name} as ${role}`);
    //     dxmpp.send(room_data.id+"@localhost", "fucka", true);
    // });
    //
    ipcMain.on('send_subscribe',(event, arg) => {
        dxmpp.subscribe(arg);
    });
    //
    ipcMain.on('send_message',(event, arg) => {
        dxmpp.send(arg.to,arg.message,arg.group);
    });
    //
    dxmpp.on('subscribe', function(from) {
        console.log(from);
        const html=pug.renderFile(__dirname+'/components/main/chatsblock/chats/imDialog.pug', {
            address: from,
        },PUG_OPTIONS);
        renderer.webContents.send('buddy', html);
        dxmpp.acceptSubscription(from);
        // dxmpp.send(from,"fuck you");
    });
    //
    dxmpp.on('chat', function(from, message) {
        const html=pug.renderFile(__dirname+'/components/main/messagingblock/inMessage.pug', {
            text: message,
        },PUG_OPTIONS);
        const obj={
            jid:from,
            message:html,
            group:false
        };
        renderer.webContents.send('received_message', obj);
        console.log(`received msg: "${message}", from: "${from}"`);
    });
    //
    // dxmpp.on('groupchat', function(room_data, message, sender, stamp) {
    //     console.log(`${sender} says ${message} in ${room_data.name} chat on ${stamp}`);
    // });
    //
    dxmpp.on('error', function (err) {
        console.log(err);
    });
    //
    // const priv=eth.generate_priv_key();
    // console.log(priv);
    //
    // const config={
    //     jidhost				: 'localhost',
    //     privKey				: priv,
    //     host				: 'localhost',
    //     port				: 5222,
    //     firstname		    : "Nikita",
    //     lastname		    : "Metelkin"
    // };
    //
    dxmpp.get_contacts();
}

module.exports = router;
