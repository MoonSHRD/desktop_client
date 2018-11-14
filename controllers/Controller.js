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
const moonshard_core_1 = require("moonshard_core");
const var_helper_1 = require("../src/var_helper");
const env_config_1 = require("../src/env_config");
const Pug = require("pug");
const AccountModel_1 = require("../models/AccountModel");
const ControllerRegister_1 = require("./ControllerRegister");
// import {Loom} from "../loom/loom";
const ipfs_1 = require("../ipfs/ipfs");
const SettingsModel_1 = require("../models/SettingsModel");
const grpc_1 = require("../grpc/grpc");
const web3_1 = require("../web3/web3");
class Controller {
    constructor(window) {
        this.pug = Pug;
        this.controller_register = ControllerRegister_1.ControllerRegister.getInstance();
        this.grpc = grpc_1.Grpc.getIntance();
        this.dxmpp = moonshard_core_1.Dxmpp.getInstance();
        this.dxmpp_config = env_config_1.config;
        this.pug_options = var_helper_1.helper.pug_options;
        this.paths = var_helper_1.helper.paths;
        this.events = var_helper_1.helper.events;
        this.chat_types = var_helper_1.helper.chat_types;
        this.group_chat_types = var_helper_1.helper.group_chat_types;
        this.chat_to_menu = var_helper_1.helper.chat_to_menu;
        this.eth = moonshard_core_1.eth;
        this.web3 = web3_1.Web3S.GetInstance();
        // protected loom: Loom = Loom.getInstance();
        this.ipfs = ipfs_1.Ipfs.getInstance();
        this.self_info = null;
        this.me = null;
        this.settings = null;
        this.window = window;
    }
    render(path, data = null) {
        return this.pug.renderFile(this.paths.components + path, data, this.pug_options);
    }
    ;
    get_self_info() {
        return __awaiter(this, void 0, void 0, function* () {
            let account_id = 1;
            if (!this.self_info) {
                this.self_info = (yield AccountModel_1.AccountModel.find({ relations: ["user"], where: { id: account_id }, take: 1 }))[0].user;
                for (let i in this.self_info) {
                    if (typeof this.self_info[i] !== 'string')
                        delete this.self_info[i];
                }
            }
            return this.self_info;
        });
    }
    ;
    send_data(event, data) {
        this.window.webContents.send(event, data);
    }
    ;
    get_me() {
        return __awaiter(this, void 0, void 0, function* () {
            this.me = yield AccountModel_1.AccountModel.findOne(1);
            return this.me;
        });
    }
    getSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = yield SettingsModel_1.SettingsModel.findOne(1);
            return this.settings;
        });
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map