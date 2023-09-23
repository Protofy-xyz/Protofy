const fs = require('fs')

if(!fs.existsSync('./.env')) {
    fs.copyFileSync('../api/.env', '.env')
}