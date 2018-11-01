'use strict';
// let Router = require('electron-routes');

import {Router} from "./router";

const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');
// const Router = require('./router');

app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        console.log(`Could not initiate 'electron-pug'`);
    }

    let mainWindow = new BrowserWindow({ width: 1000, minWidth: 1000, height: 700, minHeight: 700, resizable: true, show: false, webPreferences: {
            nodeIntegration: true   }, icon: __dirname + '/icon.png' });

    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.on('dom-ready', function() {
        // console.log('finished');
        mainWindow.show();
        const router = new Router(mainWindow);
        router.start_loading();
    });
});


app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
