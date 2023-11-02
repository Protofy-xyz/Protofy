import { ObjectModel } from ".";
import { CreateApi, getImport, getDefinitions, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import axios from 'axios';

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const indexFile = "/packages/app/bundles/custom/schemas/index.ts"

const getSchemas = async (sourceFile?) => {
    const definitions = getDefinitions(sourceFile ?? getSourceFile(fspath.join(PROJECT_WORKSPACE_DIR, indexFile)), '"schemas"')

    if (definitions.length) {
        const schemas = definitions.reduce((obj, current) => {
            const node = current.getArguments()[1]
            if (node instanceof ObjectLiteralExpression) {
                node.getProperties().forEach(prop => {
                    if (prop instanceof PropertyAssignment) {
                        // obj[prop.getName()] = prop.getInitializer().getText();
                        obj.push({ name: prop.getName(), id: prop.getInitializer().getText() }) //= prop.getInitializer().getText();
                    }
                });
            }
            return obj
        }, [])
        console.log(schemas)
        return schemas
    }
    return []
}

const getSchema = async (idSchema) => {
    let project = new Project();
    let SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, indexFile)
    let sourceFile = project.addSourceFileAtPath(SchemaFile)
    const schemas = await getSchemas(sourceFile)
    const currentSchema = schemas.find(s => s.id == idSchema)
    const path = fspath.join("../../packages/app/bundles/custom/schemas/", getImport(sourceFile, idSchema))
    project = new Project();
    sourceFile = project.addSourceFileAtPath(path + ".ts")
    const definitions = getDefinitions(sourceFile, '"schema"')
    let keys = []
    if (definitions.length) {
        keys = definitions.reduce((obj, current) => {
            const node = current.getArguments()[1]
            if (node instanceof ObjectLiteralExpression) {
                node.getProperties().forEach(prop => {
                    if (prop instanceof PropertyAssignment) {
                        // obj[prop.getName()] = prop.getInitializer().getText();
                        const chain = extractChainCalls(prop.getInitializer())
                        if (chain.length) {
                            const typ = chain.shift()
                            obj[prop.getName()] = {
                                type: typ.name,
                                params: typ.params,
                                modifiers: chain
                            }
                        }
                    }
                });
            }
            return obj
        }, {})
    }
    return { name: currentSchema.name, id: idSchema, keys: keys }
}

const setSchema = (path, content, value) => {
    let project = new Project();
    let SchemaFile = fspath.join(path)
    let sourceFile = project.addSourceFileAtPath(SchemaFile)
    const definitions = getDefinitions(sourceFile, '"schema"')
    if (!definitions.length) {
        throw "No schema marker found for file: " + path
    }
    const definition = definitions[0]
    console.log('definitions: ', definition)

    if (definition.getArguments().length > 1) {
        const secondArgument = definition.getArguments()[1];
        secondArgument.replaceWithText(content);
    }

    sourceFile.saveSync();

    //link in index.ts
    project = new Project();
    SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, indexFile)
    sourceFile = project.addSourceFileAtPath(SchemaFile)

    addImportToSourceFile(sourceFile, value.id, ImportType.NAMED, './' + value.name)

    const linkDefinitions = getDefinitions(sourceFile, '"schemas"')
    if (!linkDefinitions.length) {
        throw "No link definition schema marker found for file: " + path
    }

    const linkDef = linkDefinitions[0]
    console.log('linkdef: ', linkDef)
    if (linkDef.getArguments().length > 1) {
        const secondArgument = linkDef.getArguments()[1];
        console.log('second argument: ', secondArgument)
        //secondArgument.replaceWithText(content);
        addObjectLiteralProperty(secondArgument, value.name, value.id)
    }
    sourceFile.saveSync();
}

const getDB = (path, req, session) => {
    const db = {
        async *iterator() {
            const schemas = await getSchemas();
            for (const schema of schemas) {
                yield [schema.name, JSON.stringify(schema)];
            }
        },

        async put(key, value) {
            value = JSON.parse(value)
            let exists
            const filePath = PROJECT_WORKSPACE_DIR + 'packages/app/bundles/custom/schemas/' + value.name.replace(/[^a-zA-Z0-9_.-]/g, '') + '.ts'
            try {
                await fs.access(filePath, fs.constants.F_OK)
                exists = true
            } catch (error) {
                exists = false
            }

            if (exists) {
                console.log('File: ' + filePath + ' already exists, not executing template')
            } else {
                await axios.post('http://localhost:8080/adminapi/v1/templates/file', {
                    name: value.name + '.ts',
                    data: {
                        options: { template: '/packages/protolib/adminpanel/bundles/objects/templateSchema.tpl', variables: { name: value.name.charAt(0).toUpperCase() + value.name.slice(1) } },
                        path: '/packages/app/bundles/custom/schemas'
                    }
                })
            }

            const result = "{" + Object.keys(value.keys).reduce((total, current, i) => {
                const v = value.keys[current]
                const modifiers = v.modifiers ? v.modifiers.reduce((total, current) => total + '.' + current.name + "(" + (current.params && current.params.length ? current.params.join(',') : '') + ")", '') : ''
                return total + "\n\t" + current + ": " + "z." + v.type + "(" + (v.params && v.params.length ? v.params.join(',') : '') + ")" + modifiers + ","
            }, '').slice(0, -1) + "\n}"


            await setSchema(filePath, result, value)
        },

        async get(key) {
            return JSON.stringify(await getSchema(key))
        }
    };

    return db;
}

export const ObjectsAPI = (app) => CreateApi('objects', ObjectModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)