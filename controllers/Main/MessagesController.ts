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
import {chat_types, helper} from "../../src/var_helper";
import {Grpc} from "../../grpc/grpc";
import Benchmark = require('benchmark');
import {getConnection} from "typeorm";
import {TransactionModel} from "../../models/TransactionModel";
// import {Benchmark} from 'benchmark';
let benchmark=new Benchmark.Suite;
// import * as eNotify from 'electron-notify'
// let eNotify = require('electron-notify');

class MessagesController extends Controller {

    async benchmarkIt(){
        benchmark.add('message-one_by_one#test', {
            defer: true,
            fn:(deferred)=>{
                this.render_chat_messages('0x100feeb554dadbfe5d97763145807dbe0a5d0e34_0x7068895138bf0ac16a6cabb3c446ad41ff571da3')
                    .then(()=>{
                    deferred.resolve();
                })
            }
        }).add('message-all#test', {
            defer: true,
            fn:(deferred)=>{
                this.render_chat_messages_all('0x100feeb554dadbfe5d97763145807dbe0a5d0e34_0x7068895138bf0ac16a6cabb3c446ad41ff571da3')
                    .then(()=>{
                    deferred.resolve();
                })
            }
        }).on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
            console.log(this[0].times);
            console.log(this[1].times)
        }).run({ 'async': true })
    }

    async load_join_chat(chat_id: string) {
        let q_chats = this.controller_register.get_controller_parameter('ChatsController', 'found_chats');
        let chat = q_chats.chats[chat_id];
        chat.type = this.group_chat_types.join_channel;
        this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
    }

    async load_founded_chat(chat_id: string) {
        let q_chats = this.controller_register.get_controller_parameter('ChatsController', 'found_chats');
        let chat = q_chats.users[chat_id];
        this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
    }

    async get_chat_messages({id,type}) {
        // this.benchmarkIt();
        let set = await this.getSettings();
        set.last_chat=id;
        await set.save();

        let self_info = await this.get_self_info();
        console.log('get_chat_messages',id,type);
        let chat = await ChatModel.get_chat_with_events(id);

        // let switcher=chat?chat.type:type;
        switch (chat?chat.type:type) {
            case this.chat_types.user:
                if (!chat)
                    return this.load_founded_chat(id);
                await chat.get_user_chat_meta(self_info.id);
                break;
            case this.group_chat_types.join_channel:
                return this.load_join_chat(id);
        }
        let html = this.render('main/messagingblock/qqq.pug', chat);
        await this.reading_messages(chat.id);
        // await chat.save();
        await this.send_data('reload_chat', html);

        await this.render_chat_messages(chat.id);
    };

    private async render_message(message: MessageModel) {
        let self_info = await this.get_self_info();
        message.mine = message.senderId ? (self_info.id === message.senderId) : false;
        // message.fill_sender_data();
        // console.log('message:',message);
        // message.
        // message.files=await FileModel.find({where:{messageId:message.id}});
        // await MessageModel.getFiles(message);
        // console.log(message.files);
        for (let num in message.files){
            if (check_file_preview(message.files[num].type)) {
                message.files[num].preview=true;
                if (!await read_file(message.files[num])) {
                    message.files[num].file = (await this.ipfs.get_file(message.files[num].hash)).file;
                    await save_file(message.files[num]);
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
            id: message.chatId,
            html: html,
            html_date: html_date,
            message:message,
            time: date_time,
            // unread_messages:message.chat.unread_messages
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

    private async render_transaction(message) {
        let self_info = await this.get_self_info();
        message.mine = message.senderId ? (self_info.id === message.senderId) : false;
        // console.log('tx message:',message);
        message.amount=TransactionModel.NormalizeValue(message.amount);
        let date_time = await Helper.formate_date(new Date(message.time), {locale:"ru:",for:"dialog_date"});
        message.time=Helper.formate_date(new Date(message.time),{locale:'ru',for:'message'});
        let html = this.render('main/messagingblock/messageTransaction.pug', message);
        let html_date = this.render("main/messagingblock/dialog_date.pug", {time:date_time});

        if (message.mine)
            message.text='Вы: '+message.text;

        const data = {
            id: message.chatId,
            html: html,
            html_date: html_date,
            message:message,
            time: date_time,
            // unread_messages:message.chat.unread_messages
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

    private async getMsgTxs(chat_id:string){
        let self_info = await this.get_self_info();
        let opp_id=ChatModel.get_chat_opponent_id(chat_id,self_info.id);
        return await getConnection()
            .createQueryRunner()
            .query(
                `select *, "${chat_id}" as chatId from 
                   ((select id,"message" as type, text, time, senderId, null as amount
                       from message_model msg
                       where msg.chatId == "${chat_id}"
                   UNION
                   select id,"transaction" as type, null as text, time, fromId as senderId, amount
                       from transaction_model tx
                       where tx.fromId="${opp_id}" or tx.toId="${opp_id}") msgs
                   left join (
                       select id as senderId,avatar as sender_avatar,name as sender_name from user_model
                   ) user on user.senderId=msgs.senderId)
                   order by msgs.time DESC
                   limit 15`
            );
    }

    private async render_chat_messages(chat_id: string) {
        let chat = await ChatModel.findOne(chat_id);
        let self_info = await this.get_self_info();
        let messages = await this.getMsgTxs(chat_id);
        for (let num = messages.length - 1; num >= 0; --num) {
            if (chat.type == this.group_chat_types.channel && messages[num].senderId != self_info.id) {
                messages[num].sender_avatar = chat.avatar;
            }
            if (messages[num].type == 'message')
                await this.render_message(messages[num]);
            if (messages[num].type == 'transaction') {
                console.log(`'transaction' == ${messages[num].type}`);
                console.log(`'transaction'`);
                messages[num].text = 'Транзакция';
                await this.render_transaction(messages[num]);
            }
        }
    }

    private async render_chat_messages_all(chat_id: string) {
        let messages = await MessageModel.get_chat_messages_with_sender_chat_files(chat_id);
        await this.send_data('gwagwa', this.render('main/messagingblock/message_all.pug',{messages:messages}));
    }

    async download_file(file_id: string) {
        let file = await FileModel.findOne(file_id);
        if (!read_file(file)) {
            file.file = (await this.ipfs.get_file(file.hash)).file;
            await save_file(file);
        }
        this.send_data('file_downloaded',{id:file_id});
    }

    async send_message({id, text, file}) {
        let self_info = await this.get_self_info();
        let chat = await ChatModel.findOne(id);
        let opp_id=ChatModel.get_chat_opponent_id(id,self_info.id);
        if (!chat) {
            let user = this.controller_register.get_controller_parameter('ChatsController','found_chats').users[id];
            let userModel=await UserModel.findOne(opp_id);
            if (!userModel) {
                userModel=new UserModel();
                userModel.id=opp_id;
                userModel.domain='localhost';
                userModel.firstname=user.firstname;
                userModel.lastname=user.lastname;
                userModel.name=user.firstname+" "+user.lastname;
                userModel.avatar=user.avatar;
                await userModel.save();
            }
            chat = new ChatModel();
            chat.id=id;
            chat.domain="localhost";
            chat.type=this.chat_types.user;
            // chat.users=[userModel,self_info];
            chat.users=[userModel];
            if (userModel.id!=self_info.id)
                chat.users.push(self_info);
            await chat.save();
        }
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
            let settings = await this.getSettings();
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
            await save_file(fileModel);

            message.files=[fileModel];
        }
        message.fill_sender_data();
        message.senderId=message.sender.id;
        message.chatId=message.chat.id;
        await this.render_message(message);

        // message.fileModel = file_send;
        // await message.save();
        // if (chat.type == this.group_chat_types.channel) {
        //     await this.render_message(message);
        // }

        if (chat.type === this.chat_types.user) {
            // await this.render_message(message);
            chat.id = await chat.get_user_chat_meta(self_info.id);
            group = false;
        } else if (Object.values(this.group_chat_types).includes(chat.type)) {
            group = true;
        }

        // if (opp_id=='0x0000000000000000000000000000000000000000'){
        //     if (text=='claim'){
        //
        //     }
        //     return
        // }

        console.log("sending to",chat,text);
        if (opp_id!=self_info.id)
            this.dxmpp.send(chat, text, group, message.files);
    };

    // async show_message_notification(message_id:string){
    //     let message = await MessageModel.find({
    //         where:{id:message_id},
    //         relations:['sender','chat'],
    //     })[0];
    //     message.fill_sender_data();
    // }

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
        // console.log(chat);
        if (!userModel || !chat){
            // console.log("retriving user info");
            // let userGR=JSON.parse((await this.grpc.CallMethod("GetObjData",{id: user.id,obj:'user'})).data.data);
            // console.log(userGR);
            userModel=await this.grpc.GetUser(user.id);
            await userModel.save();

            chat = new ChatModel();
            chat.id = ChatModel.get_user_chat_id(self_info.id, user.id);
            chat.type = this.chat_types.user;
            chat.domain = "localhost";
            chat.users=[userModel];
            if (user.id!=self_info.id)
                chat.users.push(self_info);
            await chat.save();

            await chat.get_user_chat_meta(self_info.id);

            await this.controller_register.run_controller('ChatsController','load_chat',chat,this.chat_to_menu.user)
        }

        // let chat = await ChatModel.get_user_chat(self_info.id, user.id);
        chat.unread_messages += 1;
        await chat.save();
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = Date.now();
        message.fresh = true;
        message.notificate = true;
        message.files=[];
        await message.save();

        // let ipfs_file;
        if (files && files.length) {
            for (let num in files){
                let fileModel = new FileModel();
                let settings = await this.getSettings();
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

        message.senderId=userModel.id;
        message.sender_avatar=userModel.avatar;
        message.sender_name=userModel.name;
        message.chatId=chat.id;
        // console.log(message,stamp);
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
        messageModel.time = Date.now();
        messageModel.files = [];
        messageModel.fresh = fresh;
        messageModel.notificate = notificate;
        await messageModel.save();

        if (files) {
            for (let num in files){
                await messageModel.save();
                let settings = await this.getSettings();
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
        messageModel.sender_avatar=chat.avatar;
        messageModel.chatId=chat.id;

        await this.render_message(messageModel);
    }

    async reading_messages(chat_id) {
        let chat = await ChatModel.get_chat_with_events(chat_id);
        chat.unread_messages = 0;
        await chat.save();
    }
}

module.exports = MessagesController;
