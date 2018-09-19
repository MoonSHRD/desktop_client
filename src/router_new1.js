"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ipcMain = require('electron').ipcMain;
var dxmpp = require('moonshard_core').dxmpp;
// const {events, chat_types} = require('./events&types.js');
// const {ChannelWorker, ChannelWorkerEVM} = require('./cipher/cither');
// const {CryptoUtils} = require('loom-js');
// const LoomTruffleProvider = require('loom-truffle-provider');
// const Web3 = require('web3');
// const contractAddress = "0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8";
// const sqlite = require('./dbup');
// let {config,PUG_OPTIONS} = require('./config');
// let qbox = require('qbox');
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var Router = /** @class */ (function () {
    function Router(window) {
        var config = require(__dirname + '/events&types');
        this.window = window;
        this.online = false;
        this.paths = config.paths;
        this.ipcMain = ipcMain;
        this.dxmpp = dxmpp.getInstance();
        this.events = config.events;
        this.types = config.paths;
        this.Controllers = require(config.paths.controllers + 'controllers_list');
    }
    ;
    Router.prototype.init_controller = function (controller, func, data) {
        if (data === void 0) { data = null; }
        var cr_controller = new this.Controllers[controller](this.window);
        return cr_controller[func](data);
    };
    ;
    Router.prototype.init_sqlite = function () {
        var _this = this;
        typeorm_1.createConnection({
            type: "sqlite",
            database: "sqlite/data.db",
            entities: [
                this.paths.models + "*.js"
            ],
            synchronize: true,
            logging: false
        }).then(function (connection) {
            _this.init_app();
        }).catch(function (error) { return console.log(error); });
    };
    Router.prototype.listen_event = function (from, event_name, callback) {
        from.on(event_name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                callback.apply(void 0, args);
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    Router.prototype.start_loading = function () {
        var _this = this;
        setTimeout(function () {
            _this.init_sqlite();
        }, 2000);
    };
    Router.prototype.init_app = function () {
        this.init_controller('AuthController', 'init_auth');
        this.start_listening();
    };
    Router.prototype.start_listening = function () {
        var _this = this;
        this.listen_event(this.ipcMain, 'submit_profile', function (event, arg) {
            _this.init_controller('AuthController', 'save_acc', arg);
        });
        this.listen_event(this.ipcMain, 'generate_mnemonic', function (event, arg) {
            _this.init_controller('AuthController', 'generate_mnemonic', (arg));
        });
        this.listen_event(this.dxmpp, 'online', function (data) {
            console.log('jackal connected');
            _this.online = true;
            _this.init_controller('ChatsController', 'init_chats');
        });
        this.listen_event(this.dxmpp, 'close', function () {
            console.log('jackal disconnected');
            _this.online = false;
            while (!_this.online) {
                setTimeout(function () {
                    _this.init_controller('AuthController', 'init_auth');
                }, 2000);
            }
        });
        this.listen_event(this.dxmpp, 'buddy', function (user, state, statusText, resource) {
            console.log("user " + user.id + " is " + state);
            _this.init_controller('ChatsController', "user_" + state, { user: user, statusText: statusText, resource: resource });
        });
        this.listen_event(this.dxmpp, 'received_vcard', function (vcard) {
            console.log("got user " + vcard.id + " vcard");
            console.log(vcard);
            _this.init_controller('ChatsController', 'user_vcard', vcard);
        });
        this.listen_event(this.dxmpp, 'error', function (err) {
            console.log(err);
        });
        this.listen_event(this.ipcMain, 'send_subscribe', function (event, data) {
            _this.init_controller('ChatsController', "subscribe", data);
        });
        this.listen_event(this.ipcMain, 'get_my_vcard', function () {
            _this.init_controller('ChatsController', 'get_my_vcard');
        });
        this.listen_event(this.dxmpp, 'subscribe', function (user) {
            console.log("user " + user.id + " subscribed");
            _this.init_controller('ChatsController', 'user_subscribed', user);
        });
    };
    return Router;
}());
module.exports = Router;
//# sourceMappingURL=router_new1.js.map