const next = require('next');
const setupProxyHandler = require('app/proxy.js');
const fs = require('fs')
const path = require('path');

function extractNextConfig(script) {
  const nextConfigRegex = /const nextConfig = (.*)/;
  const match = script.match(nextConfigRegex);

  if (match && match[1]) {
    try {
      const nextConfig = JSON.parse(match[1]);
      return nextConfig;
    } catch (error) {
      console.error("Error in entrypoint.js: error parsing nextConfig from server.js:", error);
      return null;
    }
  }
  return null;
}

const app = next({ dev: true });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const express = require('express');
  const server = express();
  setupProxyHandler('next', (subFn) => {
    server.all('*', (req, res) => {
      return subFn(req, res);
    });
  }, handle);
  const PORT = 8000
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
