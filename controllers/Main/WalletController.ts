import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";
import {MessageModel} from "../../models/MessageModel";

class WalletController extends Controller {

    async change_wallet_menu(menu_type:string) {
        this.send_data('change_wallet_menu', this.render(`main/wallet/${menu_type}.pug`));
    };

}

module.exports = WalletController;
