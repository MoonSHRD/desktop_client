// let sql = require('sql.js');
// let fs = require('fs');
// const file_buffer = fs.readFileSync('../databases/account.sqlite');
// let db = new sql.Database(file_buffer);

class AccountModel {
    constructor(data){
        this.table="account";
        this.rows={
            id:undefined,
            privKey:undefined,
            privKeyLoom:undefined,
            passphrase:undefined,
            name:undefined,
            firstname:undefined,
            lastname:undefined,
            bio:undefined,
            avatar:undefined
        };
    }
}

module.exports=AccountModel;
