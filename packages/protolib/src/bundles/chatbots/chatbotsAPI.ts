import { ChatbotModel } from "./ChatbotSchemas";
import { getSourceFile, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, AutoAPI, getRoot, removeFileWithImports, addFeature, removeFeature, hasFeature } from 'protonode'
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as fspath from 'path';
import { API } from 'protobase'
import { getServiceToken } from "protonode";

const ChatbotDir = (root) => fspath.join(root, "/packages/app/chatbots/")
const indexFilePath = "/packages/app/chatbots/index.ts"

const getChatbot = (chatbotPath, req, extension?) => {
  let engine
  let filePath = ChatbotDir(getRoot(req)) + chatbotPath
  if(extension) {
    filePath += extension
    engine = extension === '.ts' ? 'typescript' : 'python'
  } else {
    if(fsSync.existsSync(filePath + '.ts')) {
      filePath += '.ts'
      engine = "typescript"
    } else if(fsSync.existsSync(filePath + '.py')) {
      filePath += '.py'
      engine = "python"
    } else {
      throw "Chatbot file not found"
    }
  }

  let type = engine
  if (engine === 'typescript') {
    const sourceFile = getSourceFile(filePath)
    const arg = getDefinition(sourceFile, '"type"')
    type = arg ? arg.getText().replace(/^['"]+|['"]+$/g, '') : type
  }
  return {
    name: chatbotPath.replace(/\.[^/.]+$/, ""),
    engine,
    type,
    filePath
  }
}

const deleteChatbot = (req, key, value) => {
  const api = getChatbot(fspath.basename(key), req)
  if(api.engine === 'typescript') {
    removeFileWithImports(getRoot(req), value, '"chatbots"', indexFilePath, req, fs);
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath, fs.constants.F_OK);
    console.log('File: ' + filePath + ' already exists');
    return true;
  } catch (error) {
    return false;
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(ChatbotDir(getRoot(req)))).filter(f => f != 'index.ts' && !fsSync.lstatSync(fspath.join(ChatbotDir(getRoot(req)), f)).isDirectory() && (f.endsWith('.ts') || f.endsWith('.py')))    
      const chatbots = await Promise.all(files.map(async f => {
        const name = f.replace(/\.[^/.]+$/, "")
        const extension = f.endsWith('.ts') ? '.ts' : '.py'
        return getChatbot(name, req, extension)} 
      ));

      for (const chatbot of chatbots) {
        if (chatbot) yield [chatbot.name, JSON.stringify(chatbot)];
      }
    },

    async del(key, value) {
      value = JSON.parse(value)
      deleteChatbot(req, key, value)
    },

    async put(key, value) {
      value = JSON.parse(value)

      let exists
      let ObjectSourceFile

      const template = fspath.basename(value.template ?? 'empty')
      const extension = value.template === 'python-chatbot' ? '.py' : '.ts'

      const filePath = getRoot(req) + 'packages/app/chatbots/' + fspath.basename(value.name) + extension;
      exists = await checkFileExists(filePath);

      const computedName = value.name
      const codeName = computedName.replace(/\s/g, "")
      const codeNameLowerCase = codeName.toLowerCase()
      const result = await API.post('/api/core/v1/templates/file?token=' + getServiceToken(), {
        name: value.name + extension,
        data: {
          options: {
            template: `/packages/protolib/src/bundles/chatbots/templates/${template}.tpl`, variables: {
              codeName: codeName,
              name: computedName,
              codeNameLowerCase: codeNameLowerCase,
              param: value.param,
            }
          },
          path: '/packages/app/chatbots'
        }
      })

      if (result.isError) {
        throw result.error?.error ?? result.error
      }

      //link in index.ts
      if (extension == '.ts') {
        const sourceFile = getSourceFile(indexFilePath)
        addImportToSourceFile(sourceFile, codeName + 'Chatbot', ImportType.DEFAULT, './' + codeName)

        const arg = getDefinition(sourceFile, '"chatbots"')
        if (!arg) {
          throw "No link definition schema marker found for file: " + path
        }
        addObjectLiteralProperty(arg, codeName, codeName + 'Chatbot')
        sourceFile.saveSync();
      }
    },

    async get(key) {
      return JSON.stringify(getChatbot(key, req))
    }
  };

  return db;
}

export const ChatbotsAPI = AutoAPI({
  modelName: 'chatbots',
  modelType: ChatbotModel,
  prefix: '/api/core/v1/',
  getDB: getDB,
  connectDB: () => new Promise(resolve => resolve(null)),
  requiresAdmin: ['*']
})