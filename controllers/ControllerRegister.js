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
const Queue = require("better-queue");
const Controllers = {
    AuthController: require(__dirname + '/Auth/AuthController'),
    ChatsController: require(__dirname + '/Main/ChatsController'),
    MessagesController: require(__dirname + '/Main/MessagesController'),
    MenuController: require(__dirname + '/Main/MenuController'),
    EventsController: require(__dirname + '/Main/EventsController'),
    WalletController: require(__dirname + '/Main/WalletController'),
};
class ControllerRegister {
    constructor(window) {
        this.Controllers = [];
        this.window = window;
        this.queue = new Queue((fn, cb) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield fn();
            }
            catch (e) {
                console.log(e);
            }
            cb();
        }));
    }
    static getInstance(window = null) {
        if (!ControllerRegister.instance) {
            if (!window)
                throw new Error('must pass window parameter');
            ControllerRegister.instance = new ControllerRegister(window);
        }
        return ControllerRegister.instance;
    }
    get_controller(controller) {
        if (!this.Controllers[controller]) {
            this.Controllers[controller] = new Controllers[controller](this.window);
        }
        return this.Controllers[controller];
    }
    queue_controller(controller, func, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.push(() => __awaiter(this, void 0, void 0, function* () {
                return yield this.get_controller(controller)[func](...args);
            }));
        });
    }
    run_controller(controller, func, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get_controller(controller)[func](...args);
        });
    }
    get_controller_parameter(controller, parameter) {
        if (!this.Controllers[controller]) {
            this.Controllers[controller] = new Controllers[controller](this.window);
        }
        return this.Controllers[controller][parameter];
    }
}
exports.ControllerRegister = ControllerRegister;
//# sourceMappingURL=ControllerRegister.js.map