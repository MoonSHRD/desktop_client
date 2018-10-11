"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const UserModel_1 = require("../../models/UserModel");
const Controller_1 = require("../Controller");
const MessageModel_1 = require("../../models/MessageModel");
const ChatModel_1 = require("../../models/ChatModel");
const FileModel_1 = require("../../models/FileModel");
class MessagesController extends Controller_1.Controller {
    load_join_chat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let q_chats = this.controller_register.get_controller_parameter('ChatsController', 'queried_chats');
            let chat = q_chats[chat_id];
            chat.type = this.group_chat_types.join_channel;
            this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
        });
    }
    get_chat_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('get_chat_messages');
            let chat = yield ChatModel_1.ChatModel.get_chat_with_events(chat_id);
            if (!chat)
                return this.load_join_chat(chat_id);
            switch (chat.type) {
                case this.chat_types.user:
                    yield chat.get_user_chat_meta();
                    break;
            }
            let html = this.render('main/messagingblock/qqq.pug', chat);
            this.send_data('reload_chat', html);
            yield this.render_chat_messages(chat_id);
        });
    }
    ;
    render_message(message, chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            message.mine = message.sender ? (self_info.id === message.sender.id) : false;
            message.sender_avatar = message.sender && (message.chat.type !== this.group_chat_types.channel || message.mine) ? message.sender.avatar : message.chat.avatar;
            let html = this.render('main/messagingblock/message.pug', message);
            const data = {
                id: message.chat.id,
                message: html,
            };
            this.send_data('received_message', data);
        });
    }
    render_chat_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let messages = yield MessageModel_1.MessageModel.get_chat_messages_with_sender_chat(chat_id);
            messages.forEach((message) => __awaiter(this, void 0, void 0, function* () {
                yield this.render_message(message, chat_id);
            }));
        });
    }
    send_message({ id, text, file }) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let chat = yield ChatModel_1.ChatModel.findOne(id);
            // let date = new Date();
            let message = new MessageModel_1.MessageModel();
            message.sender = self_info;
            message.text = text;
            message.time = this.dxmpp.take_time();
            message.chat = chat;
            yield message.save();
            let group;
            let file_send;
            if (file) {
                message.with_file = true;
                yield message.save();
                let preview = false;
                if ([
                    'image/jpeg',
                    'image/png',
                ].includes(file.type))
                    preview = true;
                file_send = { file: file.file, hash: yield this.ipfs.add_file(file), preview: preview, name: file.name };
                let file_info = new FileModel_1.FileModel();
                // file_info.sender = self_info.id;
                file_info.link = file_send.hash;
                file_info.chat_id = chat.id;
                file_info.message_id = message.id;
                file_info.filename = file.name;
                file_info.save();
                // console.log("Save file_info")
            }
            message.file = file_send;
            yield message.save();
            if (chat.type == this.group_chat_types.channel) {
                yield this.render_message(message, chat.id);
            }
            if (chat.type === this.chat_types.user) {
                yield this.render_message(message, id);
                chat.id = yield chat.get_user_chat_meta();
                group = false;
            }
            else if (Object.values(this.group_chat_types).includes(chat.type)) {
                group = true;
            }
            // this.dxmpp.send(chat, text, group);
            this.dxmpp.send(chat, text, group, file_send);
            // await this.render_message(message, id);
        });
    }
    ;
    message_delivered(message_d) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = yield MessageModel_1.MessageModel.findOne(message_d.userid);
            message.server_id = message_d.DBid;
            yield message.save();
        });
    }
    ;
    received_message(user, text, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let userModel = yield UserModel_1.UserModel.findOne(user.id);
            let chat = yield ChatModel_1.ChatModel.get_user_chat(self_info.id, user.id);
            let message = new MessageModel_1.MessageModel();
            message.text = text;
            message.sender = userModel;
            message.chat = chat;
            message.time = this.dxmpp.take_time();
            yield message.save();
            let ipfs_file;
            if (file) {
                message.with_file = true;
                yield message.save();
                let file_info = new FileModel_1.FileModel();
                // file_info.sender = self_info.id;
                file_info.link = file.hash;
                file_info.chat_id = chat.id;
                file_info.message_id = message.id;
                file_info.filename = file.name;
                file_info.save();
                ipfs_file = yield this.ipfs.get_file(file.hash);
                message.file = {
                    file: ipfs_file.file,
                    preview: file.preview,
                    type: file.type,
                    name: file.name,
                };
                console.log(ipfs_file);
            }
            yield this.render_message(message, chat.id);
        });
    }
    ;
    received_group_message(room_data, message, sender, stamp) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            if (sender.address == self_info.id)
                return;
            let userModel;
            if (sender)
                userModel = yield UserModel_1.UserModel.findOne(sender.address);
            if (stamp) {
                let time = stamp.split(" ")[1].split(":");
                stamp = `${time[0]}:${time[1]}`;
            }
            else {
                stamp = this.dxmpp.take_time();
            }
            let chat = yield ChatModel_1.ChatModel.findOne(room_data.id);
            let messageModel = new MessageModel_1.MessageModel();
            messageModel.text = message;
            messageModel.sender = userModel;
            messageModel.chat = chat;
            messageModel.time = stamp;
            yield messageModel.save();
            yield this.render_message(messageModel, chat.id);
        });
    }
}
module.exports = MessagesController;
//# sourceMappingURL=MessagesController.js.map