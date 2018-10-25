"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var ChatModel_1;
const typeorm_1 = require("typeorm");
const MessageModel_1 = require("./MessageModel");
const UserModel_1 = require("./UserModel");
const var_helper_1 = require("../src/var_helper");
const AccountModel_1 = require("./AccountModel");
const EventModel_1 = require("./EventModel");
const FileModel_1 = require("./FileModel");
// helper
let ChatModel = ChatModel_1 = class ChatModel extends typeorm_1.BaseEntity {
    // helper
    constructor() {
        super(...arguments);
        this.domain = '';
        this.name = '';
        this.bio = '';
        this.avatar = '';
        this.role = '';
        this.type = '';
        this.contract_address = '';
        this.active = false;
        this.online = false;
        this.time = null;
        this.text = null;
        this.senderId = null;
    }
    static get_user_chat_id(self_id, user_id) {
        let sort = [self_id, user_id];
        sort.sort();
        return sort.join('_');
    }
    static get_user_chat(self_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChatModel_1.findOne(ChatModel_1.get_user_chat_id(self_id, user_id));
        });
    }
    static get_user_chat_raw(self_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat_id = ChatModel_1.get_user_chat_id(self_id, user_id);
            return (yield typeorm_1.getConnection()
                .createQueryRunner()
                .query(`select * from 
                   ((select id,usr.domain as domain,usr.name as name,usr.avatar as avatar, usr.online as online, type
                   from chat_model ch
                       inner join (
                               select name, avatar, id user_id, online, domain
                               from user_model 
                               where user_model.id == "${user_id}"
                           ) usr 
                       on instr(ch.id,user_id) > 0
                       where ch.id == "${chat_id}") ch2
                   left join (
                           select time, text, chatId, senderId
                           from message_model msg
                           group by msg.chatId
                           order by msg.time
                       ) msg
                       on msg.chatId = ch2.id) ch3
                   order by ch3.time`))[0];
        });
    }
    ;
    static get_chat_with_events(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ChatModel_1.find({ relations: ['events'], where: { id: chat_id } }))[0];
        });
    }
    static get_user_chat_with_messages(self_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ChatModel_1.find({ relations: ["messages"], where: { id: ChatModel_1.get_user_chat_id(self_id, user_id) }, take: 1 }))[0];
        });
    }
    static get_user_chat_messages(self_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ChatModel_1.get_chat_messages(ChatModel_1.get_user_chat_id(self_id, user_id));
        });
    }
    static get_chat_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ChatModel_1.find({ relations: ["messages"], where: { id: chat_id }, take: 1 }))[0].messages;
        });
    }
    static get_chats_by_type(type) {
        return __awaiter(this, void 0, void 0, function* () {
            let chats;
            switch (type) {
                case var_helper_1.helper.chat_types.user:
                    chats = yield ChatModel_1.find({ where: { type: type }, take: 20 });
                    break;
                case var_helper_1.helper.chat_types.group:
                    chats = yield ChatModel_1.find({ where: { type: typeorm_1.In(Object.values(var_helper_1.helper.group_chat_types)) }, take: 20 });
            }
            return chats;
        });
    }
    static get_chat_with_users(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ChatModel_1.find({ where: { id: chat_id }, relations: ['users'] }))[0];
        });
    }
    static get_chat_with_users_messages(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ChatModel_1.find({ where: { id: chat_id }, relations: ['users', 'messages'] }))[0];
        });
    }
    static get_chat_users(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield ChatModel_1.get_chat_with_users(chat_id)).users;
        });
    }
    static get_chat_opponent(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let opps = yield ChatModel_1.get_chat_users(chat_id);
            let account_id = 1;
            let account = (yield AccountModel_1.AccountModel.find({ relations: ["user"], where: { id: account_id }, take: 1 }))[0].user;
            return opps.find(x => x.id !== account.id);
        });
    }
    get_user_chat_meta() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = (yield ChatModel_1.get_chat_opponent(this.id));
            this.avatar = data.avatar;
            this.name = data.name;
            this.online = data.online;
            this.domain = data.domain;
            return data.id;
        });
    }
    static get_chats_with_last_msgs(self_info) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield typeorm_1.getConnection()
                .createQueryRunner()
                .query(`select * from 
                   ((select id,usr.domain as domain,usr.name as name,usr.avatar as avatar, usr.online as online, type
                   from chat_model ch
                       inner join (
                               select name, avatar, id user_id, online, domain
                               from user_model 
                               where user_model.id != "${self_info.id}"
                           ) usr 
                       on instr(ch.id,user_id) > 0
                       where ch.type == "${var_helper_1.chat_types.user}"
                   UNION
                   select id,domain,name,avatar, 0 as online, type
                       from chat_model ch1
                       where ch1.type != "${var_helper_1.chat_types.user}") ch2
                   left join (
                           select time, text, chatId, senderId
                           from message_model msg
                           group by msg.chatId
                           order by msg.time
                       ) msg
                       on msg.chatId = ch2.id) ch3
                   order by ch3.time`));
        });
    }
};
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
    typeorm_1.OneToMany(type => MessageModel_1.MessageModel, messages => messages.chat),
    __metadata("design:type", Array)
], ChatModel.prototype, "messages", void 0);
__decorate([
    typeorm_1.OneToMany(type => EventModel_1.EventModel, events => events.chat),
    __metadata("design:type", Array)
], ChatModel.prototype, "events", void 0);
__decorate([
    typeorm_1.ManyToMany(type => UserModel_1.UserModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], ChatModel.prototype, "users", void 0);
__decorate([
    typeorm_1.OneToMany(type => FileModel_1.FileModel, files => files.chat),
    __metadata("design:type", Array)
], ChatModel.prototype, "files", void 0);
ChatModel = ChatModel_1 = __decorate([
    typeorm_1.Entity()
], ChatModel);
exports.ChatModel = ChatModel;
//# sourceMappingURL=ChatModel.js.map