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
const ChatModel_1 = require("../../models/ChatModel");
const Helpers_1 = require("../Helpers");
const env_config_1 = require("../../src/env_config");
class ChatsController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.found_chats = {
            users: {},
            chats: {},
        };
    }
    init_chats() {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            self_info.state = 'menu_chats';
            this.send_data(this.events.change_app_state, this.render('main/main.pug', { state: '' }));
            // todo: load all chats.
            yield this.load_chats(this.chat_types.user);
        });
    }
    ;
    load_chat(chat, general_chat_type) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            // if (chat.type === this.chat_types.user && chat.hasOwnProperty('get_user_chat_meta')) {
            //     await chat.get_user_chat_meta();
            // }
            if (chat.type === this.chat_types.user) {
                chat.online = chat.last_active > (Date.now() - 1000 * 60 * 5);
            }
            if (chat.time)
                chat.time = Helpers_1.Helper.formate_date(new Date(chat.time), { locale: 'ru', for: 'chat' });
            if (chat.senderId === self_info.id) {
                if (chat.text)
                    chat.text = 'Вы: ' + chat.text;
            }
            // console.log(chat);
            let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
            this.send_data('buddy', { id: chat.id, type: general_chat_type, html: html });
        });
    }
    user_change_state(user, state, statusText, resource) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let userModel = yield UserModel_1.UserModel.findOne(user.id);
            // let e;
            if (userModel) {
                userModel.online = state === 'online';
                yield userModel.save();
                let chat = yield ChatModel_1.ChatModel.get_user_chat_raw(self_info.id, user.id);
                // await chat.get_user_chat_meta();
                /** todo
                 *  При релоаде чата, если диалог активный, оставить активным!
                 *  Может произойти при выходе/входе из онлайна пользователя, при вступлении в группу и тд.
                 *  Решение: сделать удаление/добавление класса active_dialog вместо замены html
                 */
                yield this.load_chat(chat, this.chat_to_menu.user);
            }
            else {
                userModel = new UserModel_1.UserModel();
                userModel.id = user.id;
                userModel.domain = user.domain;
                userModel.online = true;
                console.log('saving new user ' + userModel.id);
                console.log(userModel);
                yield userModel.save();
                let user_chat = new ChatModel_1.ChatModel();
                user_chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, user.id);
                user_chat.type = this.chat_types.user;
                user_chat.users = [self_info, userModel];
                yield user_chat.save();
                this.dxmpp.get_vcard(user);
            }
        });
    }
    load_chats(type, first = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('load_chats');
            let self_info = yield this.get_self_info();
            let chats = yield ChatModel_1.ChatModel.get_chats_with_last_msgs(self_info);
            // console.log(chats);
            let menu_chat;
            if (type === this.chat_types.user) {
                menu_chat = this.chat_to_menu.user;
            }
            else if (type === this.chat_types.group) {
                menu_chat = this.chat_to_menu.group;
            }
            if (!chats.length)
                return;
            // console.log(chats);
            yield chats.forEach((chat) => __awaiter(this, void 0, void 0, function* () {
                if (chat.id === env_config_1.bot_acc.addr + '_' + self_info.id && first)
                    chat.active = true;
                yield this.load_chat(chat, menu_chat);
            }));
        });
    }
    show_chat_info(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            if (Object.values(this.group_chat_types).includes(data.type)) {
                switch (data.type) {
                    case this.group_chat_types.channel: {
                        let user = yield ChatModel_1.ChatModel.findOne(data.id);
                        this.send_data('get_my_vcard', this.render('main/modal_popup/group_info.pug', user));
                        break;
                    }
                }
            }
            else if (data.type === this.chat_types.user) {
                let user;
                try {
                    user = yield ChatModel_1.ChatModel.get_chat_opponent(data.id, self_info.id);
                }
                catch (e) {
                    user = this.controller_register.get_controller_parameter('ChatsController', 'found_chats').users[data.id];
                    user.id = ChatModel_1.ChatModel.get_chat_opponent_id(data.id, self_info.id);
                }
                user.eth_balance = yield this.web3.GetUserBalance(user.id);
                this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', user));
            }
        });
    }
    CreateUserChat(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let userGR = JSON.parse((yield this.grpc.CallMethod("GetObjData", { id: user_id, obj: 'user' })).data.data);
            console.log(userGR);
            let userModel = new UserModel_1.UserModel();
            userModel.id = userGR.id;
            userModel.domain = "localhost";
            userModel.name = userGR.firstname + (userGR.lastname ? " " + userGR.lastname : "");
            userModel.firstname = userGR.firstname;
            userModel.lastname = userGR.lastname;
            userModel.avatar = userGR.avatar;
            userModel.last_active = userGR.last_active;
            yield userModel.save();
            let chat = new ChatModel_1.ChatModel();
            chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, userGR.id);
            chat.type = this.chat_types.user;
            chat.domain = "localhost";
            chat.users = [userModel];
            if (userGR.id != self_info.id)
                chat.users.push(self_info);
            yield chat.save();
            return { user: userModel, chat };
        });
    }
    get_my_vcard() {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            self_info.eth_balance = yield this.web3.GetUserBalance(self_info.id);
            this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', self_info));
        });
    }
    user_vcard(vcard) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            let user = yield UserModel_1.UserModel.findOne(vcard.id);
            if (!user)
                console.log(`user ${user.id} not found in db`);
            user.avatar = vcard.avatar;
            user.name = vcard.name;
            user.bio = vcard.bio;
            user.firstname = vcard.firstname;
            user.lastname = vcard.lastname;
            yield user.save();
            user.type = this.chat_types.user;
            let chat = yield ChatModel_1.ChatModel.get_user_chat(self_info.id, user.id);
            yield chat.get_user_chat_meta(self_info.id);
            yield this.load_chat(chat, this.chat_to_menu.user);
        });
    }
    subscribe(user, key) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`subscribing to user ${user.id}`);
            this.dxmpp.subscribe(user);
        });
    }
    user_subscribed(user, key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dxmpp.acceptSubscription(user);
            let check = yield UserModel_1.UserModel.findOne(user.id);
            if (!check)
                yield this.subscribe(user, key);
        });
    }
    joined_room(room_data, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Old messages:\n", messages);
            let chat = new ChatModel_1.ChatModel();
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
            yield chat.save();
            if (room_data.role === 'moderator') {
                yield this.grpc.CallMethod('SetObjData', { pubKey: this.grpc.pubKey, obj: 'community', data: chat });
                yield this.load_chat(chat, this.chat_types.group);
            }
            else {
                // await this.load_chat(chat, this.chat_to_menu.group);
                let count = (messages.length - 1).toString();
                console.log('count: ', count);
                for (let num in messages) {
                    let message = messages[num];
                    // let buf = message.time.split(" ");
                    // message.time = `${buf[0]} ${buf[1]}`;
                    let room_data = { id: message.sender };
                    let sender = { address: message.sender, domain: "localhost" };
                    console.log('num: ', num);
                    yield this.controller_register.run_controller("MessagesController", "received_group_message", { room_data, message: message.message, sender, stamp: message.time, files: message.files, fresh: (num === count), notificate: false });
                }
                yield this.controller_register.run_controller("MessagesController", "get_chat_messages", { id: room_data.id, type: room_data.type });
            }
        });
    }
    create_group(group_data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(group_data);
            // let group_type=group_data.type?group_data.type:this.group_chat_types.channel;
            if (group_data.openPrivate == 'on') {
                // let price=64;
                group_data.rate = 1 / group_data.subscriptionPrice;
                group_data.decimals = 18;
                if (group_data.rate < 1) {
                    group_data.decimals += group_data.rate.toString().match(/[0.]*[1-9]/)[0].length - 2;
                }
                else {
                    group_data.decimals -= (Math.floor(group_data.rate).toString().length - 1);
                }
                console.log('rate: ', group_data.rate, ' decimals: ', group_data.decimals);
                console.log(yield this.web3.CreateToken(group_data));
            }
            else {
                this.dxmpp.register_channel(group_data, '');
            }
        });
    }
    find_groups(group_name) {
        return __awaiter(this, void 0, void 0, function* () {
            this.found_chats.users = {};
            this.found_chats.chats = {};
            let self_info = yield this.get_self_info();
            let data = yield this.grpc.CallMethod('GetObjsData', { str: group_name, obj: 'all', prt: 0 });
            if (data.err)
                throw data.err;
            console.log(data);
            let fData = JSON.parse(data.data.data);
            console.log(fData);
            let users = fData.Users;
            for (let i in users) {
                let user = users[i];
                user.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, user.id);
                user.name = user.firstname + " " + user.lastname;
                user.type = this.chat_types.user;
                user.online = user.last_active > (Date.now() - 1000 * 60 * 5);
                user.domain = 'localhost';
                this.found_chats.users[user.id] = user;
                this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', user));
            }
            let communities = fData.Communities;
            for (let i in communities) {
                let community = communities[i];
                community.domain = 'localhost';
                let chat = yield ChatModel_1.ChatModel.findOne(community.id);
                if (!chat)
                    community.type = this.group_chat_types.join_channel;
                this.found_chats.chats[community.id] = community;
                this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', community));
            }
            // this.dxmpp.find_group(group_name);
        });
    }
    channel_suggestion() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('suggested');
            this.send_data('offer_publication', this.render('main/modal_popup/offer.pug'));
        });
    }
    join_chat(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dxmpp.join(chat);
        });
    }
    found_groups(result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queried_chats = {};
            // console.log(result);
            result.forEach((group) => __awaiter(this, void 0, void 0, function* () {
                console.log(group);
                const st = group.jid.split('@');
                group.id = st[0];
                group.domain = st[1];
                let chat = yield ChatModel_1.ChatModel.findOne(group.id);
                if (chat)
                    group.type = chat.type;
                else
                    group.type = group.channel === 'channel' ? this.group_chat_types.join_channel : this.group_chat_types.join_group;
                this.queried_chats[group.id] = group;
                this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', group));
            }));
        });
    }
}
module.exports = ChatsController;
//# sourceMappingURL=ChatsController.js.map