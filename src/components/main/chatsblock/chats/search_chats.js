$('.searchInput').bind('input', function (e) {
    let group = $(this).val();
    if (!group) {
        ipcRenderer.send('load_chats');
    } else {
        $('.chats ul').empty();
    }
    if (group.length > 2) {
        ipcRenderer.send('find_groups', group);
    }
    if (group.length === 0) {
        $('.chats ul').empty();
    }
});
