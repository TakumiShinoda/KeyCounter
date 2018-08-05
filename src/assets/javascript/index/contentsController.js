module.exports = {
  openContent: (n) => {
    var elements = $('.contents');

    $.each(elements, (i, v) => {
      if(v.attributes.name.nodeValue == n){
        v.style.display = 'block';
      }
    });
  },
  closeAllContent: () => {
    $('.contents').css('display', 'none');
  },
  setBackgroundColor: (sep) => {
    try{
      $.each($(sep), (i, v) => {
        v.style.backgroundColor = '';
      });
    }catch(e){

    }
  },
}
