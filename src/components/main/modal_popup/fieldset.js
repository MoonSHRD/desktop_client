// window.jQuery = window.$ = require('jquery');
// var slick = require('slick-carousel');

//DOM Ready
$(function(){
    let current_fst, next_fst, previous_fst; //fieldsets
    let left, opacity, scale; //fieldset properties which we will animate


    let animatingGroup; //flag to prevent quick multi-click glitches

    $(".groupInfoNext").click(function(){
        console.log('sdfsdfdsf')
        // if (check_fields($(this).closest('fieldset'))) return;

        if(animatingGroup) return false;
        animatingGroup = true;

        current_fst = $(this).parent();
        next_fst = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        // $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fst.show();
        //hide the current fieldset with style
        current_fst.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                // left = (now * 50)+"%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fst.css({
                    'transform': 'scale('+scale+')',
                    'position': 'absolute',

                });
                next_fst.css({'left': 0, 'opacity': opacity});
            },
            duration: 800,
            complete: function(){
                current_fst.hide();
                animatingGroup = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $(".previousGroupInfo").click(function(){
        if(animatingGroup) return false;
        animatingGroup = true;
        console.log('sdfdsfsd')
        current_fst = $(this).parent();
        previous_fst = $(this).parent().prev();

        //de-activate current step on progressbar
        // $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fst.show();
        //hide the current fieldset with style
        current_fst.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1-now) * 50)+"%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fst.css({'left': 0});
                previous_fst.css({'transform': 'scale('+scale+')', 'opacity': opacity, 'position': 'absolute'});
            },
            duration: 800,
            complete: function(){
                current_fst.hide();
                animatingGroup = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });



    $('#finalizeOffer').click(function () {
        let amountForPublic = $('textarea[name=amountForPublic]').val()
        let topicOfPublic = $('textarea[name=topicOfPublic]').val()
        let textOfPublic = $('textarea[name=textOfPublic]').val()
        let textForAdmin = $('textarea[name=textForAdmin]').val()

        $('textarea[name=amountForPublicUnedit]').val(amountForPublic) ;
        $('textarea[name=topicOfPublicUnedit]').val(amountForPublic) ;
        $('textarea[name=textOfPublicUnedit]').val(amountForPublic) ;
        $('textarea[name=textForAdminUnedit]').val(amountForPublic) ;
        // console.log(amountForPublic, topicOfPublic, textOfPublic, textForAdmin)
    })

    $('input[name=pinInput]').bind('input', function (e) {
        console.log($(this).val());
        if ($(this).val() !== '1111') $(this).addClass('invalid');
        else $(this).removeClass('invalid');
    });

    $('#pinConfirm').click(function () {
        if(!$('input[name=pinInput]').hasClass('invalid')){
            if(animatingGroup) return false;
            animatingGroup = true;

            current_fst = $(this).parent();
            next_fst = $(this).parent().next();

            //activate next step on progressbar using the index of next_fs
            // $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fst.show();
            //hide the current fieldset with style
            current_fst.animate({opacity: 0}, {
                step: function(now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale current_fs down to 80%
                    scale = 1 - (1 - now) * 0.2;
                    //2. bring next_fs from the right(50%)
                    left = (now * 50)+"%";
                    //3. increase opacity of next_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fst.css({
                        'transform': 'scale('+scale+')',
                        'position': 'absolute',

                    });
                    next_fst.css({'left': 0, 'opacity': opacity});
                },
                duration: 800,
                complete: function(){
                    current_fst.hide();
                    animatingGroup = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
            console.log('all good!')
        }else{
            console.log('Incorrect PIN')

        }

    });


});

//
// // const {ipcRenderer} = require('electron');
// //jQuery time
// let current_fs, next_fs, previous_fs; //fieldsets
// let left, opacity, scale; //fieldset properties which we will animate
// let animatingGroup; //flag to prevent quick multi-click glitches
// let data = {}; //flag to prevent quick multi-click glitches
//
//
//
//

