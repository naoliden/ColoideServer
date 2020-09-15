const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');


router.post("/register", async (request, response) => {
  try {

    // step 1. destructure the request.body (name, email, password)
    const { name, email, password } = request.body;

    // step 2. Check if user exists. (if not throw error)
    const user = await pool.query("SELECT * FROM test WHERE email = $1;", [
      email
    ])

    if(user.rows.length !== 0) {
      // user exists. 401 -> unauthenticated
      return response.status(401).send("User already exists");
    }

    // step 3. Bcrypt password
    
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcrypt_password = await bcrypt.hash(password, salt);
    console.log(bcrypt_password);
    // step 4. enter new user in db
    const new_user = await pool.query("INSERT INTO test (username, email, password) VALUES ($1, $2, $3) RETURNING *;", [name, email, bcrypt_password]) 

    response.json(new_user.rows[0]);
    // step 5. generating jwt token

  } catch (err) {
    console.error(err.message);
    response.status(500).send("Server Error")
  }
});

module.exports = router;