import { TaskRunModel } from "../models/TaskRun";
import {Tasks} from 'app/bundles/tasks'
import { AutoAPI, getDB } from '../../../api'
import { generateEvent } from 'app/bundles/library'
import {getServiceToken} from 'protolib/api/lib/serviceToken'

const dbPath = '../../data/databases/taskRuns'

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
            generateEvent({
                path: 'tasks/run/'+name, //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session?.user?.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {task: taskRun.getData()} // event payload, event-specific data
            }, getServiceToken())
            //run task
            const result = await task(taskRun.get('parameters'));
            db.put(taskRun.getId(), taskRun.toSuccess().serialize())
            generateEvent({
                path: 'tasks/done/'+name, //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session?.user?.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {task: taskRun.getData()} // event payload, event-specific data
            }, getServiceToken())
            if(onDone) onDone(result)
        } else {
            generateEvent({
                path: 'tasks/error/'+name, //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session?.user?.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {task: taskRun.getData(), error: 'notfound'} // event payload, event-specific data
            }, getServiceToken())
            if(onNotFound) onNotFound()
        }
    } catch (err) {
        generateEvent({
            path: 'tasks/error/'+name, //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
            from: 'api', // system entity where the event was generated (next, api, cmd...)
            user: session?.user?.id, // the original user that generates the action, 'system' if the event originated in the system itself
            payload: {task: taskRun.getData(), error: err.message} // event payload, event-specific data
        }, getServiceToken())
        db.put(taskRun.getId(), taskRun.toError((err as Error).message).serialize())
        if(onError) onError(err)
    }
}

export const TaskRunApi = AutoAPI({
    modelName: 'taskruns',
    modelType: TaskRunModel,
    initialDataDir: __dirname,
    prefix: '/adminapi/v1/',
    getDB: getDB,
    requiresAdmin: ['*'],
    // extraData: {
    //   prelist: async (session) => {
    //     const companies = await API.get('/adminapi/v1/companies?itemsPerPage=1000')
    //     const company = await companies?.data?.items.find(i => i.email == session.user.id)
    //     return {
    //       company
    //     }
    //   }
    // }
  })


