import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API } from 'protobase'
import { StateMachineDefinitionModel } from "./stateMachineDefinitionSchema";
import { getServiceToken } from '../../apis/context';

const StateMachineDefinitionsDir = (root) => fspath.join(root, "/packages/app/bundles/custom/stateMachines/")
const getStateMachine = (fsmPath, req) => {
    const sourceFile = getSourceFile(fspath.join(StateMachineDefinitionsDir(getRoot(req)), fsmPath))
    const machineDefinitionCode = getDefinition(sourceFile, '"machineDefinition"').getText()
    const machineDefinitionParser = new Function("return " + machineDefinitionCode)
    const {on, ...machineDefinition} = machineDefinitionParser()
    
    return {
        name: fsmPath.replace(/\.[^/.]+$/, ""), //remove extension
        ...{
            ...machineDefinition, 
            states: Object.keys(machineDefinition.states)
        }
    }
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const files = (await fs.readdir(StateMachineDefinitionsDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(StateMachineDefinitionsDir(getRoot(req)), f)).isDirectory() && f.endsWith('.ts'))
            const stateMachineDefinitions = await Promise.all(files.map(async f => getStateMachine(f, req)));

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
                machineTransitions: JSON.stringify(value.transitions ?? {}, null, 4)
            }

            try {
                // check if file already exists
                await fs.access(machineDefinitionFilePath, fs.constants.F_OK)
            } catch (e) {
                // create machine file with template
                const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
                    name: fspath.basename(value.name + '.tsx'),
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
            }
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

