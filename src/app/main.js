const {app, BrowserWindow, dialog} = require('electron');
const {distPath} = require('../../dev/path');
const ipc = require('electron').ipcMain;
const KeyObserber = require('./module/KeyObserber');
const Storage = require('electron-json-storage');
const os = require('os');

const Platform = os.platform();
let CheckPermissionWindow;
let mainWindow;

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
}

function openMainWindow(){
  mainWindow.show();
  mainWindow.loadURL('file://' + distPath.views('/index/index.html'));
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function saveData(data){
  let post = data.toString();
  let params = post.split(' ');
  let now = new Date(parseInt(params[0]) * 1000).toLocaleString();
  let today = now.split(' ')[0].split('/').join('-');
  let postData = {epoch: params[0], key: params[1]};

  Storage.get(today, (err, jsonObj) => {
    if(err) console.log(err);
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
  });
}

app.on('ready', () => {
  CheckPermissionWindow = new BrowserWindow(CheckPermissionOption);
  mainWindow = new BrowserWindow(MainWindowOption);

  CheckPermissionWindow.hide();
  mainWindow.hide();

  if(Platform == 'darwin'){
    CheckPermissionWindow.show();
    CheckPermissionWindow.loadURL('file://' + distPath.views('/CheckPermission/index.html'))
    ipc.on('setPasswd', (ev, pass) => {
      KeyObserber.setPasswd(pass);
      KeyObserber.checkPasswd()
        .then(() => {
          console.log("suc");
          KeyObserber.keyListener(saveData, (err) => {
            dialog.showErrorBox('Error', 'Cause launch error.');
          });
          CheckPermissionWindow.hide();
        })
        .then(openMainWindow())
        .catch((e) => {
          console.log(e);
          dialog.showErrorBox('Incorrect', 'You need correct Password');
        });
    });
  }else if('windows'){
    openMainWindow();
  }
});
