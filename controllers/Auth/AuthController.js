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
const AccountModel_1 = require("../../models/AccountModel");
const Controller_1 = require("../Controller");
const UserModel_1 = require("../../models/UserModel");
class AuthController extends Controller_1.Controller {
    init_auth() {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield AccountModel_1.AccountModel.findOne(1);
            if (account)
                this.auth(account);
            else
                this.send_data(this.events.change_app_state, this.render('auth/123.pug'));
        });
    }
    ;
    generate_mnemonic() {
        this.send_data(this.events.generate_mnemonic, this.eth.generate_mnemonic());
    }
    ;
    auth(account) {
        account.host = this.dxmpp_config.host;
        account.jidhost = this.dxmpp_config.jidhost;
        account.port = this.dxmpp_config.port;
        this.dxmpp.connect(account);
    }
    save_acc(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const privKey = this.eth.generate_priv_key();
            const address = this.eth.generate_address(privKey);
            let user = new UserModel_1.UserModel();
            user.id = address;
            user.domain = 'localhost';
            user.self = true;
            user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.bio = data.bio;
            user.avatar = data.avatar;
            yield user.save();
            let account = new AccountModel_1.AccountModel();
            account.privKey = privKey;
            account.privKeyLoom = "fwafawfawfwa";
            account.passphrase = data.mnemonic;
            account.user = user;
            yield account.save();
            this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
            this.auth(account);
        });
    }
    ;
}
module.exports = AuthController;
//# sourceMappingURL=AuthController.js.map