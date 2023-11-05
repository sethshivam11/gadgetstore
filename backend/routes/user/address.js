const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const fetchuser = require("../../middlewares/fetchUser");
const { body, validationResult } = require("express-validator");


// Saving a new address "/api/user/address/add"
router.put(
  "/add",
  [
    body("name", "Enter a valid name").notEmpty(),
    body("mobile", "Enter a valid mobile number").isLength({ min: 10 }),
    body("pincode", "Enter a valid pincode").isLength({ min: 6 }),
    body("street", "Enter a valid street").notEmpty(),
    body("locality", "Enter a valid locality").notEmpty(),
    body("address", "Enter a valid address").notEmpty(),
    body("city", "Enter a valid city").notEmpty(),
    body("state", "Enter a valid state").notEmpty(),
    body("type", "Enter a valid address type").notEmpty(),
  ],
  fetchuser,
  async (req, res) => {
    let success = false;
    const userId = req.user.id;
    const error = validationResult(req);
    const {
      name,
      mobile,
      pincode,
      street,
      address,
      locality,
      city,
      state,
      type,
      alternate,
      landmark,
    } = req.body;
    let landmark2 = "";
    let alternate2 = "";
    if (landmark) landmark2 = landmark;
    if (alternate) alternate2 = alternate;
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }
    try {
      const findUser = await User.findById(userId);
      let updated = findUser;
      let id = updated.address.length;
      updated.address.push({
        id: `address-${id + 1}`,
        name,
        mobile,
        pincode,
        street,
        address,
        locality,
        state,
        city,
        type,
        alternate: alternate2,
        landmark: landmark2,
      });
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
  }
);

// Removing an address "/api/user/address/remove"
router.put("/remove", fetchuser, async (req, res) => {
  let success = false;
  const userId = req.user.id;
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ success, error: "Please provide a valid address" });
  }
  try {
    const findUser = await User.findById(userId);
    let updated = findUser;
    const index = findUser.address.findIndex((item) => item.id === id);
    if (index !== -1) {
      updated.address.splice(index, 1);
    } else {
      return res
        .status(400)
        .json({ success, error: "Address does not exists" });
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

// Updating the saved address "/api/user/address/edit"
router.put("/edit", fetchuser, async (req, res) => {
  let success = false;
  const userId = req.user.id;
  const {
    id,
    name,
    mobile,
    pincode,
    street,
    address,
    locality,
    city,
    state,
    type,
    alternate,
    landmark,
  } = req.body;
  if(!id) {
    return res.status(400).json({success, error: "Address not found"});
  }
  try {
    const findUser = await User.findById(userId);
    let updated = {};
    updated = findUser;
    const index = findUser.address.findIndex((item) => item.id === id);
    if (name) updated.address[index].name = name;
    if (mobile) updated.address[index].mobile = mobile;
    if (pincode) updated.address[index].pincode = pincode;
    if (street) updated.address[index].street = street;
    if (address) updated.address[index].address = address;
    if (locality) updated.address[index].locality = locality;
    if (city) updated.address[index].city = city;
    if (state) updated.address[index].state = state;
    if (type) updated.address[index].type = type;
    if (landmark) updated.address[index].landmark = landmark;
    if (alternate) updated.address[index].alternate = alternate;
    const user = await User.findByIdAndUpdate(userId, {$set: updated, new: true});
    success = true;
    res.status(200).json({success, user});
  } catch (err) {
    console.log(err);
    res.status(500).json({ success, error: "Internal Server Error!" });
  }
});

module.exports = router;
