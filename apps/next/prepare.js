const fs = require('fs')

const content = `IGNORE_TS_CONFIG_PATHS=true
TAMAGUI_TARGET=web
TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1
`

if(!fs.existsSync('./../../.env')) {
    fs.appendFileSync('./../../.env', content)
} else {
    const fileContent = fs.readFileSync('./../../.env').toString()
    if(!fileContent.includes('TAMAGUI_TARGET')) {
        fs.appendFileSync('./../../.env', content)
    }
}