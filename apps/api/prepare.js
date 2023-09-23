const fs = require('fs')

if(!fs.existsSync('./.env')) {
    fs.writeFileSync('./.env', 'TOKEN_SECRET='+require('crypto').randomBytes(64).toString('hex'))
}
