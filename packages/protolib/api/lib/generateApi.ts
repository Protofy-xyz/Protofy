import { generateEvent } from "../../bundles/events/eventsLibrary";
import { connectDB, getDB } from "./db";
import { handler } from './handler'
import fs from 'fs';
import path from 'path';
import { mqttClient } from "./mqtt";
/*
    modelName: name of the model, used to generate api urls. for example, if model name is 'test' and prefix is '/api/v1/', then to read an item is: /api/v1/test
                the separation from prefix is to allow less parameters for the default scenario (so you dont to write /api/v1/ all the time)
    modelType: a class to interact with the data returned by the storage
    dir: the directory where your api is located. Used to load initialData.json if it exists
    prefix: exaplined in modelName
    dbName: name of the database, used by the storage engine
    transformers: a key->value object with transformations, invocable from the schema. See protolib/bundles/users
    _connectDB: function used by the api to preconnect the database. Its optional, used to provide your own database implementation
    _getDB: function used by the api to retrieve the database object to interact with the database. Its optional, used to provide your own database implementation (json...)
    operations: list of provided operations, by default ['create', 'read', 'update', 'delete', 'list']
    single: most apis are used to expose a list of things. Single means a single entity, not a list of things. So /api/v1/test returns the entity, not a list of things
*/
export const CreateApi = (modelName: string, modelType: any, dir: string, prefix = '/api/v1/', dbName?, transformers = {}, _connectDB?, _getDB?, operations?, single?, options = {}) => {
    let initialData;
    try {
        if (fs.existsSync(path.join(dir, 'initialData.json'))) {
            initialData = JSON.parse(fs.readFileSync(path.join(dir, 'initialData.json')).toString()).map(x => {
                try {
                    //console.log('loading: ', x)
                    const element = modelType.load(x).create()
                    return {
                        key: element.getId(),
                        value: element.serialize()
                    }
                } catch (e) {
                    console.log('Error inserting initialData for: ', modelName)
                    console.log('Erro: ', e)
                }
            }).filter(x => x)
        }
    } catch (e) {
        console.log('Error loading initial data for model ', modelName, 'error: ', e);
        initialData = undefined;
    }

    return (app) => BaseApi(app, modelName, modelType, initialData, prefix, dbName, {
        ...transformers
    }, _connectDB ?? connectDB, _getDB ?? getDB, operations, single, options)
}

export const BaseApi = (app, entityName, modelClass, initialData, prefix, dbName, transformers, connectDB, getDB, operations = ['create', 'read', 'update', 'delete', 'list'], single?, options?) => {
    const dbPath = '../../data/databases/' + (dbName ? dbName : entityName)
    connectDB(dbPath, initialData) //preconnect database
    const _list = (req, allResults) => {
        const itemsPerPage = Math.max(Number(req.query.itemsPerPage) || 10, 1);
        const page = Number(req.query.page) || 0;

        const orderBy: string = req.query.orderBy as string;
        const orderDirection = req.query.orderDirection || 'asc';
        if (orderBy) {
            allResults.sort((a, b) => {
                if (a[orderBy] > b[orderBy]) return orderDirection === 'asc' ? 1 : -1;
                if (a[orderBy] < b[orderBy]) return orderDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }

        const paginatedResults = allResults.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
        const result = {
            items: paginatedResults,
            total: allResults.length,
            page: page,
            pages: Math.ceil(allResults.length / itemsPerPage)
        }
        return result
    }
    //list
    !single && operations.includes('list') && app.get(prefix + entityName, handler(async (req, res, session) => {
        //console.log('session: ', session)
        const db = getDB(dbPath, req, session);
        const allResults: any[] = [];

        const search = req.query.search;
        for await (const [key, value] of db.iterator()) {
            if (key != 'initialized') {
                const model = modelClass.unserialize(value, session);
                const listItem = await model.listTransformed(search, transformers);

                if (listItem && model.isVisible()) {
                    allResults.push(listItem);
                }
            }
        }

        res.send(_list(req, allResults));
    }));

    //create
    operations.includes('create') && app.post(prefix + entityName, handler(async (req, res, session) => {
        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.load(req.body, session).createTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        mqttClient.publish("notifications/"+entityName + '/create/' + entityModel.getId(), entityModel.serialize())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/create/' + entityModel.getId(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    who: '-', //TODO: wire session in dataview to api,
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            })
        }
        res.send(await entityModel.readTransformed(transformers))
    }));

    //read
    operations.includes('read') && app.get(prefix + entityName + '/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath, req, session)

        try {
            if (options.paginatedRead) {
                const allResults: any[] = [];

                const search = req.query.search;
                for await (const [key, value] of db.get(req.params.key)) {
                    if (key != 'initialized') {
                        const model = options.paginatedRead.model.unserialize(value, session);
                        const listItem = await model.listTransformed(search, transformers);

                        if (listItem && model.isVisible()) {
                            allResults.push({ ...listItem, _key: key });
                        }
                    }
                }
                res.send(_list(req, allResults))
            } else {
                const item = modelClass.unserialize(await db.get(req.params.key), session)
                if (!item.isVisible()) {
                    throw "not found"
                }
                res.send(await item.readTransformed(transformers))
            }
        } catch(e) {
            console.error("Error reading from database: ", e)
            res.status(404).send({result: "not found"})
        }
    }));

    //update
    operations.includes('update') && app.post(prefix + entityName + '/:key', handler(async (req, res, session) => {
        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).updateTransformed(modelClass.load(req.body, session), transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        mqttClient.publish("notifications/"+ entityName + '/update/' + entityModel.getId(), entityModel.serialize())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/update/' + entityModel.getId(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    who: '-', //TODO: wire session in dataview to api,
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            })
        }
        res.send(await entityModel.readTransformed(transformers))
    }));

    //delete
    operations.includes('delete') && app.get(prefix + entityName + '/:key/delete', handler(async (req, res, session) => {
        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).deleteTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        mqttClient.publish("notifications/"+entityName + '/delete/' + entityModel.getId(), entityModel.serialize())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/delete/' + entityModel.getId(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: 'system', // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    who: '-', //TODO: wire session in dataview to api,
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            })
        }
        res.send({ "result": "deleted" })
    }));
}