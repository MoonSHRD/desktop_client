import {eth, dxmpp} from 'moonshard_core';
import {helper} from '../src/var_helper';
import {config} from '../src/env_config';
import * as Pug from "pug";
import {AccountModel} from "../models/AccountModel";
import {UserModel} from "../models/UserModel";
import {ControllerRegister} from "./ControllerRegister";
import {Loom} from "../loom/loom";
import {Ipfs} from "../ipfs/ipfs";

export abstract class Controller {
    protected pug = Pug;
    protected controller_register = ControllerRegister.getInstance();
    protected window: any;
    protected dxmpp = dxmpp.getInstance();
    protected dxmpp_config = config;
    protected pug_options = helper.pug_options;
    protected paths = helper.paths;
    protected events = helper.events;
    protected chat_types = helper.chat_types;
    protected group_chat_types = helper.group_chat_types;
    protected chat_to_menu = helper.chat_to_menu;
    protected eth = eth;
    protected loom: Loom = Loom.getInstance();
    protected ipfs: Ipfs = Ipfs.getInstance();
    private self_info: UserModel = null;
    private me: AccountModel = null;

    protected constructor(window) {
        this.window = window;
    }

    protected render(path, data: any = null) {
        return this.pug.renderFile(this.paths.components + path, data, this.pug_options);
    };

    protected async get_self_info() {
        let account_id = 1;
        if (!this.self_info) {
            this.self_info = (await AccountModel.find({relations: ["user"], where: {id: account_id}, take: 1}))[0].user;

            for (let i in this.self_info) {
                if (typeof this.self_info[i] !== 'string')
                    delete this.self_info[i];
            }
        }

        return this.self_info;
    };

    protected send_data(event, data) {
        this.window.webContents.send(event, data);
    };

    protected async get_me(id:string) {
        if (!this.me) {
            this.me = (await AccountModel.find({where: {user_id:id}}))[0]
        }
        return this.me;
    }
}
