import * as fs from "fs";
import {files_config} from "../src/var_helper";
// let gm = require('gm').subClass({imageMagick: true});
import * as util from 'util'
import * as Electron from 'electron'
import nativeImage = Electron.nativeImage;
import NativeImage = Electron.NativeImage;
// require ('gm-base64');


export function save_file(file, path){
    if (!check_files_dir(path)) {path = files_config.files_path}
    let base64file = file.file.split(';base64,').pop();
    fs.writeFileSync(`${path}${file.id}_${file.name}`, base64file, {encoding: 'base64'});
    console.log(`file ${file.name} saved`);
}

export async function read_file(file, path){
    if (!check_files_dir(path)) {path = files_config.files_path}
    console.log("new path:", path);
    let succ=true;
    try {
        file.file=`data:${file.type};base64,`+ fs.readFileSync(`${path}${file.id}_${file.name}`, {encoding: 'base64'});
    } catch (e) {
        console.log(e, 'file not found', file);
        succ=false;
    }
    return succ;

}

export function check_file_exist(file, path) {
    if (!check_files_dir(path)) {path = files_config.files_path}
    return fs.existsSync(`${path}${file.id}_${file.name}`);
}

export function check_file_preview(type) {
    return [
        'image/jpeg',
        'image/png',
    ].includes(type);
}

async function check_files_dir(path) {
    if (!fs.existsSync(path)) {
        console.log("Path not found!!111");
        await this.controller_register.run_controller("AccountController", "update_directory", files_config.files_path);
        fs.mkdirSync(files_config.files_path);
        return false;
    }
    return true;
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

    static formate_date(date:Date,options:{locale:string,for:string}){
        let formated_date;
        let now=new Date();

        switch (options.for) {
            case 'message':
                formated_date=`${date.getHours()}:${get_minutes(date)}`;
                return formated_date;
            case 'chat':
                let day_diff = now.getDate()-date.getDate();
                console.log(`year ${date.getFullYear()} - ${now.getFullYear()}`);
                console.log(`month ${date.getMonth()} - ${now.getMonth()}`);
                console.log(`day ${date.getDate()} - ${now.getDate()}`);
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
        }

        return date.toLocaleString(options.locale, this.date_options)
    }
}



function get_minutes(date) {
    let minutes=date.getMinutes();
    return minutes<10?'0'+minutes:minutes;
}


