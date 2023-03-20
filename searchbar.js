const express = require('express');
const mysql = require('mysql');
const app = express();

// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "OpLo3647",
  database: 'audiobooks'
});

connection.connect();

// Set up the route for displaying the table
app.get('/', function(req, res) {
  let query = 'SELECT * FROM audiobooks.catalog'; //CHANGE THIS LINE

  // check if search query is present in the url
  if(req.query.search){
    // append search query to the SQL query
    query += ` WHERE BookTitle LIKE '%${req.query.search}%' OR Author LIKE '%${req.query.search}%'`;
  }

  connection.query(query, function(error, results, fields) {
    if (error) throw error;

    let tableRows = '';
    results.forEach(function(row) {
      tableRows += `<tr>
      <td>${row.BookTitle}</td>
      <td>${row.BookID}</td>
      <td>${row.Author}</td>
      <td>${row.Genre}</td>
      <td>${row.Price}</td>
      <td>${row.Summary}</td>
      <td>${row.Narrator}</td>
      <td><button>Add to Cart</button></td>
                    </tr>`;
    });

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>RUListening</title>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
          <h1>My Table</h1>
          <form action="/" method="get">
            <input type="text" name="search" placeholder="Search...">
            <button type="submit">Search by Title or Author</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>BookTitle</th>
                <th>BookID</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Price</th>
                <th>Summary</th>
                <th>Narrator</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    res.send(html);
  });
});

// Serve the CSS file
app.use(express.static('public'));

// Start the server
app.listen(8080, function() {
  console.log('Server started http://localhost:8080');
});