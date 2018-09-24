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
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var ChatModel_1 = require("./ChatModel");
var MessageModel_1 = require("./MessageModel");
var UserModel = /** @class */ (function (_super) {
    __extends(UserModel, _super);
    function UserModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '';
        _this.firstname = '';
        _this.lastname = '';
        _this.bio = '';
        _this.avatar = '';
        _this.online = false;
        _this.self = false;
        return _this;
    }
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
        typeorm_1.OneToMany(function (type) { return MessageModel_1.MessageModel; }, function (message) { return message.chat; }),
        __metadata("design:type", Array)
    ], UserModel.prototype, "messages", void 0);
    __decorate([
        typeorm_1.ManyToMany(function (type) { return ChatModel_1.ChatModel; }),
        typeorm_1.JoinTable(),
        __metadata("design:type", Array)
    ], UserModel.prototype, "chats", void 0);
    UserModel = __decorate([
        typeorm_1.Entity()
    ], UserModel);
    return UserModel;
}(typeorm_1.BaseEntity));
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map