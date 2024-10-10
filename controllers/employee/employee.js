const employee = require("../../services/employee/employee");

exports.signUp = async (req, res) => {
  employee.signUp(req, res);
};

exports.signIn = async (req, res) => {
  employee.signIn(req, res);
};

exports.subscribe = async (req, res) => {
  employee.subscribe(req, res);
};

exports.skipMeal = async (req, res) => {
  employee.skipMeal(req, res);
};

exports.getSkipMealDates = async (req, res) => {
  employee.getSkipMealDates(req, res);
};

exports.deleteSkipMealDates = async (req, res) => {
  employee.deleteSkipMealDate(req, res);
};

exports.mealComplaint = async (req, res) => {
  employee.mealComplaint(req, res);
};
