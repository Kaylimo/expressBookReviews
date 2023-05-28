const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list using Axios
public_users.get('/axios',async function (req, res) {
    const response = await axios.get('http://localhost:5000');
    res.send(response.data);
});

// Get book details based on ISBN using Axios
public_users.get('/axios/isbn/:isbn',async function (req, res) {
    const isbn = req.params.isbn;
    const response = await axios.get('http://localhost:5000/isbn/' + isbn);
    res.send(response.data);
});

// Get book details based on author using Axios
public_users.get('/axios/author/:author',async function (req, res) {
    const author = req.params.author;
    const response = await axios.get('http://localhost:5000/author/' + author);
    res.send(response.data);
});

// Get all books based on title using Axios
public_users.get('/axios/title/:title',async function (req, res) {
    const title = req.params.title;
    const response = await axios.get('http://localhost:5000/title/' + title);
    res.send(response.data);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksSelected = {};
    for (const [isbn, bookDetails] of Object.entries(books)) {
        if(bookDetails.author === author) {
            booksSelected[isbn] = bookDetails;
        };
    };
    res.send(booksSelected);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksSelected = {};
    for (const [isbn, bookDetails] of Object.entries(books)) {
        if(bookDetails.title === title) {
            booksSelected[isbn] = bookDetails;
        };
    };
    res.send(booksSelected);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send({"reviews" : books[isbn].reviews});
});

module.exports.general = public_users;
