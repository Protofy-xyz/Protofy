const path = require('path');
const fs = require('fs');

module.exports = async function (context) {
  if (process.platform === 'darwin') {
    const appPath = context.appOutDir;
    const resourcesPath = path.join(appPath, 'Vento.app', 'Contents', 'Resources', 'app');

    console.log('📦 afterPack: copying project files to', resourcesPath);

    const sourceDir = path.resolve(__dirname, '..');
    const destDir = resourcesPath;

    function copyRecursiveSync(src, dest) {
      // Saltar node_modules, .git y logs
      const skip = ['node_modules', '.git'];
      const basename = path.basename(src);

      if (skip.some(pattern => basename === pattern || basename.match(new RegExp(pattern)))) {
        return;
      }

      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        for (const file of fs.readdirSync(src)) {
          copyRecursiveSync(path.join(src, file), path.join(dest, file));
        }
      } else if (stats.isFile()) {
        fs.copyFileSync(src, dest);
      }
    }

    copyRecursiveSync(sourceDir, destDir);

    console.log('✅ afterPack: copy complete');
  }
};