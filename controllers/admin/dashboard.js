const dashboard = require("../../services/admin/dashboard");

exports.data = async (req, res) => {
  dashboard.getdata(req, res);
};
