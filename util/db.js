const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "mysql://root:QFbwFDxHRzTjInwUAEhiGhCHVxtmlsjU@switchback.proxy.rlwy.net:45727/railway", // Updated host
  user: "root",
  password: "QFbwFDxHRzTjInwUAEhiGhCHVxtmlsjU", // Your Railway password
  database: "railway", // Confirm if still correct
  port: 3306, // Default MySQL port
  waitForConnections: true,
  connectionLimit: 10, // Max number of connections in the pool
  queueLimit: 0, // Unlimited queueing
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to Railway MySQL database");
    conn.release(); // Release the connection back to the pool
  }
});

module.exports = pool.promise();
