const next = require('next');
var express = require('express');
const fs = require('fs')
const path = require('path')

const isFullDev = process.env.FULLDEV
const dev = process.env.NODE_ENV !== 'production';
const PORT = dev ? 3003 : 4003;

if (!isFullDev) {
  var app = express();
  app.use((req, res, next) => {
    const parts = req.path.split('/').filter(x => x).filter(x => x != '..').filter((x, i) => !(x=='admin'&&!i))
    var file = path.join('.', 'out', parts.join('/'));
    console.log('file: ', file)
    if (fs.existsSync(file)) {
      res.sendFile(file, { root: '.' });
    } else {
      if(fs.existsSync(file+'.html')) {
        res.sendFile(file+'.html', { root: '.' });
      } else {
        res.sendFile('404.html', { root: './out' });
      }
    }
  });

  app.listen(PORT, () => {
    console.log(`> Static server ready on http://localhost:${PORT}`);
  });
} else {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(() => {
    const express = require('express');
    const server = express();

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    const PORT = dev ? 3003 : 4003;
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  });
}