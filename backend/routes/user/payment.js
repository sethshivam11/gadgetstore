const express = require("express");
const { createRazorpayInstance } = require("../../config/razorpay.config");
const Product = require("../../models/Product");
const router = express.Router();
const razorpayInstance = createRazorpayInstance();
const crypto = require("crypto");
const User = require("../../models/User");
const Order = require("../../models/Order");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../../middlewares/fetchUser");
require("dotenv").config();

router.post(
  "/createOrder",
  fetchuser,
  [
    body("products", "Please provide a valid product").notEmpty(),
    body("address", "Invalid Address!").notEmpty(),
    body("total", "Invalid total").notEmpty(),
    body("payment", "Invalid payment method").notEmpty(),
  ],
  async (req, res) => {
    let success = false;
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Product ID is required" });
    }

    try {
      const productIds = products.map((product) => product._id);
      const productQty = new Map();
      products.forEach((product) => {
        productQty.set(product._id, product.quantity);
      });
      const savedProducts = await Product.find(
        { _id: { $in: productIds } },
        "price discount stock"
      );

      const outOfStockProducts = savedProducts.filter(
        (product) =>
          product.stock < (productQty.get(product._id.toString()) || 0)
      );

      if (outOfStockProducts.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Some products are out of stock",
        });
      }
      if (!savedProducts || savedProducts.length === 0) {
        return res.status(400).json({ success, error: "Product not found!" });
      }
      const amount = savedProducts.reduce(
        (acc, product) =>
          acc +
          Math.ceil(
            product.price * (productQty.get(product._id.toString()) || 0) -
              (product.price * product.discount) / 100
          ),
        0
      );

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt#1",
      };

      razorpayInstance.orders.create(options, (err, order) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            success,
            error: err.error.description || "Razorpay Order Creation Failed",
          });
        }
        success = true;
        return res.status(200).json({ success, order });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success, error: "Internal Server Error" });
    }
  }
);

router.post("/verify", fetchuser, async (req, res) => {
  const { order_id, payment_id, signature, orderDetails } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const userId = req.user.id;
  let success = false;

  const hmac = crypto.createHmac("sha256", secret);

  hmac.update(order_id + "|" + payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== signature) {
    return res
      .status(400)
      .json({ success, error: "Payment Verification Failed!" });
  }

  const { products, total, address, payment } = orderDetails;
  const findUser = await User.findById(userId);
  let productArray = [];
  for (const product of products) {
    const findProduct = await Product.findById(product._id);
    let updatedProduct = findProduct;
    if (updatedProduct.stock > 0 && updatedProduct.stock > product.quantity) {
      updatedProduct.stock -= product.quantity;
    } else {
      return res
        .status(400)
        .json({ success, error: "Product is out of stock" });
    }
    const productU = await Product.findByIdAndUpdate(product._id, {
      $set: updatedProduct,
      new: true,
    });
    productArray.push(productU);
    product.name = product.product.name;
    product.category = product.product.category;
    product.stock = product.product.stock;
    product.price = product.product.price;
    product.brand = product.product.brand;
    product.images = product.product.images;
    delete product.product;
  }
  let updated = findUser;
  const order = await Order.create({
    products: products,
    user: {
      id: updated._id,
      name: updated.name,
      email: updated.email,
    },
    address,
    method: payment,
    total,
  });
  updated.cart = [];
  updated.orders.push(order.id);
  const user = await User.findByIdAndUpdate(userId, {
    $set: updated,
    new: true,
  });
  success = true;
  res.status(200).json({ success, user, productArray, order: order.id });
});

module.exports = router;
