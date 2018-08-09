const {app, BrowserWindow, dialog} = require('electron');
const {distPath} = require('../../dev/path');
const ipc = require('electron').ipcMain;
const KeyObserber = require('./module/KeyObserber');
const Storage = require('electron-json-storage');
const os = require('os');

const Platform = os.platform();

const CheckPermissionOption = {
  width: 500,
  height: 150,
  title: 'Permission Require',
  resizable: false,
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
  let mainWindow = new BrowserWindow(MainWindowOption);

  CheckPermissionWindow.hide();
  mainWindow.hide();

  if(Platform == 'darwin'){
    CheckPermission.show();
    CheckPermissionWindow.loadURL('file://' + distPath.views('/CheckPermission/index.html'))
    ipc.on('setPasswd', (ev, pass) => {
      KeyObserber.setPasswd(pass);
      KeyObserber.checkPasswd()
        .then(() => {
          console.log("suc");
          KeyObserber.keyListener((data) => {
            let post = data.toString();
            let params = post.split(' ');
            let now = new Date(parseInt(params[0]) * 1000).toLocaleString();
            let today = now.split(' ')[0].split('/').join('-');
            let postData = {epoch: params[0], key: params[1]};

            Storage.get(today, (err, jsonObj) => {
              if(err) console.log(err);

              console.log(jsonObj);
              if(Object.keys(jsonObj) == 0){
                Storage.set(today, {log:[]}, (err) => {
                  if(err) console.log(err);
                })
              }else{
                jsonObj.log.push(postData);
                Storage.set(today, jsonObj, (err) => {
                  if(err) console.log(err);
                });
              }
            })

          }, (err) => {
            console.log(err.toString());
            dialog.showErrorBox('Error', 'Cause launch error.');
          });
          CheckPermissionWindow.hide();
        })
        .then(() => {
          mainWindow.show();
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
  }else if('windows'){
    mainWindow.show();
    mainWindow.loadURL('file://' + distPath.views('/index/index.html'));
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }
});
