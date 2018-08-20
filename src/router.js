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
    jidhost		: 'localhost',
    privKey		: '',
    host		: 'localhost',
    port		: 5222,
    // firstname	: "",
    // lastname	: "",
    // bio		    : "",
    // avatar		: ""
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
            console.log(acc_data);
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

        fs.writeFile("account.json", JSON.stringify(acc_data), function(err) {
            if (err) {
                console.log(err);
            }
        });

        dxmpp.connect(acc_data);
        console.log(arg);
        dxmpp.set_vcard(arg.firstname, arg.lastname, arg.bio, arg.avatar);
    });

    //will be used later

    dxmpp.on('online',function (data) {
        renderer.webContents.send('online', data);
        const html = pug.renderFile(__dirname+'/components/main/main.pug');
        renderer.webContents.send('change_app_state', html);



        const html1=pug.renderFile(__dirname+'/components/main/chatsblock/chats/imDialog.pug', {
            address: 'fwafwafwafawfwafawfwafwafwafawf',
            avatar: `data:image/png;base64,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`,
            full_name: 'Petux Ebany',
        },PUG_OPTIONS);
        renderer.webContents.send('buddy', html1);
        // console.log(data);
    });
    //
    dxmpp.on('buddy', function(jid, state, statusText) {
        // console.log(`buddy online`);
        const html=pug.renderFile(__dirname+'/components/main/chatsblock/chats/imDialog.pug', {
            address: jid,
        },PUG_OPTIONS);
        dxmpp.get_vcard(jid);
        // renderer.webContents.send('buddy', html);
        // ipcMain.send('buddy', html);
        // console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
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

    dxmpp.on("find_groups", function(result) {
        result.forEach(function (group) {
            const html = pug.renderFile(__dirname+'/components/main/chatsblock/chats/imDialog.pug', {
                address: group.name,
            },PUG_OPTIONS);
            renderer.webContents.send('buddy', html)
        });
    });
    ipcMain.on('find_groups', (event, group_name) => {
        dxmpp.find_group(group_name);
    });

    dxmpp.on('received_vcard', function (data) {
        // let a = window.confirm('Rly?');
        // window.alert(data)
        if (data.address===dxmpp.get_address()){
            renderer.webContents.send('get_my_vcard', data)
        } else {
            console.log(data);
            const html = pug.renderFile(__dirname+'/components/main/chatsblock/chats/imDialog.pug', data, PUG_OPTIONS);
            renderer.webContents.send('buddy', html)
        }

    });
    ipcMain.on('get_my_vcard', (event) => {
        dxmpp.get_vcard(dxmpp.get_address())
    })
}

module.exports = router;
