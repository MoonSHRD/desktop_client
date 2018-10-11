import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {Controller} from "../Controller";
import {UserModel} from "../../models/UserModel";
import {Loom} from "../../loom/loom";
import {TextEncoder,TextDecoder} from 'text-encoding';
// let {TextDecoder} = require('text-encoding');

class AuthController extends Controller {

    async init_auth() {
        let account = await AccountModel.findOne(1);
        if (account)
            await this.auth(account);
        else
            this.send_data(this.events.change_app_state, this.render('auth/123.pug'));
    };

    generate_mnemonic() {
        this.send_data(this.events.generate_mnemonic, this.eth.generate_mnemonic());
    };

    private async auth(account: AccountModel,first:boolean=false) {
        await this.ipfs.connect();
        console.log('connected');
        console.log(account);
        // await this.ipfs.ipfs_info();
        await this.loom.connect(account.privKey);
        console.log('loom connected');
        if (first) {
            let identyti_tx= await this.loom.set_identity(account.user.name);
            console.log(identyti_tx);
            this.send_data('user_joined_room', `Identity created. <br/> txHash: ${identyti_tx.transactionHash}`);
        }
        account.host = this.dxmpp_config.host;
        account.jidhost = this.dxmpp_config.jidhost;
        account.port = this.dxmpp_config.port;
        await this.dxmpp.connect(account)
    }

    async save_acc(data) {
        await this.controller_register.run_controller('EventsController','init_loading');
        const loom_data=Loom.generate_acc();

        let user = new UserModel();
        user.id = loom_data.addr;
        user.domain = 'localhost';
        user.self = true;
        user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.bio = data.bio;
        user.avatar = data.avatar;
        await user.save();

        let account = new AccountModel();
        account.privKey = loom_data.priv;
        account.passphrase = data.mnemonic;
        account.user = user;
        await account.save();

        this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
        await this.auth(account,true);
    };
}

module.exports = AuthController;
