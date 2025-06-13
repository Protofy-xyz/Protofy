import { KeyModel } from "./";
import { AutoAPI, getRoot } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';


const dataDir = (root) => fspath.join(root, "/data/keys/")


const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            // console.log("Iterator")
            try {
                await fs.access(dataDir(getRoot(req)), fs.constants.F_OK)
            } catch (error) {
                console.log("Creating deviceDefinitions folder")
                await fs.mkdir(dataDir(getRoot(req)))
            }
            const files = (await fs.readdir(dataDir(getRoot(req)))).filter(f => {
                const filenameSegments = f.split('.')
                return !fsSync.lstatSync(fspath.join(dataDir(getRoot(req)), f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === "json")
            })
            // console.log("Files: ", files)
            for (const file of files) {
                //read file content
                const fileContent = await fs.readFile(dataDir(getRoot(req)) + file, 'utf8')
                yield [file.name, fileContent];
            }
        },

        async del(key, value) {
            console.log("Deleting key: ", JSON.stringify({key,value}))
            const filePath = dataDir(getRoot(req)) + key + ".json"
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.log("Error deleting file: " + filePath)
            }
        },

        async put(key, value) {
            const filePath = dataDir(getRoot(req)) + key + ".json"
            try{
                await fs.writeFile(filePath, value)
            }catch(error){
                console.error("Error creating file: " + filePath, error)
            }
        },

        async get(key) {
            const filePath = dataDir(getRoot(req)) + key + ".json"
            try{
                const fileContent = await fs.readFile(filePath, 'utf8')
                return fileContent
            }catch(error){
                throw new Error("File not found")
            }                   
        }
    };

    return db;
}

const KeysAutoAPI = AutoAPI({
    modelName: 'keys',
    modelType: KeyModel, 
    prefix: '/api/core/v1/',
    dbName: 'keys',
    getDB: getDB,
    requiresAdmin: ['*']
})

export const KeysAPI = (app, context) => {
    KeysAutoAPI(app, context)
}