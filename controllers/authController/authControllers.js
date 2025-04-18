const { registerNewUser,loginService, CheckAdminService } = require("../../service/auth");

const login = async (req, res) => {
  try {
    const data = await loginService(req.body);
    
    // Check if login failed
    if (data.EM.includes("not exist") || data.EM.includes("wrong password")) {
      return res.status(401).json({
        EM: data.EM,
        DT: null
      });
    }
    
    return res.status(200).json({
      EM: data.EM,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Server error",
      DT: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    // Check for required fields
    if (!req.body.username || !req.body.password || !req.body.email) {
      return res.status(400).json({
        EM: "Missing required fields",
        DT: null
      });
    }
    
    const data = await registerNewUser(req.body);
    
    // Handle specific error cases with appropriate status codes
    if (data.EM === "User already exists") {
      return res.status(409).json({
        EM: data.EM,
        DT: null
      });
    }
    
    if (data.EM === "Role not found") {
      return res.status(400).json({
        EM: data.EM,
        DT: null
      });
    }
    
    if (data.EM.includes("failed")) {
      return res.status(400).json({
        EM: data.EM,
        DT: null
      });
    }
    
    // Return 201 Created for successful registration
    return res.status(201).json({
      EM: data.EM,
      DT: data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Server error",
      DT: error.message
    });
  }
};

const readFunc = (req, res) => {
  return res.status(200).send("Hello cac ban");
};

const checkAdmin = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ 
        EM: "Unauthorized: Missing or invalid token", 
        DT: null 
      });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const processCheckAdmin = await CheckAdminService(token);
    
    // If not admin, return forbidden status
    if (!processCheckAdmin.DT) {
      return res.status(403).json({
        EM: "Forbidden: User is not an admin",
        DT: null
      });
    }
    
    return res.status(200).json({
      EM: processCheckAdmin.EM,
      DT: processCheckAdmin.DT
    });
  } catch (checkAdminError) {
    return res.status(500).json({ 
      EM: "Server error", 
      DT: checkAdminError.message 
    });
  }
}

module.exports = {
  login,
  readFunc,
  register,
  checkAdmin
};
