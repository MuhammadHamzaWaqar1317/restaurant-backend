const complaint = require("../../services/admin/mealComplaint");

exports.getMealComplaint = async (req, res) => {
  complaint.getComplaint(req, res);
};

exports.resolveMealComplaint = async (req, res) => {
  complaint.resolveComplaint(req, res);
};
