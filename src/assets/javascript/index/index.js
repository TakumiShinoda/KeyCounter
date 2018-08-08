const ChartOptions = require('./charts.js');
const Common = require('../common');
const Contents = require('./contentsController.js');

$(document).ready(() => {
  let WeeklyGraph = echarts.init(document.getElementById('weekly'));
  let DailyGraph = echarts.init(document.getElementById('daily'));
  let OverviewForcus = false;

  let OverviewGraphs = {
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

  $('.overviewGraph').click((e) => {
    let graphName = e.currentTarget.id;
    let targetGraph = OverviewGraphs[graphName];
    let keys = Object.keys(OverviewGraphs);

    if(OverviewForcus){
      targetGraph.option.xAxis.show = false;
      targetGraph.option.yAxis.show = false;

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
          targetGraph.option.yAxis.show = true;
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
          OverviewForcus = false;
        },
      });
    }else{
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
          targetGraph.graph.resize();
          targetGraph.graph.setOption(targetGraph.option);
          OverviewForcus = true;
        },
      });
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

  WeeklyGraph.setOption(ChartOptions.weekly);
  DailyGraph.setOption(ChartOptions.daily);
});
