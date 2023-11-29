const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const express = require('express');
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = dev?3000:4000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
