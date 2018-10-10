$('.settingsMenu li').click(function (e) {
    let type = $(this).attr('data-name');
    ipcRenderer.send('change_settings_menu', type);
});

$(function() {

    $('#optionsList > li > a').click(function (event) {
        $(this).parent().children("a").children("img").toggleClass('rotate')
        $(this).parent().children("ul").slideToggle();
        event.stopPropagation();
    });

})


// $(document).on('click', '.sendTokenButton', function (e) {
//     // let data_arr=$(this).closest('form');
//     // console.log(data_arr);
//     // return;
//     let data_arr = $(this).closest('tr').find('input').serializeArray();
//     let data = {};
//     data_arr.forEach((el) => {
//         data[el.name] = el.value;
//     });
//     // console.log(data_arr);
//     // console.log(data);
//     ipcRenderer.send('transfer_token', data);
// });
//
ipcRenderer.on("change_settings_menu", (event, obj) => {
    $('.settingsRight').html(obj);
    // $('#tokens_table').html('<div class="lds-roller"></div>');
});
