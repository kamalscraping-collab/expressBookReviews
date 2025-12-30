const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;

    // Validate input presence
    if (!username || !password) {
        // Distinguish missing fields
        const missing = [];
        if (!username) missing.push("username");
        if (!password) missing.push("password");
        return errorResponse(
        res, 400, "Missing required fields");
    }

    // Check if username already exists
    const exists = users.find(u => u.username === username);
    if (exists) {
        return errorResponse(res, 400, "Username already exists", { username });
    }
    const newUser = { username, password }; 
    users.push(newUser);

    return res.status(201).json({
        message: "User registered successfully",
    });

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(books[req.params.isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    for (num in books){
        let book = books[num];
        author = book['author'];
        if (author === req.params.author){
            res.send(book);
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    for (num in books){
        let book = books[num];
        title = book['title'];
        if (title === req.params.title){
            res.send(book);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]['review']);
});

module.exports.general = public_users;
