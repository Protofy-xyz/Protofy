const { execSync } = require('child_process');

const newOrigin = process.argv[2];

if (!newOrigin) {
  console.error("You must provide a new origin url");
  process.exit(1);
}

try {
  execSync(`git remote set-url origin ${newOrigin}`);
  console.log(`New origin is: ${newOrigin}`);
} catch (error) {
  console.error(`Error changing origin: ${error.message}`);
}