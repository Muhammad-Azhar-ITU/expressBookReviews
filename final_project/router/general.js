const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body; // Extract the username and password from the request body

  // Check if the username or password is missing
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  // Create a new user object
  const newUser = { username, password };

  // Add the new user to the users array
  users.push(newUser);

  // Return a success message
  res.json({ message: 'Customer successfully registered, Now you can login' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = Object.values(books); // Assuming 'books' is imported properly
  const formattedBookList = JSON.stringify(bookList, null, 2); // Indent with 2 spaces
  return res.status(200).send(formattedBookList);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Check if the ISBN exists in the books dat
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    res.json(book); // Return the book details as JSON response
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author; // Extract the author value from the request parameters

  // Array to store matching books
  const matchingBooks = [];

  // Iterate through the books object
  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];

    // Check if the author matches the requested author
    if (book.author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(book);
    }
  });

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    res.json(matchingBooks); // Return the matching books as a JSON response
  } else {
    res.status(404).json({ error: 'Books by the author not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; // Extract the title value from the request parameters

  // Array to store matching books
  const matchingBooks = [];

  // Iterate through the books object
  Object.keys(books).forEach((isbn) => {
    const book = books[isbn];

    // Check if the title matches the requested title
    if (book.title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(book);
    }
  });

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    res.json(matchingBooks); // Return the matching books as a JSON response
  } else {
    res.status(404).json({ error: 'Book with the title not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Extract the ISBN value from the request parameters

  // Find the book based on the ISBN
  const book = books[isbn];

  // Check if the book exists
  if (book) {
    const reviews = book.reviews; // Get the reviews for the book

    // Return the reviews as a JSON response
    res.json(reviews || {});
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

module.exports.general = public_users;
