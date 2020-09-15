const express = require('express');
const cors = require('cors');
// const http = require('http');
// const morgan = require('morgan');


const app = express();
const PORT = 5000;
const HOSTNAME = 'localhost'

// Middleware
app.use(express.json()); //req.body
app.use(cors());
// app.use(morgan('dev'));


// Routes



// register and login routes

app.use("/auth", require('./routes/jwtAuth'))


app.listen(PORT, HOSTNAME, () => {
  console.log(`Server is running on port ${PORT}`)
})
