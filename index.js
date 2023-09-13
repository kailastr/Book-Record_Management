const express = require("express");

const { users } = require('./data/users.json'); //importing JSON data

const app = express();

const port = 8080;
//http://localhost:8080

app.use(express.json()); //to run our server using json only

app.get("/", (req, res) => {
    res.status(200).json({ //instead of send we could use json to send multiple lines of responces
        message: "Server is up and running"
    });
});

/*
Route : /users
Methos : GET
Description : Get all users
Access : Public
Parameter : None
*/
app.get('/users', (req, res) => {
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
app.post('/users', (req, res) => {
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
app.put('/users/:id', (req, res) => {
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
app.delete("/users/:id", (req, res) => {
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
app.get('/users/:id', (req, res) => {
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

app.get("*", (req, res) => {
    res.status(404).json({
        message: "Route does not exist !!"
    })
});

app.listen(port, () => {
    console.log(`The server is running in the port ${port}`);
});