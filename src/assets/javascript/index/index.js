const ChartOptions = require('./charts.js');

$(document).ready(() => {
  var myChart = echarts.init(document.getElementById('test'));

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

  myChart.setOption(ChartOptions.weekly);
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
