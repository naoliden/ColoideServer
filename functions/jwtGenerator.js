const jwt = require('jsonwebtoken');
require('dotenv').config();

function jwtGenerator(user_id){
  const payload = { user_id }

  // expiresIn is measured in seconds. I set it to five days.
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: 60*60*24*5 })

}

module.exports = jwtGenerator;