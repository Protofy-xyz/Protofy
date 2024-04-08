import { generateEvent } from "../../bundles/events/eventsLibrary";
import { getServiceToken } from 'protolib/api/lib/serviceToken'
import { connectDB, getDB } from "./db";
import { handler } from './handler'
import fs from 'fs';
import path from 'path';
import { getLogger } from '../../base';

const logger = getLogger()

type AutoAPIOptions = {
    modelName: string,
    modelType: any,
    initialDataDir?: string,
    prefix?: string,
    dbName?: string,
    transformers?: any,
    connectDB?: any,
    getDB?: any,
    operations?: string[],
    single?: boolean,
    disableEvents?: boolean,
    paginatedRead?: {model:any},
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
    onAfterDelete?: Function
}
//CreateAPI contract has evolved into a complex thing, this is a better/alternative wrapper
//that reduces complexity by using a options object 
export const AutoAPI = ({
    modelName,
    modelType,
    initialDataDir,
    prefix = "/api/v1/",
    dbName,
    transformers = {},
    connectDB,
    getDB,
    operations,
    single,
    disableEvents,
    paginatedRead,
    requiresAdmin,
    extraData = {},
    logLevel = 'info',
    itemsPerPage = 25,
    onBeforeList,
    onAfterList,
    onBeforeCreate,
    onAfterCreate,
    onBeforeRead,
    onAfterRead,
    onBeforeUpdate,
    onAfterUpdate,
    onBeforeDelete,
    onAfterDelete
}: AutoAPIOptions) => {
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
        {
            disableEvents,
            paginatedRead,
            requiresAdmin,
            extraData,
            logLevel,
            itemsPerPage,
            onBeforeList,
            onAfterList,
            onBeforeCreate,
            onAfterCreate,
            onBeforeRead,
            onAfterRead,
            onBeforeUpdate,
            onAfterUpdate,
            onBeforeDelete,
            onAfterDelete
        }
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
                    logger.debug({ x }, `loading: ${JSON.stringify(x)}`)
                    const element = modelType.load(x).create()
                    return {
                        key: element.getId(),
                        value: element.serialize()
                    }
                } catch (error) {
                    logger.error({ modelName, error }, "Error inserting initialData")
                }
            }).filter(x => x)
        }
    } catch (error) {
        logger.error({ modelName, error }, "Error loading initial data")
        initialData = undefined;
    }

    return (app, context) => BaseApi(app, modelName, modelType, initialData, prefix, dbName, {
        ...transformers
    }, _connectDB ?? connectDB, _getDB ?? getDB, operations, single, options, context)
}

