const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
//const {userID} = require('../authorization');
//console.log(`UserID: ${userID}`);

// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SWEPRoj2023",
    database: 'RUListening'
  });
  
  
let arr = [];
let bookObj = {};
// Function to sort catalog results alphabetically by BookTitle
function sortCatalogAlphabetically(results) {
  results.sort(function(a, b) {
    var titleA = a.BookTitle.toUpperCase(); // ignore upper and lowercase
    var titleB = b.BookTitle.toUpperCase(); // ignore upper and lowercase
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }

    // titles must be equal
    return 0;
  });

  return results;
}


app.get('/', function(req, res) {
    let query = 'SELECT * FROM Catalog';

    if(req.query.search){
        const { search } = req.query;
        // append search query to the SQL query
        query += ` WHERE BookTitle LIKE '%${search}%' OR Author LIKE '%${search}%' OR Genre LIKE '%${search}%' OR Narrator LIKE '%${search}%'`;
        arr = [];
      }
      arr = [];
    
      connection.query(query, function(err, result, fields) {
        if (err) throw err;
        result.forEach(function(row) {
          bookObj = {BookTitle: row.BookTitle, Author: row.Author, Genre: row.Genre, Price: row.Price, Narrator:row.Narrator, Summary: row.Summary};
          arr.push(bookObj);
        });
        const myJSONBooks = JSON.stringify(arr);
        //res.send(myJSONBooks);
        let data  = myJSONBooks;
        res.sendFile(path.join(__dirname, 'html', 'catalogv5.html'));
        fs.readFile("/html/catalogv5.html", function (err, data) {
          //res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
          
    
    });
    /*app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'html', 'catalogv5.html'));
      fs.readFile("/html/catalogv5.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        res.end();
      });
    });*/
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}); 
//returns all the books as an array of JSON objects
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/suggestions', function(req, res) {
    const { term } = req.query;
    let query = '';
  
    if (term) {
      query = `SELECT DISTINCT BookTitle FROM Catalog WHERE BookTitle LIKE '%${term}%' LIMIT 5;`;
    }
  
    connection.query(query, function(error, results, fields) {
      if (error) throw error;
  
      const suggestedSearches = results.map(result => result.BookTitle);
      res.json(suggestedSearches);
   
    });
  });

//POST AND DELETE FOR WISHLIST
app.post('/addToWishlist', function(req, res) {
  let userId;
  try {
    userId = fs.readFileSync('../userID.txt', 'utf8');
    // process data here
  } catch (error) {
    // handle the error
    //console.error(error); // log the error to the console
    console.log("Please, login before adding to your wishlist"); // show a user-friendly message
    res.redirect('http://localhost:3000/'); // redirect the user to a different page using Express.js
  }
    //check to see if user is logged in then display this
    //if book exists in cart
    const BookID = req.body.BookID
    const userID = userId;
    const sql3 = "SELECT * FROM Wishlist WHERE BookID=?";
    connection.query(sql3, [BookID], (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } 
      else if (result.length > 0) {
        // if there is already a book with this BookID in the Wishlist, return an error message
        const errorHtml = `
          <html>
            <body>
              <h1><center>Error</center></h1>
              <p>A book with the same BookID is already in your wishlist.</p>
              <br>
              <a href="/">Back to Catalog</a>
            </body>
          </html>
        `;
        res.send(errorHtml);
    }
    //if that book doesnt exist in cart
    else{
        const wishQuery = `INSERT INTO Wishlist (UserID, BookID) VALUES ('${userID}',?)`;
        connection.query(wishQuery, [BookID], (err, result) =>  {
            if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
            } 
            const testHtml3 = `<html>
            <a href="http://localhost:8083/wishlist">Wishlist</a>
            </html>`;
            res.send(testHtml3);
            //res.sendStatus(200);
        });
    }
    });
});
app.delete('/deleteFromWishlist', function(req, res){
  let userId;
  try {
    userId = fs.readFileSync('../userID.txt', 'utf8');
    // process data here
  } catch (error) {
    // handle the error
    //console.error(error); // log the error to the console
    console.log("Please, login before deleting from your wishlist"); // show a user-friendly message
    res.redirect('http://localhost:3000/'); // redirect the user to a different page using Express.js
  }
    const BookID = req.body.BookID
    const sql2 = "SELECT * FROM Wishlist WHERE BookID=?";
    connection.query(sql2, [BookID], (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else if (result.length <= 0) {
            // if this book doesnt exist in the wishlist, return an error message
            const errorHtml2 = `
              <html>
                <body>
                  <h1><center>Error</center></h1>
                  <p>This book doesn't exist in your wishlist.</p>
                  <br>
                  <a href="/">Back to Catalog</a>
                </body>
              </html>
            `;
            res.send(errorHtml2);
        }
        else{
            const wishQueryD = "DELETE FROM Wishlist WHERE BookID = ?";
            connection.query(wishQueryD, [BookID], (err, result) =>  {
                if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
                } 
                else{
                    const testHtmlD = `<html>
                    <a href="http://localhost:8083/wishlist">Wishlist</a>
                    </html>`;
                    res.send(testHtmlD);
                    //res.sendStatus(200);
                }
            });
        }
    });

});



