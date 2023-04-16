const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'RUListening'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL Database');
});

// Set View Engine
app.set('view engine', 'ejs');

// Render Register Page
app.get('/', (req, res) => {
  res.render('register');
});

// Handle Registration
app.post('/register', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const username = body.split('=')[1].split('&')[0];
    const email = body.split('=')[2].split('&')[0];
    const password = body.split('=')[3].split('&')[0];
    const query = `INSERT INTO Users (UserEmail, UserName, Password) VALUES ('${email}', '${username}', '${password}')`;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      console.log('New user inserted into database');
      res.redirect('http://localhost:3001/login');
    });
  });
});

// Start Server
app.listen(8084, () => {
  console.log('Server Started');
});
