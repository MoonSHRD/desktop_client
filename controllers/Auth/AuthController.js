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
const Helpers_1 = require("../Helpers");
// let {TextDecoder} = require('text-encoding');
class AuthController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.connection_tries = -1;
    }
    init_auth() {
        return __awaiter(this, void 0, void 0, function* () {
            let account = yield AccountModel_1.AccountModel.findOne(1);
            if (account)
                yield this.auth(account);
            else
                this.send_data(this.events.change_app_state, this.render('auth/auth.pug'));
        });
    }
    ;
    generate_mnemonic() {
        this.send_data(this.events.generate_mnemonic, this.eth.generate_mnemonic());
    }
    ;
    auth(account, first = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.get_self_info();
            // let user_json=JSON.stringify(user);
            if (this.connection_tries === 9)
                this.connection_tries = 0;
            else
                this.connection_tries += 1;
            yield this.ipfs.connect();
            console.log('ipfs connected');
            // console.log(account);
            // await this.ipfs.ipfs_info();
            yield this.loom.connect(account.privKey);
            console.log('loom connected');
            this.grpc.SetPrivKey(account.privKey);
            console.log('1');
            if (first) {
                let identyti_tx = yield this.loom.set_identity(account.user.name);
                console.log('2');
                // console.log(identyti_tx);
                this.send_data('user_joined_room', `Identity created. <br/> txHash: ${identyti_tx.transactionHash}`);
                console.log('3');
                console.log(user);
                let suc = yield this.grpc.CallMethod('SetObjData', { pubKey: this.loom.priv_as_hex(), obj: 'user', data: user });
                console.log('4');
                // console.log(suc);
            }
            this.grpc.StartPinging();
            console.log('5');
            this.grpc.StartUserPinging();
            console.log('6');
            this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
            account.host = this.dxmpp_config.host;
            account.jidhost = this.dxmpp_config.jidhost;
            account.port = this.dxmpp_config.port + this.connection_tries;
            yield this.dxmpp.connect(account);
            console.log('7');
        });
    }
    save_acc(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.run_controller('EventsController', 'init_loading');
            const loom_data = loom_1.Loom.generate_acc();
            let user = new UserModel_1.UserModel();
            user.id = loom_data.addr;
            user.domain = 'localhost';
            user.self = true;
            user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.bio = data.bio;
            user.avatar = data.avatar ? (yield Helpers_1.resize_b64_img(data.avatar)) : (yield Helpers_1.resize_img_from_path(this.paths.components + 'auth/default-avatar1.jpg'));
            yield user.save();
            let account = new AccountModel_1.AccountModel();
            account.privKey = loom_data.priv;
            account.passphrase = data.mnemonic;
            account.last_chat = '0x0000000000000000000000000000000000000000_' + loom_data.addr;
            account.user = user;
            yield account.save();
            yield this.auth(account, true);
        });
    }
    ;
}
module.exports = AuthController;
//# sourceMappingURL=AuthController.js.map