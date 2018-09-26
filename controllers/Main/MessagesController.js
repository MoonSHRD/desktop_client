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
var UserModel_1 = require("../../models/UserModel");
var Controller_1 = require("../Controller");
var MessageModel_1 = require("../../models/MessageModel");
var ChatModel_1 = require("../../models/ChatModel");
var MessagesController = /** @class */ (function (_super) {
    __extends(MessagesController, _super);
    function MessagesController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // private static async get_user_and_acc(id) {
    //     let account = await AccountModel.findOne(1);
    //     let userModel = await UserModel.findOne(id);
    //     return {account, userModel}
    // }
    // async get_user_chat_messages(user) {
    //     console.log("user id: "+user.id);
    //     let self_info=await this.get_self_info();
    //     let userModel = await UserModel.findOne(user.id);
    //     let chat=await ChatModel.get_user_chat_with_messages(self_info.id,user.id);
    //     // let messages = await ChatModel.get_user_chat_messages(self_info.id,userModel.id);
    //
    //     // console.log(userModel);
    //     // userModel.type=this.chat_types.user;
    //     let html = this.render('main/messagingblock/qqq.pug', chat);
    //     this.send_data('reload_chat', html);
    //
    //     chat.messages.forEach((message) => {
    //         this.render_message(message, self_info, userModel);
    //     });
    // };
    MessagesController.prototype.load_join_chat = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            var q_chats, chat;
            return __generator(this, function (_a) {
                q_chats = this.controller_register.get_controller_parameter('ChatsController', 'queried_chats');
                chat = q_chats[chat_id];
                chat.type = this.group_chat_types.join_channel;
                this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug', chat));
                return [2 /*return*/];
            });
        });
    };
    MessagesController.prototype.get_chat_messages = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            var chat, _a, html;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('get_chat_messages');
                        return [4 /*yield*/, ChatModel_1.ChatModel.findOne(chat_id)];
                    case 1:
                        chat = _b.sent();
                        // ChatModel.
                        if (!chat)
                            return [2 /*return*/, this.load_join_chat(chat_id)];
                        _a = chat.type;
                        switch (_a) {
                            case this.chat_types.user: return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, chat.get_user_chat_meta()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        html = this.render('main/messagingblock/qqq.pug', chat);
                        // console.log(html);
                        this.send_data('reload_chat', html);
                        return [4 /*yield*/, this.render_chat_messages(chat_id)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MessagesController.prototype.render_message = function (message, chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, html, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        message.sender_avatar = message.sender.avatar;
                        message.mine = (self_info.id === message.sender.id);
                        html = this.render('main/messagingblock/message.pug', message);
                        data = {
                            id: chat_id,
                            message: html,
                        };
                        this.send_data('received_message', data);
                        return [2 /*return*/];
                }
            });
        });
    };
    MessagesController.prototype.render_chat_messages = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            var messages;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MessageModel_1.MessageModel.get_chat_messages_with_sender(chat_id)];
                    case 1:
                        messages = _a.sent();
                        messages.forEach(function (message) {
                            // message.sender_avatar=message.sender.avatar;
                            // message.mine=(self_info.id===message.sender.id);
                            _this.render_message(message, chat_id);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    MessagesController.prototype.send_message = function (_a) {
        var id = _a.id, text = _a.text;
        return __awaiter(this, void 0, void 0, function () {
            var self_info, chat, date, message, group, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _c.sent();
                        return [4 /*yield*/, ChatModel_1.ChatModel.findOne(id)];
                    case 2:
                        chat = _c.sent();
                        date = new Date();
                        message = new MessageModel_1.MessageModel();
                        message.sender = self_info;
                        message.text = text;
                        message.time = date.getHours() + ":" + date.getMinutes();
                        message.chat = chat;
                        return [4 /*yield*/, message.save()];
                    case 3:
                        _c.sent();
                        if (!(chat.type === this.chat_types.user)) return [3 /*break*/, 5];
                        _b = chat;
                        return [4 /*yield*/, chat.get_user_chat_meta()];
                    case 4:
                        _b.id = _c.sent();
                        group = false;
                        return [3 /*break*/, 6];
                    case 5:
                        if (Object.values(this.group_chat_types).includes(chat.type)) {
                            group = true;
                        }
                        _c.label = 6;
                    case 6:
                        this.dxmpp.send(chat, text, group);
                        return [4 /*yield*/, this.render_message(message, id)];
                    case 7:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MessagesController.prototype.received_message = function (user, text) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, userModel, chat, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        return [4 /*yield*/, UserModel_1.UserModel.findOne(user.id)];
                    case 2:
                        userModel = _a.sent();
                        return [4 /*yield*/, ChatModel_1.ChatModel.get_user_chat(self_info.id, user.id)];
                    case 3:
                        chat = _a.sent();
                        message = new MessageModel_1.MessageModel();
                        message.text = text;
                        message.sender = userModel;
                        message.chat = chat;
                        message.time = this.dxmpp.take_time();
                        return [4 /*yield*/, message.save()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.render_message(message, chat.id)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MessagesController.prototype.received_group_message = function (room_data, message, sender, stamp) {
        return __awaiter(this, void 0, void 0, function () {
            var self_info, userModel, chat, messageModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_self_info()];
                    case 1:
                        self_info = _a.sent();
                        if (self_info.id === sender.address)
                            return [2 /*return*/];
                        if (!sender) return [3 /*break*/, 3];
                        return [4 /*yield*/, UserModel_1.UserModel.findOne(sender.address)];
                    case 2:
                        userModel = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, ChatModel_1.ChatModel.findOne(room_data.id)];
                    case 4:
                        chat = _a.sent();
                        messageModel = new MessageModel_1.MessageModel();
                        messageModel.text = message;
                        messageModel.sender = userModel;
                        messageModel.chat = chat;
                        messageModel.time = stamp ? stamp : this.dxmpp.take_time();
                        return [4 /*yield*/, messageModel.save()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.render_message(messageModel, chat.id)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return MessagesController;
}(Controller_1.Controller));
module.exports = MessagesController;
//# sourceMappingURL=MessagesController.js.map