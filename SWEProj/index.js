const http = require('http');
const mysql = require('mysql');
const { stringify } = require('querystring');


//Setting up the database connection

//Catalog Database
const catalog = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SWEPRoj2023',
    database: 'Catalog'
});

//UserInfo Database
const userInfo = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'SWEPRoj2023',
    database: 'UserInfo'
});

//UserReview Database
const userReview = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'SWEPRoj2023',
    database: 'UserReview'
});

//Connect to databases
catalog.connect((err) => {
    if(err){
        console.error('Error conencting to the catalog database: ', err);
        return;
    }
    else{
        console.log('Successfully connected to Catalog database!');
    }
});
//Debugging: console.log('After calling connect() on catalog');

userInfo.connect((err) => {
    if(err){
        console.error('Error conencting to the UserInfo database: ', err);
        return;
    }
    else{
        console.log('Successfully connected to UserInfo database!');
    }
});

userReview.connect((err) => {
    if(err){
        console.error('Error conencting to the UserReview database: ', err);
        return;
    }
    else{
        console.log('Successfully connected to UserReview database!');
    }
});

//Creating http server
const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Welcome to RU Listening!');
    }
    else if(req.url === '/catalog'){
        //I dont understand this but this is what one of the tutorials did
        catalog.query('SELECT * FROM catalog', (err, results) => {
            if(err){
                console.error('Error querying from catalof database:', err);
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Server Error');
                return;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(results));
        });
    }
    else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found');
    }
    //Connect the other two databases later
});
//Start http serber
server.listen(8080,() =>{
    console.log('Server listening on port 8080');
});
