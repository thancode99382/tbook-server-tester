const { cloudinary } = require('../config/cloudinary.connect')
const fs = require('fs')
const db = require('../models/index')
const { CreateBookAndChapter, GetBookAllService, GetBookOnlyService, DeleteBookService, UpdateBookService } = require("../service/bookService/bookService")

const createBook = async (req, res) => {
  try {
    console.log("Book data received:", req.body.bookdata);
    console.log("Chapters received:", req.body.chapters);
    
    // Validate required fields
    if (!req.body.bookdata || !req.body.chapters) {
      return res.status(400).json({
        EM: "Missing required book data or chapters",
        DT: null
      });
    }
    
    // Process the JSON data
    let bookData, listChapter;
    
    // Handle both string JSON and direct JSON object formats
    try {
      // Check if data is already parsed or needs parsing
      bookData = typeof req.body.bookdata === 'string' ? JSON.parse(req.body.bookdata) : req.body.bookdata;
      listChapter = typeof req.body.chapters === 'string' ? JSON.parse(req.body.chapters) : req.body.chapters;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return res.status(400).json({ 
        EM: "Invalid JSON format", 
        DT: null 
      });
    }
    
    // Validate book data
    if (!bookData.title) {
      return res.status(400).json({
        EM: "Book title is required",
        DT: null
      });
    }
    
    // Set image URL to a default value - in this case just "okok"
    // You can modify this to handle actual image uploads if needed
    const imageUrl = "okok";

    // Create book and chapters in the database
    const result = await CreateBookAndChapter(bookData, listChapter, imageUrl);
    
    // Handle different error cases from the service
    if (result.EM === "Failed to create book") {
      return res.status(400).json({
        EM: result.EM,
        DT: result.DT
      });
    }
    
    if (result.EM === "Failed to create chapters") {
      return res.status(400).json({
        EM: result.EM,
        DT: result.DT
      });
    }
    
    // Success case
    return res.status(201).json({ 
      EM: result.EM,
      DT: result.DT
    });
  } catch (error) {
    console.error("Error in createBook:", error);
    return res.status(500).json({ 
      EM: "Server error", 
      DT: error.message 
    });
  }
}

const getBookAll = async (req, res) => {
  console.log("oke");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await GetBookAllService(page, limit)
    return res.json({EM: result.EM, DT: result.DT, totalPages: result.totalPages})
  } catch (error) {
    return res.status(500).json({EM: error})
  }
}

const getBookOnly = async (req, res) => {
  const id = req.params.id

  try {
    const result = await GetBookOnlyService(id)
    if (!result.DT) {
      return res.status(404).json({
        EM: "Book not found",
        DT: null
      })
    }
    return res.status(200).json({
      EM: result.EM,
      DT: result.DT
    })
  } catch (error) {
    return res.status(500).json({
      EM: "Server error",
      DT: error.message
    })
  }
}

const deleteBook = async (req, res) => {
  console.log(req.params.id); // Debug xem ID nhận đúng chưa
  const bookId = req.params.id; // Lấy đúng param từ URL

  try {
    const result = await DeleteBookService(bookId);
    if (result.DT === 0) {
      return res.status(404).json({
        EM: "Book not found",
        DT: result.DT
      });
    }
    return res.status(200).json({
      EM: "Book deleted successfully",
      DT: result.DT
    });
  } catch (error) {
    console.error("Error in deleteBook:", error);
    return res.status(500).json({ 
      EM: "Server error", 
      DT: error.message 
    });
  }
}

const updateBook = async (req, res) => {
  const bookId = req.body.bookId
  const newTitle = req.body.title
  
  if (!bookId || !newTitle) {
    return res.status(400).json({ 
      EM: "Missing required fields", 
      DT: null 
    });
  }
  
  try {
    const processUpdate = await UpdateBookService(bookId, newTitle)
    
    if (processUpdate.EM === "Book not found") {
      return res.status(404).json({ 
        EM: processUpdate.EM, 
        DT: null 
      });
    }
    
    return res.status(200).json({ 
      EM: processUpdate.EM, 
      DT: processUpdate.DT 
    });
  } catch (updateBookError) {
    return res.status(500).json({ 
      EM: "Server error", 
      DT: updateBookError.message 
    });
  }
}

module.exports = { createBook, getBookAll, getBookOnly, deleteBook, updateBook}