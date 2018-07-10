'use strict'

const PeerId = require('peer-id')
const jquery = require('jquery')
const PeerInfo = require('peer-info')
const Node = require('./libp2p-bundle.js')
const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const p = Pushable()
const input = document.getElementById('zxcvb')

const messageBlock = document.getElementById('messageBlock')
const connectedPeersL = document.getElementById('connectedPeersL')
const mainNodeId='QmYcuVrDn76jLz62zAQDmfttX9oSFH1cGXSH9rdisbHoGP';
const mainNodeIp='192.168.1.12';




PeerId.createFromJSON(require('./peer-id-listener'), (err, idListener) => {
    if (err) {
        throw err
    }
    const peerListener = new PeerInfo(idListener)
    peerListener.multiaddrs.add('/ip4/0.0.0.0/tcp/10333')
    const nodeListener = new Node({
        peerInfo: peerListener
    })



    nodeListener.start((err) => {
        if (err) {
            jquery('#send1').hide();

            throw err
        }
        send.hidden = true;


        nodeListener.on('peer:connect', (peerInfo) => {

            // connectedPeersL.innerText += peerInfo.id.toB58String() + " connect to you \n"
            p.push("you connect to " + peerListener.id._idB58String)
            // console.log(peerInfo.id.toB58String())
        })

        nodeListener.handle('/chat/1.0.0', (protocol, conn) => {


            pull(
                p,
                conn
            )

            pull(
                conn,
                pull.map((data) => {
                    if (data.toString('utf8').search(/peer/i) == 0) {
                        connectedPeersL.innerText += data + "\n"

                    } else {
                        messageBlock.innerText += data + "\n"
                        return data.toString('utf8').replace('\n', '')

                    }

                }),

                pull.drain(console.log)
            )

            process.stdin.setEncoding('utf8')
            process.openStdin().on('data', (chunk) => {
                var data = chunk.toString()
                p.push(data)


            })
        })

        console.log('Listener ready, listening on:')
        peerListener.multiaddrs.forEach((ma) => {

            console.log(ma.toString() + '/ipfs/' + idListener.toB58String())

        })

        jquery('#send1').click(function () {
            p.push(input.value)
        })

        input.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode === 13) {
                p.push(input.value)
            }

            return false;
        }
        nodeListener.pubsub.subscribe('news', (msg) => {
            console.log(msg.from, msg.data.toString());
            try {
                let data = JSON.parse(msg.data.toString());
                connectedPeersD.innerText = ""
                console.log(data);
                for (var key in data.data) {
                    connectedPeersD.innerText += key + " online \n"
                }
            } catch (e) {

            }
        }, () => {
        });

        nodeListener.dial('/ip4/' + mainNodeIp + '/tcp/10333/ipfs/' + mainNodeId, (err, conn) => {
            if (err) {
                throw err
            }
        });

    })
})
