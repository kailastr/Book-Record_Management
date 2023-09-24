const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
},
    {
        timestamps: true, //if all the above fields are created successfully then the timestamp will be automatically generated
    });

//to create a model based on the above schema
module.exports = mongoose.model("Book", BookSchema);