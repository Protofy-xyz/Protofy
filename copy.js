const fs = require('fs');
const path = require('path');
const { mkdirpSync } = require('mkdirp');
const ignore = require('ignore');

const sourceDir = '.';
const targetDir = path.join('./data/environments', process.argv[2] || 'prod');

// Función para leer y dividir las reglas de un archivo .gitignore
function readAndSplitGitIgnore(filePath) {
  const gitIgnoreContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
  return gitIgnoreContent.split(/\r?\n/).filter((rule) => rule.trim() !== '');
}

function copyFiles(source, target, ignoreList) {
  mkdirpSync(target);

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    const stat = fs.statSync(sourcePath);
    const relativePath = path.relative(sourceDir, sourcePath);
    const ig = ignore().add(ignoreList);

    if (!ig.ignores(relativePath) && file != '.git') {
      if (stat.isDirectory()) {
        const dirGitIgnorePath = path.join(sourcePath, '.gitignore');
        const dirGitIgnoreRules = readAndSplitGitIgnore(dirGitIgnorePath);
        copyFiles(sourcePath, targetPath, [...ignoreList, ...dirGitIgnoreRules]);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`File copied successfully: ${sourcePath}`);
      }
    }
  });
}

// Utiliza la función para leer y dividir las reglas del archivo .gitignore
const gitIgnorePath = path.join(sourceDir, '.gitignore');
const gitIgnoreRules = readAndSplitGitIgnore(gitIgnorePath);

copyFiles(sourceDir, targetDir, gitIgnoreRules);