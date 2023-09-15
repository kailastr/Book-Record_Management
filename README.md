This is a Book Record Management API Backend for management of records of books


#Routes and Endpoints

/Users :
    ✅POST : Create a new User 
    ✅GET : Get all users 

/Users/{id} :  
    ✅GET : Get a User details based on id 
    ✅PUT : Update a user details based on id
    ✅DELETE : Delete a user by id (only after all buyed     books are returned with/without fine)

/Users/Subscription-details/{id}
    ✅GET : Get a users subscription details
    1. Date of Subscriptiion
    2. Valid till
    3. Fine (if any)

/books
    ✅GET : Get all details of books
    ✅POST : Create a new book to the system

/books/{id}
    ✅GET : Get a book by id
    ✅PUT : Update a book by id

/books/issued/by-user
    ✅GET : Get all issued books

/books/issued/withFine
    ⭕GET : Get all issued books details with fine

#Subscription Type
    1. Basic (3 Months)
    2. Standard (6 Months)
    3. Premium (12 Months)
    //the dates are in the format of mm/dd/yyyy

#If a user misses the deadline for submitting a issued book then the fine for a book will be RS.100

#If a user misses the deadline for submitting a issued book and also the subsciption expires then the fine will be RS.200