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
    let quantity = 1;
    const index = user.cart.findIndex((item) => item._id === product._id);

    if (index !== -1) {
      user.cart[index].quantity += quantity;
    } else {
      let productId = product._id;
      let productName = product.name;
      let productCategory = product.category;
      let productBrand = product.brand;
      let productPrice = product.price;
      let productStock = product.stock;
      let productDiscount = product.discount;
      let productImages = product.images;
      delete product;
      user.cart.push({
        _id: productId,
        product: {
          name: productName,
          category: productCategory,
          brand: productBrand,
          price: productPrice,
          stock: productStock,
          images: productImages,
          discount: productDiscount,
        },
        quantity,
      });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: user,
      new: true,
    }).select("-password");
    success = true;
    res.status(200).json({ success, user: updatedUser });
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
    let quantity = 1;
    const index = findUser.cart.findIndex((item) => item._id === product._id);
    if (index !== -1) {
      if (!all) {
        if (findUser.cart[index].quantity > 1) {
          findUser.cart[index].quantity -= quantity;
        } else {
          findUser.cart.splice(index, 1);
        }
      } else {
        findUser.cart.splice(index, 1);
      }
    } else {
      return res.status(400).json({ success, error: "Product not found!" });
    }
    const user = await User.findByIdAndUpdate(userId, {
      $set: findUser,
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
    const index = findUser.wishlist.findIndex(
      (item) => item._id === product._id
    );
    if (index !== -1) {
      return res
        .status(200)
        .json({ success, error: "Product already in wishlist" });
    } else {
      let productId = product._id;
      let newProduct = {
        name: product.name,
        category: product.category,
        brand: product.brand,
        price: product.price,
        stock: product.stock,
        images: product.images,
        discount: product.discount,
      }
      delete product;
      findUser.wishlist.push({
        _id: productId,
        product: newProduct,
      });
    }
    const user = await User.findByIdAndUpdate(userId, {
      $set: findUser,
      new: true,
    });
    console.log(findUser)
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
    const index = findUser.wishlist.findIndex(
      (item) => item._id === product._id
    );
    if (index !== -1) {
      findUser.wishlist.splice(index, 1);
    } else {
      return res.status(400).json({ success, error: "Product not found!" });
    }
    const user = await User.findByIdAndUpdate(userId, {
      $set: findUser,
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
    const index = findUser.wishlist.findIndex(
      (item) => item._id === product._id
    );
    const cIndex = findUser.cart.findIndex((item) => item._id === product._id);
    if (index !== -1) {
      findUser.wishlist.splice(index, 1);
      if (cIndex === -1) {
        const id = product._id;
        delete product._id;
        findUser.cart.push({ _id: id, product, quantity: 1 });
      } else {
        const user = await User.findByIdAndUpdate(userId, {
          $set: findUser,
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
      $set: findUser,
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
