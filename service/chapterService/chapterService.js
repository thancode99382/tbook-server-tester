const createHttpError = require("http-errors")
const db = require("../../models/index")

const CreateChapterService = async (title, content, bookId) => {
  const chapterData = {
    title: title,
    content: content,
    bookId: bookId
  }

  try {
    const newChapter = await db.Chapter.create(chapterData)
    return {
      EM: "Oke",
      DT: newChapter
    }
  } catch (createChapterError) {
    throw new Error(createChapterError)
  }
}

const UpdateChapterService = async (chapterId, newTitle, newContent, bookId) => {
  try {
    const newChapter = await db.Chapter.findOne({
      where: { id: chapterId }
    })
    if (!newChapter) {
      throw new Error("Not Found Chapter")
    }
    newChapter.title = newTitle
    newChapter.content = newContent
    newChapter.bookId = bookId

    newChapter.save()
    return {
      EM: "Oke",
      DT: newChapter
    }
    
  } catch (updateChapterError) {
    throw new Error(updateChapterError)
  }
}

const DeleteChapterService = async (chapterId) => {
  try {
    const DChapter = await db.Chapter.destroy({
      where: { id: chapterId }
    })
    return {
      EM: "Oke",
      DT: "Delete chapter successfully!!!"
    }
  } catch (deleteChapterError) {
    throw new Error(deleteChapterError)
  }
}

module.exports = { CreateChapterService, UpdateChapterService, DeleteChapterService }