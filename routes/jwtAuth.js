const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../functions/jwtGenerator');


// DONE REGISTER ROUTE
router.post("/register", async (request, response) => {
  try {

    // step 1. destructure the request.body (name, email, password)
    const { name, email, password } = request.body;

    // step 2. Check if user exists. (if not throw error)
    const user = await pool.query("SELECT * FROM test WHERE email = $1;", [
      email
    ])

    if(user.rows.length !== 0) {
      // user exists. 401 -> Unauthenticated. 403 -> Unauthorized
      return response.status(401).send("User already exists");
    }

    // step 3. Bcrypt password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcrypt_password = await bcrypt.hash(password, salt);
    console.log(bcrypt_password);
   
    // step 4. enter new user in db
    const new_user = await pool.query(
      "INSERT INTO test (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, bcrypt_password]
      ); 
    
    // step 5. generating jwt token
    const token = jwtGenerator(new_user.rows[0].user_id)
    // { token } es igual a { token: token }. Si tienen el mismo nombre la variable y el obj, puedo solo escribir uno.
    response.json({ username: user.rows[0], token })

  } catch (err) {
    console.error(err.message);
    response.status(500).send("Server Error")
  }
});


// DONE LOGIN ROUTE

router.post("/login", async (req, res) => {
  try {
    // 1. destructure req.body
    const { email, password } = req.body;

    // 2. check if user exists, if not, throw error
    const user = await pool.query("SELECT * FROM test WHERE email = $1;", [
      email
    ])

    if (user.rows.length === 0){
      // No se encuentra al usuario.
      return res.status(401).send(`El correo ${email} no está registrado.`)
      // return res.status(401).send(`Password or Email is incorrect`)
    }

    // 3. check if incomming password is the same as database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    console.log(`validPassword ${validPassword}`);
    
    if(!validPassword){
      return res.status(401).json(`Incorrect password or email`)
    }

    // 4. return jw token
    const token = jwtGenerator(user.rows[0].user_id);
    return res.json({ username: user.rows[0], token })

  } catch (err) {
    console.error(err.message)
    return res.status(500).json("Server error")
  }
});


module.exports = router;