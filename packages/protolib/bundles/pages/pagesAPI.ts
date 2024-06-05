import { PageModel } from ".";
import { getSourceFile, getDefinition, AutoAPI, getRoot, addFeature, hasFeature, removeFeature } from '../../api'
import { promises as fs } from 'fs';
import * as syncFs from 'fs';
import * as fspath from 'path';
import { ArrayLiteralExpression } from 'ts-morph';
import { getServiceToken } from '../../api/lib/serviceToken'
import { API } from '../../base'
import { ObjectModel } from "../objects/objectsSchemas";

const pagesDir = (root) => fspath.join(root, "/packages/app/bundles/custom/pages/")
const nextPagesDir = (root) => fspath.join(root, "/apps/next/pages/")
const electronPagesDir = (root) => fspath.join(root, "/apps/electron/pages/")

const getPage = (pagePath, req) => {
  try {
    const sourceFile = getSourceFile(pagePath)
    const route = getDefinition(sourceFile, '"route"')
    const routeValue = route.getText().replace(/^["']|["']$/g, '')
    const prot = getDefinition(sourceFile, '"protected"')
    let permissions = getDefinition(sourceFile, '"permissions"')
    const nextFilePath = fspath.join(nextPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.tsx')
    const electronFilePath = fspath.join(electronPagesDir(getRoot(req)), (routeValue == '/' ? 'index' : routeValue) + '.tsx')
    if (!route || !permissions || !prot) return undefined
    if (permissions && ArrayLiteralExpression.is(permissions) && permissions.getElements) {
      permissions = permissions.getElements().map(element => element.getText().replace(/^["']|["']$/g, ''));
    } else {
      permissions = permissions.getText()
    }

    return {
      name: fspath.basename(pagePath, fspath.extname(pagePath)),
      route: routeValue,
      protected: prot.getText() == 'false' ? false : true,
      permissions: permissions,
      web: syncFs.existsSync(nextFilePath),
      electron: syncFs.existsSync(electronFilePath)
    }
  } catch (e) {
    return null
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
    async del (key, value:any) {
      value = JSON.parse(value)
      const route = value.route.startsWith('/') ? value.route : '/' + value.route
      const filePath = fspath.join(pagesDir(getRoot(req)), fspath.basename(value.name) + '.tsx')
      
      const apiSourceFile = getSourceFile(filePath)
      let arg = getDefinition(apiSourceFile, '"pageType"')
      const pageType = arg.getText().replace(/^["']|["']$/g, '')
      if(pageType == 'admin') {
        let obj = getDefinition(apiSourceFile, '"object"')
        if(obj) {
          obj = obj.getText().replace(/^["']|["']$/g, '')
          const objectPath = fspath.join(getRoot(req), ObjectModel.getDefaultSchemaFilePath(obj))
          const ObjectSourceFile = getSourceFile(objectPath)
          removeFeature(ObjectSourceFile, '"'+pageType+'Page"')
        }
      }

      await deleteFile(fspath.join(getRoot(req), "apps/next/pages", route + '.tsx'))
      const pagePath = "apps/electron/pages" + route + '.tsx'
      await deleteFile(fspath.join(getRoot(req), pagePath))

      if(route.startsWith('/workspace/')) {
        const devPath = fspath.join(getRoot(req), "apps/next/pages", route.replace('/workspace/', '/workspace/dev/') + '.tsx')
        const prodPath = fspath.join(getRoot(req), "apps/next/pages", route.replace('/workspace/', '/workspace/prod/') + '.tsx')
        
        try { await deleteFile(devPath) } catch(e) {console.error('Delete dev workspace page failed: ', e)}
        try { await deleteFile(prodPath) } catch(e) {console.error('Delete prod workspace page failed: ', e)}
      }

      await deleteFile(filePath)
      
    },

    async put(key, value) {
      value = JSON.parse(value)
      const filePath = fspath.join(pagesDir(getRoot(req)), fspath.basename(value.name) + '.tsx')
      const prevPage = getPage(filePath, req)
      const template = fspath.basename(value.template ?? 'default')
      const object = value.object ? value.object.charAt(0).toUpperCase() + value.object.slice(1) : ''
      const route = value.route.startsWith('/') ? value.route : '/' + value.route
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
                route: route,
                permissions: value.permissions ? JSON.stringify(value.permissions) : '[]',
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
        await addFeature(ObjectSourceFile, '"'+value.template+'Page"', '"'+route+'"')
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

      const pagesAppDir = nextPagesDir(getRoot(req))
      if (prevPage && prevPage.route != route) {
        //delete previous route if changed
        const prevRoute = prevPage.route.startsWith('/') ? prevPage.route : '/' + prevPage.route
        const prevFile = fspath.join(pagesAppDir, prevRoute + '.tsx')
        console.log('Deleting prev page', prevFile)
        await fs.unlink(prevFile)

        if(prevRoute.startsWith('/workspace/')) {
          const devPath = fspath.join(pagesAppDir, prevRoute.replace('/workspace/', '/workspace/dev/') + '.tsx')
          const prodPath = fspath.join(pagesAppDir, prevRoute.replace('/workspace/', '/workspace/prod/') + '.tsx')
          try {await fs.unlink(devPath)} catch (e) {console.error('Delete dev workspace page failed: ', e)}
          try {await fs.unlink(prodPath)} catch (e) {console.error('Delete prod workspace page failed: ', e)}
        }

        console.log('Deleted')
      }

      //link in nextPages
      const appFilePath = fspath.join(pagesAppDir, route + '.tsx')
      const devPath = fspath.join(pagesAppDir, route.replace('/workspace/', '/workspace/dev/') + '.tsx')
      const prodPath = fspath.join(pagesAppDir, route.replace('/workspace/', '/workspace/prod/') + '.tsx')

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
          const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
            name: route + '.tsx',
            data: {
              options: {
                template: `/packages/protolib/bundles/pages/templates/nextPage.tpl`,
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

          console.log('---------------------------------------------')
          console.log('checking if route is workspace route: ', route, route.startsWith('/workspace/'))
          if(route.startsWith('/workspace/')) {
            console.log('is a workspace route, creating: ', devPath, prodPath)
            await fs.copyFile(appFilePath, devPath)
            await fs.copyFile(appFilePath, prodPath)
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
          const result = await API.post('/adminapi/v1/templates/file?token=' + getServiceToken(), {
            name: value.route + '.tsx',
            data: {
              options: {
                template: `/packages/protolib/bundles/pages/templates/electronPage.tpl`,
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
  prefix: '/adminapi/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*'],
  useDatabaseEnvironment: false,
  useEventEnvironment: false
})
