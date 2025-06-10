import { ObjectModel } from ".";
import { getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports } from 'protonode'
import { promises as fs } from 'fs';
import syncFs from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import { getServiceToken } from 'protonode'
import { API } from 'protobase'
import { APIModel } from '@extensions/apis/APISchemas'
import { PageModel } from '@extensions/pages/pagesSchemas'
import { addCard } from "@extensions/cards/context/addCard";

const indexFile = "/packages/app/objects/index.ts"

const getSchemas = async (req, sourceFile?) => {
  const node = getDefinition(
    sourceFile ?? getSourceFile(fspath.join(getRoot(req), indexFile)),
    '"objects"'
  );

  let schemas = []

  if (node) {
    if (node instanceof ObjectLiteralExpression) {
      const schemaPromises = node.getProperties().map(prop => {
        if (prop instanceof PropertyAssignment) {
          const schemaId = prop.getInitializer().getText();
          return getSchema(schemaId, [], req, prop.getName()).then(schema => ({
            name: prop.getName(),
            features: schema.features,
            apiOptions: schema.apiOptions,
            id: schemaId
          }));
        }
      }).filter(p => p);

      schemas = await Promise.all(schemaPromises);
    }
  }

  const dataSchemas = syncFs.readdirSync(fspath.join(getRoot(req), 'data/objects')).filter(file => file.endsWith('.json'))
  dataSchemas.forEach(file => {
    const filePath = fspath.join(getRoot(req), 'data/objects', file)
    const fileContent = syncFs.readFileSync(filePath, 'utf8')
    let data = {} as any
    try {
      data = JSON.parse(fileContent)
    } catch (e) {
      console.error("Ignoring schema in file: ", file, "because of an error: ", e)
      console.error("File content producing the error: ", fileContent)
    }
    if (data['id'] && data['name']) {
      const { keys, ...rest } = data
      schemas.push(rest)
    }
  })
  return schemas;
}

const getSchema = async (idSchema, schemas, req, name?) => {
  //list all objects in data/objects folder and check if any has a name matching the idSchema
  //if so, return that object
  const files = syncFs.readdirSync(fspath.join(getRoot(req), 'data/objects')).filter(file => file.endsWith('.json'))
  for(const file of files) {
    const filePath = fspath.join(getRoot(req), 'data/objects', file)
    const fileContent = syncFs.readFileSync(filePath, 'utf8')
    let data = {} as any
    try {
      data = JSON.parse(fileContent)
    } catch (e) {
      console.error("Ignoring schema in file: ", file, "because of an error: ", e)
      console.error("File content producing the error: ", fileContent)
    }
    if (data['name'] == idSchema || data['id'] == idSchema) {
      return data
    }
  }

  let SchemaFile = fspath.join(getRoot(req), indexFile)
  let sourceFile = getSourceFile(SchemaFile)

  const schemaName = name ?? schemas.find(s => s.id == idSchema)?.name

  sourceFile = getSourceFile(fspath.join("../../packages/app/objects/", getImport(sourceFile, idSchema)) + ".ts")
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
    } catch (e) {
      console.error("Ignoring features in object: ", idSchema, "because of an error: ", e)
      console.error("Features text producing the error: ", featuresNode.getText())
    }
  }

  const apiOptionsNode = getDefinition(sourceFile, '"api.options"')
  let options = {
    name: schemaName,
    prefix: '/api/v1/'
  }

  if (apiOptionsNode instanceof ObjectLiteralExpression) {
    console.log('api options', apiOptionsNode.getText())
    try {
      options = JSON.parse(apiOptionsNode.getText())
    } catch (e) {
      console.error("Ignoring api options in object: ", idSchema, "because of an error: ", e)
      console.error("Api options text producing the error: ", apiOptionsNode.getText())
    }
  }
  return { name: schemaName, features, id: idSchema, keys, apiOptions: options }
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

    async del(key, value) {
      value = JSON.parse(value)
      if (syncFs.existsSync(fspath.join(getRoot(req), 'data/objects', value.id + '.json'))) {
        syncFs.unlinkSync(fspath.join(getRoot(req), 'data/objects', value.id + '.json'))
      } else {
        removeFileWithImports(getRoot(req), value, '"objects"', indexFile, req, fs);
      }
    },

    async put(key, value) {
      value = JSON.parse(value)
      value = {
        ...value,
        name: value.name.replace(/\s/g, ""),
        id: value.id.replace(/\s/g, "")
      }
      if(value.dynamic) {
        value.initialData = {}
        value.apiOptions = {
          name: value.name,
          prefix: '/api/v1/'
        }
        value.features = {
          AutoAPI: value.api ? value.api : false,
          adminPage: '/objects/view?object='+value.name
        }
        delete value.api
        delete value.adminPage

        //its a dynamic object, so we need to create a file in data/objects folder
        const filePath = fspath.join(getRoot(req), 'data/objects', value.id + '.json')
        syncFs.writeFileSync(filePath, JSON.stringify(value, null, 2))
        await API.get('/api/v1/objects/reload?token=' + getServiceToken())
        return
      }

      const filePath = getRoot(req) + 'packages/app/objects/' + fspath.basename(value.name) + '.ts'
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
            options: { template: '/packages/protolib/src/bundles/objects/templateSchema.tpl', variables: { lowername: value.name.toLowerCase(), name: value.name.charAt(0).toUpperCase() + value.name.slice(1) } },
            path: '/packages/app/objects'
          }
        })

        if (result.isError) {
          throw result.error
        }
      }

      const result = ObjectModel.load(value).getSourceCode()

      await setSchema(filePath, result, value, req)
      //if api is selected, create an autoapi for the object
      const templateName = value.databaseType === "Google Sheets" ? "automatic-crud-google-sheet" : value.databaseType === "LevelDB" ? "automatic-crud" : "automatic-crud-storage"
      if (value.api && session) {
        const objectApi = APIModel.load({
          name: value.name,
          object: value.name,
          template: templateName,
          param: value.param,
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
    addCard({
        group: 'objects',
        tag: "table",
        id: 'objects_table',
        templateName: "Interactive objects table",
        name: "objects_table",
        defaults: {
            name: "Objects Table",
            icon: "boxes",
            description: "Interactive objects table",
            type: 'value',
            html: "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: `<iframe style=\"width: 100%;height:100%;\" src=\"/workspace/objects?mode=embed\" />`, padding: '3px'\n});\n",
        },
        emitEvent: true
    })
}