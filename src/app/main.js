const {app, BrowserWindow, dialog} = require('electron');
const {distPath} = require('../../dev/path');
const ipc = require('electron').ipcMain;
const KeyObserber = require('./module/KeyObserber');
const Storage = require('electron-json-storage');
const os = require('os');

const Platform = os.platform();
let CheckPermissionWindow;
let mainWindow;
let DataBuffer = [];
let DataBufferAlt = [];
let DataBufferFreq = 10;

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
      Storage.set(today, {log:[postData]}, (err) => {
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

function getStorageFromDay(day, pre, callback){
  let result = [];
  let weeklyEpoch = [];
  let promises = [];
  let now = new Date();
  let toDay = now.getDay();
  let getStorage = (targetDay) => {
    return new Promise((res, rej) => {
      Storage.get(targetDay, (err, data) => {
        if(!err){
          res(data);
        }else{
          res({});
        }
      })
    });
  }

  for(var i = 0; i < 7; i++){
    weeklyEpoch[i] = (day + (86400 * (-toDay + i))) * 1000
  }

  for(var i = 0; i < pre; i++){
    let targetDayStr = new Date(weeklyEpoch[i]).toLocaleString();
    let targetDay = targetDayStr.split(' ')[0].split('/').join('-');

    promises.push(getStorage(targetDay));
  }

  Promise.all(promises)
    .then((results) => {
      callback(results);
    })
    .catch((err) => {
      console.log(err);
    })
}

function mainProc(data){
  let post = data.toString();
  let params = post.split(' ');

  DataBuffer.push(data);
  if(DataBuffer.length > DataBufferFreq){
    DataBufferAlt =  DataBuffer;
    DataBuffer = [];
    for(var i = 0; i < DataBufferAlt.length; i++){
      console.log(DataBufferAlt[i]);
      saveData(DataBufferAlt[i]);
    }
  }

  getStorageFromDay(parseInt(params[0]), 7, (results) => {
    mainWindow.webContents.send('updateGraphs', results);
  });
}

ipc.on('setPasswd', (ev, pass) => {
  KeyObserber.setPasswd(pass);
  KeyObserber.checkPasswd()
    .then(() => {
      console.log("suc");
      KeyObserber.keyListener(mainProc, (err) => {
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

ipc.on('requireRecord', (ev, name, proc) => {
  let result;

  Storage.get('', (err, data) => {
    if(err) console.log(err);
    if(Object.keys(data) == 0){
      result = {};
    }else{
      result = data;
    }
    ev.sender.send(proc, result);
  });
});

app.on('ready', () => {
  CheckPermissionWindow = new BrowserWindow(CheckPermissionOption);
  mainWindow = new BrowserWindow(MainWindowOption);

  CheckPermissionWindow.hide();
  mainWindow.hide();

  if(Platform == 'darwin'){
    CheckPermissionWindow.show();
    CheckPermissionWindow.loadURL('file://' + distPath.views('/CheckPermission/index.html'))
  }else if('windows'){
    openMainWindow();
  }
});
