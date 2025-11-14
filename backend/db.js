const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "uma_user",
  password: process.env.DB_PASSWORD || "uma_password",
  database: process.env.DB_NAME || "uma_db",
});

module.exports = pool;
