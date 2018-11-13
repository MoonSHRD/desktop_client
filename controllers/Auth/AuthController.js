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
const Helpers_1 = require("../Helpers");
const env_config_1 = require("../../src/env_config");
const ethers = require('ethers');
const bip39 = require('bip39');
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
            // await this.loom.connect(account.privKey);
            // console.log('loom connected');
            yield this.web3.SetAccount(account.privKey);
            this.grpc.SetPrivKey(account.privKey);
            if (first) {
                // let identyti_tx= await this.loom.set_identity(account.user.name);
                // console.log(identyti_tx);
                // this.send_data('user_joined_room', `Identity created. <br/> txHash: ${identyti_tx.transactionHash}`);
                console.log(user);
                // let suc=await this.grpc.CallMethod('SetObjData',{pubKey: this.grpc.pubKey,obj:'user',data:user});
                // console.log(suc);
            }
            this.grpc.StartPinging();
            this.grpc.StartUserPinging();
            let suc = yield this.grpc.CallMethod('SetObjData', { pubKey: this.grpc.pubKey, obj: 'user', data: user });
            this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
            account.host = this.dxmpp_config.host;
            account.jidhost = this.dxmpp_config.jidhost;
            account.port = this.dxmpp_config.port + this.connection_tries;
            yield this.dxmpp.connect(account);
        });
    }
    save_acc(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.controller_register.run_controller('EventsController', 'init_loading');
            // const loom_data=Loom.generate_acc();
            // let wal=ethers.Wallet.fromMnemonic(mnem);
            let mnem = bip39.generateMnemonic();
            const eth_data = ethers.Wallet.fromMnemonic(mnem);
            console.log(eth_data);
            let { privateKey, publicKey } = eth_data.signingKey.keyPair;
            let user = new UserModel_1.UserModel();
            user.id = eth_data.address.toLowerCase();
            user.domain = 'localhost';
            user.self = true;
            user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
            user.firstname = data.firstname;
            user.lastname = data.lastname;
            user.bio = data.bio;
            user.avatar = data.avatar ? (yield Helpers_1.resize_b64_img(data.avatar)) : (yield Helpers_1.resize_img_from_path(this.paths.src + 'img/default-avatar1.jpg'));
            yield user.save();
            let account = new AccountModel_1.AccountModel();
            account.privKey = privateKey;
            account.passphrase = data.mnemonic;
            account.last_chat = env_config_1.bot_acc.addr + '_' + eth_data.address.toLowerCase();
            account.user = user;
            yield account.save();
            yield this.auth(account, true);
        });
    }
    ;
}
module.exports = AuthController;
//# sourceMappingURL=AuthController.js.map