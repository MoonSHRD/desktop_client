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
var AccountModel = /** @class */ (function (_super) {
    __extends(AccountModel, _super);
    function AccountModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.privKeyLoom = "";
        return _this;
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], AccountModel.prototype, "id", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], AccountModel.prototype, "privKey", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], AccountModel.prototype, "privKeyLoom", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], AccountModel.prototype, "passphrase", void 0);
    __decorate([
        typeorm_1.OneToOne(function (type) { return UserModel_1.UserModel; }, function (user) { return user.account; }),
        typeorm_1.JoinColumn(),
        __metadata("design:type", UserModel_1.UserModel)
    ], AccountModel.prototype, "user", void 0);
    AccountModel = __decorate([
        typeorm_1.Entity()
    ], AccountModel);
    return AccountModel;
}(typeorm_1.BaseEntity));
exports.AccountModel = AccountModel;
//# sourceMappingURL=AccountModel.js.map