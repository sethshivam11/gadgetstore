const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const productSchema = new Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
  },
  orders: {
    type: Array,
  },
  rating: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  highlights: {
    type: String,
    required: true,
  },
  discount: {
    type: String,
  },
  images: {
    type: Array,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  description: { type: String, required: true },
  more: { type: String },
  date: {
    type: String,
    default: Date.now,
  },
});
const Product = mongoose.model("Product", productSchema);
Product.createIndexes();
module.exports = Product;
