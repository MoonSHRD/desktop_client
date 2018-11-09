import "reflect-metadata";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";
import {EventModel} from "../../models/EventModel";
import {helper} from "../../src/var_helper";

class EventsController extends Controller {
    async user_joined_room(user, room_data, date) {
        let chat = await ChatModel.findOne(room_data.id);
        let event=new EventModel();
        let text = `user ${user.id} joined`;
        // let currentdate = new Date();
        event.type=helper.event_types.info;
        event.chat=chat;
        event.text=text;
        event.time= this.dxmpp.take_time();
        await event.save();
        event.date = date;
        text+=' '+chat.name;
        this.send_data('user_joined_room', text);
        const html = this.render('main/messagingblock/notice.pug', event);
        this.send_data('get_notice', {id: chat.id, html: html});
    }

    async get_chat_events(chat_id:string) {
        // let chat = await ChatModel.findOne(room_data.id);
        // let event=new EventModel();
        // let text = `user ${user.id} joined`;
        // event.type=helper.event_types.info;
        // event.chat=chat;
        // event.text=text;
        // text+=' '+chat.name;
        // this.send_data('user_joined_room', text);
    }

    async send_error(text:string) {
        this.send_data('throw_error', text);
    }

    async init_loading() {
        let language = (await this.get_Settings()).language;
            let obj = {
          arg:this.render(`loading/loading.pug`),
          language: language
        };
        this.send_data(this.events.change_app_state, obj);
    }
}

module.exports = EventsController;
