const express = require('express');
const cors = require('cors');
// const http = require('http');
// const morgan = require('morgan');
const PORT = 5000;
const HOSTNAME = 'localhost';


const app = express();

// Middleware
app.use(express.json()); //req.body
app.use(cors());
// app.use(morgan('dev'));


// ROUTES
// register and login routes
app.use("/auth", require('./routes/jwtAuth'));

// dashboard
app.use("/dashboard", require('./routes/dashboard'));

// clients
app.use("/clients", require('./routes/clients'));

app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`)
});
