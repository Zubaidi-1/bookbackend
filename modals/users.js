const db = require("../util/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
module.exports = class Users {
  constructor(id, email, password, confirmPassword, firstName, lastName) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }

  async emailExists() {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email= ?", [
        this.email,
      ]);
      return rows.length > 0;
    } catch (e) {
      throw new Error("Error has occured:", e.message);
    }
  }

  async signup() {
    try {
      if (await this.emailExists()) {
        throw new Error("Email already exists");
      }
      console.log("we are HERE!!!!", this.lastName, " kys");

      await db.execute(
        "INSERT INTO users (email,password, firstName, lastName) VALUES (?,?,?,?)",
        [this.email, this.password, this.firstName, this.lastName]
      );
      return { success: true, message: "User registered successfully" };
    } catch (e) {
      throw new Error("Signup failed: " + e.message);
    }
  }

  static async login(email, password) {
    try {
      const [rows] = await db.execute("SELECT * FROM users WHERE email= ?", [
        email,
      ]);
      if (rows.length === 0) {
        throw new Error("البريد الالكتروني غير موجود");
      }
      const user = rows[0];
      console.log("hi", user);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error("كلمة المرور غير صحيحة");
      }
      console.log("hi", user);

      const token = jwt.sign(
        {
          id: user.idusers,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        }, // Payload (user info)
        process.env.SECRET_KEY, // Secret key
        { expiresIn: "3h" } // Token expiration time
      );
      console.log("tok", token);

      return { token };
    } catch (e) {
      throw new Error(e.message);
    }
  }
  static async passwordChange(email, password) {
    console.log("i hate u ", email, password);

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword, " hasssh");

      const [rows] = await db.execute(
        "UPDATE users SET password = ? WHERE email = ? ",
        [hashedPassword, email]
      );
      console.log(rows, "fuck fuck");

      if (rows.length === 0) {
        throw new Error("البريد الالكتروني غير موجود");
      }

      return { message: "Password updated successfully" };
    } catch (e) {
      throw new Error("An error occured", e.message);
    }
  }
};
//
