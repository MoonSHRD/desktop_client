// let sql = require('sql.js');
// let fs = require('fs');
// const file_buffer = fs.readFileSync('../databases/account.sqlite');
// let db = new sql.Database(file_buffer);

class AccountModel {
    static exit_programm () {
        console.log('Goodbye!');
        // Insert callback to server - user out
        close();
    };

    static log_in () {
        if (check_user() === true) {

        }
        else {
            console.log("Sorry, we can't find you. Please register");
            this.registration();
        }
    };

    static registration () {

    };

    static get_contacts (id) {
        let stmt = db.prepare("SELECT * FROM contacts WHERE id=:id_val");
        stmt.bind([id]);
        let list_contacts = [];
        while (stmt.step()) list_contacts.push(stmt.get());
        return list_contacts // Will return array with arrays with values
    };

    static get_own_profile () {
        let res = db.exec("SELECT * FROM info");
        return res[0].values[0] // Will return array with values
    };

    static get_groups (id) {
        let list_group = [];
        list_group[0] = {
            id: '1',
            name: 'first simple group'
        };
        list_group[1] = {
            id: '2',
            name: 'second simple group'
        };
        list_group[2] = {
            id: '3',
            name: 'third simple group'
        };
        return list_group;
    };


}

module.exports=AccountModel;
