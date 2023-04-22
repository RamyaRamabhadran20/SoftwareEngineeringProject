// client.js

const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Make an AJAX request to the server to retrieve the cart data
fetch('/cart')
  .then(response => response.json())
  .then(cartObj => {
    // Get the container element and set its inner HTML with the cart data
    const outputElement = $('#output');
    outputElement.html(JSON.stringify(cartObj));

    // Print the modified output HTML to the console
    console.log($.html());
  });
