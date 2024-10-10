const priceCont = require("../../services/admin/priceCont");

exports.getMealPrice = async (req, res) => {
  priceCont.getMealPrice(req, res);
};

exports.updateMealPrice = async (req, res) => {
  priceCont.updateMealPrice(req, res);
};

exports.getCont = async (req, res) => {
  priceCont.getContPercent(req, res);
};

exports.updateCont = async (req, res) => {
  priceCont.updateContPercent(req, res);
};
