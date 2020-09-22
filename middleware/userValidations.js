module.exports = (req, res, next) => {

  const { email, firstname, password, user_type } = req.body;

  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/register") {
    console.log(!email.length);
    if (![email, firstname, password, user_type].every(Boolean)) 
    {
      return res.status(400).json("Missing Credentials");
    } 
    else if (!validEmail(email)) 
    {
      return res.status(400).json("Invalid Email");
    }

  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) 
    {
      return res.status(401).json("Missing Credentials");
    } 
    else if (!validEmail(email)) 
    {
      return res.status(401).json("Invalid Email");
    }
  }

  next();
};