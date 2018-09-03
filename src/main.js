'use strict';
// let Router = require('electron-routes');

const {app, BrowserWindow} = require('electron');
const locals = {/* ...*/};
const setupPug = require('electron-pug');
const router = require('./router');

app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals);
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        // Could not initiate 'electron-pug'
    }

    let mainWindow = new BrowserWindow({ width: 1200, height: 800, show: false, webPreferences: {
            nodeIntegration: true   } });

    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(`file://${__dirname}/index.pug`);
    mainWindow.webContents.on('dom-ready', function() {
        console.log('finished');
        mainWindow.show();
        setTimeout(()=>{router(mainWindow)}, 2000)
    });
});


app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});
