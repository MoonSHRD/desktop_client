'use strict';

const {app, BrowserWindow} = require('electron')
const locals = {/* ...*/}
const setupPug = require('electron-pug')


// Standard stuff

app.on('ready', async () => {
    try {
        let pug = await setupPug({pretty: true}, locals)
        pug.on('error', err => console.error('electron-pug error', err))
    } catch (err) {
        // Could not initiate 'electron-pug'
    }

    let mainWindow = new BrowserWindow({ width: 800, height: 600 })

    mainWindow.loadURL(`file://${__dirname}/index.pug`)
    // the rest...
})