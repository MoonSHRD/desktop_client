const {
    Client, ClientEvent,
    Contract, Address, LocalAddress, CryptoUtils, createJSONRPCClient
} = require('loom-js')
const Web3 = require('web3')

const LoomTruffleProvider = require('loom-truffle-provider')

const {
    CreateChannelTx, CreateChannelResp, StateQueryParams,
    Null, WrapStr, WrapInt
} = require('./types_pb')

const crypto = require('crypto');
const dif = require('js-x25519');
const helpers = require('./helpers/helpers.js');
let qbox = require('qbox');

const server_addr="http://192.168.1.7:46658"
// const contractAddress="0x6ee704a7efbbeb37045d53159bc62ccf80d9b776"
const ABI = require('./abi.json');

async function getContract(privateKey, publicKey) {

    const client = new Client(
        "default",
        createJSONRPCClient({protocols:[{url:server_addr+"/rpc"}]}),
        createJSONRPCClient({protocols:[{url:server_addr+"/query"}]}),
    )

    client.on(ClientEvent.Error, err => console.log(err || 'Unexpected Client Error'))
    const contractAddr = await client.getContractAddressAsync('ChannelService',{})
    if (!contractAddr) {
        throw new Error('Failed to resolve contract address')
    }
    // console.log()
    const callerAddr = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
    return new Contract({
        contractAddr,
        callerAddr,
        client
    })
}

class ChannelWorker {
    constructor(){
        // const key=CryptoUtils.generatePrivateKey()
        // console.log(CryptoUtils.bytesToHex(key))
        this.$ = qbox.create();
    }

    set_privkey(privkey){
        this._privateKey = privkey
        this._publicKey = CryptoUtils.publicKeyFromPrivateKey(this._privateKey)
        async () => {
            this.contract = await getContract(this._privateKey, this._publicKey)
            this.$.start();
        }
    }

    // get_key=async()=>{
    //     const params = new Null()
    //     const result = await contract.staticCallAsync('PubKey', params, new WrapStr())
    //     return result.getValue()
    // }

    create_channel(name,func){
        this.$.ready( async () => {
            const params = new CreateChannelTx()
            params.setPubKey(this._privateKey);
            params.setName(name);
            const result = await this.contract.staticCallAsync('CreateChannel', params, new CreateChannelResp())
            func(result.getAddress())
        });
    }
}

function getContractEVM(privateKey,publicKey,contract_address) {
    const from = LocalAddress.fromPublicKey(publicKey).toString()
    const loomTruffleProvider = new LoomTruffleProvider(
        "default",
        server_addr+"/rpc",
        server_addr+"/query",
        privateKey,
    )
    const loomProvider = loomTruffleProvider.getProviderEngine()
    const web3 = new Web3(loomProvider)
    const contract = new web3.eth.Contract(ABI, contract_address, {from})
    console.log("got_contract");
    return contract
}

class ChannelWorkerEVM {
    // constructor(){
    //     this.$ = qbox.create();
    // }

    // set_privkey(privkey){
    //     this._privateKey = privkey
    //     this._publicKey = CryptoUtils.publicKeyFromPrivateKey(this._privateKey)
    //     async () => {
    //         this.contract = await getContractEVM(this._privateKey,this._publicKey)
    //         this.$.start();
    //     }
    // }

    async join_channel(privatekey,address){
        const publicKey = CryptoUtils.publicKeyFromPrivateKey(privatekey)
        const contract = await getContractEVM(privatekey,publicKey,address)
        contract.methods.subscribe().send()
    }

    async suggest_publication(privatekey,address,text,func){
        console.log("getting_contract");
        const publicKey = CryptoUtils.publicKeyFromPrivateKey(privatekey)
        const contract = await getContractEVM(privatekey,publicKey,address)
        console.log("suggesting");
        const value = await contract.methods.suggestPost(text).send()
        console.log("send");
        func(value);
    }
}



// const privateKey = CryptoUtils.generatePrivateKey()
// const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

// async function load_key(contract) {
//     const params = new Null()
//     const result = await contract.staticCallAsync('PubKey', params, new WrapStr())
//     return result.getValue()
// }
//
// async function load_channel(contract) {
//     const params = new CreateChannelTx()
//     const result = await contract.staticCallAsync('CreateChannel', params, new CreateChannelResp())
//     return result.getAddress()
// }
//
// async function create_channel(contract) {
//     const contract = await getContract(privateKey, publicKey)
//     const value = await load_key(contract)
//     return value;
// }
//
// async function get_key() {
//     // const privateKey = CryptoUtils.generatePrivateKey()
//     // const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
//     const contract = await getContract(privateKey, publicKey)
//     const value = await load_key(contract)
//     return value;
// }
//
// function encrypt(pub2,message){
//     // const pub2 = helpers.fromHexString(process.argv[2]);
//     // const msg = 'fuckin message';
//     let first = crypto.createECDH('secp256k1');
//     first.generateKeys();
//     let priv1=first.getPrivateKey();
//     let pub1=dif.getPublic(priv1);
//
//     let secret=helpers.toHexString(dif.getSharedKey(priv1,pub2));
//
//     const enc=helpers.encryptText(secret,msg);
//     console.log(JSON.stringify({Pub:helpers.toHexString(pub1),Encrypt:enc}));
//     return {priv:priv1,pub:pub1,secret:secret,encrypted:enc}
// }

// function encrypt(msg){
//     return helpers.encryptText(secret,msg);
// }

module.exports = {ChannelWorker:new ChannelWorker(),ChannelWorkerEVM:new ChannelWorkerEVM()};
