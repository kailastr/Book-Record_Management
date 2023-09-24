const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json"); //importing users data to check the issued books

const { UserModel, BookModel } = require("../Models"); //to import modals from the models/index
const { GetAllBooks, GetSingleBooksById, getAllIssuedBooks } = require("../controllers/BooksController");


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
router.post("/", (req, res) => {
    const { data } = req.body;

    if (!data) { //to check if the body of new data of the book is empty
        return res.status(404).json({
            success: false,
            message: "No data provided !!"
        });
    }

    const book = books.find((each) => each.id === data.id);
    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book already exist with the same id"
        });
    }

    const allBooks = [...books, data]; //here the books array is spreaded in this array and we additionally added a new array element of data

    return res.status(201).json({
        success: true,
        data: allBooks
    });

});

/*
Route : /books/id
Methos : PUT
Description : Update a book
Access : Public
Parameter : id
data : author, name, genre, price, publisher, id
*/
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(400).json({
            success: false,
            message: "Book with the given id doest found"
        });
    }

    const updateData = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...data }
        }
        return each;
    });

    return res.status(200).json({
        success: true,
        data: updateData
    });
});

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
