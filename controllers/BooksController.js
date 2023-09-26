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

exports.addNewBook = async (req, res) => {
    {
        const { data } = req.body;

        if (!data) { //to check if the body of new data of the book is empty
            return res.status(404).json({
                success: false,
                message: "No data provided !!"
            });
        }

        //since here we are creating a new data here it is not like the above routes. ie; we dont need to save the await responce in a variable 
        await BookModel.create(data); //by using "data" inside the create function it will create new object based on the "data" object

        //after creating the new data now we could call all books details to a variable
        const allBooks = await BookModel.find();

        return res.status(201).json({
            success: true,
            data: allBooks
        });
    }
}

exports.updateBookById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const updatedBook = await BookModel.findOneAndUpdate( //the three parameters represents three functionality of the function
        {
            _id: id //this first parameter represents based on which data should we match the object to be updated
        },
        data, //this second para represents the new data to be updates
        {
            new: true //this parameter helps to return the new updated object
        }
    )

    return res.status(200).json({
        success: true,
        data: updatedBook
    });
}