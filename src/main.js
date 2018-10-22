'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// let Router = require('electron-routes');
const router_1 = require("./router");
const { app, BrowserWindow } = require('electron');
const locals = { /* ...*/};
const setupPug = require('electron-pug');
// const Router = require('./router');
app.on('ready', () => __awaiter(this, void 0, void 0, function* () {
    try {
        let pug = yield setupPug({ pretty: true }, locals);
        pug.on('error', err => console.error('electron-pug error', err));
    }
    catch (err) {
        console.log(`Could not initiate 'electron-pug'`);
    }
    let mainWindow = new BrowserWindow({ width: 1200, minWidth: 1180, height: 800, minHeight: 800, resizable: true, show: false, webPreferences: {
            nodeIntegration: true
        }, icon: __dirname + '/icon.png' });
    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.on('dom-ready', function () {
        // console.log('finished');
        mainWindow.show();
        const router = new router_1.Router(mainWindow);
        router.start_loading();
    });
}));
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
//# sourceMappingURL=main.js.map