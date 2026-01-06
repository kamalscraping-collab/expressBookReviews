const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });
    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.query.username;
    const book = books[isbn];
    const bookReviews = book.reviews;

    if (!book){
        res.send(`Book with isbn ${isbn} not found!`)
    } else if (!username || !review){
        res.send('Review or username not provided. Please provide a username and review')
    } else{

        const userReview = bookReviews.find(rev => rev.username === username);
        // Update review if user has already provided a review
        if (userReview){
            userReview.review = review;
            res.send(`${username} has updated the provided review`)
        }else{
            bookReviews.push({username, review});
            res.send(`${username} has reviewed book with isbn ${isbn}`);
        }
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
