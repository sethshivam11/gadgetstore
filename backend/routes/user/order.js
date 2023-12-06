const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require("../../middlewares/fetchUser");
const User = require("../../models/User");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

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
      products.forEach(async (product) => {
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
      });
      let updated = findUser;
      // updated.orders.push({products, total, address, payment});
      const order = await Order.create({
        products, 
        user: {
          id: updated._id,
          name: updated.name,
          email: updated.email,
        }, 
        address, 
        method: payment
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

// router.get("/getorders", fetchuser, async(req, res) => {
//   let success = false;
//   const userId = req.user.id;
//   try{

//   }catch(err){
//     console.log(err);
//     res.status(500).json({success, error: "Internal Server Error!"});
//   }
// })

module.exports = router;
