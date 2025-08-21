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
                const filenameSegments = f.split('.')
                return !fsSync.lstatSync(fspath.join(dirPath, f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === "json")
            })
            // console.log("Files: ", files)
            for (const file of files) {
                //read file content
                const fileContent = await fs.readFile(dirPath + file, 'utf8')
                yield [file.replace(/\.json$/, ""), fileContent]
            }
        },

        async del(key, value) {
            if(key == 'all') {
                throw new Error("Cannot modify 'all' key")
            }
            console.log("Deleting key: ", JSON.stringify({ key, value }))
            const filePath = fspath.join(dirPath, key + ".json");
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.log("Error deleting file: " + filePath)
            }
        },

        async put(key, value) {
            if(key == 'all') {
                throw new Error("Cannot modify 'all' key")
            }
            const filePath = fspath.join(dirPath, key + ".json");
            try {
                await fs.writeFile(filePath, value)
            } catch (error) {
                console.error("Error creating file: " + filePath, error)
            }
        },

        async get(key) {
            if(key == 'all') {
                //iterate over dirPath, and combine all jsons
                let combined = {};
                for await (const [file, content] of db.iterator()) {
                    const {name, value} = JSON.parse(content)
                    combined = {...combined, [name]: value}
                }
                return JSON.stringify(combined);
            }
            const filePath = fspath.join(dirPath, key + ".json");
            try {
                const fileContent = await fs.readFile(filePath, 'utf8')
                return fileContent
            } catch (error) {
                throw new Error("File not found")
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
}