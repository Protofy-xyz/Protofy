// 🔁 pm2-start.js (agnóstico de Electron)
const pm2 = require('pm2');
const path = require('path');
process.chdir(__dirname);

const platformBin = {
  win32: 'node.exe',
  linux: 'node-linux',
  darwin: 'node-macos',
};

function getNodeBinary(baseDir) {
  const binName = platformBin[process.platform];
  if (!binName) throw new Error(`Unsupported platform: ${process.platform}`);
  return path.join(baseDir, 'bin', binName);
}

// 🎨 Terminal log colors
const colors = ['\x1b[36m', '\x1b[33m', '\x1b[35m', '\x1b[32m', '\x1b[34m', '\x1b[31m', '\x1b[90m'];
const resetColor = '\x1b[0m';
function colorize(label, colorIndex, line) {
  const color = colors[colorIndex % colors.length];
  return `${color}[${label}]${resetColor} ${line}`;
}

function startPM2({ ecosystemFile, nodeBin, onLog = console.log, waitForLog = null }) {
  return new Promise((resolve, reject) => {
    process.env.PM2_NODE_PATH = nodeBin;
    process.env.IS_ECOSYSTEM_CHILD = '1';

    pm2.connect(err => {
      if (err) {
        onLog(`❌ Error connecting to PM2: ${err.message}`);
        return reject(err);
      }

      onLog('✅ PM2 connected. Launching ecosystem...');

      pm2.start(ecosystemFile, {
        interpreter: nodeBin,
        windowsHide: true
      }, err => {
        if (err) {
          onLog(`❌ Error launching ecosystem: ${err.message}`);
          return reject(err);
        }

        onLog('🚀 Ecosystem launched. Attaching to logs...\n');

        pm2.launchBus((err, bus) => {
          if (err) {
            onLog(`⚠️ Could not attach to PM2 log bus: ${err.message}`);
            return resolve();
          }

          const serviceColorMap = new Map();
          let colorIndex = 0;

          const checkLine = (line) => {
            if (waitForLog && typeof waitForLog === 'function') {
              try {
                waitForLog(line);
              } catch {}
            }
          };

          bus.on('log:out', data => {
            const name = data.process.name;
            const line = data.data;
            if (!serviceColorMap.has(name)) {
              serviceColorMap.set(name, colorIndex++);
            }
            const color = serviceColorMap.get(name);
            onLog(colorize(name, color, line));
            checkLine(line);
          });

          bus.on('log:err', data => {
            const name = data.process.name;
            const line = data.data;
            if (!serviceColorMap.has(name)) {
              serviceColorMap.set(name, colorIndex++);
            }
            const color = serviceColorMap.get(name);
            onLog(colorize(name, color, line));
            checkLine(line);
          });

          resolve();
        });
      });
    });
  });
}

function stopPM2(onLog = console.log) {
    return new Promise(resolve => {
      onLog('🛑 Cleaning up PM2...');
      pm2.list((_, list) => {
        const names = list.map(p => p.name);
        if (names.length === 0) {
          pm2.disconnect(() => resolve());
          return;
        }
  
        // Delete each process by name individually
        let remaining = names.length;
        names.forEach(name => {
          pm2.delete(name, () => {
            onLog(`🗑️ Killed service: ${name}`);
            if (--remaining === 0) {
              pm2.disconnect(() => resolve());
            }
          });
        });
      });
    });
  }

module.exports = {
  getNodeBinary,
  startPM2,
  stopPM2,
};

// CLI usage
if (require.main === module) {
  const nodeBin = getNodeBinary(__dirname);
  let shuttingDown = false;

  const cleanup = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    await stopPM2(msg => console.log(msg));
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);

  startPM2({
    ecosystemFile: 'ecosystem.config.js',
    nodeBin,
    onLog: msg => console.log(msg),
  })
    .then(() => console.log('✅ PM2 started successfully.'))
    .catch(err => {
      console.error(`❌ Failed to start PM2: ${err.message}`);
      cleanup();
    });
}
