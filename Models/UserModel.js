const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    issuedBook: {
        type: mongoose.Schema.Types.ObjectId, //it checks that the id is valid
        ref: "Book", //this will ensures that the id belongs to the books collection
        required: false
    },
    returnDate: {
        type: String,
        required: false
    },
    subscriptionDate: {
        type: String,
        required: true
    },
    subscriptionType: {
        type: String,
        required: true
    }

},
    {
        timestamps: true, //if all the above fields are created successfully then the timestamp will be automatically generated
    });

//to create a model based on the above schema
module.exports = mongoose.model("User", UserSchema);