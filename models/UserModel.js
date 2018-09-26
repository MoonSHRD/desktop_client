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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const ChatModel_1 = require("./ChatModel");
const MessageModel_1 = require("./MessageModel");
let UserModel = class UserModel extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.name = '';
        this.firstname = '';
        this.lastname = '';
        this.bio = '';
        this.avatar = '';
        this.online = false;
        this.self = false;
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "domain", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "firstname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "lastname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "bio", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], UserModel.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], UserModel.prototype, "online", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], UserModel.prototype, "self", void 0);
__decorate([
    typeorm_1.OneToMany(type => MessageModel_1.MessageModel, message => message.chat),
    __metadata("design:type", Array)
], UserModel.prototype, "messages", void 0);
__decorate([
    typeorm_1.ManyToMany(type => ChatModel_1.ChatModel),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], UserModel.prototype, "chats", void 0);
UserModel = __decorate([
    typeorm_1.Entity()
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map