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
const Benchmark = require("benchmark");
const typeorm_1 = require("typeorm");
// import {Benchmark} from 'benchmark';
let benchmark = new Benchmark.Suite;
// import * as eNotify from 'electron-notify'
// let eNotify = require('electron-notify');
class MessagesController extends Controller_1.Controller {
    benchmarkIt() {
        return __awaiter(this, void 0, void 0, function* () {
            benchmark.add('message-one_by_one#test', {
                defer: true,
                fn: (deferred) => {
                    this.render_chat_messages('0x100feeb554dadbfe5d97763145807dbe0a5d0e34_0x7068895138bf0ac16a6cabb3c446ad41ff571da3')
                        .then(() => {
                        deferred.resolve();
                    });
                }
            }).add('message-all#test', {
                defer: true,
                fn: (deferred) => {
                    this.render_chat_messages_all('0x100feeb554dadbfe5d97763145807dbe0a5d0e34_0x7068895138bf0ac16a6cabb3c446ad41ff571da3')
                        .then(() => {
                        deferred.resolve();
                    });
                }
            }).on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                console.log(this[0].times);
                console.log(this[1].times);
            }).run({ 'async': true });
        });
    }
    load_join_chat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let q_chats = this.controller_register.get_controller_parameter('ChatsController', 'found_chats');
            let chat = q_chats.chats[chat_id];
            chat.type = this.group_chat_types.join_channel;
            this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
        });
    }
    load_founded_chat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let q_chats = this.controller_register.get_controller_parameter('ChatsController', 'found_chats');
            let chat = q_chats.users[chat_id];
            this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
        });
    }
    get_chat_messages({ id, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            // this.benchmarkIt();
            let set = yield this.getSettings();
            set.last_chat = id;
            yield set.save();
            let self_info = yield this.get_self_info();
            console.log('get_chat_messages', id, type);
            let chat = yield ChatModel_1.ChatModel.get_chat_with_events(id);
            switch (type) {
                case this.chat_types.user:
                    if (!chat)
                        return this.load_founded_chat(id);
                    yield chat.get_user_chat_meta(self_info.id);
                    break;
                case this.group_chat_types.join_channel:
                    return this.load_join_chat(id);
            }
            let html = this.render('main/messagingblock/qqq.pug', chat);
            yield this.reading_messages(chat.id);
            // await chat.save();
            yield this.send_data('reload_chat', html);
            yield this.render_chat_messages(chat.id);
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
                        yield Helpers_1.save_file(message.files[num]);
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
    render_transaction(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            message.mine = message.senderId ? (self_info.id === message.senderId) : false;
            // message.fill_sender_data();
            for (let num in message.files) {
                if (Helpers_1.check_file_preview(message.files[num].type)) {
                    message.files[num].preview = true;
                    if (!(yield Helpers_1.read_file(message.files[num]))) {
                        message.files[num].file = (yield this.ipfs.get_file(message.files[num].hash)).file;
                        yield Helpers_1.save_file(message.files[num]);
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
    getMsgTxs(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let opp_id = ChatModel_1.ChatModel.get_chat_opponent_id(chat_id, self_info.id);
            return yield typeorm_1.getConnection()
                .createQueryRunner()
                .query(`select *, "${chat_id}" as chatId from 
                   ((select id,"message" as type, text, time, senderId, null as amount
                       from message_model msg
                       where msg.chatId == "${chat_id}"
                   UNION
                   select id,"transaction" as type, null as text, time, fromId as senderId, amount
                       from transaction_model tx
                       where tx.fromId="${opp_id}" or tx.toId="${opp_id}") msgs
                   left join (
                       select id as senderId,avatar from user_model
                   ) user on user.senderId=msgs.senderId)
                   order by msgs.time`);
        });
    }
    render_chat_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // let messages = await MessageModel.get_chat_messages_with_sender_chat_files(chat_id);
            let messages = yield this.getMsgTxs(chat_id);
            let last_time;
            for (let num = messages.length - 1; num >= 0; --num) {
                // if (last_time!==new Date(messages[num].time))
                if (messages[num].type == 'message')
                    yield this.render_message(messages[num]);
                if (messages[num].type == 'transaction')
                    yield this.render_transaction(messages[num]);
            }
        });
    }
    render_chat_messages_all(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let messages = yield MessageModel_1.MessageModel.get_chat_messages_with_sender_chat_files(chat_id);
            yield this.send_data('gwagwa', this.render('main/messagingblock/message_all.pug', { messages: messages }));
        });
    }
    download_file(file_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield FileModel_1.FileModel.findOne(file_id);
            if (!Helpers_1.read_file(file)) {
                file.file = (yield this.ipfs.get_file(file.hash)).file;
                yield Helpers_1.save_file(file);
            }
            this.send_data('file_downloaded', { id: file_id });
        });
    }
    send_message({ id, text, file }) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let chat = yield ChatModel_1.ChatModel.findOne(id);
            let opp_id = ChatModel_1.ChatModel.get_chat_opponent_id(id, self_info.id);
            if (!chat) {
                let user = this.controller_register.get_controller_parameter('ChatsController', 'found_chats').users[id];
                let userModel = yield UserModel_1.UserModel.findOne(opp_id);
                if (!userModel) {
                    userModel = new UserModel_1.UserModel();
                    userModel.id = opp_id;
                    userModel.domain = 'localhost';
                    userModel.firstname = user.firstname;
                    userModel.lastname = user.lastname;
                    userModel.name = user.firstname + " " + user.lastname;
                    userModel.avatar = user.avatar;
                    yield userModel.save();
                }
                chat = new ChatModel_1.ChatModel();
                chat.id = id;
                chat.domain = "localhost";
                chat.type = this.chat_types.user;
                // chat.users=[userModel,self_info];
                chat.users = [userModel];
                if (userModel.id != self_info.id)
                    chat.users.push(self_info);
                yield chat.save();
            }
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
                let settings = yield this.getSettings();
                fileModel = new FileModel_1.FileModel();
                fileModel.preview = Helpers_1.check_file_preview(file.type);
                fileModel.hash = yield this.ipfs.add_file(file);
                fileModel.chat = chat;
                fileModel.message = message;
                fileModel.file = file.file;
                fileModel.name = file.name;
                fileModel.type = file.type;
                fileModel.path = settings.downloads;
                yield fileModel.save();
                yield Helpers_1.save_file(fileModel);
                message.files = [fileModel];
            }
            // message.fileModel = file_send;
            // await message.save();
            if (chat.type == this.group_chat_types.channel) {
                yield this.render_message(message);
            }
            if (chat.type === this.chat_types.user) {
                yield this.render_message(message);
                chat.id = yield chat.get_user_chat_meta(self_info.id);
                group = false;
            }
            else if (Object.values(this.group_chat_types).includes(chat.type)) {
                group = true;
            }
            // if (opp_id=='0x0000000000000000000000000000000000000000'){
            //     if (text=='claim'){
            //
            //     }
            //     return
            // }
            console.log("sending to", chat, text);
            if (opp_id != self_info.id)
                this.dxmpp.send(chat, text, group, message.files);
        });
    }
    ;
    // async show_message_notification(message_id:string){
    //     let message = await MessageModel.find({
    //         where:{id:message_id},
    //         relations:['sender','chat'],
    //     })[0];
    //     message.fill_sender_data();
    // }
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
            console.log(chat);
            if (!userModel || !chat) {
                // console.log("retriving user info");
                // let userGR=JSON.parse((await this.grpc.CallMethod("GetObjData",{id: user.id,obj:'user'})).data.data);
                // console.log(userGR);
                userModel = yield this.grpc.GetUser(user.id);
                yield userModel.save();
                chat = new ChatModel_1.ChatModel();
                chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, user.id);
                chat.type = this.chat_types.user;
                chat.domain = "localhost";
                chat.users = [userModel];
                if (user.id != self_info.id)
                    chat.users.push(self_info);
                yield chat.save();
                yield chat.get_user_chat_meta(self_info.id);
                yield this.controller_register.run_controller('ChatsController', 'load_chat', chat, this.chat_to_menu.user);
            }
            // let chat = await ChatModel.get_user_chat(self_info.id, user.id);
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
                    let settings = yield this.getSettings();
                    // file_info.sender = self_info.id;
                    fileModel.hash = files[num].hash;
                    fileModel.chat = chat;
                    fileModel.message = message;
                    fileModel.name = files[num].name;
                    fileModel.type = files[num].type;
                    fileModel.preview = Helpers_1.check_file_preview(files[num].type);
                    fileModel.path = settings.downloads;
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
                    let settings = yield this.getSettings();
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
                    fileModel.path = settings.downloads;
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