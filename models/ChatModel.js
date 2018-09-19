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
var ChatModel = /** @class */ (function (_super) {
    __extends(ChatModel, _super);
    function ChatModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bio = '';
        _this.avatar = '';
        _this.role = '';
        _this.type = '';
        _this.contract_address = '';
        return _this;
        // @OneToMany(type => MessageModel, message => message.chat)
        // messages: MessageModel[];
        //
        //
        // @ManyToMany(type => UserModel)
        // @JoinTable()
        // users: UserModel[];
        // get_users_chats(){
        //     ChatModel.find({where:{users:Between(1, 10)}})
        // }
    }
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
    ChatModel = __decorate([
        typeorm_1.Entity()
    ], ChatModel);
    return ChatModel;
}(typeorm_1.BaseEntity));
exports.ChatModel = ChatModel;
//# sourceMappingURL=ChatModel.js.map