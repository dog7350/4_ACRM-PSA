const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'accro',
    password: 'accro',
    database: 'accro',
    port: 3306
});

module.exports = pool;