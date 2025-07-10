import { API } from "protobase";
import { handler } from "../lib/handler";
import { getServiceToken } from "./serviceToken";

type AutoActionsParams = {
    modelName: string;
    modelType: any; // should be an instance of AutoModel
    apiUrl?: string;  
    prefix?: string; // where the API for the actions will be created
    object?: string; // what to display to the user in the list view
    notificationsName?: string; // name of the notifications to listen to
    pluralName?: string; // plural name for the model, used in cards and actions
    html?: Record<string, string>; // additional HTML content for cards
}

export const AutoActions = ({
    modelName,
    modelType,
    apiUrl = undefined,
    prefix = "/api/v1/",
    object = undefined,
    notificationsName = undefined,
    pluralName = undefined,
    html = {}
} : AutoActionsParams) => async (app, context) => {
    const plurName = pluralName ?? modelName
    const urlPrefix = apiUrl ?? `${prefix}${modelName}`;
    const actionUrlPrefix = `${prefix}actions/${modelName}`;
    const notiName = notificationsName ?? modelName;

    const getHTML = (name: string, defaultValue?) => {
        if (html[name]) {
            return html[name];
        }
        return defaultValue;
    }

    const loadTotal = async () => {
        try {
            const result = await API.get(`${urlPrefix}?token=${getServiceToken()}`);
            if (result.isLoaded && result.data && result.data.total) {
                context.state.set({ group: 'objects', tag: modelName, name: 'total', value: result.data.total });
                context.state.set({ group: 'objects', tag: modelName, name: 'lastEntries', value: result.data.items });
            }
        } catch (e) {
            console.error("Error loading total for " + modelName, e);
        }
        return 0;
    }
    setTimeout(() => loadTotal(), 1000);

    //exists
    app.get(actionUrlPrefix + '/exists', handler(async (req, res, session) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}?token=${session.token}`);
            if (result.isLoaded) {
                res.json(true);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

    await context.actions.add({
        group: 'objects',
        name: 'exists', //get last path element
        url: actionUrlPrefix + '/exists',
        tag: modelName,
        description: `Check if ${modelName} exists given an id. Returns true if it exists, false otherwise.`,
        params: { id: "id to look for" },
        token: getServiceToken()
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'exists',
        id: 'object_' + modelName + '_exists',
        templateName: 'Check if a ' + modelName + ' exists in the storage',
        defaults: {
            html: getHTML('exists'),
            width: 2,
            height: 8,
            icon: 'file-check',
            displayResponse: true,
            name: `exists ${modelName}`,
            type: 'action',
            description: `Check if ${modelName} exists given an id. Returns true if it exists, false otherwise.`,
            params: {
                id: 'id to look for'
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/exists", userParams)`
        },

        token: getServiceToken()
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'table',
        id: 'object_' + modelName + '_last_table',
        templateName: "Last " + modelName + " table",

        defaults: {
            width: 3,
            height: 8,
            name: "Table",
            icon: "table-properties",
            description: "Displays a table with the last " + plurName,
            type: 'value',
            html: getHTML("last_table", "\n//data contains: data.value, data.icon and data.color\nreturn card({\n    content: cardTable(data.value), padding: '3px'\n});\n"),
            rulesCode: `return states.objects?.${modelName}.lastEntries`
        },

        token: getServiceToken()
    })

    //read
    app.get(actionUrlPrefix + '/read', handler(async (req, res, session) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}?token=${session.token}`);
            if (result.isLoaded) {
                fixValues(result.data, modelType);
                res.json(result.data);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))


    await context.actions.add({
        group: 'objects',
        name: 'read', //get last path element
        url: actionUrlPrefix + '/read',
        tag: modelName,
        description: `Read ${modelName} given an id. Returns an object with the data of the ${modelName} if it exists, false otherwise.`,
        params: { id: `id of the ${modelName} to read` },
        token: getServiceToken(),
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'read',
        id: 'object_' + modelName + '_read',
        templateName: 'Read ' + modelName + ' from the storage',
        defaults: {
            html: getHTML('read'),
            width: 2,
            height: 8,
            icon: 'file-search',
            displayResponse: true,
            name: `read ${modelName}`,
            type: 'action',
            description: `Reads${modelName} given an id. Returns the content of the object if it exists, false otherwise.`,
            params: {
                id: `id of the ${modelName} to read`
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/read", userParams)`
        },

        token: getServiceToken()
    })

    //create
    const fixValues = (params, modelType) => {
        Object.keys(params).forEach((key) => {
            // checkea los tipos de parametros para convetiros a los tipos correctos
            if (modelType.getObjectFieldsDefinition()[key]?.type === 'number') {
                params[key] = Number(params[key]);
            }
            if (modelType.getObjectFieldsDefinition()[key]?.type === 'boolean') {
                params[key] = Boolean(params[key]);
            }
        })
    }

    app.post(actionUrlPrefix + '/create', handler(async (req, res, session) => {
        const params = req.body;
        // console.log("create params: ", JSON.stringify(params));
        fixValues(params, modelType);
        try {
            const result = await API.post(`${urlPrefix}?token=${session.token}`, params);
            // console.log("create result: ", result)
            if (result.isLoaded) {
                res.json(result.data);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

    const def = modelType.getObjectFieldsDefinition()
    const params = Object.keys(def).map((key) => {
        return {
            [key]: def[key].description + " (" + def[key].type + ")" + (def[key].isId ? " (this will be used as the id of the element)" : "")
        }
    }).reduce((acc, val) => ({ ...acc, ...val }), {});

    await context.actions.add({
        group: 'objects',
        name: 'create', //get last path element
        url: actionUrlPrefix + '/create',
        tag: modelName,
        description: `Creates new ${modelName} given an object with the data. Returns the id of the new ${modelName}.`,
        params: params,
        token: getServiceToken(),

        method: 'post'
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'create',
        id: 'object_' + modelName + '_create',
        templateName: 'Create ' + modelName + ' in the storage',
        defaults: {
            html: getHTML('create'),
            width: 2,
            height: 14,
            icon: 'file-plus',
            displayResponse: true,
            name: `create ${modelName}`,
            type: 'action',
            description: `Creates a ${modelName} given its content. Returns the created ${modelName}.`,
            params,
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/create", userParams)`
        },

        token: getServiceToken()
    })

    //delete
    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => {
            loadTotal();
            context.state.set({ group: 'objects', tag: modelName, name: 'lastDeleteddId', value: event?.payload?.id });
        },
        notiName + "/delete/#"
    )
    app.get(actionUrlPrefix + '/delete', handler(async (req, res, session) => {
        const params = req.query;
        const id = params.id;
        try {
            const result = await API.get(`${urlPrefix}/${id}/delete?token=${session.token}`);
            if (result.isLoaded) {
                res.json(true);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

    await context.actions.add({
        group: 'objects',
        name: 'delete', //get last path element
        url: actionUrlPrefix + '/delete',
        tag: modelName,
        description: `Deletes ${modelName} given an id. Returns true if it was deleted, false otherwise.`,
        params: { id: "id of the " + modelName + " to delete" },
        token: getServiceToken()
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'delete',
        id: 'object_' + modelName + '_delete',
        templateName: 'Delete ' + modelName + ' from the storage',
        defaults: {
            width: 2,
            height: 8,
            icon: 'trash',
            displayResponse: true,
            name: `delete ${modelName}`,
            type: 'action',
            html: getHTML('delete'),
            description: `Deletes ${modelName} by id. Returns true if it was deleted, false otherwise.`,
            params: {
                id: 'id of the ' + modelName + ' to delete'
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/delete", userParams)`
        },

        token: getServiceToken()
    })

    //update
    app.get(actionUrlPrefix + '/update', handler(async (req, res, session) => {
        const params = req.query;
        fixValues(params, modelType);
        const id = params.id;
        const field: any = params.field;
        const value = params.value;
        try {
            const result = await API.get(`${urlPrefix}/${id}?token=${params.token ? params.token : session.token}`);
            if (result.isLoaded) {
                const data = result.data;
                data[field] = value;
                const resultUpdate = await API.post(`${urlPrefix}/${id}?token=${params.token ? params.token : session.token}`, data);
                if (resultUpdate.isLoaded) {
                    res.json(resultUpdate.data);
                    return
                }
            }
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

    const updateParams = {
        id: `id of the ${modelName} to update`,
        field: `field to update in the ${modelName}. Possible fields: ${Object.keys(def).join(", ")}`,
        value: `new value for the field`
    }

    await context.actions.add({
        group: 'objects',
        name: 'update', //get last path element
        url: actionUrlPrefix + '/update',
        tag: modelName,
        description: `Updates ${modelName} by id, changing field with a given value. Returns the updated ${modelName} if it was updated, false otherwise.`,
        params: updateParams,
        token: getServiceToken(),
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'update',
        id: 'object_' + modelName + '_update',
        templateName: 'Updates ' + modelName + ' in the storage',
        defaults: {
            html: getHTML('update'),
            width: 2,
            height: 12,
            icon: 'file-pen-line',
            displayResponse: true,
            name: `update ${modelName}`,
            type: 'action',
            description: `Updates a ${modelName} by id, changing field with a given value. Returns the updated ${modelName} if it was updated, false otherwise.`,
            params: updateParams,
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/update", userParams)`
        },

        token: getServiceToken()
    })

    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => {
            loadTotal();
            context.state.set({ group: 'objects', tag: modelName, name: 'lastCreated', value: event?.payload?.data });
            context.state.set({ group: 'objects', tag: modelName, name: 'lastCreatedMetadata', value: event });
            context.state.set({ group: 'objects', tag: modelName, name: 'lastCreatedId', value: event?.payload?.id });
        },
        notiName + "/create/#"
    )

    context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'lastCreated',
        templateName: 'Last created ' + modelName,
        id: 'object_' + modelName + '_lastCreated',
        defaults: {
            html: getHTML('lastCreated'),
            type: "value",
            icon: 'rss',
            name: `lastCreated ${modelName}`,
            description: `Last Created ${modelName}`,
            rulesCode: `return states.objects?.${modelName}.lastCreated;`,
        },

        token: getServiceToken()
    })

    context.events.onEvent(
        context.mqtt,
        context,
        async (event) => {
            context.state.set({ group: 'objects', tag: modelName, name: 'lastUpdated', value: event?.payload?.data });
            context.state.set({ group: 'objects', tag: modelName, name: 'lastUpdatedMetadata', value: event });
            context.state.set({ group: 'objects', tag: modelName, name: 'lastUpdatedId', value: event?.payload?.id });
        },
        notiName + "/update/#"
    )

    context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'lastUpdated',
        templateName: 'Last updated ' + modelName,
        id: 'object_' + modelName + '_lastUpdated',
        defaults: {
            html: getHTML('lastUpdated'),
            type: "value",
            icon: 'rss',
            name: `lastUpdated ${modelName}`,
            description: `Last updated ${modelName}`,
            rulesCode: `return states.objects?.${modelName}.lastUpdated;`,
        },

        token: getServiceToken()
    })

    context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'totalItems',
        templateName: 'Total ' + plurName,
        id: 'object_' + modelName + '_totalitems',
        defaults: {
            html: getHTML('totalItems'),
            type: "value",
            icon: 'boxes',
            name: `Total ${plurName}`,
            description: `Total ${plurName}`,
            rulesCode: `return states.objects?.${modelName}.total;`,
        },

        token: getServiceToken()
    })

    app.get(actionUrlPrefix + '/list', handler(async (req, res, session) => {
        const params = req.query;
        const itemsPerPage = params.itemsPerPage;
        const page = params.page
        const search = params.search;
        const orderBy = params.orderBy;
        const orderDirection = params.orderDirection;

        const finalUrl = `${urlPrefix}?token=${session.token}&${itemsPerPage ? `itemsPerPage=${itemsPerPage}` : ''}${page ? `&page=${page}` : ''}${search ? `&search=${search}` : ''}${orderBy ? `&orderBy=${orderBy}` : ''}${orderDirection ? `&orderDirection=${orderDirection}` : ''}`;
        try {
            const result = await API.get(finalUrl);
            if (result.isLoaded) {
                // fixValues(result.data, modelType);
                res.json(result.data.items);
                return
            }
            res.json(false);
            return
        } catch (e) {
            res.status(500).json(false);
            return
        }
    }))

    await context.actions.add({
        group: 'objects',
        name: 'list', //get last path element
        url: actionUrlPrefix + '/list',
        tag: modelName,
        description: `Returns a list of ${modelName} objects. You can filter the results by passing itemsPerPage, page, search, orderBy and orderDirection parameters.`,
        params: {
            itemsPerPage: 'number of items per page (optional)',
            page: 'page number to retrieve (optional)',
            search: 'search term to filter the results (optional)',
            orderBy: 'field to order the results by (optional)',
            orderDirection: 'direction to order the results by (asc or desc) (optional)'
        },
        token: getServiceToken(),
    })

    await context.cards.add({
        group: 'objects',
        tag: modelName,
        name: 'list',
        id: 'object_' + modelName + '_list',
        templateName: modelName + ' storage',
        defaults: {
            width: 4,
            height: 10,
            icon: 'search',
            displayResponse: true,
            name: `list ${modelName}`,
            html: getHTML("list", "return dataView('" + (object ?? modelName) + "', data.domId)"),
            type: 'action',
            description: `Returns a list of ${modelName} objects. You can filter the results by passing itemsPerPage, page, search, orderBy and orderDirection parameters.`,
            params: {
                itemsPerPage: 'number of items per page (optional)',
                page: 'page number to retrieve (optional)',
                search: 'search term to filter the results (optional)',
                orderBy: 'field to order the results by (optional)',
                orderDirection: 'direction to order the results by (asc or desc) (optional)'
            },
            rulesCode: `return execute_action("/api/v1/actions/${modelName}/list", userParams)`
        },
        token: getServiceToken(),
        emitEvent: true
    })
}