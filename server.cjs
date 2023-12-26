async function startServer() {
  const http = require('http');
  const fs = require('fs');
  const mime = await import('mime');

  const server = http.createServer((req, res) => {
    const filePath = '.' + req.url;
    const mimeType = mime.getType(filePath);

    if (filePath === '/node_modules/geoapify/geocoder-autocomplete/dist/index.min.js') {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
    } else if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': mimeType });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.end('Not Found');
      } else {
        res.end(data);
      }
    });
  });

  server.listen(5500);
  console.log('Server listening on port 5500');
}
  
    //const PORT = 3000;
    //server.listen(PORT, () => {
    //  console.log(`Server running at http://localhost:${PORT}`);
    //});

  
  startServer();