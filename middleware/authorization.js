const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // 1. destructure body to get token
    const jwToken = req.header("token");
    if (!jwToken){
      throw { messsage: "Not Authorized", code: 403}
      // return res.status(403).json("Not Authorized")
    }

    const payload = jwt.verify(jwToken, process.env.jwtSecret);
    // if verified it will return a payload.

    req.user = payload.user;

  } catch (err) {
    console.error(err.message);
    return res.status(err.code).json(err.message)
    // return res.status(403).json("Not Authorized")
  }
}