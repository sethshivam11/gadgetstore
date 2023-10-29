const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Product = require("../../models/Product");
const fetchuser = require("../../middlewares/fetchUser");


// Adding products to the cart "/api/user/cart/add"
router.put("/cart/add", fetchuser, async (req, res) => {
  let success = false;
  const { product } = req.body;
  const userId = req.user.id;
  if (!product.id) {
    return res
      .status(400)
      .json({ success, error: "Please provide a valid product!" });
  }
  try {
    const user = await User.findById(userId);
    let updatedCart = user;
    let quantity = 1;
    const index = updatedCart.cart.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      updatedCart.cart[index].quantity += quantity;
    } else {
      let productId = product.id;
      delete product.id;
      updatedCart.cart.push({ id: productId, product, quantity });
    }
    const added = await User.findByIdAndUpdate(userId, {
      $set: updatedCart,
      new: true,
    });
    success = true;
    res.status(200).json({ success, user: added });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success, error: "Internal Server Error!", message: err });
  }
});

// Removing products from the cart "/api/user/cart/remove"
router.put("/cart/remove", fetchuser, async (req, res) => {
  const userId = req.user.id;
  const { product } = req.body;
  let success = false;
  if (!product.id) {
    return res
      .status(400)
      .json({ success, error: "Please provide a valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updatedCart = findUser;
    let quantity = 1;
    const index = updatedCart.cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      if (updatedCart.cart[index].quantity > 0) {
      updatedCart.cart[index].quantity -= quantity;
    }else{
      updatedCart.cart.splice(index, 1);
    }
    } else {
      let productId = product.id;
      delete product.id;
      updatedCart.cart.push({ id: productId, product, quantity });
    }
    const user = await User.findByIdAndUpdate(userId, {
      $set: updatedCart,
      new: true,
    });
    success = true;
    res.status(200).json({ success, user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success, error: "Internal Server Error!", message: err });
  }
});

// Adding products to the wishlist "/api/user/wishlist/add"
router.put("/wishlist/add", fetchuser, async (req, res) => {
  const userId = req.user.id;
  const { product } = req.body;
  let success = false;
  if (!product.id) {
    return res
      .status(400)
      .json({ success, error: "Please provide valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    let quantity = 1;
    const index = updated.wishlist.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      updated.wishlist[index].quantity += quantity;
    } else {
      let productId = product.id;
      delete product.id;
      updated.wishlist.push({ id: productId, product, quantity });
    }
    const user = await User.findByIdAndUpdate(userId, {
      $set: updated,
      new: true,
    });
    success = true;
    res.status(200).json({ success, user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success, error: "Internal Server Error!", message: err });
  }
});

// Removing products from the wishlist "/api/user/wishlist/remove"
router.put("/wishlist/remove", fetchuser, async (req, res) => {
  const userId = req.user.id;
  const { product } = req.body;
  let success = false;
  if (!product.id) {
    return res
      .status(400)
      .json({ success, error: "Please provide valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    let quantity = 1;
    const index = updated.wishlist.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      updated.wishlist[index].quantity -= quantity;
      if (updated.wishlist[index].quantity <= 0) {
        updated.wishlist.splice(index, 1);
      }
    } else {
      let productId = product.id;
      delete product.id;
      updated.wishlist.push({ id: productId, product, quantity });
    }
    const user = await User.findByIdAndUpdate(userId, {
      $set: updated,
      new: true,
    });
    success = true;
    res.status(200).json({ success, user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success, error: "Internal Server Error!", message: err });
  }
});




module.exports = router;
