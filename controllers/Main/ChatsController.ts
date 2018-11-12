import "reflect-metadata";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";
import {MessageModel} from "../../models/MessageModel";
import {getConnection} from "typeorm";
import {Helper} from "../Helpers";
import {bot_acc} from "../../src/env_config";

class ChatsController extends Controller {

    public queried_chats: object;
    public found_chats= {
        users:{},
        chats:{},
    };

    async init_chats() {
        let self_info = await this.get_self_info();
        let language = (await this.get_Settings()).language;
        let obj = {
            arg:this.render('main/main.pug', {state: ''}),
            language:language
        };
        self_info.state = 'menu_chats';
        this.send_data(this.events.change_app_state, obj);
        // todo: load all chats.
        await this.load_chats(this.chat_types.user)
    };

    private async load_chat(chat: ChatModel, general_chat_type) {
        let self_info = await this.get_self_info();
        // if (chat.type === this.chat_types.user && chat.hasOwnProperty('get_user_chat_meta')) {
        //     await chat.get_user_chat_meta();
        // }
        if (chat.type === this.chat_types.user) {
            chat.online=chat.last_active>(Date.now()-1000*60*5);
        }
        if (chat.time)
            chat.time=Helper.formate_date(new Date(chat.time),{locale:'ru',for:'chat'});
        if (chat.senderId===self_info.id){
            if (chat.text)
                chat.text='Вы: '+chat.text;
        }

        // console.log(chat);
        let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
        this.send_data('buddy', {id: chat.id, type: general_chat_type, html: html})
    }

    async user_change_state(user, state, statusText, resource) {
        let self_info = await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);

