import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";
import {MessageModel} from "../../models/MessageModel";

class MenuController extends Controller {

    async init_main() {
        console.log('init_main');
        await this.generate_initial_chats();
        // let data={id:first?'0x0000000000000000000000000000000000000000':null};
        let self_info = await this.get_self_info();
        self_info.online = false;
        let fafa = new UserModel();
        fafa.avatar = self_info.avatar;
        fafa.name = self_info.name;
        // fafa.
        // console.log(fafa);
        // console.log(self_info);
        // let html=this.render('main/main.pug',fafa);
        // this.send_data('change_menu_state', html);
        this.send_data(this.events.change_app_state, this.render('main/main.pug', fafa));
        await this.load_menu_initial(true);
    };

    async load_menu(menu) {
        let menu_func = "";
        let account = await AccountModel.findOne(1);

        if (typeof this[`load_${menu}`] === 'function')
            menu_func = `load_${menu}`;
        else
            menu_func = `load_menu_default`;
        await this[menu_func](account);
    };

    private async load_menu_user_chats(account) {
        let self_info=await this.get_self_info();
        let fafa = new UserModel();
        fafa.avatar = self_info.avatar;
        fafa.name = self_info.name;
        // self_info.state="menu_user_chats";
        // console.log(self_info);
        let html = this.render('main/chatsblock/chatsblock.pug', fafa) +
            this.render('main/messagingblock/messagingblock.pug');
        //     include chatsblock/chatsblock.pug
        // include messagingblock/messagingblock.pug
        this.send_data('change_menu_state', html);
        await this.controller_register.run_controller('ChatsController', 'load_chats', this.chat_types.user);
        // this.init_controller('MessagesController', 'get_chat_messages', this.chat_types.user);
    }

    private async load_menu_chats(account) {
        let self_info=await this.get_self_info();
        let fafa = new UserModel();
        fafa.avatar = self_info.avatar;
        fafa.name = self_info.name;
        // self_info.state="menu_user_chats";
        // console.log(self_info);
        let html = this.render('main/chatsblock/chatsblock.pug', fafa) +
            this.render('main/messagingblock/messagingblock.pug');
        //     include chatsblock/chatsblock.pug
        // include messagingblock/messagingblock.pug
        this.send_data('change_menu_state', html);
        await this.controller_register.run_controller('ChatsController', 'load_chats', this.chat_types.group);
        // this.init_controller('MessagesController', 'get_chat_messages', this.chat_types.user);
    }


    private async generate_initial_chats() {
        let initial_user;
        let initial_user_chat;
        let initial_user_message;
        let self_info:UserModel = await this.get_self_info();
        // console.log(self_info);
        if (!(await UserModel.findOne('0x0000000000000000000000000000000000000000'))) {

            initial_user = new UserModel();
            initial_user.id = '0x0000000000000000000000000000000000000000';
            initial_user.avatar = 'data:image/png;base64,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';
            initial_user.online = false;
            initial_user.domain = 'localhost';
            initial_user.name = 'Moonshard support';
            initial_user.firstname = 'Moonshard';
            initial_user.lastname = 'support';
            initial_user.bio = 'Moonshard support';
            await initial_user.save();

            initial_user_chat = new ChatModel();
            initial_user_chat.id = ChatModel.get_user_chat_id(self_info.id, initial_user.id);
            initial_user_chat.type = this.chat_types.user;
            initial_user_chat.users = [self_info, initial_user];
            await initial_user_chat.save();

            initial_user_message = new MessageModel();
            initial_user_message.time = '00:00';
            initial_user_message.chat = initial_user_chat;
            initial_user_message.sender = initial_user;
            initial_user_message.text = 'Hello my friend!';
            await initial_user_message.save();
        }

        if (!(await UserModel.findOne('0x0000000000000000000000000000000000000001'))) {

            initial_user = new UserModel();
            initial_user.id = '0x0000000000000000000000000000000000000001';
            initial_user.avatar = 'data:image/png;base64,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';
            initial_user.online = false;
            initial_user.domain = 'localhost';
            initial_user.name = 'Moonshard support';
            initial_user.firstname = 'Moonshard';
            initial_user.lastname = 'support';
            initial_user.bio = 'Moonshard support';
            await initial_user.save();

            initial_user_chat = new ChatModel();
            initial_user_chat.id = ChatModel.get_user_chat_id(self_info.id, initial_user.id);
            initial_user_chat.type = this.chat_types.user;
            initial_user_chat.users = [self_info, initial_user];
            await initial_user_chat.save();

            initial_user_message = new MessageModel();
            initial_user_message.time = '00:00';
            initial_user_message.chat = initial_user_chat;
            initial_user_message.sender = initial_user;
            initial_user_message.text = 'Hello my friend!';
            await initial_user_message.save();

            initial_user_message = new MessageModel();
            initial_user_message.time = '00:00';
            initial_user_message.chat = initial_user_chat;
            initial_user_message.sender = self_info;
            initial_user_message.text = 'Hello my friend!';
            await initial_user_message.save();
        }
    }

    // private load_menu_chats(){
    //     html = pug.renderFile(__dirname + '/components/main/file.pug', obj, PUG_OPTIONS);
    //     renderer.webContents.send('change_menu_state', html);
    //     sqlite.fetch((row) => {
    //         console.log('buddy');
    //         row.type = chat_types.channel;
    //         const html = pug.renderFile(__dirname + '/components/main/chatsblock/chats/imDialog.pug', row, PUG_OPTIONS);
    //         row.html = html;
    //         // console.log(row);
    //         row.type = "menu_chats";
    //         renderer.webContents.send('buddy', row);
    //     }, sqlite.tables.chat);
    // }

    private load_menu_create_chat() {
        this.send_data('get_my_vcard', this.render('main/modal_popup/create_chat.pug'));
    }

    private async load_menu_initial(first: boolean = false) {
        console.log('load_menu_default');
        let self_info = await this.get_self_info();
        await this.controller_register.run_controller('ChatsController', 'load_chats', this.chat_types.user, first);
        if (first) {
            await this.controller_register.run_controller('MessagesController', 'get_chat_messages', '0x0000000000000000000000000000000000000000_' + self_info.id);
        }
    }

    private async load_menu_default() {
        this.send_data(this.events.change_menu_state, this.render('main/file.pug',{state:"menu_under_construction"}));
    }
}

module.exports = MenuController;
