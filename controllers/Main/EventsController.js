"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Controller_1 = require("../Controller");
const ChatModel_1 = require("../../models/ChatModel");
const EventModel_1 = require("../../models/EventModel");
const var_helper_1 = require("../../src/var_helper");
class EventsController extends Controller_1.Controller {
    user_joined_room(user, room_data, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield ChatModel_1.ChatModel.findOne(room_data.id);
            let event = new EventModel_1.EventModel();
            let text = `user ${user.id} joined`;
            // let currentdate = new Date();
            event.type = var_helper_1.helper.event_types.info;
            event.chat = chat;
            event.text = text;
            event.time = this.dxmpp.take_time();
            yield event.save();
            event.date = date;
            text += ' ' + chat.name;
            this.send_data('user_joined_room', text);
            const html = this.render('main/messagingblock/notice.pug', event);
            this.send_data('get_notice', { id: chat.id, html: html });
        });
    }
    get_chat_events(chat_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // let chat = await ChatModel.findOne(room_data.id);
            // let event=new EventModel();
            // let text = `user ${user.id} joined`;
            // event.type=helper.event_types.info;
            // event.chat=chat;
            // event.text=text;
            // text+=' '+chat.name;
            // this.send_data('user_joined_room', text);
        });
    }
    send_error(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.send_data('throw_error', text);
        });
    }
    init_loading() {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this.get_Settings();
            let language = "en";
            if (settings) {
                language = settings.language;
            }
            let obj = {
                arg: this.render(`loading/loading.pug`),
                language: language
            };
            this.send_data(this.events.change_app_state, obj);
        });
    }
}
module.exports = EventsController;
//# sourceMappingURL=EventsController.js.map