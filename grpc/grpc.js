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
const grpc = require("grpc");
const util = require("util");
const protoLoader = require("@grpc/proto-loader");
const UserModel_1 = require("../models/UserModel");
const loom_js_1 = require("loom-js");
const tweetnacl = require("tweetnacl");
let PROTO_PATH = __dirname + '/proto/moonshard.proto';
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
class Grpc {
    constructor() {
        this.promisedFuncs = {};
        let packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
        let proto = grpc.loadPackageDefinition(packageDefinition).moonshard;
        this.client = new proto['Moonshard']('localhost:50051', grpc.credentials.createInsecure());
    }
    static getIntance() {
        if (!this.identity)
            this.identity = new Grpc();
        return this.identity;
    }
    StartPinging() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                let result = yield this.CallMethod("Ping", { pubKey: this.pubKey });
                // console.log(result);
                yield sleep(1000 * 60 * 5);
            }
        });
    }
    StartUserPinging() {
        return __awaiter(this, void 0, void 0, function* () {
            while (true) {
                (() => __awaiter(this, void 0, void 0, function* () {
                    let users = yield UserModel_1.UserModel.find();
                    // console.log(users);
                    for (let i in users) {
                        let user = users[i];
                        // console.log(user.id);
                        let result = yield this.CallMethod("GetObjData", { id: user.id, obj: 'user' });
                        // console.log(result);
                        if (result.err)
                            console.log("error pinging user " + user.id, result.err);
                        else if (result.data.data != 'null') {
                            // console.log(result.data.data);
                            let user_data = JSON.parse(result.data.data);
                            // console.log(user_data);
                            user.last_active = user_data.last_active;
                            yield user.save();
                        }
                    }
                }))();
                yield sleep(1000 * 60 * 5);
            }
        });
    }
    signData(data) {
        if (!this.privKey) {
            throw new Error('private key must be set first');
        }
        let uint_data = Buffer.from(data, 'utf-8');
        let uint8_sig = tweetnacl.sign.detached(uint_data, // message as uint8
        this.privKey);
        return loom_js_1.CryptoUtils.Uint8ArrayToB64(uint8_sig);
    }
    SetPrivKey(privKey) {
        this.privKey = loom_js_1.CryptoUtils.B64ToUint8Array(privKey);
        let pub = loom_js_1.CryptoUtils.publicKeyFromPrivateKey(this.privKey);
        this.pubKey = loom_js_1.CryptoUtils.bytesToHexAddr(pub).toLowerCase();
        this.addr = loom_js_1.LocalAddress.fromPublicKey(pub).toString();
    }
    CallMethod(method, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.promisedFuncs[method])
                this.promisedFuncs[method] = util
                    .promisify(this.client[method])
                    .bind(this.client);
            let result = {
                data: {},
                err: null
            };
            try {
                if (data.data) {
                    data.data = JSON.stringify(data.data);
                    data.sign = this.signData(data.data);
                }
                result.data = yield this.promisedFuncs[method](data);
            }
            catch (e) {
                result.err = e;
            }
            return result;
        });
    }
}
exports.Grpc = Grpc;
//# sourceMappingURL=grpc.js.map