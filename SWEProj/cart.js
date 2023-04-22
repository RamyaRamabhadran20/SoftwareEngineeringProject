const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "SWEPRoj2023",
    database: 'RUListening'
  });
connection.connect();
let cart = [];
let cartObj = {};
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
    app.get('/cart', function(req, res) {
        const BookID = req.body.BookID;
        const cartSql = "SELECT * FROM Cart";
            connection.query(cartSql, (err, result) =>{
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
                else{
                    let totalPrice = 0; // initialize the total price to zero
                    result.forEach(function(row) {
                        //console.log(row.BookID);

                        const obj = `SELECT * FROM Catalog WHERE BookID = '${row.BookID}'`;
                        connection.query(obj, (err, objRes) =>{
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            }
                        const book = objRes[0];
                        bookObj = {BookTitle: book.BookTitle, Price: book.Price};
                        //console.log(cartObj);
                        cart.push(bookObj);
                        totalPrice = totalPrice + book.Price;
                        cartObj = {cart: cart, totalPrice: totalPrice};
                        });
                    });
                }
            res.send(cartObj);  
            });

    });
app.listen(8082, function() {
    console.log('Server started http://localhost:8082');
  });


