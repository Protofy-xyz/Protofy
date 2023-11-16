import { APIModel } from ".";
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI } from '../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment, ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const APIDir = fspath.join(PROJECT_WORKSPACE_DIR,"/packages/app/bundles/custom/apis/")
const indexFile = APIDir + "index.ts"

const getAPI = (apiPath) => {
  return {
    name: ''
  }
} 

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(APIDir)).filter(f => f != 'index.ts')
      const apis = await Promise.all(files.map(async f => getAPI(fspath.join(APIDir, f))));

      for (const api of apis) {
        if(api) yield [api.name, JSON.stringify(api)];
      }
    },


    async put(key, value) {

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