const ChartOptions = require('./charts.js');
const Common = require('../common');
const Contents = require('./contentsController.js');

let WeeklyGraph;
let DailyGraph;
let OverviewForcus;
let OverviewGraphs;

function updateGraphs(){
  let date = new Date();
  let time = date.getTime();

  ipc.send('flushBuff');
  ipc.send('getStorageWeek', Math.floor(time / 1000));
}

$(document).ready(() => {
  WeeklyGraph = echarts.init(document.getElementById('weekly'));
  DailyGraph = echarts.init(document.getElementById('daily'));
  OverviewForcus = false;
  OverviewGraphs = {
    weekly: {
      graph: WeeklyGraph,
      option: ChartOptions.weekly,
      onFocus: {
        size: {
          width: '600px',
          height: '320px',
        },
        pos: {
          top: '0px',
          left: '0px',
        }
      },
      defaults: {
        size: {
          width: '48%',
          height: '50%',
        },
        pos: {
          top: '0px',
          left: '50%',
        }
      },
    },
    daily: {
      graph: DailyGraph,
      option: ChartOptions.daily,
      onFocus: {
        size: {
          width: '600px',
          height: '320px',
        },
        pos: {
          top: '0px',
          left: '0px',
        }
      },
      defaults: {
        size: {
          width: '48%',
          height: '50%',
        },
        pos: {
          top: '0px',
          left: '0px',
        }
      },
    }
  }

  ipcSendPromised('getAllData')
    .then((resp) => { // sort all-data by date
      const allData = resp.param;
      const now = new Date();
      const todate = now.getFullYear() + '-' +  (now.getMonth() + 1).toString() + '-' + now.getDate();
      let allDateData = [];
      let sortDateData = [];
      let arrangeDataArr = [];

      for(var i = 0; i < allData.length; i++){
        allDateData.push(Common.dateStr2Num(allData[i].key));
      }
      sortDateData = allDateData.sort().reverse();
      for(var i = 0; i < sortDateData.length; i++){
        for(var j = 0; j < allData.length; j++){
          if(Common.dateStr2Num(allData[j].key) == sortDateData[i]){
            arrangeDataArr.push(allData[j]);
            break;
          }
        }
      }
      return arrangeDataArr;
    })
    .then((data) => { // get low data from arranged all-data (if no data of one day, it is empty)
      console.log(data);

      let adjustData = [];
      let dataKeysMap = [];
      let todate = Common.getTodate('-');

      if(data[0].key != todate) data.unshift({key: todate, data: {log: []}});
      for(var i = 0; i < data.length; i++) dataKeysMap.push(data[i].key);
      for(var i = 0; i < data.length; i++){
        let convertDateKey = todate.replace(/-/g, '/');
        let dateKeyObj = new Date(convertDateKey);
        let calcDateObj = new Date(dateKeyObj.getFullYear(), dateKeyObj.getMonth(), dateKeyObj.getDate() - i);
        let calcDateKeyStr = calcDateObj.getFullYear() + '-' + (calcDateObj.getMonth() + 1) + '-' + calcDateObj.getDate();
        let mapPos = dataKeysMap.indexOf(calcDateKeyStr);

        mapPos >= 0 ? adjustData[i] = data[i].data : adjustData[i] = {log: []};
      }
      return adjustData;
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  setDomEvents();
  setIpcEvents();
  updateGraphs();

  WeeklyGraph.setOption(ChartOptions.weekly);
  DailyGraph.setOption(ChartOptions.daily);

  setInterval(() => {updateGraphs()}, 5000);
});

function ipcSendPromised(key, param = {}, timeout = 3000){
  return new Promise((res, rej) => {
    let timer = setTimeout(() => {
      rej('Timeout');
    }, timeout);

    ipc.on(key + '_recv', (ev, param) => {
      clearTimeout(timer);
      ipc.removeListener(key + '_recv', () => {

      });
      res({event: ev, param: param});
    });
    ipc.send(key, param);
  })
}

function setDomEvents(){
  $('.overviewGraph').click((e) => {
    let graphName = e.currentTarget.id;
    let targetGraph = OverviewGraphs[graphName];
    let keys = Object.keys(OverviewGraphs);

    function fadeOut(){
      targetGraph.option.xAxis.show = false;
      targetGraph.option.yAxis.show = false;
      targetGraph.option.legend.show = false;

      $('#' + graphName).animate(targetGraph.defaults.size, {
        duration: "slow",
        easing: "swing",
        step: () => {
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
        },
        complete: () => {
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);

          $('#' + graphName).animate(targetGraph.defaults.pos, 500);

          for(var i = 0; i < keys.length; i++){
            if(keys[i] != graphName){
              $('#' + keys[i]).fadeIn("slow");
            }
          }
          targetGraph.option.xAxis.show = true;
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
          OverviewForcus = false;
        },
      });
    }

    function fadeIn(){
      for(var i = 0; i < keys.length; i++){
        if(keys[i] != graphName){
          $('#' + keys[i]).fadeOut("slow");
        }
      }

      $('#' + graphName).animate(targetGraph.onFocus.pos, 500);

      targetGraph.option.xAxis.show = false;
      targetGraph.option.yAxis.show = false;

      $('#' + graphName).animate(targetGraph.onFocus.size,{
        duration: "slow",
        easing: "swing",
        step: () => {
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
        },
        complete: () => {
          targetGraph.option.xAxis.show = true;
          targetGraph.option.yAxis.show = true;
          targetGraph.option.legend.show = true;
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
          OverviewForcus = true;
        },
      });
    }

    if(OverviewForcus){
      fadeOut();
    }else{
      fadeIn();
    }
  });

  $('#menues li').click((e) => {
    var name = e.target.outerText.trim();

    Contents.setBackgroundColor('#menues li');
    e.currentTarget.style.backgroundColor = 'rgb(0, 191, 255)';

    switch(name){
      case 'Overview':
        Contents.closeAllContent();
        Contents.openContent(name);
        break;
      case 'Statistics':
        Contents.closeAllContent();
        Contents.openContent(name);
        break;
      case 'Types':
        Contents.closeAllContent();
        Contents.openContent(name);
        break;
      default:
        console.log("hoge");
        break;
    }
  });
}

function setIpcEvents(){
  ipc.on('updateGraphs', (ev, data) => {
    let weeklyAveArray = [];
    let weeklyThisArray = [];
    let weeklyLastArray = [];

    let dailyTodayArray = Array(24);
    let dailyAveArray = [];

    dailyTodayArray.fill(0);

    let now = new Date();
    let toDay = now.getDay();

    function getThisWeekData(){
      for(var i = 0; i < 7; i++){
        if(Object.keys(data[i]) == 0){
          weeklyThisArray[i] = 0;
        }else{
          weeklyThisArray[i] = data[i].log.length;
        }
      }
    }

    function getDailyData(){
      let dayData = data[toDay].log;

      for(var i = 0; i < dayData.length; i++){
        let hour = new Date(parseInt(dayData[i].epoch) * 1000).getHours();

        dailyTodayArray[hour] += 1;
      }
    }

    getThisWeekData();
    getDailyData();
    ChartOptions.daily.series[1].data = dailyTodayArray;
    ChartOptions.weekly.series[1].data = weeklyThisArray;
    OverviewGraphs.weekly.graph.setOption(ChartOptions.weekly);
    OverviewGraphs.daily.graph.setOption(ChartOptions.daily);
  });
}
