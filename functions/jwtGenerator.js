const jwt = require('jsonwebtoken');
require('dotenv').config();

function jwtGenerator(user_id){
  const payload = { user_id }

  const days = 1;
  const hours = 60*60*24;
  // expiresIn is measured in seconds. I set it to five days.
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: hours * days })

}

module.exports = jwtGenerator;