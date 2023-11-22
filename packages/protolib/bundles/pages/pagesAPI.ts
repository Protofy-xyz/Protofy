import { PageModel } from ".";
import { CreateApi, getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI } from '../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { API } from "../../lib/Api";

const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const pagesDir = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/custom/pages/")
const indexFile = pagesDir + "index.tsx"

const getPage = (pagePath) => {
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
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(pagesDir)).filter(f => f != 'index.tsx' && f.endsWith('.tsx'))
      const pages = await Promise.all(files.map(async f => getPage(fspath.join(pagesDir, f))));

      for (const page of pages) {
        if (page) yield [page.name, JSON.stringify(page)];
      }
    },

    async put(key, value) {
      value = JSON.parse(value)
      const filePath = fspath.join(pagesDir, fspath.basename(value.name) + '.tsx')
      const template = fspath.basename(value.template ?? 'default')
      const object = value.object ? value.object.charAt(0).toUpperCase() + value.object.slice(1) : ''
      try {
        await fs.access(filePath, fs.constants.F_OK)
        console.log('File: ' + filePath + ' already exists, not executing template')
      } catch (error) {
        console.log('permissions: ', value.permissions ? JSON.stringify(value.permissions) : '[]', value.permissions)
        console.log('executing template: ', `/packages/protolib/bundles/pages/templates/${template}.tpl`)
        await axios.post('http://localhost:8080/adminapi/v1/templates/file?token=' + getServiceToken(), {
          name: value.name + '.tsx',
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
            path: pagesDir
          }
        })
      }
      let sourceFile = getSourceFile(filePath)
      if (value.template == 'generative') { // Check that template is generative and do call to chatgpt
        const systemPrompt = `You are an expert react frontend developer. A user will provide you with a
 low-fidelity wireframe of an application and you will return 
 a single react file that uses tamagui to create the website. Use creative license to make the application more fleshed out.
if you need to insert an image, use placehold.co to create a placeholder image. 
Answer only with code.`;
        const defaultMessages = [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: value.asset,
              },
              `Using the provided image and the following code as template: ${sourceFile.getText()}.
              Turn this into component using Tamagui components library.
              Do not delete react components from the provided template. 
              Preserve default imports. 
              Add missing imports for the components you have added.
              All imports from "tamagui" should be replaced by the alias "@my/ui".
              Answer only with code`,
            ],
          },
        ]
        // Call chatgpt
        const result = await API.post('/adminapi/v1/assistants', {
          gptModel: "gpt-4-vision-preview",
          messages: defaultMessages
        })
        const content = result.data.choices[0]?.message.content; // FIX: currently assuming happy path and no errors
        console.log('DEV: content GPT::::', content)
      }
      let arg = getDefinition(sourceFile, '"protected"')
      if (value.protected) {
        arg.replaceWithText('true');
      } else {
        arg.replaceWithText('false');
      }

      arg = getDefinition(sourceFile, '"permissions"')
      arg.replaceWithText(value.permissions ? JSON.stringify(value.permissions) : '[]')
      sourceFile.save()

      sourceFile = getSourceFile(indexFile)
      //link in index.ts
      addImportToSourceFile(sourceFile, value.name, ImportType.DEFAULT, './' + value.name)

      arg = getDefinition(sourceFile, '"pages"')
      if (!arg) {
        throw "No link definition schema marker found for file: " + path
      }
      addObjectLiteralProperty(arg, (value.route.startsWith('/') ? value.route.slice(1) : value.route), value.name)
      sourceFile.saveSync();

    },

    async get(key) {
      const page = getPage(fspath.join(pagesDir, fspath.basename(key + '.tsx')))
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