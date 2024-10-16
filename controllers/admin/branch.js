const branch = require("../../services/admin/branch");

exports.getbranch = async (req, res) => {
  branch.getBranch(req, res);
};

exports.addbranch = async (req, res) => {
  branch.addBranch(req, res);
};

exports.updatebranch = async (req, res) => {
  branch.updateBranch(req, res);
};

exports.deleteBranch = async (req, res) => {
  branch.deleteBranch(req, res);
};
