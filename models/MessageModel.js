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
var MessageModel_1;
const typeorm_1 = require("typeorm");
const UserModel_1 = require("./UserModel");
const ChatModel_1 = require("./ChatModel");
// import {ChatModel} from "./ChatModel";
let MessageModel = MessageModel_1 = class MessageModel extends typeorm_1.BaseEntity {
    // import {ChatModel} from "./ChatModel";
    constructor() {
        super(...arguments);
        this.server_id = 0;
        this.text = '';
        this.time = '';
        this.with_file = false;
    }
    static get_chat_messages_with_sender(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageModel_1.find({ relations: ['sender'], where: { chat: chat_id } });
        });
    }
    static get_chat_messages_with_sender_chat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageModel_1.find({ relations: ['sender', 'chat'], where: { chat: chat_id } });
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MessageModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], MessageModel.prototype, "server_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MessageModel.prototype, "text", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MessageModel.prototype, "time", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], MessageModel.prototype, "with_file", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ChatModel_1.ChatModel, chat => chat.messages),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ChatModel_1.ChatModel)
], MessageModel.prototype, "chat", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserModel_1.UserModel, user => user.messages),
    typeorm_1.JoinColumn(),
    __metadata("design:type", UserModel_1.UserModel)
], MessageModel.prototype, "sender", void 0);
MessageModel = MessageModel_1 = __decorate([
    typeorm_1.Entity()
], MessageModel);
exports.MessageModel = MessageModel;
//# sourceMappingURL=MessageModel.js.map