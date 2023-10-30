const express = require("express");
const dotenv = require("dotenv").config();
const Seller = require("../../models/Seller");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// Route 1: Signing up a new seller "/api/admin/signup"
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
      let seller = await Seller.findOne({ email: req.body.email });
      if (seller) {
        return res.status(401).json({
          success,
          error: "A seller already exists with this email!",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const enPwd = await bcrypt.hash(req.body.password, salt);
      seller = await Seller.create({
        name: req.body.name,
        email: req.body.email,
        password: enPwd,
      });
      const data = {
        seller: {
          id: seller.id,
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

// Route 2: Logging in a seller
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
      let seller = await Seller.findOne({ email: req.body.email });
      if (!seller) {
        return res.status(400).json({
          success,
          error: "Invalid Email!",
        });
      }
      const comparePassword = await bcrypt.compare(
        req.body.password,
        seller.password
      );
      if (!comparePassword) {
        return res.status(401).json({
          success,
          error: "Invalid Password!",
        });
      }
      const data = {
        seller: {
          id: seller.id,
        },
      };
      const token = jwt.sign(data, secret);
      success = true;
      res.status(200).json({ success, token });
    } catch (err) {
      success = false;
      res
        .status(400)
        .json({ success, error: "Internal Server Error!", message: err });
      console.log(err);
    }
  }
);

module.exports = router;