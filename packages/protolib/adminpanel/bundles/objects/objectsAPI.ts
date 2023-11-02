import { ObjectModel } from ".";
import { CreateApi } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import axios from 'axios';


const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const indexFile = "/packages/app/bundles/custom/schemas/index.ts"

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
    const SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, indexFile)
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
    let SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, indexFile)
    let sourceFile = project.addSourceFileAtPath(SchemaFile)
    const schemas = await getSchemas(sourceFile)
    const currentSchema = schemas.find(s => s.id == idSchema)
    const path = fspath.join("../../packages/app/bundles/custom/schemas/", getImport(idSchema, sourceFile))
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

function isKeyImportedInFile(sourceFile, key: string): boolean {
  const imports = sourceFile.getImportDeclarations();

  for (const imp of imports) {
      // get named imports, like: { Users } from '...'
      const namedImports = imp.getNamedImports();
      for (const namedImport of namedImports) {
          if (namedImport.getName() === key) {
              return true;
          }
      }

      // get default import, like: Users from '...'
      const defaultImport = imp.getDefaultImport();
      if (defaultImport && defaultImport.getText() === key) {
          return true;
      }
  }

  return false;
}

enum ImportType {
  DEFAULT,
  NAMED
}

function addImportToSourceFile(sourceFile, key: string, type: ImportType, path: string): void {
  // Verificar si el key ya ha sido importado
  if (isKeyImportedInFile(sourceFile, key)) {
      console.warn(`El key "${key}" ya ha sido importado en el archivo.`);
      return;
  }

  // Agregar import en función de su tipo
  switch (type) {
      case ImportType.DEFAULT:
          sourceFile.addImportDeclaration({
              defaultImport: key,
              moduleSpecifier: path
          });
          break;
      case ImportType.NAMED:
          sourceFile.addImportDeclaration({
              namedImports: [key],
              moduleSpecifier: path
          });
          break;
  }
}

function addObjectLiteralProperty(objectLiteral: ObjectLiteralExpression, key: string, value: string): void {
  // Verificar si el ObjectLiteralExpression ya tiene esa key
  const property = objectLiteral.getProperty(key);
  
  if (property) {
      console.warn(`Object already has key: "${key}".`);
      return;
  }

  // Agregar la nueva propiedad con el value correspondiente
  objectLiteral.addPropertyAssignment({
      name: key,
      initializer: value
  });
}


const setSchema = (path, content, value) => {
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

    //link in index.ts
    project = new Project();
    SchemaFile = fspath.join(PROJECT_WORKSPACE_DIR, indexFile)
    sourceFile = project.addSourceFileAtPath(SchemaFile)

    addImportToSourceFile(sourceFile, value.id, ImportType.NAMED, './'+value.name)

    const linkDefinitions = getDefinitions(sourceFile, '"schemas"')
    if(!linkDefinitions.length) {
      throw "No link definition schema marker found for file: "+path
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
                const modifiers = v.modifiers ? v.modifiers.reduce((total, current) => total + '.' + current.name + "(" + (current.params && current.params.length ?current.params.join(','):'') + ")" , '') : ''
                return total + "\n\t" + current + ": " + "z." + v.type + "("+ (v.params && v.params.length ? v.params.join(',') : '') + ")" + modifiers + ","
            }, '').slice(0, -1)+"\n}"


            await setSchema(filePath, result, value)
        },

        async get(key) {
            return JSON.stringify(await getSchema(key))
        }
    };

    return db;
}

export const ObjectsAPI = (app) => CreateApi('objects', ObjectModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)