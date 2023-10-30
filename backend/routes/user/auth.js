const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const dotenv = require("dotenv").config();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;
const fetchuser = require("../../middlewares/fetchUser");


// Route 1: Signing up a new user "/api/user/auth/signup"
router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "A user with this email already exists!",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const enPwd = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: enPwd,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, secret);
      success = true;
      res.status(200).json({ success, token });
    } catch (err) {
      res.status(400).json({success, error: "Internal Server Error!", message: err});
      console.log(err);
    }
  }
);

// Route 2: Logging in a user "/api/user/auth/signup"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({
          success,
          error: "Invalid Email!",
        });
      }
      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!comparePassword) {
        return res.status(401).json({
          success,
          error: "Invalid Password!",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, secret);
      success = true;
      res.status(200).json({ success, token });
    } catch (err) {
      success = false;
      res
        .status(500)
        .json({ success, error: "Internal Server Error!", message: err });
      console.log(err);
    }
  }
);

// Route 3: Getting the data of logged in user "/api/user/auth/getuser"
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    success = true;
    res.status(200).json({ success, user });
  } catch (err) {
    res
      .status(500)
      .json({ success, error: "Internal Server Error!", message: err });
    console.log(err);
  }
});

// Route 4: Verify password of the user "/api/user/auth/verify"
router.post("/verify", fetchuser, async (req, res) => {
  // return req.body;
  try {
    const { password } = req.body;
    const userId = req.user.id;
    const data = await User.findById(userId);
    if(!data){
      return res.status(400).json({success, error: "User not found"});
    }
    const comparePassword = bcrypt.compare(password, data.password);
    if (!comparePassword) {
      return res.status(401).json({
        success,
        error: "Please enter a correct password",
      });
    }
    success = true;
    let user = data;
    user.password = data.password.slice(0, 10);
    res.json({success, user});
  } catch (err) {
    res
      .status(500)
      .json({ success, error: "Internal Server Error!", message: err });
    console.log(err);
  }
});


// Route 5: Updating user credentials "/api/user/auth/update"
router.put("/update", fetchuser, async (req,res) => {
  let success = false;
  const userId = req.user.id;
  const { name, email, password } = req.body;
  let updatedUser = {};
  if(name){
    updatedUser.name = name;
  }
  if(email){
    updatedUser.email = email;
  }
  if(password){
    let salt = await bcrypt.genSalt(10);
    let enPass = await bcrypt.hash(password, salt);
    updatedUser.password = enPass;
  }
  try {
    const user = await User.findByIdAndUpdate(userId, {$set: updatedUser, new: true});
    success = true;
    res.status(200).json({success, user});
  } catch (err) {
    console.log(err);
    res.status(500).json({success, error: "Internal Server Error!", message: err});
  }
})

module.exports = router;
