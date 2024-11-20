import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API } from 'protobase'
import { StateMachineDefinitionModel } from "./stateMachineDefinitionSchema";
import { getServiceToken } from '../../apis/context';
import { params, paramsHandlers } from '../handlers';

const StateMachineDefinitionsDir = (root) => fspath.join(root, "/packages/app/stateMachines/")
const StateMachineDefinitionsIndex = fspath.join(StateMachineDefinitionsDir(getRoot()), 'index.ts')

const getStateMachine = (fsmPath, req) => {
    const sourceFile = getSourceFile(fsmPath)
    const machineDefinitionCode = "return " + getDefinition(sourceFile, '"machineDefinition"').getText()
    const machineDefinitionParser = new Function(...params, machineDefinitionCode)
    const { on, ...machineDefinition } = machineDefinitionParser(...paramsHandlers)

    return {
        name: fspath.basename(fsmPath, fspath.extname(fsmPath)), //remove extension
        ...{
            ...machineDefinition,
            states: Object.keys(machineDefinition.states)
        }
    }
}

const linkToIndex = (sourcePath, importName, from) => {
    const sourceFile = getSourceFile(sourcePath)
    addImportToSourceFile(sourceFile, importName, ImportType.DEFAULT, from)

    const arg = getDefinition(sourceFile, '"machines"')
    if (!arg) {
        throw "No link definition schema marker found for file: " + sourcePath
    }
    addObjectLiteralProperty(arg, importName, importName)
    sourceFile.saveSync();
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const files = (await fs.readdir(StateMachineDefinitionsDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(StateMachineDefinitionsDir(getRoot(req)), f)).isDirectory() && f.endsWith('.ts'))
            const stateMachineDefinitions = await Promise.all(files.map(async f => getStateMachine(fspath.join(StateMachineDefinitionsDir(getRoot(req)), fspath.basename(f)), req)));

            for (const machineDefinition of stateMachineDefinitions) {
                if (machineDefinition) yield [machineDefinition.name, JSON.stringify(machineDefinition)];
            }
        },

        async del(key, value) {
            value = JSON.parse(value)

        },

        async put(key, value) {
            value = JSON.parse(value)

            const machineDefinitionFilePath = fspath.join(StateMachineDefinitionsDir(getRoot(req)), fspath.basename(value.name) + '.ts')
            const template = "defaultStateMachine" // for the moment hardcoded template only
            const machineData = {
                machineName: value.name ?? "defaultName",
                machineContext: JSON.stringify(value.context ?? {}, null, 4),
                machineStates: value.states,
                machineInitialState: value.states.length ? value.states[0] : "",
                machineTransitions: JSON.stringify(value.transitions ?? {}, null, 4)
            }

            try {
                // check if file already exists
                await fs.access(machineDefinitionFilePath, fs.constants.F_OK)
            } catch (e) {
                // machineFile
                const machineName = fspath.basename(value.name)
                // create machine file with template
                const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
                    name: machineName + ".ts",
                    data: {
                        options: {
                            template: `/packages/protolib/src/bundles/stateMachines/templates/${template}.tpl`,
                            variables: {
                                ...value,
                                ...machineData
                            }
                        },
                        path: StateMachineDefinitionsDir(getRoot(req))
                    }
                })

                if (result.isError) {
                    console.error("Error executing template: ", result)
                    throw result.error
                }

                linkToIndex(StateMachineDefinitionsIndex, value.name, "./" + machineName)
            }
        },

        async get(key) {
            const sm = getStateMachine(fspath.join(StateMachineDefinitionsDir(getRoot(req)), fspath.basename(key + '.ts')), req)
            return JSON.stringify(sm)
        }
    };

    return db;
}
export const StateMachinesDefinitionsApi = (app, context) => {
    const autoAPI = AutoAPI({
        modelName: 'statemachinedefinition',
        modelType: StateMachineDefinitionModel,
        prefix: '/api/core/v1/',
        getDB: getDB,
        connectDB: () => new Promise(resolve => resolve(null)),
        requiresAdmin: ['*']
    })
    autoAPI(app, context)
}

