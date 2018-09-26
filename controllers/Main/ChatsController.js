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
// import {AccountModel} from "../../models/AccountModel";
var UserModel_1 = require("../../models/UserModel");
var Controller_1 = require("../Controller");
var ChatModel_1 = require("../../models/ChatModel");
var ChatsController = /** @class */ (function (_super) {
    __extends(ChatsController, _super);
    function ChatsController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChatsController.prototype.init_chats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        // let account = await AccountModel.findOne(1);
                        // console.log(account);
                        // if (!account.address) {
                        //     account.address = this.dxmpp.get_address();
                        //     await account.save();
                        // }
                        self_info.state = 'menu_chats';
                        this.send_data(this.events.change_app_state, this.render('main/main.pug', { state: '' }));
                        // todo: load all chats.
                        return [4 /*yield*/, this.load_chats(this.chat_types.user)];
                    case 2:
                        // todo: load all chats.
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    ChatsController.prototype.load_chat = function (chat, general_chat_type) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(chat.type === this.chat_types.user)) return [3 /*break*/, 2];
                        return [4 /*yield*/, chat.get_user_chat_meta()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        html = this.render('main/chatsblock/chats/imDialog.pug', chat);
                        // console.log({id: chat.id, type: general_chat_type, html: html});
                        this.send_data('buddy', { id: chat.id, type: general_chat_type, html: html });
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.user_change_state = function (user, state, statusText, resource) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, userModel, chat, user_chat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        return [4 /*yield*/, UserModel_1.UserModel.findOne(user.id)];
                    case 2:
                        userModel = _a.sent();
                        if (!userModel) return [3 /*break*/, 6];
                        userModel.online = state === 'online';
                        return [4 /*yield*/, userModel.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, ChatModel_1.ChatModel.get_user_chat(self_info.id, user.id)];
                    case 4:
                        chat = _a.sent();
                        // user.type = this.chat_types.user;
                        return [4 /*yield*/, this.load_chat(chat, this.chat_to_menu.user)];
                    case 5:
                        // user.type = this.chat_types.user;
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        userModel = new UserModel_1.UserModel();
                        userModel.id = user.id;
                        userModel.domain = user.domain;
                        userModel.online = true;
                        console.log('saving new user ' + userModel.id);
                        console.log(userModel);
                        return [4 /*yield*/, userModel.save()];
                    case 7:
                        _a.sent();
                        user_chat = new ChatModel_1.ChatModel();
                        user_chat.id = ChatModel_1.ChatModel.get_user_chat_id(self_info.id, user.id);
                        user_chat.type = this.chat_types.user;
                        user_chat.users = [self_info, userModel];
                        return [4 /*yield*/, user_chat.save()];
                    case 8:
                        _a.sent();
                        // console.log(e);
                        this.dxmpp.get_vcard(user);
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.load_chats = function (type, first) {
        if (first === void 0) { first = false; }
        return __awaiter(this, void 0, void 0, function () {
            var self_info, chats, menu_chat;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('load_chats');
                        return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        return [4 /*yield*/, ChatModel_1.ChatModel.get_chats_by_type(type)];
                    case 2:
                        chats = _a.sent();
                        if (type === this.chat_types.user) {
                            menu_chat = this.chat_to_menu.user;
                        }
                        else if (type === this.chat_types.group) {
                            menu_chat = this.chat_to_menu.group;
                        }
                        // console.log(chats);
                        // switch (type) {
                        //     case this.chat_types.user:
                        //         chats=await UserModel.find({take:20});
                        //         break;
                        //     case this.chat_types.channel:
                        //         chats=await ChatModel.find({take:20});
                        //         break;
                        //     default:
                        //         break;
                        // }
                        if (!chats.length)
                            return [2 /*return*/];
                        return [4 /*yield*/, chats.forEach(function (chat) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (chat.id === '0x0000000000000000000000000000000000000000_' + self_info.id && first)
                                                chat.active = true;
                                            // console.log(chat);
                                            return [4 /*yield*/, this.load_chat(chat, menu_chat)];
                                        case 1:
                                            // console.log(chat);
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.show_chat_info = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!Object.values(this.group_chat_types).includes(data.type)) return [3 /*break*/, 4];
                        _a = data.type;
                        switch (_a) {
                            case this.group_chat_types.channel: return [3 /*break*/, 1];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, ChatModel_1.ChatModel.findOne(data.id)];
                    case 2:
                        user = _b.sent();
                        this.send_data('get_my_vcard', this.render('main/modal_popup/group_info.pug', user));
                        return [3 /*break*/, 3];
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        if (!(data.type === this.chat_types.user)) return [3 /*break*/, 6];
                        return [4 /*yield*/, ChatModel_1.ChatModel.get_chat_opponent(data.id)];
                    case 5:
                        user = _b.sent();
                        // let user = chat.get_chat_opponent();
                        // chat.id = await chat.get_user_chat_meta();
                        // chat.id=id;
                        this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', user));
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.get_my_vcard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        // return ret;
                        // console.log(ret);
                        this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', self_info));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.user_vcard = function (vcard) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, user, chat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        return [4 /*yield*/, UserModel_1.UserModel.findOne(vcard.id)];
                    case 2:
                        user = _a.sent();
                        if (!user)
                            console.log("user " + user.id + " not found in db");
                        user.avatar = vcard.avatar;
                        user.name = vcard.name;
                        user.bio = vcard.bio;
                        user.firstname = vcard.firstname;
                        user.lastname = vcard.lastname;
                        // console.log(user);
                        return [4 /*yield*/, user.save()];
                    case 3:
                        // console.log(user);
                        _a.sent();
                        // try {
                        //     await user.save();
                        // } catch (e) {
                        //     console.log(e);
                        //     return;
                        // }
                        user.type = this.chat_types.user;
                        return [4 /*yield*/, ChatModel_1.ChatModel.get_user_chat(self_info.id, user.id)];
                    case 4:
                        chat = _a.sent();
                        return [4 /*yield*/, this.load_chat(chat, this.chat_to_menu.user)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.subscribe = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("subscribing to user " + user.id);
                this.dxmpp.subscribe(user);
                return [2 /*return*/];
            });
        });
    };
    ChatsController.prototype.user_subscribed = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var check;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.dxmpp.acceptSubscription(user);
                        return [4 /*yield*/, UserModel_1.UserModel.findOne(user.id)];
                    case 1:
                        check = _a.sent();
                        if (!!check) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.subscribe(user)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.joined_room = function (room_data) {
        return __awaiter(this, void 0, void 0, function () {
            var chat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chat = new ChatModel_1.ChatModel();
                        chat.id = room_data.id;
                        chat.domain = room_data.domain;
                        chat.avatar = room_data.avatar;
                        chat.name = room_data.name;
                        chat.type = room_data.channel === "1" ? this.group_chat_types.channel : this.group_chat_types.group;
                        chat.role = room_data.role;
                        if (room_data.bio)
                            chat.bio = room_data.bio;
                        if (room_data.contractaddress)
                            chat.contract_address = room_data.contractaddress;
                        return [4 /*yield*/, chat.save()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.load_chat(chat, this.chat_to_menu.group)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.create_group = function (group_name) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                group = { name: group_name, domain: "localhost" };
                this.dxmpp.register_channel(group, '');
                return [2 /*return*/];
            });
        });
    };
    ChatsController.prototype.find_groups = function (group_name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dxmpp.find_group(group_name);
                return [2 /*return*/];
            });
        });
    };
    ChatsController.prototype.join_chat = function (chat) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.dxmpp.join(chat);
                return [2 /*return*/];
            });
        });
    };
    ChatsController.prototype.user_joined_room = function (user, room_data) {
        return __awaiter(this, void 0, void 0, function () {
            var chat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(room_data);
                        return [4 /*yield*/, ChatModel_1.ChatModel.findOne(room_data.id)];
                    case 1:
                        chat = _a.sent();
                        console.log(chat);
                        this.send_data('user_joined_room', "user " + user.id + " joined " + chat.name);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.found_groups = function (result) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.queried_chats = {};
                // let html = "";
                console.log(result);
                result.forEach(function (group) { return __awaiter(_this, void 0, void 0, function () {
                    var st, chat;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(group);
                                st = group.jid.split('@');
                                group.id = st[0];
                                group.domain = st[1];
                                return [4 /*yield*/, ChatModel_1.ChatModel.findOne(group.id)];
                            case 1:
                                chat = _a.sent();
                                if (chat)
                                    group.type = chat.type;
                                else
                                    group.type = group.channel === '1' ? this.group_chat_types.join_channel : this.group_chat_types.join_group;
                                // if (chats[group.id]) return;
                                // group.contract_address = group.contractaddress;
                                // let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
                                // console.log({id: chat.id, type: general_chat_type, html: html});
                                this.queried_chats[group.id] = group;
                                this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', group));
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return ChatsController;
}(Controller_1.Controller));
module.exports = ChatsController;
//# sourceMappingURL=ChatsController.js.map