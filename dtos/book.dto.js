//data transfer object
class IssuedBook {
    _id;
    name;
    genre;
    price;
    publisher;
    issuedBy;
    issuedDate;
    returnDate;
    //the above given variables are the list of elements/datas that should have to be stored using this class

    constructor(user) { //this constructor tells us that what particular data is to be stored inside the above variables and 'this' keyword specifies that the variable is inside this class itself
        this._id = user.issuedBook._id;
        this.name = user.issuedBook.name;
        this.genre = user.issuedBook.genre;
        this.price = user.issuedBook.price;
        this.publisher = user.issuedBook.publisher;
        this.issuedBy = user.issuedBook.issuedBy;
        this.issuedDate = user.issuedBook.issuedDate;
        this.returnDate = user.issuedBook.returnDate;
    }
}

module.exports = IssuedBook;