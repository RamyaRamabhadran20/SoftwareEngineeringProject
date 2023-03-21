const express = require('express');
const mysql = require('mysql');
const app = express();

// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SWEPRoj2023",
  database: 'Catalog'
});

connection.connect();

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
            <a href = "cart.html">Add to Cart</a>
            <!--<button>Add to Cart</button>-->

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

// Start the server
app.listen(8081, function() {
  console.log('Server started http://localhost:8081');
});
