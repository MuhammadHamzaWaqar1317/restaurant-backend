const additional = require("../../services/admin/additionalMeal");

exports.mealReq = async (req, res) => {
  additional.postMealReq(req, res);
};
