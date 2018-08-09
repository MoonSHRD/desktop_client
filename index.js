window.onload = function() {

    $('.menuBtn').click(function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.chats_block').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);

    });

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
        $('.chats ul').empty();

        arrObjects.map(function (value, index) {

            $('.chats ul').append("<li><a id=" +value.jid+ " href='#/user/" + value.jid + "' data-navigo><img src='./src/components/chatsblock/chats/img/mat_61911.jpg' width='40' height='40' /><span class='stateLabel'></span>" + value.name + "\n" + "<div class='label'></div></a></li>")

            $('.chats li a').click(function () {
                console.log($(this).attr('href'));
                $('.text').text($(this).attr('href'));
                router.navigate($(this).attr('href'))
            })
        })

    }

    setTimeout(add, 1000);
};
