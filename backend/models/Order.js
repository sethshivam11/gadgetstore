const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const OrderSchema = new Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  products: { type: Array },
  address: { type: Object, required: true },
  date: { type: String, default: Date },
  method: { type: String, required: true }
});

const Order = mongoose.model("Order", OrderSchema);
Order.createIndexes();
module.exports = Order;
