const order = require("../../services/admin/order");

exports.addOrder = async (req, res) => {
  order.addOrder(req, res);
};

exports.getOrders = async (req, res) => {
  order.getOrders(req, res);
};

exports.updateOrderStatus = async (req, res) => {
  order.updateOrderStatus(req, res);
};
