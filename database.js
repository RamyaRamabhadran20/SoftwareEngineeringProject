var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'books',
    user: 'root',
    password: '12345'
});

module.exports = connection;