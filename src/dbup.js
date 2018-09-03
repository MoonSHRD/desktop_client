const sqlite3 = require('sqlite3');
const fs = require('fs');
var dir = './sqlite';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
let db = new sqlite3.Database('./sqlite/data.db');
let qbox = require('qbox');

class Sqlite {

    constructor(){
        this.$ = qbox.create();

        this.tables_data = {
            account : {
                id:["primary key","on conflict ignore","not null"],
                privKey:[],
                passphrase:[],
                domain:["not null"],
                avatar:["not null"],
                name:[],
                firstname:["not null"],
                lastname:[],
                bio:[]
            },
            buddy : {
                id:["primary key","on conflict ignore","not null"],
                domain:["not null"],
                avatar:[],
                name:[],
                firstname:[],
                lastname:[],
                bio:[],
                online:["not null"],
            },
            msgs : {
                id:["integer","primary key","autoincrement"],
                chat:[],
                sender:[],
                text:[],
                time:[],
                is_group:[],
            },
            chat : {
                id:["primary key","on conflict ignore","not null"],
                domain:[],
                avatar:[],
                name:[],
                bio:[],
                type:[],
                role:[],
            },
            chat_users : {
                chat_id:[],
                buddy_id:[],
            },
        };

        this.tables = {
            account : "account",
            buddy : "buddy",
            msgs : "msgs",
            // buddy_msgs : "buddy_msgs",
            chat : "chat",
            chat_users : "chat_users",
        };

        let i = 0;
        const length = Object.keys(this.tables_data).length;

        for (let table in this.tables_data) {
            i++;
            let query = `CREATE TABLE if not exists ${table} (`;
            for (let column in this.tables_data[table]) {
                query+=`${column} `+this.tables_data[table][column].join(" ")+",";
            }
            query=query.slice(0, -1)+")";
            // console.log(query);
            if (i === length){
                // console.log('last');
                db.run(query,{}, ()=>{this.$.start();});
            } else {
                db.run(query);
            }
        }
    }

    insert(obj, table){
        this.$.ready( () => {
            let args = [];
            // console.log(table);
            const table_columns = Object.keys(this.tables_data[table]);
            table_columns.forEach(function (table_column) {
                args.push(obj[table_column]);
            });
            let query = `INSERT INTO ${table} VALUES (`;
            for (let i = 0; i < table_columns.length; i++) {
                query+=`?,`;
            }
            query=query.slice(0, -1)+")";
            db.run(query, args);
        });
    }

    fetch(func,table){
        this.$.ready(() => {
            db.each(`SELECT * FROM ${table}`, function (err, row) {
                func(row);
            });
        });
    }

    get_msgs_with(func,id){
        this.$.ready(() => {
            db.each(`SELECT * FROM msgs WHERE chat = ?`, [id] ,function (err, row) {
                func(row);
            });
        });
    }

    get_buddy(func,id){
        this.$.ready(() => {
            db.get(`SELECT * FROM buddy WHERE id = ?`, [id] ,function (err, row) {
                func(row);
            });
        });
    }

    get_chat(func,id){
        this.$.ready(() => {
            db.get(`SELECT * FROM chat WHERE id = ?`, [id] ,function (err, row) {
                func(row);
            });
        });
    }

    update(obj, table){
        this.$.ready(() => {
            const table_columns = Object.keys(this.tables_data[table]);
            if (table_columns[0]!=="id")return;
            let args = [];
            let query = `UPDATE ${table} SET `;
            // Object.keys(this.tables_data[table])
            delete table_columns[0];
            console.log(table_columns);
            table_columns.forEach(function (table_column) {
                if (obj[table_column]) {
                    query+=`${table_column} = ?,`;
                    args.push(obj[table_column]);
                }
            });
            query=query.slice(0, -1)+" WHERE id = ?";
            console.log(query);
            console.log(args);
            args.push(obj.id);
            db.run(query, args);
        });
    }
}

module.exports = new Sqlite();
