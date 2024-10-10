const menu = require("../../services/admin/menu");

exports.addMenuItem = async (req, res) => {
  menu.addMenuItem(req, res);
};
