"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const var_helper_1 = require("../src/var_helper");
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
//# sourceMappingURL=Helpers.js.map