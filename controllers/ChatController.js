//Всё о чате
const ChatModel = require('../models/ChatModel');

function ChatController () {
    this.get_info = (name, list_users) =>{
        return ChatModel.get_info(name, list_users)
    };
}

module.exports = new ChatController;