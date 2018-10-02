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
const loom_1 = require("../../loom/loom");
// let {TextDecoder} = require('text-encoding');
class AuthController extends Controller_1.Controller {
    init_auth() {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield AccountModel_1.AccountModel.findOne(1);
            if (account)
                yield this.auth(account);
            else
                this.send_data(this.events.change_app_state, this.render('auth/123.pug'));
        });
    }
    ;
    generate_mnemonic() {
        this.send_data(this.events.generate_mnemonic, this.eth.generate_mnemonic());
    }
    ;
    auth(account, first = false) {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.controller_register.run_controller('MenuController', 'init_main');
            // console.log(account.privKey);
            yield this.loom.connect(account.privKey);
            console.log('loom connected');
            if (first) {
                let identyti_tx = yield this.loom.set_identity(account.user.name);
                console.log(identyti_tx);
                this.send_data('user_joined_room', `Identity created. <br/> txHash: ${identyti_tx.transactionHash}`);
            }
            // console.log(await this.loom.get_identity());
            // console.log(await this.loom.token_addr);
            // console.log(await this.loom.get_total_supply());
            // console.log(await this.loom.get_my_balance());
            // console.log(await this.loom.get_balance('0x0000000000000000000000000000000000000000'));
            account.host = this.dxmpp_config.host;
            account.jidhost = this.dxmpp_config.jidhost;
            account.port = this.dxmpp_config.port;
            yield this.dxmpp.connect(account);
        });
    }
    save_acc(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.run_controller('EventsController', 'init_loading');
            // const privKey = this.eth.generate_priv_key();
            // const privKey = Loom.generate_private();
            // const address = this.eth.generate_address(privKey);
            // const address = Loom.generate_address(privKey);
            const loom_data = loom_1.Loom.generate_acc();
            let user = new UserModel_1.UserModel();
            user.id = loom_data.addr;
            user.domain = 'localhost';
            user.self = true;
            user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.bio = data.bio;
            user.avatar = data.avatar;
            yield user.save();
            let account = new AccountModel_1.AccountModel();
            account.privKey = loom_data.priv; //TextDecoder.encode(loom_data.priv);
            // account.pubKey = loom_data.pub;
            // console.log(
            //     account.privKey,
            //     account.pubKey
            // );
            // account.privKeyLoom = Loom.generate_private();
            account.passphrase = data.mnemonic;
            account.user = user;
            yield account.save();
            this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
            yield this.auth(account, true);
        });
    }
    ;
}
module.exports = AuthController;
//# sourceMappingURL=AuthController.js.map