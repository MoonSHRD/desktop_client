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
const env_config_1 = require("./env_config");
const { NonceTxMiddleware, SignedTxMiddleware, Client, ClientEvent, LoomProvider, Contract, Address, LocalAddress, CryptoUtils, BluePrintCreateAccountTx, createJSONRPCClient } = require('loom-js');
const LoomTruffleProvider = require('loom-truffle-provider');
const Web3 = require('web3');
const ABI = require('./network_abi');
class Loom {
    constructor(private_key) {
        this.priv = CryptoUtils.B64ToUint8Array(private_key);
        this.pub = CryptoUtils.publicKeyFromPrivateKey(this.priv);
        this.addr = LocalAddress.fromPublicKey(this.priv).toString();
        const loomTruffleProvider = new LoomTruffleProvider("default", "http://" + env_config_1.config.host + ":46658/rpc", "http://" + env_config_1.config.host + ":46658/query", this.priv);
        this.provider = loomTruffleProvider.getProviderEngine();
        this.web3 = new Web3(this.provider);
        this.NetReg = new this.web3.eth.Contract(ABI, env_config_1.config.net_reg_addr, { from: this.addr });
    }
    static getInstance(private_key = "") {
        if (!Loom.instance) {
            if (!private_key)
                console.log(new Error('private key must be specified'));
            private_key = CryptoUtils.generatePrivateKey();
            Loom.instance = new Loom(private_key);
        }
        return Loom.instance;
    }
    set_identity(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.NetReg.methods.createIdentity(name).send();
        });
    }
    get_identity() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.NetReg.methods.myIdentity().call();
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
            return identity;
        });
    }
    get_token_addr() {
        return __awaiter(this, void 0, void 0, function* () {
            let token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
            return yield this.NetReg.methods.gettToken(token_addr).call();
        });
    }
    set_token_addr(token_addr = '') {
        return __awaiter(this, void 0, void 0, function* () {
            token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
            return yield this.NetReg.methods.setToken(token_addr).send();
        });
    }
}
exports.Loom = Loom;
//# sourceMappingURL=loom.js.map