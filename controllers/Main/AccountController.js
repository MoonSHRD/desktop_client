"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Controller_1 = require("../Controller");
const AccountModel_1 = require("../../models/AccountModel");
class AccountController extends Controller_1.Controller {
    update_directory(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = (yield AccountModel_1.AccountModel.find({ where: { id: 1 } }))[0];
            account.downloads = path;
            yield account.save();
        });
    }
    ;
    update_last_chat(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = (yield AccountModel_1.AccountModel.find({ where: { id: 1 } }))[0];
            account.last_chat = chat_id;
            yield account.save();
        });
    }
    change_windows_size(width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = (yield AccountModel_1.AccountModel.find({ where: { id: 1 } }))[0];
            account.width = width;
            account.height = height;
            yield account.save();
        });
    }
    ;
    change_chats_width(width) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = (yield AccountModel_1.AccountModel.find({ where: { id: 1 } }))[0];
            account.width_chats = width;
            yield account.save();
        });
    }
    ;
    set_sizes(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let me = yield this.get_me(id);
            yield this.send_data("set_chats_width", me.width_chats);
            let sizes = { width: me.width, height: me.height };
            yield this.send_data("set_windows_size", sizes);
        });
    }
    ;
}
module.exports = AccountController;
//# sourceMappingURL=AccountController.js.map