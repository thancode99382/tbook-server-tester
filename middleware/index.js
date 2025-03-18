const { createJWT, verifyToken ,isAdmin } = require("./JWTAction");

module.exports = {
  createJWT,
  verifyToken,
  isAdmin
};
