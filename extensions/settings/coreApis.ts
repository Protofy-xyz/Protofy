import { SettingModel } from "./";
import { AutoAPI, getRoot } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';


const dataDir = (root) => fspath.join(root, "/data/settings/")


const getDB = (path, req, session) => {
    const dirPath = dataDir(getRoot(req));
    fs.mkdir(dirPath, { recursive: true }).catch((err) => {
        console.error("Error ensuring settings folder exists", err);
    });

    const db = {
        async *iterator() {
            const files = (await fs.readdir(dirPath)).filter(f => {
                return !fsSync.lstatSync(fspath.join(dirPath, f)).isDirectory()
            })
            // console.log("Files: ", files)
            for (const file of files) {
                //read file content
                const fileContent = await fs.readFile(dirPath + file, 'utf8')
                yield [file, JSON.stringify({ value: JSON.parse(fileContent), name: file })]
            }
        },

        async del(key, value) {
            if (key == 'all') {
                throw new Error("Cannot modify 'all' key")
            }
            console.log("Deleting key: ", JSON.stringify({ key, value }))
            const filePath = fspath.join(dirPath, key);
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.log("Error deleting file: " + filePath)
            }
        },

        async put(key, value) {
            if (key == 'all') {
                throw new Error("Cannot modify 'all' key")
            }
            const filePath = fspath.join(dirPath, key);
            const parsedValue = JSON.parse(value);
            try {
                console.log('writing: ', filePath, parsedValue)
                await fs.writeFile(filePath, JSON.stringify(parsedValue.value))
            } catch (error) {
                console.error("Error creating file: " + filePath, error)
            }
        },

        async get(key) {

            const filePath = fspath.join(dirPath, key);
            try {
                const fileContent = await fs.readFile(filePath, 'utf8')
                return JSON.stringify({ value: JSON.parse(fileContent), name: key })  
            } catch (error) {
                throw new Error("File not found: " + filePath)
            }
        }
    };

    return db;
}

const SettingsAutoAPI = AutoAPI({
    modelName: 'settings',
    modelType: SettingModel,
    prefix: '/api/core/v1/',
    dbName: 'settings',
    getDB: getDB,
    requiresAdmin: ['*']
})

export default (app, context) => {
    SettingsAutoAPI(app, context)
    const getSettings = async (req) => {
        const db = getDB('settings', req, null);
        let combined = {};
        for await (const [file, content] of db.iterator()) {
            const { name, value } = JSON.parse(content)
            combined = { ...combined, [name]: value }
        }
        return combined
    }

    app.get('/api/core/v1/settings/all', async (req, res) => {
        //iterate over dirPath and combine all json files in a single response
        const settings = await getSettings(req);
        res.json(settings);
    });

    app.get('/api/core/v1/settings.js', async (req, res) => {
        const settings = await getSettings(req);

        // cache: ajusta a tus necesidades
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');

        // seguridad básica si usas CSP: sólo si tu CSP lo permite
        // res.setHeader('Content-Security-Policy', "script-src 'self' ...");

        // Puedes incluir versión/hash si tienes un "settingsVersion" en DB
        const payload = JSON.stringify(settings);
        res.send(
            `;(function(){
        try {
          window.ventoSettings = ${payload};
          var ev = new CustomEvent('vento:settings-ready', { detail: window.ventoSettings });
          window.dispatchEvent(ev);
        } catch(e) { /* noop */ }
      })();`
        );
    });
}