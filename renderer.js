// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
 window.onload = function() {



    $('.menuBtn').click(function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.chats_block').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);

    })

    var container = document.querySelector("#switchContainer");

    function onOffSwitch() {
        if (container.classList.contains("switchOn")) {
            container.classList.remove("switchOn");
            container.classList += " switchOff";
        }
        else {
            container.classList.remove("switchOff");
            container.classList += " switchOn";
        }
    }

    // container.addEventListener("click", onOffSwitch, false);



    function $id(id) {
        return document.getElementById(id);
    }

    // asyncrhonously fetch the html template partial from the file directory,
    // then set its contents to the html of the parent element

    // use #! to hash


    function add() {
        var arrObjects = [];

        arrObjects[0] = {
            name: "Nikita Vonk",
            jid: "0x0feab3b11b087c9e6f1b861e265b78c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[1] = {
            name: "Sdfucker Wertuhan",
            jid: "0x1111b3b11b087c9e6f1b861e265b78c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[2] = {
            name: "Alex Dichovsky",
            jid: "0x0feab3b11b087c9e6f1b861e265b3478c693aa1045",
            state: Math.random() >= 0.5
        }
        arrObjects[3] = {
            name: "Glamurny Podonok",
            jid: "343434",
            state: Math.random() >= 0.5
        }
        // console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
        $('ul').empty()

        arrObjects.map(function (value, index) {
            // if(router._routes.length < arrObjects.length) {
            //     router.on('#/user/' + value.jid + '', function () {
            //         // console.log('/user/' + value.jid + '')
            //         loadHTML('./src/components/messagingblock/qqq.pug', 'messaging_history');
            //     })
            // }

            // .resolve();

            $('ul').append("<li><a id=" +value.jid+ " href='#/user/" + value.jid + "' data-navigo><img src='./src/components/chatsblock/chats/img/mat_61911.jpg' width='40' height='40' /><span class='stateLabel'></span>" + value.name + "\n" + "<div class='label'></div></a></li>")
            if(!value.state) {
                $('#' + value.jid ).find('.stateLabel').hide()
            }
            $('.chats li a').click(function () {
                console.log($(this).attr('href'))
                $('.text').text($(this).attr('href'))
                // console.log('#/user/' + value.jid + '')
                // console.log(router.link())
                // router.navigate($(this).attr('href'))
                // alert('dsfdsf')

            })
        })

    }


    // getElementById wrapper



    setInterval(add, 1000);

}
