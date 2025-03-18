require("dotenv").config();

const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  const key = process.env.JWT_SECRET;

  let token = null;

  try {
    token = jwt.sign(payload, key, { expiresIn: "1h" });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  const key = process.env.JWT_SECRET;

  let decode = null;

  try {
    decode = jwt.verify(token, key);
  } catch (error) {
    throw new Error("verify token failed!!")
  }
  return decode;
};

const isAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: don't see token" });
    }

    const token = authHeader.split(" ")[1];
    const decode = verifyToken(token);
    
    if (!decode.userRoles.includes('ADMIN')) {
      return res.status(403).json({ message: "Forbidden: No ADMIN role" });
    }

    next()
  } catch (error) {
    return res.status(500).json({ EM: "failed", Data: error })
  }
};

const isUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: don't see token" });
    }

    const token = authHeader.split(" ")[1];
    const decode = verifyToken(token);
    
    if (!decode.userRoles.includes('USER')) {
      return res.status(403).json({ message: "Forbidden: No USER role" });
    }

    next()
  } catch (error) {
    return res.status(500).json({ EM: "failed", Data: error })
  }
};

module.exports = {
  verifyToken,
  createJWT,
  isAdmin,
  isUser
};
