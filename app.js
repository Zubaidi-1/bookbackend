const express = require("express");
const bodyParser = require("body-parser");
const db = require("./util/db.js");
const userRoutes = require("./routes/users.js");
const productsRoutes = require("./routes/products.js");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // Parse form data

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(userRoutes);
app.use(productsRoutes);
// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || 500; // Default to 500 for internal errors
  const message = error.message || "An unexpected error occurred";
  const data = error.data || null;
  res.status(status).json({ message, data });
});

app.listen(3001);
