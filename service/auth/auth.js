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

const registerNewUser = async (UserData) =>{
    try {
        const hashPassword = hashUserPassword(UserData.password);
        console.log("mã hoá password thành công");
        
        const newUser = await db.User.create({
            username: UserData.username,
            email: UserData.email,
            password: hashPassword,
        })
        console.log("Thêm users vào database thành công");

        let roles = UserData.roles || 'USER'
        const roleRecords = await db.Role.findAll({
            where: {
                name: roles,
            }
        })
        console.log("Lấy danh sách roles thành công");
        if (!roles) {
            throw new error("Not found roles")
        }else {
            newUser.addRoles(roleRecords)

        return {
            EM:'Create user successfully',
          }
        }
    } catch (error) {
        return {
            EM:`Create user successfully ${error}`,
        }
        
    }


}

const loginService = async (UserData) =>{
    try {
        const user = await db.User.findOne({
            where :{
                email:UserData.email
            }
        })

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
        
        if(user){
            const isCorrectPassword = checkPassword(UserData.password , user.password);
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
                        access_token: token ,
                        email:user.email,
                        usename:user.username,
                        userRoles  
                    }
                }

            }
        }


        return {
            EM:'login user successfully',
            
          }
    } catch (error) {
        return {
            EM:'login user failure',
            
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