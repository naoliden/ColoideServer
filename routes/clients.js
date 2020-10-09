const router = require('express').Router();
const pool = require('../db');
const clientValidations = require('../middleware/clientValidations');
const authorization = require('../middleware/authorization');


router.get("/", async (req, res) => {
  try {
    const clients = await pool.query("SELECT * FROM clients WHERE client_name != 'Independiente';");
    if (clients.rows.length > 0){
      return res.json(clients.rows);
    }
  } catch(err) {
    return res.status(500).send("Server Error");
  }
})


// DONE REGISTER CLIENT
router.post("/register", clientValidations, async (req, res) => {
  try {
    // step 1. destructure the request.body 
    const { client_name } = req.body;

    // step 2. Check if client exists. (if not throw error)
    const client = await pool.query("SELECT * FROM clients WHERE LOWER(client_name) = LOWER($1);", 
    [
      client_name
    ]);

    if(client.rows.length !== 0)
    {
      return res.status(403).json("Client already exists");
    } 

    // step 3. enter new client in db
    let new_client = await pool.query(
      "INSERT INTO clients (client_name) VALUES ($1) RETURNING *;",
      [
        client_name
      ]); 
    
    return res.json(new_client.rows[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});


// DONE DELETE CLIENT 
router.delete("/delete", authorization, async (req, res) => {
  try {
    // 1. destructure req.body
    const { client_id } = req.body;
    
    // 2. delete client
    const client = await pool.query("DELETE FROM clients WHERE client_id = $1;", [
      client_id
    ]);

    // 3. return something
    return res.json({ commmand: client.command, deleted: (client.rowCount == true) });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});

router.patch("/update", authorization, async (req, res) => {
  try {
    // 1. destructure req.body
    const { client_id, new_name } = req.body;
    
    // 2. delete client
    const client = await pool.query("UPDATE clients SET client_name=$1 WHERE client_id=$2  RETURNING *;", [
      new_name, client_id
    ]);

    // 3. return something
    return res.json(client.rows[0]);

  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});


router.patch("/add_user", authorization, async (req, res) => {
  try {
    const { user_id, client_id } = req.body;

    const query = await pool.query("UPDATE users SET client_id=$1 WHERE user_id=$2;", [
      client_id, user_id
    ]);

    return res.json(true);

  } catch (error) {
    console.log(error);
  }
})

module.exports = router;