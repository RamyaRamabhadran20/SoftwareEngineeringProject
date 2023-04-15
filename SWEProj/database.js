var mysql = require("mysql");

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'Catalog',
    user: 'root',
    password: 'SWEPRoj2023'
});

module.exports = connection;