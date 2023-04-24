app.get('/your-books', (req, res) => {
    const userId = fs.readFileSync('userID.txt', 'utf8');
    const yourBooksSql = `SELECT * FROM Accounts WHERE UserID = '${userId}'`;
    connection.query(yourBooksSql, (err, result) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      } else {
        const bookIds = result.map(row => row.BookID);
  
        const booksSql = `SELECT * FROM Catalog WHERE BookID IN (${bookIds.join()})`;
        connection.query(booksSql, (err, booksResult) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.render('your-books', { books: booksResult });
          }
        });
      } 
    });
  });
  