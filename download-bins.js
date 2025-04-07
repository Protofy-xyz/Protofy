const fs = require('fs');
const https = require('https');
const path = require('path');
const AdmZip = require('adm-zip');
const tar = require('tar');
const os = require('os');
const { chmodSync, renameSync, unlinkSync, mkdirSync, existsSync } = fs;

const version = 'v20.17.0';
const baseUrl = `https://nodejs.org/dist/${version}`;

const targets = {
  win: {
    url: `${baseUrl}/node-${version}-win-x64.zip`,
    out: 'node-win.exe',
    extract: async (archivePath, outputPath) => {
      const zip = new AdmZip(archivePath);
      const entry = zip.getEntries().find(e => e.entryName.endsWith('node.exe'));
      if (!entry) throw new Error('❌ No se encontró node.exe en el ZIP');
      zip.extractEntryTo(entry.entryName, path.dirname(outputPath), false, true);
      renameSync(path.join(path.dirname(outputPath), 'node.exe'), outputPath);
    }
  },
  linux: {
    url: `${baseUrl}/node-${version}-linux-x64.tar.gz`,
    out: 'node-linux',
    extract: async (archivePath, outputPath) => {
      await tar.x({
        file: archivePath,
        cwd: path.dirname(outputPath),
        filter: p => p.endsWith('/bin/node'),
        strip: 1,
      });
      const extracted = path.join(path.dirname(outputPath), 'bin', 'node');
      renameSync(extracted, outputPath);
      chmodSync(outputPath, 0o755);
    }
  },
  mac: {
    url: `${baseUrl}/node-${version}-darwin-x64.tar.gz`,
    out: 'node-macos',
    extract: async (archivePath, outputPath) => {
      await tar.x({
        file: archivePath,
        cwd: path.dirname(outputPath),
        filter: p => p.endsWith('/bin/node'),
        strip: 1,
      });
      const extracted = path.join(path.dirname(outputPath), 'bin', 'node');
      renameSync(extracted, outputPath);
      chmodSync(outputPath, 0o755);
    }
  }
};

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function setupPlatform(key, config) {
  const archivePath = path.join('bin', path.basename(config.url));
  const finalPath = path.join('bin', config.out);

  console.log(`⬇️  Descargando ${key}...`);
  await download(config.url, archivePath);

  console.log(`📦 Extrayendo ${key}...`);
  try {
    await config.extract(archivePath, finalPath);
  } catch (err) {
    console.error(`❌ Error extrayendo ${key}:`, err);
    return;
  }

  console.log(`🧹 Eliminando archivo temporal ${path.basename(archivePath)}`);
  unlinkSync(archivePath);
  console.log(`✅ ${key} listo -> ${config.out}`);
}

async function main() {
  if (!existsSync('bin')) mkdirSync('bin');
  for (const [key, config] of Object.entries(targets)) {
    await setupPlatform(key, config);
  }
}

main().catch(err => {
  console.error('❌ Error general:', err);
  process.exit(1);
});
