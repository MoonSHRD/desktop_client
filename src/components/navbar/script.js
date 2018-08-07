window.onload = function () {
    var Pilot = require('pilotjs')

// ["http://site.com/airport/", "http://site.com/airport/depot/", ..]
    $('.menuBtn').click(function() {
        // var options = { to: { width: 200, direction: "right"} };
        $('.chats_block').toggleClass('resize1', 400);

        $('.icon-bar').toggleClass('resize', 400);

    })

    var container = document.querySelector("#switchContainer");

    function onOffSwitch(){
        if(container.classList.contains("switchOn")){
            container.classList.remove("switchOn");
            container.classList += " switchOff";
        }
        else{
            container.classList.remove("switchOff");
            container.classList += " switchOn";
        }
    }
    // container.addEventListener("click", onOffSwitch, false);




};