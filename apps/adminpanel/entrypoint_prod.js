const path = require('path')
const fs = require('fs')
const dir = path.join(__dirname)
process.env.NODE_ENV = 'production'
process.chdir(__dirname)
const setupProxyHandler = require('../../packages/app/proxy')

if(!fs.existsSync(path.join(__dirname, '../../node_modules/@my/protolib'))) {
  fs.mkdirSync(path.join(__dirname, '../../node_modules/@my/protolib/lib'), { recursive: true })
  fs.copyFileSync(path.join(__dirname, '../../packages/protolib/lib/RemoteTransport.ts'), path.join(__dirname, '../../node_modules/@my/protolib/lib/RemoteTransport.ts'))
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
    }, requestListener, server);

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
  print("Error starting production server: server.js not found")
}

