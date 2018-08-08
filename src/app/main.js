const {app, BrowserWindow, dialog} = require('electron');
const {distPath} = require('../../dev/path');
const ipc = require('electron').ipcMain;
const KeyObserber = require('./module/KeyObserber');

const CheckPermissionOption = {
  width: 500,
  height: 150,
  title: 'Permission Require',
  resizable: false
}

const MainWindowOption = {
  width: 840,
  height: 520,
  resizable: false,
  movable: true,
  transparent: true,
  titleBarStyle: 'hidden',
  // frame: false,
}

app.on('ready', () => {
  let CheckPermissionWindow = new BrowserWindow(CheckPermissionOption);

  CheckPermissionWindow.loadURL('file://' + distPath.views('/CheckPermission/index.html'));
  ipc.on('setPasswd', (ev, pass) => {
    KeyObserber.setPasswd(pass);
    KeyObserber.checkPasswd()
      .then(() => {
        console.log("suc");
        KeyObserber.keyListener((data) => {
          console.log(data.toString());
        }, (err) => {
          console.log(err.toString());
          dialog.showErrorBox('Error', 'Cause launch error.');
        });
        CheckPermissionWindow.hide();
      })
      .then(() => {
        let mainWindow = new BrowserWindow(MainWindowOption);
        mainWindow.loadURL('file://' + distPath.views('/index/index.html'));

        mainWindow.on('closed', () => {
          mainWindow = null;
        });
      })
      .catch(() => {
        console.log("fail");
        dialog.showErrorBox('Incorrect', 'You need correct Password');
      });
  });
});
