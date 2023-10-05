import { connectDB, getDB } from "./db";
import {handler} from './handler'
import fs from 'fs';
import path from 'path';

export const CreateApi = (modelName: string, modelType: any, dir: string) => {
    const initialData = JSON.parse(fs.readFileSync(path.join(dir, 'initialData.json')).toString()).map(x => {
        return {
            key: x.id,
            value: JSON.stringify(x)
        }
    })

    return (app) => BaseApi(app, modelName, modelType, initialData)
}

export const BaseApi = (app, entityName, modelClass, initialData) => {
    const dbPath = '../../data/databases/'+entityName
    connectDB(dbPath, initialData) //preconnect database

    //list
    app.get('/api/v1/'+entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const total: any[] = []
        for await (const [key, value] of db.iterator()) {
            if(key != 'initialized' && modelClass.unserialize(value, session).isVisible()) total.push(modelClass.unserialize(value, session).list())
        }
        res.send(total)
    }));

    //create
    app.post('/api/v1/'+entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = modelClass.load(req.body, session).create()
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send(entityModel.read())
    }));

    //read
    app.get('/api/v1/'+entityName+'/:key', handler(async (req, res, session) => {
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
    app.post('/api/v1/'+entityName+'/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = modelClass.unserialize(await db.get(req.params.key), session).update(modelClass.load(req.body, session).validate())              
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send(entityModel.read())
    }));

    //delete
    app.get('/api/v1/'+entityName+'/:key/delete', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = modelClass.unserialize(await db.get(req.params.key), session).delete()
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send({"result": "deleted"})
    }));
}