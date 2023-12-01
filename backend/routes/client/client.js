const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const Product = require("../../models/Product");

// Route 1: Get all the products listed by sellers "/api/client/home"
router.get("/home", async (req, res) => {
  let success = false;
  const { category, subCategory } = req.query;
  try {
    let products = {};
    if (category) {
      products = await Product.find({ category });
    } else if (subCategory) {
      products = await Product.find({ subCategory });
    }
    success = true;
    res.status(200).json({ success, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error" });
  }
});

// Route 2: Get product by product id "/api/client/product/:id"
router.get("/product/:id", async (req, res) => {
  const productId = req.params.id;
  let success = false;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ success, error: "Product not found!" });
    }
    success = true;
    res.status(200).json({ success, product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error!" });
  }
});

// Route 2: Get products by provided query "/api/client/query"
router.get("/query", async (req, res) => {
  let success = false;
  const { name, brand } = req.query;
  let products = [];
  try {
    if (name && !brand) {
      products = await Product.find({ name: name });
    } else if (brand && !name) {
      products = await Product.find({ brand: brand });
    }
    if (products.length <= 0) {
      let error = "No proucts found with given query";
      return res.status(200).json({ success, error });
    }
    success = true;
    res.status(200).json({ success, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error!" });
  }
});
module.exports = router;
