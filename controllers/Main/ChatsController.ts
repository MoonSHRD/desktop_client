import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
const Controller = require('../Controller');

class ChatsController extends Controller {

    async init_chats(){
        let account = await AccountModel.findOne(1);
        console.log(account);
        if (!account.address) {
            account.address=this.dxmpp.get_address();
            await account.save();
        }
        this.send_data(this.events.change_app_state,this.render('main/main.pug',account));
        //todo: load all chats.
    };

    private load_chat(chat,general_chat_type){
        let html=this.render('main/chatsblock/chats/imDialog.pug',chat);
        console.log({id:chat.id,type:general_chat_type,html:html});
        this.send_data('buddy',{id:chat.id,type:general_chat_type,html:html})
    }

    async user_online(data){
        console.log(data);
        let user = await UserModel.findOne(data.user.id);

        console.log('found user');
        console.log(user);
        if (user) {
            if (!user.online) {
                user.online=true;
                user.save();
            }
            user.type=this.chat_types.user;
            this.load_chat(user,this.general_chat_types.user);
        } else {
            user=new UserModel();
            user.id=data.user.id;
            user.domain=data.user.domain;
            user.online=true;
            await user.save();
            this.dxmpp.get_vcard(user)
        }
    }

    async user_offline(data){
        let user = await UserModel.findOne(data.user.id);
        user.type=this.chat_types.user;
        this.load_chat(user,this.general_chat_types.user);
    }

    async get_my_vcard(){
        let account = await AccountModel.findOne(1);
        this.send_data('get_my_vcard',this.render('main/modal_popup/modal_content.pug',account));
    }

    async user_vcard(vcard){
        let user = await UserModel.findOne(vcard.id);
        if (!user) console.log(`user ${user.id} not found in db`);
        user.avatar=vcard.avatar;
        user.name=vcard.name;
        user.bio=vcard.bio;
        user.firstname=vcard.firstname;
        user.lastname=vcard.lastname;
        console.log(user);
        await user.save();
        user.type=this.chat_types.user;
        this.load_chat(user,this.general_chat_types.user);
    }

    async subscribe(user){
        console.log(`subscribing to user ${user.id}`);
        this.dxmpp.subscribe(user);
    }

    async user_subscribed(user){
        let check = await UserModel.findOne(user.id);
        if (!check)
            this.subscribe(user)
    }
}

module.exports=ChatsController;
