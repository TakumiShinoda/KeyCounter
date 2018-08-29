const ChartOptions = require('./charts.js');
const Common = require('../common');
const Contents = require('./contentsController.js');
const DataAttach = require('./dataAttach');

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

function updateOverviewGraphs(hoursTypes, weekTypes){
  ChartOptions.daily.series[1].data = hoursTypes;
  ChartOptions.weekly.series[1].data = weekTypes;
  OverviewGraphs.daily.graph.setOption(ChartOptions.daily);
  OverviewGraphs.weekly.graph.setOption(ChartOptions.weekly);
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
    .then((resp) => DataAttach.arrangeAllData(resp))
    .then((data) => DataAttach.arrangedData2Raw(data))
    .then((data) => {
      let dataAlt = data;
      let today = (new Date).getDay();
      let hoursTypes;
      let weekTypes;
      let dayData = data[0].log;
      let weekData = dataAlt.slice(0, 4).reverse();

      hoursTypes = DataAttach.getHoursTypes(dayData);
      weekTypes = DataAttach.getWeekTypes(weekData);
      updateOverviewGraphs(hoursTypes, weekTypes);
    })
    .catch((err) => {
      alert(err);
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
    // ChartOptions.daily.series[1].data = dailyTodayArray;
    // ChartOptions.weekly.series[1].data = weeklyThisArray;
    // OverviewGraphs.weekly.graph.setOption(ChartOptions.weekly);
    // OverviewGraphs.daily.graph.setOption(ChartOptions.daily);
  });
}
