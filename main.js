const { app, BrowserWindow, ipcMain } = require('electron');
const path = require ('path');
const fs = require('fs');
const os = require('os');
var menubar = require('menubar');
const nativeImage = require('electron').nativeImage;

let window;

var image = nativeImage.createFromPath(__dirname + '/icons/dockicon.icns'); 
app.dock.setIcon(image);

var mb = menubar({
    width: 443,
    height: 380, 
    icon: __dirname + '/icons/icon4@2x.png',
    showDockIcon: true,
    // transparent: true,
    // vibrancy: 'dark',
    frame: false,
    titleBarStyle: 'customButtonsOnHover'
    // resizable: true,
    // show: false
})

mb.on('ready', function ready () {
  console.log('app is ready')
  // your app code here
    function createWindow() {
        window = new BrowserWindow({
            transparent: true,
            vibrancy: 'dark',
        });

        window.loadURL(`file://${__dirname}/index.html`);
        window.once('ready-to-show', function () {
            window.show();
        });

        // window.webContents.openDevTools();

        let contents = window.webContents;

        window.on('closed', function () {
            window = null;
        });
    }
 
    exports.handleForm = function handleForm(targetWindow, labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse) {
        targetWindow.webContents.send('form-received', labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse);
    };
    
    app.on('ready', function(){
        createWindow();
    });

    
})




 
