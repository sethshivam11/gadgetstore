const express = require("express");
const router = express.Router();
const dotenv = require("dotenv").config();
const Product = require("../../models/Product");

// Route 1: Get all the products listed by sellers "/api/client/home"
router.get("/home", async (req, res) => {
  let success = false;
  const { category } = req.query;
  try {
    const products = await Product.find({ category: category });
    success = true;
    res.status(200).json({ success, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error\n", err });
  }
});

// Route 2: Get products by provided query "/api/client/query"
router.get("/query", async (req, res) => {
  let success = false;
  const { name, category, brand, minprice, maxprice } = req.query;
  try {
    if (name && !category && !brand && !minprice && !maxprice) {
      const products = await Product.find({ name: name });
      if(products.length <= 0){
        let error = "No proucts found with given query";
        return res.status(200).json({success, error});
      }
      success = true;
      res.status(200).json({ success, products });
    }
    else if (category && !name && !brand && !minprice && !maxprice) {
      const products = await Product.find({ category: category });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    }
    else if (brand && !category && !name && !minprice && !maxprice) {
      const products = await Product.find({ brand: brand });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (minprice && !category && !brand && !name && !maxprice) {
      const products = await Product.find({ price: { $gt: minprice } });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (maxprice && !category && !brand && !minprice && !name) {
      const products = await Product.find({ price: { $lt: maxprice } });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (minprice && category && !brand && !name && !maxprice) {
      const products = await Product.find({
        price: { gt: minprice },
        category: category,
      });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (maxprice && category && !brand && !name && !minprice) {
      const products = await Product.find({
        price: { $lt: maxprice },
        category: category,
      });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (brand && category && !minprice && !maxprice && !name) {
      const products = await Product.find({ category: category, brand: brand });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (maxprice && category && minprice && !brand && !name) {
      const products = await Product.find({
        price: { $gt: minprice, $lt: maxprice },
        category: category,
      });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    } else if (name && category && brand && minprice && maxprice) {
      const products = await Product.find({
        name: name,
        category: category,
        brand: brand,
        price: { $lt: minprice },
        price: { $gt: maxprice },
      });
      if (products.length <= 0) {
        let error = "No proucts found with given query";
        return res.status(200).json({ success, error });
      }
      success = true;
      res.status(200).json({ success, products });
    }else if(name && brand && !category && !minprice && !maxprice){
      const products1 = await Product.find({
        name: name,
      });
      const products2 = await Product.find({
        brand: brand,
      });
      let products = products1.concat(products2);
      if(products.length <= 0){
        let error = "No products found with given query";
        return res.status(200).json({success, error})
      }
      success = true;
      res.status(200).json({success, products})
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error! ", message: err });
  }
});

// Route 3: Get product by product id "/api/client/product/:id"
router.get("/product/:id", async (req, res) => {
  const productId = req.params.id;
  let success = false;
  try{
    const product = await Product.findById(productId);
    if(!product){
      return res.status(400).json({success, error: "Product not found!"});
    }
    success = true;
    res.status(200).json({success, product});
  }catch(err){
    console.log(err);
    res.status(500).json({success, error: "Internal Server Error!", message: err});
  }
})
module.exports = router;
