const express = require("express");
const Products = require("../modals/products");

exports.addProduct = async (req, res, next) => {
  console.log("req.file", req.file);
  console.log("req.files", req.files);

  // Check if the request contains a single file or multiple files
  let images = [];
  if (req.file) {
    console.log(req.file, "req.file");
    images.push({ filename: req.file.filename, path: req.file.path });
  } else if (req.files) {
    console.log(req.files, "req.files");
    images = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));
  }

  console.log("req:", req.body);

  const { name, author, genre, language, price, phoneNumber, email } = req.body;
  try {
    const product = new Products(
      null,
      name,
      author,
      genre,
      price,
      language,
      phoneNumber,
      email,
      images
    );
    console.log("prod", product);

    const added = await product.addProduct();
    console.log(added);

    res.status(200).json({ message: "Product added successfully" });
  } catch (e) {
    throw new Error("couldn't process");
  }
};
exports.getProducts = async (req, res, next) => {
  const { email } = req.body;
  try {
    const listings = await Products.getProducts(email);
    console.log("listings", listings);

    res.status(200).json(listings);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Couldn't get products", error: e.message });
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.body;
  try {
    const deleted = await Products.deleteProduct(id);
    console.log("deleted", deleted);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (e) {
    res
      .status(400)
      .json({ message: "Couldn't delete product", error: e.message });
  }
};

exports.editProduct = async (req, res, next) => {
  let images = [];
  if (req.file) {
    console.log(req.file, "req.file");
    images.push({ filename: req.file.filename, path: req.file.path });
  } else if (req.files) {
    console.log(req.files, "req.files");
    images = req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
    }));
  }
  const { id, name, author, genre, language, price, phone } = req.body;
  console.log(req.body);

  console.log("id", id, name, author, genre, language, price, phone, images);

  try {
    const edited = await Products.editProduct(
      id,
      name,
      author,
      genre,
      language,
      price,
      phone,
      images
    );
    console.log("edited", edited);

    // Check the response from editProduct
    if (edited.success) {
      res.status(200).json({ message: edited.message });
    } else {
      res.status(400).json({ message: edited.message });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Internal server error", error: e.message });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Products.getAllProducts();
    res.status(200).json(products);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Couldn't get products", error: e.message });
  }
};

exports.getBooksByGenre = async (req, res, next) => {
  try {
    const { genre } = req.body;
    const products = await Products.getBooksByGenre(genre);
    res.status(200).json(products);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Couldn't get products", error: e.message });
  }
};

exports.searchBooks = async (req, res, next) => {
  try {
    const { userInput } = req.body;
    console.log(req.body);

    const search = await Products.searchBooks(userInput);
    console.log(search);

    res.status(200).json(search);
  } catch (e) {
    res
      .status(400)
      .json({ message: "Couldn't get products", error: e.message });
  }
};
