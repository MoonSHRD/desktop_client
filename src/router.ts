// const {ChannelWorker, ChannelWorkerEVM} = require('./cipher/cither');
// const {CryptoUtils} = require('loom-js');
// const LoomTruffleProvider = require('loom-truffle-provider');
// const Web3 = require('web3');
// const contractAddress = "0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8";

import "reflect-metadata";
import {createConnection} from "typeorm";
import {dxmpp} from "moonshard_core";
import {ipcMain} from "electron";
import {ControllerRegister} from "../controllers/ControllerRegister";
import {helper} from "./var_helper";
import {Loom} from "../loom/loom";

export class Router {
    readonly window: any;
    private paths: any;
    private controller_register: ControllerRegister;
    private online: boolean;
    private loading: boolean=true;
    readonly ipcMain: any;
    readonly dxmpp: any;
    private events: any;
    private connection_tries: number=0;
    // private connecting: boolean = false;
    private types: any;
    private loom: Loom = Loom.getInstance();

    constructor(window) {
        this.window = window;
        this.controller_register = ControllerRegister.getInstance(window);
        this.online = false;
        this.paths = helper.paths;
        this.ipcMain = ipcMain;
        this.dxmpp = dxmpp.getInstance();
        this.loom = Loom.getInstance();
        this.events = helper.events;
        this.types = helper.paths;
    };

    private init_sqlite() {
        createConnection({
            type: "sqlite",
            database: "sqlite/data.db",
            entities: [
                this.paths.models + "*.js"
            ],
            synchronize: true,
            logging: false
        }).then(async connection => {
            await this.init_app();
        }).catch(error => console.log(error));
    }

    private listen_event(from, event_name, callback) {
        from.on(event_name, async (...args) => {
            try {
                await callback(...args);
            } catch (e) {
                console.log(e);
                // throw e;
            }
        });
    }

    public start_loading() {
        setTimeout(() => {
            this.init_sqlite();
        }, 2000)
    }

    private async init_app() {
        await this.controller_register.run_controller('AuthController', 'init_auth');
        this.start_listening();
    }

