import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {MessageModel} from "../../models/MessageModel";
import {ChatModel} from "../../models/ChatModel";
import {assertAnyTypeAnnotation} from "babel-types";

class MessagesController extends Controller {

    // private static async get_user_and_acc(id) {
    //     let account = await AccountModel.findOne(1);
    //     let userModel = await UserModel.findOne(id);
    //     return {account, userModel}
    // }

    // async get_user_chat_messages(user) {
    //     console.log("user id: "+user.id);
    //     let self_info=await this.get_self_info();
    //     let userModel = await UserModel.findOne(user.id);
    //     let chat=await ChatModel.get_user_chat_with_messages(self_info.id,user.id);
    //     // let messages = await ChatModel.get_user_chat_messages(self_info.id,userModel.id);
    //
    //     // console.log(userModel);
    //     // userModel.type=this.chat_types.user;
    //     let html = this.render('main/messagingblock/qqq.pug', chat);
    //     this.send_data('reload_chat', html);
    //
    //     chat.messages.forEach((message) => {
    //         this.render_message(message, self_info, userModel);
    //     });
    // };

    async get_chat_messages(chat_id:string) {
        console.log('get_chat_messages');
        // let self_info=await this.get_self_info();
        // console.log(chat_id);
        // chat_id=await ChatModel.get_user_chat_id(self_info.id,chat_id);
        let chat=await ChatModel.findOne(chat_id);
        // ChatModel.

        // console.log(chat);
        switch (chat.type) {
            case this.chat_types.user:
                await chat.get_user_chat_meta();
                break;
        }
        // let chat=await ChatModel.get_user_chat_with_messages(self_info.id,user.id);
        // let messages = await ChatModel.get_user_chat_messages(self_info.id,userModel.id);

        // console.log(chat);
        // userModel.type=this.chat_types.user;
        let html = this.render('main/messagingblock/qqq.pug', chat);
        // console.log(html);
        this.send_data('reload_chat', html);

        await this.render_chat_messages(chat_id);
    };

    private async render_message(message: MessageModel,chat_id:string) {
        let self_info=await this.get_self_info();
        message.sender_avatar=message.sender.avatar;
        message.mine=(self_info.id===message.sender.id);
        let html = this.render('main/messagingblock/message.pug', message);
        // console.log(message);
        const data = {
            id: chat_id,
            message: html,
        };
        this.send_data('received_message', data);
    }

    private async render_chat_messages(chat_id:string) {
        let messages=await MessageModel.get_chat_messages_with_sender(chat_id);

        messages.forEach((message) => {
            // message.sender_avatar=message.sender.avatar;
            // message.mine=(self_info.id===message.sender.id);
            this.render_message(message,chat_id);
        });
        // message.mine = message.sender.id === me.id;
        // message.sender_avatar = message.mine ? me.avatar : user.avatar;
        // let html = this.render('main/messagingblock/message.pug', message);
        // const data = {
        //     id: user.id,
        //     message: html,
        // };
        // this.send_data('received_message', data);
    }

    async send_message({user, text, group}) {
        let self_info=await this.get_self_info();
        switch (group) {
            case false:
                let chat = await ChatModel.get_user_chat(self_info.id,user.id);
                let userModel = await UserModel.findOne(user.id);
                // let chatModel = await
                let date = new Date();
                // console.log(userModel);
                let message = new MessageModel();
                message.sender = self_info;
                message.text = text;
                // message.time = this.dxmpp.take_time();
                message.time= `${date.getHours()}:${date.getMinutes()}`;
                message.chat = chat;
                await message.save();

                // todo: check if it's nessesary.
                // user.messages.push(message);
                // await user.save();

                this.dxmpp.send(userModel, text, false);
                await this.render_message(message, chat.id);
                break;
        }
    };

    async received_message(user, text) {
        let self_info=await this.get_self_info();
        let userModel=await UserModel.findOne(user.id);
        let chat=await ChatModel.get_user_chat(self_info.id,user.id);
        // let {account, userModel} = await MessagesController.get_user_and_acc(user.id);
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = this.dxmpp.take_time();
        await message.save();
        this.render_message(message,chat.id);
    };
}

module.exports = MessagesController;
