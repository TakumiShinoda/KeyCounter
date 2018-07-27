$(document).ready(() => {
  console.log("ready");

  document.addEventListener("keydown", (e)=>{console.log(e)});

  $('.menu').click((e) => {
    var name = e.currentTarget.textContent;

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
