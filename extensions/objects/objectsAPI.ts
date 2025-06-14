import { ObjectModel } from ".";
import { getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature } from 'protonode'
import { promises as fs } from 'fs';
import syncFs from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import { getServiceToken } from 'protonode'
import { API } from 'protobase'
import { APIModel } from '@extensions/apis/APISchemas'
import { PageModel } from '@extensions/pages/pagesSchemas'

const indexFile = "/packages/app/objects/index.ts"

const getSchemas = async (req, sourceFile?) => {
  let schemas = []
  const tsFiles = syncFs.readdirSync(fspath.join(getRoot(req), 'data/objects')).filter(file => file.endsWith('.ts'))
  tsFiles.forEach(async (file) => {
    const filePath = fspath.join(getRoot(req), 'data/objects', file)
    const idSchema = file.replace('.ts', 'Model')
    const schemaName = file.replace('.ts', '')

    const objectData = await getSchemaTS(filePath, idSchema, schemaName)
    if (objectData) {
      schemas.push(objectData)
    } else {
      console.error("Ignoring schema in file: ", file, "because it could not be parsed")
    }
  })
  return schemas;
}

const getSchemaTS = async (filePath, idSchema, schemaName) => {
  let sourceFile
  try {
    sourceFile = getSourceFile(filePath)
  } catch (e) {
    return
  }
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
    try {
      features = JSON.parse(featuresNode.getText())
    } catch (e) {
      console.error("Ignoring features in object: ", idSchema, "because of an error: ", e)
      console.error("Features text producing the error: ", featuresNode.getText())
    }
  }

  const apiOptionsNode = getDefinition(sourceFile, '"api"')
  let options = {
    name: idSchema,
    prefix: '/api/v1/'
  }

  if (apiOptionsNode instanceof ObjectLiteralExpression) {
    try {
      options = JSON.parse(apiOptionsNode.getText().replaceAll(/'/g, '"'))
    } catch (e) {
      console.error("Ignoring api options in object: ", idSchema, "because of an error: ", e)
      console.error("Api options text producing the error: ", apiOptionsNode.getText())
    }
  }
  return { name: schemaName, features, id: idSchema, keys, apiOptions: options}
}


const getSchema = async (idSchema, schemas, req, name?) => {
  //list all objects in data/objects folder and check if any has a name matching the idSchema
  //if so, return that object
  const schemaName = name ?? schemas.find(s => s.id == idSchema)?.name
  const tsFile = fspath.join(getRoot(req), 'data/objects', schemaName + '.ts')
  const tsData = await getSchemaTS(tsFile, idSchema, schemaName)
  if (tsData) {
    return tsData
  }

  throw "Schema with id " + idSchema + " not found in schemas";
}


const setSchema = (path, content, value, req) => {
  let sourceFile = getSourceFile(path)
  const secondArgument = getDefinition(sourceFile, '"schema"')
  if (!secondArgument) {
    throw "No schema marker found for file: " + path
  }

  secondArgument.replaceWithText(content);
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

    async del(key, value) {
      value = JSON.parse(value)
      if (syncFs.existsSync(fspath.join(getRoot(req), 'data/objects', value.name + '.ts'))) {
        syncFs.unlinkSync(fspath.join(getRoot(req), 'data/objects', value.name + '.ts'))
      } 
    },

    async put(key, value) {
      value = JSON.parse(value)
      value = {
        ...value,
        name: value.name.replace(/\s/g, ""),
        id: value.id.replace(/\s/g, "")
      }

      value.initialData = {}
      value.apiOptions = {
        name: value.name,
        prefix: '/api/v1/'
      }
      value.features = {
        AutoAPI: value.api ? value.api : false,
        adminPage: '/objects/view?object=' + value.name + "Model"
      }
      // delete value.api
      delete value.adminPage
      const relPath = "/data/objects/"
      const filePath = getRoot(req) + relPath + fspath.basename(value.name) + '.ts'
      let exists
      try {
        await fs.access(filePath, fs.constants.F_OK)
        exists = true
      } catch (error) {
        exists = false
      }

      if (exists) {
        console.log('File: ' + filePath + ' already exists, not executing template')
      } else {
        const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
          name: value.name + '.ts',
          data: {
            options: { template: '/extensions/objects/templateSchema.tpl', variables: { lowername: value.name.toLowerCase(), name: value.name.charAt(0).toUpperCase() + value.name.slice(1) } },
            path: relPath
          }
        })

        if (result.isError) {
          throw result.error
        }
        
      }
      
      const result = ObjectModel.load(value).getSourceCode()
  
      await setSchema(filePath, result, value, req)
      let ObjectSourceFile = getSourceFile(filePath)
      if (value.features.AutoAPI) await addFeature(ObjectSourceFile, '"AutoAPI"', `"${value.features.AutoAPI}"`)
      if (value.features.adminPage) await addFeature(ObjectSourceFile, '"adminPage"', `"${value.features.adminPage}"`)
      
      await API.get('/api/v1/objects/reload?token=' + getServiceToken())
      
 
      //if api is selected, create an autoapi for the object
      const templateName = value.databaseType === "Google Sheets" ? "automatic-crud-google-sheet" : (value.databaseType === "LevelDB") ? "automatic-crud" : "automatic-crud-storage"
      if (session) {
        const objectApi = APIModel.load({
          name: value.name,
          object: value.name,
          template: templateName,
          param: value.param,
          modelName: value.id
        })
        await API.post("/api/core/v1/apis?token=" + session.token, objectApi.create().getData())

        if (value.adminPage) {
          const objectApi = PageModel.load({
            name: value.name,
            route: value.name,
            permissions: ["admin"],
            web: true,
            electron: false,
            protected: true,
            object: value.name,
            template: "admin"
          })
          await API.post("/api/core/v1/pages?token=" + session.token, objectApi.create().getData())
        }
      }

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

const ObjectsAutoAPI = AutoAPI({
  modelName: 'objects',
  modelType: ObjectModel,
  prefix: '/api/core/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*']
})

export const ObjectsAPI = (app, context) => {
    ObjectsAutoAPI(app, context)
}