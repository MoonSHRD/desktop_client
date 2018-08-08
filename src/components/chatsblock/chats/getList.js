// // const {dxmpp} = require("moonshard_core");
// const $ = require('jquery')
//
// //
// // dxmpp.on('online',function (data) {
// //     console.log(data);
// //     console.log("mazafaka");
// // });
// //
// // dxmpp.on('buddy', function(jid, state, statusText) {
// //     console.log(`${jid} is ${state}` + ( statusText ? state : "" ));
// //     // arrObjects.map(function (value, index) {
// //         $('ul').append("<li><a href=''>" + value.jid + "\n" + value.state + "</a></li>")
// //     // })
// //     $('ul').append("<li><a href=''>"+ jid + "\n" + state +"</a></li>")
// // });
// //
// // dxmpp.on('subscribe', function(from) {
// //     console.log(from);
// //     dxmpp.acceptSubscription(from);
// //     dxmpp.send(from,"fuck you");
// // });
// //
// // dxmpp.on('chat', function(from, message) {
// //     console.log(`received msg: "${message}", from: "${from}"`);
// // });
// //
// // // dxmpp.subscribe("0xfa097d7c8808f96632b461e98d81e73eefbd7c59@localhost");
// //
// // // dxmpp.acceptSubscription("0x6c1567aee7f9d239bf1f7988bc009c00891c1571@localhost");
// // // dxmpp.subscribe("0x6c1567aee7f9d239bf1f7988bc009c00891c1571@localhost");
// //
// // // dxmpp.subscribe()
// //
// // // let addr="0x0fEaB3B11b087c9e6f1B861e265b78C693aA100b";
// // let addr="0x0feab3b11b087c9e6f1b861e265b78c693aa100b";
// // let priv="0xe8662f419b434b3e17854f26eb37878fdcfd34adfa0c6c7990fa8e546efd1951";
// //
// // let config={
// //     jidhost				: 'localhost',
// //     privKey				: priv,
// //     host				: 'localhost',
// //     port				: 5222,
// //     firstname		    : "Nikita",
// //     lastname		    : "Metelkin"
// // };
// //
// // dxmpp.connect(config);
// // dxmpp.get_contacts();
//
//
//
//
//

window.onload = function () {

    // const Pilot =require('pilotjs')

    $('.menuBtn').click(function () {
        // var options = { to: { width: 200, direction: "right"} };
        $('.chats_block').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);

    })

    // var container = document.querySelector("#switchContainer");

    //
    // function onOffSwitch() {
    //     if (container.classList.contains("switchOn")) {
    //         container.classList.remove("switchOn");
    //         container.classList += " switchOff";
    //     }
    //     else {
    //         container.classList.remove("switchOff");
    //         container.classList += " switchOn";
    //     }
    // }
    //
    // container.addEventListener("click", onOffSwitch, false);


};

function $id(id) {
    return document.getElementById(id);
}

// asyncrhonously fetch the html template partial from the file directory,
// then set its contents to the html of the parent element
function loadHTML(url, id) {
    req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onload = () => {
        $id(id).innerHTML = req.responseText;
    };
}

// use #! to hash
router = new Navigo(null, true, '#!');


// set the default route
router.on(() => {
    $id('view').innerHTML = loadHTML('./index.pug', 'view');
});

// set the 404 route
router.notFound((query) => {
    $id('messaging_block').innerHTML = '<h3>Couldn\'t find the page you\'re looking for...</h3>';
});

router.resolve();

function add() {
    var arrObjects = [];

    arrObjects[0] = {
        jid: "0x0feab3b11b087c9e6f1b861e265b78c693aa1045",
        state: Math.random() >= 0.5
    }
    arrObjects[1] = {
        jid: "0x1111b3b11b087c9e6f1b861e265b78c693aa1045",
        state: Math.random() >= 0.5
    }
    arrObjects[2] = {
        jid: "0x0feab3b11b087c9e6f1b861e265b3478c693aa1045",
        state: Math.random() >= 0.5
    }
    arrObjects[3] = {
        jid: "343434",
        state: Math.random() >= 0.5
    }

    $('ul').empty()

    arrObjects.map(function (value, index) {
       if(router._routes.length < arrObjects.length) {
           router.on('#/user/' + value.jid + '', function () {
               // console.log('/user/' + value.jid + '')
               loadHTML('./src/components/messagingblock/qqq.pug', 'messaging_history');
           })
       }

            // .resolve();
        $('ul').append("<li><a href='#/user/" + value.jid + "' data-navigo>" + value.jid + "\n" + value.state + "</a></li>")

    })
    $('.chats a').click(function () {
        console.log($(this).attr('href'))
        $('.text').text($(this).attr('href'))
        // console.log('#/user/' + value.jid + '')
        // console.log(router.link())
        router.navigate($(this).attr('href'))

    })

}




// getElementById wrapper



setTimeout(add, 1000);
//
