const {app, BrowserWindow, dialog} = require('electron');
const {distPath} = require('../../dev/path');
const ipc = require('electron').ipcMain;
const KeyObserber = require('./module/KeyObserber');
const Storage = require('electron-json-storage');
const os = require('os');
const KeyLayouts = require('./module/keyLayouts.json');

const Platform = os.platform();
let CheckPermissionWindow;
let mainWindow;
let DataBuffer = [];
let DataBufferAlt = [];
let DataBufferFreq = 5;

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

function keyCode2keyChar(code){
  let res = '';

  if(Platform == 'darwin'){
    res =  KeyLayouts[code][1];
  }else if(Platform == 'win32'){
    res = KeyLayouts[code][0];
  }
  if(res == undefined || res == "") res = '<unknown>';
  return res;
}

function flushBuff(){
  DataBufferAlt =  DataBuffer;
  DataBuffer = [];
  for(var i = 0; i < DataBufferAlt.length; i++){
    let keyCode = DataBufferAlt[i].split(' ')[1]
    let keyChar = keyCode2keyChar(keyCode);

    console.log(keyChar);
    saveData(DataBufferAlt[i]);
  }
}

function mainProc(data){
  DataBuffer.push(data.toString());
  if(DataBuffer.length > DataBufferFreq) flushBuff();
}

ipc.on('getAllData', (ev) => {
  let dataList = [];
  let promiseList = [];

  const getData = (key) => {
    return new Promise((res) => {
      Storage.get(key, (err, data) => {
        if(data == undefined || data == {}) res();
        dataList.push({key: key, data: data});
        res();
      });
    })
  }

  const getAllKeys = () => {
    return new Promise((res, rej) => {
      Storage.keys((err, keys) => {
        if(err) rej('Failed to get All Keys');
        for(var i = 0; i < keys.length; i++){
          if(keys[i].indexOf('lock') >= 0){
            keys.splice(i, 1);
          }
        }
        res(keys);
      });
    });
  }

  const setPromise = (keys) => {
    return new Promise((res) => {
      for(var i = 0; i < keys.length; i++){
        promiseList.push(getData(keys[i]));
      }
      res();
    })
  }

  getAllKeys()
    .then((keys) => {
      return setPromise(keys);
    })
    .then(() => {
      return Promise.all(promiseList);
    })
    .then(() => {
      console.log('dataList:', dataList);
    })
    .catch((err) => {
      console.log(err);
    })

  // ev.sender.send();
});

ipc.on('flushBuff', (ev) => {
  flushBuff();
});

ipc.on('getStorageWeek', (ev, date) => {
  getStorageFromDay(date, 7, (results) => {
    mainWindow.webContents.send('updateGraphs', results);
  });
});

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
    .then(() => {
      return openMainWindow()
    })
    .catch((err) => {
      console.log(err.toString());
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
