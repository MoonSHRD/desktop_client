import "reflect-metadata";
import * as fs from "fs";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {MessageModel} from "../../models/MessageModel";
import {ChatModel} from "../../models/ChatModel";
import {assertAnyTypeAnnotation} from "babel-types";
import {FileModel} from "../../models/FileModel";
import InterceptFileProtocolRequest = Electron.InterceptFileProtocolRequest;
import {files_config} from "../../src/var_helper";
import {b64img_to_buff, check_file_exist, check_file_preview, read_file, save_file} from "../Helpers";
import * as Electron from 'electron'
import Notification = Electron.Notification;
import nativeImage = Electron.nativeImage;
// import * as eNotify from 'electron-notify'
// let eNotify = require('electron-notify');

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

    private async render_message(message: MessageModel, fresh:boolean=false) {
        // console.log(message);
        let self_info = await this.get_self_info();
        message.mine = message.sender ? (self_info.id === message.sender.id) : false;
        message.sender_avatar = message.sender && (message.chat.type !== this.group_chat_types.channel || message.mine) ? message.sender.avatar : message.chat.avatar;
        message.sender_name = message.sender && (message.chat.type !== this.group_chat_types.channel || message.mine) ? message.sender.name : message.chat.name;
        for (let num in message.files){
            if (check_file_preview(message.files[num].type)) {
                message.files[num].preview=true;
                if (!read_file(message.files[num])) {
                    message.files[num].file = (await this.ipfs.get_file(message.files[num].hash)).file;
                    save_file(message.files[num]);
                }
                console.log(message.files[num]);
            } else {
                if (check_file_exist(message.files[num]))
                    message.files[num].downloaded=true;
            }
        }
        let html = this.render('main/messagingblock/message.pug', message);
        // {
        //         title:userModel.name,
        //         body:message.text,
        //         icon:nativeImage.createFromBuffer(b64img_to_buff(message.sender_avatar))
        //     }
        const data = {
            id: message.chat.id,
            message: html,
            // notif:
        };
        this.send_data('received_message', data);

        // let notif = new Notification({
        //     title:userModel.name,
        //     body:message.text,
        //     icon:nativeImage.createFromBuffer(b64img_to_buff(message.sender_avatar))
        // });
        // notif.show();
    }

    private async render_chat_messages(chat_id: string) {
        let messages = await MessageModel.get_chat_messages_with_sender_chat_files(chat_id);
        for (let num = messages.length - 1; num >= 0; --num) {
            await this.render_message(messages[num]);
        }
    }

    async download_file(file_id: string) {
        let file = await FileModel.findOne(file_id);
        if (!read_file(file)) {
            file.file = (await this.ipfs.get_file(file.hash)).file;
            save_file(file);
        }
        this.send_data('file_dowloaded',{id:file_id});
    }

    async send_message({id, text, file}) {
        console.log(file);
        let self_info = await this.get_self_info();
        let chat = await ChatModel.findOne(id);
        // let date = new Date();
        let message = new MessageModel();
        message.sender = self_info;
        message.text = text;
        message.time = this.dxmpp.take_time();
        message.chat = chat;
        message.files=[];
        await message.save();
        let group: boolean;


        let fileModel;
        if (file) {
            console.log(file);
            fileModel = new FileModel();
            // if ([
            //     'image/jpeg',
            //     'image/png',
            // ].includes(file.type))
                fileModel.preview = check_file_preview(file.type);
            // file_send = {fileModel: file.fileModel, hash: await this.ipfs.add_file(fileModel), preview: preview, name: fileModel.name};
            // file_info.sender = self_info.id;
            fileModel.hash = await this.ipfs.add_file(file);
            fileModel.chat = chat;
            fileModel.message = message;
            fileModel.file = file.file;
            fileModel.name = file.name;
            fileModel.type = file.type;

            await fileModel.save();
            save_file(fileModel);

            message.files=[fileModel];
            // console.log(fileModel);
            // console.log("Save file_info")
        }

        // message.fileModel = file_send;
        // await message.save();
        if (chat.type == this.group_chat_types.channel) {
            await this.render_message(message);
        }

        if (chat.type === this.chat_types.user) {
            await this.render_message(message, id);
            chat.id = await chat.get_user_chat_meta();
            group = false;
        } else if (Object.values(this.group_chat_types).includes(chat.type)) {
            group = true;
        }
        // this.dxmpp.send(chat, text, group);
        this.dxmpp.send(chat, text, group, message.files);
        //
        // eNotify.setConfig({
        //     appIcon: self_info.avatar,
        //     displayTime: 6000
        // });
        // eNotify.notify({ title: self_info.name, text: text });

        let notif = new Notification({
            title:self_info.name,
            body:text,
            icon:nativeImage.createFromBuffer(b64img_to_buff(self_info.avatar))
        });
        notif.show();

        // await this.render_message(message, id);
    };

    async message_delivered(message_d) {
        let message = await MessageModel.findOne(message_d.userid);
        message.server_id = message_d.DBid;
        await message.save();
    };

    async received_message(user, text, files) {
        console.log(files);
        let self_info = await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        let chat = await ChatModel.get_user_chat(self_info.id, user.id);
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = this.dxmpp.take_time();
        message.files=[];
        await message.save();

        // let ipfs_file;
        if (files) {
            for (let num in files){
                await message.save();
                let fileModel = new FileModel();
                // file_info.sender = self_info.id;
                fileModel.hash = files[num].hash;
                fileModel.chat = chat;
                fileModel.message = message;
                fileModel.name = files[num].name;
                fileModel.type = files[num].type;
                fileModel.preview = check_file_preview(files[num].type);
                if (fileModel.preview) {
                    fileModel.file = (await this.ipfs.get_file(fileModel.hash)).file;
                }
                await fileModel.save();
                message.files.push(fileModel);
            }
        }

        await this.render_message(message, true);
    };

    async received_group_message(room_data, message, sender, stamp) {
        let self_info = await this.get_self_info();
        if (sender.address == self_info.id) return;
        let userModel: UserModel;
        if (sender)
            userModel = await UserModel.findOne(sender.address);
        if (stamp) {
            let time = stamp.split(" ")[1].split(":");
            stamp = `${time[0]}:${time[1]}`;
        } else {
            stamp = this.dxmpp.take_time()
        }
        let chat = await ChatModel.findOne(room_data.id);
        let messageModel = new MessageModel();
        messageModel.text = message;
        messageModel.sender = userModel;
        messageModel.chat = chat;
        messageModel.time = stamp;
        await messageModel.save();
        await this.render_message(messageModel, true);

        // await this.render_message(message, chat.id);
        // message.sender_avatar = message.sender && (message.chat.type !== this.group_chat_types.channel || message.mine) ? message.sender.avatar : message.chat.avatar;

        // let notif = new Notification({
        //     title:userModel.name,
        //     body:message,
        //     icon:nativeImage.createFromBuffer(b64img_to_buff(userModel.avatar))
        // });
        // notif.show();
    }

    // async received_channel_message(room_data, message, sender, stamp) {
    //
    //     if (stamp) {
    //         let time = stamp.split(" ")[1].split(":");
    //         stamp = `${time[0]}:${time[1]}`;
    //     } else {stamp = this.dxmpp.take_time()}
    //     let chat = await ChatModel.findOne(room_data.id);
    //     let messageModel = new MessageModel();
    //     messageModel.text = message;
    //     messageModel.sender = null;
    //     messageModel.chat = chat;
    //     messageModel.time = stamp;
    //     await messageModel.save();
    //     await this.render_message(messageModel, chat.id);
    // };
}

module.exports = MessagesController;
