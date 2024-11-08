const express = require("express");
var router = express.Router();
const user = require("../controllers/employee/employee");

// router.route("/subscribe").post(employee.subscribe);
// router.route("/skip-meal").post(employee.skipMeal);
// router.route("/skip-meal-date").get(employee.getSkipMealDates);
// router.route("/delete-skip-meal-date").delete(employee.deleteSkipMealDates);
// router.route("/meal-complaint").post(employee.mealComplaint);

router.route("").get(user.getUserInfo);

router.route("/create-new-password").post(user.createNewPassword);

module.exports = router;
