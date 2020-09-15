const Pool = require('pg').Pool;

const pool = new Pool({
  user: "norm",
  password: "321654987",
  host: "localhost",
  port: 5432,
  database: "coloide"
});


module.exports = pool;