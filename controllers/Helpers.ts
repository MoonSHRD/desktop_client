import * as fs from "fs";
import {files_config} from "../src/var_helper";


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
