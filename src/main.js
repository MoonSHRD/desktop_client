'use strict';
// let Router = require('electron-routes');

const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');
const router = require('./router');

// require('./migration');
// Standard stuff

// function pr_root(){
//     return __dirname;
// }

app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        // Could not initiate 'electron-pug'
    }

    let mainWindow = new BrowserWindow({ width: 1200, height: 600, show: false, webPreferences: {
            nodeIntegration: true   } });

    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.on('dom-ready', function() {
        console.log('finished');
        mainWindow.show();
        // setTimeout(()=>{router(mainWindow)},15000)
        router(mainWindow);
    });
    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.show();
    //     // mainWindow.webContents.send('auth_mnem', 'fwafwa');
    //     router(mainWindow);
    // });
    // mainWindow.webContents.send('online', 'online');

    //require('./dxmpp');
    // the rest...
});
