const { cloudinary } = require('../config/cloudinary.connect')
const fs = require('fs')
const db = require('../models/index')
const { CreateBookAndChapter, GetBookAllService, GetBookOnlyService, DeleteBookService, UpdateBookService } = require("../service/bookService/bookService")

const createBook = async (req, res) => {
  try {
    console.log("File received:", req.file);
    console.log("Book data received:", req.body.bookdata);
    console.log("Chapters received:", req.body.chapters);
    
    // Parse the JSON data
    const bookData = JSON.parse(req.body.bookdata);
    const listChapter = JSON.parse(req.body.chapters);
    
    let imageUrl = null;
    
    // Check if a file was uploaded
    if (req.file) {
      // Upload image to cloudinary
      try {
        const uploadImage = await cloudinary.uploader.upload(req.file.path, { folder: 'uploads' });
        imageUrl = uploadImage.secure_url;
        
        // Clean up the temporary file after upload
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "Failed to upload book image", error: error.message });
      }
    }
    
    // Create book and chapters in the database with the image URL (or null if no image)
    await CreateBookAndChapter(bookData, listChapter, imageUrl);

    return res.status(200).json({ message: "Book created successfully" });
  } catch (error) {
    console.error("Error in createBook:", error);
    return res.status(500).json({ message: "Failed to create book", error: error.message });
  }
}

const getBookAll = async (req, res) => {
  try {
    const result = await GetBookAllService()
    return res.json({EM: result.EM, DT: result.DT})
  } catch (error) {
    return res.status(500).json({EM: error})
  }
}

const getBookOnly = async (req, res) => {
  try {
    const result = await GetBookOnlyService()
    return res.json({
      EM: "oke",
      DT: result
    })
  } catch (error) {
    return res.status(500).json({
      EM: "error",
      DT: error
    })
  }
}

const deleteBook = async (req, res) => {
  console.log(req.body.bookId);
  const bookId = req.body.bookId
  try {
    const result = await DeleteBookService(bookId)
    return res.json({
      EM: result.EM,
      DT: result.DT
    })
  } catch (error) {
    return res.status(500).json({error: error})
  }
}

const updateBook = async (req, res) => {
  const bookId = req.body.bookId
  const newTitle = req.body.title
  try {
    const processUpdate = await UpdateBookService(bookId, newTitle)
    return res.json({ ME: processUpdate.ME, DT: processUpdate.DT })
  } catch (updateBookError) {
    return res.status(500).json({ ME: "Error", DT: updateBookError })
  }
}

module.exports = { createBook, getBookAll, getBookOnly, deleteBook, updateBook}