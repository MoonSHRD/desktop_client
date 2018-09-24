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

class Router {
    readonly window: any;
    private paths: any;
    private controller_register: ControllerRegister;
    private online: boolean;
    readonly ipcMain: any;
    readonly dxmpp: any;
    private events: any;
    private types: any;
    readonly Controllers: any;

    constructor(window) {
        const config = require(__dirname + '/events&types');
        this.window = window;
        this.controller_register = ControllerRegister.getInstance(window);
        this.online = false;
        this.paths = config.paths;
        this.ipcMain = ipcMain;
        this.dxmpp = dxmpp.getInstance();
        this.events = config.events;
        this.types = config.paths;
        this.Controllers = require(config.paths.controllers + 'controllers_list');
    };

    private init_sqlite() {
        createConnection({
            type: "sqlite",
            database: "sqlite/data.db",
            entities: [
                this.paths.models + "*.js"
            ],
            // migrations: [
            //     "sqlite/migrations/*.js"
            // ],
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

        this.listen_event(this.ipcMain, 'submit_profile', async (event, arg) => {
            await this.controller_register.run_controller('AuthController', 'save_acc', arg);
        });

        this.listen_event(this.ipcMain, 'generate_mnemonic', async (event, arg) => {
            await this.controller_register.run_controller('AuthController', 'generate_mnemonic', (arg));
        });

        this.listen_event(this.dxmpp, 'online', async (data) => {
            console.log('jackal connected');
            this.online = true;
            await this.controller_register.run_controller('MenuController', 'init_main');
        });

        this.listen_event(this.dxmpp, 'close', async () => {
            console.log('jackal disconnected');
            this.online = false;
            while (!this.online) {
                setTimeout(async () => {
                    await this.controller_register.run_controller('AuthController', 'init_auth');
                }, 2000);
            }
        });

        this.listen_event(this.dxmpp, 'buddy', async (user, state, statusText, resource) => {
            console.log(`user ${user.id} is ${state}`);
            await this.controller_register.run_controller('ChatsController', 'user_change_state', user, state, statusText, resource);
        });

        this.listen_event(this.dxmpp, 'received_vcard', async (vcard) => {
            console.log(`got user ${vcard.id} vcard`);
            // console.log(vcard);
            await this.controller_register.run_controller('ChatsController', 'user_vcard', vcard);
        });

        this.listen_event(this.dxmpp, 'error', async (err) => {
            console.log(err)
        });

        this.listen_event(this.ipcMain, 'send_subscribe', async (event, data) => {
            await this.controller_register.run_controller('ChatsController', `subscribe`, data);
        });

        this.listen_event(this.ipcMain, 'get_my_vcard', async () => {
            await this.controller_register.run_controller('ChatsController', 'get_my_vcard');
        });

        this.listen_event(this.ipcMain, 'get_chat_msgs', async (event, arg) => {
            await this.controller_register.run_controller('MessagesController', 'get_chat_messages', arg);
        });

        this.listen_event(this.ipcMain, 'send_message', async (event, arg) => {
            await this.controller_register.run_controller('MessagesController', 'send_message', arg);
        });

        this.listen_event(this.ipcMain, 'change_menu_state', async (event, arg) => {
            await this.controller_register.run_controller('MenuController', 'load_menu', arg);
        });

        this.listen_event(this.ipcMain, 'show_popup', async (event, arg) => {
            console.log(arg);
            await this.controller_register.run_controller('ChatsController', 'show_chat_info', arg);
        });

        this.listen_event(this.dxmpp, 'subscribe', async (user) => {
            console.log(`user ${user.id} subscribed`);
            await this.controller_register.run_controller('ChatsController', 'user_subscribed', user);
        });

        this.listen_event(this.dxmpp, 'chat', async (user, message) => {
            console.log(`user ${user.id} subscribed`);
            await this.controller_register.run_controller('MessagesController', 'received_message', user, message);
        });
    }
}

module.exports = Router;
