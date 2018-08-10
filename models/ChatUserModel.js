const db = require('electron-db');

class ChatUserModel {
    static send_msg (msg, adrs) {
        let obj = new Object();

        obj.msg = $('.send_message_input').val();
        obj.adrs = adrs;

        if (obj.msg.trim()) {
            console.log(`send message: ${msg}`);
            console.log(`message successfully send to ${adrs}`);
            db.insertTableContent('user_messages', obj, (succ, msg) => {
                // succ - boolean, tells if the call is successful
                console.log("Success: " + succ);
                console.log("Message: " + msg);
            });
        }
        $('.send_message_input').val('');
    }
}

module.exports = ChatUserModel;