        if (userModel) {
            userModel.online = state === 'online';
            await userModel.save();
            let chat = await ChatModel.get_user_chat_raw(self_info.id, user.id);
            // await chat.get_user_chat_meta();
            /** todo
             *  При релоаде чата, если диалог активный, оставить активным!
             *  Может произойти при выходе/входе из онлайна пользователя, при вступлении в группу и тд.
             *  Решение: сделать удаление/добавление класса active_dialog вместо замены html
             */
            await this.load_chat(chat, this.chat_to_menu.user);
        } else {
            userModel = new UserModel();
            userModel.id = user.id;
            userModel.domain = user.domain;
            userModel.online = true;
            console.log('saving new user ' + userModel.id);
            console.log(userModel);
            await userModel.save();

            let user_chat = new ChatModel();
            user_chat.id = ChatModel.get_user_chat_id(self_info.id, user.id);
            user_chat.type = this.chat_types.user;
            user_chat.users = [self_info, userModel];
            await user_chat.save();

            this.dxmpp.get_vcard(user)
        }
    }

    async load_chats(type: string, first: boolean = false) {
        console.log('load_chats');
        let self_info = await this.get_self_info();
        let settings = await this.get_Settings();
        let chats = await ChatModel.get_chats_with_last_msgs(self_info);


        let menu_chat: string;
        if (type === this.chat_types.user) {
            menu_chat = this.chat_to_menu.user;
        } else if (type === this.chat_types.group) {
            menu_chat = this.chat_to_menu.group;
        }

        if (!chats.length) return;
        for (let num in chats) {
            chats[num].active = (chats[num].id === settings.last_chat);
            await this.load_chat(chats[num], menu_chat);
        }
    }

    async show_chat_info(data) {
        let self_info = await this.get_self_info();
        if (Object.values(this.group_chat_types).includes(data.type)) {
            switch (data.type) {
                case this.group_chat_types.channel: {
                    let user = await ChatModel.findOne(data.id);
                    this.send_data('get_my_vcard', this.render('main/modal_popup/group_info.pug', user));
                    break;
                }
            }
        } else if (data.type === this.chat_types.user) {
            let user;
            try {
                user = await ChatModel.get_chat_opponent(data.id,self_info.id);
            } catch (e) {
                user = this.controller_register.get_controller_parameter('ChatsController', 'found_chats').users[data.id];
                user.id=ChatModel.get_chat_opponent_id(data.id,self_info.id)
            }
            user.eth_balance=await this.web3.GetUserBalance(user.id);
            this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', user));
        }
    }

    async CreateUserChat(user_id:string):Promise<{user:UserModel,chat:ChatModel}>{
        let self_info=await this.get_self_info();
        let userGR=JSON.parse((await this.grpc.CallMethod("GetObjData",{id: user_id,obj:'user'})).data.data);
        console.log(userGR);
        let userModel=new UserModel();
        userModel.id=userGR.id;
        userModel.domain="localhost";
        userModel.name=userGR.firstname+(userGR.lastname?" "+userGR.lastname:"");
        userModel.firstname=userGR.firstname;
        userModel.lastname=userGR.lastname;
        userModel.avatar=userGR.avatar;
        userModel.last_active=userGR.last_active;
        await userModel.save();

        let chat = new ChatModel();
        chat.id = ChatModel.get_user_chat_id(self_info.id, userGR.id);
        chat.type = this.chat_types.user;
        chat.domain = "localhost";
        chat.users=[userModel];
        if (userGR.id!=self_info.id)
            chat.users.push(self_info);
        await chat.save();

        return {user:userModel,chat}
    }

    async get_my_vcard() {
        let self_info = await this.get_self_info();
        self_info.eth_balance=await this.web3.GetUserBalance(self_info.id);
        this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', self_info));
    }

    async user_vcard(vcard) {
        let self_info = await this.get_self_info();
        let user = await UserModel.findOne(vcard.id);
        if (!user) console.log(`user ${user.id} not found in db`);
        user.avatar = vcard.avatar;
        user.name = vcard.name;
        user.bio = vcard.bio;
        user.firstname = vcard.firstname;
        user.lastname = vcard.lastname;
        await user.save();
        user.type = this.chat_types.user;
        let chat = await ChatModel.get_user_chat(self_info.id, user.id);
        await chat.get_user_chat_meta(self_info.id);
        await this.load_chat(chat, this.chat_to_menu.user);
    }

    async subscribe(user, key) {
        console.log(`subscribing to user ${user.id}`);
        this.dxmpp.subscribe(user);
    }

    async user_subscribed(user, key) {
        this.dxmpp.acceptSubscription(user);
        let check = await UserModel.findOne(user.id);
        if (!check)
            await this.subscribe(user, key);
    }

    async joined_room(room_data, messages) {
        console.log("Old messages:\n", messages);
        let chat = new ChatModel();

        chat.id = room_data.id;
        chat.domain = room_data.domain;
        chat.avatar = room_data.avatar;
        chat.name = room_data.name;
        chat.type = room_data.channel ? this.group_chat_types.channel : this.group_chat_types.group;
        chat.role = room_data.role;
        if (room_data.bio)
            chat.bio = room_data.bio;
        if (room_data.contractaddress)
            chat.contract_address = room_data.contractaddress;

        await chat.save();

        if (room_data.role==='moderator'){
            await this.grpc.CallMethod('SetObjData',{pubKey: this.grpc.pubKey,obj:'community',data:chat});
            await this.load_chat(chat,this.chat_types.group);
        } else {
            let count = (messages.length-1).toString();
            console.log('count: ',count);
            for (let num in messages){
                let message=messages[num];

                let room_data = {id: message.sender};
                let sender = {address: message.sender, domain: "localhost"};
                console.log('num: ',num);
                await this.controller_register.run_controller("MessagesController", "received_group_message",
                    {room_data, message:message.message, sender, stamp:message.time, files:message.files, fresh:(num===count), notificate:false});
            }
            await this.controller_register.run_controller("MessagesController", "get_chat_messages", {id:room_data.id,type:room_data.type})
        }
    }

    async create_group(group_data) {
        console.log(group_data);
        // let group_type=group_data.type?group_data.type:this.group_chat_types.channel;
        if (group_data.openPrivate=='on'){
            // let price=64;
            group_data.rate = 1/group_data.subscriptionPrice;
            group_data.decimals=18;
            if (group_data.rate<1){
                group_data.decimals += group_data.rate.toString().match(/[0.]*[1-9]/)[0].length-2;
            } else {
                group_data.decimals -= (Math.floor(group_data.rate).toString().length-1);
            }
            console.log('rate: ',group_data.rate,' decimals: ',group_data.decimals);
            console.log(await this.web3.CreateToken(group_data));
        } else {
            this.dxmpp.register_channel(group_data, '');
        }
    }

    async find_groups(group_name: string) {
        this.found_chats.users={};
        this.found_chats.chats={};
        let self_info = await this.get_self_info();
        let data = await this.grpc.CallMethod('GetObjsData',{str: group_name,obj:'all',prt:0});
        if (data.err)
            throw data.err;
        console.log(data);
        let fData=JSON.parse(data.data.data);
        console.log(fData);
        let users=fData.Users;
        for (let i in users){
            let user = users[i];
            user.id=ChatModel.get_user_chat_id(self_info.id,user.id);
            user.name=user.firstname+" "+user.lastname;
            user.type=this.chat_types.user;
            user.online=user.last_active>(Date.now()-1000*60*5);
            user.domain='localhost';
            this.found_chats.users[user.id]=user;
            this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', user));
        }
        let communities=fData.Communities;
        for (let i in communities){
            let community = communities[i];
            community.domain='localhost';
            let chat = await ChatModel.findOne(community.id);
            if (!chat)
                community.type = this.group_chat_types.join_channel;
            this.found_chats.chats[community.id]=community;
            this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', community));
        }

        // this.dxmpp.find_group(group_name);
    }

    async channel_suggestion() {
        console.log('suggested');
        this.send_data('offer_publication', this.render('main/modal_popup/offer.pug'));
    }

    async join_chat(chat) {
        this.dxmpp.join(chat)
    }

    async found_groups(result: any) {
        this.queried_chats = {};

        result.forEach(async (group) => {
            console.log(group);

            const st = group.jid.split('@');
            group.id = st[0];
            group.domain = st[1];

            let chat = await ChatModel.findOne(group.id);

            if (chat)
                group.type = chat.type;
            else
                group.type = group.channel === 'channel' ? this.group_chat_types.join_channel : this.group_chat_types.join_group;
            this.queried_chats[group.id] = group;

            this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', group));
        });
    }
}

module.exports = ChatsController;
