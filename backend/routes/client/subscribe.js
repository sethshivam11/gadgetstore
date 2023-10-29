const Email = require("../../models/Email");
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();


// Route 1: Subscribing a user with offers "/api/client/subscribe"
router.post("/subscribe", [body("email", "Enter a valid email")], async (req, res) => {
    let success = false;
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success, error: error.array() });
    }
    let reqEmail = req.body.email;
    try{
        let email = await Email.findOne({email: reqEmail});
        if(email){
            return res.status(401).json({success, error: "Email is already subscribed!"});
        }
        email = await Email.create({ email: reqEmail });
        success = true;
        res.status(200).json({success, email});
    }catch(err){
        console.log(err);
        res.status(500).json({success, error: "Internal Server Error!", message: err});
    }
})

module.exports = router