const { CreateChapterService, UpdateChapterService, DeleteChapterService } = require("../service/chapterService/chapterService")
const { login } = require("./authController")

const createChapter = async (req, res) => {
  const title = req.body.title
  const content = req.body.content
  const bookId = req.body.bookId

  if (!title || !content || !bookId) {
    return res.status(400).json({
      EM: "Missing required fields",
      DT: null
    })
  }

  try {
    const processCreate = await CreateChapterService(title, content, bookId)
    
    if (processCreate.EM === "Book not found") {
      return res.status(404).json({
        EM: processCreate.EM,
        DT: null
      })
    }
    
    return res.status(201).json({ 
      EM: processCreate.EM, 
      DT: processCreate.DT
    })
  } catch (createChapterError) {
    return res.status(500).json({ 
      EM: "Server error", 
      DT: createChapterError.message 
    })
  }
}

const updateChapter = async (req, res) => {
  const chapterId = req.body.chapterId
  const newTitle = req.body.newtitle
  const newContent = req.body.newContent
  const bookId = req.body.bookId

  if (!chapterId) {
    return res.status(400).json({
      EM: "Missing chapter ID",
      DT: null
    })
  }

  try {
    const processUpdate = await UpdateChapterService(chapterId, newTitle, newContent, bookId)
    
    if (processUpdate.EM === "Chapter not found" || processUpdate.EM === "Book not found") {
      return res.status(404).json({
        EM: processUpdate.EM,
        DT: null
      })
    }
    
    return res.status(200).json({
      EM: processUpdate.EM,
      DT: processUpdate.DT
    })
  } catch (updateChapterError) {
    return res.status(500).json({
      EM: "Server error",
      DT: updateChapterError.message
    })
  }  
}

const deleteChapter = async (req, res) => {
  const chapterId = req.body.chapterId
  
  if (!chapterId) {
    return res.status(400).json({
      EM: "Missing chapter ID",
      DT: null
    })
  }
  
  try {
    const processDelete = await DeleteChapterService(chapterId)
    
    if (!processDelete || processDelete.DT === 0) {
      return res.status(404).json({
        EM: "Chapter not found",
        DT: null
      })
    }
    
    return res.status(200).json({ 
      EM: "Chapter deleted successfully",
      DT: processDelete.DT
    })
  } catch (deleteChapterError) {
    return res.status(500).json({
      EM: "Server error",
      DT: deleteChapterError.message || "Error deleting chapter"
    })
  }
}

module.exports = { createChapter, updateChapter, deleteChapter }