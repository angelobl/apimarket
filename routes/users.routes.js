var express = require("express");
var router = express.Router();
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(500).json({ message: "User doesnt exist" });
    }
    if (!user.comparePassword(password)) {
      res.status(500).json({ message: "Wrong password" });
    } else {
      console.log(user.jwt);
      res.header("Authorization", user.jwt);
      res.status(200).json({ message: "Success" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    console.log("registrando");
    if (user) {
      res.status(500).json({ message: "User already exists" });
    } else {
      console.log("registrando nuevo usuario");
      const newUser = new userModel();
      newUser.username = username;
      encryptedPassword = newUser.encryptPassword(password);
      newUser.password = encryptedPassword;
      console.log(encryptedPassword);
      newUser.jwt = jwt.sign({ username, password: encryptedPassword }, process.env.JWT_SECRET );
      console.log(newUser);
      await newUser.save();
      res.status(200).json({ message: "User registered" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
