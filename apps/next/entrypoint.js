const next = require('next');
const app = next({ dev: true });
const handle = app.getRequestHandler();
const system = require('../../system.js');

const isFullDev = process.env.FULL_DEV === '1';

app.prepare().then(() => {
  const express = require('express');
  const server = express();

  server.all('*', (req, res) => {
    if(!isFullDev && system['alwaisCompiledPaths'] && system['redirectToCompiled']) {
      //check if alwaisCompiledPaths array contains a path that matches the start of the request url
      const isCompiled = system['alwaisCompiledPaths'].some(path => req.url.startsWith(path));
      if(isCompiled) {
        return system.redirectToCompiled(req, res)
      }
    }
    return handle(req, res);
  });

  const PORT = 3000
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
