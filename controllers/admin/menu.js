const menu = require("../../services/admin/menu");

exports.getMenu = async (req, res) => {
  menu.getMenu(req, res);
};

exports.addMenuItem = async (req, res) => {
  menu.addMenuItem(req, res);
};

exports.updateMenuItem = async (req, res) => {
  menu.updateMenuItem(req, res);
};

exports.deleteMenuItem = async (req, res) => {
  menu.deleteMenuItem(req, res);
};
