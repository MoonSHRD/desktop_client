$('.walletMenu li').click(function (e) {
    // console.log('change wallet menu wallet');
    let type = $(this).attr('data-name');
    ipcRenderer.send('change_wallet_menu', type);
});

$(document).off('input', 'input[name=amount]');

$(document).on('input', 'input[name=amount]', function (e) {
    const $this = $(this);
    $this.css('box-shadow', 'none');
    if($this.val() != '') {
        var regexp = /^[0-9\.]*$/;
        if (!regexp.test($this.val())) {
            e.preventDefault();
            $this.css('box-shadow', '0px 0px 16px 0px rgba(255, 59, 0, 0.6) inset');
            // alert("введите латинские символы");
            return false;
        }
    }
});

ipcRenderer.on('change_wallet_menu', (event, obj) => {
    $('.walletRight').html(obj);
});
