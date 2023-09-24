//here first we want to import the models
const { BookModel, UserModel } = require("../Models"); //if our exporting file name is index then it is not necessary to say the exact file name

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

exports.GetSingleBooksById = (req, res) => {
    const { id } = req.params;

    const book = books.find((each) => each.id === id);
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