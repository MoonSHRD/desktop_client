"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("../Controller");
const loom_1 = require("../../loom/loom");
class MainController extends Controller_1.Controller {
    constructor() {
        super(...arguments);
        this.loom = loom_1.Loom.getInstance();
    }
}
exports.MainController = MainController;
//# sourceMappingURL=MainController.js.map