const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee/employee");
const menu = require("../controllers/admin/menu");

router.route("/sign-up").post(employee.signUp);
router.route("/sign-in").post(employee.signIn);
router.route("/menu").get(menu.getMenu);

module.exports = router;
