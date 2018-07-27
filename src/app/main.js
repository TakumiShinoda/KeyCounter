const {app, BrowserWindow} = require('electron');
const {distPath} = require('../../dev/path');

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    width: 840,
    height: 520,
    resizable: true,
    movable: true,
    transparent: true,
    titleBarStyle: 'hidden',
    frame: false,
  });
  mainWindow.loadURL('file://' + distPath.views('/index/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
