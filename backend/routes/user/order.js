const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require("../../middlewares/fetchUser");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

// Route 1: Create an order "/api/user/order/create"
router.put(
  "/create",
  fetchuser,
  [
    body("products", "Please provide a valid product").notEmpty(),
    body("address", "Invalid Address!").notEmpty(),
    body("total", "Invalid total").notEmpty(),
    body("payment", "Invalid payment method").notEmpty()
  ],
  async (req, res) => {
    let success = false;
    const userId = req.user.id;
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() })
    }
    const { products, total, address, payment } = req.body;
    try {
      const findUser = await User.findById(userId);
      let productArray = [];
      for (const product of products) {
        const findProduct = await Product.findById(product._id);
        let updatedProduct = findProduct;
        if (updatedProduct.stock > 0 && updatedProduct.stock > product.quantity) {
          updatedProduct.stock -= product.quantity;
        }
        else {
          return res.status(400).json({ success, error: "Product is out of stock" });
        }
        const productU = await Product.findByIdAndUpdate(product._id, { $set: updatedProduct, new: true });
        productArray.push(productU);
        product.name = product.product.name;
        product.category = product.product.category;
        product.stock = product.product.stock;
        product.price = product.product.price;
        product.brand = product.product.brand;
        product.images = product.product.images;
        delete product.product;
      };
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
        total
      })
      updated.cart = [];
      updated.orders.push(order.id);
      const user = await User.findByIdAndUpdate(userId, { $set: updated, new: true });
      success = true;
      res.status(200).json({ success, user, productArray, order: order.id });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success, error: "Internal Server Error!" });
    }
  }
);

// Route 2: Fetch all orders "/api/user/order/fetch"
router.get("/fetch", fetchuser, async (req, res) => {
  let success = false;
  const userId = req.user.id;
  try {
    const findUser = await User.findById(userId);
    let ordersArray = [];
    for (order of findUser.orders) {
      const orders = await Order.findById(order);
      ordersArray.push(orders);
    }
    if (!ordersArray.length) {
      return res.status(400).json({ success, error: "No orders found" });
    }
    success = true;
    res.status(200).json({ success, orders: ordersArray });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error!" });
  }
})

module.exports = router;
