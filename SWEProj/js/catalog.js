const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');


// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'RUListening'
});
/*
const connection2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'Cart'
});*/
//WTF why did we do this twice
/*
const connection3 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'Catalog'
});
const connection4 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'Cart'
});
*/
connection.connect();
//connection2.connect();
//connection3.connect();
//connection4.connect();

let arr = [];
//let searchArr = [];
let bookObj = {};
// Set up the route for displaying the catalog cards
app.get('/', function(req, res) {
  let query = 'SELECT * FROM Catalog'; //CHANGE THIS LINE

  // check if search query is present in the url
  if(req.query.search){
    // append search query to the SQL query
    query += ` WHERE BookTitle LIKE '%${req.query.search}%' OR Author LIKE '%${req.query.search}%' OR Genre LIKE '%${req.query.search}%' OR Narrator LIKE '%${req.query.search}%'`;
    arr = [];
  }

  arr = [];
  connection.query(query, function(error, results, fields) {
    if (error) throw error;
    let catalogCards = '';
    results.forEach(function(row) {
      bookObj = {BookTitle: row.BookTitle, Author: row.Author, Genre: row.Genre, Price: row.Price, Narrator:row.Narrator, Summary: row.Summary};
      arr.push(bookObj);
      catalogCards += `
        <div class="catalog-card">
          <div class="catalog-card-info">
            <h2>${row.BookTitle}</h2>
            <p>Author: ${row.Author}</p>
            <p>Genre: ${row.Genre}</p>
            <p>Price: $${row.Price}</p>
            <p>Narrator: ${row.Narrator}<p>
            <p>Summary: ${row.Summary}<p>
            <form action="/cart" method="post">
            <input type="hidden" name="BookID" value="${row.BookID}">
            <input type="hidden" name="BookTitle" value="${row.BookTitle}">
            <input type="hidden" name="Price" value="${row.Price}">
            <button type="submit">Add To Cart</button>
            </form>
            <form action="/wishlist" method="post">
            <input type="hidden" name="BookID" value="${row.BookID}">
            <input type="hidden" name="BookTitle" value="${row.BookTitle}">
            <input type="hidden" name="Price" value="${row.Price}">
            <button type="submit">Add To Wishlist</button>
            </form>
            </div>
        </div>`;
        
    });
    const myJSON = JSON.stringify(arr);
    //res.send(myJSON);
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>RUListening</title>
          <style>
            /* Set the background color to white */
            body {
              background-color: white;
              color: black;
            }

            /* Set the font color of the headings to black */
            h1,
            h2,
            h3 {
              color: black;
            }

            /* Set the border color of the catalog cards to red */
            .catalog-card {
              display: flex;
              margin: 10px;
              padding: 10px;
              border: 1px solid #8B0000;
            }

            /* Set the font color of the book titles to red */
            .catalog-card-info h2 {
              margin: 0;
              color: #8B0000;
            }

            /* Set the font color of the buttons to white and the background to red */
            .catalog-card-info button {
              align-self: flex-end;
              margin-top: auto;
              background-color: #8B0000;
              color: white;
              border: none;
              padding: 8px 16px;
              cursor: pointer;
              font-size: 16px;
              font-weight: bold;
              border-radius: 4px;
            }

            /* On hover, change the button background color to white and the font color to deep red */
            .catalog-card-info button:hover {
              background-color: white;
              color: #8B0000;
            }
          </style>
        </head>
        <body>
          <h1><center>Book List</center></h1>
          <form action="/" method="get">
            <input type="text" name="search" placeholder="Search...">
            <button type="submit">Search</button>
          </form>
          ${catalogCards}
        </body>
      </html>
    `;

    res.send(html);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let arrCart = [];
let cartObj = {};
let myJSONCart = {};
// Handle POST requests to the '/cart' route
app.post('/cart', function(req, res) { //make another app.delete
  const BookTitle = req.body.BookTitle; // get the BookTitle from the request body
  const Price = req.body.Price;
  const BookID = req.body.BookID;

  

  // check if the book with this BookID is already in the cart
  const sql1 = "SELECT * FROM Cart WHERE BookID=?";
  connection.query(sql1, [BookID], (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result.length > 0) {
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
    } else {
      // if there is no book with this BookID in the cart, add the book to the cart
      const sql2 = "INSERT INTO Cart (BookID) VALUES (?)"; // the SQL query to insert the BookTitle and Price into the cart table
      connection.query(sql2, [BookID], (err, result) => { // execute the SQL query
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          console.log(result);
          const sql3 = "SELECT * FROM Cart"; // the SQL query to select all books from the cart table
          connection.query(sql3,[BookID], function(error, results, fields) {
            if (error) throw error;
            let cartItems = '';
            let totalPrice = 0; // initialize the total price to zero
            results.forEach(function(row) {
              cartObj = {BookID:row.BookID, BookTitle: row.BookTitle, Price: row.Price};
              arrCart.push(cartObj);

              cartItems += `
                <h2>${row.BookTitle}</h2>
                <p>Price: $${row.Price}</p>
                <form action="/cart" method="delete">
                <input type="hidden" name="BookID" value="${row.BookID}">
                <input type="hidden" name="BookTitle" value="${row.BookTitle}">
                <input type="hidden" name="Price" value="${row.Price}">
                <button type="submit">Delete From Cart</button>
            </form>
              `;
              totalPrice = totalPrice+row.Price; // add the price of each book to the total price
            });

            const cartHtml = `
              <html>
                <body>
                  <h1><center>My Cart</center></h1>
                  ${cartItems}
                  <br>
                  <h3>Total Price: $${totalPrice}</h3> <!-- show the total price -->
                  <a href="/">Back to Catalog</a>
                </body>
              </html>
            `;

            myJSONCart = JSON.stringify(arrCart);
            //res.send(myJSONCart);


            res.send(cartHtml);//change it to card info directly
          });
        }
      });
    }
  });
  
});
//let cartArrAfter = arrCart;
//console.log(arrCart);
///TO DELETE
app.delete('/cart', function(req, res) { //make another app.delete
  const BookTitle = req.body.BookTitle; // get the BookTitle from the request body
  const Price = req.body.Price;
  const BookID = req.body.BookID;

  //Fill in the rest of the queries to delete and to display modified cart
  const sql4 = "DELETE FROM Cart WHERE BookID=?";

    connection.query(sql4, [BookID, BookTitle, Price], (err, result) => { // execute the SQL query
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        console.log(result);
        
        const sql3 = "SELECT * FROM cartTable"; // the SQL query to select all books from the cart table
        connection2.query(sql3, function(error, results, fields) {
          if (error) throw error;
          let cartItems = '';
          let totalPrice = 0; // initialize the total price to zero
          results.forEach(function(row) {
            cartObj = {BookID:row.BookID};
            arrCart.pop(cartObj);

            //console.log(arrCart);
             //cartArrAfter = arrCart; 

            cartItems += `
              <h2>${row.Book}</h2>
              <p>Price: $${row.Price}</p>
              <form action="/cart" method="delete">
              <input type="hidden" name="BookID" value="${row.BookID}">
              <input type="hidden" name="BookTitle" value="${row.BookTitle}">
              <input type="hidden" name="Price" value="${row.Price}">
              <button type="submit">Delete From Cart</button>
          </form>
            `;
            totalPrice = totalPrice+row.Price; // add the price of each book to the total price
          });

          const cartHtml = `
            <html>
              <body>
                <h1><center>My Cart</center></h1>
                ${cartItems}
                <br>
                <h3>Total Price: $${totalPrice}</h3> <!-- show the total price -->
                <a href="/">Back to Catalog</a>
              </body>
            </html>
          `;
          myJSONCart = JSON.stringify(arrCart);
          res.send(myJSONCart);

          //raw is only printing out what was deleted, can we figure out what the rest of cart. PLEASE LOOK AT THIS
          //res.send(cartHtml);
        });
      }
    });
});


app.post('/wishlist', function(req, res) {
  const BookTitle = req.body.BookTitle; // get the BookTitle from the request body
  const Price = req.body.Price;
  const BookID = req.body.BookID;

  // check if the book with this BookID is already in the wishlist
  const sql6 = "SELECT * FROM Wishlist WHERE BookID=?";
  connection.query(sql6, [BookID], (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else if (result.length > 0) {
      // if there is already a book with this BookID in the wishlist, return an error message
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
    } else {
      // if there is no book with this BookID in the wishlist, insert the book into the wishlist
      const sql7 = "INSERT INTO wishlistTable (BookID, Book, Price) VALUES (?, ?, ?)";
      connection.query(sql7, [BookID, BookTitle, Price], (err, result) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          // return a success message
          const successHtml = `
            <html>
              <body>
                <h1><center>Success</center></h1>
                <p>The book has been added to your wishlist.</p>
                <br>
              </body>
            </html>
          `;
          res.send(successHtml);
        }
      });
    }
  });
});






// Start the server
app.listen(8081, function() {
  console.log('Server started http://localhost:8081');
});