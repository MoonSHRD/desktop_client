import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {Controller} from "../Controller";
import {UserModel} from "../../models/UserModel";
import {Loom} from "../../loom/loom";
import {TextEncoder,TextDecoder} from 'text-encoding';
import {resize_b64_img, resize_img_from_path} from "../Helpers";
import {paths} from "../../src/var_helper";
import {SettingsModel} from "../../models/SettingsModel";
import {bot_acc} from "../../src/env_config";
const ethers = require('ethers');
const bip39 = require('bip39');
// let {TextDecoder} = require('text-encoding');

class AuthController extends Controller {

    private connection_tries:number=-1;

    async init_auth() {
        let account = await AccountModel.findOne(1);
        if (account)
            await this.auth(account);
        else {
            let obj = {
                arg:this.render('auth/auth.pug'),
                language:"en"
            };
            this.send_data(this.events.change_app_state, obj);
        }

    };

    generate_mnemonic() {
        this.send_data(this.events.generate_mnemonic, this.eth.generate_mnemonic());
    };

    private async auth(account: AccountModel,first:boolean=false) {
        let user=await this.get_self_info();
        // let user_json=JSON.stringify(user);
        if (this.connection_tries === 9)
            this.connection_tries=0;
        else
            this.connection_tries+=1;
        await this.ipfs.connect();
        console.log('IPFS connected');
        // console.log(account);
        // await this.ipfs.ipfs_info();
        // await this.loom.connect(account.privKey);
        // console.log('loom connected');
        await this.web3.SetAccount(account.privKey);

        this.grpc.SetPrivKey(account.privKey);
        if (first) {
            // let identyti_tx= await this.loom.set_identity(account.user.name);
            // console.log(identyti_tx);
            // this.send_data('user_joined_room', `Identity created. <br/> txHash: ${identyti_tx.transactionHash}`);
            console.log(user);
            // let suc=await this.grpc.CallMethod('SetObjData',{pubKey: this.grpc.pubKey,obj:'user',data:user});
            // console.log(suc);
        }
        this.grpc.StartPinging();
        this.grpc.StartUserPinging();
        let suc=await this.grpc.CallMethod('SetObjData',{pubKey: this.grpc.pubKey,obj:'user',data:user});
        this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
        account.host = this.dxmpp_config.host;
        account.jidhost = this.dxmpp_config.jidhost;
        account.port = this.dxmpp_config.port+this.connection_tries;
        await this.dxmpp.connect(account);
    }

    async save_acc(data) {
        await this.controller_register.run_controller('EventsController','init_loading');
        // const loom_data=Loom.generate_acc();

        // let wal=ethers.Wallet.fromMnemonic(mnem);
        let mnem=bip39.generateMnemonic();
        const eth_data=ethers.Wallet.fromMnemonic(mnem);
        console.log(eth_data);
        let {privateKey,publicKey}=eth_data.signingKey.keyPair;
        let user = new UserModel();
        user.id = eth_data.address.toLowerCase();
        user.domain = 'localhost';
        user.self = true;
        user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.bio = data.bio;
        user.avatar = data.avatar?(await resize_b64_img(data.avatar)):(await resize_img_from_path(this.paths.src+'img/default-avatar1.jpg'));
        await user.save();

        let account = new AccountModel();
        let settings = new SettingsModel();
        account.privKey = privateKey;
        account.passphrase = data.mnemonic;
        account.user = user;
        // settings.last_chat = '0x0000000000000000000000000000000000000000_' + loom_data.addr;
        settings.last_chat = bot_acc.addr+'_' + eth_data.address.toLowerCase();
        await settings.save();
        await account.save();

        await this.auth(account,true);
    };
}

module.exports = AuthController;
