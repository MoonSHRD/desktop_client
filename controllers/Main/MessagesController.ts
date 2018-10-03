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

    private async render_message(message: MessageModel, chat_id: string) {
        let self_info = await this.get_self_info();
        message.mine = message.sender ? (self_info.id === message.sender.id) : false;
        message.sender_avatar = message.sender && (message.chat.type !== this.group_chat_types.channel || message.mine) ? message.sender.avatar : message.chat.avatar;
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
            await this.render_message(message, chat_id);
        });
    }

    async send_message({id, text, file}) {
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

        let file_send;
        if (file) {
            let preview = false;
            if ([
                'image/jpeg',
                'image/png',
            ].includes(file.type))
                preview = true;
            file_send = {file: file.file, hash: await this.ipfs.add_file(file), preview: preview, name: file.name};
        }

        message.file = file_send;

        if (chat.type === this.chat_types.user) {
            await this.render_message(message, id);
            chat.id = await chat.get_user_chat_meta();
            group = false;
        } else if (Object.values(this.group_chat_types).includes(chat.type)) {
            group = true;
        }

        // this.dxmpp.send(chat, text, group);
        this.dxmpp.send(chat, text, group, file_send);
        // await this.render_message(message, id);
    };

    async message_delivered(message_d) {
        let message = await MessageModel.findOne(message_d.userid);
        message.server_id = message_d.DBid;
        await message.save();
    };

    async received_message(user, text, file) {
        let self_info = await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        let chat = await ChatModel.get_user_chat(self_info.id, user.id);
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = this.dxmpp.take_time();
        await message.save();

        let ipfs_file;
        if (file && file.preview) {
            ipfs_file = await this.ipfs.get_file(file.hash);
            message.file = {
                file: ipfs_file.content,
                type: file.type,
                name: file.name,
            };
            console.log(ipfs_file);
        }

        await this.render_message(message, chat.id);
    };

    async received_group_message(room_data, message, sender, stamp) {

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
        messageModel.time = stamp ? stamp : this.dxmpp.take_time();
        await messageModel.save();
        await this.render_message(messageModel, chat.id);
    };
}

module.exports = MessagesController;
