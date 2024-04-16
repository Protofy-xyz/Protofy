import { generateEvent } from "../../bundles/events/eventsLibrary";
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { connectDB as _connectDB, getDB as _getDB } from "./db";
import { handler } from './handler'
import fs from 'fs';
import path from 'path';
import { getLogger } from '../../base';

const logger = getLogger()

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

type AutoAPIOptions = {
    modelName: string,
    modelType: any,
    initialData?: Object,
    prefix?: string,
    dbName?: string,
    transformers?: any,
    connectDB?: any,
    getDB?: any,
    operations?: string[],
    single?: boolean,
    disableEvents?: boolean,
    paginatedRead?: { model: any },
    requiresAdmin?: string[],
    extraData?: any,
    logLevel?: string,
    itemsPerPage?: number
    onBeforeList?: Function,
    onAfterList?: Function,
    onBeforeCreate?: Function,
    onAfterCreate?: Function,
    onBeforeRead?: Function,
    onAfterRead?: Function,
    onBeforeUpdate?: Function,
    onAfterUpdate?: Function,
    onBeforeDelete?: Function,
    onAfterDelete?: Function,
    skipDatabaseIndexes?: boolean,
    dbOptions?: {
        batch?: boolean,
        batchLimit?: number,
        batchTimeout?: number
    }
}

