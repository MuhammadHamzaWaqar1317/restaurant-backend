const meal = require("../../services/admin/mealRecord");

exports.data = async (req, res) => {
  meal.getMealData(req, res);
};

exports.dropDownFilter = async (req, res) => {
  meal.getDropdownFilterData(req, res);
};

exports.searchFilter = async (req, res) => {
  meal.getSearchFilterData(req, res);
};
