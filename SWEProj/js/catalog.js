const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req,res) => {
    if (req.url === '/catalog.html') {
        fs.readFile(path.join(__dirname, '../html/catalog.html'), (err, data) => {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end('404 Not Found');
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });    
    }
});

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080/');
});