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
  if (!product._id) {
    return res
      .status(400)
      .json({ success, error: "Please provide a valid product!" });
  }
  try {
    const user = await User.findById(userId);
    let updated = user;
    let quantity = 1;
    const index = updated.cart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      updated.cart[index].quantity += quantity;
    } else {
      let productId = product._id;
      delete product._id;
      updated.cart.push({ _id: productId, product, quantity });
    }
    const added = await User.findByIdAndUpdate(userId, {
      $set: updated,
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
  const { product, all } = req.body;
  let success = false;
  if (!product._id) {
    return res
      .status(400)
      .json({ success, error: "Please provide a valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    let quantity = 1;
    const index = updated.cart.findIndex((item) => item._id === product._id);
    if (index !== -1) {
      if (!all) {
        if (updated.cart[index].quantity > 1) {
          updated.cart[index].quantity -= quantity;
        } else {
          updated.cart.splice(index, 1);
        }
      } else {
        updated.cart.splice(index, 1);
      }
    } else {
      return res.status(400).json({ success, error: "Product not found!" });
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

// Adding products to the wishlist "/api/user/wishlist/add"
router.put("/wishlist/add", fetchuser, async (req, res) => {
  const userId = req.user.id;
  const { product } = req.body;
  let success = false;
  if (!product._id) {
    return res
      .status(400)
      .json({ success, error: "Please provide valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    let quantity = 1;
    const index = updated.wishlist.findIndex(
      (item) => item._id === product._id
    );
    if (index !== -1) {
      return res
        .status(200)
        .json({ success, error: "Product already in wishlist" });
    } else {
      let productId = product._id;
      delete product._id;
      updated.wishlist.push({ _id: productId, product });
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
  if (!product._id) {
    return res
      .status(400)
      .json({ success, error: "Please provide valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    let quantity = 1;
    const index = updated.wishlist.findIndex(
      (item) => item._id === product._id
    );
    if (index !== -1) {
      updated.wishlist.splice(index, 1);
    } else {
      return res.status(400).json({ success, error: "Product not found!" });
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

// Moving the product to cart from the wishlist "/api/user/movetocart"
router.put("/movetocart", fetchuser, async (req, res) => {
  const userId = req.user.id;
  const { product } = req.body;
  let success = false;
  if (!product._id) {
    return res
      .status(400)
      .json({ success, error: "Please provide valid product!" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    const index = updated.wishlist.findIndex(
      (item) => item._id === product._id
    );
    const cIndex = updated.cart.findIndex((item) => item._id === product._id);
    if (index !== -1) {
      updated.wishlist.splice(index, 1);
      if (cIndex === -1) {
        const id = product._id;
        delete product._id;
        updated.cart.push({ _id: id, product, quantity: 1 });
      } else {
        const user = await User.findByIdAndUpdate(userId, {
          $set: updated,
          new: true,
        });
        return res
          .status(200)
          .json({ success, error: "Product already in cart", user });
      }
    } else {
      return res.status(400).json({ success, error: "Product not found!" });
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
