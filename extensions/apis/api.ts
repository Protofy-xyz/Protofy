import { APIModel } from ".";
import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API } from 'protobase'
import { getServiceToken } from "protonode";
import { ObjectModel } from 'protolib/bundles/objects/objectsSchemas'

const APIDirPath = "/packages/app/apis/"
const DynamicAPIDirPath = "/data/automations/"
const APIDir = (root) => fspath.join(root, "/packages/app/apis/")
const DynamicAPIDir = (root) => fspath.join(root, "/data/automations/")
const indexFile = (root) => APIDir(root) + "index.ts"
const indexFilePath = "/packages/app/apis/index.ts"

const getAPI = (name, req, extension?) => {
  let object = "None"
  let filePath = APIDir(getRoot(req)) + name
  let dynamicFilepath = DynamicAPIDir(getRoot(req)) + name
  let engine = 'typescript'
  let apiType = 'typescript'
  let dynamic = false

  if (extension) {
    filePath += extension
    dynamicFilepath += extension
    if(fsSync.existsSync(dynamicFilepath)) {
      dynamic = true
      filePath = dynamicFilepath
    }
    switch (extension) {
      case '.py':
        engine = 'python'
        apiType = 'python'
        break
      case '.php':
        engine = 'php'
        apiType = 'php'
        break
      default:
        break
    }
  } else {
    if( fsSync.existsSync(dynamicFilepath + '.ts')) {
      filePath = dynamicFilepath + '.ts'
      extension = '.ts'
      engine = 'typescript'
      apiType = 'typescript'
      dynamic = true
    } else if (fsSync.existsSync(dynamicFilepath + '.py')) {
      filePath = dynamicFilepath + '.py'
      extension = '.py'
      engine = 'python'
      apiType = 'python'
      dynamic = true
    } else if(fsSync.existsSync(dynamicFilepath + '.php')) {
      filePath = dynamicFilepath + '.php'
      extension = '.php'
      engine = 'php'
      apiType = 'php'
      dynamic = true
    } else if (fsSync.existsSync(filePath + '.ts')) {
      filePath += '.ts'
      extension = '.ts'
      engine = 'typescript'
      apiType = 'typescript'
    } else if (fsSync.existsSync(filePath + '.py')) {
      filePath += '.py'
      extension = '.py'
      engine = 'python'
      apiType = 'python'
    } else if (fsSync.existsSync(filePath + '.php')) {
      filePath += '.php'
      extension = '.php'
      engine = 'php'
      apiType = 'php'
    } else {
      throw "API file not found"
    }
  }

  if (apiType === 'typescript') {
    const sourceFile = getSourceFile(filePath)
    const arg = getDefinition(sourceFile, '"type"')
    const obj = getDefinition(sourceFile, '"object"')
    apiType = arg ? arg.getText().replace(/^['"]+|['"]+$/g, '') : apiType
    object = obj ? obj.getText().replace(/^['"]+|['"]+$/g, '') : object
  }
  return {
    name: name.replace(/\.[^/.]+$/, ""), //remove extension
    type: apiType,
    object,
    engine,
    dynamic,
    filePath: (dynamic ? DynamicAPIDirPath : APIDirPath) + name + extension
  }
}

const deleteAPI = (req, value) => {

  const api = getAPI(fspath.basename(value.name), req)
  if (api.engine === 'typescript' && !api.dynamic) {
    removeFileWithImports(getRoot(req), value, '"apis"', indexFilePath, req, fs);
    if (api.type === "AutoAPI") {
      const objectPath = fspath.join(getRoot(), ObjectModel.getDefaultSchemaFilePath(api.object))
      let sourceFile = getSourceFile(objectPath)
      removeFeature(sourceFile, '"AutoAPI"')
    }
  } else {
    fsSync.unlinkSync(getRoot(req) + api.filePath)
  }
}

async function checkFileExists(filePath) {
  const exts = ['.ts', '.py', '.php'];

  for (const ext of exts) {
    try {
      await fs.access(filePath + ext, fs.constants.F_OK);
      return true;
    } catch (err) {
      // check next
    }
  }

  return false;
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const validExtensions = ["ts", "py", "php"]
      const root = getRoot(req);

      const staticFiles = (await fs.readdir(APIDir(root))).filter(f => {
        const fullPath = fspath.join(APIDir(root), f);
        const ext = f.split('.').pop();
        return f !== 'index.ts' &&
               !fsSync.lstatSync(fullPath).isDirectory() &&
               validExtensions.includes(ext!);
      });
      
      const dynamicFiles = (await fs.readdir(DynamicAPIDir(root))).filter(f => {
        const fullPath = fspath.join(DynamicAPIDir(root), f);
        const ext = f.split('.').pop();
        return !fsSync.lstatSync(fullPath).isDirectory() && validExtensions.includes(ext!);
      });
      
      const files = [...staticFiles, ...dynamicFiles];
      
      const apis = await Promise.all(files.map(async f => {
        const name = f.replace(/\.[^/.]+$/, "")
        const segments = f.split('.')
        const extension = '.' + segments[segments.length - 1]
        return getAPI(name, req, extension)
      }));

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
      let extension = ".ts"
      switch (value.template) {
        case 'python-api':
          extension = '.py'
          break
        case 'php':
          extension = '.php'
          break
        default:
          break
      }

      let filePath;
      if(value.dynamic) {
        if(!fsSync.existsSync(getRoot(req) + DynamicAPIDirPath)) {
          fsSync.mkdirSync(getRoot(req) + DynamicAPIDirPath, { recursive: true });
        }
        filePath = getRoot(req) + DynamicAPIDirPath + fspath.basename(value.name)
      } else {
        filePath = getRoot(req) + 'packages/app/apis/' + fspath.basename(value.name)
      } 
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
            template: `/extensions/apis/templates/${template}.tpl`, variables: {
              codeName: codeName,
              name: computedName,
              codeNameLowerCase: codeNameLowerCase,
              object: value.object,
              param: value.param,
            }
          },
          path: value.dynamic ? DynamicAPIDirPath : APIDirPath
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
      if (extension == '.ts' && !value.dynamic) {
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
      return JSON.stringify(getAPI(key, req))
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