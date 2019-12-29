const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.jwtAuth = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    if (token) {
      const user = await userModel.findOne({ jwt: token });
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET );
      if (user && verifiedToken) {
        res.locals.user = user;
        next();
      } else res.status(401).json({ message: "Unauthorized" });
    } else res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
