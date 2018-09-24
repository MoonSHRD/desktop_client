import "reflect-metadata";
// import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";

class ChatsController extends Controller {

    async init_chats() {
        let self_info=await this.get_self_info();
        // let account = await AccountModel.findOne(1);
        // console.log(account);
        // if (!account.address) {
        //     account.address = this.dxmpp.get_address();
        //     await account.save();
        // }
        self_info.state='menu_chats';
        this.send_data(this.events.change_app_state, this.render('main/main.pug', {state:''}));
        // todo: load all chats.
        await this.load_chats(this.chat_types.user)
    };

    private async load_chat(chat:ChatModel, general_chat_type) {
        if (chat.type===this.chat_types.user){
            await chat.get_user_chat_meta();
        }
        let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
        // console.log({id: chat.id, type: general_chat_type, html: html});
        this.send_data('buddy', {id: chat.id, type: general_chat_type, html: html})
    }

    async user_change_state(user, state, statusText, resource) {
        let self_info=await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        // let e;
        if (userModel) {
            userModel.online = state === 'online';
            await userModel.save();
            let chat=await ChatModel.get_user_chat(self_info.id,user.id);
            // user.type = this.chat_types.user;
            await this.load_chat(chat, this.chat_to_menu.user);
        } else {
            userModel = new UserModel();
            userModel.id = user.id;
            userModel.domain = user.domain;
            userModel.online = true;
            console.log('saving new user '+ userModel.id);
            console.log(userModel);
            try {
                await userModel.save();
            } catch (e) {
                console.log(e);
                return;
            }
            // console.log(e);

            let user_chat=new ChatModel();
            user_chat.id=ChatModel.get_user_chat_id(self_info.id,user.id);
            user_chat.type=this.chat_types.user;
            user_chat.users=[self_info,userModel];
            await user_chat.save();
            // console.log(e);

            this.dxmpp.get_vcard(user)
        }
    }

    async load_chats(type:string,first:boolean=false){
        console.log('load_chats');
        let self_info=await this.get_self_info();
        // chats
        // let chats=[];

        let chats=await ChatModel.get_chats_by_type(type);
        let menu_chat:string;
        if (type===this.chat_types.user){
            menu_chat=this.chat_to_menu.user;
        } else if (type===this.chat_types.group) {
            menu_chat=this.chat_to_menu.group;
        }
        // console.log(chats);
        // switch (type) {
        //     case this.chat_types.user:
        //         chats=await UserModel.find({take:20});
        //         break;
        //     case this.chat_types.channel:
        //         chats=await ChatModel.find({take:20});
        //         break;
        //     default:
        //         break;
        // }

        if (!chats.length) return;
        await chats.forEach(async (chat)=>{
            if (chat.id === '0x0000000000000000000000000000000000000000_'+self_info.id && first)
                chat.active=true;
            // console.log(chat);
            await this.load_chat(chat, menu_chat);
        });
    }

    async show_chat_info(data){
        if (Object.values(this.group_chat_types).includes(data.type)) {
            switch (data.type) {
                case this.group_chat_types.channel: {
                    let user = await ChatModel.findOne(data.id);
                    this.send_data('get_my_vcard',this.render('main/modal_popup/group_info.pug',user));
                    break;
                }
                // case this.group_chat_types.group: {
                //     console.log(data.type);
                //     break;
                // }
            }
        } else if (data.type===this.chat_types.user){
            let user = await ChatModel.get_chat_opponent(data.id);
            // let user = chat.get_chat_opponent();
            // chat.id = await chat.get_user_chat_meta();
            // chat.id=id;
            this.send_data('get_my_vcard',this.render('main/modal_popup/modal_content.pug',user));
        }
    }

    async get_my_vcard() {
        let self_info=await this.get_self_info();
        // return ret;
        // console.log(ret);
        this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', self_info));
    }

    async user_vcard(vcard) {
        let self_info=await this.get_self_info();
        let user = await UserModel.findOne(vcard.id);
        if (!user) console.log(`user ${user.id} not found in db`);
        user.avatar = vcard.avatar;
        user.name = vcard.name;
        user.bio = vcard.bio;
        user.firstname = vcard.firstname;
        user.lastname = vcard.lastname;
        // console.log(user);
        try {
            await user.save();
        } catch (e) {
            console.log(e);
            return;
        }
        user.type = this.chat_types.user;
        let chat=await ChatModel.get_user_chat(self_info.id,user.id);
        await this.load_chat(chat, this.chat_to_menu.user);
    }

    async subscribe(user) {
        console.log(`subscribing to user ${user.id}`);
        this.dxmpp.subscribe(user);
    }

    async user_subscribed(user) {
        // console.log(user);
        // await setTimeout(null,500);
        // let check = await UserModel.findOne(user.id);
        // if (!check)
        this.dxmpp.acceptSubscription(user);
    }
}

module.exports = ChatsController;
