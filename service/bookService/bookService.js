const db = require('../../models/index')

const CreateBookAndChapter = async (book, listChapter, bookUrl = null) => {
  const bookData = {
    ...book,
    imageUrl: bookUrl || null // Ensure null is used if bookUrl is falsy
  }
  let newbook
  try {
    newbook = await db.Book.create(bookData)
  } catch (createBookError) {
    return {
      EM: "Failed to create book",
      DT: createBookError.message
    }
  }
  
  try {
    // Check if listChapter is an array
    if (Array.isArray(listChapter)) {
      // Handle array format
      for (let i = 0; i < listChapter.length; i++) {
        const chapter = listChapter[i];
        const chapterData = {
          title: chapter.title,
          content: chapter.content,
          bookId: newbook.id
        }
        await db.Chapter.create(chapterData);
      }
    } else {
      // Handle original format with name1/content1, name2/content2, etc.
      const lengthChapterList = Object.keys(listChapter).length/2
      for (let i = 1; i <= lengthChapterList; i++) {
        const chapterData = {
          title: listChapter[`name${i}`],
          content: listChapter[`content${i}`],
          bookId: newbook.id
        }
        await db.Chapter.create(chapterData);
      }
    }
    
    return {
      EM: "Book and chapters created successfully",
      DT: newbook
    }
  } catch (createChapterError) {
    return {
      EM: "Failed to create chapters",
      DT: createChapterError.message
    }
  }
}

const GetBookAllService = async () => {
  try {
    const getBookAll = await db.Book.findAll({ 
      include: { model: db.Chapter, as: 'chapters' }  
    });
    return {
      EM: "Books retrieved successfully",
      DT: getBookAll
    }
  } catch (getBookAllError) {
    return {
      EM: "Failed to retrieve books",
      DT: getBookAllError.message
    }
  }
}

const GetBookOnlyService = async(id) => {
  try {
    const getBookOnly = await db.Book.findOne({ 
      where: { id },
      include: { model: db.Chapter, as: 'chapters' }  
    });
    
    if (!getBookOnly) {
      return {
        EM: "Book not found",
        DT: null
      }
    }
    
    return {
      EM: "Book retrieved successfully",
      DT: getBookOnly
    }
  } catch (getBookOnlyError) {
    return {
      EM: "Failed to retrieve book",
      DT: getBookOnlyError.message
    }
  }
}

const DeleteBookService = async (bookId) => {
  try {
    const deleteBook = await db.Book.destroy({
      where: { id: bookId },
    });
    
    return {
      EM: deleteBook > 0 ? "Book deleted successfully" : "Book not found",
      DT: deleteBook
    }    
  } catch (deleteBookError) {
    return {
      EM: "Failed to delete book",
      DT: deleteBookError.message
    }
  }
}

const UpdateBookService = async (bookId, newTitle) => {
  try {
    const newbook = await db.Book.findOne({
      where: {id: bookId}
    })
    
    if (!newbook) {
      return {
        EM: "Book not found",
        DT: null
      }
    }

    newbook.title = newTitle
    await newbook.save()

    return {
      EM: "Book updated successfully",
      DT: newbook
    }
  } catch (updateBookError) {
    return {
      EM: "Failed to update book",
      DT: updateBookError.message
    }
  }
}

module.exports = { CreateBookAndChapter, GetBookAllService, GetBookOnlyService, DeleteBookService, UpdateBookService }