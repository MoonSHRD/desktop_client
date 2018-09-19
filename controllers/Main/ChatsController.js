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
var Controller = require('../Controller');
var ChatsController = /** @class */ (function (_super) {
    __extends(ChatsController, _super);
    function ChatsController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChatsController.prototype.init_chats = function () {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountModel_1.AccountModel.findOne(1)];
                    case 1:
                        account = _a.sent();
                        console.log(account);
                        if (!!account.address) return [3 /*break*/, 3];
                        account.address = this.dxmpp.get_address();
                        return [4 /*yield*/, account.save()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        this.send_data(this.events.change_app_state, this.render('main/main.pug', account));
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    ChatsController.prototype.load_chat = function (chat, general_chat_type) {
        var html = this.render('main/chatsblock/chats/imDialog.pug', chat);
        console.log({ id: chat.id, type: general_chat_type, html: html });
        this.send_data('buddy', { id: chat.id, type: general_chat_type, html: html });
    };
    ChatsController.prototype.user_online = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(data);
                        return [4 /*yield*/, UserModel_1.UserModel.findOne(data.user.id)];
                    case 1:
                        user = _a.sent();
                        console.log('found user');
                        console.log(user);
                        if (!user) return [3 /*break*/, 2];
                        if (!user.online) {
                            user.online = true;
                            user.save();
                        }
                        user.type = this.chat_types.user;
                        this.load_chat(user, this.general_chat_types.user);
                        return [3 /*break*/, 4];
                    case 2:
                        user = new UserModel_1.UserModel();
                        user.id = data.user.id;
                        user.domain = data.user.domain;
                        user.online = true;
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        this.dxmpp.get_vcard(user);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.user_offline = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserModel_1.UserModel.findOne(data.user.id)];
                    case 1:
                        user = _a.sent();
                        user.type = this.chat_types.user;
                        this.load_chat(user, this.general_chat_types.user);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.get_my_vcard = function () {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountModel_1.AccountModel.findOne(1)];
                    case 1:
                        account = _a.sent();
                        this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', account));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatsController.prototype.user_vcard = function (vcard) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, UserModel_1.UserModel.findOne(vcard.id)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            console.log("user " + user.id + " not found in db");
                        user.avatar = vcard.avatar;
                        user.name = vcard.name;
                        user.bio = vcard.bio;
                        user.firstname = vcard.firstname;
                        user.lastname = vcard.lastname;
                        console.log(user);
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        user.type = this.chat_types.user;
                        this.load_chat(user, this.general_chat_types.user);
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
                    case 0: return [4 /*yield*/, UserModel_1.UserModel.findOne(user.id)];
                    case 1:
                        check = _a.sent();
                        if (!check)
                            this.subscribe(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ChatsController;
}(Controller));
module.exports = ChatsController;
//# sourceMappingURL=ChatsController.js.map