export const AutoAPI = ({
    modelName,
    modelType,
    initialData = {},
    prefix = "/api/v1/",
    dbName,
    transformers = {},
    connectDB = _connectDB,
    getDB = _getDB,
    operations = ['create', 'read', 'update', 'delete', 'list'],
    single,
    disableEvents,
    paginatedRead,
    requiresAdmin,
    extraData = {},
    logLevel = 'info',
    itemsPerPage = 25,
    onBeforeList = async (data, session?, req?) => data,
    onAfterList = async (data, session?, req?) => data,
    onBeforeCreate = async (data, session?, req?) => data,
    onAfterCreate = async (data, session?, req?) => data,
    onBeforeRead = async (data, session?, req?) => data,
    onAfterRead = async (data, session?, req?) => data,
    onBeforeUpdate = async (data, session?, req?) => data,
    onAfterUpdate = async (data, session?, req?) => data,
    onBeforeDelete = async (data, session?, req?) => data,
    onAfterDelete = async (data, session?, req?) => data,
    skipDatabaseIndexes,
    dbOptions = {}
}: AutoAPIOptions) => (app, context) => {
    const dbPath = '../../data/databases/' + (dbName ? dbName : modelName)
    connectDB(dbPath, initialData, skipDatabaseIndexes? {} : {
        indexes: modelType.getIndexes(),
        dbOptions: {
            batch: false,
            batchLimit: 100,
            batchTimeout: 5000,
            ...dbOptions
        }     
    }) //preconnect database
    const _list = (req, allResults, _itemsPerPage) => {
        const page = Number(req.query.page) || 0;
        const orderBy: string = req.query.orderBy as string;
        const orderDirection = req.query.orderDirection || 'asc';
        if (orderBy) {
            allResults = allResults.sort((a, b) => {
                if (a[orderBy] > b[orderBy]) return orderDirection === 'asc' ? 1 : -1;
                if (a[orderBy] < b[orderBy]) return orderDirection === 'asc' ? -1 : 1;
                return 0;
            });
        }

        const result = {
            itemsPerPage: _itemsPerPage,
            items: req.query.all ? allResults : allResults.slice(page * _itemsPerPage, (page + 1) * _itemsPerPage),
            total: allResults.length,
            page: req.query.all ? 0 : page,
            pages: req.query.all ? 1 : Math.ceil(allResults.length / _itemsPerPage)
        }
        return result
    }
    //list
    !single && operations.includes('list') && app.get(prefix + modelName, handler(async (req, res, session) => {
        if (requiresAdmin && (requiresAdmin.includes('list') || requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session);
        const allResults: any[] = [];

        const search = req.query.search;
        const filter = req.query.filter;
        const preListData = typeof extraData?.prelist == 'function' ? await extraData.prelist(session, req) : (extraData?.prelist ?? {})
        const parseResult = async (value) => {
            const model = modelType.unserialize(value, session);
            const extraListData = typeof extraData?.list == 'function' ? await extraData.list(session, model, req) : (extraData?.list ?? {})
            const listItem = await model.listTransformed(search, transformers, session, { ...preListData, ...extraListData }, await onBeforeList(req.query, session, req));
            return listItem
        }
        const _itemsPerPage = Math.max(Number(req.query.itemsPerPage) || (itemsPerPage ?? 25), 1);
        if(!search && !filter && !skipDatabaseIndexes && db.hasCapability && db.hasCapability('pagination')) {
            const indexedKeys = await db.getIndexedKeys()
            const total = parseInt(await db.count(), 10)
            const page = Number(req.query.page) || 0;
            const orderBy: string = req.query.orderBy ? req.query.orderBy as string : modelType.getIdField()
            const orderDirection = req.query.orderDirection || 'asc';
            if(indexedKeys.length && indexedKeys.includes(orderBy)) {
                const result = {
                    itemsPerPage:_itemsPerPage,
                    items: await Promise.all((await db.getPageItems(total, orderBy, page, _itemsPerPage, orderDirection)).map(async x => await parseResult(x))),
                    total: total,
                    page: req.query.all ? 0 : page,
                    pages: req.query.all ? 1 : Math.ceil(total / _itemsPerPage)
                }
                res.send(await onAfterList(result, session, req));
                return
            }
        }

        console.log("Using basic retrieval without indexes: ", modelName)

        for await (const [key, value] of db.iterator()) {
            //console.log("***********************key", key, "value ", value)
            const listItem = await parseResult(value)
            if (listItem) {
                allResults.push(listItem);
            }
        }

        res.send(await onAfterList(_list(req, allResults, _itemsPerPage), session, req));
        
    }));

    //create
    operations.includes('create') && app.post(prefix + modelName, handler(async (req, res, session) => {
        if (requiresAdmin && (requiresAdmin.includes('create') || requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelType.load(await onBeforeCreate(req.body, session, req), session).createTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())

        context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('create'), entityModel.getNotificationsPayload())
        if (!disableEvents) {
            generateEvent({
                path: modelName + '/create', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        logger[logLevel ?? 'info']({ data: entityModel.read() }, modelName + " created: " + entityModel.getId())
        res.send(await onAfterCreate(await entityModel.readTransformed(transformers), session, req))
    }));

    //read
    operations.includes('read') && app.get(prefix + modelName + '/:key', handler(async (req, res, session) => {
        if (requiresAdmin && (requiresAdmin.includes('read') || requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)

        try {
            if (paginatedRead) {
                const allResults: any[] = [];

                const search = req.query.search;
                for await (const [key, value] of db.get(req.params.key)) {
                    if (key != 'initialized') {
                        const model = paginatedRead.model.unserialize(await onBeforeRead(value, session, req), session);
                        const listItem = await model.listTransformed(search, transformers);

                        if (listItem) {
                            allResults.push({ ...listItem, _key: key });
                        }
                    }
                }
                res.send(_list(req, await onAfterRead(allResults, session, req), Math.max(Number(req.query.itemsPerPage) || (itemsPerPage ?? 25), 1)))
            } else {
                const item = modelType.unserialize(await onBeforeRead(await db.get(req.params.key), session, req), session)
                const readData = typeof extraData?.read == 'function' ? await extraData.read(session, item, req) : (extraData?.read ?? {})
                res.send(await onAfterRead(await item.readTransformed(transformers, readData), session, req))
            }
        } catch (error) {
            logger.error({ error }, "Error reading from database")
            res.status(404).send({ result: "not found" })
        }
    }));

    //update
    operations.includes('update') && app.post(prefix + modelName + '/:key', handler(async (req, res, session) => {
        if (requiresAdmin && (requiresAdmin.includes('update') || requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelType.unserialize(await db.get(req.params.key), session).updateTransformed(modelType.load(await onBeforeUpdate(req.body, req, session), session), transformers))
        await db.put(entityModel.getId(), entityModel.serialize())

        context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('update'), entityModel.getNotificationsPayload())
        if (!disableEvents) {
            generateEvent({
                path: modelName + '/update', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        logger[logLevel ?? 'info']({ data: entityModel.read() }, modelName + " updated: " + entityModel.getId())
        res.send(await onAfterUpdate(await entityModel.readTransformed(transformers), session, req))
    }));

    //delete
    operations.includes('delete') && app.get(prefix + modelName + '/:key/delete', handler(async (req, res, session) => {
        if (requiresAdmin && (requiresAdmin.includes('delete') || requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }
        
        const db = getDB(dbPath, req, session)
        const rawEntityData = await db.get(req.params.key)
        
        if (!paginatedRead) {
            onBeforeDelete(rawEntityData, session, req)
            await db.del(req.params.key, rawEntityData)
        } else {
            await onBeforeDelete("{}", session, req)
            await db.del(req.params.key, rawEntityData)
        }
        try {
            const entityModel = await modelType.unserialize(rawEntityData, session)
            context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('delete'), entityModel.getNotificationsPayload())
            if (!disableEvents) {
                generateEvent({
                    path: modelName + '/delete', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                    from: 'api', // system entity where the event was generated (next, api, cmd...)
                    user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                    payload: {
                        who: '-', //TODO: wire session in dataview to api,
                        id: entityModel.getId(),
                        data: entityModel.read()
                    } // event payload, event-specific data
                }, getServiceToken())
            }
            logger[logLevel ?? 'info']({ data: entityModel.read() }, modelName + " deleted: " + entityModel.getId())
        } catch (e){
            logger.error({e}, "Error during delete notification")
        }
        
        res.send(await onAfterDelete({ "result": "deleted" }, session, req))
    }));
}