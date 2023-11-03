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

  if(ArrayLiteralExpression.is(permissions) && permissions.getElements) {
    permissions = permissions.getElements().map(element => element.getText().replace(/^["']|["']$/g, ''));
  } else {
    permissions = permissions.getText()
  }

  if(!route || !permissions || !prot) return undefined

  return {
    name: fspath.basename(pagePath, fspath.extname(pagePath)),
    route: route.getText().replace(/^["']|["']$/g, ''),
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
      /*
      value:  {
        template: 'default',
        object: 'lol',
        name: 'pururu',
        route: 'ororo',
        protected: false
      }
*/
      value = JSON.parse(value)
      const filePath = fspath.join(pagesDir, fspath.basename(value.name)+'.tsx')
      const template = fspath.basename(value.template ?? 'default')
      const object = value.object ? value.object.charAt(0).toUpperCase() + value.object.slice(1) : ''
      try {
        await fs.access(filePath, fs.constants.F_OK)
        console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        console.log('executing template: ', `/packages/protolib/adminpanel/bundles/pages/templates/${template}.tpl`)
        await axios.post('http://localhost:8080/adminapi/v1/templates/file', {
          name: value.name + '.tsx',
          data: {
            options: { 
              template: `/packages/protolib/adminpanel/bundles/pages/templates/${template}.tpl`, 
              variables: {
                ...value,
                route: value.route.startsWith('/') ? value.route : '/' + value.route,
                permissions: value.permissions ?? '[]',
                object: object,
                apiUrl: '/api/v1/'+value.object+'s'
              } 
            },
            path: pagesDir
          }
        })
      }
    },

    async get(key) {
      const page = getPage(fspath.join(pagesDir, fspath.basename(key+'.tsx')))
      return JSON.stringify(page)
    }
  };

  return db;
}

export const PagesAPI = (app) => CreateApi('pages', PageModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)(app)