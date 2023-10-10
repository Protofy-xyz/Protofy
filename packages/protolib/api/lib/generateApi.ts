import { connectDB, getDB } from "./db";
import {handler} from './handler'
import fs from 'fs';
import path from 'path';

export const CreateApi = (modelName: string, modelType: any, dir: string, prefix='/api/v1/', dbName?) => {
    let initialData;
    try {
        if(fs.existsSync(path.join(dir, 'initialData.json'))) {
            initialData = JSON.parse(fs.readFileSync(path.join(dir, 'initialData.json')).toString()).map(x => {
                return {
                    key: x.id,
                    value: JSON.stringify(x)
                }
            })
        }
    } catch(e) {
        console.log('Error loading initial data for model ', modelName, 'error: ', e);
        initialData = undefined;
    }


    return (app) => BaseApi(app, modelName, modelType, initialData, prefix, dbName)
}

export const BaseApi = (app, entityName, modelClass, initialData, prefix, dbName?) => {
    const dbPath = '../../data/databases/'+(dbName?dbName:entityName)
    connectDB(dbPath, initialData) //preconnect database

    //list
    app.get(prefix+entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const total: any[] = []
        for await (const [key, value] of db.iterator()) {
            if(key != 'initialized' && modelClass.unserialize(value, session).isVisible()) total.push(modelClass.unserialize(value, session).list())
        }
        res.send(total)
    }));

    //create
    app.post(prefix+entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = modelClass.load(req.body, session).create()
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send(entityModel.read())
    }));

    //read
    app.get(prefix+entityName+'/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        try {
            const note = modelClass.unserialize(await db.get(req.params.key), session)
            if(!note.isVisible()) {
                throw "not found"
            }
            res.send(note.read())
        } catch(e) {
            console.error("Error reading from database: ", e)
            res.status(404).send({result: "not found"})
        }
    }));

    //update
    app.post(prefix+entityName+'/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = modelClass.unserialize(await db.get(req.params.key), session).update(modelClass.load(req.body, session).validate())              
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send(entityModel.read())
    }));

    //delete
    app.get(prefix+entityName+'/:key/delete', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = modelClass.unserialize(await db.get(req.params.key), session).delete()
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send({"result": "deleted"})
    }));
}