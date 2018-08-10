'use strict';
// let Router = require('electron-routes');

const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');

// require('./migration');
// Standard stuff

app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        // Could not initiate 'electron-pug'
    }

    let mainWindow = new BrowserWindow({ width: 900, height: 600, webPreferences: {
            nodeIntegration: true   } });

    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    const router = require(__dirname+'/router');
    router(mainWindow);
    //require('./dxmpp');
    // the rest...
});
