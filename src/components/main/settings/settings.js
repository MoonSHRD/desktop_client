(function(){

    let pinText = '';

    $(document).on('click', '.singlePin', function () {
        console.log(pinText);
        let input = $('input[name="change_pin"]');
        if(pinText.length !== 4) {
            pinText += $(this).children('p').text();
            input.val(pinText);
            input.change();
        }
    });

    $(document).on('change', 'input[name="change_pin"]', function () {
        if(pinText.length === 4) {
            if ($(this).val() === '1111') {
                console.log('Good password');
                $('#back').css('cssText', 'display: flex !important;');
                $('#front').css('cssText', 'display: none !important;');
            } else {
                console.log('Bad password');
                pinText = '';
                $(this).val('');
            }
        }
    });

})();
