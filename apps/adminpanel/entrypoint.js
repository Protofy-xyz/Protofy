const next = require('next')
const setupProxyHandler = require('app/proxy.js')
const http = require('http')
const fs = require('fs')
const path = require('path')

const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = http.createServer()

  setupProxyHandler('adminpanel', (subFn) => {
    server.on('request', (req, res) => {
      return subFn(req, res)
    });
  }, handle, server)

  const PORT = 8000
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})