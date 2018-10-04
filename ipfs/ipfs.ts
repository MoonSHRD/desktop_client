const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('localhost', '5001');

// ipfs.id((err, res) => {
//     if (err) throw err;
//     console.log({
//         id: res.id,
//         version: res.agentVersion,
//         protocol_version: res.protocolVersion
//     })
// });

// const obj = {
//     Data: new Buffer(JSON.stringify({text: "sobaka"})),
//     Links: []
// };

// ipfs.object.put(obj, (err, node) => {
//     if (err) {
//         throw err
//     }
//     // console.log(node.toJSON().multihash)
//     const multihash=node.toJSON().multihash;
//
//
//     ipfs.object.data(multihash, (err, data) => {
//         if (err) {
//             throw err
//         }
//         console.log(data.toString())
//     })
// });


import {ipfs_config} from "../src/env_config";

export class Ipfs {

    private static instance: Ipfs;
    private connection: any;

    public static getInstance() {
        if (!Ipfs.instance) {
            Ipfs.instance = new Ipfs();
        }
        return Ipfs.instance;
    }

    async connect() {
        this.connection=ipfsAPI(ipfs_config.host, ipfs_config.port);
    }

    async ipfs_info(){
        let info = await this.connection.id();
        console.log(info)
    }

    async add_file(file:object){
        const buffer = Buffer.from(JSON.stringify(file));
        let response = await this.connection.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) });
        console.log(response);
        let ipfsId = response[0].hash;
        console.log(ipfsId);
        return ipfsId;
    }

    async get_file(ipfsId){
        let response = await this.connection.get(ipfsId, { progress: (prog) => console.log(`received: ${prog}`) });
        console.log(response);
        console.log(response[0]);
        console.log(response[0].content);
        console.log(response[0].content.toString());
        return JSON.parse(response[0].content.toString());
        // let ipfsId = response[0].hash;
        // console.log(ipfsId);
        // return ipfsId;
    }
}
