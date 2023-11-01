import { ObjectModel } from ".";
import { CreateApi } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import axios from 'axios';


const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";

const getImport = (identifier, sourceFile) => {
    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDeclaration of importDeclarations) {
        const namedImports = importDeclaration.getNamedImports();
        for (const namedImport of namedImports) {
            if (namedImport.getName() === identifier) {
                return importDeclaration.getModuleSpecifierValue();
            }
        }
        const defaultImport = importDeclaration.getDefaultImport();
        if (defaultImport && defaultImport.getText() === identifier) {
            return importDeclaration.getModuleSpecifierValue();
        }
    }
}

const getDefinitions = (sourceFile, def) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

    const callsToDef = callExpressions.filter(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    });
    return callsToDef
}

const getSourceFile = () => {
    const project = new Project();
    const SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/schemas.ts")
    const sourceFile = project.addSourceFileAtPath(SchemaFile)
    return sourceFile
}

const getSchemas = async (sourceFile?) => {
    const definitions = getDefinitions(sourceFile??getSourceFile(), '"schemas"')

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

function extractChainCalls(callExpr) {
    const calls = [];

    let currentExpression = callExpr;
    while (currentExpression && currentExpression.getKind() === SyntaxKind.CallExpression) {
        const signature = {
            name: currentExpression.getExpression().getLastChild().getText(),
            params: currentExpression.getArguments().map(arg => arg.getText())
        };
        calls.unshift(signature);

        // Navegamos al CallExpression padre o PropertyAccessExpression
        currentExpression = currentExpression.getExpression().getFirstChildIfKind(SyntaxKind.CallExpression);
    }
    return calls;
}


const getSchema = async (idSchema) => {
    let project = new Project();
    let SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/schemas.ts")
    let sourceFile = project.addSourceFileAtPath(SchemaFile)
    const schemas = await getSchemas(sourceFile)
    const currentSchema = schemas.find(s => s.id == idSchema)

    const path = fspath.join("../../packages", getImport(idSchema, sourceFile))
    project = new Project();
    sourceFile = project.addSourceFileAtPath(path+".ts")
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
                        if(chain.length) {
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

    return {name: currentSchema.name, id: idSchema, keys: keys}
}

const setSchema = (path, content) => {
    let project = new Project();
    let SchemaFile = fspath.join(path)
    let sourceFile = project.addSourceFileAtPath(SchemaFile)
    const definitions = getDefinitions(sourceFile, '"schema"')
    if(!definitions.length) {
        throw "No schema marker found for file: "+path
    }
    const definition = definitions[0]
    console.log('definitions: ', definition)

    if (definition.getArguments().length > 1) {
        const secondArgument = definition.getArguments()[1];
        secondArgument.replaceWithText(content);
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

        /*
        {
  "name": "event",
  "id": "EventSchema",
  "keys": {
    "path": {
      "type": "string",
      "params": [],
      "modifiers": [
        {
          "name": "search",
          "params": []
        },
        {
          "name": "display",
          "params": []
        }
      ]
    },
    "from": {
      "type": "string",
      "params": [],
      "modifiers": [
        {
          "name": "search",
          "params": []
        },
        {
          "name": "display",
          "params": []
        }
      ]
    },
    "user": {
      "type": "string",
      "params": [],
      "modifiers": [
        {
          "name": "generate",
          "params": [
            "(obj) => 'me'"
          ]
        },
        {
          "name": "search",
          "params": []
        }
      ]
    },
    "payload": {
      "type": "record",
      "params": [
        "z.number()"
      ],
      "modifiers": [
        {
          "name": "search",
          "params": []
        },
        {
          "name": "display",
          "params": []
        }
      ]
    },
    "created": {
      "type": "string",
      "params": [],
      "modifiers": [
        {
          "name": "generate",
          "params": [
            "(obj) => moment().toISOString()"
          ]
        },
        {
          "name": "search",
          "params": []
        }
      ]
    },
    "status": {
      "type": "display",
      "params": [],
      "modifiers": []
    },
    "lastUpdated": {
      "type": "string",
      "params": [],
      "modifiers": [
        {
          "name": "generate",
          "params": [
            "(obj) => moment().toISOString()"
          ]
        },
        {
          "name": "search",
          "params": []
        }
      ]
    }
  }
}
*/
        async put(key, value) {
            value = JSON.parse(value)
            let exists
            const filePath = PROJECT_WORKSPACE_DIR + 'packages/app/bundles/custom/schemas/'+value.name.replace(/[^a-zA-Z0-9_.-]/g, '')+'.ts'
            try {
                await fs.access(filePath, fs.constants.F_OK)
                exists = true
            } catch(error) {
                exists = false
            }

            if(exists) {
                console.log('File: ' + filePath + ' already exists, not executing template')
            } else {
                await axios.post('http://localhost:8080/adminapi/v1/templates/file', {
                    name: value.name+'.ts',
                    data: {
                        options: {template: '/packages/protolib/adminpanel/bundles/objects/templateSchema.tpl', variables: {name: value.name.charAt(0).toUpperCase() + value.name.slice(1)}},
                        path: '/packages/app/bundles/custom/schemas'
                    }
                })
            }

            const result = "{"+Object.keys(value.keys).reduce((total, current, i) => {
                const v = value.keys[current]
                return total + "\n\t" + current + ": " + "z." + v.type + "("+ (v.params && v.params.length ? v.params.join(',') : '') + ")" + v.modifiers.reduce((total, current) => total + '.' + current.name + "(" + (current.params && current.params.length ?current.params.join(','):'') + ")" , '') + ","
            }, '').slice(0, -1)+"\n}"

            console.log('result: ', result)

            await setSchema(filePath, result)
        },

        async get(key) {
            return JSON.stringify(await getSchema(key))
        }
    };

    return db;
}

export const ObjectsAPI = (app) => CreateApi('objects', ObjectModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)