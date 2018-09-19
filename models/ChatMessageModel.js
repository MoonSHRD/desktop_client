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
var ChatMessageModel = /** @class */ (function (_super) {
    __extends(ChatMessageModel, _super);
    function ChatMessageModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chat = '';
        _this.text = '';
        _this.time = '';
        return _this;
        // @ManyToOne(type => UserModel, user => user.messages)
        // sender: UserModel;
        //
        // @ManyToOne(type => ChatModel, chat => chat.messages)
        // chat: UserModel;
    }
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], ChatMessageModel.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatMessageModel.prototype, "sender", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatMessageModel.prototype, "chat", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatMessageModel.prototype, "text", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], ChatMessageModel.prototype, "time", void 0);
    ChatMessageModel = __decorate([
        typeorm_1.Entity()
    ], ChatMessageModel);
    return ChatMessageModel;
}(typeorm_1.BaseEntity));
exports.ChatMessageModel = ChatMessageModel;
//# sourceMappingURL=ChatMessageModel.js.map