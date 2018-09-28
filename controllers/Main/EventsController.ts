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
        event.type=helper.event_types.info;
        event.chat=chat;
        event.text=text;
        event.date = date;
        text+=' '+chat.name;
        this.send_data('user_joined_room', text);
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
}

module.exports = EventsController;
