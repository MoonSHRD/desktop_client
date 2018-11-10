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
let SettingsModel = class SettingsModel extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.downloads = "./downloads/";
        this.width = 1000;
        this.height = 700;
        this.width_chats = 370;
        this.language = "en";
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SettingsModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SettingsModel.prototype, "downloads", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SettingsModel.prototype, "width", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SettingsModel.prototype, "height", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SettingsModel.prototype, "width_chats", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SettingsModel.prototype, "last_chat", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], SettingsModel.prototype, "language", void 0);
SettingsModel = __decorate([
    typeorm_1.Entity()
], SettingsModel);
exports.SettingsModel = SettingsModel;
//# sourceMappingURL=SettingsModel.js.map