const {eth,dxmpp} = require('moonshard_core');
const config=require(__dirname+'/../src/events&types');
const env=require(__dirname+'/../src/config');
// const models=require(config.paths.models+'models_list');
const pug=require('pug');

abstract class Controller {
    protected pug:any;
    protected window:any;
    protected dxmpp:any;
    protected dxmpp_config:any;
    protected pug_options:object;
    protected paths:any;
    protected events:any;
    protected chat_types:object;
    protected general_chat_types:any;
    protected eth:any;

    protected constructor(window) {
        this.pug=pug;
        this.window = window;
        this.dxmpp = dxmpp.getInstance();
        this.dxmpp_config = env;
        this.pug_options = config.pug_options;
        this.paths = config.paths;
        this.events = config.events;
        this.chat_types = config.chat_types;
        this.general_chat_types = config.general_chat_types;
        this.eth = eth;
    }

    protected render(path, data){
        return this.pug.renderFile(this.paths.components + path, data, this.pug_options);
    };

    protected send_data(event,data){
        this.window.webContents.send(event, data);
    };
}

module.exports = Controller;
