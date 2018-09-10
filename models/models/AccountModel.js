var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// let sql = require('sql.js');
// let fs = require('fs');
// const file_buffer = fs.readFileSync('../databases/account.sqlite');
// let db = new sql.Database(file_buffer);
var Model = require(__dirname + '/../Model');
var AccountModel = /** @class */ (function (_super) {
    __extends(AccountModel, _super);
    function AccountModel(data) {
        var _this = _super.call(this) || this;
        _this.table = "account";
        for (var row in _this.rows) {
            _this.rows_data[row] = data[row];
        }
        return _this;
    }
    return AccountModel;
}(Model));
module.exports = AccountModel;
