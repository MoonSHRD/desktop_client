import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {Controller} from "../Controller";
import {UserModel} from "../../models/UserModel";
import {Loom} from "../../loom/loom";

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
        // await this.controller_register.run_controller('MenuController', 'init_main');
        await this.loom.connect(account.privKeyLoom);
        console.log('loom connected');
        if (first) {
            let identyti_tx= await this.loom.set_identity(account.user.name);
            console.log(identyti_tx);
            this.send_data('user_joined_room', `Identity created. <br/> txHash: ${identyti_tx.transactionHash}`);
        }
        // console.log(await this.loom.get_identity());
        // console.log(await this.loom.token_addr);
        // console.log(await this.loom.get_total_supply());
        // console.log(await this.loom.get_my_balance());
        // console.log(await this.loom.get_balance('0x0000000000000000000000000000000000000000'));
        account.host = this.dxmpp_config.host;
        account.jidhost = this.dxmpp_config.jidhost;
        account.port = this.dxmpp_config.port;
        await this.dxmpp.connect(account)
    }

    async save_acc(data) {
        await this.controller_register.run_controller('EventsController','init_loading');
        const privKey = this.eth.generate_priv_key();
        const address = this.eth.generate_address(privKey);

        let user = new UserModel();
        user.id = address;
        user.domain = 'localhost';
        user.self = true;
        user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.bio = data.bio;
        user.avatar = data.avatar;
        await user.save();

        let account = new AccountModel();
        account.privKey = privKey;
        account.privKeyLoom = Loom.generate_private();
        account.passphrase = data.mnemonic;
        account.user = user;
        await account.save();

        this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
        await this.auth(account,true);
    };
}

module.exports = AuthController;
