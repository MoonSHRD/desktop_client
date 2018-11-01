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
const ipfsAPI = require('ipfs-api');
class Ipfs {
    static getInstance() {
        if (!Ipfs.instance) {
            Ipfs.instance = new Ipfs();
        }
        return Ipfs.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = ipfsAPI(env_config_1.ipfs_config.host, env_config_1.ipfs_config.port, { protocol: 'https' });
        });
    }
    ipfs_info() {
        return __awaiter(this, void 0, void 0, function* () {
            let info = yield this.connection.id();
            console.log(info);
        });
    }
    add_file(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = Buffer.from(JSON.stringify(file));
            let response = yield this.connection.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) });
            console.log(response);
            let ipfsId = response[0].hash;
            console.log(ipfsId);
            return ipfsId;
        });
    }
    get_file(ipfsId) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield this.connection.get(ipfsId, { progress: (prog) => console.log(`received: ${prog}`) });
            return JSON.parse(response[0].content.toString());
        });
    }
}
exports.Ipfs = Ipfs;
//# sourceMappingURL=ipfs.js.map