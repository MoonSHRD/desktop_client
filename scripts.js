
const jquery = require("jquery")
const Messenger = require ('./src/core/messaging/index.js');
const chat_protocol = '/chat/1.0.0';
const main_node_channel = 'news';
const mainNodeId = 'QmYcuVrDn76jLz62zAQDmfttX9oSFH1cGXSH9rdisbHoGP';
const mainNodeIp = '192.168.1.12';
const mainNodeAddr = '/ip4/'+mainNodeIp+'/tcp/10333/ipfs/'+mainNodeId;

const config = {
    main_func: function (messenger) {
        messenger.handle(chat_protocol,(protocol, conn, push) => {
            console.log("start handling");
            messenger.read_msg((msg)=>{
                console.log("msg: " + msg);
                jquery('#messageBlock').append(msg + '\n')

                messenger.send_msg("received msg: " + msg,push);


            },conn,push);

            jquery('#send').click(function() {

                messenger.send_msg(jquery('#zxcvb').val(),push);
                jquery('#messageBlock').append('YOU: ' + jquery('#zxcvb').val() + '\n')

            })


        });

        messenger.pubsub(main_node_channel,(data) => {
            console.log(data);
            jquery('#connectedPeers').text('')
            for (var key in data.data) {
                jquery('#connectedPeers').append('<a >' + key + " online \n </a>")

            }
        });



        messenger.dial(mainNodeAddr,(conn)=>{});

        // messenger.dial_protocol(addr,protocol,(conn)=>{
        //     messenger.read_msg((msg)=>{
        //         console.log(msg);
        //     },conn);
        //     messenger.send_msg("I've been connected to you",conn);
        // });
    },
    privKey: {
        key: false,
        func (key) {
            //save key somewhere
        }
    }
};

let messenger = new Messenger('./id');
messenger.node_start(config);
console.log('App ready');