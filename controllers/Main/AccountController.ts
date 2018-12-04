import "reflect-metadata";
import {Controller} from "../Controller";
import {AccountModel} from "../../models/AccountModel";
import * as fs from "fs";
import {app, BrowserWindow} from 'electron';
var encryptor = require('file-encryptor');
let path = app.getPath('userData');

class AccountController extends Controller {

    async encrypt_db () {
        let me = await this.get_me();
        let key = me.privKey;
        // if (fs.existsSync(`${__dirname}/../../sqlite/data.db`) && !fs.existsSync(`${__dirname}/../../sqlite/encrypted.db`))
        //     encryptor.encryptFile(`${__dirname}/../../sqlite/data.db`, `${__dirname}/../../sqlite/encrypted.db`, key, function (err) {});
        if (fs.existsSync(`${path}/data.db`) && !fs.existsSync(`${path}/encrypted.db`))
            encryptor.encryptFile(`${path}/data.db`, `${path}/encrypted.db`, key, function (err) {});
        else console.log("File for decrypt not exist or file already created");
    };

    async decrypt_db () {
        let me = await this.get_me();
        let key = me.privKey;
        // if (fs.existsSync(`${__dirname}/../../sqlite/encrypted.db`) && !fs.existsSync(`${__dirname}/../../sqlite/test.db`))
        //     encryptor.decryptFile(`${__dirname}/../../sqlite/encrypted.db`, `${__dirname}/../../sqlite/test.db`, key, function(err) {});
        if (fs.existsSync(`${path}/encrypted.db`) && !fs.existsSync(`${path}/test.db`))
            encryptor.decryptFile(`${path}/encrypted.db`, `${path}/test.db`, key, function(err) {});
        else console.log("File for encrypt not exist or file already created");
    };
}

module.exports = AccountController;
