const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../functions/jwtGenerator");
const groupby = require("../functions/groupby");
const userValidations = require("../middleware/userValidations");
const authorization = require("../middleware/authorization");

// DONE GET USERS
router.get("/by_id", async (req, res) => {
  try {
    if (req.query.client_id) {
      // query by client_id => returns list of users by that client
      const users = await pool.query(
        "SELECT * FROM users WHERE client_id = $1;",
        [req.query.client_id]
      );
      return res.json(users.rows);
    } else if (req.query.user_id) {
      // query by user_id => returns a single unique user
      const user = await pool.query("SELECT * FROM users WHERE user_id = $1;", [
        req.query.user_id,
      ]);
      return res.json(user.rows[0]);
    } else {
      // returns all users
      const users = await pool.query("SELECT * FROM users;");
      return res.json(users.rows);
    }
  } catch (err) {
    return res.status(500).send("Server Error");
  }
});

// DONE CREATE USER
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

router.patch("/edit", authorization, userValidations, async (req, res) => {
  try {
    // step 1. Get user info
    const { user_id, firstname, lastname, email, client_id, user_type, } = req.body;

    if (firstname) {
      await pool.query(
        "UPDATE users SET firstname = $1 WHERE user_id = $2;",
        [firstname, user_id]
      );
    }
    if (lastname) {
      await pool.query(
        "UPDATE users SET lastname = $1 WHERE user_id = $2;",
        [lastname, user_id]
      );    
    }
    if (email) {
      await pool.query(
        "UPDATE users SET email = $1 WHERE user_id = $2;",
        [email, user_id]
      );    
    }
    if (client_id) {
      await pool.query(
        "UPDATE users SET client_id = $1 WHERE user_id = $2;",
        [client_id, user_id]
      );    
    }
    if (user_type) {
      await pool.query(
        "UPDATE users SET user_type = $1 WHERE user_id = $2;",
        [user_type, user_id]
      );
    }

    // step 4. enter new user in db
    let updated_user = await pool.query(
      "SELECT * from users WHERE user_id = $1;",
      [user_id]
    );

    return res.json(updated_user.rows[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

// DONE CHANGE PASSWORD
router.patch(
  "/changepass",
  authorization,
  userValidations,
  async (req, res) => {
    try {
      // step 1. Get user info
      const { user_id, new_password } = req.body;

      // step 2. authenticate. Already done by middleware.

      // step 3. Bcrypt new password
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcrypt_password = await bcrypt.hash(new_password, salt);

      // step 4. enter new user in db
      let new_user = await pool.query(
        "UPDATE users SET password = $1 WHERE user_id = $2 RETURNING *;",
        [bcrypt_password, user_id]
      );

      // step 5. generating jwt token
      const token = jwtGenerator(new_user.rows[0].user_id);
      // { token } es igual a { token: token }. Si tienen el mismo nombre la variable y el obj, puedo solo escribir uno.
      return res.json({ username: new_user.rows[0], token });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }
  }
);

// TODO ASIGN TEST TO USER

// DONE DELETE USER
router.delete("/delete", authorization, async (req, res) => {
  try {
    // 1. destructure req.body
    const { user_id } = req.body;
    // 2. delete client
    const user = await pool.query("DELETE FROM users WHERE user_id = $1;", [
      user_id,
    ]);

    // 3. return something
    return res.json({
      commmand: user.command,
      deleted: user.rowCount == true,
      user_id,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const query = await pool.query(
      "SELECT * from users LEFT JOIN clients ON users.client_id = clients.client_id" +
        " ORDER BY LOWER(client_name), LOWER(firstname);"
    );

    const grouped = groupby(query.rows, "client_name");

    // Elimino el admin de la lista de usuarios que muestro
    // email: admin@polynatural.cl, pass: admin
    for (var i = 0; i < grouped["Polynatural"].length; i++) {
      if (grouped["Polynatural"][i].firstname === "admin") {
        grouped["Polynatural"].splice(i, 1);
      }
    }
    return res.json(grouped);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
