import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { StateMachineDefinitionModel } from "./stateMachineDefinitionSchema";

const StateMachineDefinitionsDir = (root) => fspath.join(root, "/packages/app/bundles/custom/stateMachines")
const getFSM = (fsmPath, req) => {
    return {
        name: fsmPath.replace(/\.[^/.]+$/, ""), //remove extension
    }
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const files = (await fs.readdir(StateMachineDefinitionsDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(StateMachineDefinitionsDir(getRoot(req)), f)).isDirectory() && f.endsWith('.ts'))
            const stateMachineDefinitions = await Promise.all(files.map(async f => getFSM(f, req)));

            for (const machineDefinition of stateMachineDefinitions) {
                if (machineDefinition) yield [machineDefinition.name, JSON.stringify(machineDefinition)];
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
export const StateMachinesDefinitionsApi = (app, context) => {
    const autoAPI = AutoAPI({
        modelName: 'statemachinedefinition',
        modelType: StateMachineDefinitionModel,
        prefix: '/adminapi/v1/',
        getDB: getDB,
        connectDB: () => new Promise(resolve => resolve(null)),
        requiresAdmin: ['*'],
        useEventEnvironment: false,
        useDatabaseEnvironment: false
    })
    autoAPI(app, context)
}

