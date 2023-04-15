const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'Catalog'
});

// Create session store
const sessionStore = new MySQLStore({
  expiration: 86400000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}, db);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL Database');
});

// Set View Engine
app.set('view engine', 'ejs');

// Set up session middleware
app.use(session({
  secret: 'mysecret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

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
    const username = body.split('=')[1].split('&')[0];
    const password = body.split('=')[2];

    // Validate user credentials
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length > 0) {
        // Create session for user
        req.session.userId = results[0].id;
        res.redirect('/catalog');
      } else {
        res.redirect('/login');
      }
    });
  });
});

// Render Catalog Page
app.get('/catalog', (req, res) => {
  // Check if user is logged in
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    // Get catalog data from database and render page
    const query = 'SELECT * FROM books';
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      res.render('catalog', { books: results });
    });
  }
});

// Start Server
app.listen(3000, () => {
  console.log('Server Started');
});

//const authMiddleware = require('./authMiddleware'); slap this bitch in catalog and it should work
/*app.get('/catalog', authMiddleware, (req, res) => {
    // Catalog code here
  });
Or you can do it this way
  */