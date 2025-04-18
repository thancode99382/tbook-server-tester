const createHttpError = require("http-errors")
const db = require("../../models/index")

const CreateChapterService = async (title, content, bookId) => {
  const chapterData = {
    title: title,
    content: content,
    bookId: bookId
  }

  try {
    // Check if book exists
    const book = await db.Book.findByPk(bookId);
    if (!book) {
      return {
        EM: "Book not found",
        DT: null
      }
    }

    const newChapter = await db.Chapter.create(chapterData)
    return {
      EM: "Chapter created successfully",
      DT: newChapter
    }
  } catch (createChapterError) {
    return {
      EM: "Failed to create chapter",
      DT: createChapterError.message
    }
  }
}

const UpdateChapterService = async (chapterId, newTitle, newContent, bookId) => {
  try {
    const chapter = await db.Chapter.findOne({
      where: { id: chapterId }
    })
    
    if (!chapter) {
      return {
        EM: "Chapter not found",
        DT: null
      }
    }
    
    // Check if the book exists if bookId is provided and different
    if (bookId && bookId !== chapter.bookId) {
      const bookExists = await db.Book.findByPk(bookId);
      if (!bookExists) {
        return {
          EM: "Book not found",
          DT: null
        }
      }
    }
    
    // Update chapter fields if provided
    if (newTitle) chapter.title = newTitle;
    if (newContent) chapter.content = newContent;
    if (bookId) chapter.bookId = bookId;

    await chapter.save();
    
    return {
      EM: "Chapter updated successfully",
      DT: chapter
    }
  } catch (updateChapterError) {
    return {
      EM: "Failed to update chapter",
      DT: updateChapterError.message
    }
  }
}

const DeleteChapterService = async (chapterId) => {
  try {
    const deletedCount = await db.Chapter.destroy({
      where: { id: chapterId }
    });
    
    if (deletedCount === 0) {
      return {
        EM: "Chapter not found",
        DT: 0
      }
    }
    
    return {
      EM: "Chapter deleted successfully",
      DT: deletedCount
    }
  } catch (deleteChapterError) {
    return {
      EM: "Failed to delete chapter",
      DT: deleteChapterError.message
    }
  }
}

module.exports = { CreateChapterService, UpdateChapterService, DeleteChapterService }