import { TaskRunModel } from "../models/TaskRun";
import {Tasks} from 'app/bundles/tasks'
import { connectDB, handler } from "protolib/api";
import { v4 as uuidv4 } from 'uuid';
import { CreateApi, getImport, getSourceFile, extractChainCalls, addImportToSourceFile, ImportType, addObjectLiteralProperty, getDefinition, removeImportFromSourceFile, removeObjectLiteralProperty } from '../../../api'
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { ArrayLiteralExpression } from 'ts-morph';
import axios from 'axios';
import { TaskModel } from "../models/Task";
import { ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';

const dbPath = '../../data/databases/tasks'

export const runTask = async (name, parameters, session, onDone?, onError?, onNotFound?) => {
    const taskRun = TaskRunModel.load({
        task: name,
        parameters: parameters,
        status: 'running',
        who: session?.user?.id ?? 'guest',
        startDate: new Date().toISOString()
    }).create();

    const db = getDB(dbPath, {}, session);
    await db.put(taskRun.getId(), taskRun.serialize())

    try {
        const task = Tasks[taskRun.get('task')];

        if (task) {
            //run task
            const result = await task(taskRun.get('parameters'));
            db.put(taskRun.getId(), taskRun.toSuccess().serialize())

            if(onDone) onDone(result)
        } else {
            if(onNotFound) onNotFound()
        }
    } catch (err) {
        db.put(taskRun.getId(), taskRun.toError((err as Error).message).serialize())
        if(onError) onError(err)
    }
}

export const TaskApi = (app) => {
    connectDB(dbPath) //preconnect database

    const AutoApi = CreateApi('tasks', TaskModel, __dirname, '/adminapi/v1/', '', {}, () => { }, getDB)
    AutoApi(app)

    app.get('/adminapi/v1/tasks/:name/run', handler(async (req, res, session) => {
        const {token, ...parameters} = req.query
        runTask(req.params.name, parameters, session, 
            (result)=>res.send({result: result}), 
            (err)=>res.status(500).send(`An error occurred: ${(err as Error).message}`),
            ()=>res.status(404).send(`Task ${name} not found.`),
        )
    }
))}

//data layer
const PROJECT_WORKSPACE_DIR = process.env.FILES_ROOT ?? "../../";
const tasksDir = fspath.join(PROJECT_WORKSPACE_DIR,"/packages/app/bundles/custom/tasks/")
const apiDir = fspath.join(PROJECT_WORKSPACE_DIR, "/packages/app/bundles/custom/apis/")
const indexFile = tasksDir + "index.ts"
const apiIndex = fspath.join(apiDir, 'index.ts')

const getTask = async (taskPath) => {
  const sourceFile = getSourceFile(taskPath)
  const node = getDefinition(sourceFile, '"params"')

  const name = fspath.basename(taskPath, fspath.extname(taskPath))
  const apiPath = fspath.join(apiDir, name+'TaskApi.ts')

  
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

  let keys = {}
  if (node) {    
    if (node instanceof ObjectLiteralExpression) {
      node.getProperties().forEach(prop => {
        if (prop instanceof PropertyAssignment) {
          // obj[prop.getName()] = prop.getInitializer().getText();
          const chain = extractChainCalls(prop.getInitializer())
          console.log('chain: ', chain)
          if (chain.length) {
            const typ = chain.shift()
            keys[prop.getName()] = {
              type: typ.name,
              required: chain.find((c => c.name == 'optional')) ? false : true
            }
          }
        }
      });
    }
  }

  return {
    name: name,
    path: 'packages/app/bundles/custom/tasks/',
    hasApi: hasApi,
    apiRoute: apiRoute,
    params: keys
  }
} 

const getDB = (path, req, session) => {
  const db = {
    async *iterator() {
      const files = (await fs.readdir(tasksDir)).filter(f => f != 'index.ts')
      const tasks = await Promise.all(files.map(async f => await getTask(fspath.join(tasksDir, f))));

      for (const task of tasks) {
        if(task) yield [task.name, JSON.stringify(task)];
      }
    },

    async put(key, value) {
        value = JSON.parse(value)
        console.log('value: ', value)
        const capitalizedName = value.name.charAt(0).toUpperCase() + value.name.slice(1)
        const params = "{" + Object.keys(value.params).reduce((total, current, i) => {
            const v = value.params[current]
            return total + "\n\t" + current + ": " + "z." + v.type + "()" + (!value.required?".optional()":"") +","
          }, '').slice(0, -1) + "\n}"
    
        
        console.log('result: ', params)

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
            await axios.post('http://localhost:8080/adminapi/v1/templates/file', {
                name: value.name + '.ts',
                data: {
                options: { template: '/packages/protolib/bundles/tasks/templateTask.tpl', variables: { params: params} },
                path: '/packages/app/bundles/custom/tasks'
                }
            })
        }

        //sync api
        let apiExists
        const apiPath = fspath.join(apiDir, fspath.basename(value.name) + 'taskApi.ts')
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
    
              removeObjectLiteralProperty(arg, value.name+'taskApi')
              removeImportFromSourceFile(sourceFile, './' + value.name+'taskApi')
              sourceFile.saveSync();
    
              await fs.unlink(apiPath)
            }
        } else {
            if (value.api) {
                await axios.post('http://localhost:8080/adminapi/v1/templates/file', {
                name: value.name + '.ts',
                data: {
                    options: { template: '/packages/protolib/bundles/tasks/templateTaskApi.tpl', variables: { apiRoute: value.apiRoute, name: value.name, capitalizedName: capitalizedName } },
                    path: '/packages/app/bundles/custom/apis'
                }
                })
            }

            //link in index.ts
            const sourceFile = getSourceFile(apiIndex)
            addImportToSourceFile(sourceFile, capitalizedName+'TaskApi', ImportType.NAMED, './' + value.name)

            const arg = getDefinition(sourceFile, '"apis"')
            if (!arg) {
                throw "No link definition schema marker found for file: " + path
            }
            addObjectLiteralProperty(arg, value.name, capitalizedName+'TaskApi')
            sourceFile.saveSync();
        }

        //link in index.ts
        const sourceFile = getSourceFile(indexFile)
        addImportToSourceFile(sourceFile, capitalizedName+'Task', ImportType.DEFAULT, './' + value.name)

        const arg = getDefinition(sourceFile, '"tasks"')
        if (!arg) {
            throw "No link definition schema marker found for file: " + path
        }
        addObjectLiteralProperty(arg, value.name, capitalizedName+'Task')
        sourceFile.saveSync();
    },

    async get(key) {
        return JSON.stringify(await getTask(fspath.join(tasksDir, fspath.basename(key)+'.ts')))
    }
  };

  return db;
}