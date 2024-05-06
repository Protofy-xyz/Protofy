const next = require('next');
const app = next({dev:false});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const express = require('express');
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = 4000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
