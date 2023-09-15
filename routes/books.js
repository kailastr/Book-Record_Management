const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json"); //importing users data to check the issued books

const router = express.Router();

/*
Route : /Books
Methos : GET
Description : GET all books
Access : Public
Parameter : None
*/
router.get("/", (req, res) => {
    res.status(202).json({
        success: true,
        data: books
    });
});

/*
Route : /Books/id
Methos : GET
Description : GET book by id
Access : Public
Parameter : id
*/
router.get("/:id", (req, res) => {
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
});

/*
Route : /books/issued/books
Methos : GET
Description : GET all issued books
Access : Public
Parameter : none
*/
//since passing only one parameter lead to go to the above route and it will misslead this route for that we should add an extra parameter with the url
router.get("/issued/by-user", (req, res) => {
    const userWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) {
            return each; //this if returns each users having issuedBook element
        }
    });

    const issuedBooksArr = [];

    userWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        //adding new elements to the books data to show the end user the details about the issued book
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooksArr.push(book); //adding all the details to a array which contain all the details of the issued book
    });

    if (issuedBooksArr.length == 0) {
        return res.status(404).json({ success: false, message: "No Book is issued yet " });
    }

    return res.status(202).json({ success: true, message: issuedBooksArr });
});

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

module.exports = router; //this is a default export(only exports single thing). if we want to export multiple things we could send as { object }
