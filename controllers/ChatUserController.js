//отвечает за пользователя, с которым сидишь в чате. Адрес юзера, и данные
const ChatUserModel = require('../models/ChatUserModel');

function ChatUserController () {
    this.send_message = (msg, adrs)=>{
        return ChatUserModel.send_msg(msg, adrs)
    };
}

module.exports = new ChatUserController();