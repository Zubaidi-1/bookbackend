const mysql = require("mysql2");
// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Wolfteam123",
  database: "books",
  waitForConnections: true,
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0, // Unlimited queueing
});
pool.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    conn.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise();
