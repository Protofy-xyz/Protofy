const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const title = args[0];
const jobStatus = args[1];
const runnerTempDir = args[2]

const getTitle = () => {
    if(title.toLowerCase().includes('docker')){
        return '🐳' + title
    }
    return title
}
const getStatusIndicator = () => {
    const STATUS = {
        success: '🟢',
        failure: '🔴',
        cancelled: '🟠'
    }
    return STATUS[jobStatus] ?? "❓"
}

const getContent = () => `${getTitle()}: ${getStatusIndicator()}`+'\n'

const main = async () => {
    fs.writeFileSync(path.join(runnerTempDir, "result.txt"), getContent(), 'utf8')
}
main()
