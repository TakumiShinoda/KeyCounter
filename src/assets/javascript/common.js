module.exports = {
  dateStr2Num: (str) => {
    let strArr = str.split('-');
    let year = strArr[0];
    let mon = strArr[1].length == 1 ? '0' + strArr[1] : strArr[1];
    let date = strArr[2].length == 1 ? '0' + strArr[2] : strArr[2];
    let result = parseInt(year + mon + date);

    return result;
  },
  getTodate: (splitter = ' ') => {
    let now = new Date();
    let result = now.getFullYear() + splitter + (now.getMonth() + 1) + splitter + now.getDate();

    return result;
  }
}
