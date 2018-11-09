import * as grpc from 'grpc';
import * as util from 'util';
import * as protoLoader from '@grpc/proto-loader';
import {UserModel} from "../models/UserModel";
import {LocalAddress, CryptoUtils} from 'loom-js';
import * as tweetnacl from 'tweetnacl';

let PROTO_PATH = __dirname + '/proto/moonshard.proto';

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    });
}
export class Grpc {
    readonly client;
    private static identity: Grpc;
    private promisedFuncs = {};
    public addr: string;
    public pubKey: string;
    private privKey: Uint8Array;

    private constructor() {
        let packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
        let proto = grpc.loadPackageDefinition(packageDefinition).moonshard;

        this.client = new proto['Moonshard']('localhost:50051',
            grpc.credentials.createInsecure());
    }

    static getIntance() {
        if (!this.identity)
            this.identity = new Grpc();
        return this.identity;
    }

    async StartPinging() {
        while (true) {
            let result = await this.CallMethod("Ping", {pubKey: this.pubKey});
            // console.log(result);
            await sleep(1000 * 60 * 5);
        }
    }

    async StartUserPinging() {
        while (true) {
            (async () => {
                let users = await UserModel.find();
                // console.log(users);
                for (let i in users) {
                    let user: UserModel = users[i];
                    // console.log(user.id);
                    let result = await this.CallMethod("GetObjData", {id: user.id,obj:'user'});
                    // console.log(result);
                    if (result.err)
                        console.log("error pinging user "+user.id,result.err);
                    else if (result.data.data!='null') {
                        // console.log(result.data.data);
                        let user_data = JSON.parse(result.data.data);
                        // console.log(user_data);
                        user.last_active = user_data.last_active;
                        await user.save();
                    }
                }
            })();
            await sleep(1000 * 60 * 5);
        }
    }

    private signData(data) {
        if (!this.privKey) {
            throw new Error('private key must be set first');
        }

        let uint_data = Buffer.from(data, 'utf-8');
        let uint8_sig = tweetnacl.sign.detached(
            uint_data, // message as uint8
            this.privKey
        );
        return CryptoUtils.Uint8ArrayToB64(uint8_sig);
    }

    SetPrivKey(privKey: string) {
        this.privKey = CryptoUtils.B64ToUint8Array(privKey);
        let pub = CryptoUtils.publicKeyFromPrivateKey(this.privKey);
        this.pubKey = CryptoUtils.bytesToHexAddr(pub).toLowerCase();
        this.addr = LocalAddress.fromPublicKey(pub).toString();
    }

    async CallMethod(method: string, data): Promise<{ err, data }> {
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
                data.sign = this.signData(data.data)
            }
            result.data = await this.promisedFuncs[method](data);
        } catch (e) {
            result.err = e;
        }
        return result;
    }
}
