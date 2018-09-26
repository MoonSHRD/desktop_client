"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var AccountModel_1 = require("../../models/AccountModel");
var Controller_1 = require("../Controller");
var UserModel_1 = require("../../models/UserModel");
var AuthController = /** @class */ (function (_super) {
    __extends(AuthController, _super);
    function AuthController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthController.prototype.init_auth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, AccountModel_1.AccountModel.findOne(1)];
                    case 1:
                        account = _a.sent();
                        if (account)
                            this.auth(account);
                        else
                            this.send_data(this.events.change_app_state, this.render('auth/123.pug'));
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    AuthController.prototype.generate_mnemonic = function () {
        this.send_data(this.events.generate_mnemonic, this.eth.generate_mnemonic());
    };
    ;
    AuthController.prototype.auth = function (account) {
        account.host = this.dxmpp_config.host;
        account.jidhost = this.dxmpp_config.jidhost;
        account.port = this.dxmpp_config.port;
        this.dxmpp.connect(account);
    };
    AuthController.prototype.save_acc = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var privKey, address, user, account;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        privKey = this.eth.generate_priv_key();
                        address = this.eth.generate_address(privKey);
                        user = new UserModel_1.UserModel();
                        user.id = address;
                        user.domain = 'localhost';
                        user.self = true;
                        user.name = data.firstname + (data.lastname ? " " + data.lastname : "");
                        user.firstname = data.firstname;
                        user.lastname = data.lastname;
                        user.bio = data.bio;
                        user.avatar = data.avatar;
                        return [4 /*yield*/, user.save()];
                    case 1:
                        _a.sent();
                        account = new AccountModel_1.AccountModel();
                        account.privKey = privKey;
                        account.privKeyLoom = "fwafawfawfwa";
                        account.passphrase = data.mnemonic;
                        account.user = user;
                        return [4 /*yield*/, account.save()];
                    case 2:
                        _a.sent();
                        this.dxmpp.set_vcard(user.firstname, user.lastname, user.bio, user.avatar);
                        this.auth(account);
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return AuthController;
}(Controller_1.Controller));
module.exports = AuthController;
//# sourceMappingURL=AuthController.js.map