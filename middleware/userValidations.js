module.exports = (req, res, next) => {

  const { email, firstname, password, user_type, user_id, new_password } = req.body;

  const validEmail = (userEmail) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  const validUserType = user_type => {
    return ["admin", "client", "collector"].includes(user_type);
  }

  const validPassword = pass => {
    return (pass.length >= 8);
  }

  if (req.path === "/register") {
    if (![email, firstname, password, user_type].every(Boolean)) 
    {
      return res.status(400).json("Missing Credentials");
    } 
    else if (!validEmail(email)) 
    {
      return res.status(400).json("Invalid Email");
    }
    else if (!validPassword(password))
    {
      return res.status(400).json("Password is too short");
    }
    else if (!validUserType(user_type))
    {
      return res.status(400).json('user_type must be "admin", "client" or "collector"');
    }

  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) 
    {
      return res.status(400).json("Missing Credentials");
    } 
    else if (!validEmail(email)) 
    {
      return res.status(400).json("Invalid Email");
    }
  
  } else if (req.path === "/changepass") {
    if (![user_id, new_password].every(Boolean)) 
    {
      return res.status(400).json("Missing Credentials");
    } 
    else if ((user_id !== 1) && (!validPassword(new_password))) 
    {
      return res.status(400).json("Password must be longer than 8 characters");
    }
  }

  next();
};