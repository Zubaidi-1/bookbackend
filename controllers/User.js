const Users = require("../modals/users");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require("bcrypt");

let otpStorage = {}; // Temporary storage for OTPs
// secretKey
let secretKey = process.env.SECRET_KEY;
// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup Endpoint
exports.signup = async (req, res, next) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  console.log(req.body, "request");
  console.log("last", req.body.LastName);

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    otpStorage[email] = {
      email, // Store email explicitly
      password: hashedPassword,
      otp,
      createdAt: Date.now(),
      firstName: firstName,
      lastName: lastName,
    };

    console.log(otpStorage, "sss");

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };
    console.log(process.env.EMAIL_USER, "Sadsadsadsad");

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Error sending OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Verify OTP Endpoint
exports.otpVerify = async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(req.body, "orrp");

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }
  console.log(email);

  console.log("D", otpStorage[email]);

  const otpDetails = otpStorage[email];
  if (!otpDetails) {
    return res
      .status(400)
      .json({ error: "No OTP request found for this email" });
  }

  // Check OTP expiry (10 minutes)
  const isExpired = Date.now() - otpDetails.createdAt > 10 * 60 * 1000;
  if (isExpired) {
    localStorage.clear("token");
    delete otpStorage[email];
    return res.status(400).json({ error: "OTP has expired" });
  }
  console.log(otpDetails);

  if (otpDetails.otp === otp) {
    console.log("we here>");

    try {
      // Save the user to the database

      const user = new Users(
        null,
        otpDetails.email,
        otpDetails.password,
        null,
        otpDetails.firstName,
        otpDetails.lastName
      );
      console.log(user, "user");

      await user.signup();

      delete otpStorage[email]; // Clear OTP after successful verification
      res.status(201).json({ message: "User registered successfully" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  } else {
    res.status(400).json({ error: "Invalid OTP" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const token = await Users.login(email, password);
    console.log(token, "here is tok");

    res
      .status(201)
      .json({ message: "User logged in successfully", token: token });
  } catch (e) {
    res.status(401).json({
      message: "Login failed",
      error: e.message,
    });
  }
};

exports.forgotPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = new Users(null, email, null, null);
    const emailExists = await user.emailExists();
    console.log(emailExists);

    if (!emailExists) {
      return res.status(404).json({ message: "البريد الالكتروني غير موجود" });
    }
    const otp = generateOTP();
    otpStorage[email] = {
      email, // Store email explicitly
      otp,
      createdAt: Date.now(),
    };

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: "Error sending OTP" });
      }
      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (e) {
    throw new Error("Invalid Request: ", e.message);
  }
};

exports.confirmPasswordOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const otpDetails = otpStorage[email];
  if (!otpDetails) {
    return res
      .status(400)
      .json({ error: "No OTP request found for this email" });
  }

  // Check OTP expiry (10 minutes)
  const isExpired = Date.now() - otpDetails.createdAt > 10 * 60 * 1000;
  if (isExpired) {
    delete otpStorage[email];
    return res.status(400).json({ error: "OTP has expired" });
  }

  if (otpDetails.otp === otp) {
    return res
      .status(200)
      .json({ message: "OTP verified successfully", verfied: true });
  } else {
    return res.status(400).json({ error: " OTP failed", verfied: false });
  }
};

exports.changePasswords = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    console.log("fuck ", email);

    const changePassword = await Users.passwordChange(email, password);

    res.status(201).json({ message: "Password Changed successfully" });
  } catch (e) {
    throw new Error("An Error happened", e.message);
  }
};
