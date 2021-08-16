const mysql = require('mysql');
const dbConfig = require('../config/config');

var connection = mysql.createPool({
    host: dbConfig.DATABASE.HOST,
    user: dbConfig.DATABASE.USER,
    password: dbConfig.DATABASE.PASSWORD,
    database: dbConfig.DATABASE.NAME
});

module.exports = connection;