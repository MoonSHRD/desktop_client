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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var typeorm_1 = require("typeorm");
var MessageModel_1 = require("./MessageModel");
var UserModel_1 = require("./UserModel");
var var_helper_1 = require("../src/var_helper");
var AccountModel_1 = require("./AccountModel");
// helper
var ChatModel = /** @class */ (function (_super) {
    __extends(ChatModel, _super);
    function ChatModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.domain = '';
        _this.name = '';
        _this.bio = '';
        _this.avatar = '';
        _this.role = '';
        _this.type = '';
        _this.contract_address = '';
        //
        //
        _this.active = false;
        return _this;
    }
    ChatModel_1 = ChatModel;
    ChatModel.get_user_chat_id = function (self_id, user_id) {
        var sort = [self_id, user_id];
        sort.sort();
        return sort.join('_');
    };
    ChatModel.get_user_chat = function (self_id, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.findOne(ChatModel_1.get_user_chat_id(self_id, user_id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatModel.get_user_chat_with_messages = function (self_id, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.find({ relations: ["messages"], where: { id: ChatModel_1.get_user_chat_id(self_id, user_id) }, take: 1 })];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    ChatModel.get_user_chat_messages = function (self_id, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.get_chat_messages(ChatModel_1.get_user_chat_id(self_id, user_id))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChatModel.get_chat_messages = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.find({ relations: ["messages"], where: { id: chat_id }, take: 1 })];
                    case 1: return [2 /*return*/, (_a.sent())[0].messages];
                }
            });
        });
    };
    ChatModel.get_chats_by_type = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var chats, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = type;
                        switch (_a) {
                            case var_helper_1.helper.chat_types.user: return [3 /*break*/, 1];
                            case var_helper_1.helper.chat_types.group: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, ChatModel_1.find({ where: { type: type }, take: 20 })];
                    case 2:
                        chats = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, ChatModel_1.find({ where: { type: typeorm_1.In(Object.values(var_helper_1.helper.group_chat_types)) }, take: 20 })];
                    case 4:
                        chats = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, chats];
                }
            });
        });
    };
    ChatModel.get_chat_with_users = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.find({ where: { id: chat_id }, relations: ['users'] })];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    ChatModel.get_chat_with_users_messages = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.find({ where: { id: chat_id }, relations: ['users', 'messages'] })];
                    case 1: return [2 /*return*/, (_a.sent())[0]];
                }
            });
        });
    };
    ChatModel.get_chat_users = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.get_chat_with_users(chat_id)];
                    case 1: return [2 /*return*/, (_a.sent()).users];
                }
            });
        });
    };
    ChatModel.get_chat_opponent = function (chat_id) {
        return __awaiter(this, void 0, void 0, function () {
            var opps, account_id, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.get_chat_users(chat_id)];
                    case 1:
                        opps = _a.sent();
                        account_id = 1;
                        return [4 /*yield*/, AccountModel_1.AccountModel.find({ relations: ["user"], where: { id: account_id }, take: 1 })];
                    case 2:
                        account = (_a.sent())[0].user;
                        return [2 /*return*/, opps.find(function (x) { return x.id !== account.id; })];
                }
            });
        });
    };
    ChatModel.prototype.get_user_chat_meta = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ChatModel_1.get_chat_opponent(this.id)];
                    case 1:
                        data = (_a.sent());
                        // this.id=data.id;
                        this.avatar = data.avatar;
                        this.name = data.name;
                        this.domain = data.domain;
                        return [2 /*return*/, data.id];
                }
            });
        });
    };
    var ChatModel_1;
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "domain", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "name", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "bio", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "avatar", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "role", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "type", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatModel.prototype, "contract_address", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return MessageModel_1.MessageModel; }, function (messages) { return messages.chat; }),
        __metadata("design:type", Array)
    ], ChatModel.prototype, "messages", void 0);
    __decorate([
        typeorm_1.ManyToMany(function (type) { return UserModel_1.UserModel; }),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], ChatModel.prototype, "users", void 0);
    ChatModel = ChatModel_1 = __decorate([
        typeorm_1.Entity()
    ], ChatModel);
    return ChatModel;
}(typeorm_1.BaseEntity));
exports.ChatModel = ChatModel;
//# sourceMappingURL=ChatModel.js.map