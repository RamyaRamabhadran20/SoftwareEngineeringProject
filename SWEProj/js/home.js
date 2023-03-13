const mysql = require('mysql');
const http = require('http');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'Catalog'
});
  const sql = 'SELECT * FROM catalogtable';
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error retrieving catalog data');
      return;
    }
    const catalog = results;
    const catalogHTML = catalog.map((product) => {
      //const imagePath = `../img/${product.BookID}.png`;
      //console.log(imagePath); //DEBUG
      return `
        <div class="catalog">
        <img src="../img/R1.jpeg">
          <h2>Book: ${product.BookTitle}</h2>
          <h3>Author: ${product.Author}</h3>
          <h5>Genre: ${product.Genre}</h5>
          <h5>Narator: ${product.Narrator}</h5>
          <p>Summary: ${product.Summary}</p>
          <span>Price: ${product.Price}</span>
        </div>
      `;
    }).join('');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<div id="catalog-container">${catalogHTML}</div>`);
  });
