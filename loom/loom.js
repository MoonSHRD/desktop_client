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
const env_config_1 = require("../src/env_config");
const loom_js_1 = require("loom-js");
const tweetnacl = require("tweetnacl");
const LoomTruffleProvider = require('loom-truffle-provider');
const Web3 = require('web3');
let qbox = require('qbox');
const network_abi = require('./network_abi');
const token_abi = require('./token_abi');
class Loom {
    constructor() {
        this.$ = qbox.create();
    }
    static getInstance() {
        if (!Loom.instance) {
            Loom.instance = new Loom();
        }
        return Loom.instance;
    }
    connect(private_key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.priv = Loom.from_b64(private_key);
            this.pub = loom_js_1.CryptoUtils.publicKeyFromPrivateKey(this.priv);
            this.addr = loom_js_1.LocalAddress.fromPublicKey(this.pub).toString();
            const loomTruffleProvider = new LoomTruffleProvider("default", `http://${env_config_1.loom_config.host}:${env_config_1.loom_config.port}/rpc`, `http://${env_config_1.loom_config.host}:${env_config_1.loom_config.port}/query`, this.priv);
            this.provider = loomTruffleProvider.getProviderEngine();
            this.web3 = new Web3(this.provider);
            this.NetRegContract = new this.web3.eth.Contract(network_abi, env_config_1.loom_config.net_reg_addr, { from: this.addr });
            this.token_addr = yield this.get_token_addr();
            this.MoonshardTokenContract = new this.web3.eth.Contract(token_abi, this.token_addr, { from: this.addr });
            this.token_decimals = yield yield this.MoonshardTokenContract.methods.decimals().call();
        });
    }
    prep_val(value) {
        return (value / Math.pow(10, this.token_decimals)).toFixed(5);
    }
    prep_val_back(value) {
        return value * Math.pow(10, this.token_decimals);
    }
    set_identity(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.NetRegContract.methods.createIdentity(name).send();
        });
    }
    get_identity() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.NetRegContract.methods.myIdentity().call()).toLowerCase();
        });
    }
    get_accs_list() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.provider.accountsAddrList;
        });
    }
    get_accs() {
        return __awaiter(this, void 0, void 0, function* () {
            /** accs with privKeys **/
            return this.provider.accounts;
        });
    }
    get_identity_safely(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let identity = yield this.get_identity();
            if (identity === '0x0000000000000000000000000000000000000000') {
                yield this.set_identity(name);
                identity = yield this.get_identity();
            }
            return identity.toLowerCase();
        });
    }
    get_token_addr() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.NetRegContract.methods.getToken().call()).toLowerCase();
        });
    }
    get_my_balance() {
        return __awaiter(this, void 0, void 0, function* () {
            let val = yield this.MoonshardTokenContract.methods.balanceOf(this.addr).call();
            return this.prep_val(val);
        });
    }
    get_balance(addres) {
        return __awaiter(this, void 0, void 0, function* () {
            let val = yield this.MoonshardTokenContract.methods.balanceOf(addres).call();
            return this.prep_val(val);
        });
    }
    get_total_supply() {
        return __awaiter(this, void 0, void 0, function* () {
            let val = yield this.MoonshardTokenContract.methods.totalSupply().call();
            return this.prep_val(val);
        });
    }
    get_token_name() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.MoonshardTokenContract.methods.name().call();
        });
    }
    get_token_label() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.MoonshardTokenContract.methods.symbol().call();
        });
    }
    set_token_addr(token_addr = '') {
        return __awaiter(this, void 0, void 0, function* () {
            token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
            return yield this.NetRegContract.methods.setToken(token_addr).send();
        });
    }
    transfer_token(address, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.prep_val_back(amount));
            return yield this.MoonshardTokenContract.methods.transfer(address, this.prep_val_back(amount)).send();
        });
    }
    static generate_private() {
        return loom_js_1.CryptoUtils.Uint8ArrayToB64(loom_js_1.CryptoUtils.generatePrivateKey());
    }
    static generate_address(privKey) {
        return loom_js_1.LocalAddress.fromPublicKey(privKey).toString();
    }
    static generate_acc() {
        let priv = loom_js_1.CryptoUtils.generatePrivateKey();
        let pub = loom_js_1.CryptoUtils.publicKeyFromPrivateKey(priv);
        let addr = loom_js_1.LocalAddress.fromPublicKey(pub).toString();
        return {
            priv: Loom.to_b64(priv),
            pub: Loom.to_b64(pub),
            addr: addr
        };
    }
    static to_b64(uint8) {
        return loom_js_1.CryptoUtils.Uint8ArrayToB64(uint8);
    }
    static from_b64(str) {
        return loom_js_1.CryptoUtils.B64ToUint8Array(str);
    }
    pub_as_hex() {
        return loom_js_1.CryptoUtils.bytesToHexAddr(this.pub).toLowerCase();
    }
    sign_data(data) {
        let uint_data = Buffer.from(data, 'utf-8');
        let uint8_sig = tweetnacl.sign.detached(uint_data, // message as uint8
        this.priv);
        return loom_js_1.CryptoUtils.Uint8ArrayToB64(uint8_sig);
    }
}
exports.Loom = Loom;
//# sourceMappingURL=loom.js.map