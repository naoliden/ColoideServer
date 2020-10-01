module.exports = (req, res, next) => {

  const { client_name } = req.body;

  if (req.path === "/register") {
    if (![client_name].every(Boolean)) 
    {
      return res.status(400).json("Missing Credentials");
    } 
  }

  next();
};