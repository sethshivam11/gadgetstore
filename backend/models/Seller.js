const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const sellerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        reuired: true
    }, 
    date: {
        type: String,
        default: Date.now
    }
});
const Seller = mongoose.model("seller", sellerSchema);
module.exports = Seller;