const db = require('electron-db');

class ChatUserModel {
    static send_msg (msg, adrs) {
        console.log(`send message: ${msg}`);
        console.log(`message successfully send to ${adrs}`);
    }
}

module.exports = ChatUserModel;