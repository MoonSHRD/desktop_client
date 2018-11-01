import "reflect-metadata";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";
import {MessageModel} from "../../models/MessageModel";
import {getConnection} from "typeorm";
import {Helper} from "../Helpers";
import {AccountModel} from "../../models/AccountModel";

class ChatsController extends Controller {
    async update_directory(path) {
        let account = new AccountModel;
        account.downloads = path;
        account.id = 1;
        account.save()
    }
}

module.exports = ChatsController;