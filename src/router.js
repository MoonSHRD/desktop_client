"use strict";
// const {ChannelWorker, ChannelWorkerEVM} = require('./cipher/cither');
// const {CryptoUtils} = require('loom-js');
// const LoomTruffleProvider = require('loom-truffle-provider');
// const Web3 = require('web3');
// const contractAddress = "0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8";
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
const typeorm_1 = require("typeorm");
const moonshard_core_1 = require("moonshard_core");
const electron_1 = require("electron");
const ControllerRegister_1 = require("../controllers/ControllerRegister");
const var_helper_1 = require("./var_helper");
const loom_1 = require("../loom/loom");
class Router {
    constructor(window) {
        this.loading = true;
        this.connecting = false;
        this.loom = loom_1.Loom.getInstance();
        this.window = window;
        this.controller_register = ControllerRegister_1.ControllerRegister.getInstance(window);
        this.online = false;
        this.paths = var_helper_1.helper.paths;
        this.ipcMain = electron_1.ipcMain;
        this.dxmpp = moonshard_core_1.dxmpp.getInstance();
        this.loom = loom_1.Loom.getInstance();
        this.events = var_helper_1.helper.events;
        this.types = var_helper_1.helper.paths;
    }
    ;
    init_sqlite() {
        typeorm_1.createConnection({
            type: "sqlite",
            database: "sqlite/data.db",
            entities: [
                this.paths.models + "*.js"
            ],
            synchronize: true,
            logging: false
        }).then((connection) => __awaiter(this, void 0, void 0, function* () {
            yield this.init_app();
        })).catch(error => console.log(error));
    }
    listen_event(from, event_name, callback) {
        from.on(event_name, (...args) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield callback(...args);
            }
            catch (e) {
                console.log(e);
                // throw e;
            }
        }));
    }
    start_loading() {
        setTimeout(() => {
            this.init_sqlite();
        }, 2000);
    }
    init_app() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.run_controller('AuthController', 'init_auth');
            this.start_listening();
        });
    }
    start_listening() {
        /**
         * ipcMain is for listening frontend
         * dxmpp is for listening jackal
         **/
        /** Connect & disconnect **/
        this.listen_event(this.dxmpp, 'close', () => __awaiter(this, void 0, void 0, function* () {
            console.log('jackal disconnected');
            this.online = false;
            function sleep(ms) {
                return new Promise(resolve => {
                    setTimeout(resolve, ms);
                });
            }
            while (!this.online) {
                if (this.connecting)
                    return;
                this.connecting = true;
                yield this.controller_register.queue_controller('AuthController', 'init_auth');
                yield sleep(5000);
                this.connecting = false;
            }
        }));
        this.listen_event(this.dxmpp, 'online', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('jackal connected');
            // console.log(data);
            this.online = true;
            if (this.loading) {
                yield this.controller_register.queue_controller('MenuController', 'init_main');
                this.loading = false;
            }
        }));
        /** Auth Events **/
        this.listen_event(this.ipcMain, 'submit_profile', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('AuthController', 'save_acc', arg);
        }));
        this.listen_event(this.ipcMain, 'generate_mnemonic', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('AuthController', 'generate_mnemonic', (arg));
        }));
        /** Chats Events **/
        this.listen_event(this.ipcMain, 'channel_suggestion', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('ChatsController', 'channel_suggestion', (arg));
        }));
        this.listen_event(this.dxmpp, 'buddy', (user, state, statusText, resource) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user ${user.id} is ${state}`);
            yield this.controller_register.queue_controller('ChatsController', 'user_change_state', user, state, statusText, resource);
        }));
        this.listen_event(this.dxmpp, 'received_vcard', (vcard) => __awaiter(this, void 0, void 0, function* () {
            console.log(`got user ${vcard.id} vcard`);
            yield this.controller_register.queue_controller('ChatsController', 'user_vcard', vcard);
        }));
        this.listen_event(this.dxmpp, 'error', (err) => __awaiter(this, void 0, void 0, function* () {
            console.log(err);
        }));
        this.listen_event(this.ipcMain, 'send_subscribe', (event, data) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('ChatsController', 'subscribe', data);
        }));
        this.listen_event(this.ipcMain, 'load_chats', (event, type) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('ChatsController', 'load_chats', type);
        }));
        this.listen_event(this.ipcMain, 'get_my_vcard', () => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('ChatsController', 'get_my_vcard');
        }));
        this.listen_event(this.ipcMain, 'show_popup', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            console.log('show_popup');
            yield this.controller_register.queue_controller('ChatsController', 'show_chat_info', arg);
        }));
        this.listen_event(this.ipcMain, 'find_groups', (event, group_name) => __awaiter(this, void 0, void 0, function* () {
            console.log('finding groups');
            yield this.controller_register.queue_controller('ChatsController', 'find_groups', group_name);
        }));
        this.listen_event(this.ipcMain, 'create_group', (event, group_name) => __awaiter(this, void 0, void 0, function* () {
            console.log('creating group');
            yield this.controller_register.queue_controller('ChatsController', 'create_group', group_name);
        }));
        this.listen_event(this.ipcMain, 'join_channel', (event, chat) => __awaiter(this, void 0, void 0, function* () {
            console.log('creating group');
            yield this.controller_register.queue_controller('ChatsController', 'join_chat', chat);
        }));
        this.listen_event(this.dxmpp, 'find_groups', (result) => __awaiter(this, void 0, void 0, function* () {
            console.log('groups found');
            yield this.controller_register.queue_controller('ChatsController', 'found_groups', result);
        }));
        this.listen_event(this.dxmpp, 'joined_room', (room_data, messages) => __awaiter(this, void 0, void 0, function* () {
            console.log(`joined ${room_data.name} as ${room_data.role}`);
            yield this.controller_register.queue_controller('ChatsController', 'joined_room', room_data, messages);
        }));
        this.listen_event(this.dxmpp, 'subscribe', (user) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user ${user.id} subscribed`);
            yield this.controller_register.queue_controller('ChatsController', 'user_subscribed', user);
        }));
        /** General Events **/
        this.listen_event(this.dxmpp, 'user_joined_room', (user, room_data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user ${user.id} joined room ${room_data.id}`);
            yield this.controller_register.queue_controller('EventsController', 'user_joined_room', user, room_data);
        }));
        /** Messages events **/
        this.listen_event(this.dxmpp, 'groupchat', (room_data, message, sender, stamp) => __awaiter(this, void 0, void 0, function* () {
            console.log(`${sender.address} says ${message} in ${room_data.id} chat on ${stamp}`);
            yield this.controller_register.queue_controller('MessagesController', 'received_group_message', room_data, message, sender, stamp);
        }));
        this.listen_event(this.dxmpp, 'chat', (user, message) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user ${user.id} subscribed`);
            yield this.controller_register.queue_controller('MessagesController', 'received_message', user, message);
        }));
        this.listen_event(this.dxmpp, 'confirmation', (message) => __awaiter(this, void 0, void 0, function* () {
            console.log(`message ${message.userid} delivered`);
            yield this.controller_register.queue_controller('MessagesController', 'message_delivered', message);
        }));
        this.listen_event(this.ipcMain, 'get_chat_msgs', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('MessagesController', 'get_chat_messages', arg);
        }));
        this.listen_event(this.ipcMain, 'send_message', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('MessagesController', 'send_message', arg);
        }));
        /** Wallet events **/
        this.listen_event(this.ipcMain, 'change_wallet_menu', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            console.log('change_wallet_menu');
            yield this.controller_register.queue_controller('WalletController', 'change_wallet_menu', arg);
        }));
        this.listen_event(this.ipcMain, 'change_menu_state', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            this.controller_register.run_controller('MenuController', 'load_menu', arg);
        }));
        this.listen_event(this.ipcMain, 'transfer_token', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('WalletController', 'transfer_token', arg);
        }));
    }
}
exports.Router = Router;
// module.exports = Router;
//# sourceMappingURL=router.js.map