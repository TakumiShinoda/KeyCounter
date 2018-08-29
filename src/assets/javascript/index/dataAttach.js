const Common = require('../common');

module.exports = {
  arrangeAllData: (data) => {
    return new Promise((res, rej) => {
      const allData = data.param;
      const now = new Date();
      const todate = now.getFullYear() + '-' +  (now.getMonth() + 1).toString() + '-' + now.getDate();
      let allDateData = [];
      let sortDateData = [];
      let arrangeDataArr = [];

      console.log(data.param)

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

      res(arrangeDataArr);
    })
  },
  arrangedData2Raw: (data) => {
    return new Promise((res, rej) => {
      let dataKeysMap = [];
      let todate = Common.getTodate('-');
      let firstDate = data[data.length - 1].key;
      let fullDataLength = Common.getDateDiff(todate, firstDate);
      let adjustData = new Array(fullDataLength);

      adjustData.fill({log: []});
      if(data[0].key != todate) data.unshift({key: todate, data: {log: []}});
      for(var i = 0; i < data.length; i++) dataKeysMap.push(data[i].key);
      for(var i = 0; i < fullDataLength; i++){
        let convertDateKey = todate.replace(/-/g, '/');
        let dateKeyObj = new Date(convertDateKey);
        let calcDateObj = new Date(dateKeyObj.getFullYear(), dateKeyObj.getMonth(), dateKeyObj.getDate() - i);
        let calcDateKeyStr = calcDateObj.getFullYear() + '-' + (calcDateObj.getMonth() + 1) + '-' + calcDateObj.getDate();
        let mapPos = dataKeysMap.indexOf(calcDateKeyStr);


        mapPos >= 0 ? adjustData[i] = data[mapPos].data : adjustData[i] = {log: []};
      }

      res(adjustData);
    });
  },
  getHoursTypes: (dayData) => {
    let hoursTypes = Array(24);

    hoursTypes.fill(0);
    for(var i = 0; i < dayData.length; i++){
      let hour = new Date(parseInt(dayData[i].epoch) * 1000).getHours();

      hoursTypes[hour] += 1;
    }

    return hoursTypes;
  },
  getWeekTypes: (data) => {
    let weekTypes = Array(data.length);

    weekTypes.fill(0);
    for(var i = 0; i < data.length; i++){
      weekTypes[i] = data[i].log.length;
    }

    return weekTypes;
  }
}
