const menuCategory = require("../../services/admin/menuCategory");

exports.getMenuCategory = async (req, res) => {
  menuCategory.getMenuCategory(req, res);
};

exports.addMenuCategory = async (req, res) => {
  menuCategory.addMenuCategory(req, res);
};

exports.updateMenuCategory = async (req, res) => {
  menuCategory.updateMenuCategory(req, res);
};

exports.deleteMenuCategory = async (req, res) => {
  menuCategory.deleteMenuCategory(req, res);
};
