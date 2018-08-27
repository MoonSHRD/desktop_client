// const db = require('electron-db');

class ChatUserModel {
    static send_msg (msg, adrs) {
        let obj = new Object();
        obj.msg = msg.trim();
        obj.adrs = adrs;

        if (obj.msg) {
            // console.log(`send message: "${obj.msg}"`);
            // console.log(`message successfully send to ${adrs}`);

            // db.createTable('user_messages', (succ, msg) => {
            //     console.log(`Table "user_messages" creation success: ${succ}, with message: ${msg}`);
            // });
            // db.insertTableContents('user_messages', obj, (succ, msg) => {
            //     // succ - boolean, tells if the call is successful
            //     console.log("Success: " + succ);
            //     console.log("Message: " + msg);
            // });
        }
        $('.send_message_input').val('');
    }
}

module.exports = ChatUserModel;