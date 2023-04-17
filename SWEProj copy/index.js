//make sure to run in terminal: 'npm init'; 'npm install express mysql2 bcrypt dotenv ejs'
//file runs on http://localhost:3000/
//to compile run in terminal: 'node index.js'
//mySQL Details:  host: 'localhost', user: 'root', password: 'password', database: 'books'


//to work on: adding a header feature that is a navigation bar; using functionality of navigation bar with sign in and sign out

// require necessary modules
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const ejs = require('ejs');


let ID;
let userId;
// create an instance of the express application
const app = express();

// set up the middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'mysecretkey',
  resave: true,
  saveUninitialized: true
}));

// create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SWEPRoj2023',
  database: 'RUListening'
});

// connect to the MySQL database
connection.connect();

// set up the routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('SELECT id FROM accounts WHERE username = ?', [req.body.username], (err, results) => {
    if (err) throw err;
  
    // assuming we get one result, get the user ID
    userId = results[0].id;
    console.log(userId);
    connection.query(`UPDATE sessions SET id = ${userId} WHERE id is null limit 1`);
  });

  connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results, fields) => {
    if (results.length > 0) {
      const hashedPassword = results[0].password;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (result) {
          req.session.loggedin = true; //req.session.loggedin is a boolean variable
          req.session.username = username;
          
          res.redirect('http://localhost:8081');
        } else {
          res.send('Incorrect username and/or password!');
        }
        res.end();
      });
    } else {
      res.send('Incorrect username and/or password!');
      res.end();
    }
  });
  //console.log(req.session);

});
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});
app.get('/catalog', (req, res) => {
  console.log("session in index:", req.session);
  console.log(userId);

  checkUserLoggedIn(req, res, req.session); // pass req.session as parameter
});

app.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    connection.query('INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.send('An error occurred while registering.');
      } else {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('http://localhost:8081');
      }
      res.end();
    });
  });
});

app.get('/homepage.html', (req, res) => {
  if (req.session.loggedin) {
    res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
  } else {
    res.redirect('/login');
  }
});


app.post('/logout', (req, res) => {
  req.session.loggedin = false;
  res.redirect('/login');
});



module.exports = app;
// start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});