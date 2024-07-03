import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from '../../api'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { FSMModel } from "./FSMSchema";



const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const fsms = [{name: "fsm1"},{name:"fsm2"}]
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