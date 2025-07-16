const next = require('next')
const setupProxyHandler = require('app/proxy.js')
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = http.createServer()
  server.on('request', (req, res) => {
    handle(req, res)
  })

  const PORT = 3008
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})