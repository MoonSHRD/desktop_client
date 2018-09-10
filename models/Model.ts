const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./sqlite/data.db');

class Model {
    table;
    primary_key;
    rows;
    private rows_data;
    readonly sqlite;

    constructor(){
        if (new.target === Model) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.sqlite=db;
    }

    get_one(func,id){
        this.sqlite.run(`select * from ${this.table} where ${this.primary_key} = ${id}`,(row)=>{
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
        const table_columns = Object.keys(this.sqlite);
        table_columns.forEach((table_column)=>{
            args.push(this.sqlite[table_column]);
        });
        let query = `INSERT INTO ${this.table} VALUES (`;
        for (let i = 0; i < table_columns.length; i++) {
            query+=`?,`;
        }
        query=query.slice(0, -1)+")";
        this.sqlite.run(query, args);
    }
}
