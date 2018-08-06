module.exports = {
  weekly: {
    color : [
      'rgba(20,255,212,1)',
      'rgba(20, 155, 212, 1)',
      'rgba(255, 20, 181, 1)'
    ],
    textStyle: {
      color: 'rgba(255, 255, 255, 1)',
    },
    backgroundColor: 'rgba(34, 37, 43, 0)',
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
    },
    xAxis: {
      show: true,
      data: ["Sun.", "Mon.", "Tue.", "Wed.", "Thurs.", "Fri.", "Sat."],
    },
    yAxis: {
      show: true,
    },
    series: [
      {
        name: 'Ave',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20, 10],
      },
      {
        name: 'This',
        type: 'line',
        data: [10, 10, 72, 5, 20, 10, 5],
      },
      {
        name: 'Last',
        type: 'line',
        data: [30, 2, 50, 20, 10, 25, 25],
      },
    ],
  },
  daily: {
    color : [
      'rgba(20,255,212,1)',
      'rgba(20, 155, 212, 1)',
      'rgba(255, 20, 181, 1)'
    ],
    textStyle: {
      color: 'rgba(255, 255, 255, 1)',
    },
    backgroundColor: 'rgba(34, 37, 43, 0)',
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
    },
    xAxis: {
      show: true,
      data: ["Sun.", "Mon.", "Tue.", "Wed.", "Thurs.", "Fri.", "Sat."],
    },
    yAxis: {
      show: true,
    },
    series: [
      {
        name: 'Ave',
        type: 'line',
        data: [5, 20, 36, 10, 10, 20, 10],
      },
      {
        name: 'This',
        type: 'line',
        data: [10, 10, 72, 5, 20, 10, 5],
      },
      {
        name: 'Last',
        type: 'line',
        data: [30, 2, 50, 20, 10, 25, 25],
      },
    ],
  }
}
