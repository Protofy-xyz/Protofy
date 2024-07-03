import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from '../../api'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { FSMModel } from "./FSMSchema";

const FSMDir = (root) => fspath.join(root, "/packages/app/bundles/custom/fsm/")
const getFSM = (fsmPath, req)=>{
    return {
        name: fsmPath.replace(/\.[^/.]+$/, ""), //remove extension
    }
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const files = (await fs.readdir(FSMDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(FSMDir(getRoot(req)), f)).isDirectory() && f.endsWith('.ts'))
            const fsms = await Promise.all(files.map(async f => getFSM(f, req)));
      
            for (const fsm of fsms) {
              if (fsm) yield [fsm.name, JSON.stringify(fsm)];
            }
        },

        async del(key, value) {
            value = JSON.parse(value)

        },

        async put(key, value) {
            value = JSON.parse(value)

        },

        async get(key) {
            return JSON.stringify({ name: key })
        }
    };

    return db;
}

export const FSMApi = AutoAPI({
    modelName: 'fsm',
    modelType: FSMModel,
    prefix: '/adminapi/v1/',
    getDB: getDB,
    connectDB: () => new Promise(resolve => resolve(null)),
    requiresAdmin: ['*'],
    useEventEnvironment: false,
    useDatabaseEnvironment: false
})