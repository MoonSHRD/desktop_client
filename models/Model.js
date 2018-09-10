var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./sqlite/data.db');
var Model = /** @class */ (function () {
    function Model(data) {
        // if (new.target === Model) {
        //     throw new TypeError("Cannot construct Abstract instances directly");
        // }
        this.sqlite = db;
        // console.log(this.rows);
        // this.rows.forEach((row)=>{
        //     this.rows_data[row]=data[row];
        // });
    }
    Model.prototype.get_one = function (id, func) {
        this.sqlite.run("select * from " + this.table + " where " + this.primary_key + " = " + id, function (row) {
            func(row);
        });
    };
    Model.create = function (data) {
        var _this = this;
        console.log(this.rows);
        this.rows.forEach(function (row) {
            _this.rows_data[row] = data[row];
        });
    };
    //
    // get_few(id){
    //     this._sqlite(this.table
    // }
    //
    // get_few_array(id){
    //     this._sqlite(this.table
    // }
    Model.prototype.save = function () {
        // let query = `INSERT INTO ${this.table} VALUES (`;
        // this._sqlite.run(query);
        var args = [];
        // const table_columns = Object.keys(this.rows);
        // this.rows.forEach((table_column)=>{
        //     args.push(this.rows_data[table_column]);
        // });
        var query = "INSERT INTO " + this.table + " VALUES (";
        for (var i = 0; i < this.rows.length; i++) {
            args.push(this.rows_data[this.rows[i]]);
            query += "?,";
        }
        query = query.slice(0, -1) + ")";
        console.log(query);
        this.sqlite.run(query, args);
    };
    return Model;
}());
module.exports = Model;
