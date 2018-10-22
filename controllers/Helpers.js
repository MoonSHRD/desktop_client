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
const fs = require("fs");
const var_helper_1 = require("../src/var_helper");
let gm = require('gm').subClass({ imageMagick: true });
const util = require("util");
require('gm-base64');
function save_file(file) {
    check_files_dir();
    let base64file = file.file.split(';base64,').pop();
    fs.writeFileSync(`${var_helper_1.files_config.files_path}${file.id}_${file.name}`, base64file, { encoding: 'base64' });
    console.log(`file ${file.name} saved`);
}
exports.save_file = save_file;
function read_file(file) {
    check_files_dir();
    let succ = true;
    try {
        file.file = `data:${file.type};base64,` + fs.readFileSync(`${var_helper_1.files_config.files_path}${file.id}_${file.name}`, { encoding: 'base64' });
    }
    catch (e) {
        console.log(e, 'file not found', file);
        succ = false;
    }
    return succ;
}
exports.read_file = read_file;
function check_file_exist(file) {
    check_files_dir();
    return fs.existsSync(`${var_helper_1.files_config.files_path}${file.id}_${file.name}`);
}
exports.check_file_exist = check_file_exist;
function check_file_preview(type) {
    return [
        'image/jpeg',
        'image/png',
    ].includes(type);
}
exports.check_file_preview = check_file_preview;
function check_files_dir() {
    if (!fs.existsSync(var_helper_1.files_config.files_path)) {
        fs.mkdirSync(var_helper_1.files_config.files_path);
    }
}
function b64img_to_buff(b64img) {
    b64img = b64img.substr(b64img.indexOf(',') + 1);
    return new Buffer(b64img, 'base64');
}
exports.b64img_to_buff = b64img_to_buff;
function resize_b64_img(b64img) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(b64img.substr(0, 30));
        b64img = b64img.substr(b64img.indexOf(',') + 1);
        console.log(b64img.substr(0, 30));
        let size = 240;
        let imgFile = new Buffer(b64img, 'base64');
        let img = gm(imgFile);
        const img_size = util.promisify(img.size).bind(img);
        console.log(yield img_size());
        let { width: x, height: y } = yield img_size();
        let new_size;
        if (x > y) {
            new_size = 'x' + size;
            let range_x = size * (x / y);
            img = img.geometry(new_size);
            img = img.crop(size, size, Math.round((range_x - size) / 2), 0);
        }
        else {
            new_size = size + 'x';
            let range_y = size * (y / x);
            img = img.geometry(new_size);
            img = img.crop(size, size, 0, Math.round((range_y - size) / 2));
        }
        const img_b64 = util.promisify(img.toBase64).bind(img);
        let resized_img = yield img_b64('jpg', true);
        return resized_img;
    });
}
exports.resize_b64_img = resize_b64_img;
//# sourceMappingURL=Helpers.js.map