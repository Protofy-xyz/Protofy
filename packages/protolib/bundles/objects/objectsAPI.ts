import { ObjectModel } from ".";
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, removeImportFromSourceFile, removeObjectLiteralProperty, AutoAPI, getRoot } from '../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import {getServiceToken} from 'protolib/api/lib/serviceToken'
import {API} from 'protolib/base'

const indexFile = "/packages/app/bundles/custom/objects/index.ts"

const getSchemas = async (req, sourceFile?) => {
  const node = getDefinition(
    sourceFile ?? getSourceFile(fspath.join(getRoot(req), indexFile)),
    '"objects"'
  );

  if (node) {
    if (node instanceof ObjectLiteralExpression) {
      const schemaPromises = node.getProperties().map(prop => {
        if (prop instanceof PropertyAssignment) {
          const schemaId = prop.getInitializer().getText();
          return getSchema(schemaId, [], req, prop.getName()).then(schema => ({
            name: prop.getName(), 
            features: schema.features, 
            id: schemaId 
          }));
        }
      }).filter(p => p);

      const schemas = await Promise.all(schemaPromises);
      return schemas;
    }
  }
  return [];
}

const getSchema = async (idSchema, schemas, req, name?) => {
  let SchemaFile = fspath.join(getRoot(req), indexFile)
  let sourceFile = getSourceFile(SchemaFile)

  const schemaName = name ?? schemas.find(s => s.id == idSchema)?.name

  sourceFile = getSourceFile(fspath.join("../../packages/app/bundles/custom/objects/", getImport(sourceFile, idSchema)) + ".ts")
  const node = getDefinition(sourceFile, '"schema"')
  let keys = {}
  if (node) {
    if (node instanceof ObjectLiteralExpression) {
      node.getProperties().forEach(prop => {
        if (prop instanceof PropertyAssignment) {
          // obj[prop.getName()] = prop.getInitializer().getText();
          const chain = extractChainCalls(prop.getInitializer())
          if (chain.length) {
            const typ = chain.shift()
            keys[prop.getName()] = {
              type: typ.name,
              params: typ.params,
              modifiers: chain
            }
          }
        }
      });
    }
  }
  const featuresNode = getDefinition(sourceFile, '"features"')
  let features = {}
  if (featuresNode instanceof ObjectLiteralExpression) {
    console.log('features', featuresNode.getText())
    try {
      features = JSON.parse(featuresNode.getText())
    } catch(e) {
      console.error("Ignoring features in object: ", idSchema, "because of an error: ", e)
      console.error("Features text producing the error: ", featuresNode.getText())
    }
  }
  return { name: schemaName, features: features, id: idSchema, keys: keys }
}

const setSchema = (path, content, value, req) => {
  let sourceFile = getSourceFile(path)
  const secondArgument = getDefinition(sourceFile, '"schema"')
  if (!secondArgument) {
    throw "No schema marker found for file: " + path
  }

  secondArgument.replaceWithText(content);
  sourceFile.saveSync();

  //link in index.ts
  sourceFile = getSourceFile(fspath.join(getRoot(req), indexFile))
  addImportToSourceFile(sourceFile, value.id, ImportType.NAMED, './' + value.name)

  const arg = getDefinition(sourceFile, '"objects"')
  if (!arg) {
    throw "No link definition schema marker found for file: " + path
  }
  addObjectLiteralProperty(arg, value.name, value.id)
  sourceFile.saveSync();
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const schemas = await getSchemas(req);
      for (const schema of schemas) {
        yield [schema.name, JSON.stringify(schema)];
      }
    },

    async put(key, value) {
      value = JSON.parse(value)
      let exists
      const filePath = getRoot(req) + 'packages/app/bundles/custom/objects/' + fspath.basename(value.name) + '.ts'
      try {
        await fs.access(filePath, fs.constants.F_OK)
        exists = true
      } catch (error) {
        exists = false
      }

      if (exists) {
        console.log('File: ' + filePath + ' already exists, not executing template')
      } else {
        const result = await API.post('/adminapi/v1/templates/file?token='+getServiceToken(), {
          name: value.name + '.ts',
          data: {
            options: { template: '/packages/protolib/bundles/objects/templateSchema.tpl', variables: { name: value.name.charAt(0).toUpperCase() + value.name.slice(1), pluralName: value.name.endsWith('s') ? value.name : value.name + 's' } },
            path: '/packages/app/bundles/custom/objects'
          }
        })
        
        if(result.isError) {
          throw result.error
        }
      }

      const result = "{" + Object.keys(value.keys).reduce((total, current, i) => {
        const v = value.keys[current]
        const modifiers = v.modifiers ? v.modifiers.reduce((total, current) => total + '.' + current.name + "(" + (current.params && current.params.length ? current.params.join(',') : '') + ")", '') : ''
        return total + "\n\t" + current + ": " + "z." + v.type + "(" + (v.params && v.params.length ? v.params.join(',') : '') + ")" + modifiers + ","
      }, '').slice(0, -1) + "\n}"


      await setSchema(filePath, result, value, req)
    },

    async get(key) {
      let SchemaFile = fspath.join(getRoot(req), indexFile)
      let sourceFile = getSourceFile(SchemaFile)
      const schemas = await getSchemas(req, sourceFile)
      return JSON.stringify(await getSchema(key, schemas, req))
    }
  };

  return db;
}

export const ObjectsAPI = AutoAPI({
  modelName: 'objects',
  modelType: ObjectModel,
  initialDataDir: __dirname,
  prefix: '/adminapi/v1/',
  getDB: getDB,
  requiresAdmin: ['*']
})
