import { TaskRunModel } from "../models/TaskRun";
import { Tasks } from 'app/bundles/tasks'
import { connectDB, handler } from "protolib/api";
import { v4 as uuidv4 } from 'uuid';
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, removeImportFromSourceFile, removeObjectLiteralProperty, AutoAPI } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';
import { TaskModel } from "../models/Task";
import { ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import { runTask } from "./taskRunApi";
import { getServiceToken } from 'protolib/api/lib/serviceToken'

const dbPath = '../../data/databases/tasks'

export const TaskApi = (app, mqtt) => {
  connectDB(dbPath) //preconnect database

  const CrudAPI = AutoAPI({
    modelName: 'tasks',
    modelType: TaskModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    getDB: getDB,
    requiresAdmin: ['*'],
    // extraData: {
    //   prelist: async (session) => {
    //     const companies = await axios.get('http://localhost:8080/adminapi/v1/companies?itemsPerPage=1000')
    //     const company = await companies?.data?.items.find(i => i.email == session.user.id)
    //     return {
    //       company
    //     }
    //   }
    // }
  })
  CrudAPI(app, mqtt)

  app.get('/adminapi/v1/tasks/:name/run', handler(async (req, res, session) => {
    if (!session || !session.user.admin) {
      res.status(401).send({ error: "Unauthorized" })
      return
    }

    const { token, ...parameters } = req.query
    runTask(req.params.name, parameters, session,
      (result) => res.send({ result: result }),
      (err) => res.status(500).send(`An error occurred: ${(err as Error).message}`),
      () => res.status(404).send(`Task ${name} not found.`),
    )
  }))
}

//data layer
const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const tasksDir = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/custom/tasks/")
const apiDir = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/custom/apis/")
const indexFile = tasksDir + "index.ts"
const apiIndex = fspath.join(apiDir, 'index.ts')

const getTask = async (taskPath) => {
  const name = fspath.basename(taskPath, fspath.extname(taskPath))
  const apiPath = fspath.join(apiDir, name + 'TaskApi.ts')
  let hasApi
  let apiRoute = ''
  try {
    await fs.access(apiPath, fs.constants.F_OK)
    const sourceFile = getSourceFile(apiPath)
    const node = getDefinition(sourceFile, '"apiRoute"')
    apiRoute = node.getText().replace(/^["']|["']$/g, '')
    hasApi = true
  } catch (error) {
    hasApi = false
  }

  return {
    name: name,
    path: 'packages/app/bundles/custom/tasks/',
    api: hasApi,
    apiRoute: apiRoute
  }
}

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(tasksDir)).filter(f => f != 'index.ts')
      const tasks = await Promise.all(files.map(async f => await getTask(fspath.join(tasksDir, f))));

      for (const task of tasks) {
        if (task) yield [task.name, JSON.stringify(task)];
      }
    },

    async put(key, value) {
      value = JSON.parse(value)
      const capitalizedName = value.name.charAt(0).toUpperCase() + value.name.slice(1)

      let exists
      const filePath = PROJECT_WORKSPACE_DIR + 'packages/app/bundles/custom/tasks/' + fspath.basename(value.name) + '.ts'
      try {
        await fs.access(filePath, fs.constants.F_OK)
        exists = true
      } catch (error) {
        exists = false
      }

      if (exists) {
        console.log('File: ' + filePath + ' already exists, not executing template')
      } else {
        await axios.post('http://localhost:8080/adminapi/v1/templates/file?token=' + getServiceToken(), {
          name: value.name + '.ts',
          data: {
            options: { template: '/packages/protolib/bundles/tasks/templateTask.tpl', variables: {} },
            path: '/packages/app/bundles/custom/tasks'
          }
        })
      }

      //sync api
      let apiExists
      const apiPath = fspath.join(apiDir, fspath.basename(value.name) + 'TaskApi.ts')
      try {
        await fs.access(apiPath, fs.constants.F_OK)
        apiExists = true
      } catch (error) {
        apiExists = false
      }

      if (apiExists) {
        if (!value.api) {
          //unlink in index.ts
          const sourceFile = getSourceFile(apiIndex)
          const arg = getDefinition(sourceFile, '"apis"')
          if (!arg) {
            throw "No link definition schema marker found for file: " + path
          }

          removeObjectLiteralProperty(arg, value.name + 'taskApi')
          removeImportFromSourceFile(sourceFile, './' + value.name + 'TaskApi')
          sourceFile.saveSync();

          await fs.unlink(apiPath)
        }
      } else {
        if (value.api) {
          await axios.post('http://localhost:8080/adminapi/v1/templates/file?token=' + getServiceToken(), {
            name: value.name + 'TaskApi.ts',
            data: {
              options: { template: '/packages/protolib/bundles/tasks/templateTaskApi.tpl', variables: { apiRoute: value.apiRoute, name: value.name, capitalizedName: capitalizedName } },
              path: '/packages/app/bundles/custom/apis'
            }
          })
        }
      }

      if (value.api) {
        //link in index.ts
        const sourceFile = getSourceFile(apiIndex)
        addImportToSourceFile(sourceFile, capitalizedName + 'TaskApi', ImportType.NAMED, './' + value.name + 'TaskApi')

        const arg = getDefinition(sourceFile, '"apis"')
        if (!arg) {
          throw "No link definition schema marker found for file: " + path
        }
        addObjectLiteralProperty(arg, value.name, capitalizedName + 'TaskApi')
        sourceFile.saveSync();
      }

      //link in index.ts
      const sourceFile = getSourceFile(indexFile)
      addImportToSourceFile(sourceFile, capitalizedName + 'Task', ImportType.DEFAULT, './' + value.name)

      const arg = getDefinition(sourceFile, '"tasks"')
      if (!arg) {
        throw "No link definition schema marker found for file: " + path
      }
      addObjectLiteralProperty(arg, value.name, capitalizedName + 'Task')
      sourceFile.saveSync();
    },

    async get(key) {
      return JSON.stringify(await getTask(fspath.join(tasksDir, fspath.basename(key) + '.ts')))
    }
  };

  return db;
}