$(document).ready(() => {
  $("#accept").click(() => {
    ipc.send('setPasswd', $("#passwd").val());
    $("#passwd").val('');
  })
});
