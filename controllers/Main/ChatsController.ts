import "reflect-metadata";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";

class ChatsController extends Controller {

    public queried_chats: object;

    async init_chats() {
        let self_info = await this.get_self_info();
        self_info.state = 'menu_chats';
        this.send_data(this.events.change_app_state, this.render('main/main.pug', {state: ''}));
        // todo: load all chats.
        await this.load_chats(this.chat_types.user)
    };

    private async load_chat(chat: ChatModel, general_chat_type) {
        if (chat.type === this.chat_types.user) {
            await chat.get_user_chat_meta();
        }
        let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
        this.send_data('buddy', {id: chat.id, type: general_chat_type, html: html})
    }

    async user_change_state(user, state, statusText, resource) {
        let self_info = await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        // let e;
        if (userModel) {
            userModel.online = state === 'online';
            await userModel.save();
            let chat = await ChatModel.get_user_chat(self_info.id, user.id);
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

    // async load_chats_by_menu(menu_to_chat:string){
    //     let type:string;
    //     switch (menu_to_chat) {
    //         case this.chat_to_menu.user:
    //             type=this.chat_types.user;
    //             break;
    //         case this.chat_to_menu.group:
    //             type=this.chat_types.group;
    //             break;
    //     }
    //     if (type)
    //         await this.load_chats(type);
    // }

    async load_chats(type: string, first: boolean = false) {
        console.log('load_chats');
        let self_info = await this.get_self_info();

        let chats = await ChatModel.get_chats_by_type(type);
        let menu_chat: string;
        if (type === this.chat_types.user) {
            menu_chat = this.chat_to_menu.user;
        } else if (type === this.chat_types.group) {
            menu_chat = this.chat_to_menu.group;
        }

        if (!chats.length) return;
        await chats.forEach(async (chat) => {
            if (chat.id === '0x0000000000000000000000000000000000000000_' + self_info.id && first)
                chat.active = true;
            await this.load_chat(chat, menu_chat);
        });
    }

    async show_chat_info(data) {
        console.log(data);
        if (Object.values(this.group_chat_types).includes(data.type)) {
            switch (data.type) {
                case this.group_chat_types.channel: {
                    let user = await ChatModel.findOne(data.id);
                    this.send_data('get_my_vcard', this.render('main/modal_popup/group_info.pug', user));
                    break;
                }
            }
        } else if (data.type === this.chat_types.user) {
            let user = await ChatModel.get_chat_opponent(data.id);
            this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', user));
        }
    }

    async get_my_vcard() {
        let self_info = await this.get_self_info();
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
        await this.load_chat(chat, this.chat_to_menu.user);
    }

    async subscribe(user) {
        console.log(`subscribing to user ${user.id}`);
        this.dxmpp.subscribe(user);
    }

    async user_subscribed(user) {
        this.dxmpp.acceptSubscription(user);
        let check = await UserModel.findOne(user.id);
        if (!check)
            await this.subscribe(user);
    }

    async joined_room(room_data,messages) {
        console.log(messages);
        let chat = new ChatModel();

        chat.id = room_data.id;
        chat.domain = room_data.domain;
        chat.avatar = room_data.avatar;
        chat.name = room_data.name;
        chat.type = room_data.channel;
        chat.role = room_data.role;
        if (room_data.bio)
            chat.bio = room_data.bio;
        if (room_data.contractaddress)
            chat.contract_address = room_data.contractaddress;

        await chat.save();

        await this.load_chat(chat, this.chat_to_menu.group)
    }

    async create_group(group_name: string, group_type:string=this.group_chat_types.channel) {
        let group = {name: group_name, domain: "localhost", type: group_type};
        this.dxmpp.register_channel(group, '');
    }

    async find_groups(group_name: string) {
        this.dxmpp.find_group(group_name);
    }

    async join_chat(chat) {
        this.dxmpp.join(chat)
    }

    async found_groups(result: any) {
        this.queried_chats = {};
        console.log(result);

        result.forEach(async (group) => {
            console.log(group);

            const st = group.jid.split('@');
            group.id = st[0];
            group.domain = st[1];

            let chat = await ChatModel.findOne(group.id);

            if (chat)
                group.type = chat.type;
            else
                group.type = group.channel === '1' ? this.group_chat_types.join_channel : this.group_chat_types.join_group;
            this.queried_chats[group.id] = group;

            this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', group));
        });
    }
}

module.exports = ChatsController;
