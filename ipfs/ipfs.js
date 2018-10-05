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
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('142.93.226.135', '5001');
// ipfs.id((err, res) => {
//     if (err) throw err;
//     console.log({
//         id: res.id,
//         version: res.agentVersion,
//         protocol_version: res.protocolVersion
//     })
// });
// const obj = {
//     Data: new Buffer(JSON.stringify({text: "sobaka"})),
//     Links: []
// };
// ipfs.object.put(obj, (err, node) => {
//     if (err) {
//         throw err
//     }
//     // console.log(node.toJSON().multihash)
//     const multihash=node.toJSON().multihash;
//
//
//     ipfs.object.data(multihash, (err, data) => {
//         if (err) {
//             throw err
//         }
//         console.log(data.toString())
//     })
// });
const env_config_1 = require("../src/env_config");
class Ipfs {
    static getInstance() {
        if (!Ipfs.instance) {
            Ipfs.instance = new Ipfs();
        }
        return Ipfs.instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = ipfsAPI(env_config_1.ipfs_config.host, env_config_1.ipfs_config.port);
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
            // let response = ipfs.files.get(ipfsId);
            console.log(response);
            console.log(response[0]);
            console.log(response[0].content);
            console.log(response[0].content.toString());
            return JSON.parse(response[0].content.toString());
            // let ipfsId = response[0].hash;
            // console.log(ipfsId);
            // return ipfsId;
        });
    }
}
exports.Ipfs = Ipfs;
//# sourceMappingURL=ipfs.js.map