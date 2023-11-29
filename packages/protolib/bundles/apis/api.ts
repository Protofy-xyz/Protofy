import { APIModel } from ".";
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI } from '../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment, ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';
import { getServiceToken } from "../../api/lib/serviceToken";

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const APIDir = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/custom/apis/")
const indexFile = APIDir + "index.ts"

const getAPI = (apiPath) => {
  const sourceFile = getSourceFile(APIDir + apiPath)
  const arg = getDefinition(sourceFile, '"type"')
  const obj = getDefinition(sourceFile, '"object"')
  return {
    name: apiPath.replace(/\.[^/.]+$/, ""), //remove extension
    type: arg ? arg.getText().replace(/^['"]+|['"]+$/g, '') : "Unknown",
    object: obj? obj.getText().replace(/^['"]+|['"]+$/g, '') : "None"
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(APIDir)).filter(f => f != 'index.ts')
      const apis = await Promise.all(files.map(async f => getAPI(f)));

      for (const api of apis) {
        if (api) yield [api.name, JSON.stringify(api)];
      }
    },


    async put(key, value) {
      value = JSON.parse(value)
      let exists
      const filePath = PROJECT_WORKSPACE_DIR + 'packages/app/bundles/custom/apis/' + fspath.basename(value.name) + '.ts'
      const template = fspath.basename(value.template ?? 'empty')
      try {
        await fs.access(filePath, fs.constants.F_OK)
        exists = true
      } catch (error) {
        exists = false
      }

      if (exists) {
        console.log('File: ' + filePath + ' already exists, not executing template')
      } else {
        await axios.post('http://localhost:8080/adminapi/v1/templates/file?token=' + getServiceToken(), {
          name: value.name + '.ts',
          data: {
            options: { template: `/packages/protolib/bundles/apis/templates/${template}.tpl`, variables: { name: value.name.charAt(0).toUpperCase() + value.name.slice(1), pluralName: value.name.endsWith('s') ? value.name : value.name + 's', object: value.object } },
            path: '/packages/app/bundles/custom/apis'
          }
        })
      }

      //link in index.ts
      const sourceFile = getSourceFile(indexFile)
      addImportToSourceFile(sourceFile, value.name + 'Api', ImportType.DEFAULT, './' + value.name)

      const arg = getDefinition(sourceFile, '"apis"')
      if (!arg) {
        throw "No link definition schema marker found for file: " + path
      }
      addObjectLiteralProperty(arg, value.name, value.name + 'Api')
      sourceFile.saveSync();
    },

    async get(key) {

    }
  };

  return db;
}

export const APIsAPI = AutoAPI({
  modelName: 'apis',
  modelType: APIModel,
  initialDataDir: __dirname,
  prefix: '/adminapi/v1/',
  getDB: getDB,
  requiresAdmin: ['*']
})