import { BoardModel } from "./boardsSchemas";
import { AutoAPI, getRoot } from 'protonode'
import { API } from 'protobase'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';

const BoardsDir = (root) => fspath.join(root, "/data/boards/")

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            // console.log("Iterator")
            //check if boards folder exists
            try {
                await fs.access(BoardsDir(getRoot(req)), fs.constants.F_OK)
            } catch (error) {
                console.log("Creating boards folder")
                await fs.mkdir(BoardsDir(getRoot(req)))
            }
            //list all .json files in the boards folder
            const files = (await fs.readdir(BoardsDir(getRoot(req)))).filter(f => {
                const filenameSegments = f.split('.')
                return !fsSync.lstatSync(fspath.join(BoardsDir(getRoot(req)), f)).isDirectory() && (filenameSegments[filenameSegments.length - 1] === "json")
            })
            // console.log("Files: ", files)
            for (const file of files) {
                //read file content
                const fileContent = await fs.readFile(BoardsDir(getRoot(req)) + file, 'utf8')
                yield [file.name, fileContent];
            }
        },

        async del(key, value) {
            // delete boards[key]
            // try to delete the board file from the boards folder
            console.log("Deleting board: ", JSON.stringify({key,value}))
            const filePath = BoardsDir(getRoot(req)) + key + ".json"
            try {
                await fs.unlink(filePath)
            } catch (error) {
                console.log("Error deleting file: " + filePath)
            }
        },

        async put(key, value) {
            // try to create the board file in the boards folder
            // console.log("Creating board: ", JSON.stringify({key,value}))
            const filePath = BoardsDir(getRoot(req)) + key + ".json"
            try{
                await fs.writeFile(filePath, value)
            }catch(error){
                console.error("Error creating file: " + filePath, error)
            }
        },

        async get(key) {
            // try to get the board file from the boards folder
            // console.log("Get function: ",key)
            const filePath = BoardsDir(getRoot(req)) + key + ".json"
            try{
                const fileContent = await fs.readFile(filePath, 'utf8')
                // console.log("fileContent: ", fileContent)
                // console.log("filePath: ", filePath)
                return fileContent
            }catch(error){
                // console.log("Error reading file: " + filePath)
                throw new Error("File not found")
            }                   
        }
    };

    return db;
}

export const BoardsAPI = AutoAPI({
    modelName: 'boards',
    modelType: BoardModel,
    initialData: {},
    skipDatabaseIndexes: true,
    getDB: getDB,
    prefix: '/api/core/v1/'
})