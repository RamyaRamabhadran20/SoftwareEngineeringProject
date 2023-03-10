const mysql = require('mysql');
const http = require('http');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'Catalog'
});

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
    return;
  }

  const sql = 'SELECT * FROM catalogtable';
  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Error retrieving catalog data');
      return;
    }

    const catalog = results;
    const catalogHTML = catalog.map((product) => {
      return `
        <div class="catalog">
          <h2>${product.BookTitle}</h2>
          <p>${product.Summary}</p>
          <span>${product.Price}</span>
        </div>
      `;
    }).join('');

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`<div id="catalog-container">${catalogHTML}</div>`);
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});

//REMEMBER TO DISPLAY GENRE AND AUTHOR