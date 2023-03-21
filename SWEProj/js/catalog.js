const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');


// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'Catalog'
});
const connection2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'Cart'
});

connection.connect();
connection2.connect();

// Set up the route for displaying the catalog cards
app.get('/', function(req, res) {
  let query = 'SELECT * FROM catalogtable'; //CHANGE THIS LINE

  // check if search query is present in the url
  if(req.query.search){
    // append search query to the SQL query
    query += ` WHERE BookTitle LIKE '%${req.query.search}%' OR Author LIKE '%${req.query.search}%' OR Genre LIKE '%${req.query.search}%' OR Narrator LIKE '%${req.query.search}%'`;
  }

  connection.query(query, function(error, results, fields) {
    if (error) throw error;

    let catalogCards = '';
    results.forEach(function(row) {
      catalogCards += `
        <div class="catalog-card">
          <div class="catalog-card-info">
            <h2>${row.BookTitle}</h2>
            <p>Author: ${row.Author}</p>
            <p>Genre: ${row.Genre}</p>
            <p>Price: $${row.Price}</p>
            <p>Narrator: ${row.Narrator}<p>
            <p>Narrator: ${row.Summary}<p>
            <form action="/cart" method="post">
            <input type="hidden" name="BookID" value="${row.BookID}">
            <input type="hidden" name="BookTitle" value="${row.BookTitle}">
            <input type="hidden" name="Price" value="${row.Price}">
            <button type="submit">Add To Cart</button>
            </form>
            </div>
        </div>`;
    });

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


// Handle POST requests to the '/cart' route
app.post('/cart', function(req, res) { //make another app.delete
  const BookTitle = req.body.BookTitle; // get the BookTitle from the request body
  const Price = req.body.Price;
  const BookID = req.body.BookID;

  // check if the book with this BookID is already in the cart
  const sql1 = "SELECT * FROM cartTable WHERE BookID=?";
  connection2.query(sql1, [BookID], (err, result) => {
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
      const sql2 = "INSERT INTO cartTable (BookID, Book, Price) VALUES (?,?,?)"; // the SQL query to insert the BookTitle and Price into the cart table
      connection2.query(sql2, [BookID, BookTitle, Price], (err, result) => { // execute the SQL query
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
            res.send(cartHtml);
          });
        }
      });
    }
  });
  
});

//TO DELETE
app.delete('/cart', function(req, res) { //make another app.delete
  const BookTitle = req.body.BookTitle; // get the BookTitle from the request body
  const Price = req.body.Price;
  const BookID = req.body.BookID;

  //Fill in the rest of the queries to delete and to display modified cart
  
});








// Start the server
app.listen(8081, function() {
  console.log('Server started http://localhost:8081');
});