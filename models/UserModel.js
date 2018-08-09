const db = require('electron-db');

class UserModel {

    self=this;

    static db="users";
    fields={
        address     :   undefined,
        firstname   :   undefined,
        lastname    :   undefined,
        status      :   undefined,
        state       :   undefined,
    };

    constructor(options) {
        for (let field in this.fields) {
            if (options.field) {
                this.fields.field=options.field;
            }
        }
    }

    static find_one(address) {
        db.getRows(UserModel.db,{address:address},(succ, result) => {
            // succ - boolean, tells if the call is successful
            return result[0];
            // console.log("Success: " + succ);
            // console.log(result);
        });
    }

    get_messages=(id)=>{
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

module.exports=UserModel;
