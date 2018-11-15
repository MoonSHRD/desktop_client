import "reflect-metadata";
const axios = require('axios');
const os = require('os');
var fs = require('fs');
var unzip = require('unzip');
import {download} from 'electron-download-manager';
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";
import {EventModel} from "../../models/EventModel";
import {helper} from "../../src/var_helper";


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');



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
        let settings = await this.getSettings();
        let language = "en";
        if (settings) {
            language = settings.language;
        }

        let obj = {
            arg:this.render(`loading/loading.pug`),
            language: language
        };
        this.send_data(this.events.change_app_state, obj);
    }


    async checking_updates() {

        autoUpdater.autoDownload = false;
        autoUpdater.autoInstallOnAppQuit = false;

        autoUpdater.checkForUpdates();


        autoUpdater.on('update-available', (ev, info) => {

            console.log('update-available')
            this.send_data('checking_updates', true);

        })
        autoUpdater.on('update-not-available', (ev, info) => {

            this.send_data('checking_updates', false);
            console.log('update-not-available')

        })

        autoUpdater.on('download-progress', (progressObj) => {

            console.log(progressObj.percent)

        })

        autoUpdater.on('update-downloaded', (ev, info) => {

            console.log('dsfdsfsdfdsfsdfdsfs')
            this.send_data('get_updates', 100);

        })
    }

    async get_updates() {

        autoUpdater.downloadUpdate()

    };

    async install_updates() {

        autoUpdater.quitAndInstall();

    }

}




module.exports = EventsController;
