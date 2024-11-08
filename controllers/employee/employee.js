const employee = require("../../services/employee/employee");

exports.signUp = async (req, res) => {
  employee.signUp(req, res);
};

exports.signIn = async (req, res) => {
  employee.signIn(req, res);
};

exports.getUserInfo = async (req, res) => {
  employee.getUserInfo(req, res);
};

exports.forgetPassword = async (req, res) => {
  employee.forgetPassword(req, res);
};

exports.verifyOtp = async (req, res) => {
  employee.verifyOtp(req, res);
};

exports.createNewPassword = async (req, res) => {
  employee.createNewPassword(req, res);
};
