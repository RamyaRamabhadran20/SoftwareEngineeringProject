const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const app = express();

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'RUListening'
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

// Set view engine
app.set('view engine', 'ejs');

// Set up session middleware
app.use(session({
  secret: 'mysecret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// Middleware to check if user is logged in and is a publisher
const isPublisher = (req, res, next) => {
  if (!req.session.UserID) {
    // User is not logged in
    res.redirect('/login');
  } else {
    // Check if user is a publisher
    const query = `SELECT * FROM Users WHERE UserID=${req.session.UserID}`;
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length > 0 && results[0].AccountType === 'publisher') {
        // User is a publisher
        next();
      } else {
        // User is not a publisher
        res.redirect('/');
      }
    });
  }
};

// Render login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
app.post('/login', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const email = body.split('=')[1].split('&')[0];
    const password = body.split('=')[2];

    // Validate user credentials
    const query = `SELECT * FROM Users WHERE UserEmail='${email}' AND Password='${password}'`;
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }

      if (results.length > 0) {
        // Create session for user
        req.session.UserID = results[0].UserID;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    });
  });
});

// Render catalog page
app.get('/', (req, res) => {
  // Check if user is logged in
  if (!req.session.UserID) {
    res.redirect('/login');
  } else {
    // Get catalog data from database and render page
    const query = 'SELECT * FROM Catalog';
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
      res.render('catalog', { books: results });
    });
  }
});

// Render publisher book form page
// Render Add Book Page for Publishers Only
app.get('/add', (req, res) => {
    // Check if user is logged in and is a publisher
    if (!req.session.UserID || req.session.UserType !== 'publisher') {
      res.redirect('/login');
    } else {
      // Render add book form
      res.render('add', { title_label: 'Title:', author_label: 'Author:', description_label: 'Description:' });
    }
  });
  
  // Handle Add Book
  app.post('/add', (req, res) => {
    let body = '';
  
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
      const title = body.split('=')[1].split('&')[0];
      const author = body.split('=')[2].split('&')[0];
      const description = body.split('=')[3];
  
      // Insert new book into database
      const query = `INSERT INTO Catalog (Title, Author, Description) VALUES ('${title}', '${author}', '${description}')`;
      db.query(query, (err, results) => {
        if (err) {
          throw err;
        }
        res.redirect('/');
      });
    });
  });
  
