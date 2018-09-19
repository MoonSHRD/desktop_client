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
var UserModel_1 = require("./UserModel");
var UserMessageModel = /** @class */ (function (_super) {
    __extends(UserMessageModel, _super);
    function UserMessageModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // @Column()
        // sender: string;
        // @Column()
        // chat: string = '';
        _this.text = '';
        _this.time = '';
        return _this;
        // @ManyToOne(type => ChatModel, chat => chat.users)
        // chat: UserModel;
    }
    __decorate([
        typeorm_1.PrimaryColumn(),
        __metadata("design:type", String)
    ], UserMessageModel.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserMessageModel.prototype, "text", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], UserMessageModel.prototype, "time", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return UserModel_1.UserModel; }, function (user) { return user.messages; }),
        __metadata("design:type", UserModel_1.UserModel)
    ], UserMessageModel.prototype, "sender", void 0);
    UserMessageModel = __decorate([
        typeorm_1.Entity()
    ], UserMessageModel);
    return UserMessageModel;
}(typeorm_1.BaseEntity));
exports.UserMessageModel = UserMessageModel;
//# sourceMappingURL=UserMessageModel.js.map