import { APIModel } from ".";
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment, ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const APIDir = fspath.join(PROJECT_WORKSPACE_DIR,"/packages/app/bundles/custom/api/")
const indexFile = APIDir + "index.ts"

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {

    },

    async put(key, value) {

    },

    async get(key) {

    }
  };

  return db;
}

export const APIsAPI = (app) => CreateApi('apis', APIModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)