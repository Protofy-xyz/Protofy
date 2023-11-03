import { PageModel } from ".";
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ObjectLiteralExpression, PropertyAssignment, ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const pagesDir = fspath.join(PROJECT_WORKSPACE_DIR,"/packages/app/bundles/custom/pages/")
const indexFile = pagesDir + "index.ts"

const getPage = (pagePath) => {
  const sourceFile = getSourceFile(pagePath)
  const route = getDefinition(sourceFile, '"route"')
  const prot = getDefinition(sourceFile, '"protected"')
  let permissions = getDefinition(sourceFile, '"permissions"')

  if(ArrayLiteralExpression.is(permissions)) {
    permissions = permissions.getElements().map(element => element.getText().replace(/^["']|["']$/g, ''));
  } else {
    permissions = permissions.getText()
  }

  const template = getDefinition(sourceFile, '"template"')
  if(!route || !permissions || !template || !prot) return undefined

  return {
    name: fspath.basename(pagePath, fspath.extname(pagePath)),
    route: route.getText().replace(/^["']|["']$/g, ''),
    template: template.getText().replace(/^["']|["']$/g, ''),
    protected: prot.getText() == 'false' ? false : true,
    permissions: permissions
  }
} 

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(pagesDir)).filter(f => f != 'index.tsx')
      const pages = await Promise.all(files.map(async f => getPage(fspath.join(pagesDir, f))));

      for (const page of pages) {
        if(page) yield [page.name, JSON.stringify(page)];
      }
    },

    async put(key, value) {

    },

    async get(key) {
      const page = getPage(fspath.join(pagesDir, fspath.basename(key+'.tsx')))
      return JSON.stringify(page)
    }
  };

  return db;
}

export const PagesAPI = (app) => CreateApi('pages', PageModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)