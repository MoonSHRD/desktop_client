$('.walletMenu li').click(function (e) {
    let type=$(this).attr('data-name');
    ipcRenderer.send('change_wallet_menu', type);
});

ipcRenderer.on("change_wallet_menu", (event, obj) => {
    $('.walletRight').html(obj);
});

ipcRenderer.on("wallet_load_token", (event, obj) => {
    $('#tokens_table').append(obj);
});
