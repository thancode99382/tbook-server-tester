const {createJWT} = require('../../middleware')

const db = require('../../models/index')
const bcrypt = require('bcryptjs')
const { verifyToken } = require("../../middleware/JWTAction")

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};


const checkPassword = (inputPassword , hashPassword) =>{
    return bcrypt.compareSync(inputPassword,hashPassword)
}

const registerNewUser = async (UserData) => {
    try {
        // Check if user already exists
        const existingUser = await db.User.findOne({
            where: {
                email: UserData.email
            }
        });

        if (existingUser) {
            return {
                EM: "User already exists",
                DT: null
            };
        }

        // Hash password
        const hashPassword = hashUserPassword(UserData.password);
        console.log("mã hoá password thành công");
        
        // Create new user
        const newUser = await db.User.create({
            username: UserData.username,
            email: UserData.email,
            password: hashPassword,
        });
        console.log("Thêm users vào database thành công");

        // Assign roles
        let roles = UserData.roles || 'USER';
        const roleRecords = await db.Role.findAll({
            where: {
                name: roles,
            }
        });
        
        console.log("Lấy danh sách roles thành công");
        if (!roleRecords || roleRecords.length === 0) {
            return {
                EM: "Role not found",
                DT: null
            };
        } else {
            await newUser.addRoles(roleRecords);
            return {
                EM: "User registered successfully",
                DT: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    roles: roles
                }
            };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return {
            EM: `Registration failed: ${error.message}`,
            DT: null
        };
    }
}

const loginService = async (UserData) =>{
    try {
        const user = await db.User.findOne({
            where :{
                email:UserData.email
            }
        });

        if(!user) {
            return {
                EM: "User does not exist",
                DT: null
            };
        }

        const roleOfUser = await db.User.findOne( {
            where :{
                email:UserData.email
            },
            include: {
              model: db.Role,
              through: { attributes: [] }, 
            },
          });
          const userRoles = roleOfUser.Roles.map(role => role.dataValues.name);
        
        const isCorrectPassword = checkPassword(UserData.password, user.password);
        if(isCorrectPassword === true){
            const payload  = {
                email:user.email,
                username: user.username,
                userRoles                      
            }
            const token = createJWT(payload);
           
            return {
                EM: "login successfully",
                DT:{
                    access_token: token,
                    email:user.email,
                    usename:user.username,
                    userRoles  
                }
            }
        } else {
            return {
                EM: "wrong password",
                DT: null
            }
        }
    } catch (error) {
        return {
            EM: "Server error during login",
            DT: null
        };
    }
}

const CheckAdminService = async (token) => {
    try {
        const checkAdmin = verifyToken(token)
        
        if (checkAdmin.userRoles.includes('ADMIN')) {
            return {
                EM: "Oke",
                DT: "Is Admin"
            };
        } else {
            throw new Error("You not have role is ADMIN")
        }

    } catch (checkAdminError) {
        throw new Error("You not have role is ADMIN")
    }
}
module.exports = {
    registerNewUser,
    hashUserPassword,
    loginService,
    CheckAdminService
}