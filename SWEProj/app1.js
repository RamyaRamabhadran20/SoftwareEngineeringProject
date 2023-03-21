const express = require('express');
const mysql = require('mysql');
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'Catalog'
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

// Render Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle Login
app.post('/login', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const email = body.split('=')[1].split('&')[0];
    const password = body.split('=')[2];
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    db.query(query, (err, result) => {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        res.send('Login Successful!');
      } else {
        res.send('Invalid Email or Password!');
      }
    });
  });
});

// Start Server
app.listen(3001, () => {
  console.log('Server Started');
});