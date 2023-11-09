import { TaskRunModel } from "../models/TaskRun";
import {Tasks} from 'app/bundles/tasks'
import { getDB } from '../../../api'

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
