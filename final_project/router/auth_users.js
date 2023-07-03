const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "user1", password: "password1" },
  { username: "user2", password: "password2" },
  { username: "user3", password: "password3" }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Find the user with the matching username
  const user = users.find((user) => user.username === username);

  // Check if the user exists and the password matches
  if (user && user.password === password) {
    return true;
  }

  return false;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body; // Extract the username and password from the request body

  // Check if the username or password is missing
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  // Check if the username and password match the registered user
  const isValidUser = authenticatedUser(username, password);
  if (!isValidUser) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  
  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username: username }, 'your_secret_key'); // Replace 'your_secret_key' with your own secret key
  
  // Save the token in the session
  req.session.accessToken = token;
  
  // Return the success message and token as a response
  res.json({ message: 'Customer successfully logged in', token});
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extract the ISBN value from the request parameters
  const review = req.query.review; // Extract the review value from the request query
  const username = req.user.username; // Retrieve the username from the decoded user information in the request object

  // Find the book based on the ISBN
  const book = books[isbn];

  // Check if the book exists
  if (book) {
    // Check if the user has already posted a review for the book
    const existingReviewIndex = book.reviews.findIndex((r) => r.username === username);

    if (existingReviewIndex !== -1) {
      // Modify the existing review
      book.reviews[existingReviewIndex].review = review;
    } else {
      // Add a new review
      book.reviews.push({ username, review });
    }

    // Return a success message
    return res.status(200).json({ message: "Book review added/modified successfully" });
  }

  // Return an error if the book does not exist
  res.status(404).json({ error: "Book not found" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Extract the ISBN value from the request parameters
  const username = req.user.username; // Retrieve the username from the decoded user information in the request object

  // Find the book based on the ISBN
  const book = books[isbn];

  // Check if the book exists
  if (book) {
    // Check if the user has posted a review for the book
    const existingReviewIndex = book.reviews.findIndex((r) => r.username === username);

    if (existingReviewIndex !== -1) {
      // Delete the review
      book.reviews.splice(existingReviewIndex, 1);

      // Return a success message
      return res.status(200).json({ message: "Book review deleted successfully" });
    }

    // Return an error if the user's review is not found
    return res.status(404).json({ error: "Review not found" });
  }

  // Return an error if the book is not found
  res.status(404).json({ error: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
