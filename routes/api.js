const { login, readFunc, register, checkAdmin } = require("../controllers/authController");
const { isAdmin, isUser } = require('../middleware/JWTAction')
const express = require("express");
const multer = require("multer")
const { createBook, getBookAll, getBookOnly, deleteBook, updateBook } = require("../controllers/bookController")
const { createChapter, updateChapter, deleteChapter } = require("../controllers/chapter.controller")

const upload = multer({dest: "uploads/"})

const router = express.Router();
const apiRoutes = (app) => {
  // router.post("/register", apiController.handleRegister);
  // auth
  router.post("/login", login);
  router.post("/register", register);

  //books & chapter
  router.get("/user/read", isAdmin,readFunc);
  router.get("/books/all",getBookAll)
  router.get("/books/only", isUser, getBookOnly)
  router.get("/check/admin", checkAdmin)

  router.post("/book/create", isAdmin, upload.single("image"), createBook)
  router.post("/chapter/create", isAdmin, createChapter)

  router.put("/book/update", isAdmin, updateBook)
  router.put("/chapter/update", isAdmin, updateChapter)

  router.delete("/book/delete", isAdmin, deleteBook)
  router.delete("/chapter/delete", isAdmin, deleteChapter)

  return app.use("/api/v1", router);
};

module.exports = { apiRoutes };
