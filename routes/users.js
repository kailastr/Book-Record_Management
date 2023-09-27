const express = require("express");

//since it is from here all the users.json values are accessed we should have to import "users.json" here
const { users } = require("../data/users.json");
const { getAllUsers, getSingleUserById, deleteUser, updateUserById, createNewUser, getSubscriptionDetailsById } = require("../controllers/UsersController");

//since this base acts as a router for /users, we should have to import a router fn in this page using express
const router = express.Router();


/*
Route : /users //since from the index.js file the routes to here are directed based on the /users path we dont have to mention the path again here.
Methos : GET
Description : Get all users
Access : Public
Parameter : None
*/
router.get('/', getAllUsers);

/*
Route : /users
Methos : POST
Description : Create new user
Access : Public
Parameter : None
*/
router.post('/', createNewUser);

/*
Route : /users/:id
Methos : PUT
Description : Update user details
Access : Public
Parameter : id
*/
router.put('/:id', updateUserById);

/*
Route : /users/:id
Methos : DELETE
Description : Delete user by id
Access : Public
Parameter : id
*/
router.delete("/:id", deleteUser);

/*
Route : /users/id
Methos : GET
Description : Get user based on id
Access : Public
Parameter : id
*/
router.get('/:id', getSingleUserById);

/*
Route : /users/subscription-details/:id
Methos : GET
Description : get all users subscription details
Access : Public
Parameter : id
*/
router.get("/subscription-details/:id", getSubscriptionDetailsById);


//to import this router page in the main index.js file we should have to export this file's routing functions from here for that
module.exports = router;  //it is using the variable "router" we have created all the routings 
