const {spawn} = require('child_process');
const kill  = require('tree-kill');
const os = require('os');

const Platform = os.platform();
let Passwd = "";

module.exports = {
  setPasswd: (passwd) => {
    Passwd = passwd;
  },
  getPasswd: () => {
    return Passwd;
  },
  checkPasswd: () =>{
    if(Platform != 'darwin'){
      return new Promise((res, rej) => {
        rej({code: -1, mes: "This method is only able to call on darwin."});
      });
    }
    return new Promise((res, rej) => {
      var exec = spawn('echo', [Passwd, '|', 'sudo', '-S', 'ls'], {shell: true});
      var forceReject = setTimeout(() => {
        rej({code: 0, mes: "Time out form terminal."});
        removeSpawnEvents();
      },3000);

      function removeSpawnEvents(){
        exec.stderr.removeAllListeners();
        exec.stdout.removeAllListeners();
      }

      exec.stderr.on('data', (data) => {
        let err = data.toString();

        if(err.indexOf("try again") >= 0 || err.indexOf("incorrect password") >= 0){
          rej({code: 1, mes: "Password is not correct."});
          clearTimeout(forceReject);
          removeSpawnEvents();
        }
      });

      exec.stdout.on('data', (data) => {
        res();
        clearTimeout(forceReject);
        removeSpawnEvents();
      });
    });
  },
  keyListener: (callback, errCallback) => {
    if(Platform == 'win32'){
      var exec = spawn(__dirname + '\\win\\keylogger.exe');

      exec.stderr.on('data', (data) => {
        errCallback(data);
      });

      exec.stdout.on('data', (data) => {
        data = data.toString();

        if(data.toString().slice(-1) == '\n'){
          callback(data.slice(0, -2));
        }else{
          callback(data);
        }
      });
    }else if(Platform == 'darwin'){
      var exec = spawn('echo', [Passwd, '|', 'sudo', '-S', __dirname + '/darwin/keyEvents'], {shell: true});

      exec.stderr.on('data', (data) => {
        if(data.toString().indexOf("Password:") == -1){
          errCallback(data);
        }
      });

      exec.stdout.on('data', (data) => {
        data = data.toString();

        if(data.slice(-1) == '\n'){
          callback(data.slice(0, -1));
        }else{
          callback(data);
        }
      });
    }else{
      errCallback({code: -1, mes: 'This Method is not available on OperatingSystem.'});
    }
  },
}
