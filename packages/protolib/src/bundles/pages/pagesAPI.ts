import { PageModel } from ".";
import { getSourceFile, getDefinition, AutoAPI, getRoot, addFeature, hasFeature, removeFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as syncFs from 'fs';
import * as fspath from 'path';
import { ArrayLiteralExpression } from 'ts-morph';
import { getServiceToken } from 'protonode'
import { API } from 'protobase'
import { ObjectModel } from "../objects/objectsSchemas";
import admin from "app/workspaces/admin";

const pagesDir = (root) => fspath.join(root, "/packages/app/pages/")
const nextPagesDir = (root) => fspath.join(root, "/apps/next/pages/")
const adminPanelPagesDir = (root) => fspath.join(root, "/apps/next/pages/admin/")
const publishedNextPagesDir = (root) => fspath.join(root, "/apps/next/dist/apps/next/.next/server/pages/")
const publishedAdminPagesDir = (root) => fspath.join(root, "/apps/next/dist/apps/next/.next/server/pages/admin/")
const publishedAdminRootPagesDir = (root) => fspath.join(root, "/apps/next/dist/apps/next/.next/server/pages/admin/")
const electronPagesDir = (root) => fspath.join(root, "/apps/electron/pages/")

const getPage = (pagePath, req) => {
  const sourceFile = getSourceFile(pagePath)
  const route = getDefinition(sourceFile, '"route"')
  let routeValue = route.getText().replace(/^["']|["']$/g, '')
  const pageType = getDefinition(sourceFile, '"pageType"')
  let pageTypeValue = null
  if (pageType) {
    pageTypeValue = pageType.getText().replace(/^["']|["']$/g, '')
  }

  const prot = getDefinition(sourceFile, '"protected"')
  let permissions = getDefinition(sourceFile, '"permissions"')
  const nextFilePath = fspath.join(nextPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.tsx')
  const adminPanelFilePath = fspath.join(adminPanelPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.tsx')
  const publishedNextJSFilePath = fspath.join(publishedNextPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.js')
  const publishedNextHTMLFilePath = fspath.join(publishedNextPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.html')
  const publishedAdminJSFilePath = fspath.join(publishedAdminPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.js')
  const publishedAdminHTMLFilePath = fspath.join(publishedAdminPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.html')
  const publishedAdminRootJSFilePath = fspath.join(publishedAdminRootPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.js')
  const publishedAdminRootHTMLFilePath = fspath.join(publishedAdminRootPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.html')
  const electronFilePath = fspath.join(electronPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.tsx')
  if (!route || !permissions || !prot) return undefined
  if (permissions && ArrayLiteralExpression.is(permissions) && permissions.getElements) {
    permissions = permissions.getElements().map(element => element.getText().replace(/^["']|["']$/g, ''));
  } else {
    permissions = permissions.getText()
  }

  let objectName = null
  //get object name if pageType is admin
  if (pageTypeValue == 'admin') {
    let obj = getDefinition(sourceFile, '"object"')
    if (obj) {
      objectName = obj.getText().replace(/^["']|["']$/g, '')
    }
  }

  return {
    name: fspath.basename(pagePath, fspath.extname(pagePath)),
    route: pageTypeValue == 'admin' ? '/admin' + routeValue : routeValue,
    pageType: pageTypeValue,
    protected: prot.getText() == 'false' ? false : true,
    permissions: permissions,
    web: syncFs.existsSync(nextFilePath),
    electron: syncFs.existsSync(electronFilePath),
    adminpanel: syncFs.existsSync(adminPanelFilePath),
    status: {
      web: syncFs.existsSync(publishedNextJSFilePath) || syncFs.existsSync(publishedNextHTMLFilePath) ? 'published' : 'unpublished',
      adminpanel: syncFs.existsSync(publishedAdminJSFilePath) || syncFs.existsSync(publishedAdminHTMLFilePath) || syncFs.existsSync(publishedAdminRootJSFilePath) || syncFs.existsSync(publishedAdminRootHTMLFilePath) ? 'published' : 'unpublished'
    },
    ...(objectName ? { object: objectName } : {})
  }
}

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, err);
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(pagesDir(getRoot(req)))).filter(f => f != 'index.tsx' && f.endsWith('.tsx'))
      const pages = await Promise.all(files.map(async f => getPage(fspath.join(pagesDir(getRoot(req)), f), req)));

      for (const page of pages) {
        if (page) yield [page.name, JSON.stringify(page)];
      }
    },
    async del(key, value: any) {
      value = JSON.parse(value)
      const route = value.route.startsWith('/') ? value.route : '/' + value.route
      const filePath = fspath.join(pagesDir(getRoot(req)), fspath.basename(value.name) + '.tsx')

      const apiSourceFile = getSourceFile(filePath)
      let arg = getDefinition(apiSourceFile, '"pageType"')
      const pageType = arg ? arg.getText().replace(/^["']|["']$/g, '') : undefined
      if (pageType == 'admin') {
        let obj = getDefinition(apiSourceFile, '"object"')
        if (obj) {
          obj = obj.getText().replace(/^["']|["']$/g, '')
          const objectPath = fspath.join(getRoot(req), ObjectModel.getDefaultSchemaFilePath(obj))
          const ObjectSourceFile = getSourceFile(objectPath)
          removeFeature(ObjectSourceFile, '"' + pageType + 'Page"')
        }
        await deleteFile(fspath.join(getRoot(req), "apps/next/pages/admin/", route + '.tsx'))
      } else {
        await deleteFile(fspath.join(getRoot(req), "apps/next/pages", route + '.tsx'))
      }

      await deleteFile(filePath)
    },

    async put(key, value) {
      value = JSON.parse(value)
      value = {
        ...value,
        name: value.name.replace(/\s/g, ""),
        route: value.route.replace(/\s/g, "")
      }
      const filePath = fspath.join(pagesDir(getRoot(req)), fspath.basename(value.name) + '.tsx')
      let prevPage
      try {
        prevPage = getPage(filePath, req)
      } catch (error) {}
      
      const template = fspath.basename(value.template ?? 'default')
      const object = value.object ? value.object.charAt(0).toUpperCase() + value.object.slice(1) : ''
      const route = value.route.startsWith('/') ? value.route : '/' + value.route
      //TODO: develop a multy system pages api, compatible with multiple app frontends
      //Fow now, we use the template name to determine the frontend
      const pagesAppDir = template.startsWith("admin") ? adminPanelPagesDir(getRoot(req)) : nextPagesDir(getRoot(req))
      try {
        await fs.access(filePath, fs.constants.F_OK)
        // console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        // console.log('permissions: ', value.permissions ? JSON.stringify(value.permissions) : '[]', value.permissions)
        // console.log('executing template: ', `/packages/protolib/src/bundles/pages/templates/${template}.tpl`)
        const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
          name: fspath.basename(value.name + '.tsx'),
          data: {
            options: {
              template: `/packages/protolib/src/bundles/pages/templates/${template}.tpl`,
              variables: {
                ...value,
                route: route,
                permissions: value.permissions ? JSON.stringify(value.permissions) : '[]',
                rawObject: value.object,
                object: object,
                _object: object.toLowerCase()
              }
            },
            path: pagesDir(getRoot(req))
          }
        })
        if (result.isError) {
          console.error("Error executing template: ", result)
          throw result.error
        }
      }

      //add management page feature in object if needed
      if (value.object) {
        const objectPath = fspath.join(getRoot(), ObjectModel.getDefaultSchemaFilePath(value.object))
        const ObjectSourceFile = getSourceFile(objectPath)

        console.log('Adding feature to object: ', value.object, value.template)
        await addFeature(ObjectSourceFile, '"' + value.template + 'Page"', '"' + route + '"')
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
      arg.replaceWithText(route ? JSON.stringify(route) : '""')
      sourceFile.save()

      if (prevPage && prevPage.route != route) {
        //delete previous route if changed
        const prevRoute = prevPage.route.startsWith('/') ? prevPage.route : '/' + prevPage.route
        const prevFile = fspath.join(pagesAppDir, prevRoute + '.tsx')
        console.log('Deleting prev page', prevFile)
        await fs.unlink(prevFile)
        console.log('Deleted')
      }

      //link in nextPages
      const appFilePath = fspath.join(pagesAppDir, route + '.tsx')

      try {
        //TODO: routes with subdirectories
        await fs.access(appFilePath, fs.constants.F_OK)
        if (!value.web) {
          await fs.unlink(appFilePath)
        }
        // console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        if (value.web) {
          //page does not exist, create it
          const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
            name: route + '.tsx',
            data: {
              options: {
                template: `/packages/protolib/src/bundles/pages/templates/nextPage.tpl`,
                variables: {
                  ...value,
                  upperName: value.name ? value.name.charAt(0).toUpperCase() + value.name.slice(1) : ''
                }
              },
              path: pagesAppDir
            }
          })
          if (result.isError) {
            throw result.error
          }
        }
      }

      //link in electronPages
      try {
        //TODO: routes with subdirectories
        const electronFilePath = fspath.join(electronPagesDir(getRoot(req)), fspath.basename(value.route) + '.tsx')
        await fs.access(electronFilePath, fs.constants.F_OK)
        if (!value.electron) {
          await fs.unlink(electronFilePath)
        }
        // console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        if (value.electron) {
          //page does not exist, create it
          const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
            name: value.route + '.tsx',
            data: {
              options: {
                template: `/packages/protolib/src/bundles/pages/templates/electronPage.tpl`,
                variables: {
                  ...value,
                  upperName: value.name ? value.name.charAt(0).toUpperCase() + value.name.slice(1) : ''
                }
              },
              path: electronPagesDir(getRoot(req))
            }
          })
          if (result.isError) {
            throw result.error
          }
        }
      }
    },

    async get(key) {
      const page = getPage(fspath.join(pagesDir(getRoot(req)), fspath.basename(key + '.tsx')), req)
      return JSON.stringify(page)
    }
  };

  return db;
}

export const PagesAPI = AutoAPI({
  modelName: 'pages',
  modelType: PageModel,
  prefix: '/api/core/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*']
})
