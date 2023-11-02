import { PageModel } from ".";
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import axios from 'axios';

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const indexFile = "/packages/app/bundles/custom/pages/index.ts"

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const pages = [{
        name: "lol",
      }] // ?????????????????????
      for (const page of pages) {
        yield [page.name, JSON.stringify(page)];
      }
    },

    async put(key, value) {

    },

    async get(key) {

    }
  };

  return db;
}

export const PagesAPI = (app) => CreateApi('pages', PageModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)