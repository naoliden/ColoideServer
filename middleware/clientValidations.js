module.exports = (req, res, next) => {

  const { name } = req.body;

  if (req.path === "/register") {
    if (![name].every(Boolean)) 
    {
      return res.status(400).json("Missing Credentials");
    } 
  }

  next();
};