const jwt = require("jsonwebtoken");

require("dotenv").config();

const authToken = (req, res, next) => {
  console.log("in middleware");
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    console.log(authHeader);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id, role } = decoded;
    res.locals._id = _id;
    res.locals.role = role;

    next();
  } catch (err) {
    console.log("middleware err", err);
    res.status(404).send(err);
  }
};

module.exports = authToken;
