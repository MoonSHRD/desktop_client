$(document).on('submit', '#search_user_form', function (e) {
    e.preventDefault();
    console.log("fwafaw");
    let text = $('.searchInput').val() + "@localhost";
    ipcRenderer.send("send_subscribe", text);
});
