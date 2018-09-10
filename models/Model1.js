const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./sqlite/data.db');

class Model {
    table;
    primary_key;
    rows;
    _rows_data;

    constructor(){
        if (new.target === Model) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this._sqlite=db;
    }

    get_one(func,id){
        this._sqlite.run(`select * from ${this.table} where ${this.primary_key} = ${id}`,(row)=>{
            func(row)
        })
    }
    //
    // get_few(id){
    //     this._sqlite(this.table
    // }
    //
    // get_few_array(id){
    //     this._sqlite(this.table
    // }

    save(){
        // let query = `INSERT INTO ${this.table} VALUES (`;
        // this._sqlite.run(query);

        let args = [];
        const table_columns = Object.keys(this._rows_data);
        table_columns.forEach((table_column)=>{
            args.push(this._rows_data[table_column]);
        });
        let query = `INSERT INTO ${this.table} VALUES (`;
        for (let i = 0; i < table_columns.length; i++) {
            query+=`?,`;
        }
        query=query.slice(0, -1)+")";
        this._sqlite.run(query, args);
    }
}
