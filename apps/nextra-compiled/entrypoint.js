const next = require('next');

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const express = require('express');
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = 7700;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
