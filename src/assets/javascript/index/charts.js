module.exports = {
  weekly: {
    color : [
      'rgba(20, 155, 212, 1)',
      'rgba(0, 51,255,1)',
      'rgba(255, 20, 181, 1)'
    ],
    textStyle: {
      color: 'rgba(255, 255, 255, 1)',
    },
    backgroundColor: 'rgba(51, 255, 51, 0.4)',
    title: {
      text: 'Weekly Types',
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      x: 'center',
    },
    tooltip: {},
    legend: {
      x: '90%',
      y: '25%',
      orient: 'vertical',
      data:[
        'Ave',
        'This',
        'Last'
      ],
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      show: false,
    },
    xAxis: {
      show: true,
      data: ["Sun.", "Mon.", "Tue.", "Wed.", "Thurs.", "Fri.", "Sat."],
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        name: 'Ave',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'This',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'Last',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  },
  daily: {
    color : [
      'rgba(20,255,212,1)',
      'rgba(0, 51,255,1)',
      'rgba(255, 20, 181, 1)'
    ],
    textStyle: {
      color: 'rgba(255, 255, 255, 1)',
    },
    backgroundColor: 'rgba(0, 255, 255, 0.4)',
    title: {
      text: 'Daily Types',
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      x: 'center',
    },
    tooltip: {},
    legend: {
      x: '90%',
      y: '25%',
      orient: 'vertical',
      data:[
        'Ave',
        'This',
        'Last'
      ],
      textStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      show: false,
    },
    xAxis: {
      show: true,
      data: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
    },
    yAxis: {
      show: false,
    },
    series: [
      {
        name: 'Ave',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'This',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  }
}
