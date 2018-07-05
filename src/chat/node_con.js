'use strict'

const libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const PeerInfo = require('peer-info')
const Bootstrap = require('libp2p-railing')
const waterfall = require('async/waterfall')
const defaultsDeep = require('@nodeutils/defaults-deep')

// Find this list at: https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/config-nodejs.json
const bootstrapers = [
  '/ip4/192.168.1.12/tcp/4002/ipfs/QmStKKQGFzdpvrRCXzZig7xi8BMsN9f9MUSHDy5RKxDgyv'
]

class MyBundle extends libp2p {
  constructor (_options) {
    const defaults = {
      modules: {
        transport: [ TCP ],
        streamMuxer: [ Mplex ],
        connEncryption: [ SECIO ],
        peerDiscovery: [ Bootstrap ]
      },
      config: {
        peerDiscovery: {
          bootstrap: {
            interval: 2000,
            enabled: true,
            list: bootstrapers
          }
        }
      }
    }

    super(defaultsDeep(_options, defaults))
  }
}

let node

waterfall([
  (cb) => PeerInfo.create(cb),
  (peerInfo, cb) => {
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
    node = new MyBundle({
      peerInfo
    })
    node.start(cb)
  }
], (err) => {
  if (err) { throw err }

  node.on('peer:discovery', (peer) => {
    console.log('Discovered:', peer.id.toB58String())
    node.dial(peer, () => {})
  })

  node.on('peer:connect', (peer) => {
    console.log('Connection established to:', peer.id.toB58String())
  })
})
