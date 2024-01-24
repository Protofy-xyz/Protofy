const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const matrixOS = args[0];
const jobStatus = args[1];
const runnerTempDir = args[2]

const main = async () => {
    const STATUS = {
        success: '🟢',
        failure: '🔴',
        cancelled: '🟠'
    }
    const content = `${matrixOS}: ${STATUS[jobStatus] ?? "❓"}`;
    fs.writeFileSync(path.join(runnerTempDir, "result.txt"), content)
}
main()
