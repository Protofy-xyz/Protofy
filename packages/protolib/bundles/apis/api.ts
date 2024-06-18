import { APIModel } from ".";
import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from '../../api'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API } from '../../base'
import { getServiceToken } from "../../api/lib/serviceToken";
import { ObjectModel } from '../objects/objectsSchemas'

const APIDir = (root) => fspath.join(root, "/packages/app/bundles/custom/apis/")
const indexFile = (root) => APIDir(root) + "index.ts"
const indexFilePath = "/packages/app/bundles/custom/apis/index.ts"

const getAPI = (apiPath, req) => {
  const sourceFile = getSourceFile(APIDir(getRoot(req)) + apiPath)
  const arg = getDefinition(sourceFile, '"type"')
  const obj = getDefinition(sourceFile, '"object"')
  return {
    name: apiPath.replace(/\.[^/.]+$/, ""), //remove extension
    type: arg ? arg.getText().replace(/^['"]+|['"]+$/g, '') : "Unknown",
    object: obj ? obj.getText().replace(/^['"]+|['"]+$/g, '') : "None"
  }
}

const deleteAPI = (req, value) => {
  const api = getAPI(fspath.basename(value.name) + '.ts', req)
  removeFileWithImports(getRoot(req), value, '"apis"', indexFilePath, req, fs);
  if (api.type === "AutoAPI") {
    const objectPath = fspath.join(getRoot(), ObjectModel.getDefaultSchemaFilePath(api.object))
    let sourceFile = getSourceFile(objectPath)
    removeFeature(sourceFile, '"AutoAPI"')
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    console.log('File: ' + filePath + ' already exists');
    return true;
  } catch (error) {
    return false;
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(APIDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(APIDir(getRoot(req)), f)).isDirectory() && f.endsWith('.ts'))
      const apis = await Promise.all(files.map(async f => getAPI(f, req)));

      for (const api of apis) {
        if (api) yield [api.name, JSON.stringify(api)];
      }
    },

    async del(key, value) {
      value = JSON.parse(value)
      deleteAPI(req, value)
    },

    async put(key, value) {
      value = JSON.parse(value)

      let exists
      let ObjectSourceFile

      const template = fspath.basename(value.template ?? 'empty')

      const filePath = getRoot(req) + 'packages/app/bundles/custom/apis/' + fspath.basename(value.name) + '.ts';
      exists = await checkFileExists(filePath);

      if (template.startsWith("automatic-crud")) {
        const objectPath = fspath.join(getRoot(), ObjectModel.getDefaultSchemaFilePath(value.object))
        ObjectSourceFile = getSourceFile(objectPath)
        exists = hasFeature(ObjectSourceFile, '"AutoAPI"')

        if (exists) {
          console.log("AutoAPI already exists")
          return
        }
      }

      if(template == "automatic-crud-google-sheet") {
          const regex = /\/d\/([a-zA-Z0-9-_]+)/;
          const match = value.param.match(regex);
          const id = match ? match[1] : null;
          value.param = id
      }

      const computedName = value.name
      const codeName = computedName.replace(/\s/g, "")
      const codeNameLowerCase = codeName.toLowerCase()
      const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
        name: value.name + '.ts',
        data: {
          options: { template: `/packages/protolib/bundles/apis/templates/${template}.tpl`, variables: { 
            codeName: codeName,
            name: computedName, 
            codeNameLowerCase: codeNameLowerCase,
            object: value.object,
            param: value.param,
          }},
          path: '/packages/app/bundles/custom/apis'
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
      const sourceFile = getSourceFile(indexFile(getRoot(req)))
      addImportToSourceFile(sourceFile, codeName + 'Api', ImportType.DEFAULT, './' + codeName)

      const arg = getDefinition(sourceFile, '"apis"')
      if (!arg) {
        throw "No link definition schema marker found for file: " + path
      }
      addObjectLiteralProperty(arg, codeName, codeName + 'Api')
      sourceFile.saveSync();
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
  prefix: '/adminapi/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*'],
  useEventEnvironment: false,
  useDatabaseEnvironment: false
})