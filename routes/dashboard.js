const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get("/", authorization, async (req, res) => {
  try {

    const user = await pool.query('SELECT username, email FROM users WHERE user_id = $1;', [req.user_id]);
    res.json(user.rows[0]);

  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
})

module.exports = router;