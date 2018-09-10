// const db = require('electron-db');

class UserModel {

    constructor(options) {
        for (let field in this.fields) {
            if (options.field) {
                this.fields.field=options.field;
            }
        }

        this.db = "users";
        this.fields={
            address     :   undefined,
            firstname   :   undefined,
            lastname    :   undefined,
            status      :   undefined,
            state       :   undefined,
        };
    }

    static find_one(address) {
        // db.getRows(UserModel.db,{address:address},(succ, result) => {
        //     // succ - boolean, tells if the call is successful
        //     return result[0];
        //     // console.log("Success: " + succ);
        //     // console.log(result);
        // });
    }

    static get_messages(id) {
        return [
            {
                text:"Hello world",
                data:"13:53"
            },
            {
                text:"Hello world!",
                data:"13:54"
            },
            {
                text:"Hello world!!",
                data:"13:55"
            },
        ];
    };


}

module.exports=UserModel;
