import {config} from "../src/env_config";
import {LocalAddress, CryptoUtils} from 'loom-js';

// const {
//     NonceTxMiddleware, SignedTxMiddleware, Client, ClientEvent, LoomProvider,
//     Contract, Address, LocalAddress, CryptoUtils, BluePrintCreateAccountTx, createJSONRPCClient
// } = require('loom-js');

const LoomTruffleProvider = require('loom-truffle-provider');
const Web3 = require('web3');
let qbox = require('qbox');
const network_abi = require('./network_abi');
const token_abi = require('./token_abi');

export class Loom {

    private static instance: Loom;
    private provider: any;
    private priv: any;
    private pub: any;
    private addr: any;
    public token_addr: string=config.token_addr;
    private web3: any;
    private NetReg: any;
    private Token: any;
    private $: any = qbox.create();

    public static getInstance() {
        if (!Loom.instance) {
            Loom.instance = new Loom();
        }
        return Loom.instance;
    }

    async connect(private_key: string) {
        this.priv = CryptoUtils.B64ToUint8Array(private_key);
        this.pub = CryptoUtils.publicKeyFromPrivateKey(this.priv);
        this.addr = LocalAddress.fromPublicKey(this.pub).toString();
        const loomTruffleProvider = new LoomTruffleProvider(
            "default",
            "http://" + config.host + ":46658/rpc",
            "http://" + config.host + ":46658/query",
            this.priv,
        );
        this.provider = loomTruffleProvider.getProviderEngine();


        this.web3 = new Web3(this.provider);
        this.NetReg = new this.web3.eth.Contract(network_abi, config.net_reg_addr, {from: this.addr});
        this.NetReg.methods.setToken(config.token_addr).send();

        // this.token_addr=await this.get_token_addr();
        this.Token=new this.web3.eth.Contract(token_abi, this.token_addr, {from: this.addr});
    }

    async set_identity(name: string) {
        return await this.NetReg.methods.createIdentity(name).send();
    }

    async get_identity() {
        return (await this.NetReg.methods.myIdentity().call()).toLowerCase();
    }

    async get_accs_list() {
        return this.provider.accountsAddrList;
    }

    async get_accs() {
        /** accs with privKeys **/
        return this.provider.accounts;
    }

    async get_identity_safely(name: string) {
        let identity = await this.get_identity();
        if (identity === '0x0000000000000000000000000000000000000000') {
            await this.set_identity(name);
            identity = await this.get_identity();
        }
        return identity.toLowerCase();
    }

    // async get_token_addr() {
    //     let token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
    //     return (await this.NetReg.methods.gettToken(token_addr).call()).toLowerCase();
    // }

    async get_my_balance() {
        return await this.Token.methods.balanceOf(this.addr).call();
    }

    async get_balance(addres) {
        return await this.Token.methods.balanceOf(addres).call();
    }

    async get_total_supply() {
        // let token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
        return await this.Token.methods.totalSupply().call();
    }

    async set_token_addr(token_addr: string = '') {
        token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
        return await this.NetReg.methods.setToken(token_addr).send();
    }

    static generate_private(): string {
        return CryptoUtils.Uint8ArrayToB64(CryptoUtils.generatePrivateKey());
    }
}
