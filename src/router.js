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
const moonshard_core_1 = require("moonshard_core");
const electron_1 = require("electron");
const ControllerRegister_1 = require("../controllers/ControllerRegister");
const var_helper_1 = require("./var_helper");
// import {Loom} from "../loom/loom";
const web3_1 = require("../web3/web3");
class Router {
    // private loom: Loom = Loom.getInstance();
    constructor(window) {
        this.loading = true;
        this.connection_tries = 0;
        this.window = window;
        this.controller_register = ControllerRegister_1.ControllerRegister.getInstance(window);
        this.online = false;
        this.paths = var_helper_1.helper.paths;
        this.ipcMain = electron_1.ipcMain;
        this.dxmpp = moonshard_core_1.Dxmpp.getInstance();
        this.web3 = web3_1.Web3S.GetInstance();
        // this.loom = Loom.getInstance();
        this.events = var_helper_1.helper.events;
        this.types = var_helper_1.helper.paths;
    }
    ;
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
            console.log('jackal reconnecting');
            this.online = false;
            function sleep(ms) {
                return new Promise(resolve => {
                    setTimeout(resolve, ms);
                });
            }
            yield this.controller_register.queue_controller('AuthController', 'init_auth');
            yield sleep(10000);
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
        this.listen_event(this.ipcMain, 'create_group', (event, group_data) => __awaiter(this, void 0, void 0, function* () {
            console.log('creating group');
            yield this.controller_register.queue_controller('ChatsController', 'create_group', group_data);
        }));
        this.listen_event(this.ipcMain, 'join_channel', (event, chat) => __awaiter(this, void 0, void 0, function* () {
            console.log('join group');
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
        this.listen_event(this.dxmpp, 'groupchat', (room_data, message, sender, stamp, files) => __awaiter(this, void 0, void 0, function* () {
            console.log(`${sender.address} says ${message} in ${room_data.id} chat on ${stamp}`);
            // console.log("Files:", files);
            yield this.controller_register.queue_controller('MessagesController', 'received_group_message', { room_data, message, sender, files, stamp });
        }));
        this.listen_event(this.dxmpp, 'chat', (user, message, stamp, file) => __awaiter(this, void 0, void 0, function* () {
            console.log(`user ${user.id} send you message`);
            console.log(file);
            yield this.controller_register.queue_controller('MessagesController', 'received_message', user, message, stamp, file);
        }));
        this.listen_event(this.dxmpp, 'confirmation', (message) => __awaiter(this, void 0, void 0, function* () {
            console.log(`message ${message.userid} delivered`);
            yield this.controller_register.queue_controller('MessagesController', 'message_delivered', message);
        }));
        this.listen_event(this.ipcMain, 'get_chat_msgs', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            console.log(arg);
            yield this.controller_register.run_controller('MessagesController', 'get_chat_messages', arg);
        }));
        this.listen_event(this.ipcMain, 'send_message', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('MessagesController', 'send_message', arg);
        }));
        this.listen_event(this.ipcMain, 'download_file', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('MessagesController', 'download_file', arg);
        }));
        this.listen_event(this.ipcMain, "reading_messages", (event, chat_id) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reading msg from", chat_id);
            yield this.controller_register.run_controller("MessagesController", "reading_messages", chat_id);
        }));
        /** Wallet events **/
        this.listen_event(this.ipcMain, 'change_wallet_menu', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            console.log('change_wallet_menu');
            yield this.controller_register.queue_controller('WalletController', 'change_wallet_menu', arg);
        }));
        this.listen_event(this.ipcMain, 'transfer_token', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.queue_controller('WalletController', 'transfer_token', arg);
        }));
        this.listen_event(this.ipcMain, 'get_contacts', () => __awaiter(this, void 0, void 0, function* () {
            console.log('get_contacts');
            yield this.controller_register.run_controller('WalletController', 'get_contacts');
        }));
        /** Settings events **/
        this.listen_event(this.ipcMain, 'change_settings_menu', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            console.log('change_settings_menu');
            yield this.controller_register.queue_controller('SettingsController', 'change_settings_menu', arg);
        }));
        this.listen_event(this.ipcMain, "change_directory", (event, path) => __awaiter(this, void 0, void 0, function* () {
            // console.log("Change directory:", path);
            yield this.controller_register.run_controller('SettingsController', 'change_directory', path);
        }));
        // this.listen_event(this.ipcMain, "change_last_chat", async (event, chat_id) => {
        //     // console.log("Change last chat:", chat_id);
        //     await this.controller_register.run_controller('SettingsController', 'update_last_chat', chat_id);
        // });
        /** Menu events **/
        this.listen_event(this.ipcMain, 'change_menu_state', (event, arg) => __awaiter(this, void 0, void 0, function* () {
            console.log('change menu');
            yield this.controller_register.run_controller('MenuController', 'load_menu', arg);
        }));
        /** Account events **/
        this.listen_event(this.ipcMain, "decrypt_db", (event) => __awaiter(this, void 0, void 0, function* () {
            this.controller_register.run_controller('AccountController', 'decrypt_db');
        }));
        this.listen_event(this.ipcMain, "encrypt_db", (event) => __awaiter(this, void 0, void 0, function* () {
            this.controller_register.run_controller('AccountController', 'encrypt_db');
        }));
        /** Window events **/
        this.listen_event(this.ipcMain, "change_size_window", (events, width, height) => __awaiter(this, void 0, void 0, function* () {
            // console.log("Changed windows size");
            // console.log("Width:", width);
            // console.log("height:", height);
            yield this.controller_register.run_controller('SettingsController', 'change_windows_size', width, height);
        }));
        this.listen_event(this.ipcMain, "change_chats_size", (events, width) => __awaiter(this, void 0, void 0, function* () {
            // console.log("New chats width:", width);
            yield this.controller_register.run_controller('SettingsController', 'change_chats_width', width);
        }));
        /** Eth events **/
        this.listen_event(this.web3, 'new_transaction', (tx) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Received ${tx.amount / Math.pow(10, 18)}Eth from ${tx.from.id}`);
            yield this.controller_register.run_controller('WalletController', 'handle_tx', tx);
            //             console.log(tx);
            //             let text=`Transaction
            // Amount: ${tx.value/Math.pow(10,18)} Coin.
            // Link: http://blocks.moonshrd.io/tx/${tx.hash}`;
            //             await this.controller_register.run_controller('MessagesController', 'received_message', {id:tx.from.toLowerCase(),domain:'localhost'}, text, Date.now(), []);
        }));
        // this.events.emit('new_transaction',transactionModel)
        // this.listen_event(this.web3, 'new_transaction', async (tx)=>{
        //     // console.log(one,two,three);
        //
        // });
    }
}
exports.Router = Router;
// module.exports = Router;
//# sourceMappingURL=router.js.map