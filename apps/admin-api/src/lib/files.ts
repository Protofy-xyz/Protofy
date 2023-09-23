import * as fs from 'fs';
import * as path from 'path';

export function listFilesRecursively(directory) {
  const fileList = [];
  function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // If it's a directory, recursively traverse it
        traverse(filePath);
      } else {
        // If it's a file, add its full path to the list
        fileList.push(filePath);
      }
    }
  }
  traverse(directory);
  return fileList;
}

export function filterFilesByRegex(filePaths, regexArray) {
  return filePaths.filter(filePath => {
    for (const regex of regexArray) {
      if (!regex.test(filePath)) {
        return false;
      }
    }
    return true;
  });
}