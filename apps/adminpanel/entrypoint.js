const next = require('next')
const setupProxyHandler = require('app/proxy.js')
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const app = next({ dev: true })
const handle = app.getRequestHandler()

const serveStaticFile = (filePath, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404
      res.end('File not found')
    } else {
      res.statusCode = 200
      res.end(data)
    }
  })
}

app.prepare().then(() => {
  const server = http.createServer()

  setupProxyHandler('adminpanel', (subFn) => {
    server.on('request', (req, res) => {
      return subFn(req, res)
    })
  }, (req, res) => {
    const parsedUrl = url.parse(req.url)
    let pathname = parsedUrl.pathname

    // Si la ruta no empieza por /workspace/ ni es exactamente /workspace
    const isWorkspace = pathname === '/workspace' || pathname.startsWith('/workspace/')
    if (!isWorkspace) {
      //if pathname doesn't have extension, add .html
      if(pathname == '/') {
        pathname = '/index.html'
      }

      if (!pathname.includes('.')) {
        pathname += '.html'
      }
      const localPath = path.join('../../data/pages', pathname)

      fs.stat(localPath, (err, stats) => {
        if (!err && stats.isFile()) {
          return serveStaticFile(localPath, res)
        } else {
          handle(req, res)
        }
      })
    } else {
       handle(req, res)
    }
  }, server)

  const PORT = 3002
  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})