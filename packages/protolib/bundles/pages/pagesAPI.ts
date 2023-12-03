import { PageModel } from ".";
import { CreateApi, getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot } from '../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ArrayLiteralExpression } from 'ts-morph';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import {API} from 'protolib/base'

const pagesDir = (root) => fspath.join(root, "/packages/app/bundles/custom/pages/")
const nextPagesDir = (root) => fspath.join(root, "/apps/next/pages/")

const getPage = (pagePath) => {
  try {
    const sourceFile = getSourceFile(pagePath)
    const route = getDefinition(sourceFile, '"route"')
    const prot = getDefinition(sourceFile, '"protected"')
    let permissions = getDefinition(sourceFile, '"permissions"')
  
    if (!route || !permissions || !prot) return undefined
  
    if (permissions && ArrayLiteralExpression.is(permissions) && permissions.getElements) {
      permissions = permissions.getElements().map(element => element.getText().replace(/^["']|["']$/g, ''));
    } else {
      permissions = permissions.getText()
    }
  
  
  
    return {
      name: fspath.basename(pagePath, fspath.extname(pagePath)),
      route: route.getText().replace(/^["']|["']$/g, ''),
      protected: prot.getText() == 'false' ? false : true,
      permissions: permissions
    }
  } catch(e) {
    return null
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(pagesDir(getRoot(req)))).filter(f => f != 'index.tsx' && f.endsWith('.tsx'))
      const pages = await Promise.all(files.map(async f => getPage(fspath.join(pagesDir(getRoot(req)), f))));

      for (const page of pages) {
        if (page) yield [page.name, JSON.stringify(page)];
      }
    },

    async put(key, value) {
      value = JSON.parse(value)
      const filePath = fspath.join(pagesDir(getRoot(req)), fspath.basename(value.name) + '.tsx')
      const prevPage = getPage(filePath)
      const template = fspath.basename(value.template ?? 'default')
      const object = value.object ? value.object.charAt(0).toUpperCase() + value.object.slice(1) : ''
      try {
        await fs.access(filePath, fs.constants.F_OK)
        // console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        // console.log('permissions: ', value.permissions ? JSON.stringify(value.permissions) : '[]', value.permissions)
        // console.log('executing template: ', `/packages/protolib/bundles/pages/templates/${template}.tpl`)
        const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
          name: fspath.basename(value.name + '.tsx'),
          data: {
            options: {
              template: `/packages/protolib/bundles/pages/templates/${template}.tpl`,
              variables: {
                ...value,
                route: value.route.startsWith('/') ? value.route : '/' + value.route,
                permissions: value.permissions ? JSON.stringify(value.permissions) : '[]',
                object: object,
                _object: object.toLowerCase(),
                apiUrl: '/api/v1/' + value.object + 's'
              }
            },
            path: pagesDir(getRoot(req))
          }
        })
        if(result.isError) {
          throw result.error
        }
      }
      
      let sourceFile = getSourceFile(filePath)
      let arg = getDefinition(sourceFile, '"protected"')

      if (value.protected) {
        arg.replaceWithText('true');
      } else {
        arg.replaceWithText('false');
      }

      arg = getDefinition(sourceFile, '"permissions"')
      arg.replaceWithText(value.permissions ? JSON.stringify(value.permissions) : '[]')

      arg = getDefinition(sourceFile, '"route"')
      arg.replaceWithText(value.route ? JSON.stringify(value.route) : '""')
      sourceFile.save()

      console.log('prevPage: --------------------------', prevPage)
      if(prevPage && prevPage.route != value.route) {
        //delete previous route if changed
        const prevFile = fspath.join(nextPagesDir(getRoot(req)), prevPage.route + '.tsx')
        console.log('Deleting prev page', prevFile)
        await fs.unlink(prevFile)
        console.log('Deleted')
      }

      //link in nextPages
      try {
        //TODO: routes with subdirectories
        const nextFilePath = fspath.join(nextPagesDir(getRoot(req)), fspath.basename(value.route)+'.tsx')
        await fs.access(nextFilePath, fs.constants.F_OK)
        // console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        //page does not exist, create it
        const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
          name: fspath.basename(value.route + '.tsx'),
          data: {
            options: {
              template: `/packages/protolib/bundles/pages/templates/nextPage.tpl`,
              variables: {
                ...value,
                upperName: value.name ? value.name.charAt(0).toUpperCase() + value.name.slice(1) : ''
              }
            },
            path: nextPagesDir(getRoot(req))
          }
        })
        if(result.isError) {
          throw result.error
        }
      }
    },

    async get(key) {
      const page = getPage(fspath.join(pagesDir(getRoot(req)), fspath.basename(key + '.tsx')))
      return JSON.stringify(page)
    }
  };

  return db;
}

export const PagesAPI = AutoAPI({
  modelName: 'pages',
  modelType: PageModel,
  initialDataDir: __dirname,
  prefix: '/adminapi/v1/',
  getDB: getDB,
  requiresAdmin: ['*']
})