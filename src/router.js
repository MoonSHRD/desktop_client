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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var moonshard_core_1 = require("moonshard_core");
var electron_1 = require("electron");
var ControllerRegister_1 = require("../controllers/ControllerRegister");
var Router = /** @class */ (function () {
    function Router(window) {
        var config = require(__dirname + '/events&types');
        this.window = window;
        this.controller_register = ControllerRegister_1.ControllerRegister.getInstance(window);
        this.online = false;
        this.paths = config.paths;
        this.ipcMain = electron_1.ipcMain;
        this.dxmpp = moonshard_core_1.dxmpp.getInstance();
        this.events = config.events;
        this.types = config.paths;
        this.Controllers = require(config.paths.controllers + 'controllers_list');
    }
    ;
    Router.prototype.init_sqlite = function () {
        var _this = this;
        typeorm_1.createConnection({
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
        }).then(function (connection) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.init_app()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }).catch(function (error) { return console.log(error); });
    };
    Router.prototype.listen_event = function (from, event_name, callback) {
        var _this = this;
        from.on(event_name, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(_this, void 0, void 0, function () {
                var e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, callback.apply(void 0, args)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.log(e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        });
    };
    Router.prototype.start_loading = function () {
        var _this = this;
        setTimeout(function () {
            _this.init_sqlite();
        }, 2000);
    };
    Router.prototype.init_app = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('AuthController', 'init_auth')];
                    case 1:
                        _a.sent();
                        this.start_listening();
                        return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.start_listening = function () {
        /**
         * ipcMain is for listening frontend
         * dxmpp is for listening jackal
         **/
        var _this = this;
        this.listen_event(this.ipcMain, 'submit_profile', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('AuthController', 'save_acc', arg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.ipcMain, 'generate_mnemonic', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('AuthController', 'generate_mnemonic', (arg))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.dxmpp, 'online', function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('jackal connected');
                        this.online = true;
                        return [4 /*yield*/, this.controller_register.run_controller('MenuController', 'init_main')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.dxmpp, 'close', function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('jackal disconnected');
                this.online = false;
                while (!this.online) {
                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.controller_register.run_controller('AuthController', 'init_auth')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 2000);
                }
                return [2 /*return*/];
            });
        }); });
        this.listen_event(this.dxmpp, 'buddy', function (user, state, statusText, resource) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("user " + user.id + " is " + state);
                        return [4 /*yield*/, this.controller_register.run_controller('ChatsController', 'user_change_state', user, state, statusText, resource)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.dxmpp, 'received_vcard', function (vcard) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("got user " + vcard.id + " vcard");
                        // console.log(vcard);
                        return [4 /*yield*/, this.controller_register.run_controller('ChatsController', 'user_vcard', vcard)];
                    case 1:
                        // console.log(vcard);
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.dxmpp, 'error', function (err) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(err);
                return [2 /*return*/];
            });
        }); });
        this.listen_event(this.ipcMain, 'send_subscribe', function (event, data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('ChatsController', 'subscribe', data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.ipcMain, 'get_my_vcard', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('ChatsController', 'get_my_vcard')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.ipcMain, 'get_chat_msgs', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('MessagesController', 'get_chat_messages', arg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.ipcMain, 'send_message', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('MessagesController', 'send_message', arg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.ipcMain, 'change_menu_state', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller_register.run_controller('MenuController', 'load_menu', arg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.ipcMain, 'show_popup', function (event, arg) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(arg);
                        return [4 /*yield*/, this.controller_register.run_controller('ChatsController', 'show_chat_info', arg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.dxmpp, 'subscribe', function (user) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("user " + user.id + " subscribed");
                        return [4 /*yield*/, this.controller_register.run_controller('ChatsController', 'user_subscribed', user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.listen_event(this.dxmpp, 'chat', function (user, message) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("user " + user.id + " subscribed");
                        return [4 /*yield*/, this.controller_register.run_controller('MessagesController', 'received_message', user, message)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return Router;
}());
module.exports = Router;
//# sourceMappingURL=router.js.map