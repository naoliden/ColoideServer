const router = require('express').Router();
const pool = require('../db');
const clientValidations = require('../middleware/clientValidations');
const authorization = require('../middleware/authorization');


router.get("/", async (req, res) => {
  try {
    const clients = await pool.query("SELECT * FROM clients;");
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
    const { name } = req.body;

    
    // step 2. Check if client exists. (if not throw error)
    const client = await pool.query("SELECT * FROM clients WHERE LOWER(name) = LOWER($1);", 
    [
      name
    ]);

    if(client.rows.length !== 0)
    {
      return res.status(401).json("Client already exists");
    } 

    // step 3. enter new client in db
    let new_client = await pool.query(
      "INSERT INTO clients (name) VALUES ($1) RETURNING *;",
      [
        name
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
    const { name } = req.body;
    
    // 2. delete client
    const client = await pool.query("DELETE FROM clients WHERE LOWER(name) = LOWER($1);", [
      name
    ]);

    // 3. return something
    return res.json({ commmand: client.command, deleted: (client.rowCount == true), name });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json("Server error");
  }
});


module.exports = router;