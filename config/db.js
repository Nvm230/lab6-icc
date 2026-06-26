const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432, // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false // Required for connecting to AWS RDS
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL successfully');
  release();
});

// Initialize table if it doesn't exist
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      profile_image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log('Users table ensured in database.');
  } catch (err) {
    console.error('Error creating users table', err);
  }
};

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
