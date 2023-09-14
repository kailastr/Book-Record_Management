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


module.exports = router; //this is a default export(only exports single thing). if we want to export multiple things we could send as { object }
