//to connect our server to the DB we need mongoose package
const mongoose = require("mongoose");

function DBConnection() { //create a fn to connect to the DB
    const DB_URL = process.env.MONGO_URI; //inside the function 1st thing we want is our url

    mongoose.connect(DB_URL, { //to create connection using the url
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    //after creating the connection we need to save details about the connection
    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "Connection Error !! ")); //on() works all the time and here finds out the time when error occurs and shows us
    db.once("open", function () { //once() only works once and shows us the connection message
        console.log("DB Connected ");
    });
}

module.exports = DBConnection; // by exporting this fn we could call this fn when ever we want the DB connection