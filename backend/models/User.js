const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
  },
  cart: {
    type: Array,
  },
  wishlist: {
    type: Array,
  },
  address: {
    type: Array,
  },
  orders: {
    type: Array,
  },
  date: {
    type: String,
    default: Date,
  },
});

const User = mongoose.model("user", UserSchema);
User.createIndexes();
module.exports = User;
