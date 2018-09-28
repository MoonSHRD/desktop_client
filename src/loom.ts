import {config} from "./env_config";

const {
    NonceTxMiddleware, SignedTxMiddleware, Client, ClientEvent, LoomProvider,
    Contract, Address, LocalAddress, CryptoUtils, BluePrintCreateAccountTx, createJSONRPCClient
} = require('loom-js');
const LoomTruffleProvider = require('loom-truffle-provider')
const Web3 = require('web3')

const ABI = require('./network_abi');


export class Loom {

    private static instance: Loom;
    readonly provider: any;
    readonly priv: any;
    private pub: any;
    readonly addr: any;
    private web3: any;
    private NetReg: any;

    private constructor(private_key: string) {
        this.priv = CryptoUtils.B64ToUint8Array(private_key);
        this.pub = CryptoUtils.publicKeyFromPrivateKey(this.priv);
        this.addr = LocalAddress.fromPublicKey(this.priv).toString();
        const loomTruffleProvider = new LoomTruffleProvider(
            "default",
            "http://" + config.host + ":46658/rpc",
            "http://" + config.host + ":46658/query",
            this.priv,
        );
        this.provider = loomTruffleProvider.getProviderEngine();


        this.web3 = new Web3(this.provider);
        this.NetReg = new this.web3.eth.Contract(ABI, config.net_reg_addr, {from: this.addr})
    }

    public static getInstance(private_key: string = "") {
        if (!Loom.instance) {
            if (!private_key)
                console.log(new Error('private key must be specified'));
                private_key=CryptoUtils.generatePrivateKey();
            Loom.instance = new Loom(private_key);
        }
        return Loom.instance;
    }

    async set_identity(name:string) {
        return await this.NetReg.methods.createIdentity(name).send();
    }

    async get_identity() {
        return await this.NetReg.methods.myIdentity().call();
    }

    async get_accs_list() {
        return this.provider.accountsAddrList;
    }

    async get_accs() {
        /** accs with privKeys **/
        return this.provider.accounts;
    }

    async get_identity_safely(name:string) {
        let identity = await this.get_identity();
        if (identity === '0x0000000000000000000000000000000000000000') {
            await this.set_identity(name);
            identity = await this.get_identity();
        }
        return identity;
    }

    async get_token_addr() {
        let token_addr='0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
        return await this.NetReg.methods.gettToken(token_addr).call();
    }

    async set_token_addr(token_addr:string='') {
        token_addr='0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
        return await this.NetReg.methods.setToken(token_addr).send();
    }
}
