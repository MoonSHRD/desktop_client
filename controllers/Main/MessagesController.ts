import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {MessageModel} from "../../models/MessageModel";
import {ChatModel} from "../../models/ChatModel";
import {assertAnyTypeAnnotation} from "babel-types";

class MessagesController extends Controller {

    async load_join_chat(chat_id: string) {
        let q_chats = this.controller_register.get_controller_parameter('ChatsController', 'queried_chats');
        let chat = q_chats[chat_id];
        chat.type = this.group_chat_types.join_channel;
        this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
    }

    async get_chat_messages(chat_id: string) {
        console.log('get_chat_messages');
        let chat = await ChatModel.get_chat_with_events(chat_id);

        if (!chat)
            return this.load_join_chat(chat_id);

        switch (chat.type) {
            case this.chat_types.user:
                await chat.get_user_chat_meta();
                break;
        }
        let html = this.render('main/messagingblock/qqq.pug', chat);
        this.send_data('reload_chat', html);

        await this.render_chat_messages(chat_id);
    };

    private async render_message(message: MessageModel) {
        let self_info = await this.get_self_info();
        message.mine = message.sender?(self_info.id === message.sender.id):false;
        message.sender_avatar = message.sender && (message.chat.type!==this.group_chat_types.channel || message.mine)?message.sender.avatar:message.chat.avatar;
        let html = this.render('main/messagingblock/message.pug', message);
        const data = {
            id: message.chat.id,
            message: html,
        };
        this.send_data('received_message', data);
    }

    private async render_chat_messages(chat_id: string) {
        let messages = await MessageModel.get_chat_messages_with_sender_chat(chat_id);

        messages.forEach(async (message) => {
            await this.render_message(message);
        });
    }

    async send_message({id, text}) {
        let self_info = await this.get_self_info();
        let chat = await ChatModel.findOne(id);
        // let date = new Date();
        let message = new MessageModel();
        message.sender = self_info;
        message.text = text;
        message.time = this.dxmpp.take_time();
        message.chat = chat;
        await message.save();
        let group: boolean;


        if (chat.type === this.chat_types.user) {
<<<<<<< HEAD
            await this.render_message(message, id);
            chat.id = await chat.get_user_chat_meta();
=======
>>>>>>> 6ad9618919eb687b1e6de6cb5e581f3cff3ab5fa
            group = false;
        } else if (Object.values(this.group_chat_types).includes(chat.type)) {
            group = true;
        }

        // this.dxmpp.send(chat, text, group);
<<<<<<< HEAD
        this.dxmpp.send(chat, text, group);
        // await this.render_message(message, id);
=======
        this.dxmpp.send(chat, text, message.id, chat.type);
        await this.render_message(message);
>>>>>>> 6ad9618919eb687b1e6de6cb5e581f3cff3ab5fa
    };

    async message_delivered(message_d) {
        let message = await MessageModel.findOne(message_d.userid);
        message.server_id=message_d.DBid;
        await message.save();
    };

    async received_message(user, text, date) {
        let self_info = await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        let chat = await ChatModel.get_user_chat(self_info.id, user.id);
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = date.replace("T", " ").replace("Z", "");
        await message.save();
        await this.render_message(message);
    };

    async received_group_message(room_data, message, sender, date) {

        let self_info = await this.get_self_info();

        // if (self_info.id === sender) return;

        let userModel: UserModel;
        if (sender)
            userModel = await UserModel.findOne(sender.address);

        let chat = await ChatModel.findOne(room_data.id);
        let messageModel = new MessageModel();
        messageModel.text = message;
        messageModel.sender = userModel;
        messageModel.chat = chat;
        messageModel.time = date;
        await messageModel.save();
        await this.render_message(messageModel);
    };
}

module.exports = MessagesController;
