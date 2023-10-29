const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    let success = false;
    const token = req.header("token");
    if(!token){
        return res.status(401).json({success, error: "Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token, secret);
        req.user = data.user;
        next();
    }
    catch(err){
        res.status(401).json({success, error: "Please authenticate using a valid token"});
    }
}

module.exports = fetchuser;