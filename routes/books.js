const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json"); //importing users data to check the issued books

const { UserModel, BookModel } = require("../Models"); //to import modals from the models/index
const { GetAllBooks, GetSingleBooksById, getAllIssuedBooks, addNewBook, updateBookById } = require("../controllers/BooksController");


const router = express.Router();

/*
Route : /Books
Methos : GET
Description : GET all books
Access : Public
Parameter : None
*/
router.get("/", GetAllBooks);

/*
Route : /Books/id
Methos : GET
Description : GET book by id
Access : Public
Parameter : id
*/
router.get("/:id", GetSingleBooksById);

/*
Route : /books/issued/books
Methos : GET
Description : GET all issued books
Access : Public
Parameter : none
*/
//since passing only one parameter lead to go to the above route and it will misslead this route for that we should add an extra parameter with the url
router.get("/issued/by-user", getAllIssuedBooks);

/*
Route : /books
Methos : POST
Description : Create new book
Access : Public
Parameter : none
data : author, name, genre, price, publisher, id
*/
router.post("/", addNewBook);

/*
Route : /books/id
Methos : PUT
Description : Update a book
Access : Public
Parameter : id
data : author, name, genre, price, publisher, id
*/
router.put("/:id", updateBookById);

/*
Route : /books/issued/withFine
Methos : GET
Description : Get all issued books with fine
Access : Public
Parameter : none
*/
router.get("/issued/withFine", (req, res) => {
    const BooksIssuedUsers = users.filter((each) => each.issuedBook); //contains all the users which issued books

    if (BooksIssuedUsers.length === 0) {
        return res.status(404).json({
            message: "There are no books issued yet"
        });
    }

    const dateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        } else {
            date = new Date(data);
        }

        let days = Math.round(date / (1000 * 60 * 60 * 24));
        return days;
    };

    const UpdatedBooksWithFine = BooksIssuedUsers.map((value) => {
        let returDate = dateInDays(value.returnDate);
        let currentDate = dateInDays();
        value.BookReturnDateExceeded = returDate < currentDate;
        value.FineForBookReturnOnly = returDate < currentDate ? 100 : 0;

        return value;
    });

    return res.status(200).json({
        success: true,
        message: UpdatedBooksWithFine
    });
});

module.exports = router; //this is a default export(only exports single thing). if we want to export multiple things we could send as { object }
