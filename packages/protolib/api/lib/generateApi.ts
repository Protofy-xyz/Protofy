import { connectDB, getDB } from "./db";
import {handler} from './handler'
import fs from 'fs';
import path from 'path';

export const CreateApi = (modelName: string, modelType: any, dir: string, prefix='/api/v1/', dbName?, transformers={}) => {
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


    return (app) => BaseApi(app, modelName, modelType, initialData, prefix, dbName, {
        ...transformers
    })
}

export const BaseApi = (app, entityName, modelClass, initialData, prefix, dbName, transformers) => {
    const dbPath = '../../data/databases/'+(dbName?dbName:entityName)
    connectDB(dbPath, initialData) //preconnect database

    //list
    app.get(prefix + entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath);
        const allResults: any[] = [];
        const itemsPerPage = Math.min(Number(req.query.itemsPerPage) || 10, 100);
        const page = Number(req.query.page) || 0;
        const search = req.query.search;
        const orderBy:string = req.query.orderBy as string;
        const orderDirection = req.query.direction || 'asc';
    
        for await (const [key, value] of db.iterator()) {
            if (key != 'initialized') {
                const model = modelClass.unserialize(value, session);
                const listItem = await model.listTransformed(search, transformers);
    
                if (listItem && model.isVisible()) {
                    allResults.push(listItem);
                }
            }
        }
    

        if (orderBy) {
            allResults.sort((a, b) => {
                if (a[orderBy] > b[orderBy]) return orderDirection === 'asc' ? 1 : -1;
                if (a[orderBy] < b[orderBy]) return orderDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }

        const paginatedResults = allResults.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    
        res.send({
            items: paginatedResults,
            total: allResults.length,
            page: page,
            pages: Math.ceil(allResults.length / itemsPerPage)
        });
    }));

    //create
    app.post(prefix+entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = await (modelClass.load(req.body, session).createTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send(await entityModel.readTransformed(transformers))
    }));

    //read
    app.get(prefix+entityName+'/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        try {
            const note = modelClass.unserialize(await db.get(req.params.key), session)
            if(!note.isVisible()) {
                throw "not found"
            }
            res.send(await note.readTransformed(transformers))
        } catch(e) {
            console.error("Error reading from database: ", e)
            res.status(404).send({result: "not found"})
        }
    }));

    //update
    app.post(prefix+entityName+'/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).updateTransformed(modelClass.load(req.body, session), transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send(await entityModel.readTransformed(transformers))
    }));

    //delete
    app.get(prefix+entityName+'/:key/delete', handler(async (req, res, session) => {
        const db = getDB(dbPath)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).deleteTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        res.send({"result": "deleted"})
    }));
}