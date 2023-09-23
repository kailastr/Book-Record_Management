const express = require("express"); //importing express
const dotenv = require("dotenv");

//const { users } = require('./data/users.json'); //importing JSON data

//creating the DB connection
const DBConnection = require("./databaseConnection");

//importing routes
const UsersRouter = require("./routes/users");
const BooksRouter = require("./routes/books");

dotenv.config();

const app = express();

//it is after the express app is executed we make our DB connection work
DBConnection();

const port = 8080;
//http://localhost:8080

app.use(express.json()); //to run our server using json only

app.get("/", (req, res) => {
    res.status(200).json({ //instead of send we could use json to send multiple lines of responces
        message: "Server is up and running"
    });
});

app.use("/users", UsersRouter); //while using a "/users" router then we should redirect it toward router/users.js file
app.use("/books", BooksRouter);


//----------------example for routing in the same page
// app.get('/users', (req, res) => {
//     res.status(200).json({
//         success: true,
//         data: users
//     });
// });

app.get("*", (req, res) => {
    res.status(404).json({
        message: "Route does not exist !!"
    })
});

app.listen(port, () => {
    console.log(`The server is running in the port ${port}`);
});