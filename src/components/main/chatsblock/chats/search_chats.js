$('.searchInput').bind('input', function (e) {
    let group = $(this).val();
    if (!group) {
        ipcRenderer.send('get_chats');
    } else {
        $('.chats ul').empty();
    }
    if (group.length > 2) {
        ipcRenderer.send('find_groups', group);
    }
});