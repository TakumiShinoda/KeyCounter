$(document).ready(() => {
  console.log("ready");

  $('.menu').click((e) => {
    var name = e.currentTarget.textContent;

    console.log(name);

    switch(name){
      case 'Overview':
        closeAllContent();
        openContent(name)
        break;
      case 'Statistics':
        closeAllContent();
        openContent(name);
        break;
      case 'Types':
        closeAllContent();
        openContent(name);
        break;
      default:
        console.log("hoge");
        break;
    }
  });

  var myChart = echarts.init(document.getElementById('test'));
  var option = {
    title: {
      text: 'ECharts entry example'
    },
    tooltip: {},
    legend: {
      data:[
        'Sales',
        'Tests'
      ]
    },
    xAxis: {
      data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    },
    yAxis: {},
    series: [
      {
        name: 'Sales',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      },
      {
          name: 'Tests',
          type: 'bar',
          data: [10, 10, 72, 5, 20, 10]
      }
    ]
  };

  myChart.setOption(option);
});

function closeAllContent(){
  $('.contents').css('display', 'none');
}

function openContent(n){
  var elements = $('.contents');

  $.each(elements, (i, v) => {
    if(v.attributes.name.nodeValue == n){
      v.style.display = 'block';
    }
  });
}