export const BaseApi = (app, entityName, modelClass, initialData, prefix, dbName, transformers, connectDB, getDB, operations = ['create', 'read', 'update', 'delete', 'list'], single?, options?, context?) => {
    const onBeforeList = options && options['onBeforeList'] ? options['onBeforeList'] : async (data, session?, req?) => data
    const onAfterList = options && options['onAfterList'] ? options['onAfterList'] : async (data, session?, req?) => data
    const onBeforeCreate = options && options['onBeforeCreate'] ? options['onBeforeCreate'] : async (data, session?, req?) => data
    const onAfterCreate = options && options['onAfterCreate'] ? options['onAfterCreate'] : async (data, session?, req?) => data
    const onBeforeRead = options && options['onBeforeRead'] ? options['onBeforeRead'] : async (data, session?, req?) => data
    const onAfterRead = options && options['onAfterRead'] ? options['onAfterRead'] : async (data, session?, req?) => data
    const onBeforeUpdate = options && options['onBeforeUpdate'] ? options['onBeforeUpdate'] : async (data, session?, req?) => data
    const onAfterUpdate = options && options['onAfterUpdate'] ? options['onAfterUpdate'] : async (data, session?, req?) => data
    const onBeforeDelete = options && options['onBeforeDelete'] ? options['onBeforeDelete'] : async (data, session?, req?) => data
    const onAfterDelete = options && options['onAfterDelete'] ? options['onAfterDelete'] : async (data, session?, req?) => data

    const dbPath = '../../data/databases/' + (dbName ? dbName : entityName)
    connectDB(dbPath, initialData) //preconnect database
    const _list = (req, allResults) => {
        const itemsPerPage = Math.max(Number(req.query.itemsPerPage) || (options.itemsPerPage ?? 25), 1);
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
            itemsPerPage: itemsPerPage,
            items: req.query.all ? allResults : allResults.slice(page * itemsPerPage, (page + 1) * itemsPerPage),
            total: allResults.length,
            page: req.query.all ? 0 : page,
            pages: req.query.all ? 1 : Math.ceil(allResults.length / itemsPerPage)
        }
        return result
    }
    //list
    !single && operations.includes('list') && app.get(prefix + entityName, handler(async (req, res, session) => {
        if (options.requiresAdmin && (options.requiresAdmin.includes('list') || options.requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
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
                const listItem = await model.listTransformed(search, transformers, session, { ...preListData, ...extraListData }, await onBeforeList(req.query, session, req));

                if (listItem && model.isVisible()) {
                    allResults.push(listItem);
                }
            }
        }

        res.send(await onAfterList(_list(req, allResults), session, req));
    }));

    //create
    operations.includes('create') && app.post(prefix + entityName, handler(async (req, res, session) => {
        if (options.requiresAdmin && (options.requiresAdmin.includes('create') || options.requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.load(await onBeforeCreate(req.body, session, req), session).createTransformed(transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('create'), entityModel.getNotificationsPayload())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/create', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        logger[options.logLevel ?? 'info']({ data: entityModel.read() }, entityName + " created: " + entityModel.getId())
        res.send(await onAfterCreate(await entityModel.readTransformed(transformers), session, req))
    }));

    //read
    operations.includes('read') && app.get(prefix + entityName + '/:key', handler(async (req, res, session) => {
        if (options.requiresAdmin && (options.requiresAdmin.includes('read') || options.requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)

        try {
            if (options.paginatedRead) {
                const allResults: any[] = [];

                const search = req.query.search;
                for await (const [key, value] of db.get(req.params.key)) {
                    if (key != 'initialized') {
                        const model = options.paginatedRead.model.unserialize(await onBeforeRead(value, session, req), session);
                        const listItem = await model.listTransformed(search, transformers);

                        if (listItem && model.isVisible()) {
                            allResults.push({ ...listItem, _key: key });
                        }
                    }
                }
                res.send(_list(req, await onAfterRead(allResults, session, req)))
            } else {
                const item = modelClass.unserialize(await onBeforeRead(await db.get(req.params.key), session, req), session)
                if (!item.isVisible()) {
                    throw "not found"
                }
                const readData = typeof options.extraData?.read == 'function' ? await options.extraData.read(session, item, req) : (options.extraData?.read ?? {})
                res.send(await onAfterRead(await item.readTransformed(transformers, readData), session, req))
            }
        } catch (error) {
            logger.error({ error }, "Error reading from database")
            res.status(404).send({ result: "not found" })
        }
    }));

    //update
    operations.includes('update') && app.post(prefix + entityName + '/:key', handler(async (req, res, session) => {
        if (options.requiresAdmin && (options.requiresAdmin.includes('update') || options.requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)
        const entityModel = await (modelClass.unserialize(await db.get(req.params.key), session).updateTransformed(modelClass.load(await onBeforeUpdate(req.body, req, session), session), transformers))
        await db.put(entityModel.getId(), entityModel.serialize())
        context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('update'), entityModel.getNotificationsPayload())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/update', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }
        logger[options.logLevel ?? 'info']({ data: entityModel.read() }, entityName + " updated: " + entityModel.getId())
        res.send(await onAfterUpdate(await entityModel.readTransformed(transformers), session, req))
    }));

    //delete
    operations.includes('delete') && app.get(prefix + entityName + '/:key/delete', handler(async (req, res, session) => {
        if (options.requiresAdmin && (options.requiresAdmin.includes('delete') || options.requiresAdmin.includes('*')) && (!session || !session?.user?.admin)) {
            res.status(401).send({ error: "Unauthorized" })
            return
        }

        const db = getDB(dbPath, req, session)
        let entityModel
        if (!options.paginatedRead) {
            entityModel = await (modelClass.unserialize(await onBeforeDelete(await db.get(req.params.key), session, req), session).deleteTransformed(transformers))
            await db.put(entityModel.getId(), entityModel.serialize())
        } else {
            entityModel = modelClass.unserialize(await onBeforeDelete("{}", session, req)).delete()
            await db.put(req.params.key, entityModel.serialize())
        }



        context && context.mqtt && context.mqtt.publish(entityModel.getNotificationsTopic('delete'), entityModel.getNotificationsPayload())
        if (!options.disableEvents) {
            generateEvent({
                path: entityName + '/delete', //event type: / separated event category: files/create/file, files/create/dir, devices/device/online
                from: 'api', // system entity where the event was generated (next, api, cmd...)
                user: session.user.id, // the original user that generates the action, 'system' if the event originated in the system itself
                payload: {
                    who: '-', //TODO: wire session in dataview to api,
                    id: entityModel.getId(),
                    data: entityModel.read()
                } // event payload, event-specific data
            }, getServiceToken())
        }

        logger[options.logLevel ?? 'info']({ data: entityModel.read() }, entityName + " deleted: " + entityModel.getId())
        res.send(await onAfterDelete({ "result": "deleted" }, session, req))
    }));
}
