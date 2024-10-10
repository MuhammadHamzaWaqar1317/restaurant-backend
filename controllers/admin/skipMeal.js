const skipMeal = require("../../services/admin/skipMeal");

exports.skipEveryoneMeal = async (req, res) => {
  skipMeal.excludeAllMeals(req, res);
};

exports.getAllMealSkips = async (req, res) => {
  skipMeal.getAllMealSkips(req, res);
};

exports.deleteSingleAllMealSkip = async (req, res) => {
  skipMeal.deleteSingleAllMealSkip(req, res);
};

exports.getEmployeeMealSkips = async (req, res) => {
  skipMeal.getEmployeeMealSkips(req, res);
};

exports.deleteEmployeeMealSkipDate = async (req, res) => {
  skipMeal.deleteEmployeeMealSkip(req, res);
};
