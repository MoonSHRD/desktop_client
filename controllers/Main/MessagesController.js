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
const Helpers_1 = require("../Helpers");
const Electron = require("electron");
var Notification = Electron.Notification;
var nativeImage = Electron.nativeImage;
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
            yield this.reading_messages(chat.id);
            switch (chat.type) {
                case this.chat_types.user:
                    yield chat.get_user_chat_meta();
                    break;
            }
            let html = this.render('main/messagingblock/qqq.pug', chat);
            yield chat.save();
            yield this.send_data('reload_chat', html);
            yield this.render_chat_messages(chat_id);
        });
    }
    ;
    render_message(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            message.mine = message.sender ? (self_info.id === message.sender.id) : false;
            message.fill_sender_data();
            for (let num in message.files) {
                if (Helpers_1.check_file_preview(message.files[num].type)) {
                    message.files[num].preview = true;
                    if (!(yield Helpers_1.read_file(message.files[num]))) {
                        message.files[num].file = (yield this.ipfs.get_file(message.files[num].hash)).file;
                        Helpers_1.save_file(message.files[num]);
                    }
                    // console.log(message.files[num]);
                }
                else {
                    if (Helpers_1.check_file_exist(message.files[num]))
                        message.files[num].downloaded = true;
                }
            }
            let date_time = yield Helpers_1.Helper.formate_date(new Date(message.time), { locale: "ru:", for: "dialog_date" });
            message.time = Helpers_1.Helper.formate_date(new Date(message.time), { locale: 'ru', for: 'message' });
            let html = this.render('main/messagingblock/message.pug', message);
            let html_date = this.render("main/messagingblock/dialog_date.pug", { time: date_time });
            if (message.mine)
                message.text = 'Вы: ' + message.text;
            const data = {
                id: message.chat.id,
                html: html,
                html_date: html_date,
                message: message,
                time: date_time,
                unread_messages: message.chat.unread_messages
            };
            yield this.send_data('received_message', data);
            if (message.notificate) {
                let notif = new Notification({
                    title: message.sender_name,
                    body: message.text,
                    icon: nativeImage.createFromBuffer(Helpers_1.b64img_to_buff(message.sender_avatar))
                });
                notif.show();
            }
        });
    }
    render_chat_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let messages = yield MessageModel_1.MessageModel.get_chat_messages_with_sender_chat_files(chat_id);
            let last_time;
            for (let num = messages.length - 1; num >= 0; --num) {
                if (last_time !== new Date(messages[num].time))
                    yield this.render_message(messages[num]);
            }
        });
    }
    download_file(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield FileModel_1.FileModel.findOne(file_id);
            if (!Helpers_1.read_file(file)) {
                file.file = (yield this.ipfs.get_file(file.hash)).file;
                Helpers_1.save_file(file);
            }
            this.send_data('file_downloaded', { id: file_id });
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
            message.time = Date.now();
            message.chat = chat;
            message.files = [];
            message.fresh = true;
            yield message.save();
            let group;
            let fileModel;
            if (file) {
                console.log("with file:", file);
                fileModel = new FileModel_1.FileModel();
                fileModel.preview = Helpers_1.check_file_preview(file.type);
                fileModel.hash = yield this.ipfs.add_file(file);
                fileModel.chat = chat;
                fileModel.message = message;
                fileModel.file = file.file;
                fileModel.name = file.name;
                fileModel.type = file.type;
                fileModel.path = (yield this.get_me(self_info.id)).downloads;
                yield fileModel.save();
                Helpers_1.save_file(fileModel);
                message.files = [fileModel];
            }
            // message.fileModel = file_send;
            // await message.save();
            if (chat.type == this.group_chat_types.channel) {
                yield this.render_message(message);
            }
            if (chat.type === this.chat_types.user) {
                yield this.render_message(message);
                chat.id = yield chat.get_user_chat_meta();
                group = false;
            }
            else if (Object.values(this.group_chat_types).includes(chat.type)) {
                group = true;
            }
            this.dxmpp.send(chat, text, group, message.files);
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
    received_message(user, text, stamp, files) {
        return __awaiter(this, void 0, void 0, function* () {
            stamp = Number(stamp);
            // console.log("Files:", files);
            let self_info = yield this.get_self_info();
            let userModel = yield UserModel_1.UserModel.findOne(user.id);
            let chat = yield ChatModel_1.ChatModel.get_user_chat(self_info.id, user.id);
            chat.unread_messages += 1;
            yield chat.save();
            let message = new MessageModel_1.MessageModel();
            message.text = text;
            message.sender = userModel;
            message.chat = chat;
            message.time = stamp;
            message.fresh = true;
            message.notificate = true;
            message.files = [];
            yield message.save();
            // let ipfs_file;
            if (files && files.length) {
                for (let num in files) {
                    let fileModel = new FileModel_1.FileModel();
                    // file_info.sender = self_info.id;
                    fileModel.hash = files[num].hash;
                    fileModel.chat = chat;
                    fileModel.message = message;
                    fileModel.name = files[num].name;
                    fileModel.type = files[num].type;
                    fileModel.preview = Helpers_1.check_file_preview(files[num].type);
                    fileModel.path = (yield this.get_me(self_info.id)).downloads;
                    if (fileModel.preview) {
                        fileModel.file = (yield this.ipfs.get_file(fileModel.hash)).file;
                    }
                    fileModel.path = self_info.id;
                    yield fileModel.save();
                    message.files.push(fileModel);
                }
            }
            yield this.render_message(message);
        });
    }
    ;
    received_group_message({ room_data, message, sender, files, stamp, fresh = true, notificate = true }) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('Files: ',files);
            // console.log('Stamp: ',stamp);
            stamp = Number(stamp);
            let self_info = yield this.get_self_info();
            if (sender.address == self_info.id)
                return;
            let userModel;
            if (sender)
                userModel = yield UserModel_1.UserModel.findOne(sender.address);
            let chat = yield ChatModel_1.ChatModel.findOne(room_data.id);
            chat.unread_messages += 1;
            yield chat.save();
            let messageModel = new MessageModel_1.MessageModel();
            messageModel.text = message;
            messageModel.sender = userModel;
            messageModel.chat = chat;
            messageModel.time = stamp;
            messageModel.files = [];
            messageModel.fresh = fresh;
            messageModel.notificate = notificate;
            yield messageModel.save();
            if (files) {
                for (let num in files) {
                    yield messageModel.save();
                    let fileModel = new FileModel_1.FileModel();
                    // file_info.sender = self_info.id;
                    fileModel.hash = files[num].hash;
                    fileModel.chat = chat;
                    fileModel.message = messageModel;
                    fileModel.name = files[num].name;
                    fileModel.type = files[num].type;
                    fileModel.preview = Helpers_1.check_file_preview(files[num].type);
                    if (fileModel.preview) {
                        fileModel.file = (yield this.ipfs.get_file(fileModel.hash)).file;
                    }
                    fileModel.path = (yield this.get_me(self_info.id)).downloads;
                    yield fileModel.save();
                    messageModel.files.push(fileModel);
                }
            }
            yield this.render_message(messageModel);
        });
    }
    reading_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield ChatModel_1.ChatModel.get_chat_with_events(chat_id);
            chat.unread_messages = 0;
            yield chat.save();
        });
    }
}
module.exports = MessagesController;
//# sourceMappingURL=MessagesController.js.map