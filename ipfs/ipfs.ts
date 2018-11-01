import {ipfs_config} from "../src/env_config";

const ipfsAPI = require('ipfs-api');

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
        this.connection=ipfsAPI(ipfs_config.host, ipfs_config.port, {protocol: 'https'});
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
               return JSON.parse(response[0].content.toString());
    }
}
