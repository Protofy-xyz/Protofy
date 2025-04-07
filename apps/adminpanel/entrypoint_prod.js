const path = require('path')
const fs = require('fs')
const url = require('url')

const dir = path.join(__dirname)
process.env.NODE_ENV = 'production'
process.chdir(__dirname)
const setupProxyHandler = require('../../packages/app/proxy')

if(!fs.existsSync(path.join(__dirname, '../../node_modules/@my/protolib'))) {
  fs.mkdirSync(path.join(__dirname, '../../node_modules/@my/protolib/lib'), { recursive: true })
  fs.copyFileSync(path.join(__dirname, '../../packages/protolib/lib/RemoteTransport.ts'), path.join(__dirname, '../../node_modules/@my/protolib/lib/RemoteTransport.ts'))
}

const serveStaticFile = (filePath, res) => {
  console.log('Serving static file:', filePath)
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

function extractNextConfig(script) {
  const nextConfigRegex = /const nextConfig = (.*)/
  const match = script.match(nextConfigRegex);

  if (match && match[1]) {
    try {
      const nextConfig = JSON.parse(match[1]);
      return nextConfig
    } catch (error) {
      console.error("Error in entrypoint.js: error parsing nextConfig from server.js:", error)
      return null
    }
  }
  return null
}

if (fs.existsSync(path.join(__dirname, 'server.js'))) {
  const content = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
  const nextConfig = extractNextConfig(content)

  const currentPort = parseInt(process.env.PORT, 10) || 8000
  const hostname = process.env.HOSTNAME || '0.0.0.0'

  let keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT, 10)
  process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(nextConfig)
  //first require http and wrap createServer
  const http = require('http');
  const originalCreateServer = http.createServer;


  http.createServer = function (requestListener) {
    listener = null
    const wrappedRequestListener = function (req, res) {
      if (listener) {
        listener(req, res);
      } else {
        requestListener(req, res);
      }
    };

    server = originalCreateServer.call(this, wrappedRequestListener)

    setupProxyHandler('adminpanel', (subFn) => {
      listener = subFn
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
        const localPath = path.resolve(path.join('../../../../../data/pages', pathname))
        //print cwd
        fs.stat(localPath, (err, stats) => {
          if (!err && stats.isFile()) {
            return serveStaticFile(localPath, res)
          } else {
            requestListener(req, res);
          }
        })
      } else {
        requestListener(req, res);
      } 
    }, server);

    return server
  };


  require('next')
  const { startServer } = require('next/dist/server/lib/start-server')

  if (
    Number.isNaN(keepAliveTimeout) ||
    !Number.isFinite(keepAliveTimeout) ||
    keepAliveTimeout < 0
  ) {
    keepAliveTimeout = undefined
  }

  // Llamamos a startServer normalmente
  startServer({
    dir,
    isDev: false,
    hostname,
    port: currentPort,
    allowRetry: false,
    keepAliveTimeout,
    config: nextConfig,
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  });
} else {
  console.error("Error starting production server: server.js not found")
}

