import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
// import {MessageModel} from "../../models/MessageModel";
const Controller = require('../Controller');

class MessagesController extends Controller {

    async get_user_messages(id:string){
        // let messages=MessageModel.find({ where: { user: id } });
        // let html = this.render('main/messagingblock/qqq.pug')
        // const html = pug.renderFile(__dirname + '/components/main/messagingblock/qqq.pug', obj, PUG_OPTIONS);
        // const html = pug.renderFile(__dirname + '/components/main/messagingblock/message.pug', row, PUG_OPTIONS);
    };

    async send_message(id:string){
        let account = await AccountModel.findOne(1);
        console.log(account);
        if (!account.address) {
            account.address=this.dxmpp.get_address();
            await account.save();
        }
        this.send_data(this.events.change_app_state,this.render('main/main.pug',account));
        //todo: load all chats.
    };

    async received_message(id:string){
        let account = await AccountModel.findOne(1);
        console.log(account);
        if (!account.address) {
            account.address=this.dxmpp.get_address();
            await account.save();
        }
        this.send_data(this.events.change_app_state,this.render('main/main.pug',account));
        //todo: load all chats.
    };
}

module.exports=MessagesController;
