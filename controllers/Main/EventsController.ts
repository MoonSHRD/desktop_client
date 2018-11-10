import "reflect-metadata";
const axios = require('axios');
const os = require('os');
var fs = require('fs');
var unzip = require('unzip');
import {download} from 'electron-download-manager';
const updater = require('electron-simple-updater');


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
        this.send_data(this.events.change_app_state, this.render(`loading/loading.pug`));
    }

    async update_server(os, file){

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

    }


    async checking_updates() {

        updater.init({
            autoDownload: false,
            url:'http://localhost:8081/update.json',
            checkUpdateOnStart: true
        });


        updater.on('update-not-available', () =>
        {
            this.send_data('checking_updates', false);
            console.log('Update is not available');
        })


        updater.on('update-available', (meta) => {

            // this.send_data('get_updates', stringf);
            //
            this.send_data('checking_updates', true);

            console.log('Update available')
        });

        }


        async get_updates() {
            // const stringf = 'update-not-available'
            // console.log('211111111111111111111113')
            updater.downloadUpdate()

            console.log('435345345345345345345')

            download({
                url: `http://localhost:8081/updates/Linux/Moonshard_0.0.2.AppImage`,
                onProgress:  (percentage) => {
                    console.log("percentage : " + percentage );
                    this.send_data('get_updates', percentage);
                }
            }, function (error, info) {
                if (error) {
                    console.log(error);
                    return;
                }

                // console.log('Downloading update:', meta);

            });

        // updater.init('http://localhost:8081/update.json');

        // updater.on('checking-for-update', () => console.log('Checking for updates...'));




        };


        async install_updates() {

            updater.quitAndInstall()
        }

}

module.exports = EventsController;
