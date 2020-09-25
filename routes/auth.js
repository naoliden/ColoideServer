const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../functions/jwtGenerator");
const userValidations = require("../middleware/userValidations");
const authorization = require("../middleware/authorization");

// DONE REGISTER ROUTE
router.post("/register", authorization, userValidations, async (req, res) => {
  try {
    // step 1. destructure the request.body (name, email, password)
    const {
      firstname,
      lastname,
      email,
      password,
      client_id,
      user_type,
    } = req.body;

    // step 2. Check if user exists. (if not throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (user.rows.length !== 0) {
      // user exists. 401 -> Unauthenticated. 403 -> Unauthorized
      return res.status(403).json("User already exists");
    }

    // step 3. Bcrypt password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcrypt_password = await bcrypt.hash(password, salt);

    // step 4. enter new user in db
    let new_user = await pool.query(
      "INSERT INTO users (firstname, lastname, email, password, client_id, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [firstname, lastname, email, bcrypt_password, client_id, user_type]
    );

    // step 5. generating jwt token
    const token = jwtGenerator(new_user.rows[0].user_id);
    // { token } es igual a { token: token }. Si tienen el mismo nombre la variable y el obj, puedo solo escribir uno.
    return res.json({ username: new_user.rows[0], token });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// DONE LOGIN ROUTE
router.post("/login", userValidations, async (req, res) => {
  try {
    // 1. destructure req.body
    const { email, password } = req.body;

    // 2. check if user exists, if not, throw error
    const user = await pool.query("SELECT * FROM users WHERE email = $1;", [
      email,
    ]);

    if (user.rows.length === 0) {
      // No se encuentra al usuario.
      return res.status(400).send(`El correo ${email} no está registrado.`);
    }

    // 3. check if incomming password is the same as database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(403).json(`Incorrect password or email`);
    }

    // 4. return jw token
    const token = jwtGenerator(user.rows[0].user_id);
    return res.json({ ...user.rows[0], token });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

// DONE is-verified? route
router.get("/verify", authorization, async (req, res) => {
  try {
    // Si authorization falla, entonces no llegará a responder true. Se cae antes.
    res.json({message: "Success", isValid: true});
    
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

module.exports = router;
