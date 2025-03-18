const { CreateChapterService, UpdateChapterService, DeleteChapterService } = require("../service/chapterService/chapterService")
const { login } = require("./authController")

const createChapter = async (req, res) => {
  const title = req.body.title
  const content = req.body.content
  const bookId = req.body.bookId

  try {
    const processCreate = await CreateChapterService(title, content, bookId)
    return res.json({ EM: processCreate.EM, DT: processCreate.DT})
  } catch (createChapterError) {
    return res.status(500).json({ ME: "Err", DT: createChapterError })
  }
}

const updateChapter = async (req, res) => {
  const chapterId = req.body.chapterId
  const newTitle = req.body.newtitle
  const newContent = req.body.newContent
  const bookId = req.body.bookId

  try {
    const processUpdate = await UpdateChapterService(chapterId, newTitle, newContent, bookId)
    return res.json({EM: processUpdate.EM, DT: processUpdate.DT})
  } catch (updateChapterError) {
    return res.status(500).json({EM: "Err", DT: updateChapterError})
  }  
}

const deleteChapter = async (req, res) => {
  const chapterId = req.body.chapterId
  console.log(chapterId);
  
  try {
    const processDelete = await DeleteChapterService(chapterId)
    return res.json({ 
      EM: processDelete.EM,
      DT: processDelete.DT
     })
  } catch (deleteChapterError) {
    return res.status(500).json({
      EM: "Err",
      DT: "Error DeleteChapterService"
    })
  }


}
module.exports = { createChapter, updateChapter, deleteChapter }