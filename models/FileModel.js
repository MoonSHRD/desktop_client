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
// import {ChatModel} from "./ChatModel";
let FileModel = class FileModel extends typeorm_1.BaseEntity {
    // import {ChatModel} from "./ChatModel";
    constructor() {
        super(...arguments);
        this.chat_id = '';
        this.usernmame = '';
        this.link = '';
        this.filename = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FileModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FileModel.prototype, "chat_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FileModel.prototype, "usernmame", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FileModel.prototype, "link", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FileModel.prototype, "filename", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], FileModel.prototype, "message_id", void 0);
FileModel = __decorate([
    typeorm_1.Entity()
], FileModel);
exports.FileModel = FileModel;
//# sourceMappingURL=FileModel.js.map