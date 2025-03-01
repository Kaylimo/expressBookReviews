const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    const review = req.body.review;

    if (books[isbn]?.reviews[username]) {
        books[isbn].reviews[username] = review;
        res.status(202).send(`Review of user ${username} for book with isbn ${isbn} successfully updated`);
    }
    else if (books[isbn]) {
        books[isbn].reviews[username] = review;
        res.status(201).send(`Review of user ${username} for book with isbn ${isbn} successfully created`);
    }
    else res.status(404).json({ message: `No book with isbn ${isbn}` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    if (books[isbn]?.reviews[username]) {
        delete books[isbn].reviews[username];
        res.status(202).send(`Review of user ${username} for book with isbn ${isbn} successfully deleted`);
    }
    else {
        res.status(404).json({ message: `No review by user ${username} for book with isbn ${isbn}`});
    }    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
