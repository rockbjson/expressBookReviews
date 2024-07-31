const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(
        (user) => user.username === username && user.password === password
      );
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    return users.some(
        (user) => user.username === username && user.password === password
      );
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const review = req.body.review; // string
    const isbn = req.params.isbn;
    if (!review) {
      res.status(400).json({ message: "Review is empty!" });
    } else {
      books[isbn].reviews[user] = review;
      res.status(200).json({ message: "Book review updated." });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const user = req.session.authorization.username;
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        res.status(400).json({ message: "invalid ISBN." });
    } else if (!books[isbn].reviews[user]) {
        res
        .status(400)
        .json({ message: `${user} hasn't submitted a review for this book.` });
    } else {
        delete books[isbn].reviews[user];
        res.status(200).json({ message: "Book review deleted." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