// $(document).on('submit', '#profile_form', function (e) {
//     e.preventDefault();
//     if ($('fieldset.active')!==$('fieldset').last()) $(".next").toggle('click');
//     let obj = $(this).serializeArray();
//     let prof = {};
//
//     obj.forEach(function (elem) {
//         prof[elem.name] = elem.value;
//     });
//     prof.avatar = $("#avatar_preview").attr("src");
//     console.log("Msg1", prof);
//     ipcRenderer.send('submit_profile', prof);
// });
//
// $(document).on('change', '[name=avatar]', function () {
//     const file = this.files[0];
//     let fileType = file.type;
//     if (file) {
//         let reader = new FileReader();
//         reader.onloadend = function () {
//             var image = new Image();
//             image.src = reader.result;
//             image.onload = function() {
//                 var maxWidth = 100,
//                     maxHeight = 100,
//                     imageWidth = image.width,
//                     imageHeight = image.height;
//
//                 if (imageWidth > imageHeight) {
//                     if (imageWidth > maxWidth) {
//                         imageHeight *= maxWidth / imageWidth;
//                         imageWidth = maxWidth;
//                     }
//                 }
//                 else {
//                     if (imageHeight > maxHeight) {
//                         imageWidth *= maxHeight / imageHeight;
//                         imageHeight = maxHeight;
//                     }
//                 }
//                 var canvas = document.createElement('canvas');
//                 canvas.width = imageWidth;
//                 canvas.height = imageHeight;
//
//                 var ctx = canvas.getContext("2d");
//                 ctx.drawImage(this, 0, 0, imageWidth, imageHeight);
//                 // The resized file ready for upload
//                 var finalFile = canvas.toDataURL(fileType);
//                 $('#avatar_preview').attr('src', finalFile);
//                 // console.log($("#avatar_preview").);
//                 $('#avatar_preview').show();
//             }
//         };
//         reader.readAsDataURL(file);
//     }
// });
//
//
//
// document.querySelector("html").classList.add('js');
//
// let fileInput  = document.querySelector( ".input-file" ),
//     button     = document.querySelector( ".input-file-trigger" );
// // the_return = document.querySelector(".file-return");
//
// button.addEventListener( "keydown", function( event ) {
//     if ( event.keyCode === 13 || event.keyCode === 32 ) {
//         fileInput.focus();
//     }
// });
// button.addEventListener( "click", function( event ) {
//     fileInput.focus();
//     return false;
// });
// // fileInput.addEventListener( "change", function( event ) {
// //     the_return.innerHTML = this.value;
// // });
//
// function check_fields(fieldset) {
//     let err = false;
//     const $this=$(fieldset);
//     // console.log($(fieldset).serializeArray());
//     // let els = $(fieldset).find('[required=required]');
//     let els = $this.serializeArray();
//     // console.log(els);
//     if (els.length===0) return err;
//     // else if (els.length===1) els=[els];
//
//
//     console.log(els);
//     els.forEach(function (elem) {
//         console.log(window['validate_'+elem.name]);
//         if (window['validate_'+elem.name]!==undefined){
//             const $element = $this.find(`[name=${elem.name}]`);
//             if (!window['validate_'+elem.name](elem.value)){
//                 $element.addClass('invalid');
//                 err = true;
//             } else {
//                 $element.removeClass('invalid');
//             }
//         }
//         data[elem.name] = elem.value;
//     });
//
//
//     // els.forEach(function (element) {
//     //     const $element=$(element);
//     //     const name=$element.attr('name');
//     //     const val=$element.val();
//     //
//     //     if (!window['validate_'+name](val)){
//     //         $element.addClass('invalid');
//     //         err = true;
//     //     } else {
//     //         $element.removeClass('invalid');
//     //     }
//     //     data[name]=val;
//     // });
//     return err;
// }
//
// function validate_firstname(val) {
//     return (val);
// }
//
// // function validate_mnemonic(mnem) {
// //     if (!mnem) return false;
// //     // console.log(mnem.match( /[а-я]/i )!==null);
// //     // string.search(/[А-яЁё]/) === -1
// //     if (mnem.search(/[А-яЁё]/) !== -1) return false;
// //     const words_count=mnem.split(/\s+/).length;
// //     const err=mnem.substr(-1,1)===" ";
// //     return (words_count === 12 && !err);
// // }
//
//

