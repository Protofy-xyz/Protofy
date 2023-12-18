const fs = require('fs');
const path = require('path');
const { mkdirpSync } = require('mkdirp');
const ignore = require('ignore');
const { fdir } = require("fdir");
const async = require('async');

console.time("runtime")
const sourceDir = '.';
const targetDir = path.join('./data/environments', process.argv[2] || 'prod');


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
      }
    }
  });
}

async function copyFile(source) {
  const stat = await fs.promises.lstat(source)
  if(stat.isDirectory()) {
    await fs.promises.mkdir(path.join(targetDir, source))
  } else {
    await fs.copyFile(source, path.join(targetDir, source));
  }
}

const gitIgnorePath = path.join(sourceDir, '.gitignore');
const gitIgnoreRules = readAndSplitGitIgnore(gitIgnorePath);

copyFiles(sourceDir, targetDir, gitIgnoreRules);
console.log('Base files copied, copying node_modules....')
const api = new fdir().withDirs().withBasePath().crawl("node_modules");
const files = api.sync();

const maxParallelCopies = 16;
const queue = async.queue(async function (task, completed) {
  await copyFile(task);
  completed();
}, maxParallelCopies);
files.forEach(file => queue.push(file));

queue.drain(function() {
  console.log('Done!');
  console.timeEnd("runtime")
});