var menubar = require('menubar');
const { Menu } = require('electron');

var mb = menubar({
    width: 443,
    height: 350,
    icon: __dirname + '/icons/icon4@2x.png',
    showDockIcon: false,
    transparent: true,
    vibrancy: 'dark',
    frame: false,
    titleBarStyle: 'customButtonsOnHover', //makes corners square due to bug (need to figure out how to make bottom 2 corners round)
    resizable: true,
    show: false, 
    preloadWindow: true
})

mb.on('after-create-window', function() {
    exports.handleForm = function handleForm(targetWindow, labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse) {
        targetWindow.webContents.send('form-received', labelwidth, labelheight, xsresponse, smresponse, mdresponse, lgresponse, xlresponse, twoxresponse, threexresponse, fourxresponse);
    };

    const contextMenu = Menu.buildFromTemplate ([
        {label: 'Show Dock Icon', click: () => { mb.app.dock.show(); }},
        {label: 'Hide Dock Icon', click: () => { mb.app.dock.hide(); }},
        {type: 'separator'},
        {label: 'Restart', click: () => { mb.app.quit();mb.app.relaunch(); }},
        {type: 'separator'},
        {label: 'Quit', click: () => { mb.app.quit (); }}
    ])

    mb.tray.on('click', (event) => {
        if (event.ctrlKey) {   
            mb.tray.popUpContextMenu (contextMenu);
        }
    });

    mb.tray.on ('right-click', () => {
        mb.tray.popUpContextMenu(contextMenu);
    })

    mb.tray.setToolTip('Transfer Sheet Calculator\n(right click for options)');
});








