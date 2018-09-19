const {ipcMain} = require('electron');
let {dxmpp} = require('moonshard_core');
// const {events, chat_types} = require('./events&types.js');
// const {ChannelWorker, ChannelWorkerEVM} = require('./cipher/cither');
// const {CryptoUtils} = require('loom-js');
// const LoomTruffleProvider = require('loom-truffle-provider');
// const Web3 = require('web3');
// const contractAddress = "0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8";
// const sqlite = require('./dbup');
// let {config,PUG_OPTIONS} = require('./config');
// let qbox = require('qbox');


import "reflect-metadata";
import {createConnection} from "typeorm";

class Router {
    readonly window:any;
    private paths:any;
    private online:boolean;
    // private sqlite:any;
    readonly ipcMain:any;
    readonly dxmpp:any;
    private events:any;
    private types:any;
    readonly Controllers:any;

    constructor(window){
        const config=require(__dirname+'/events&types');
        this.window = window;
        this.online = false;
        this.paths = config.paths;
        this.ipcMain = ipcMain;
        this.dxmpp = dxmpp.getInstance();
        this.events = config.events;
        this.types = config.paths;
        this.Controllers = require(config.paths.controllers+'controllers_list');
    };

    private init_controller(controller,func,data:any=null){
        const cr_controller=new this.Controllers[controller](this.window);
        return cr_controller[func](data);
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
        }).then(connection => {
            this.init_app();
        }).catch(error => console.log(error));
    }

    private listen_event(from,event_name,callback){
        from.on(event_name,(...args)=>{
            try{
                callback(...args);
            } catch (e) {
                console.log(e);
            }
        });
    }

    public start_loading(){
        setTimeout(()=>{
            this.init_sqlite();
        }, 2000)
    }

    private init_app(){
        this.init_controller('AuthController','init_auth');
        this.start_listening();
    }

    private start_listening(){
        this.listen_event(this.ipcMain,'submit_profile',(event, arg) => {
            this.init_controller('AuthController','save_acc',arg);
        });

        this.listen_event(this.ipcMain,'generate_mnemonic',(event, arg) => {
            this.init_controller('AuthController','generate_mnemonic',(arg));
        });

        this.listen_event(this.dxmpp,'online',(data) => {
            console.log('jackal connected');
            this.online=true;
            this.init_controller('ChatsController','init_chats');
        });

        this.listen_event(this.dxmpp,'close',() => {
            console.log('jackal disconnected');
            this.online=false;
            while (!this.online){
                setTimeout(()=>{
                    this.init_controller('AuthController','init_auth');
                },2000);
            }
        });

        this.listen_event(this.dxmpp,'buddy',(user, state, statusText, resource) => {
            console.log(`user ${user.id} is ${state}`);
            this.init_controller('ChatsController',`user_${state}`,{user,statusText,resource});
        });

        this.listen_event(this.dxmpp,'received_vcard',(vcard) => {
            console.log(`got user ${vcard.id} vcard`);
            console.log(vcard);
            this.init_controller('ChatsController','user_vcard',vcard);
        });

        this.listen_event(this.dxmpp,'error',(err) => {
            console.log(err)
        });

        this.listen_event(this.ipcMain,'send_subscribe',(event, data) => {
            this.init_controller('ChatsController',`subscribe`,data);
        });

        this.listen_event(this.ipcMain,'get_my_vcard',() => {
            this.init_controller('ChatsController','get_my_vcard');
        });

        this.listen_event(this.dxmpp,'subscribe',(user) => {
            console.log(`user ${user.id} subscribed`);
            this.init_controller('ChatsController','user_subscribed',user);
        });
    }
}

module.exports = Router;
