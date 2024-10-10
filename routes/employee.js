const express = require("express");
var router = express.Router();
const employee = require("../controllers/employee/employee");

router.route("/subscribe").post(employee.subscribe);
router.route("/skip-meal").post(employee.skipMeal);
router.route("/skip-meal-date").get(employee.getSkipMealDates);
router.route("/delete-skip-meal-date").delete(employee.deleteSkipMealDates);
router.route("/meal-complaint").post(employee.mealComplaint);

module.exports = router;
