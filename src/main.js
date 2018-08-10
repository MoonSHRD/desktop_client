'use strict';
// let Router = require('electron-routes');

const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');
const router = require('./router');

// require('./migration');
// Standard stuff

app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        // Could not initiate 'electron-pug'
    }

    let mainWindow = new BrowserWindow({ width: 1200, height: 600, webPreferences: {
            nodeIntegration: true   } });

    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.send('online', 'online');
    setTimeout(router(mainWindow), 100);
    //require('./dxmpp');
    // the rest...
});
