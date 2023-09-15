const express = require("express");

//since it is from here all the users.json values are accessed we should have to import "users.json" here
const { users } = require("../data/users.json");

//since this base acts as a router for /users, we should have to import a router fn in this page using express
const router = express.Router();


/*
Route : /users //since from the index.js file the routes to here are directed based on the /users path we dont have to mention the path again here.
Methos : GET
Description : Get all users
Access : Public
Parameter : None
*/
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    });
});

/*
Route : /users
Methos : POST
Description : Create new user
Access : Public
Parameter : None
*/
router.post('/', (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

    const user = users.find((each) => each.id === id);
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User already exist in the given id !!"
        });
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    });

    return res.status(201).json({
        success: true,
        data: users
    })
});

/*
Route : /users/:id
Methos : PUT
Description : Update user details
Access : Public
Parameter : id
*/
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const user = users.find((each) => each.id === id);

    if (!user)
        return res.status(404).json({ success: false, message: "user not found" });

    //to udpate a user data first we should have to make a copy of that user data using "map()"
    const UpdateUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each, //it will contain the old data 
                ...data  //this will contain the new data to be updated
            }
        }
        return each;
    });

    return res.status(201).json({
        success: true,
        message: UpdateUser
    });
});

/*
Route : /users/:id
Methos : DELETE
Description : Delete user by id
Access : Public
Parameter : id
*/
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found with the given id"
        });
    }

    const index = users.indexOf(user); //we could get the index of the element to be deleted
    users.splice(index, 1); //splice(delete) the element having "index" array index and only delete 1 element

    return res.status(202).json({
        success: true,
        message: users
    });
});

/*
Route : /users/id
Methos : GET
Description : Get user based on id
Access : Public
Parameter : id
*/
router.get('/:id', (req, res) => {
    const { id } = req.params; //to store the parameter value in the request to a id variable
    const user = users.find((each) => each.id === id); //to find if the given user id exist on the users data
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: user
    })
});

/*
Route : /users/subscription-details/:id
Methos : GET
Description : get all users subscription details
Access : Public
Parameter : id
*/
router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found !!"
        });
    }

    const getDateInDays = (data = "") => { //function to get the number of days of the subscription
        let date;
        if (data === "") {
            date = new Date(); //"new Date()" gives the exact current date with time in the format of mm/dd/yyyy
        } else {
            date = new Date(data); //getting date based on the data variable
        }

        let days = Math.floor(date / (1000 * 60 * 60 * 24)); //this calculations are done to get the number of days with comparing to the date
        return days;
    };

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "Standard") {
            date = date + 180;
        } else if (user.subscriptionType === "Premium") {
            date = date + 360;
        }
        return date;
    };

    //subscription expiration calculation
    //the calculations using subscriptionType() method is calculated from Jan 1 1970-UTC and to convert the millisec to numeric value we are multiplying it with 1000 (* sec* mins *hrs)
    let returnDate = getDateInDays(user.returnDate); //gives a number (something like 1238 after the "subscriptionType()" method calculation) from 1 Jan 1970 to the returDate
    let currentDate = getDateInDays(); //gives a number from 1 Jan 1970 to the current date
    //if currentDate-returnedDate = -ve it means the date of submission of the book have exceeded the limit. ie; if the returnDate is greater than currentDate it means the returnedDate have exceeded the limit of submission
    let subscriptionDate = getDateInDays(user.subscriptionDate); //to get the subscription date
    let subscriptionExpiry = subscriptionType(subscriptionDate); //if we get the subscription date we could calculate the date of expiry using the fn "subscriptionType()"
    //if we calculate subscriptionExpiry with currentDate, we could understand that if the subscription have expired or not

    const data = {
        ...user, //to mix all the user data in the data object
        subscriptionExpired: subscriptionExpiry < currentDate, //true means subscription have expired and wiseversa
        daysLeftForExpiration: subscriptionExpiry <= currentDate ? 0 : subscriptionExpiry - currentDate, //if current date is greater than subscription Expiry then day left for expiry is 0(ie; already expired). If else the days left for expiry is calculated
        Fine:
            returnDate < currentDate //this outer condition checks that if the book's returnDate is lesser than current date, if yes it goes to the inner condition and also checks for if the subscription also expired or not and if the returnDate of the book is greater than current date then the fine is 0
                ?
                subscriptionExpiry <= currentDate
                    ? 200
                    : 100
                : 0
    };

    res.status(200).json({
        success: true,
        message: data
    });
});




//to import this router page in the main index.js file we should have to export this file's routing functions from here for that
module.exports = router;  //it is using the variable "router" we have created all the routings 
