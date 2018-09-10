var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./sqlite/data.db');
var Model = /** @class */ (function () {
    function Model() {
        var _newTarget = this.constructor;
        if (_newTarget === Model) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.sqlite = db;
    }
    Model.prototype.get_one = function (func, id) {
        this.sqlite.run("select * from " + this.table + " where " + this.primary_key + " = " + id, function (row) {
            func(row);
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
        var _this = this;
        var args = [];
        var table_columns = Object.keys(this.sqlite);
        table_columns.forEach(function (table_column) {
            args.push(_this.sqlite[table_column]);
        });
        var query = "INSERT INTO " + this.table + " VALUES (";
        for (var i = 0; i < table_columns.length; i++) {
            query += "?,";
        }
        query = query.slice(0, -1) + ")";
        this.sqlite.run(query, args);
    };
    return Model;
}());
