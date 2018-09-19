import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
const Controller = require('../Controller');

class AuthController extends Controller {

    async init_auth(){
        let account = await AccountModel.findOne(1);
        if (account)
            this.auth(account);
        else
            this.send_data(this.events.change_app_state,this.render('auth/123.pug'));
    };

    generate_mnemonic(){
        this.send_data(this.events.generate_mnemonic,this.eth.generate_mnemonic());
    };

    private auth(account: AccountModel){
        account.host=this.dxmpp_config.host;
        account.jidhost=this.dxmpp_config.jidhost;
        account.port=this.dxmpp_config.port;
        this.dxmpp.connect(account)
    }

    async save_acc(data){
        let account = new AccountModel();
        account.privKey=this.eth.generate_priv_key();
        account.privKeyLoom="fwafawfawfwa";
        account.passphrase=data.mnemonic;
        account.domain='localhost';
        account.name=data.firstname+(data.lastname?" "+data.lastname:"");
        account.firstname=data.firstname;
        account.lastname=data.lastname;
        account.bio=data.bio;
        account.avatar=data.avatar;
        await account.save();
        this.dxmpp.set_vcard(account.firstname,account.lastname,account.bio,account.avatar);
        this.auth(account);
    };
}
module.exports=AuthController;
