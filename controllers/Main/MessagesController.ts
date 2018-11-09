import "reflect-metadata";

import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {MessageModel} from "../../models/MessageModel";
import {ChatModel} from "../../models/ChatModel";
import {AccountModel} from "../../models/AccountModel";


import {FileModel} from "../../models/FileModel";

import {b64img_to_buff, check_file_exist, check_file_preview, Helper, read_file, save_file} from "../Helpers";
import * as Electron from 'electron'
import Notification = Electron.Notification;
import nativeImage = Electron.nativeImage;
import ipcRenderer = Electron.ipcRenderer;
import ipcMain = Electron.ipcMain;



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
        await this.reading_messages(chat.id);

        switch (chat.type) {
            case this.chat_types.user:
                await chat.get_user_chat_meta();
                break;
        }
        let html = this.render('main/messagingblock/qqq.pug', chat);
        await chat.save();
        await this.send_data('reload_chat', html);

        await this.render_chat_messages(chat_id);
    };

    private async render_message(message: MessageModel) {
        let self_info = await this.get_self_info();
        message.mine = message.sender ? (self_info.id === message.sender.id) : false;
        message.fill_sender_data();
        for (let num in message.files){
            if (check_file_preview(message.files[num].type)) {
                message.files[num].preview=true;
                if (!await read_file(message.files[num])) {
                    message.files[num].file = (await this.ipfs.get_file(message.files[num].hash)).file;
                    save_file(message.files[num]);
                }
                // console.log(message.files[num]);
            } else {
                if (check_file_exist(message.files[num]))
                    message.files[num].downloaded=true;
            }
        }
        let date_time = await Helper.formate_date(new Date(message.time), {locale:"ru:",for:"dialog_date"});
        message.time=Helper.formate_date(new Date(message.time),{locale:'ru',for:'message'});
        let html = this.render('main/messagingblock/message.pug', message);
        let html_date = this.render("main/messagingblock/dialog_date.pug", {time:date_time});

        if (message.mine)
            message.text='Вы: '+message.text;

        const data = {
            id: message.chat.id,
            html: html,
            html_date: html_date,
            message:message,
            time: date_time,
            unread_messages:message.chat.unread_messages
        };
        await this.send_data('received_message', data);

        if (message.notificate){
            let notif = new Notification({
                title:message.sender_name,
                body:message.text,
                icon:nativeImage.createFromBuffer(b64img_to_buff(message.sender_avatar))
            });
            notif.show();
        }
    }

    private async render_chat_messages(chat_id: string) {
        let messages = await MessageModel.get_chat_messages_with_sender_chat_files(chat_id);
        let last_time;
        for (let num = messages.length - 1; num >= 0; --num) {
            if (last_time!==new Date(messages[num].time))
            await this.render_message(messages[num]);
        }
    }

    async download_file(file_id: string) {
        let file = await FileModel.findOne(file_id);
        if (!read_file(file)) {
            file.file = (await this.ipfs.get_file(file.hash)).file;
            save_file(file);
        }
        this.send_data('file_downloaded',{id:file_id});
    }

    async send_message({id, text, file}) {
        let self_info = await this.get_self_info();
        let chat = await ChatModel.findOne(id);
        // let date = new Date();
        let message = new MessageModel();
        message.sender = self_info;
        message.text = text;
        message.time = Date.now();
        message.chat = chat;
        message.files=[];
        message.fresh = true;
        await message.save();
        let group: boolean;


        let fileModel;
        if (file) {
            console.log("with file:", file);
            let settings = await this.get_Settings();
            fileModel = new FileModel();
            fileModel.preview = check_file_preview(file.type);
            fileModel.hash = await this.ipfs.add_file(file);
            fileModel.chat = chat;
            fileModel.message = message;
            fileModel.file = file.file;
            fileModel.name = file.name;
            fileModel.type = file.type;
            fileModel.path = settings.downloads;
            await fileModel.save();
            save_file(fileModel);

            message.files=[fileModel];
        }

        // message.fileModel = file_send;
        // await message.save();
        if (chat.type == this.group_chat_types.channel) {
            await this.render_message(message);
        }

        if (chat.type === this.chat_types.user) {
            await this.render_message(message);
            chat.id = await chat.get_user_chat_meta();
            group = false;
        } else if (Object.values(this.group_chat_types).includes(chat.type)) {
            group = true;
        }
        this.dxmpp.send(chat, text, group, message.files);
    };

    async message_delivered(message_d) {
        let message = await MessageModel.findOne(message_d.userid);
        message.server_id = message_d.DBid;
        await message.save();
    };

    async received_message(user, text, stamp, files) {
        stamp = Number(stamp);
        // console.log("Files:", files);
        let self_info = await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        let chat = await ChatModel.get_user_chat(self_info.id, user.id);
        chat.unread_messages += 1;
        await chat.save();
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = stamp;
        message.fresh = true;
        message.notificate = true;
        message.files=[];
        await message.save();

        // let ipfs_file;
        if (files && files.length) {
            for (let num in files){
                let fileModel = new FileModel();
                let settings = await this.get_Settings();
                // file_info.sender = self_info.id;
                fileModel.hash = files[num].hash;
                fileModel.chat = chat;
                fileModel.message = message;
                fileModel.name = files[num].name;
                fileModel.type = files[num].type;
                fileModel.preview = check_file_preview(files[num].type);
                fileModel.path = settings.downloads;
                if (fileModel.preview) {
                    fileModel.file = (await this.ipfs.get_file(fileModel.hash)).file;
                }
                fileModel.path = self_info.id;
                await fileModel.save();
                message.files.push(fileModel);
            }
        }

        await this.render_message(message);
    };

    async received_group_message({room_data, message, sender, files, stamp, fresh=true, notificate=true}) {
        // console.log('Files: ',files);
        // console.log('Stamp: ',stamp);
        stamp = Number(stamp);
        let self_info = await this.get_self_info();
        if (sender.address == self_info.id) return;
        let userModel: UserModel;
        if (sender)
            userModel = await UserModel.findOne(sender.address);
        let chat = await ChatModel.findOne(room_data.id);
        chat.unread_messages += 1;
        await chat.save();
        let messageModel = new MessageModel();
        messageModel.text = message;
        messageModel.sender = userModel;
        messageModel.chat = chat;
        messageModel.time = stamp;
        messageModel.files = [];
        messageModel.fresh = fresh;
        messageModel.notificate = notificate;
        await messageModel.save();

        if (files) {
            for (let num in files){
                await messageModel.save();
                let settings = await this.get_Settings();
                let fileModel = new FileModel();
                // file_info.sender = self_info.id;
                fileModel.hash = files[num].hash;
                fileModel.chat = chat;
                fileModel.message = messageModel;
                fileModel.name = files[num].name;
                fileModel.type = files[num].type;
                fileModel.preview = check_file_preview(files[num].type);
                if (fileModel.preview) {
                    fileModel.file = (await this.ipfs.get_file(fileModel.hash)).file;
                }
                fileModel.path = settings.downloads;
                await fileModel.save();
                messageModel.files.push(fileModel);
            }
        }

        await this.render_message(messageModel);
    }

    async reading_messages(chat_id) {
        let chat = await ChatModel.get_chat_with_events(chat_id);
        chat.unread_messages = 0;
        await chat.save();
    }
}

module.exports = MessagesController;
