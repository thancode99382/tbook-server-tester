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
    throw new Error(createBookError)
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
  } catch (createChapterError) {
    throw new Error(createChapterError)
  }
}

const GetBookAllService = async () => {
  try {
    const getBookAll = await db.Book.findAll({ 
      include: { model: db.Chapter, as: 'chapters' }  
    });
    return {
      EM: "get all successfully",
      DT: getBookAll
    }
  } catch (getBookAllError) {
    throw new Error(getBookAllError)
  }
}

const GetBookOnlyService = async(id) => {
  try {
    const getBookOnly = await db.Book.findOne({ where: { id } ,
      include: { model: db.Chapter, as: 'chapters' }  
    });
    return {
        EM: "get book only successfully",
      DT: getBookOnly
    }
  } catch (getBookOnlyError) {
    throw new Error(getBookOnlyError)
  }
}

const DeleteBookService = async (bookId) => {
  try {
    const deleteBook = await db.Book.destroy({
      where: { id: bookId },
    });
    return {
      EM: "oke",
      DT: deleteBook
    }    
  } catch (deleteBookError) {
    throw new Error(deleteBookError)
  }
}

const UpdateBookService = async (bookId, newTitle) => {
  try {
    const newbook = await db.Book.findOne({
      where: {id: bookId}
    })
    if (!newbook) throw new Error("Not Found Book")

    newbook.title = newTitle
    await newbook.save()

    return {
      ME: "Oke",
      DT: newbook
    }
  } catch (updateBookError) {
    return {
      ME: "Err",
      DT: updateBookError
    }
  }
}

module.exports = { CreateBookAndChapter, GetBookAllService, GetBookOnlyService, DeleteBookService, UpdateBookService }