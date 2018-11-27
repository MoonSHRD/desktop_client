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
const Web3 = require("web3");
const env_config_1 = require("../src/env_config");
const TransactionModel_1 = require("../models/TransactionModel");
let fs = require("fs");
const grpc_1 = require("../grpc/grpc");
let EventEmitter = require('events').EventEmitter;
let SubFactoryAbi = require("./abis/SubFactory");
let TokenFactoryAbi = require("./abis/TokenFactory");
let TokenAbi = require("./abis/Token");
// let TokenFactoryAddress='0x4dec573feb329642e2f98043b7eb09ae8265ed0b';
let TokenFactoryAddress = '0xd2116a1075b057f3f0cf68b8310a1ca4a07f9d96';
class Web3S {
    constructor() {
        this.grpc = grpc_1.Grpc.getIntance();
        this.subs = {};
        this.events = new EventEmitter();
        this.setProvider();
        this.web3 = new Web3(this.provider);
        // this.token_addr = await this.get_token_addr();
        // this.MoonshardTokenContract = new this.web3.eth.Contract(token_abi, this.token_addr, {from: this.addr});
        // this.token_decimals = await await this.MoonshardTokenContract.methods.decimals().call();
    }
    handleDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            // for (let i in this.subs) {
            //     let sub=this.subs[i];
            //     await sub.unsubscribe();
            // }
            this.setProvider();
            this.web3 = new Web3(this.provider);
        });
    }
    setProvider() {
        this.provider = new Web3.providers.WebsocketProvider("ws://" + env_config_1.web3_config.host + ":" + env_config_1.web3_config.port);
        this.provider.on('end', () => __awaiter(this, void 0, void 0, function* () {
            this.events.emit('disconnected');
            console.log('web3 disconnected, handling');
            yield this.handleDisconnect();
            // this.provider.connection.connect({url: "ws://"+web3_config.host+":"+web3_config.port});
        }));
    }
    static GetInstance() {
        if (!Web3S.instance) {
            Web3S.instance = new Web3S();
        }
        return Web3S.instance;
    }
    on(event, callback) {
        this.events.on(event, callback);
    }
    ;
    SetAccount(privKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.privKey = privKey;
            let account = yield this.web3.eth.accounts.privateKeyToAccount(this.privKey);
            this.addr = account.address.toLowerCase();
            yield this.web3.eth.accounts.wallet.add(account);
            this.TokenFactory = new this.web3.eth.Contract(TokenFactoryAbi.abi, TokenFactoryAddress, { from: this.addr });
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
            this.subs["newTransaction"] = yield this.web3.eth.subscribe('pendingTransactions', (err, txId) => __awaiter(this, void 0, void 0, function* () {
                console.log('pending tx');
                if (err)
                    console.log(err);
                else {
                    console.log('txId:', txId);
                    let tx = yield this.web3.eth.getTransaction(txId);
                    console.log('tx data:', tx);
                    let from = tx.from.toLowerCase();
                    if (tx.to == null)
                        return;
                    let to = tx.to.toLowerCase();
                    if (from == this.addr || to == this.addr) {
                        let transactionModel = new TransactionModel_1.TransactionModel();
                        transactionModel.id = tx.hash;
                        // let fromM=await this.grpc.GetUser(from);
                        transactionModel.from = yield this.grpc.GetUser(from);
                        console.log(transactionModel.from);
                        // let toM=await this.grpc.GetUser(to);
                        transactionModel.to = yield this.grpc.GetUser(to);
                        console.log(transactionModel.to);
                        transactionModel.gas = tx.gas;
                        transactionModel.time = Date.now();
                        transactionModel.amount = tx.value;
                        yield transactionModel.save();
                        this.events.emit('new_transaction', transactionModel);
                    }
                }
            }));
            this.subs["NewTokens"] = yield this.TokenFactory.events.TokenCreated({}, (one, two, three) => __awaiter(this, void 0, void 0, function* () {
                this.events.emit('token_created', one, two, three);
                console.log(one, two, three);
            }));
        });
    }
    GetMyBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3.eth.getBalance(this.addr)) / (Math.pow(10, 18));
        });
    }
    CreateToken(createToken, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (createToken) {
                console.log(data);
                let tr = yield this.TokenFactory.methods.createCommunityToken(data['t-name'], data['t-symbol'], 18, data['totalSupply'], 0, this.addr).send({ gas: 2000000 }, function (error, result) {
                    if (error) {
                        console.log(error);
                    }
                });
                console.log(tr);
            }
            // console.log(await this.TokenFactory.methods.getTokens(this.addr).call())
            let allUserTokens = yield this.TokenFactory.methods.getTokens(this.addr).call();
            let lastCreateToken = allUserTokens[allUserTokens.length - 1];
            return lastCreateToken;
        });
    }
    GetUserBalance(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.web3.eth.getBalance(user_id)) / (Math.pow(10, 18));
        });
    }
    SendEth(to, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.eth.sendTransaction({ to: to, from: this.addr, value: amount * Math.pow(10, 18), gas: 100000 });
        });
    }
    getTokenValue(tokenAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            this.Token = new this.web3.eth.Contract(TokenAbi.abi, tokenAddress, { from: this.addr });
            return yield this.Token.methods.balanceOf(this.addr).call((error, result) => {
                // console.log(result)
            });
        });
    }
    transferTokens(tokenAddress, toAddress, tokenAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.Token = new this.web3.eth.Contract(TokenAbi.abi, tokenAddress, { from: this.addr });
            yield this.Token.methods.transfer(toAddress, tokenAmount).send({
                from: this.addr,
                gas: 2000000
            });
        });
    }
}
exports.Web3S = Web3S;
//# sourceMappingURL=web3.js.map