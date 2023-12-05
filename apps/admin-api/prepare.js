const fs = require('fs')

const content = 'TOKEN_SECRET='+require('crypto').randomBytes(64).toString('hex')+"\n"
if(!fs.existsSync('./../../.env')) {
    fs.writeFileSync('./../../.env', content)
} else {
    const fileContent = fs.readFileSync('./../../.env').toString()
    if(!fileContent.includes('TOKEN_SECRET')) {
        fs.appendFileSync(content)
    }
}