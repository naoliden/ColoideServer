const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    // 1. destructure HEADER to get token
    const jwToken = req.header("token");

    if (!jwToken){
      return res.status(403).json("Not Authorized")
    }

    // 2. if verified it will return a payload.
    // El token se genera con el id del usuario, por lo que esta info está dentro
    // del token. jwt.verify retorna el id desencriptado dentro del payload (igual como se creó)
    const payload = jwt.verify(jwToken, process.env.jwtSecret);
    req.user_id = payload.user_id;

    // 3. continue to the next route with the verification info.
    next();

  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorized")
  }
}