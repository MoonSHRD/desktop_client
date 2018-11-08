import "reflect-metadata";
import {Controller} from "../Controller";
import {AccountModel} from "../../models/AccountModel";
import * as fs from "fs";
var encryptor = require('file-encryptor');

class AccountController extends Controller {
    async change_directory(path) {
        if (path == "undefined/") return;
        let account = (await AccountModel.find({where: {id:1}}))[0];
        account.downloads = path;
        await account.save()
    };
    async update_last_chat(chat_id) {
        let account = (await AccountModel.find({where: {id:1}}))[0];
        account.last_chat = chat_id;
        await account.save()
    }

    async change_windows_size(width, height) {
        let account = (await AccountModel.find({where: {id:1}}))[0];
        account.width = width;
        account.height = height;
        await account.save();
    };

    async change_chats_width(width) {
        let account = (await AccountModel.find({where: {id:1}}))[0];
        account.width_chats = width;
        await account.save();
    };

    async set_sizes(id) {
        let me = await this.get_me(id);
        await this.send_data("set_chats_width", me.width_chats);
        let sizes = {width:me.width, height:me.height};
        await this.send_data("set_windows_size", sizes);
    };

    async decrypt_db () {
        let account = (await AccountModel.find({where: {id:1}}))[0];
        let key = account.privKey;
        if (fs.existsSync(`${__dirname}/../../sqlite/data.db`))
            encryptor.encryptFile(`${__dirname}/../../sqlite/data.db`, `${__dirname}/../../sqlite/encrypted.db`, key, function (err) {});
        else console.log("File for decrypt not exist");

    }

    async encrypt_db () {
        let account = (await AccountModel.find({where: {id:1}}))[0];
        let key = account.privKey;
        if (fs.existsSync(`${__dirname}/../../sqlite/encrypted.db`))
            encryptor.decryptFile(`${__dirname}/../../sqlite/encrypted.db`, `${__dirname}/../../sqlite/test.db`, key, function(err) {});
       else console.log("File for encrypt not exist");
    }
}

module.exports = AccountController;