//here first we want to import the models
const { BookModel, UserModel } = require("../Models"); //if our exporting file name is index then it is not necessary to say the exact file name
const IssuedBook = require("../dtos/book.dto");

//instead of exporting all the functions at the last we could export at the time of creating a function
exports.GetAllBooks = async (req, res) => {
    const books = await BookModel.find(); //since this function may takes some time to load the data we could make this function asyc await

    if (books.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No books found !! "
        });
    }

    res.status(200).json({
        success: true,
        data: books
    });
};

exports.GetSingleBooksById = async (req, res) => {
    const { id } = req.params;

    const book = await BookModel.findById(id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found with this id !! "
        });
    }

    return res.status(201).json({
        success: true,
        message: book
    });
};

exports.getAllIssuedBooks = async (req, res) => {
    const users = await UserModel.find({ //inside find function we could even check for coditions
        issuedBook: { $exists: true }
    }).populate("issuedBook"); //what this populate function does is that since in our user model we refer the book Id to the books model here it could reach all the books details

    const issuedBooks = users.map((each) => new IssuedBook(each));

    if (issuedBooks.length == 0) {
        return res.status(404).json({ success: false, message: "No Book is issued yet " });
    }

    return res.status(202).json({ success: true, message: issuedBooks });
}