//
// $('textarea[name=mnemonic]').bind('input', function (e) {
//     // console.log($(this).val());
//     if (!validate_mnemonic($(this).val())) $(this).addClass('invalid');
//     else $(this).removeClass('invalid');
// });
//
// $(document).on('click', '#generate_mnemonic', function () {
//     ipcRenderer.send('generate_mnemonic');
// });
//
// ipcRenderer.on('generate_mnemonic', (event, arg) => {
//     const mnemonic = $('#input_mnemonic');
//     mnemonic.val(arg);
//     mnemonic.removeClass('invalid');
// });
//


// $(document).on('submit', '#profile_form', function (e) {
//     e.preventDefault();
//     const $this = $(this);
//     let obj = $(this).serializeArray();
//     let prof = {};
//     let err = {};
//
//     obj.forEach(function (elem) {
//         $this.find(`[name=${elem.name}]`).removeClass('invalid');
//         switch (elem.name) {
//             case "mnemonic":
//                 if (!validate_mnemonic(elem.value)) err[elem.name]=true;
//                 break;
//             case "firstname":
//                 if (!elem.value) err[elem.name]=true;
//                 break;
//         }
//         prof[elem.name] = elem.value;
//     });
//
//     if (Object.keys(err).length !== 0){
//         for (let el in err){
//             $this.find(`[name=${el}]`).addClass('invalid');
//         }
//         console.log(err);
//         return;
//     }
// //
//     const file = $(this).find('[name=avatar]').prop('files')[0];
//     if (file) {
//         let reader = new FileReader();
//         reader.onloadend = function () {
//             prof.avatar = reader.result;
//             ipcRenderer.send('submit_profile', prof);
//         };
//         reader.readAsDataURL(file);
//     } else {
//         ipcRenderer.send('submit_profile', prof);
//     }
// });
//
// $(document).on('change', '[name=avatar]', function () {
//     const file = this.files[0];
//     if (file) {
//         let reader = new FileReader();
//         reader.onloadend = function () {
//             // console.log(reader.result);
//             $('#avatar_preview').attr('src', reader.result);
//             $('#avatar_preview').show();
//         };
//         reader.readAsDataURL(file);
//     }
// });

// const {ipcRenderer} = require('electron');
//jQuery time
// let left, opacity, scale; //fieldset properties which we will animate
// let animating; //flag to prevent quick multi-click glitches
// let data = {}; //flag to prevent quick multi-click glitches
//
// $(".nextGroupInfo").click(function(){
//     if (check_fields($(this).closest('fieldset'))) return;
//
//     if(animating) return false;
//     animating = true;
//
//     current_fs = $(this).parent();
//     next_fs = $(this).parent().next();
//
//     //activate next step on progressbar using the index of next_fs
//     $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
//
//     //show the next fieldset
//     next_fs.show();
//     //hide the current fieldset with style
//     current_fs.animate({opacity: 0}, {
//         step: function(now, mx) {
//             //as the opacity of current_fs reduces to 0 - stored in "now"
//             //1. scale current_fs down to 80%
//             scale = 1 - (1 - now) * 0.2;
//             //2. bring next_fs from the right(50%)
//             left = (now * 50)+"%";
//             //3. increase opacity of next_fs to 1 as it moves in
//             opacity = 1 - now;
//             current_fs.css({
//                 'transform': 'scale('+scale+')',
//                 'position': 'absolute'
//             });
//             next_fs.css({'left': left, 'opacity': opacity});
//         },
//         duration: 800,
//         complete: function(){
//             current_fs.hide();
//             animating = false;
//         },
//         //this comes from the custom easing plugin
//         easing: 'easeInOutBack'
//     });
// });
//
// $(".previous").click(function(){
//     if(animating) return false;
//     animating = true;
//
//     current_fs = $(this).parent();
//     previous_fs = $(this).parent().prev();
//
//     //de-activate current step on progressbar
//     $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
//
//     //show the previous fieldset
//     previous_fs.show();
//     //hide the current fieldset with style
//     current_fs.animate({opacity: 0}, {
//         step: function(now, mx) {
//             //as the opacity of current_fs reduces to 0 - stored in "now"
//             //1. scale previous_fs from 80% to 100%
//             scale = 0.8 + (1 - now) * 0.2;
//             //2. take current_fs to the right(50%) - from 0%
//             left = ((1-now) * 50)+"%";
//             //3. increase opacity of previous_fs to 1 as it moves in
//             opacity = 1 - now;
//             current_fs.css({'left': left});
//             previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
//         },
//         duration: 800,
//         complete: function(){
//             current_fs.hide();
//             animating = false;
//         },
//         //this comes from the custom easing plugin
//         easing: 'easeInOutBack'
//     });
// });

