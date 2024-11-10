const express = require("express");
var router = express.Router();
const user = require("../controllers/employee/employee");

router.route("").get(user.getUserInfo);

router.route("/create-new-password").post(user.createNewPassword);

module.exports = router;
