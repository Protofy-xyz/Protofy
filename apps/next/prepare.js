const fs = require('fs')

if(!fs.existsSync('./.env')) {
    fs.copyFileSync('../api/.env', '.env')
    fs.appendFileSync('.env', `
IGNORE_TS_CONFIG_PATHS=true
TAMAGUI_TARGET=web
TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1
    `)
}