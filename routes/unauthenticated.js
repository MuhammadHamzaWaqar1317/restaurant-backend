const express = require("express");
const router = express.Router();
const employee = require("../controllers/employee/employee");

router.route("/sign-up").post(employee.signUp);
router.route("/sign-in").post(employee.signIn);

module.exports = router;
