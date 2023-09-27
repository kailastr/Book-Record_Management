
const { UserModel, BookModel } = require("../Models");

exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find();

    if (users.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Users not found"
        });
    }

    res.status(200).json({
        success: true,
        data: users
    });
};

exports.getSingleUserById = async (req, res) => {
    const { id } = req.params; //to store the parameter value in the request to a id variable
    const user = await UserModel.findById(id); //to find if the given user id exist on the users data

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
};

exports.createNewUser = async (req, res) => {
    // const { name, surname, email, subscriptionType, subscriptionDate } = req.body;
    // const newUser = await UserModel.create({
    //     name,
    //     surname,
    //     email,
    //     subscriptionType,
    //     subscriptionDate,
    // });  --------------------using this method of inserting new data may cause difficulty when we want new fiels to be added in the users section we need to update this section instead we could pass the datas inside an object

    const { data } = req.body;

    const newUser = await UserModel.create(data);

    return res.status(201).json({
        success: true,
        data: newUser
    });
}

exports.updateUserById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const updatedUserData = await UserModel.findOneAndUpdate(
        { _id: id },
        { $set: { ...data } }, //the set function helps us to update the data variable in the users datas
        { new: true }
    );

    return res.status(201).json({
        success: true,
        message: updatedUserData
    });
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.deleteOne({ _id: id });

    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found with the given id"
        });
    }

    return res.status(202).json({
        success: true,
        message: "User Deleted successfully"
    });
};

exports.getSubscriptionDetailsById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);

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
        ...user._doc, //to mix all the user data in the data object
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
}