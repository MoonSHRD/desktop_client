const db = require('electron-db');

const tables = [
    "account",
    "users",
    "user_messages",
    "chats",
    "chat_users",
];

tables.forEach(function(table) {
    db.createTable(table, (succ, msg) => {
        console.log(`Table "${table}" creation success: ${succ}, with message: ${msg}`);
    });
});

