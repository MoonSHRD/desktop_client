$(document).on('submit', '#search_user_form', function (e) {
    e.preventDefault();
    let text_block = $('.searchInput');
    let text = text_block.val() + "@localhost";
    text_block.val('');
    ipcRenderer.send("send_subscribe", text);
});
