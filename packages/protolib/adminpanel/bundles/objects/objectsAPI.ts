import { ObjectModel } from ".";
import { CreateApi } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';


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
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'def' && args.length && args[0].getText() == def;
    });
    return callsToDef
}

const getSchemas = async () => {
    const project = new Project();
    const SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/schemas.ts")
    const sourceFile = project.addSourceFileAtPath(SchemaFile)
    const definitions = getDefinitions(sourceFile, '"schemas"')

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
    let SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/schemas.ts")
    let sourceFile = project.addSourceFileAtPath(SchemaFile)
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
                        obj[prop.getName()] = {
                            type: "string",
                            modifiers: [
                                {name: "display"}
                            ]
                        }
                    }
                });
            }
            return obj
        }, {})
    }

    return {name: idSchema, id: idSchema, keys: keys}
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

        },

        async get(key) {
            
            return JSON.stringify(await getSchema(key))
        }
    };

    return db;
}

export const ObjectsAPI = (app) => CreateApi('objects', ObjectModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)