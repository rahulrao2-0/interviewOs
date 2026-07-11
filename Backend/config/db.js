import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // --- Prevents idle connections from being silently dropped ---
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10s

  // --- Avoid hanging forever on a dead connection ---
  connectTimeout: 10000,
});

// Log pool-level errors instead of letting them crash silently
db.on("error", (err) => {
  console.error("MySQL Pool Error:", err.code, err.message);
});

// Test connection on startup
try {
  const connection = await db.getConnection();
  console.log("MySQL Pool Connected ✅");
  connection.release();
} catch (err) {
  console.error("Database Connection Failed ❌");
  console.error(err.message);
}

export default db;