//POST AND DELETE FOR CART
app.post('/addToCart', (req, res) => {
  let userId;
  try {
    userId = fs.readFileSync('../userID.txt', 'utf8');
    // process data here
  } catch (error) {
    // handle the error
    //console.error(error); // log the error to the console
    console.log("Please, login before adding to Cart"); // show a user-friendly message
    res.redirect('http://localhost:3000/'); // redirect the user to a different page using Express.js
  }
  

  //const getID = require('./checklogin');
    //check to see if user is logged in then display this
    //if book exists in cart
    const userID = userId;
    //console.log(`${userID}`);
    const BookID = req.body.BookID
    //console.log("HI");
    //console.log(UserID);
    const sql1 = `SELECT * FROM Cart WHERE BookID=?`;
    connection.query(sql1, [BookID], (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } 
      else if (result.length > 0) {
        // if there is already a book with this BookID in the cart, return an error message
        const errorHtml = `
          <html>
            <body>
              <h1><center>Error</center></h1>
              <p>A book with the same BookID is already in your cart.</p>
              <br>
              <a href="/">Back to Catalog</a>
            </body>
          </html>
        `;
        res.send(errorHtml);
    }
    //if that book doesnt exist in cart
    else{
        const cartQuery = `INSERT INTO Cart (UserID, BookID) VALUES ('${userID}',?)`;
        connection.query(cartQuery, [BookID], (err, result) =>  {
            if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
            } 
            const testHtml = `<html>
            <a href="http://localhost:8082/cart">Cart</a>
            </html>`;
            res.send(testHtml);
            //res.sendStatus(200);
        });
    }
    });
});
app.delete('/deleteFromCart', function(req, res){
  let userId;
  try {
    userId = fs.readFileSync('../userID.txt', 'utf8');
    // process data here
  } catch (error) {
    // handle the error
    //console.error(error); // log the error to the console
    console.log("Please, login before deleting from Cart"); // show a user-friendly message
    res.redirect('http://localhost:3000/'); // redirect the user to a different page using Express.js
  }
    const BookID = req.body.BookID
    const sql2 = "SELECT * FROM Cart WHERE BookID=?";
    connection.query(sql2, [BookID], (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        }
        else if (result.length <= 0) {
            // if this book doesnt exist in the cart, return an error message
            const errorHtml2 = `
              <html>
                <body>
                  <h1><center>Error</center></h1>
                  <p>This book doesn't exist in your cart.</p>
                  <br>
                  <a href="/">Back to Catalog</a>
                </body>
              </html>
            `;
            res.send(errorHtml2);
        }
        else{
            const cartQueryD = "DELETE FROM Cart WHERE BookID = ?";
            connection.query(cartQueryD, [BookID], (err, result) =>  {
                if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
                } 
                else{
                    const testHtml4 = `<html>
                    <a href="http://localhost:8082/cart">Cart</a>
                    </html>`;
                    res.send(testHtml4);
                    //res.sendStatus(200);
                }
            });
        }
    });

});

//to add and delete a review
app.get('/review', (req, res) =>{
  res.sendFile(__dirname + '/html/review.html');
});
app.post('/review', (req, res) =>{
   //console.log(req.body);
   //console.log(results);
  //make a review button on catalog that will redirect people to a review.html
  let userId;
  const BookID = req.body.BookID;
  try {
    userId = fs.readFileSync('../userID.txt', 'utf8');
    // process data here
  } catch (error) {
    // handle the error
    //console.error(error); // log the error to the console
    console.log("Please, login before adding a Review"); // show a user-friendly message
    res.redirect('http://localhost:3000/'); // redirect the user to a different page using Express.js
  }
  const review = req.body.review;
  const rating = req.body.rating;

  //console.log(review);
  //console.log(rating);
  if(res){
    let reviewQuery = `INSERT INTO Reviews (BookID, UserID, review, rating ) VALUES ('${BookID}', '${userId}', '${review}', '${rating}')`;
    connection.query(reviewQuery, (err, result) =>  {
      if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
      }
    res.send("Review submitted successfully");
    });
  }
  else{
    res.send("Please fill out the fields.");
  }
  });
  app.delete('/review', (req, res) => {
    let userId;
    const BookID = req.body.BookID;
    try {
      userId = fs.readFileSync('../userID.txt', 'utf8');
      // process data here
    } catch (error) {
      // handle the error
      //console.error(error); // log the error to the console
      console.log("Please, login before deleting a Review"); // show a user-friendly message
      res.redirect('http://localhost:3000/'); // redirect the user to a different page using Express.js
    }
    const reviewQueryD = "DELETE FROM Reviews WHERE BookID = ?";
      connection.query(reviewQueryD, [BookID], (err, result) =>  {
          if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        else{
          res.sendStatus(200);
        }
      });
  });


// Start the server
app.listen(8081, function() {
    console.log('Server started http://localhost:8081');
  });
