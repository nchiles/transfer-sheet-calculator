var menubar = require('menubar');

var mb = menubar({
    width: 443,
    height: 350, 
    icon: __dirname + '/icons/icon4@2x.png',
    // showDockIcon: false,
    transparent: true,
    vibrancy: 'dark',
    frame: false,
    titleBarStyle: 'customButtonsOnHover', //makes corners square due to bug (need to figure out how to make bottom 2 corners round)
    resizable: true,
    show: false
})

mb.on('ready', function ready () {
    console.log("app is running");
    exports.handleForm = function handleForm(targetWindow, labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse) {
        targetWindow.webContents.send('form-received', labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse);
    };
})




 
