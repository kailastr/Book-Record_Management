const express = require("express");

const app = express();

const port = 8080;
//http://localhost:8080

app.use(express.json()); //to run our server using json only

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running"
    });
});

app.get("*", (req, res) => {
    res.status(404).json({
        message: "Route does not exist !!"
    })
});

app.listen(port, () => {
    console.log(`The server is running in the port ${port}`);
});