import { APIModel } from ".";
import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API } from 'protobase'
import { getServiceToken } from "protonode";
import { ObjectModel } from '../objects/objectsSchemas'

const APIDir = (root) => fspath.join(root, "/packages/app/apis/")
const indexFile = (root) => APIDir(root) + "index.ts"
const indexFilePath = "/packages/app/apis/index.ts"

const getAPI = (apiPath, req) => {
  const apiType = apiPath.endsWith('.py') ? 'python' : 'typescript'
  let type = apiType
  let object = "None"
  const filePath = APIDir(getRoot(req)) + apiPath
  if (apiType === 'typescript') {
    const sourceFile = getSourceFile(filePath)
    const arg = getDefinition(sourceFile, '"type"')
    const obj = getDefinition(sourceFile, '"object"')
    type = arg ? arg.getText().replace(/^['"]+|['"]+$/g, '') : type
    object = obj ? obj.getText().replace(/^['"]+|['"]+$/g, '') : object
  }
  return {
    name: apiPath.replace(/\.[^/.]+$/, ""), //remove extension
    type,
    object,
    filePath: APIDir("") + apiPath
  }
}

const deleteAPI = (req, value) => {
  const extension = value.template === 'python-api' ? '.py' : '.ts'
  const api = getAPI(fspath.basename(value.name) + extension, req)
  removeFileWithImports(getRoot(req), value, '"apis"', indexFilePath, req, fs);
  if (api.type === "AutoAPI") {
    const objectPath = fspath.join(getRoot(), ObjectModel.getDefaultSchemaFilePath(api.object))
    let sourceFile = getSourceFile(objectPath)
    removeFeature(sourceFile, '"AutoAPI"')
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath + '.ts', fs.constants.F_OK);
    return true;
  } catch (error) {
    try {
      await fs.access(filePath + '.py', fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(APIDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(APIDir(getRoot(req)), f)).isDirectory() && (f.endsWith('.ts') || f.endsWith('.py')))
      const apis = await Promise.all(files.map(async f => getAPI(f, req)));

      for (const api of apis) {
        if (api) yield [api.name, JSON.stringify(api)];
      }
    },

    async del(key, value) {
      value = JSON.parse(value)
      deleteAPI(req, value)
    },

    async put(key, value, options?) {
      value = JSON.parse(value)
      let exists
      let ObjectSourceFile

      const template = fspath.basename(value.template ?? 'empty')
      const extension = value.template === 'python-api' ? '.py' : '.ts'

      const filePath = getRoot(req) + 'packages/app/apis/' + fspath.basename(value.name)
      exists = await checkFileExists(filePath);

      if (exists) {
        console.log("AutoAPI already exists")
        return
      }

      if (template.startsWith("automatic-crud")) {
        const objectPath = fspath.join(getRoot(), ObjectModel.getDefaultSchemaFilePath(value.object))
        ObjectSourceFile = getSourceFile(objectPath)
        exists = hasFeature(ObjectSourceFile, '"AutoAPI"')
      }

      if (template == "automatic-crud-google-sheet") {
        const regex = /\/d\/([a-zA-Z0-9-_]+)/;
        const match = value.param.match(regex);
        const id = match ? match[1] : null;
        value.param = id
      }

      const computedName = value.name
      const codeName = computedName.replace(/\s/g, "")
      const codeNameLowerCase = codeName.toLowerCase()
      const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
        name: value.name + extension,
        data: {
          options: {
            template: `/packages/protolib/src/bundles/apis/templates/${template}.tpl`, variables: {
              codeName: codeName,
              name: computedName,
              codeNameLowerCase: codeNameLowerCase,
              object: value.object,
              param: value.param,
            }
          },
          path: '/packages/app/apis'
        }
      })

      if (result.isError) {
        throw result.error?.error ?? result.error
      }

      //add autoapi feature in object if needed
      if (value.object && template.startsWith("automatic-crud")) {
        console.log('Adding feature AutoAPI to object: ', value.object)
        await addFeature(ObjectSourceFile, '"AutoAPI"', "true")
      }
      //link in index.ts
      if (extension == '.ts') {
        const sourceFile = getSourceFile(indexFile(getRoot(req)))
        addImportToSourceFile(sourceFile, codeName + 'Api', ImportType.DEFAULT, './' + codeName)

        const arg = getDefinition(sourceFile, '"apis"')
        if (!arg) {
          throw "No link definition schema marker found for file: " + path
        }
        addObjectLiteralProperty(arg, codeName, codeName + 'Api')
        sourceFile.saveSync();
      }
    },

    async get(key) {
      return JSON.stringify({ name: key })
    }
  };

  return db;
}

export const APIsAPI = AutoAPI({
  modelName: 'apis',
  modelType: APIModel,
  prefix: '/api/core/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*']
})