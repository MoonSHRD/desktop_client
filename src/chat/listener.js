'use strict'

const PeerId = require('peer-id')
const PeerInfo = require('peer-info')
const Node = require('./libp2p-bundle.js')
const pull = require('pull-stream')
const Pushable = require('pull-pushable')
const p = Pushable()
const input = document.getElementById('zxcvb')

const send1 = document.getElementById('send1')
const messageBlock = document.getElementById('messageBlock')
const connectedPeers = document.getElementById('connectedPeers')

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
            send1.hidden = true;

            throw err
        }
        send.hidden = true;
        nodeListener.on('peer:connect', (peerInfo) => {


            p.push("you connect to " + peerListener.id._idB58String)
            console.log(peerInfo.id.toB58String())
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
                        connectedPeers.innerText += data + "\n"

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

        send1.onclick = function () {
            p.push(input.value)
        };

        input.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode === 13) {
                p.push(input.value)
            }

            return false;
        }

    })
})
