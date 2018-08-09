const db = require('electron-db');

function UserModel() {
    this.get_messages=(id)=>{
        return [
            {
                text:"Hello world",
                data:"13:53"
            },
            {
                text:"Hello world",
                data:"13:53"
            },
            {
                text:"Hello world",
                data:"13:53"
            },
        ]
    }
}

module.exports=new UserModel();
