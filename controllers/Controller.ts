import {eth, dxmpp} from 'moonshard_core';
import {helper} from '../src/var_helper';
import {config} from '../src/env_config';
import * as Pug from "pug";
import {AccountModel} from "../models/AccountModel";
import {UserModel} from "../models/UserModel";
import {ControllerRegister} from "./ControllerRegister";
// import Pug from 'pug';
// const {eth,dxmpp} = require('moonshard_core');
// const config=require(__dirname+'/../src/events&types');
// const env=require(__dirname+'/../src/config');
// // const models=require(config.paths.models+'models_list');
// const pug=require('pug');

export abstract class Controller {
    protected pug = Pug;
    protected controller_register=ControllerRegister.getInstance();
    // protected self_info: any = null;
    protected Controllers: any;
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
    private self_info:UserModel=null;

    protected constructor(window, account_id: number = 1) {
        // let account = AccountModel.find({relations: ["user"], where: {id: account_id}, take: 1});
        // if (account) {
        //     this.self_info =account[0].user
        // }
        // console.log(account);
        // this.self_info = Account.user;
        this.window = window;
        this.Controllers = require(helper.paths.controllers + 'controllers_list');
    }

    protected render(path, data: any = null) {
        return this.pug.renderFile(this.paths.components + path, data, this.pug_options);
    };

    protected async get_self_info() {
        let account_id = 1;
        if (!this.self_info) {
            this.self_info = (await AccountModel.find({relations: ["user"], where: {id: account_id}, take: 1}))[0].user;

            for (let i in this.self_info){
                if (typeof this.self_info[i]!=='string')
                    delete this.self_info[i];
            }
        }

        return this.self_info;
        // let ret={};
        // for (let i in this.self_info){
        //     if (typeof this.self_info[i]==='string')
        //         ret[i]=this.self_info[i];
        // }
        // return ret;
        // if (account)
        // for (let col in account){
        //     info[col]=account[col];
        // }
        // return info;
    };

    protected send_data(event, data) {
        this.window.webContents.send(event, data);
    };

    // protected async init_controller(controller, func, ...args) {
    //     return await this.controller_register.run_controller_synchronously(controller, func, ...args);
    // };
}
