const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./sqlite/data.db');

abstract class Model {
    abstract table:string;
    abstract primary_key:string;
    abstract rows:any;
    abstract rows_data:object;
    readonly sqlite;

    protected constructor(data){
        // if (new.target === Model) {
        //     throw new TypeError("Cannot construct Abstract instances directly");
        // }
        this.sqlite=db;
        // console.log(this.rows);
        // this.rows.forEach((row)=>{
        //     this.rows_data[row]=data[row];
        // });
    }

    get_one(id,func){
        this.sqlite.run(`select * from ${this.table} where ${this.primary_key} = ${id}`,(row)=>{
            func(row)
        })
    }

    static create(data){
        console.log(this.rows);
        this.rows.forEach((row)=>{
            this.rows_data[row]=data[row];
        });
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
        // const table_columns = Object.keys(this.rows);
        // this.rows.forEach((table_column)=>{
        //     args.push(this.rows_data[table_column]);
        // });
        let query = `INSERT INTO ${this.table} VALUES (`;
        for (let i = 0; i < this.rows.length; i++) {
            args.push(this.rows_data[this.rows[i]]);
            query+=`?,`;
        }
        query=query.slice(0, -1)+")";
        console.log(query);
        this.sqlite.run(query, args);
    }
}

module.exports = Model;
