const router = require('express').Router();
const bcrypt = require('bcrypt');
const pool = require('../db');
const jwtGenerator = require('../functions/jwtGenerator');

// DONE ADMIN FORCE LOGIN ROUTE
router.post("/", async (req, res) => {
  try {
    
    const user = await pool.query(
      "SELECT * FROM users WHERE firstname = 'admin';"
    );

    if (user.rows.length === 0) {
      // No se encuentra al usuario.
      return res.status(400).send(`Bad request`);
    }

    const token = jwtGenerator(user.rows[0].user_id);
    return res
      .status(418)
      .json({ message: "I'm a teapot", username: user.rows[0], token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

module.exports = router;