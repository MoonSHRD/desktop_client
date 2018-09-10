// let sql = require('sql.js');
// let fs = require('fs');
// const file_buffer = fs.readFileSync('../databases/account.sqlite');
// let db = new sql.Database(file_buffer);
let Model=require(__dirname+'/../Model');

class AccountModel extends Model{
    table="account";
    primary_key="id";
    rows=[
        "privKey",
        "privKeyLoom",
        "passphrase",
        "name",
        "firstname",
        "lastname",
        "bio",
        "avatar"
    ];

    private constructor(){
        super();
        console.log(this.rows);
    }
}

module.exports=AccountModel;
