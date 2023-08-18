const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    return;
  }
  console.log('Connected to database!');
});

module.exports = pool;
