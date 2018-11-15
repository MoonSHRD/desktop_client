import Web3 = require("web3");
import {web3_config} from "../src/env_config";
import {TransactionModel} from "../models/TransactionModel";
import {Grpc} from "../grpc/grpc";
let EventEmitter = require('events').EventEmitter;
let SubFactoryAbi = require("./abis/SubFactory");
let TokenFactoryAbi = require("./abis/TokenFactory");
let TokenFactoryAddress='0x4dec573feb329642e2f98043b7eb09ae8265ed0b';


export class Web3S {
    private web3: Web3;
    private TokenFactory: any;
    private grpc=Grpc.getIntance();
    // public eth: any;
    public addr: string;
    public events: any;
    private provider: any;
    public privKey: string;
    private static instance: Web3S;
    private subs={};

    private constructor() {
        this.events= new EventEmitter();
        this.setProvider();
        this.web3 = new Web3(this.provider);
        // this.token_addr = await this.get_token_addr();
        // this.MoonshardTokenContract = new this.web3.eth.Contract(token_abi, this.token_addr, {from: this.addr});
        // this.token_decimals = await await this.MoonshardTokenContract.methods.decimals().call();
    }

    private async handleDisconnect(){
        // for (let i in this.subs) {
        //     let sub=this.subs[i];
        //     await sub.unsubscribe();
        // }

        this.setProvider();
        this.web3 = new Web3(this.provider);
    }

    private setProvider(){
        this.provider = new Web3.providers.WebsocketProvider("ws://"+web3_config.host+":"+web3_config.port);
        this.provider.on('end',async ()=>{
            this.events.emit('disconnected');
            console.log('web3 disconnected, handling');
            await this.handleDisconnect();
            // this.provider.connection.connect({url: "ws://"+web3_config.host+":"+web3_config.port});
        });
    }

    static GetInstance() {
        if (!Web3S.instance) {
            Web3S.instance = new Web3S();
        }
        return Web3S.instance;
    }

    on(event, callback) {
        this.events.on(event, callback);
    };

    async SetAccount(privKey) {
        this.privKey = privKey;
        let account = await this.web3.eth.accounts.privateKeyToAccount(this.privKey);
        this.addr = account.address.toLowerCase();
        await this.web3.eth.accounts.wallet.add(account);
        this.TokenFactory = new this.web3.eth.Contract(TokenFactoryAbi.abi, TokenFactoryAddress, {from: this.addr});

        // this.subs["NewBlocks"] = await this.web3.eth.subscribe('newBlockHeaders',async (err,block)=>{
        //     if (err)
        //         console.log(err);
        //     else {
        //         let bl_tx = await this.web3.eth.getBlock(block.hash,true);
        //         let txs = bl_tx.transactions;
        //         for (let i in txs) {
        //             let tx=txs[i];
        //             if (tx.to.toLowerCase()==this.addr.toLowerCase()){
        //                 this.events.emit('received_eth',tx);
        //             }
        //         }
        //     }
        // });

        this.subs["newTransaction"] = await this.web3.eth.subscribe('pendingTransactions',async (err,txId)=>{
            console.log('pending tx');
            if (err)
                console.log(err);
            else {
                console.log('txId:',txId);
                let tx=await this.web3.eth.getTransaction(txId);
                console.log('tx data:',tx);
                let from=tx.from.toLowerCase();
                if (tx.to==null)
                    return;
                let to=tx.to.toLowerCase();
                if (from==this.addr || to==this.addr) {
                    let transactionModel=new TransactionModel();
                    transactionModel.id=tx.hash;
                    // let fromM=await this.grpc.GetUser(from);
                    transactionModel.from=await this.grpc.GetUser(from);
                    console.log(transactionModel.from);
                    // let toM=await this.grpc.GetUser(to);
                    transactionModel.to=await this.grpc.GetUser(to);
                    console.log(transactionModel.to);
                    transactionModel.gas=tx.gas;
                    transactionModel.time=Date.now();
                    transactionModel.amount=tx.value;
                    await transactionModel.save();
                    this.events.emit('new_transaction',transactionModel)
                }
            }
        });

        this.subs["NewTokens"] = await this.TokenFactory.events.TokenCreated({},async (one,two,three)=>{
            this.events.emit('token_created',one,two,three);
            console.log(one,two,three);
        });
    }

    async GetMyBalance() {
        return (await this.web3.eth.getBalance(this.addr))/(Math.pow(10,18));
    }

    async CreateToken(data) {
        console.log(data);
        return await this.TokenFactory.methods.createTokensaleToken(
            data['t-name'],
            data['t-symbol'],
            data['decimals'],
            Number(data['totalSupply']),
            data['rate'],
            this.addr,
        ).send({gas:100000});
    }

    async GetUserBalance(user_id:string) {
        return (await this.web3.eth.getBalance(user_id))/(Math.pow(10,18));
    }

    async SendEth(to:string,amount:number) {
        return await this.web3.eth.sendTransaction({to:to, from:this.addr, value:amount*Math.pow(10,18), gas:100000});
    }
}
