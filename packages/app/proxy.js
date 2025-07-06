// proxy.js
const routes = require('../../routes.js')
const httpProxy = require('http-proxy')
const protobose = require('protobase')
const getLogger = protobose.getLogger
const protonode = require('protonode')
const config = require('@my/config')
const fs = require('fs')
const path = require('path')
const mrmime = require('mrmime')

// ─── Helpers ────────────────────────────────────────────────────────────────
function getRoot() {
  return path.join(__dirname, "..", "..")
}

function makeLogger(name) {
  return getLogger(
    name,
    config.getBaseConfig(name, process, protonode.getServiceToken())
  )
}

function createProxyServer(name) {
  const logger = makeLogger(name)
  const proxy = httpProxy.createProxyServer({ ws: true, xfwd: true, proxyTimeout: 0 })
  const startTime = Date.now()
  proxy.on('error', (err, req, res) => {
    if (Date.now() - startTime < 10000) return
    logger.error({ err, url: req.url }, 'Proxy error')
    if (res && !res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' })
      res.end('Bad Gateway')
    }
  })
  return { proxy, logger }
}

function getRoute(resolver, req) {
  if (resolver.disabled) {
    return resolver?.disabledRoute?.(req)
  }
  return resolver.route(req)
}

function findResolver(name, req) {
  return routes.routers.find(r => getRoute(r, req))
}

function serveStream(filePath, res) {
  const ct = mrmime.lookup(filePath) || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': ct })
  fs.createReadStream(filePath).pipe(res)
}

function serve404(res) {
  const fn = path.join(__dirname, '../../data/pages/workspace/404.html')
  res.writeHead(404, { 'Content-Type': 'text/html' })
  fs.createReadStream(fn).pipe(res)
}

// ─── Core HTTP handler ──────────────────────────────────────────────────────
function handleHttp(name, req, res, fallback, proxy, logger) {
  // 1) public files
  if (req.url.startsWith('/public/')) {
    const rel = decodeURIComponent(req.url.replace(/\.\.\//g, ''))
    const root = '../../data'
    const fp = path.join(root, rel)
    if (!fs.existsSync(fp)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not Found')
    } else {
      serveStream(fp, res)
    }
    return true
  }

  const resolver = findResolver(name, req)
  if (resolver) {
    if (resolver.name !== name) {
      let target = getRoute(resolver, req)
      if (!target.startsWith("file://")) {
        logger.trace({ url: req.url, target: target }, 'Proxying request')
        proxy.web(req, res, { target: resolver.route(req) })
        return true
      } else {
        const filepath = target.slice(7)
        //static pages fallback
        let htmlFile = path.join(getRoot(), filepath)
        //check if the path is a directory
        if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isDirectory()) {
          //check if there is a file named htmlFile plus html
          if (!fs.existsSync(htmlFile + '.html') && fs.existsSync(path.join(htmlFile, 'index.html'))) {
            htmlFile = path.join(htmlFile, 'index.html')
          }
        }

        //if the path is a file, check if it has an extension
        if (!path.extname(htmlFile)) {
          //if not, assume it's an HTML file
          htmlFile += '.html'
        }

        if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
          serveStream(htmlFile, res)
          return true
        } else {
          logger.warn({ url: req.url, file: htmlFile }, 'File not found, serving 404')
          serve404(res)
          return true
        }

      }
    }
  } else {
    //static pages fallback
    let p = req.url.split('?')[0]
    let htmlFile = path.join(__dirname, '../../data/pages', p)
    //check if the path is a directory
    if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isDirectory()) {
      //check if there is a file named htmlFile plus html
      if (!fs.existsSync(htmlFile+'.html') && fs.existsSync(path.join(htmlFile, 'index.html'))) {
          htmlFile = path.join(htmlFile, 'index.html')
      }
    }

    //if the path is a file, check if it has an extension
    if (!path.extname(htmlFile)) {
      //if not, assume it's an HTML file
      htmlFile += '.html'
    }

    if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
      serveStream(htmlFile, res)
      return true
    } else {
      logger.warn({ url: req.url, file: htmlFile }, 'File not found, serving 404')
      if(p == '/') {
        //if the request is for the root, serve the index.html file
        htmlFile = path.join(__dirname, '../../data/pages/workspace/index.html')
        if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
          serveStream(htmlFile, res)
          return true
        }
      }
      serve404(res)
      return true
    }
  }
  
  //fallback to app logic
  fallback(req, res)
  return true
}

// ─── Next.js style setup ────────────────────────────────────────────────────
function setupProxyHandler(name, subscribe, handle, server) {
  const { proxy, logger } = createProxyServer(name)
  // WS upgrade
  server.on('upgrade', (req, socket, head) => {
    const resolver = findResolver(name, req)
    if (!resolver || resolver.name === name) {
        if(resolver.name === name && req.url.endsWith('/webpack-hmr')) {
            //let nextjs handle its own websocket
            return
        }
        console.log('No resolver found for WebSocket request: ' + req.url);
        socket.destroy();
        return;
    }
    proxy.ws(req, socket, head, { target: resolver.route(req) })
  })
  // HTTP
  subscribe((req, res) => {
    handleHttp(name, req, res, handle, proxy, logger)
  })
}

// ─── Express middleware ─────────────────────────────────────────────────────
function createExpressProxy(name) {
  const { proxy, logger } = createProxyServer(name)
  return (req, res, next) => {
    handleHttp(name, req, res, () => {
      next()
    }, proxy, logger)
  }
}

// ─── WS upgrade for Express/HTTP-server ─────────────────────────────────────
function handleUpgrade(server, name) {
  const { proxy } = createProxyServer(name)
  server.on('upgrade', (req, socket, head) => {
    const resolver = findResolver(name, req)
    if (!resolver || resolver.name === name) {
      return socket.destroy()
    }
    proxy.ws(req, socket, head, { target: resolver.route(req) })
  })
}

// ─── Exports ─────────────────────────────────────────────────────────────────
module.exports = setupProxyHandler          // backward compatibility
module.exports.setupProxyHandler = setupProxyHandler
module.exports.createExpressProxy = createExpressProxy
module.exports.handleUpgrade = handleUpgrade
