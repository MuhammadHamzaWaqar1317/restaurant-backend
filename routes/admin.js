const express = require("express");
var router = express.Router();

const menu = require("../controllers/admin/menu");
const branch = require("../controllers/admin/branch");
const reservation = require("../controllers/admin/reservation");

router
  .route("/menu")
  .post(menu.addMenuItem)
  .get(menu.getMenu)
  .patch(menu.updateMenuItem)
  .delete(menu.deleteMenuItem);

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

module.exports = router;
