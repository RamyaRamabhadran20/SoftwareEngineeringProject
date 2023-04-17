const http = require('http');
const fs = require('fs');
const path = require('path');



const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '../html/landing.html'), (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end('404 Not Found');
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });    
  }
  
  //else if (req.url === '/catalogv3.html') {
   // res.redirect('http://localhost:8001/catalogv3');

    /*fs.readFile(path.join(__dirname, '../html/catalogv3.html'), (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end('404 Not Found');
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);*/
      //return 
    //});
  //} 
  
  else if (req.url === '/cart.html') {
    fs.readFile(path.join(__dirname, '../html/cart.html'), (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end('404 Not Found');
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });  
  }  
  else if (req.url === '/search.html') {
    fs.readFile(path.join(__dirname, '../html/search.html'), (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end('404 Not Found');
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });  
  }  
  else if (req.url === '/css/catalog.css') {
    fs.readFile(path.join(__dirname, '../css/catalog.css'), (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/css'});
        return res.end('404 Not Found');
      }
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      return res.end();
    });    
  }
});
            
server.listen(8080, () => {
  console.log("http://localhost:8080/");
});
