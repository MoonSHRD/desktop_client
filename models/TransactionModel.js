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
var TransactionModel_1;
const typeorm_1 = require("typeorm");
const UserModel_1 = require("./UserModel");
let TransactionModel = TransactionModel_1 = class TransactionModel extends typeorm_1.BaseEntity {
    static getTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TransactionModel_1.findOne(id, { relations: ["from", "to"] });
        });
    }
    static getTransactions(prt = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let take = 15;
            return yield TransactionModel_1.find({ relations: ["from", "to"], take: take, skip: prt * take, order: { time: "DESC" } });
        });
    }
    static NormalizeValue(val) {
        return val / Math.pow(10, 18);
    }
};
__decorate([
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], TransactionModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TransactionModel.prototype, "gas", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TransactionModel.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TransactionModel.prototype, "time", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserModel_1.UserModel, user => user.account),
    typeorm_1.JoinColumn(),
    __metadata("design:type", UserModel_1.UserModel)
], TransactionModel.prototype, "from", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserModel_1.UserModel, user => user.account),
    typeorm_1.JoinColumn(),
    __metadata("design:type", UserModel_1.UserModel)
], TransactionModel.prototype, "to", void 0);
TransactionModel = TransactionModel_1 = __decorate([
    typeorm_1.Entity()
], TransactionModel);
exports.TransactionModel = TransactionModel;
//# sourceMappingURL=TransactionModel.js.map