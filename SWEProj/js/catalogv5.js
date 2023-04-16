const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const checkloginApp = require('./checklogin'); // import the checklogin middleware
//const userid = require('./checklogin');

//import {ID} from './checklogin';
//console.log(ID);
/*https://jonathan-holloway.medium.com/node-and-express-session-a23eb36a0528*/

// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SWEPRoj2023",
    database: 'RUListening'
  });


let arr = [];
let bookObj = {};
app.get('/', function(req, res) {
    let query = 'SELECT * FROM Catalog';

    if(req.query.search){
        // append search query to the SQL query
        query += ` WHERE BookTitle LIKE '%${req.query.search}%' OR Author LIKE '%${req.query.search}%' OR Genre LIKE '%${req.query.search}%' OR Narrator LIKE '%${req.query.search}%'`;
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
        res.send(myJSONBooks);
    
    });
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}); 
//returns all the books as an array of JSON objects
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//POST AND DELETE FOR WISHLIST
app.post('/addToWishlist', function(req, res) {
    //check to see if user is logged in then display this
    //if book exists in cart
    const BookID = req.body.BookID
    const sql3 = "SELECT * FROM Wishlist WHERE BookID=?";
    connection.query(sql1, [BookID], (err, result) => {
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
        const wishQuery = "INSERT INTO Wishlist (BookID) VALUES (?)";
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
  const getID = require('./checklogin');
  console.log(getID);
    //check to see if user is logged in then display this
    //if book exists in cart
    const BookID = req.body.BookID
    const UserID = user;
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
        const cartQuery = `INSERT INTO Cart (UserID, BookID) VALUES ('${UserID}',?)`;
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




// Start the server
app.listen(8081, function() {
    console.log('Server started http://localhost:8081');
  });
