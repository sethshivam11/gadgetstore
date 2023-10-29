const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const secret = process.env.JWT_SECRET;

const fetchSeller = (req, res, next) => {
    let success = false;
    const token = req.header("token");
    if (!token) {
      return res
        .status(401)
        .json({ success, error: "Please authenticate using a valid token" });
    }
    try {
      const data = jwt.verify(token, secret);
      req.seller = data.seller.id;
      next();
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ success, error: "Some error occured while token verification." });
    }
}

module.exports = fetchSeller;