    private start_listening() {

        /**
         * ipcMain is for listening frontend
         * dxmpp is for listening jackal
         **/

        /** Connect & disconnect **/

        this.listen_event(this.dxmpp, 'close', async () => {
            console.log('jackal reconnecting');
            this.online = false;

            function sleep(ms) {
                return new Promise(resolve => {
                    setTimeout(resolve, ms)
                });
            }
            // console.log("Loom reconecting");
            // await this.controller_register.queue_controller("AuthController", "auth");
            await this.controller_register.queue_controller('AuthController', 'init_auth');
            await sleep(10000);
        });

        this.listen_event(this.dxmpp, 'online', async (data) => {
            console.log('jackal connected');
            // console.log(data);
            this.online = true;
            if (this.loading) {
                await this.controller_register.queue_controller('MenuController', 'init_main');
                this.loading=false;
            }

        });



        /** Auth Events **/

        this.listen_event(this.ipcMain, 'submit_profile', async (event, arg) => {
            await this.controller_register.queue_controller('AuthController', 'save_acc', arg);
        });

        this.listen_event(this.ipcMain, 'generate_mnemonic', async (event, arg) => {
            await this.controller_register.queue_controller('AuthController', 'generate_mnemonic', (arg));
        });



        /** Chats Events **/

        this.listen_event(this.ipcMain, 'channel_suggestion', async (event, arg) => {
            await this.controller_register.queue_controller('ChatsController', 'channel_suggestion', (arg));
        });

        this.listen_event(this.dxmpp, 'buddy', async (user, state, statusText, resource) => {
            console.log(`user ${user.id} is ${state}`);
            await this.controller_register.queue_controller('ChatsController', 'user_change_state', user, state, statusText, resource);
        });

        this.listen_event(this.dxmpp, 'received_vcard', async (vcard) => {
            console.log(`got user ${vcard.id} vcard`);
            await this.controller_register.queue_controller('ChatsController', 'user_vcard', vcard);
        });

        this.listen_event(this.dxmpp, 'error', async (err) => {
            console.log(err)
        });

        this.listen_event(this.ipcMain, 'send_subscribe', async (event, data) => {
            await this.controller_register.queue_controller('ChatsController', 'subscribe', data);
        });

        this.listen_event(this.ipcMain, 'load_chats', async (event, type) => {
            await this.controller_register.queue_controller('ChatsController', 'load_chats', type);
        });

        this.listen_event(this.ipcMain, 'get_my_vcard', async () => {
            await this.controller_register.queue_controller('ChatsController', 'get_my_vcard');
        });

        this.listen_event(this.ipcMain, 'show_popup', async (event, arg) => {
            console.log('show_popup');
            await this.controller_register.queue_controller('ChatsController', 'show_chat_info', arg);
        });

        this.listen_event(this.ipcMain, 'find_groups', async (event, group_name) => {
            console.log('finding groups');
            await this.controller_register.queue_controller('ChatsController', 'find_groups', group_name);
        });

        this.listen_event(this.ipcMain, 'create_group', async (event, group_data) => {
            console.log('creating group');
            await this.controller_register.queue_controller('ChatsController', 'create_group', group_data);
        });

        this.listen_event(this.ipcMain, 'join_channel', async (event, chat) => {
            console.log('join group');
            await this.controller_register.queue_controller('ChatsController', 'join_chat', chat);
        });

        this.listen_event(this.dxmpp, 'find_groups', async (result) => {
            console.log('groups found');
            await this.controller_register.queue_controller('ChatsController', 'found_groups', result);
        });

        this.listen_event(this.dxmpp, 'joined_room', async (room_data,messages) => {
            console.log(`joined ${room_data.name} as ${room_data.role}`);
            await this.controller_register.queue_controller('ChatsController', 'joined_room', room_data,messages);
        });

        this.listen_event(this.dxmpp, 'subscribe', async (user) => {
            console.log(`user ${user.id} subscribed`);
            await this.controller_register.queue_controller('ChatsController', 'user_subscribed', user);
        });



        /** General Events **/

        this.listen_event(this.dxmpp, 'user_joined_room', async (user, room_data) => {
            console.log(`user ${user.id} joined room ${room_data.id}`);
            await this.controller_register.queue_controller('EventsController', 'user_joined_room', user, room_data);
        });



        /** Messages events **/

        this.listen_event(this.dxmpp, 'groupchat', async (room_data, message, sender, stamp, files) => {
            console.log(`${sender.address} says ${message} in ${room_data.id} chat on ${stamp}`);
            // console.log("Files:", files);
            await this.controller_register.queue_controller('MessagesController', 'received_group_message', {room_data, message, sender, files, stamp});
        });

        this.listen_event(this.dxmpp, 'chat', async (user, message,file) => {
            console.log(`user ${user.id} subscribed`);
            console.log(file);
            await this.controller_register.queue_controller('MessagesController', 'received_message', user, message,file);
        });

        this.listen_event(this.dxmpp, 'confirmation', async (message) => {
            console.log(`message ${message.userid} delivered`);
            await this.controller_register.queue_controller('MessagesController', 'message_delivered', message);
        });

        this.listen_event(this.ipcMain, 'get_chat_msgs', async (event, arg) => {
            await this.controller_register.run_controller('MessagesController', 'get_chat_messages', arg);
        });

        this.listen_event(this.ipcMain, 'send_message', async (event, arg) => {
            await this.controller_register.queue_controller('MessagesController', 'send_message', arg);
        });

        this.listen_event(this.ipcMain, 'download_file', async (event, arg) => {
            await this.controller_register.queue_controller('MessagesController', 'download_file', arg);
        });



        /** Wallet events **/

        this.listen_event(this.ipcMain, 'change_wallet_menu', async (event, arg) => {
            console.log('change_wallet_menu');
            await this.controller_register.queue_controller('WalletController', 'change_wallet_menu', arg);
        });

        this.listen_event(this.ipcMain, 'transfer_token', async (event, arg) => {
            await this.controller_register.queue_controller('WalletController', 'transfer_token', arg);
        });

        this.listen_event(this.ipcMain, 'get_contacts', async () => {
            console.log('get_contacts');
            await this.controller_register.run_controller('WalletController', 'get_contacts');
        });


        /** Settings events **/

        this.listen_event(this.ipcMain, 'change_settings_menu', async (event, arg) => {
            console.log('change_settings_menu');
            await this.controller_register.queue_controller('SettingsController', 'change_settings_menu', arg);
        });


        /** Menu events **/

        this.listen_event(this.ipcMain, 'change_menu_state', async (event, arg) => {
            console.log('change menu');
            await this.controller_register.run_controller('MenuController', 'load_menu', arg);
        });


    }
}

// module.exports = Router;
