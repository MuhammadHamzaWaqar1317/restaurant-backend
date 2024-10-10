const express = require("express");
const router = express.Router();

router.use("/admin", require("./admin"));
router.use("/employee", require("./employee"));

module.exports = router;
