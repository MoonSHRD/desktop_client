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
const AccountModel_1 = require("../../models/AccountModel");
const UserModel_1 = require("../../models/UserModel");
const Controller_1 = require("../Controller");
const ChatModel_1 = require("../../models/ChatModel");
const MessageModel_1 = require("../../models/MessageModel");
class MenuController extends Controller_1.Controller {
    init_main() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('init_main');
            yield this.generate_initial_chats();
            let self_info = yield this.get_self_info();
            this.send_data(this.events.change_app_state, this.render('main/main.pug', self_info));
            yield this.load_menu_initial(true);
        });
    }
    ;
    load_menu(menu) {
        return __awaiter(this, void 0, void 0, function* () {
            let menu_func = "";
            let account = yield AccountModel_1.AccountModel.findOne(1);
            if (typeof this[`load_${menu}`] === 'function')
                menu_func = `load_${menu}`;
            else
                menu_func = `load_menu_default`;
            yield this[menu_func](account);
        });
    }
    ;
    load_menu_user_chats(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            self_info.state = this.chat_to_menu.user;
            let html = this.render('main/chatsblock/chatsblock.pug', self_info) +
                this.render('main/messagingblock/messagingblock.pug');
            this.send_data('change_menu_state', html);
            yield this.controller_register.run_controller('ChatsController', 'load_chats', this.chat_types.user);
        });
    }
    load_menu_chats(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            self_info.state = this.chat_to_menu.group;
            let html = this.render('main/chatsblock/chatsblock.pug', self_info) +
                this.render('main/messagingblock/messagingblock.pug');
            this.send_data('change_menu_state', html);
            yield this.controller_register.run_controller('ChatsController', 'load_chats', this.chat_types.group);
        });
    }
    load_menu_wallet(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let self_info = yield this.get_self_info();
            self_info.state = this.chat_to_menu.user;
            let html = this.render('main/wallet/wallet.pug', self_info); // +
            // this.render('main/messagingblock/messagingblock.pug');
            this.send_data('change_menu_state', html);
            yield this.controller_register.run_controller('WalletController', 'change_wallet_menu');
        });
    }
    generate_initial_chats() {
        return __awaiter(this, void 0, void 0, function* () {
            let initial_user;
            let initial_user_chat;
            let initial_user_message;
            let self_info = yield this.get_self_info();
            if (!(yield UserModel_1.UserModel.findOne('0x0000000000000000000000000000000000000000'))) {
                initial_user = new UserModel_1.UserModel();
                initial_user.id = '0x0000000000000000000000000000000000000000';
                initial_user.avatar = 'data:image/png;base64,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';
                initial_user.online = false;
                initial_user.domain = 'localhost';
                initial_user.name = 'Moonshard support';
                initial_user.firstname = 'Moonshard';
                initial_user.lastname = 'support';
                initial_user.bio = 'Moonshard support';
                yield initial_user.save();
                initial_user_chat = new ChatModel_1.ChatModel();
                initial_user_chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, initial_user.id);
                initial_user_chat.type = this.chat_types.user;
                initial_user_chat.users = [self_info, initial_user];
                yield initial_user_chat.save();
                initial_user_message = new MessageModel_1.MessageModel();
                initial_user_message.time = '00:00';
                initial_user_message.chat = initial_user_chat;
                initial_user_message.sender = initial_user;
                initial_user_message.text = 'Hello my friend!';
                yield initial_user_message.save();
            }
            if (!(yield UserModel_1.UserModel.findOne('0x0000000000000000000000000000000000000001'))) {
                initial_user = new UserModel_1.UserModel();
                initial_user.id = '0x0000000000000000000000000000000000000001';
                initial_user.avatar = 'data:image/png;base64,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';
                initial_user.online = false;
                initial_user.domain = 'localhost';
                initial_user.name = 'Moonshard support';
                initial_user.firstname = 'Moonshard';
                initial_user.lastname = 'support';
                initial_user.bio = 'Moonshard support';
                yield initial_user.save();
                initial_user_chat = new ChatModel_1.ChatModel();
                initial_user_chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, initial_user.id);
                initial_user_chat.type = this.chat_types.user;
                initial_user_chat.users = [self_info, initial_user];
                yield initial_user_chat.save();
                initial_user_message = new MessageModel_1.MessageModel();
                initial_user_message.time = '00:00';
                initial_user_message.chat = initial_user_chat;
                initial_user_message.sender = initial_user;
                initial_user_message.text = 'Hello my friend!';
                yield initial_user_message.save();
                initial_user_message = new MessageModel_1.MessageModel();
                initial_user_message.time = '00:00';
                initial_user_message.chat = initial_user_chat;
                initial_user_message.sender = self_info;
                initial_user_message.text = 'Hello my friend!';
                yield initial_user_message.save();
            }
        });
    }
    load_menu_create_chat() {
        this.send_data('get_my_vcard', this.render('main/modal_popup/create_chat.pug'));
    }
    load_menu_initial(first = false) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('load_menu_default');
            let self_info = yield this.get_self_info();
            yield this.controller_register.run_controller('ChatsController', 'load_chats', this.chat_types.user, first);
            if (first) {
                yield this.controller_register.run_controller('MessagesController', 'get_chat_messages', '0x0000000000000000000000000000000000000000_' + self_info.id);
            }
        });
    }
    load_menu_default() {
        return __awaiter(this, void 0, void 0, function* () {
            this.send_data(this.events.change_menu_state, this.render('main/file.pug', { state: "menu_under_construction" }));
        });
    }
}
module.exports = MenuController;
//# sourceMappingURL=MenuController.js.map