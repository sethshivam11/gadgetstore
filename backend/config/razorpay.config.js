const razorpay = require("razorpay");
require("dotenv").config();

const createRazorpayInstance = () => {
  return new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

module.exports = { createRazorpayInstance };
