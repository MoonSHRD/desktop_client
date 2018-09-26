"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var AccountModel_1 = require("../../models/AccountModel");
var UserModel_1 = require("../../models/UserModel");
var Controller_1 = require("../Controller");
var ChatModel_1 = require("../../models/ChatModel");
var MessageModel_1 = require("../../models/MessageModel");
var MenuController = /** @class */ (function (_super) {
    __extends(MenuController, _super);
    function MenuController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuController.prototype.init_main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, fafa;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('init_main');
                        return [4 /*yield*/, this.generate_initial_chats()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.get_self_info()];
                    case 2:
                        self_info = _a.sent();
                        self_info.online = false;
                        fafa = new UserModel_1.UserModel();
                        fafa.avatar = self_info.avatar;
                        fafa.name = self_info.name;
                        // fafa.
                        // console.log(fafa);
                        // console.log(self_info);
                        // let html=this.render('main/main.pug',fafa);
                        // this.send_data('change_menu_state', html);
                        this.send_data(this.events.change_app_state, this.render('main/main.pug', fafa));
                        return [4 /*yield*/, this.load_menu_initial(true)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MenuController.prototype.load_menu = function (menu) {
        return __awaiter(this, void 0, void 0, function () {
            var menu_func, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        menu_func = "";
                        return [4 /*yield*/, AccountModel_1.AccountModel.findOne(1)];
                    case 1:
                        account = _a.sent();
                        if (typeof this["load_" + menu] === 'function')
                            menu_func = "load_" + menu;
                        else
                            menu_func = "load_menu_default";
                        return [4 /*yield*/, this[menu_func](account)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MenuController.prototype.load_menu_user_chats = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, fafa, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        fafa = new UserModel_1.UserModel();
                        fafa.avatar = self_info.avatar;
                        fafa.name = self_info.name;
                        html = this.render('main/chatsblock/chatsblock.pug', fafa) +
                            this.render('main/messagingblock/messagingblock.pug');
                        //     include chatsblock/chatsblock.pug
                        // include messagingblock/messagingblock.pug
                        this.send_data('change_menu_state', html);
                        return [4 /*yield*/, this.controller_register.run_controller_synchronously('ChatsController', 'load_chats', this.chat_types.user)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuController.prototype.load_menu_chats = function (account) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, fafa, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        fafa = new UserModel_1.UserModel();
                        fafa.avatar = self_info.avatar;
                        fafa.name = self_info.name;
                        fafa.state = this.chat_to_menu.group;
                        html = this.render('main/chatsblock/chatsblock.pug', fafa) +
                            this.render('main/messagingblock/messagingblock.pug');
                        //     include chatsblock/chatsblock.pug
                        // include messagingblock/messagingblock.pug
                        this.send_data('change_menu_state', html);
                        return [4 /*yield*/, this.controller_register.run_controller_synchronously('ChatsController', 'load_chats', this.chat_types.group)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MenuController.prototype.generate_initial_chats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var initial_user, initial_user_chat, initial_user_message, self_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        return [4 /*yield*/, UserModel_1.UserModel.findOne('0x0000000000000000000000000000000000000000')];
                    case 2:
                        if (!!(_a.sent())) return [3 /*break*/, 6];
                        initial_user = new UserModel_1.UserModel();
                        initial_user.id = '0x0000000000000000000000000000000000000000';
                        initial_user.avatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWYAAAFCBAMAAAAwNWoFAAAAD1BMVEVARVs0wvY+WnU6eZ02oM20bOaiAAAHwElEQVR42u2dabKjOBCEBeIABvsAMNEHMDd48v0PNd2grbSA5JhopSaq/swbG6KTz4mWUoGE4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODgAIt3f5Llqz/N+/zpDvM8z/1hnuelP8zza+0O89yXow/MnTlaac1Lf5h7crTB3JGjLeaOHH1i3nty9HSIfY49OfrE/BZDP47WmIUY+3G0wSw06KUjzAZ0B452mEUvjt4c5t/Rh6NnD3MnjqaY+3A0xdyFowPMXTg6xNyBo2PM+I6OMcM7OoEZftSRwgzu6C0jDtjR2gSxNmBH5zADOzqLGdjR24UwUEdfYIZ19BVmUEfLK8ygjr5JwIzXl9QQ88VdBgj6Ps+l0EDL+3vsFxrokpUIMNCy5A4DA1224AMFWpY1ZFCgS9fVgEDL0v4CCHT58iUMaFneLcOArlklBgEta0Y/IKDrFuMhQMu6QeaEALq25gEA9FQ7O51S6bG/Gye2n+oz3s0x15/y7Alzc9BfYG4O+hvMjUF/hblxGz19hVmDfrLmv+KNppprnTkqAM2VeWV9VlvNdXlljbm15vmbk1prXuoxN9dc4ehtBtFc4egZRvNcjRlA81KLGUBzoaM3JM2Fjp6hNM+VmCE0L3WYITQXOHpD01zg6BlO81yFuaXmlyp19Oj07o01e/TWQszHOS01l3aGujbwOK615iOZu9yD1rV3x6y3teajNXhud6A15iPR/26u+chA39Zn6Is6/iOaax4sugvQur7jSG0822s+5DxuQJ/LAT/jmcRprvk09HUhjME8ndnF9pqPXsV0Ge8rzKerVwDNWsiQ75IN5uPy9BltNU8nwwvQBvOo7dNes1GSBW0xS51Hba/Z/OJZ0Abz+YusEJq1oXOgLeZDvDmhseZBY8yA3u2nSmsF0Hz2KiIDWtoPjZ0RNAsjKgnaYZ7MHwiadzO1SoB2mE/fCxDNgwGYAO0wWztDaLaGjkHL4EnTBUXzGDwB64H2ME92ZQ5Bs+lVYtAeZtuMg2h2cgLQHmbbo4Bodj87BU2WL934GkKzu70oaL+EQLrrgtDsGVrX0D0jzJOTj6F59xJ2iowvrLednUE0D544C5ouxiv3N4Zm16t4eAnm0TsCQ7PwiWrQtB7GszOKZt/Q3itwXMZj89YCQDT7htagacLDa1lQNE+kzEdFmEf/AkA0E00O9CJS1wSimfz2FrRbzNpCbyNoJqIM6IWMScmxCJqpoU/Q3pqh8q8ARTM19HkJC52uPNA0i2BSpQjmicxeYDTvdF1zIsloYmcczUMw41b+CrgiKmE0U8v+/tbDPNIFcRjNoaHlkx7pNSo4mgND755RaOMNpJkKk74sFR+JoZkaYPfuyKDtBtJMlEnf3TKo7cbRTBzgJ2POZnCF1OwZWpJimODuRNI80TwXTc08MTW7XkWSqqPQzkiaXa+y27nVOxoggWk2vh3pHHYLq8KQNJth0kZzBaGdoTRrQ2vMpgxljIokkDTrFPMp9mPKUKboaSEozUevYktm/BqkFVbz5t5H/LG3okoeBqN5onm6LVMuCKV5pFW67n9/cDW7RN3qvBIvgWNp3mkxtEzXGWNpHoJ06J4sdsbSLIOac5myM6bmNTDLQ8D7+RNexAtYs4xbCYXe1m2RfXUTjdsPjnGvN6U6FSTNpgt5XX4EpXlMPKqiUr03Wq6A3oTuMl6Qmr1Z4CNoSGDzSHqIT2Z/Z1mmmkFzjGZ6QmbZu/eAwg+eZlOIRJJzypX8A65N2DokP2tksqPbDLlu5eq9vF5lMjckBY20Rn+iDAqPbCWuA41Uv3EK8Qyt7AIyAY2h2a+qk/avcaaVjli1PUNYsPiwdl7ch1B1X7RKlNQ5mybEBw2heYjsOtsB0ioi0DD1z65ZMDnycY6KUs5jEDT/Smz08qNvRjf+p4X9rTWHb/BS3sNMDxGDBtD8K8y7bOcXO72S0R4G8rwVmWzr56pUck7wRtAcYdbDJBl+bEGDPKdJM5+HkYcog2RAN9eceuXYbp/5fosE6OaaVW4/HRU/iKxX7jHeV5B8li2Xgmz+voL02xVzr13YEd5lkXkByJ5cR/FzB801h5htembNXUxzzc/cV/F7DyWK5gizGeklhO0YmlP/fPZ1qRJD8zvx3XbzUH1jzc/8d6lvZFPNV6+CkHld+5evUv1v4m57qE/+Sl+NJF/uqPPP71jzF9oK83e7zqummIv21EnfnI92mgv2LgrdrJpvgyZrbyiETQUqGy4AzNWgIfZuqASNgLkSNAbmOtAYmKtAo2CuAY2CuQI0DuZy0DvQ5meybBAvoTaZ24t2vUDCXAgaC3MZaCzMRaBly5nrl6DLPA8FGg/zPUY8zLccETHfgUTEfEMSE/M1SkzMlyxRMV/BRMV8QRMXc35EgYs5O3JDxpwDjYw5A3qExpze4bN1jrxsZv2JMb+EwAZNMhjomBNZfHzMsaPxMUeO7gFz6OihA8yBo/vATB3dB2bi6LF++bApaIf504FmuwXr7aYqODGaFe1+MFvQHWG2oLeOMNMNxtZONI8qfvqxH9CvtRvNFvQiRHegO5JsQPeE2YBeu9Is+sN8Tqo6w/wHdG+Y/4B+d6dZPAUHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHx/84/gUCC5fJSH7KuAAAAABJRU5ErkJggg==';
                        initial_user.online = false;
                        initial_user.domain = 'localhost';
                        initial_user.name = 'Moonshard support';
                        initial_user.firstname = 'Moonshard';
                        initial_user.lastname = 'support';
                        initial_user.bio = 'Moonshard support';
                        return [4 /*yield*/, initial_user.save()];
                    case 3:
                        _a.sent();
                        initial_user_chat = new ChatModel_1.ChatModel();
                        initial_user_chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, initial_user.id);
                        initial_user_chat.type = this.chat_types.user;
                        initial_user_chat.users = [self_info, initial_user];
                        return [4 /*yield*/, initial_user_chat.save()];
                    case 4:
                        _a.sent();
                        initial_user_message = new MessageModel_1.MessageModel();
                        initial_user_message.time = '00:00';
                        initial_user_message.chat = initial_user_chat;
                        initial_user_message.sender = initial_user;
                        initial_user_message.text = 'Hello my friend!';
                        return [4 /*yield*/, initial_user_message.save()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [4 /*yield*/, UserModel_1.UserModel.findOne('0x0000000000000000000000000000000000000001')];
                    case 7:
                        if (!!(_a.sent())) return [3 /*break*/, 12];
                        initial_user = new UserModel_1.UserModel();
                        initial_user.id = '0x0000000000000000000000000000000000000001';
                        initial_user.avatar = 'data:image/png;base64,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';
                        initial_user.online = false;
                        initial_user.domain = 'localhost';
                        initial_user.name = 'Moonshard support';
                        initial_user.firstname = 'Moonshard';
                        initial_user.lastname = 'support';
                        initial_user.bio = 'Moonshard support';
                        return [4 /*yield*/, initial_user.save()];
                    case 8:
                        _a.sent();
                        initial_user_chat = new ChatModel_1.ChatModel();
                        initial_user_chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, initial_user.id);
                        initial_user_chat.type = this.chat_types.user;
                        initial_user_chat.users = [self_info, initial_user];
                        return [4 /*yield*/, initial_user_chat.save()];
                    case 9:
                        _a.sent();
                        initial_user_message = new MessageModel_1.MessageModel();
                        initial_user_message.time = '00:00';
                        initial_user_message.chat = initial_user_chat;
                        initial_user_message.sender = initial_user;
                        initial_user_message.text = 'Hello my friend!';
                        return [4 /*yield*/, initial_user_message.save()];
                    case 10:
                        _a.sent();
                        initial_user_message = new MessageModel_1.MessageModel();
                        initial_user_message.time = '00:00';
                        initial_user_message.chat = initial_user_chat;
                        initial_user_message.sender = self_info;
                        initial_user_message.text = 'Hello my friend!';
                        return [4 /*yield*/, initial_user_message.save()];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    // private load_menu_chats(){
    //     html = pug.renderFile(__dirname + '/components/main/file.pug', obj, PUG_OPTIONS);
    //     renderer.webContents.send('change_menu_state', html);
    //     sqlite.fetch((row) => {
    //         console.log('buddy');
    //         row.type = chat_types.channel;
    //         const html = pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', row, PUG_OPTIONS);
    //         row.html = html;
    //         // console.log(row);
    //         row.type = "menu_chats";
    //         renderer.webContents.send('buddy', row);
    //     }, sqlite.tables.chat);
    // }
    MenuController.prototype.load_menu_create_chat = function () {
        this.send_data('get_my_vcard', this.render('main/modal_popup/create_chat.pug'));
    };
    MenuController.prototype.load_menu_initial = function (first) {
        if (first === void 0) { first = false; }
        return __awaiter(this, void 0, void 0, function () {
            var self_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('load_menu_default');
                        return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        return [4 /*yield*/, this.controller_register.run_controller_synchronously('ChatsController', 'load_chats', this.chat_types.user, first)];
                    case 2:
                        _a.sent();
                        if (!first) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.controller_register.run_controller_synchronously('MessagesController', 'get_chat_messages', '0x0000000000000000000000000000000000000000_' + self_info.id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MenuController.prototype.load_menu_default = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.send_data(this.events.change_menu_state, this.render('main/file.pug', { state: "menu_under_construction" }));
                return [2 /*return*/];
            });
        });
    };
    return MenuController;
}(Controller_1.Controller));
module.exports = MenuController;
//# sourceMappingURL=MenuController.js.map