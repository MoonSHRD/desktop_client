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
            let chat = yield ChatModel_1.ChatModel.findOne(chat_id);
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
    send_message({ id, text }) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let chat = yield ChatModel_1.ChatModel.findOne(id);
            let date = new Date();
            let message = new MessageModel_1.MessageModel();
            message.sender = self_info;
            message.text = text;
            message.time = `${date.getHours()}:${date.getMinutes()}`;
            message.chat = chat;
            yield message.save();
            let group;
            if (chat.type === this.chat_types.user) {
                yield this.render_message(message, id);
                chat.id = yield chat.get_user_chat_meta();
                group = false;
            }
            else if (Object.values(this.group_chat_types).includes(chat.type)) {
                group = true;
            }
            // this.dxmpp.send(chat, text, group);
            this.dxmpp.send(chat, text, group);
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
    received_message(user, text) {
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
            yield this.render_message(message, chat.id);
        });
    }
    ;
    received_group_message(room_data, message, sender, stamp) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            // if (self_info.id === sender) return;
            let userModel;
            if (sender)
                userModel = yield UserModel_1.UserModel.findOne(sender.address);
            let chat = yield ChatModel_1.ChatModel.findOne(room_data.id);
            let messageModel = new MessageModel_1.MessageModel();
            messageModel.text = message;
            messageModel.sender = userModel;
            messageModel.chat = chat;
            messageModel.time = stamp ? stamp : this.dxmpp.take_time();
            yield messageModel.save();
            yield this.render_message(messageModel, chat.id);
        });
    }
    ;
}
module.exports = MessagesController;
//# sourceMappingURL=MessagesController.js.map