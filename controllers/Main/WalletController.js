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
require("reflect-metadata");
const Controller_1 = require("../Controller");
class WalletController extends Controller_1.Controller {
    change_wallet_menu(menu_type) {
        return __awaiter(this, void 0, void 0, function* () {
            this.send_data('change_wallet_menu', this.render(`main/wallet/${menu_type}.pug`));
        });
    }
    ;
}
module.exports = WalletController;
//# sourceMappingURL=WalletController.js.map