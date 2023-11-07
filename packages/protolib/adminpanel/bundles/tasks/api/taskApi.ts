import { TaskRunModel } from "../models/TaskRun";
import {Tasks} from 'app/bundles/tasks'
import { connectDB, getDB, handler } from "protolib/api";
import { v4 as uuidv4 } from 'uuid';

export const TaskApi = (app) => {
    const dbPath = '../../data/databases/tasks'
    connectDB(dbPath) //preconnect database

    app.get('/adminapi/v1/tasks/:name/run', handler(async (req, res, session) => {
        const {token, ...parameters} = req.query
        const taskRun = TaskRunModel.load({
            task: req.params.name,
            parameters: parameters,
            status: 'running',
            who: session?.user?.id ?? 'guest',
            startDate: new Date().toISOString()
        }).create();
        const db = getDB(dbPath, req, session);
        await db.put(taskRun.getId(), taskRun.serialize())

        try {
            const task = Tasks[taskRun.get('task')];

            if (task) {
                //run task
                const result = await task(taskRun.get('parameters'));
                db.put(taskRun.getId(), taskRun.toSuccess().serialize())

                res.send({result: result});
            } else {
                res.status(404).send(`Task ${req.params.name} not found.`);
            }
        } catch (err) {
            db.put(taskRun.getId(), taskRun.toError((err as Error).message).serialize())
            res.status(500).send(`An error occurred: ${(err as Error).message}`);
        }
    }
))}