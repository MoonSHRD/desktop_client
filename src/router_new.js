// const pug = require('pug');
const {ipcMain} = require('electron');
// const {dxmpp, eth} = require('moonshard_core');
// // const Account = require('../controllers/AccountController');
// const fs = require('fs');
// const {events, chat_types} = require('./events&types.js');
// const {ChannelWorker, ChannelWorkerEVM} = require('./cipher/cither');
// const {CryptoUtils} = require('loom-js');
// const LoomTruffleProvider = require('loom-truffle-provider');
// const Web3 = require('web3');
// const contractAddress = "0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8";
// const sqlite = require('./dbup');
// let {config,PUG_OPTIONS} = require('./config');
// let qbox = require('qbox');

class Router {
    constructor(window){
        const config=require(__dirname+'/events&types');
        let {dxmpp} = require('moonshard_core');
        this._window = window;
        this.paths = config.paths;
        this.sqlite = require('./dbup');
        this.ipcMain = ipcMain;
        this.events = config.events;
        this.types = config.paths;
        this.Controllers = require(config.paths.controllers+'controllers_list');
    };

    _init_controller(controller,func,data){
        // console.log(this.Controllers);
        const cr_controller=new this.Controllers[controller](this._window);
        cr_controller[func](data);
    };

    _listen_event(from,event_name,callback){
        from.on(event_name,function(event,arg){
            try{
                callback(event,arg);
            } catch (e) {
                console.log(e);
            }
        });
    }

    start_loading(){
        setTimeout(()=>{
            this.init_app();
            this.start_listening();
        }, 10000)
    }

    init_app(){
        this.sqlite.get_first((row, err) => {
            if (err || !row) {
                console.log('initialising auth');
                this._init_controller('AuthController','init_auth')
                // init_auth(window)
            } else {
                console.log('initialising main');
                config.privKey=row.privKey;
                // router(window,acc_data)
            }
        }, this.sqlite.tables.account);
    }

    start_listening(){
        this._listen_event(this.ipcMain,this.events.submit_profile,(event, arg) => {
            this._init_controller('AuthController','save_acc',(arg))
        });

        this._listen_event(this.ipcMain,this.events.generate_mnemonic,(event, arg) => {
            this._init_controller('AuthController','generate_mnemonic',(arg))
        });

        // ipcMain.on('generate_mnemonic', () => {
        //     renderer.webContents.send('generate_mnemonic', eth.generate_mnemonic());
        // });
    }
}

// const general_states = {
//     auth: 'auth',
//     offline: 'offline',
//     online: 'online',
// };
//
// const in_app_states = {
//     auth: 'auth',
//     offline: 'offline',
//     online: 'online',
// };


module.exports = Router;
