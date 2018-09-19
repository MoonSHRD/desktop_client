var _a = require('moonshard_core'), eth = _a.eth, dxmpp = _a.dxmpp;
var config = require(__dirname + '/../src/events&types');
var env = require(__dirname + '/../src/config');
// const models=require(config.paths.models+'models_list');
var pug = require('pug');
var Controller = /** @class */ (function () {
    function Controller(window) {
        this.pug = pug;
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
    Controller.prototype.render = function (path, data) {
        return this.pug.renderFile(this.paths.components + path, data, this.pug_options);
    };
    ;
    Controller.prototype.send_data = function (event, data) {
        this.window.webContents.send(event, data);
    };
    ;
    return Controller;
}());
module.exports = Controller;
//# sourceMappingURL=Controller.js.map