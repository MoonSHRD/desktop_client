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
const axios = require('axios');
const os = require('os');
var fs = require('fs');
var unzip = require('unzip');
const electron_download_manager_1 = require("electron-download-manager");
const updater = require('electron-simple-updater');
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
            this.send_data(this.events.change_app_state, this.render(`loading/loading.pug`));
        });
    }
    update_server(os, file) {
        return __awaiter(this, void 0, void 0, function* () {
            // axios.get(`http://localhost:8081/updates/${os}/${file}`)
            //     .then( (response) => {
            //         download({
            //             url: `http://localhost:8081/updates/${os}/${file}`,
            //             onProgress:  (percentage) => {
            //                 console.log("percentage : " + percentage );
            //                 this.send_data('get_updates', percentage);
            //             }
            //         }, function (error, info) {
            //             if (error) {
            //                 console.log(error);
            //                 return;
            //             }
            //
            //             var dirPath  = __dirname + `/../../updates/${file}`;
            //
            //             var destPath = __dirname + `/../../updates/arch`;
            //
            //             fs.createReadStream(dirPath).pipe(unzip.Extract({ path: destPath }));
            //
            //
            //
            //             console.log("DONE: " + info.url);
            //         });
            //
            //
            //     })
            //     .catch(function (error) {
            //         // handle error
            //         console.log(error);
            //     })
            //     .then(function () {
            //         // always executed
            //     });
        });
    }
    get_updates() {
        return __awaiter(this, void 0, void 0, function* () {
            const stringf = 'update-not-available';
            updater.init('http://localhost:8081/update.json');
            updater.on('checking-for-update', () => console.log('Checking for updates...'));
            updater.on('update-not-available', () => {
                this.send_data('get_updates', stringf);
                console.log('Update is not available');
            });
            updater.on('update-available', (meta) => {
                this.send_data('get_updates', meta);
                console.log('Update available');
            });
            updater.on('update-downloaded', () => {
                updater.quitAndInstall();
            });
            updater.on('update-downloading', (meta) => {
                console.log();
                electron_download_manager_1.download({
                    url: `http://localhost:8081/updates/Linux/Moonshard_0.0.2.AppImage`,
                    onProgress: (percentage) => {
                        console.log("percentage : " + percentage);
                        // this.send_data('get_updates', percentage);
                    }
                }, function (error, info) {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    console.log('Downloading update:', meta);
                });
            });
            updater.on('error', (meta) => console.log('Error:', meta));
            // this.send_data('get_updates', null);
            // console.log(os.type())
            // let file = "arch.zip";
            // let get_os_type = os.type();
            //
            // if( get_os_type === 'Linux'){
            //
            //     this.update_server(get_os_type, file)
            //
            // }else if (get_os_type === 'Windows_NT') {
            //
            //     this.update_server(get_os_type, file)
            //
            // }
            // this.ipfs.set_version();
            // this.ipfs.get_version();
        });
    }
    ;
}
module.exports = EventsController;
//# sourceMappingURL=EventsController.js.map