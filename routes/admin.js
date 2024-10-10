const express = require("express");
var router = express.Router();

const menu = require("../controllers/admin/menu");

router
  .route("/menu")
  .post(menu.addMenuItem)
  .get(menu.getMenu)
  .patch(menu.updateMenuItem)
  .delete(menu.deleteMenuItem);

module.exports = router;
