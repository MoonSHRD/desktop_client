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

    async get_updates() {
            const stringf = 'update-not-available'

        updater.init('http://localhost:8081/update.json');

        updater.on('checking-for-update', () => console.log('Checking for updates...'));
        updater.on('update-not-available', () =>
        {
            this.send_data('get_updates', stringf);
            console.log('Update is not available');
        })
        updater.on('update-available', (meta) => {
            this.send_data('get_updates', meta);

            console.log('Update available')
        });
        updater.on('update-downloaded', () => {


            updater.quitAndInstall()


        });




        updater.on('update-downloading', (meta) => {
            console.log()

            download({
                url: `http://localhost:8081/updates/Linux/Moonshard_0.0.2.AppImage`,
                onProgress:  (percentage) => {
                    console.log("percentage : " + percentage );
                    // this.send_data('get_updates', percentage);
                }
            }, function (error, info) {
                if (error) {
                    console.log(error);
                    return;
                }

                console.log('Downloading update:', meta);

            });
        })

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


    };

}

module.exports = EventsController;