// $(document).on('submit', '#profile_form', function (e) {
//     e.preventDefault();
//     if ($('fieldset.active')!==$('fieldset').last()) $(".next").toggle('click');
//     let obj = $(this).serializeArray();
//     let prof = {};
//
//     obj.forEach(function (elem) {
//         prof[elem.name] = elem.value;
//     });
//     prof.avatar = $("#avatar_preview").attr("src");
//     console.log("Msg1", prof);
//     ipcRenderer.send('submit_profile', prof);
// });
//
//
//
// document.querySelector("html").classList.add('js');
//
// let fileInput  = document.querySelector( ".input-file" ),
//     button     = document.querySelector( ".input-file-trigger" );
// // the_return = document.querySelector(".file-return");
//
// button.addEventListener( "keydown", function( event ) {
//     if ( event.keyCode === 13 || event.keyCode === 32 ) {
//         fileInput.focus();
//     }
// });
// button.addEventListener( "click", function( event ) {
//     fileInput.focus();
//     return false;
// });
// // fileInput.addEventListener( "change", function( event ) {
// //     the_return.innerHTML = this.value;
// // });
//
// function check_fields(fieldset) {
//     let err = false;
//     const $this=$(fieldset);
//     // console.log($(fieldset).serializeArray());
//     // let els = $(fieldset).find('[required=required]');
//     let els = $this.serializeArray();
//     // console.log(els);
//     if (els.length===0) return err;
//     // else if (els.length===1) els=[els];
//
//
//     console.log(els);
//     els.forEach(function (elem) {
//         console.log(window['validate_'+elem.name]);
//         if (window['validate_'+elem.name]!==undefined){
//             const $element = $this.find(`[name=${elem.name}]`);
//             if (!window['validate_'+elem.name](elem.value)){
//                 $element.addClass('invalid');
//                 err = true;
//             } else {
//                 $element.removeClass('invalid');
//             }
//         }
//         data[elem.name] = elem.value;
//     });
//
//     return err;
// }
//
//
// $('input[name=firstname]').bind('input', function (e) {
//     // console.log($(this).val());
//     if (!$(this).val()) $(this).addClass('invalid');
//     else $(this).removeClass('invalid');
// });
//
// $('textarea[name=mnemonic]').bind('input', function (e) {
//     // console.log($(this).val());
//     if (!validate_mnemonic($(this).val())) $(this).addClass('invalid');
//     else $(this).removeClass('invalid');
// });
//
//
//
// $('input[name=firstname]').bind('input', function (e) {
//     console.log($(this).val());
//     if (!$(this).val()) $(this).addClass('invalid');
//     else $(this).removeClass('invalid');
// });
//
// $('textarea[name=mnemonic]').bind('input', function (e) {
//     console.log($(this).val());
//     if (!validate_mnemonic($(this).val())) $(this).addClass('invalid');
//     else $(this).removeClass('invalid');
// });
//
// $(document).on('click', '#generate_mnemonic', function () {
//     ipcRenderer.send('generate_mnemonic');
// });
//
// ipcRenderer.on('generate_mnemonic', (event, arg) => {
//     const mnemonic = $('#input_mnemonic');
//     mnemonic.val(arg);
//     mnemonic.removeClass('invalid');
// });