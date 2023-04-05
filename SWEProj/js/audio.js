const express = require('express');
const app = express();
const fs = require('fs');
const audio = require('audio');

const audiobookFilePath = 'C:\\Users\\konra\\Downloads\\test\\js\\audiobook.mp3';

app.get('/audiobook', (req, res) => {
  const stat = fs.statSync(audiobookFilePath);
  const range = req.headers.range;
  const fileSize = stat.size;
  const chunkSize = 10 ** 6; // 1MB
  let start = 0;
  let end = fileSize - 1;
  if (range) {
    start = Number(range.replace(/\D/g, ""));
    end = Math.min(start + chunkSize, fileSize - 1);
  }
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mpeg",
  };
  res.writeHead(206, headers);
  const stream = fs.createReadStream(audiobookFilePath, { start, end });
  stream.pipe(res);
});

app.listen(3000, () => console.log('Audiobook server is running on port 3000!'));