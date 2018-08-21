// const UserController = require('./controllers/UserController');
const pug = require('pug');
const {ipcMain} = require('electron');
const {dxmpp, eth} = require('moonshard_core');
const Account = require('../controllers/AccountController');
const fs = require('fs');
const {events,chat_types} = require('./env_vars.js');

const PUG_OPTIONS = {
    cache: false,
};

const states = {
    auth: 'auth',
    offline: 'offline',
    online: 'online',
};

let acc_data = {
    jidhost: 'localhost',
    privKey: undefined,
    host: '192.168.1.60',
    port: 5222,
};

let vcard = {
    firstname: undefined,
    lastname: undefined,
    bio: undefined,
    avatar: undefined
};

let buddies = {};
let chats = {};
let msgs = {};

function get_adr_from_jid(from) {
    const arr = from.split('/');
    if (arr) {
        from=arr[0];
    }
    from=from.split("@");
    return from[0]
}

let app_status = states.auth;
fs.readFile('account.json', 'utf8', function (err, data) {
    if (err) return;
    let obj = JSON.parse(data);
    if (obj.account) {
        app_status = states.offline;
        acc_data.privKey = obj.account.privKey;
    }

    if (obj.vcard) {
        vcard = obj.vcard;
    }
});

function router(renderer) {
    switch (app_status) {
        case states.auth:
            if (Account.account_exists()) {
                app_status = states.offline
            } else {
                // let html = Account.get_auth_html();
                const html = pug.renderFile(__dirname + '/components/auth/auth.pug', PUG_OPTIONS);
                renderer.webContents.send('change_app_state', html);
            }
            break;
        default:
            // console.log(acc_data);
            dxmpp.connect(acc_data);
            break;
    }

    ipcMain.on('change_menu_state', (event, arg) => {
        let obj=vcard;
        obj.state=arg;
        let html = "";
        switch (arg) {
            case "menu_user_chats":
                for (let buddy in buddies) {
                    html += pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', buddies[buddy], PUG_OPTIONS);
                }
                obj.chats=html;
                break;
            case "menu_chats":
                for (let chat in chats) {
                    html += pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', chats[chat], PUG_OPTIONS);
                }
                obj.chats=html;
                break;
        }
        html = pug.renderFile(__dirname + '/components/main/file.pug', obj, PUG_OPTIONS);
        renderer.webContents.send('change_menu_state', html);
    });

    ipcMain.on('generate_mnemonic', () => {
        renderer.webContents.send('generate_mnemonic', eth.generate_mnemonic());
    });

    ipcMain.on('submit_mnemonic', (event, arg) => {
        acc_data.privKey = eth.generate_account(arg).privateKey;
        let html = Account.get_profuile_html();
        renderer.webContents.send('change_app_state', html);
        // Account.add_account()
    });

    ipcMain.on('submit_profile', (event, arg) => {
        const html = pug.renderFile(__dirname + '/components/loading/loading.pug');
        renderer.webContents.send('change_app_state', html);

        acc_data.privKey = eth.generate_account(arg.mnemonic).privateKey;
        delete arg.mnemonic;
        const file_data = JSON.stringify({account: acc_data, vcard: arg});

        fs.writeFile("account.json", file_data, function (err) {
            if (err) {
                console.log(err);
            }
        });

        vcard = arg;

        dxmpp.connect(acc_data);
        // console.log(arg);
        dxmpp.set_vcard(arg.firstname, arg.lastname, arg.bio, arg.avatar);
    });

    ipcMain.on('join_channel', (event, arg) => {
        // console.log(arg);
        const to = `${arg.id}@${arg.domain}`;
        dxmpp.join(to)
        // Account.add_account()
    });

    ipcMain.on('join_channel_html', (event, arg) => {
        const html = pug.renderFile(__dirname + '/components/main/messagingblock/qqq.pug', {
            type: chat_types.join_channel,
        }, PUG_OPTIONS);
        renderer.webContents.send('reload_chat', html)
        // Account.add_account()
    });

    dxmpp.on('online', function (data) {
        renderer.webContents.send('online', data);
        let html = pug.renderFile(__dirname + '/components/main/main.pug', vcard);
        renderer.webContents.send('change_app_state', html);
        const address = "fwafwafwafawfwafawfwafwafwafawf";
        const neo_data={
            address: address,
            avatar: `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4RCYRXhpZgAATU0AKgAAAAgABUdGAAMAAAABAAUAAEdJAAMAAAABAGMAAIdpAAQAAAABAAAIVpycAAEAAAAaAAAQduocAAcAAAgMAAAASgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6hwABwAACAwAAAhoAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtAC4AYwBFAHgAYQBtAHMALgBjAG8AbQAAAP/hCkZodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOlJhdGluZz41PC94bXA6UmF0aW5nPjwvcmRmOkRlc2NyaXB0aW9uPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6TWljcm9zb2Z0UGhvdG89Imh0dHA6Ly9ucy5taWNyb3NvZnQuY29tL3Bob3RvLzEuMC8iPjxNaWNyb3NvZnRQaG90bzpSYXRpbmc+OTk8L01pY3Jvc29mdFBob3RvOlJhdGluZz48L3JkZjpEZXNjcmlwdGlvbj48L3JkZjpSREY+PC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCACAAIADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4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`,
            full_name: 'Mr. Anderson',
            online: 'offline',
            type: chat_types.user,
        };
        html = pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', neo_data, PUG_OPTIONS);
        buddies[address]=neo_data;
        renderer.webContents.send('buddy', {address: address, html: html});
    });

    dxmpp.on('buddy', function (jid, state, statusText) {
        if (!buddies[jid]) {
            buddies[jid] = {};
        }

        if (state === 'online') {
            buddies[jid].online = 'online';
        } else {
            buddies[jid].online = 'offline';
        }
        dxmpp.get_vcard(jid);
    });

    // dxmpp.on('groupbuddy', function(id, groupBuddy, state, statusText) {
    //     console.log(id);
    //     console.log(groupBuddy);
    //     console.log(state);
    //     console.log(statusText);
    // });

    dxmpp.on('joined_room', function(room_data) {
        // console.log(role);
        // console.log(room_data);
        const obj = {
            address:room_data.id,
            avatar:room_data.avatar,
            full_name:room_data.name,
            type:room_data.channel==="1"?chat_types.channel:chat_types.group_chat,
            role:room_data.role,
        };
        chats[room_data.id]=obj;
        const html = pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', obj, PUG_OPTIONS);
        renderer.webContents.send('buddy', html);
        console.log(`joined ${room_data.name} as ${room_data.role}`);
    });

    ipcMain.on('send_subscribe', (event, arg) => {
        dxmpp.subscribe(arg);
    });

    ipcMain.on('get_buddies', () => {
        // console.log(buddies);
        let html = "";
        for (let buddy in buddies) {
            html += pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', buddies[buddy], PUG_OPTIONS);
        }
        renderer.webContents.send('found_chats', html)
    });

    ipcMain.on('get_chats', () => {
        // console.log(buddies);
        let html = "";
        for (let chat in chats) {
            html += pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', chats[chat], PUG_OPTIONS);
        }
        renderer.webContents.send('found_chats', html)
    });

    ipcMain.on('send_message', (event, arg) => {
        const jid = `${arg.address}@${arg.domain}`;
        dxmpp.send(jid, arg.message, arg.group);
        let html = pug.renderFile(__dirname + '/components/main/messagingblock/outMessage.pug', {
            message: arg.message, time: arg.time
        }, PUG_OPTIONS);
        renderer.webContents.send('add_out_msg', html)
    });

    ipcMain.on('get_channel_msgs', (event, arg) => {
        // console.log(arg);
        let html = "";
        if (msgs[arg.id]){
            msgs[arg.id].forEach(function (element) {
                html += pug.renderFile(__dirname + '/components/main/messagingblock/outMessage.pug', {
                    message: element,
                }, PUG_OPTIONS);
            });
        }
        html = pug.renderFile(__dirname + '/components/main/messagingblock/qqq.pug', {
            messages: html,
            type: chat_types.channel,
            role: chats[arg.id].role,
        }, PUG_OPTIONS);
        renderer.webContents.send('reload_chat', html)
    });

    ipcMain.on('get_chat_msgs', (event, arg) => {
        let html = "";
        if (msgs[arg.id]){
            msgs[arg.id].forEach(function (element) {
                html += pug.renderFile(__dirname + '/components/main/messagingblock/outMessage.pug', {
                    message: element,
                }, PUG_OPTIONS);
            });
        }
        html = pug.renderFile(__dirname + '/components/main/messagingblock/qqq.pug', {
            messages: html,
            type: chat_types.user,
        }, PUG_OPTIONS);
        renderer.webContents.send('reload_chat', html)
    });

    dxmpp.on('subscribe', function (from) {
        console.log("subscribe");
        dxmpp.acceptSubscription(from);
        dxmpp.subscribe(from);
    });

    dxmpp.on('chat', function (from, message) {
        const html = pug.renderFile(__dirname + '/components/main/messagingblock/inMessage.pug', {
            message: message,
        }, PUG_OPTIONS);

        console.log(message);

        from = get_adr_from_jid(from);

        const obj = {
            jid: from,
            message: html,
            group: false
        };

        if (!msgs[from]) {
            msgs[from] = [];
        }
        console.log(from);
        msgs[from].push(message);
        renderer.webContents.send('received_message', obj);
    });
    //
    // dxmpp.on('groupchat', function(room_data, message, sender, stamp) {
    //     console.log(`${sender} says ${message} in ${room_data.name} chat on ${stamp}`);
    // });
    //
    dxmpp.on('error', function (err) {
        console.log(err);
    });

    dxmpp.get_contacts();

    dxmpp.on("find_groups", function (result) {
        let html = "";
        // console.log(result);
        result.forEach(function (group) {
            const st = group.jid.split('@');
            group.id=st[0];
            group.domain=st[1];
            html += pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', {
                address: group.id,
                domain: group.domain,
                full_name: group.name,
                avatar: group.avatar,
                type: group.channel==='1'?chat_types.join_channel:chat_types.join_group_chat,
            }, PUG_OPTIONS);
        });
        if (html){
            renderer.webContents.send('found_chats', html)
        }
    });
    ipcMain.on('find_groups', (event, group_name) => {
        dxmpp.find_group(group_name);
    });

    dxmpp.on('received_vcard', function (data) {

        if (data.address === dxmpp.get_address()) {
            renderer.webContents.send('get_my_vcard', data);
        } else {
            const jid = `${data.address}@${data.domain}`;
            // buddies[jid].vcard = data;
            const obj = data;
            obj.online = buddies[jid].online;
            obj.type = chat_types.user;
            buddies[jid]=obj;
            const html = pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', obj, PUG_OPTIONS);
            renderer.webContents.send('buddy', {address: data.address, domain: data.domain, html: html});
        }

    });
    ipcMain.on('get_my_vcard', () => {
        dxmpp.get_vcard(dxmpp.get_address() + '@localhost')
    });
}

module.exports = router;
