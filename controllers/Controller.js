const {eth} = require('moonshard_core');
const config=require(__dirname+'/../src/' + 'events&types');
const models=require(config.paths.models+'models_list');
const pug=require('pug');

class Controller {
    constructor(window) {
        if (new.target === Controller) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this._pug=pug;
        this._window = window;
        this._pug_options = config.pug_options;
        this.paths = config.paths;
        this.events = config.events;
        this.types = config.paths;
        // this.sqlite = require(this.paths.storage+'dbup');
        this.eth = eth;
        this._models = models;
        // this._dxmpp = dxmpp;
        // this._messaging = messaging;
    }

    get_model(model){
        // console.log(this.Controllers);
        return this._models[model];
    };

    render(path, data){
        return this._pug.renderFile(this.paths.components + path, data, this._pug_options);
    };

    send_data(event,data){
        this._window.webContents.send(event, data);
    };
}

module.exports = Controller;
