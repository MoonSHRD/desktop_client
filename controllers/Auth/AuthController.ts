import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {Controller} from "../Controller";
import {UserModel} from "../../models/UserModel";
// import {UserMessageModel} from "../../models/UserMessageModel";
import {ChatModel} from "../../models/ChatModel";
import {MessageModel} from "../../models/MessageModel";

class AuthController extends Controller {

    async init_auth(){
        // await this.generate_initial_chats();
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
        const privKey=this.eth.generate_priv_key();
        const address=this.eth.generate_address(privKey);

        // let user_chat=new ChatModel();
        // user_chat.type=this.chat_types.user;
        // user_chat.id=address;
        // await user_chat.save();

        let user=new UserModel();
        user.id=address;
        user.domain='localhost';
        user.self=true;
        user.name=data.firstname+(data.lastname?" "+data.lastname:"");
        user.firstname=data.firstname;
        user.lastname=data.lastname;
        user.bio=data.bio;
        user.avatar=data.avatar;
        // user.user_chat=user_chat;
        await user.save();

        let account = new AccountModel();
        account.privKey=privKey;
        account.privKeyLoom="fwafawfawfwa";
        account.passphrase=data.mnemonic;
        // account.domain='localhost';
        // account.name=data.firstname+(data.lastname?" "+data.lastname:"");
        // account.firstname=data.firstname;
        // account.lastname=data.lastname;
        // account.bio=data.bio;
        // account.avatar=data.avatar;
        account.user=user;
        await account.save();


        // user_chat.
        // user_chat.=

        this.dxmpp.set_vcard(user.firstname,user.lastname,user.bio,user.avatar);
        this.auth(account);
    };
}
module.exports=AuthController;
