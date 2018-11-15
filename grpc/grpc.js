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
const env_config_1 = require("../src/env_config");
const ethers = require("ethers");
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
        this.client = new proto['Moonshard'](env_config_1.grpc_config.host + ':' + env_config_1.grpc_config.port, grpc.credentials.createInsecure());
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
                yield sleep(1000 * 60 * 4);
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
    GetUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let userModel = yield UserModel_1.UserModel.findOne(id);
            if (!userModel) {
                userModel = new UserModel_1.UserModel();
                let res = yield this.CallMethod("GetObjData", { id: id, obj: 'user' });
                userModel.id = id;
                userModel.domain = 'localhost';
                if (res.err) {
                    console.log(res.err);
                }
                else {
                    let user = JSON.parse(res.data.data);
                    userModel.name = user.name;
                    userModel.last_active = user.last_active;
                    userModel.avatar = user.avatar;
                    userModel.lastname = user.lastname;
                    userModel.firstname = user.firstname;
                    userModel.name = user.firstname + (user.lastname ? " " + user.lastname : "");
                }
            }
            return userModel;
        });
    }
    // private signData(data) {
    //     if (!this.privKey) {
    //         throw new Error('private key must be set first');
    //     }
    //
    //     let uint_data = Buffer.from(data, 'utf-8');
    //     let uint8_sig = tweetnacl.sign.detached(
    //         uint_data, // message as uint8
    //         this.privKey
    //     );
    //     return CryptoUtils.Uint8ArrayToB64(uint8_sig);
    // }
    SetPrivKey(privKey) {
        let wal = new ethers.Wallet(privKey);
        this.wal = wal;
        let addr = wal.address.toLowerCase();
        let { privateKey, publicKey } = wal['signingKey'].keyPair;
        this.privKey = privateKey;
        this.pubKey = publicKey;
        this.addr = addr;
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
                    data.sign = yield this.wal.signMessage(data.data);
                }
                result.data = yield this.promisedFuncs[method](data);
            }
            catch (e) {
                result.err = e;
                // console.log(e);
            }
            return result;
        });
    }
}
exports.Grpc = Grpc;
//# sourceMappingURL=grpc.js.map