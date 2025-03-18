const { registerNewUser,loginService, CheckAdminService } = require("../../service/auth");

const login = async (req, res) => {

  try {
    const data = await loginService(req.body);
    return res.status(200).json({
      EM: data.EM,
      DT:data.DT
    });
  } catch (error) {
    return res.status(500).json({
      EM: data.EM,
    });
  }
};

const register = async (req, res) => {
  const data = await registerNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
    });
};

const readFunc = (req, res) => {
  return res.send("Hello cac ban");
};

const checkAdmin = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: don't see token" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const processCheckAdmin = await CheckAdminService(token)
    return res.json({
      EM: processCheckAdmin.EM,
      DT: processCheckAdmin.DT
    })
  } catch (checkAdminError) {
    return res.status(500).json({ EM: "Err", DT: checkAdminError })
  }
}

module.exports = {
  login,
  readFunc,
  register,
  checkAdmin
};
