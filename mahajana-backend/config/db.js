const mysql = require("mysql2/promise");

// Using a pool instead of a single connection so multiple requests
// (e.g. an order being placed while the admin dashboard is loading)
// don't block each other.
const pool = mysql.createPool({
  
  host: "localhost",
  user: "root",
  password: "",
  database: "mahajana_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Quick connection check on startup (optional but useful for the demo)
pool.getConnection()
  .then((conn) => {
    console.log("MySQL Connected");
    conn.release();
  })
  .catch((err) => {
    console.log("Database Connection Failed:", err.message);
  });

module.exports = pool;
