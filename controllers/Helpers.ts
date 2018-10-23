import * as fs from "fs";
import {files_config} from "../src/var_helper";
let gm = require('gm').subClass({imageMagick: true});
import * as util from 'util'
require ('gm-base64');


export function save_file(file){
    check_files_dir();
    let base64file = file.file.split(';base64,').pop();
    fs.writeFileSync(`${files_config.files_path}${file.id}_${file.name}`, base64file, {encoding: 'base64'});
    console.log(`file ${file.name} saved`);
}

export function read_file(file){
    check_files_dir();
    let succ=true;
    try {
        file.file=`data:${file.type};base64,`+ fs.readFileSync(`${files_config.files_path}${file.id}_${file.name}`, {encoding: 'base64'});
    } catch (e) {
        console.log(e, 'file not found', file);
        succ=false;
    }
    return succ;

}

export function check_file_exist(file) {
    check_files_dir();
    return fs.existsSync(`${files_config.files_path}${file.id}_${file.name}`);
}

export function check_file_preview(type) {
    return [
        'image/jpeg',
        'image/png',
    ].includes(type);
}

function check_files_dir() {
    if (!fs.existsSync(files_config.files_path)) {
        fs.mkdirSync(files_config.files_path);
    }
}





export function b64img_to_buff(b64img) {
    b64img=b64img.substr(b64img.indexOf(',') + 1);
    return new Buffer(b64img, 'base64');
}

export async function resize_img_from_path(imgPath){
    let img=gm(imgPath);
    return (await resize_img(img));
}

async function resize_img(img){
    let size=240;
    const img_size = util.promisify(img.size).bind(img);
    console.log(await img_size());
    let {width:x,height:y} = await img_size();
    let new_size:string;
    if (x>y){
        new_size='x'+size;
        let range_x=size*(x/y);
        img=img.geometry(new_size);
        img=img.crop(size,size,Math.round((range_x-size)/2),0);
    } else {
        new_size=size+'x';
        let range_y=size*(y/x);
        img=img.geometry(new_size);
        img=img.crop(size,size,0,Math.round((range_y-size)/2));
    }
    const img_b64 = util.promisify(img.toBase64).bind(img);
    let resized_img=await img_b64('jpg', true);
    return resized_img;
}

export async function resize_b64_img(b64img){
    console.log(b64img.substr(0,30));
    b64img=b64img.substr(b64img.indexOf(',') + 1);
    console.log(b64img.substr(0,30));
    let imgFile = new Buffer(b64img, 'base64');
    let img=gm(imgFile);
    return (await resize_img(img));
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

    private static day_ru = {
        1:''
    };

    static formate_date(date:Date,options:{locale:string,for:string}){
        let formated_date;
        let now=new Date();

        function get_minutes(date) {
            let minutes=date.getMinutes();
            return minutes<10?'0'+minutes:minutes;
        }

        switch (options.for) {
            case 'message':
                formated_date=`${date.getHours()}:${get_minutes(date)}`;
                return formated_date;
            case 'chat':
                let day_diff = date.getDay()-now.getDay();
                if (date.getFullYear()<now.getFullYear() || date.getMonth()<now.getMonth() || day_diff>6){
                    formated_date=date.getDate();
                    return formated_date;
                }
                if (day_diff>0){
                    formated_date=date.getDay();
                    return formated_date;
                }
                let minutes=date.getMinutes();
                formated_date=`${date.getHours()}:${get_minutes(date)}`;
                return formated_date;
        }

        return date.toLocaleString(options.locale, this.date_options)
    }
}


