import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'manel',
  database: process.env.DB_NAME || 'trading',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;