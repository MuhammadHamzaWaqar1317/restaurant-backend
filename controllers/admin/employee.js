const employee = require("../../services/admin/employee");

exports.data = async (req, res) => {
  employee.getEmployeeData(req, res);
};

exports.handleSubscription = async (req, res) => {
  employee.updateSubscription(req, res);
};

exports.searchFilter = async (req, res) => {
  employee.getSearchFilterData(req, res);
};

exports.dropdownFilter = async (req, res) => {
  employee.getDropdownFilterData(req, res);
};
