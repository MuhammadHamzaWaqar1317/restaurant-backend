const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee/employee");
const menu = require("../controllers/admin/menu");
const menuCategory = require("../controllers/admin/menuCategory");

router.route("/sign-up").post(employee.signUp);
router.route("/sign-in").post(employee.signIn);
router.route("/menu").get(menu.getMenu);
router.route("/forget-password").post(employee.forgetPassword);
router.route("/verify-otp").post(employee.verifyOtp);
router.route("/menu-category").get(menuCategory.getMenuCategory);

module.exports = router;
