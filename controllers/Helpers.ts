import * as fs from "fs";
import {files_config} from "../src/var_helper";
// let gm = require('gm').subClass({imageMagick: true});
import * as util from 'util'
import * as Electron from 'electron'
import nativeImage = Electron.nativeImage;
import NativeImage = Electron.NativeImage;
import {ControllerRegister} from "./ControllerRegister";
// require ('gm-base64');


export function save_file(file){
    file = check_files_dir(file);
    let base64file = file.file.split(';base64,').pop();
    fs.writeFileSync(`${file.path}${file.id}_${file.name}`, base64file, {encoding: 'base64'});
    console.log(`file ${file.name} saved`);
}

export function read_file(file){
    file = check_files_dir(file);
    let succ=true;
    try {
        file.file=`data:${file.type};base64,`+ fs.readFileSync(`${file.path}${file.id}_${file.name}`, {encoding: 'base64'});
    } catch (e) {
        console.log(e, 'file not found', file);
        succ=false;
    }
    return succ;

}

export function check_file_exist(file) {
    file = check_files_dir(file);
    return fs.existsSync(`${file.path}${file.id}_${file.name}`);
}

export function check_file_preview(type) {
    return [
        'image/jpeg',
        'image/png',
    ].includes(type);
}

function check_files_dir(file) {
    let controller = ControllerRegister.getInstance();
    if (!fs.existsSync(file.path)) {
        console.log("Current path not found, set default path");
        file.path = files_config.files_path;
        file.save();
        controller.run_controller("AccountController", "change_directory", files_config.files_path);
        if (!fs.existsSync(files_config.files_path))
        fs.mkdirSync(files_config.files_path);
    }
    return file;
}





export function b64img_to_buff(b64img) {
    b64img=b64img.substr(b64img.indexOf(',') + 1);
    return new Buffer(b64img, 'base64');
}

export async function resize_img_from_path(imgPath){
    let img=nativeImage.createFromPath(imgPath);
    img=await resize_img(img);
    return 'data:image/png;base64,'+img.toJPEG(100).toString('base64')
}

function resize_img(img:NativeImage):NativeImage{
    let size=240;
    let {width:x,height:y}=img.getSize();
    if (x>y){
        let range_x=size*(x/y);
        img=img.resize({height:size});
        let rect = {
            x:Math.round((range_x-size)/2),
            y:0,
            width:size,
            height:size
        };
        img=img.crop(rect);
    } else {
        let range_y=size*(y/x);
        img=img.resize({width:size});
        let rect = {
            y:Math.round((range_y-size)/2),
            x:0,
            width:size,
            height:size
        };
        img=img.crop(rect);


        // new_size=size+'x';
        // let range_y=size*(y/x);
        // img=img.geometry(new_size);
        // img=img.crop(size,size,0,Math.round((range_y-size)/2));
    }
    // const img_size = util.promisify(img.size).bind(img);
    // console.log(await img_size());
    // let {width:x,height:y} = await img_size();
    // let new_size:string;
    // if (x>y){
    //     new_size='x'+size;
    //     let range_x=size*(x/y);
    //     img=img.geometry(new_size);
    //     img=img.crop(size,size,Math.round((range_x-size)/2),0);
    // } else {
    //     new_size=size+'x';
    //     let range_y=size*(y/x);
    //     img=img.geometry(new_size);
    //     img=img.crop(size,size,0,Math.round((range_y-size)/2));
    // }
    // const img_b64 = util.promisify(img.toBase64).bind(img);
    // const img_buf = util.promisify(img.toBuffer).bind(img);
    // let round_img
    // let resized_img=await img_b64('jpg', true);
    return img;
}

export async function resize_b64_img(b64img){
    // console.log(b64img.substr(0,30));
    // let to_paste = b64img.substr(0,b64img.indexOf(',') + 1);
    b64img=b64img.substr(b64img.indexOf(',') + 1);
    // console.log(b64img.substr(0,30));
    let imgFile = new Buffer(b64img, 'base64');
    let img=nativeImage.createFromBuffer(imgFile);
    img=resize_img(img);
    return 'data:image/png;base64,'+img.toJPEG(50).toString('base64')
}

export abstract class Helper {
    private static date_options = {
        era: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    private static day_to_locale = {
        ru:{
            1: 'Пн',
            2: 'Вт',
            3: 'Ср',
            4: 'Чт',
            5: 'Пт',
            6: 'Сб',
            7: 'Вс'
        },
    };
    private static month_to_locale = {
      1:    "Января",
      2:    "Февраля",
      3:    "Марта",
      4:    "Апреля",
      5:    "Мая",
      6:    "Июня",
      7:    "Июля",
      8:    "Августа",
      9:    "Сентября",
      10:   "Октября",
      11:   "Ноября",
      12:   "Декабря",
    };

    static formate_date(date:Date,options:{locale:string,for:string}){
        let day_diff;
        let formated_date;
        let now=new Date();

        switch (options.for) {
            case 'message':
                formated_date=`${date.getHours()}:${get_minutes(date)}`;
                return formated_date;
            case 'chat':
                day_diff = now.getDate()-date.getDate();
                // console.log(`year ${date.getFullYear()} - ${now.getFullYear()}`);
                // console.log(`month ${date.getMonth()} - ${now.getMonth()}`);
                // console.log(`day ${date.getDate()} - ${now.getDate()}`);
                if (date.getFullYear()<now.getFullYear() || date.getMonth()<now.getMonth() || day_diff>6){
                    formated_date=`${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
                    return formated_date;
                }
                if (day_diff>0){
                    formated_date=this.day_to_locale[options.locale][date.getDay()];
                    return formated_date;
                }
                formated_date=`${date.getHours()}:${get_minutes(date)}`;
                return formated_date;
            case "dialog_date":
                 day_diff = now.getDate()-date.getDate();
                if (day_diff == 1){
                    return "Вчера";
                }
                if (day_diff > 0){
                    formated_date =`${date.getDate()} ${this.month_to_locale[date.getMonth() + 1]} ${date.getFullYear()}`;
                    return formated_date;
                }
                return "Сегодня";
        }

        return date.toLocaleString(options.locale, this.date_options)
    }
}



function get_minutes(date) {
    let minutes=date.getMinutes();
    return minutes<10?'0'+minutes:minutes;
}


