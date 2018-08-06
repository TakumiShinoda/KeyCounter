const ChartOptions = require('./charts.js');
const Com = require('../common');
const Contents = require('./contentsController.js');

$(document).ready(() => {
  let WeeklyGraph = echarts.init(document.getElementById('weekly'));
  let DailyGraph = echarts.init(document.getElementById('daily'));

  let OverviewGraphs = {
    weekly: {
      graph: WeeklyGraph,
      option: ChartOptions.weekly,
    },
    daily: {
      graph: DailyGraph,
      option: ChartOptions.daily,
    }
  }

  $('.overviewGraph').click((e) => {
    let graphName = e.currentTarget.id;
    let targetGraph = OverviewGraphs[graphName];
    let keys = Object.keys(OverviewGraphs);

    for(var i = 0; i < keys.length; i++){
      if(keys[i] != graphName){
        $('#' + keys[i]).animate({
          opacity: 0,
        }, 500);
      }
    }

    $('#' + graphName).removeClass('col-6');
    $('#' + graphName).removeClass('col-9');

    setTimeout(() => {
      targetGraph.option.xAxis.show = false;
      targetGraph.option.yAxis.show = false;

      $('#' + graphName).animate({
        width: "600px",
        height: "320px"
      },
      {
        duration: "slow",
        easing: "swing",
        step: () => {
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
        },
        complete: () => {
          targetGraph.option.xAxis.show = true;
          targetGraph.option.yAxis.show = true;
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
        },
      });
    }, 1000);
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

  WeeklyGraph.setOption(ChartOptions.weekly);
  DailyGraph.setOption(ChartOptions.daily);
});
