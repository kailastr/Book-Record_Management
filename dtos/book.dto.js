
class IssuedBook {
    _id;
    name;
    genre;
    price;
    publisher;
    issuedBy;
    issuedDate;
    returnDate;

    constructor(user) {
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