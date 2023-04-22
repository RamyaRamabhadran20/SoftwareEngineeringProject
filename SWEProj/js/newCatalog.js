const express = require('express');
const mysql = require('mysql');
const app = express();
const fs = require('fs');

// Connect to the MySQL database CHANGE THIS FOR YOUR SELF 
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "OpLo3647",
  database: 'audiobooks'
});

connection.connect();

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

function createArray(results) {
  const bookTitlesArray = [];
  
  results.forEach(function(row) {
    bookTitlesArray.push(row.BookTitle);
  });

  return bookTitlesArray;
}

function updateAutocomplete(suggestedTerms) {
  // Get the autocomplete list element
  const autocompleteList = document.getElementById("autocompleteList");

  // Clear the previous suggestions
  autocompleteList.innerHTML = "";

  // Add each suggested term as a list item
  suggestedTerms.forEach(function(term) {
    const listItem = document.createElement("li");
    listItem.textContent = term;
    autocompleteList.appendChild(listItem);
  });

  // Show the autocomplete list
  autocompleteList.style.display = "block";
}

app.get('/', function(req, res) {
  let query = 'SELECT * FROM Catalog';

  if(req.query.search){
    const { search } = req.query;

    query += ` WHERE BookTitle LIKE '%${search}%' OR Author LIKE '%${search}%' OR Genre LIKE '%${search}%' OR Narrator LIKE '%${search}%'`;
  }

  connection.query(query, function(error, results, fields) {
    if (error) throw error;
    if(results.length == 0){

    }

    // Sort results alphabetically by BookTitle
    results = sortCatalogAlphabetically(results);

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
      </tr>`;
    });

    /*fs.readFile('dummy.html', 'utf8', function(err, data) {
      if (err) throw err;
      const html = data.replace('{{tableRows}}', tableRows);
      res.send(html);*/
    });
  });
});

app.get('/suggestions', function(req, res) {
  const { term } = req.query;
  let query = '';

  if (term) {
    query = `SELECT DISTINCT BookTitle FROM audiobooks.catalog WHERE BookTitle LIKE '%${term}%' LIMIT 5;`;
  }

  connection.query(query, function(error, results, fields) {
    if (error) throw error;

    const suggestedSearches = results.map(result => result.BookTitle);
    res.json(suggestedSearches);
 
  });
});

app.use(express.static('public'));

app.listen(8080, function() {
  console.log('Server started http://localhost:8080');
});
