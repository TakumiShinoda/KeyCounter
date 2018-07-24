$(document).ready(() => {
  console.log("ready");
  var webviewExm1 = $('#webviewExm1')[0];

  webviewSetJs(webviewExm1);
  // webviewExm1.openDevTools();
});

function webviewSetJs(ele){
  ele.addEventListener('dom-ready', () => {
    $.get(distPath.js('/index/webviewResources/'+ ele.id +'/domReady.js'), (text) => {
      ele.executeJavaScript(text, false, () => {});
    });
  });

  ele.addEventListener('did-finish-load', () => {
    $.get(distPath.js('/index/webviewResources/'+ ele.id +'/didFinishLoad.js'), (text) => {
      ele.executeJavaScript(text, false, () => {});
    });
  });
}
