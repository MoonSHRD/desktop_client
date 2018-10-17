$('.walletMenu li').click(function (e) {
    // console.log('change wallet menu wallet');
    let type = $(this).attr('data-name');
    ipcRenderer.send('change_wallet_menu', type);
});

$(document).on('click', '.sendTokenButton', function (e) {
    // let data_arr=$(this).closest('form');
    // console.log(data_arr);
    // return;
    let data_arr = $(this).closest('tr').find('input').serializeArray();
    let data = {};
    data_arr.forEach((el) => {
        data[el.name] = el.value;
    });
    // console.log(data_arr);
    // console.log(data);
    ipcRenderer.send('transfer_token', data);
});

ipcRenderer.on("change_wallet_menu", (event, obj) => {
    $('.walletRight').html(obj);
    // $('#tokens_table').html('<div class="lds-roller"></div>');
});
