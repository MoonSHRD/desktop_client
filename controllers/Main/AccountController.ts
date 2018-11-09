import "reflect-metadata";
import {Controller} from "../Controller";
import {AccountModel} from "../../models/AccountModel";
import * as fs from "fs";
var encryptor = require('file-encryptor');

class AccountController extends Controller {

    async encrypt_db () {
        let me = await this.get_me();
        let key = me.privKey;
        if (fs.existsSync(`${__dirname}/../../sqlite/data.db`))
            encryptor.encryptFile(`${__dirname}/../../sqlite/data.db`, `${__dirname}/../../sqlite/encrypted.db`, key, function (err) {});
        else console.log("File for decrypt not exist");
    }

    async decrypt_db () {
        let me = await this.get_me();
        let key = me.privKey;
        if (fs.existsSync(`${__dirname}/../../sqlite/encrypted.db`))
            encryptor.decryptFile(`${__dirname}/../../sqlite/encrypted.db`, `${__dirname}/../../sqlite/test.db`, key, function(err) {});
        else console.log("File for encrypt not exist");
    }
}

module.exports = AccountController;