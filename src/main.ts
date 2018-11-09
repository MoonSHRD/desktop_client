'use strict';
// let Router = require('electron-routes');

import {Router} from "./router";
// let exec = require('child_process').exec;
const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');
// const Router = require('./router');
const DownloadManager = require("electron-download-manager");

DownloadManager.register({
    downloadFolder: __dirname + `/../updates/`
});
app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        console.log(`Could not initiate 'electron-pug'`);
    }

    let mainWindow = new BrowserWindow({ width: 1000, minWidth: 1000, height: 750, minHeight: 750, resizable: true, show: false, webPreferences: {
            nodeIntegration: true   }, icon: __dirname + '/icon.png' });

    // mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.on('dom-ready', function() {
        // console.log('finished');
        mainWindow.show();
        const router = new Router(mainWindow);
        router.start_loading();
    });

    mainWindow.on('closed', () => {
        // console.log('closed')
        // let child = exec(`node ./src/just.js`, function (error, stdout, stderr) {
        //
        //
        //         console.log('stdout: ', stdout);
        //         console.log('stderr: ', stderr);
        //         if (error !== null) {
        //             console.log('exec error: ', error);
        //         }
        //     },
        //     {
        //         detached: true,
        //         stdio: ['ignore', 'ignore', 'ignore'],
        //     })
        // child.unref();

    })


});


app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
