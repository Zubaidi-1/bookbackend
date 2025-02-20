const express = require("express");
const multer = require("multer");

const productsController = require("../controllers/products");

const router = express.Router();

// Multer Setup for Multiple File Uploads
const upload = multer({ dest: "uploads/" }); // Ensure "uploads/" exists

router.post("/sell", upload.array("images", 5), productsController.addProduct); // Max 5 files
router.post("/getProducts", productsController.getProducts);
router.post("/deleteProduct", productsController.deleteProduct);
router.post(
  "/editProduct",
  upload.array("images", 5),
  productsController.editProduct
);
router.get("/getProducts", productsController.getAllProducts);
router.post("/getProductsbyGenre", productsController.getBooksByGenre);
router.post("/search", productsController.searchBooks);

module.exports = router;
