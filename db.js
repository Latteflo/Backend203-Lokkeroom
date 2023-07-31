const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'florentina',
  password: '8955',
  database: 'lokkeroom_db',
  port: 3306
});

// Optional error handling for the connection
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to database');
});

module.exports = connection;
