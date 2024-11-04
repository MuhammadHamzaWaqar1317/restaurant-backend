const express = require("express");
var router = express.Router();

const menu = require("../controllers/admin/menu");
const branch = require("../controllers/admin/branch");
const reservation = require("../controllers/admin/reservation");
const order = require("../controllers/admin/order");
const menuCategory = require("../controllers/admin/menuCategory");

router
  .route("/menu")
  .post(menu.addMenuItem)
  .get(menu.getMenu)
  .patch(menu.updateMenuItem)
  .delete(menu.deleteMenuItem);

router
  .route("/menu-category")
  .get(menuCategory.getMenuCategory)
  .post(menuCategory.addMenuCategory)
  .patch(menuCategory.updateMenuCategory)
  .delete(menuCategory.deleteMenuCategory);

router
  .route("/branch")
  .get(branch.getbranch)
  .post(branch.addbranch)
  .patch(branch.updatebranch)
  .delete(branch.deleteBranch);

router
  .route("/reservation")
  .get(reservation.getReservation)
  .post(reservation.addReservation)
  .patch(reservation.updateReservation)
  .delete(reservation.deleteReservation);

router
  .route("/order")
  .get(order.getOrders)
  .post(order.addOrder)
  .patch(order.updateOrderStatus);

module.exports = router;
