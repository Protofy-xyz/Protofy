import { generateEvent } from "../../bundles/events/eventsLibrary";
import {getServiceToken} from 'protolib/api/lib/serviceToken'
import { connectDB, getDB } from "./db";
import { handler } from './handler'
import fs from 'fs';
import path from 'path';

type AutoAPIOptions = {
    modelName: string,
    modelType: any, 
    initialDataDir?: string,
    prefix?:string,
    dbName?:string,
    transformers?: any,
    connectDB?: any,
    getDB?:any,
    operations?: string[],
    single?: boolean,
    disableEvents?: boolean,
    paginatedRead?:boolean,
    requiresAdmin?:string[],
    extraData?:any
}
//CreateAPI contract has evolved into a complex thing, this is a better/alternative wrapper
//that reduces complexity by using a options object 
export const AutoAPI = ({modelName, modelType,initialDataDir,prefix="/api/v1/", dbName, transformers={}, connectDB, getDB, operations, single, disableEvents, paginatedRead, requiresAdmin, extraData = {}}:AutoAPIOptions) => {
    return CreateApi(
        modelName, 
        modelType, 
        initialDataDir,
        prefix,
        dbName,
        transformers,
        connectDB,
        getDB,
        operations,
        single,
        {disableEvents, paginatedRead, requiresAdmin, extraData}
    )
}
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

    return (app, context) => BaseApi(app, modelName, modelType, initialData, prefix, dbName, {
        ...transformers
    }, _connectDB ?? connectDB, _getDB ?? getDB, operations, single, options, context)
}

export const BaseApi = (app, entityName, modelClass, initialData, prefix, dbName, transformers, connectDB, getDB, operations = ['create', 'read', 'update', 'delete', 'list'], single?, options?, context?) => {
    const dbPath = '../../data/databases/' + (dbName ? dbName : entityName)
    connectDB(dbPath, initialData) //preconnect database
    const _list = (req, allResults) => {
        const itemsPerPage = Math.max(Number(req.query.itemsPerPage) || 25, 1);
        const page = Number(req.query.page) || 0;

        const orderBy: string = req.query.orderBy as string;
        const orderDirection = req.query.orderDirection || 'asc';
        if (orderBy) {
            allResults = modelClass.sort(allResults, orderBy, orderDirection)
        }

        const result = {
            items: req.query.all ? allResults : allResults.slice(page * itemsPerPage, (page + 1) * itemsPerPage),
            total: allResults.length,
            page: req.query.all? 0 : page,
            pages: req.query.all ? 1 : Math.ceil(allResults.length / itemsPerPage)
        }
        return result
    }
    //list
    !single && operations.includes('list') && app.get(prefix + entityName, handler(async (req, res, session) => {
        if(options.requiresAdmin && (options.requiresAdmin.includes('list') || options.requiresAdmin.includes('*')) && (!session || !session.user.admin)) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB(dbPath, req, session);
        const allResults: any[] = [];

        const search = req.query.search;
        const preListData = typeof options.extraData?.prelist == 'function' ? await options.extraData.prelist(session, req) : (options.extraData?.prelist ?? {})
        for await (const [key, value] of db.iterator()) {
            if (key != 'initialized') {
                const model = modelClass.unserialize(value, session);
                const extraListData = typeof options.extraData?.list == 'function' ? await options.extraData.list(session, model, req) : (options.extraData?.list ?? {})
                const listItem = await model.listTransformed(search, transformers, session, {...preListData, ...extraListData} );

                if (listItem && model.isVisible()) {
                    allResults.push(listItem);
                }
            }
        }

        res.send(_list(req, allResults));
    }));

    //create
    operations.includes('create') && app.post(prefix + entityName, handler(async (req, res, session) => {
        if(options.requiresAdmin && (options.requiresAdmin.includes('create') || options.requiresAdmin.includes('*')) && (!session || !session.user.admin)) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.load(req.body, session).createTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        context && context.mqtt && context.mqtt.publish("notifications/"+entityName + '/create/' + entityModel.getId(), entityModel.serialize())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/create/' + entityModel.getId(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        res.send(await entityModel.readTransformed(transformers))
    }));

    //read
    operations.includes('read') && app.get(prefix + entityName + '/:key', handler(async (req, res, session) => {
        if(options.requiresAdmin && (options.requiresAdmin.includes('read') || options.requiresAdmin.includes('*')) && (!session || !session.user.admin)) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

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
                const readData = typeof options.extraData?.read == 'function' ? await options.extraData.read(session, item, req) : (options.extraData?.read ?? {})
                res.send(await item.readTransformed(transformers, readData))
            }
        } catch(e) {
            console.error("Error reading from database: ", e)
            res.status(404).send({result: "not found"})
        }
    }));

    //update
    operations.includes('update') && app.post(prefix + entityName + '/:key', handler(async (req, res, session) => {
        if(options.requiresAdmin && (options.requiresAdmin.includes('update') || options.requiresAdmin.includes('*')) && (!session || !session.user.admin)) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).updateTransformed(modelClass.load(req.body, session), transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        context && context.mqtt && context.mqtt.publish("notifications/"+ entityName + '/update/' + entityModel.getId(), entityModel.serialize())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/update/' + entityModel.getId(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        res.send(await entityModel.readTransformed(transformers))
    }));

    //delete
    operations.includes('delete') && app.get(prefix + entityName + '/:key/delete', handler(async (req, res, session) => {
        if(options.requiresAdmin && (options.requiresAdmin.includes('delete') || options.requiresAdmin.includes('*'))&& (!session || !session.user.admin)) {
            res.status(401).send({error: "Unauthorized"})
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).deleteTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        context && context.mqtt && context.mqtt.publish("notifications/"+entityName + '/delete/' + entityModel.getId(), entityModel.serialize())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/delete/' + entityModel.getId(), //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    who: '-', //TODO: wire session in dataview to api,
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        res.send({ "result": "deleted" })
    }));
}