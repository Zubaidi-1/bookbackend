const db = require("../util/db");

module.exports = class Products {
  constructor(
    id,
    name,
    author,
    genre,
    price,
    language,
    phoneNumber,
    email,
    image
  ) {
    this.id = id;
    this.name = name;
    this.author = author;
    this.genre = genre;
    this.price = price;
    this.language = language;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.image = image;
  }
  async addProduct() {
    try {
      await db.execute(
        "INSERT INTO products (idproducts,email,name,author,genre,language,price,phone,images ) VALUES (?,?,?,?,?,?,?,?, ?)",
        [
          this.id,
          this.email,
          this.name,
          this.author,
          this.genre,
          this.language,
          this.price,
          this.phoneNumber,
          this.image,
        ]
      );
      return { success: true, message: "Product added Successfully" };
    } catch (e) {
      return { success: false, message: "Could not add product" + e.message };
    }
  }
  static async getProducts(email) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM products WHERE email = ?",
        [email]
      );
      return { success: true, data: rows };
    } catch (e) {
      return { success: false, message: "Could not get products" + e.message };
    }
  }
  static async deleteProduct(id) {
    try {
      await db.execute("DELETE FROM products WHERE idproducts = ?", [id]);
      return { success: true, message: "Product deleted successfully" };
    } catch (e) {
      return {
        success: false,
        message: "Could not delete product" + e.message,
      };
    }
  }
  static async editProduct(
    id,
    name,
    author,
    genre,
    language,
    price,
    phone,
    image
  ) {
    try {
      console.log("id", id, name, author, genre, language, price, phone, image);

      await db.execute(
        "UPDATE products SET name = ?, author = ?, genre = ?, language = ?, price = ?, phone = ?, images = ? WHERE idproducts = ?",
        [name, author, genre, language, price, phone, , image, id]
      );
      return { success: true, message: "Product edited successfully" };
    } catch (e) {
      return {
        success: false,
        message: "Could not edit product" + "" + e.message,
      };
    }
  }

  static async getAllProducts() {
    try {
      const [rows] = await db.execute("SELECT * FROM products");
      if (rows.length === 0) {
        return {
          success: false,
          message: `No books found for genre: ${genre}`,
        };
      }
      return { success: true, data: rows };
    } catch (e) {
      return { success: false, message: "Could not get products" + e.message };
    }
  }
  static async getBooksByGenre(genre) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM products WHERE genre = ? ",
        [genre]
      );
      return { success: true, data: rows };
    } catch (e) {
      return { success: false, message: "Could not get products" + e.message };
    }
  }
  static async searchBooks(nameInput) {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM products WHERE name LIKE ? OR author LIKE ? OR genre LIKE ?",
        [nameInput, nameInput, nameInput]
      );
      return { success: true, data: rows };
    } catch (e) {
      return { success: false, message: "Could not get products" + e.message };
    }
  }
};
