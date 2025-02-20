const express = require("express");
const usersController = require("../controllers/User");
const productsController = require("../controllers/products");
const router = express.Router();
router.post("/signup", usersController.signup);
router.post("/verifyOtp", usersController.otpVerify);
router.post("/login", usersController.login);
router.post("/forgotPassword", usersController.forgotPasswordOtp);
router.post("/passwordOTP", usersController.confirmPasswordOTP);
router.post("/confirmPassword", usersController.changePasswords);

module.exports = router;
